import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PUSHINPAY_API_URL = "https://api.pushinpay.com.br/api/transaction";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PUSHINPAY_API_TOKEN = Deno.env.get("PUSHINPAY_API_TOKEN");
    if (!PUSHINPAY_API_TOKEN) {
      throw new Error("PUSHINPAY_API_TOKEN is not configured");
    }

    const url = new URL(req.url);
    const transactionId = url.searchParams.get("id");

    if (!transactionId) {
      return new Response(
        JSON.stringify({ error: "ID da transação é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try both endpoint variants
    let response = await fetch(`${PUSHINPAY_API_URL}/${transactionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PUSHINPAY_API_TOKEN}`,
        Accept: "application/json",
      },
    });

    let data = await response.json();
    console.log("check-pix response:", JSON.stringify(data));

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Erro ao consultar transação", details: data }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data), {
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
