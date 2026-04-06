
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  cpf TEXT NOT NULL,
  cep TEXT NOT NULL,
  endereco TEXT NOT NULL,
  numero TEXT NOT NULL,
  bairro TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  product_total_cents INTEGER NOT NULL,
  shipping_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL,
  shipping_method TEXT NOT NULL DEFAULT 'loggi',
  pix_transaction_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON public.orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous updates on own pix" ON public.orders FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous select" ON public.orders FOR SELECT TO anon USING (true);
