
-- Remove orders from Realtime publication (PII exposure)
ALTER PUBLICATION supabase_realtime DROP TABLE public.orders;

-- Enable RLS on orders (should already be enabled but ensure)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Only authenticated users (admin) can read orders
CREATE POLICY "Authenticated users can view orders"
ON public.orders
FOR SELECT
TO authenticated
USING (true);

-- Only service_role can insert (via edge function)
-- No anonymous insert policy needed since create-order uses service_role
