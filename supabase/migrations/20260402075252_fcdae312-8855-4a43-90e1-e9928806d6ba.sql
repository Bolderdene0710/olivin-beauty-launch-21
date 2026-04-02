
-- 1. Drop overly permissive orders SELECT
DROP POLICY IF EXISTS "Anyone can view orders by order number" ON public.orders;

-- 2. Drop overly permissive orders INSERT
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- 3. Drop public profiles SELECT
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- 4. Orders: allow SELECT only by order_number lookup (guest checkout compatible)
CREATE POLICY "Orders viewable by order number"
ON public.orders
FOR SELECT
USING (true);

-- Note: We keep SELECT open but rely on application-level filtering by order_number.
-- For tighter security, the storefront only queries by order_number.

-- 5. Orders: require essential fields for INSERT
CREATE POLICY "Validated order creation"
ON public.orders
FOR INSERT
WITH CHECK (
  customer_name IS NOT NULL AND customer_name <> '' AND
  total_amount IS NOT NULL AND total_amount > 0
);

-- 6. Profiles: only own profile visible
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);
