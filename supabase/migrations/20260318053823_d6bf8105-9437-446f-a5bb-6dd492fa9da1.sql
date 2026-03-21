
-- Fix customers insert policy to not be overly permissive
DROP POLICY IF EXISTS "Users can insert own customer record" ON public.customers;

-- Allow anon to insert (for guest checkout) but require email
CREATE POLICY "Anyone can insert customer record" ON public.customers
  FOR INSERT TO anon, authenticated
  WITH CHECK (email IS NOT NULL AND full_name IS NOT NULL);
