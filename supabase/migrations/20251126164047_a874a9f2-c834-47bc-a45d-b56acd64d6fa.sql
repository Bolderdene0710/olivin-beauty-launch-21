-- Create orders table
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  phone_number text NOT NULL,
  district text NOT NULL,
  khoroo text NOT NULL,
  detailed_address text NOT NULL,
  total_amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  items jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert orders (for checkout)
CREATE POLICY "Anyone can create orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to view orders by order_number (for tracking)
CREATE POLICY "Anyone can view orders by order number"
ON public.orders
FOR SELECT
TO anon, authenticated
USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create index on order_number for faster lookups
CREATE INDEX idx_orders_order_number ON public.orders(order_number);