import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TIKTOK_EVENTS_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/";
const PIXEL_CODE = "D7A3J63C77UFKKV37R00";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TIKTOK_ACCESS_TOKEN = Deno.env.get("TIKTOK_ACCESS_TOKEN");
    if (!TIKTOK_ACCESS_TOKEN) {
      throw new Error("TIKTOK_ACCESS_TOKEN is not configured");
    }

    const { event, event_id, properties, user } = await req.json();

    if (!event) {
      return new Response(
        JSON.stringify({ error: "Event name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const timestamp = new Date().toISOString();

    const payload = {
      pixel_code: PIXEL_CODE,
      partner_name: "Lovable",
      test_event_code: undefined,
      data: [
        {
          event,
          event_id: event_id || crypto.randomUUID(),
          event_time: Math.floor(Date.now() / 1000),
          user: {
            ...(user?.email ? { email: user.email } : {}),
            ...(user?.phone ? { phone_number: user.phone } : {}),
            ...(user?.ip ? { ip: user.ip } : {}),
            ...(user?.user_agent ? { user_agent: user.user_agent } : {}),
          },
          properties: properties || {},
        },
      ],
    };

    // Remove undefined fields
    if (!payload.test_event_code) delete payload.test_event_code;

    const response = await fetch(TIKTOK_EVENTS_URL, {
      method: "POST",
      headers: {
        "Access-Token": TIKTOK_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log("TikTok Events API response:", JSON.stringify(data));

    return new Response(JSON.stringify(data), {
      status: response.ok ? 200 : response.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in tiktok-event:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
