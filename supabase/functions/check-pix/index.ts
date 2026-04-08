import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BLACKCATPAY_API_URL = "https://api.blackcatpay.com.br/api/sales";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const BLACKCATPAY_SECRET_KEY = Deno.env.get("BLACKCATPAY_SECRET_KEY");
    if (!BLACKCATPAY_SECRET_KEY) {
      throw new Error("BLACKCATPAY_SECRET_KEY is not configured");
    }

    const url = new URL(req.url);
    const transactionId = url.searchParams.get("id");

    if (!transactionId) {
      return new Response(
        JSON.stringify({ error: "ID da transação é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch(`${BLACKCATPAY_API_URL}/${transactionId}/status`, {
      method: "GET",
      headers: {
        "X-API-Key": BLACKCATPAY_SECRET_KEY,
      },
    });

    const data = await response.json();
    console.log("check-pix response:", JSON.stringify(data));

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Erro ao consultar transação", details: data }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normalize: BlackCatPay returns status as PENDING/PAID/CANCELLED/REFUNDED
    const rawStatus = data.data?.status || data.status || "PENDING";
    const statusMap: Record<string, string> = {
      PENDING: "pending",
      PAID: "paid",
      CANCELLED: "cancelled",
      REFUNDED: "refunded",
    };

    return new Response(JSON.stringify({
      status: statusMap[rawStatus] || rawStatus.toLowerCase(),
      transactionId: data.data?.transactionId || transactionId,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in check-pix:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
