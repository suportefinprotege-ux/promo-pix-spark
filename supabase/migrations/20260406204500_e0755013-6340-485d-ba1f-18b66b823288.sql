
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.orders;

CREATE POLICY "Allow anonymous inserts with pending status"
  ON public.orders
  FOR INSERT
  TO anon
  WITH CHECK (
    payment_status = 'pending'
    AND paid_at IS NULL
  );
