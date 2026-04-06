import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Server-side product catalog — single source of truth for pricing
const PRODUCT_PRICE_CENTS = 4790;
const SHIPPING_OPTIONS: Record<string, number> = {
  loggi: 2687,
};
const MAX_QUANTITY = 3;

function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  return digits.length === 11;
}

function validateCEP(cep: string): boolean {
  const digits = cep.replace(/\D/g, "");
  return digits.length === 8;
}

function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 11;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { name, email, phone, cpf, cep, endereco, numero, bairro, cidade, estado, quantity, shipping_method, pix_transaction_id } = body;

    // Validate required fields
    const errors: string[] = [];

    if (!name || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 200) {
      errors.push("Nome inválido");
    }
    if (email && !validateEmail(email)) {
      errors.push("Email inválido");
    }
    if (!phone || !validatePhone(phone)) {
      errors.push("Telefone inválido");
    }
    if (!cpf || !validateCPF(cpf)) {
      errors.push("CPF inválido (deve ter 11 dígitos)");
    }
    if (!cep || !validateCEP(cep)) {
      errors.push("CEP inválido (deve ter 8 dígitos)");
    }
    if (!endereco || typeof endereco !== "string" || endereco.trim().length < 2) {
      errors.push("Endereço inválido");
    }
    if (!numero || typeof numero !== "string" || numero.trim().length < 1) {
      errors.push("Número inválido");
    }
    if (!bairro || typeof bairro !== "string" || bairro.trim().length < 1) {
      errors.push("Bairro inválido");
    }
    if (!cidade || typeof cidade !== "string" || cidade.trim().length < 1) {
      errors.push("Cidade inválida");
    }
    if (!estado || typeof estado !== "string" || estado.trim().length !== 2) {
      errors.push("Estado inválido");
    }

    // Validate quantity
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QUANTITY) {
      errors.push(`Quantidade deve ser entre 1 e ${MAX_QUANTITY}`);
    }

    // Validate shipping method
    if (!shipping_method || !(shipping_method in SHIPPING_OPTIONS)) {
      errors.push("Método de envio inválido");
    }

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ error: "Dados inválidos", details: errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Server-side price computation — never trust client values
    const productTotal = PRODUCT_PRICE_CENTS * qty;
    const shippingCents = SHIPPING_OPTIONS[shipping_method];
    const totalCents = productTotal + shippingCents;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await supabase
      .from("orders")
      .insert({
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone.replace(/\D/g, ""),
        cpf: cpf.replace(/\D/g, ""),
        cep: cep.replace(/\D/g, ""),
        endereco: endereco.trim(),
        numero: numero.trim(),
        bairro: bairro.trim(),
        cidade: cidade.trim(),
        estado: estado.trim().toUpperCase(),
        quantity: qty,
        product_total_cents: productTotal,
        shipping_cents: shippingCents,
        total_cents: totalCents,
        shipping_method,
        pix_transaction_id: pix_transaction_id || null,
        payment_status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error inserting order:", error);
      return new Response(
        JSON.stringify({ error: "Erro ao criar pedido" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ id: data.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in create-order:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
