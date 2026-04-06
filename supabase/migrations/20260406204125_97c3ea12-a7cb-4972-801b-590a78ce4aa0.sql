
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Allow anonymous select" ON public.orders;
DROP POLICY IF EXISTS "Allow anonymous updates on own pix" ON public.orders;

-- Allow anonymous users to only SELECT their own order by matching pix_transaction_id
CREATE POLICY "Select own order by pix_transaction_id"
  ON public.orders
  FOR SELECT
  TO anon
  USING (pix_transaction_id IS NOT NULL AND pix_transaction_id = current_setting('request.headers', true)::json->>'x-pix-transaction-id');

-- No anonymous UPDATE allowed — updates go through edge function with service_role
