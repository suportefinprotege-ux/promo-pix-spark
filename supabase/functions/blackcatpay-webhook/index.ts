import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("BlackCatPay webhook received:", JSON.stringify(body));

    // BlackCatPay sends: transactionId, status, amount, paidAt, etc.
    const transactionId = body.transactionId || body.data?.transactionId;
    const status = body.status || body.data?.status;
    const paidAt = body.paidAt || body.data?.paidAt;

    if (!transactionId || !status) {
      console.error("Missing transactionId or status in webhook payload");
      return new Response(
        JSON.stringify({ error: "Missing transactionId or status" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus !== "paid") {
      console.log(`Transaction ${transactionId} status: ${normalizedStatus} — ignoring`);
      return new Response(
        JSON.stringify({ success: true, message: "Status ignored" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update order in database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("id, payment_status")
      .eq("pix_transaction_id", transactionId)
      .maybeSingle();

    if (findError) {
      console.error("Error finding order:", findError);
      return new Response(
        JSON.stringify({ error: "Database error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!order) {
      console.warn(`No order found for transactionId: ${transactionId}`);
      return new Response(
        JSON.stringify({ success: true, message: "No matching order" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (order.payment_status === "paid") {
      console.log(`Order ${order.id} already paid`);
      return new Response(
        JSON.stringify({ success: true, message: "Already paid" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        paid_at: paidAt || new Date().toISOString(),
      })
      .eq("id", order.id)
      .eq("payment_status", "pending");

    if (updateError) {
      console.error("Error updating order:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Order ${order.id} marked as paid via webhook`);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
