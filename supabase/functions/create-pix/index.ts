import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PUSHINPAY_API_URL = "https://api.pushinpay.com.br/api/pix/cashIn";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PUSHINPAY_API_TOKEN = Deno.env.get("PUSHINPAY_API_TOKEN");
    if (!PUSHINPAY_API_TOKEN) {
      throw new Error("PUSHINPAY_API_TOKEN is not configured");
    }

    const { value, webhook_url } = await req.json();

    if (!value || typeof value !== "number" || value < 50) {
      return new Response(
        JSON.stringify({ error: "Valor mínimo é 50 centavos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: Record<string, unknown> = { value };
    if (webhook_url) {
      body.webhook_url = webhook_url;
    }

    const response = await fetch(PUSHINPAY_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PUSHINPAY_API_TOKEN}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("PushInPay error:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "Erro ao criar cobrança Pix", details: data }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data), {
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
