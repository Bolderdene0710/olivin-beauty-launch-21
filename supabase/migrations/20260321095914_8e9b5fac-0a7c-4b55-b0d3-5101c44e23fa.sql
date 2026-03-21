
-- Create product_variants table
CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_name TEXT NOT NULL,
  variant_type TEXT NOT NULL DEFAULT 'Size',
  price_adjustment NUMERIC NOT NULL DEFAULT 0,
  sku TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Everyone can view active variants
CREATE POLICY "Anyone can view active variants"
ON public.product_variants
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Admins can manage variants
CREATE POLICY "Admins can manage variants"
ON public.product_variants
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Index for fast lookups
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
