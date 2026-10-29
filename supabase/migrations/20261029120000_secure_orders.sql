-- Secure orders: stop exposing every order (name, phone, address) to anonymous users.
--
-- After this migration:
--   * anon/guests can still CREATE orders (insert policy unchanged)
--   * logged-in customers can SELECT only orders placed with their own email
--   * admins/editors keep their existing policies
--   * anyone with an order number can look up that ONE order via get_order_by_number(),
--     which returns status/items/totals and a masked name/phone — never email or street address

-- 1. Drop every non-admin SELECT policy on orders (names differ between past migrations)
DO $$
DECLARE
  p record;
BEGIN
  FOR p IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'orders'
      AND cmd = 'SELECT'
      AND policyname NOT ILIKE '%admin%'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.orders', p.policyname);
  END LOOP;
END $$;

-- 2. Customers see their own orders (Profile page, realtime updates)
CREATE POLICY "Customers can view own orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (lower(customer_email) = lower(auth.jwt() ->> 'email'));

-- 3. Guest lookup by order number with personal data masked
CREATE OR REPLACE FUNCTION public.get_order_by_number(p_order_number text)
RETURNS TABLE (
  id uuid,
  order_number text,
  status text,
  total_amount numeric,
  items jsonb,
  created_at timestamptz,
  district text,
  khoroo text,
  customer_name text,
  phone_number text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    o.id,
    o.order_number,
    o.status::text,
    o.total_amount,
    o.items,
    o.created_at,
    o.district::text,
    o.khoroo::text,
    left(o.customer_name, 1) || '***',
    '****' || right(o.phone_number, 4)
  FROM public.orders o
  WHERE o.order_number = p_order_number
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_order_by_number(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_order_by_number(text) TO anon, authenticated;
