import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BLACKCATPAY_API_URL = "https://api.blackcatpay.com.br/api/sales/create-sale";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const BLACKCATPAY_SECRET_KEY = Deno.env.get("BLACKCATPAY_SECRET_KEY");
    if (!BLACKCATPAY_SECRET_KEY) {
      throw new Error("BLACKCATPAY_SECRET_KEY is not configured");
    }

    const { value, customer, items, shipping } = await req.json();

    if (!value || typeof value !== "number" || value < 50) {
      return new Response(
        JSON.stringify({ error: "Valor mínimo é 50 centavos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const postbackUrl = `${supabaseUrl}/functions/v1/blackcatpay-webhook`;

    const body: Record<string, unknown> = {
      amount: value,
      currency: "BRL",
      paymentMethod: "pix",
      postbackUrl,
      items: items || [
        {
          title: "Pedido",
          unitPrice: value,
          quantity: 1,
          tangible: true,
        },
      ],
      customer: customer || {
        name: "Cliente",
        email: "cliente@email.com",
        phone: "00000000000",
        document: { number: "00000000000", type: "cpf" },
      },
      pix: { expiresInDays: 1 },
    };

    if (shipping) {
      body.shipping = shipping;
    }

    console.log("BlackCatPay request body:", JSON.stringify(body));

    const response = await fetch(BLACKCATPAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": BLACKCATPAY_SECRET_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("BlackCatPay response:", JSON.stringify(data));

    if (!response.ok || !data.success) {
      return new Response(
        JSON.stringify({ error: "Erro ao criar cobrança Pix", details: data }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normalize response to match frontend expectations
    const normalized = {
      id: data.data.transactionId,
      qr_code: data.data.paymentData?.copyPaste || data.data.paymentData?.qrCode || "",
      qr_code_base64: data.data.paymentData?.qrCodeBase64 || "",
      status: data.data.status?.toLowerCase() || "pending",
    };

    return new Response(JSON.stringify(normalized), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in create-pix:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
