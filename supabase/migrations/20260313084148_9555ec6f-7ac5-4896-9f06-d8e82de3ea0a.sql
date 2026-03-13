CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'Serums',
  description TEXT,
  ingredients TEXT[],
  how_to_use TEXT,
  benefits TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON public.products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Seed some sample products
INSERT INTO public.products (title, brand, price, category, description, image_url) VALUES
  ('Torriden DIVE-IN Serum', 'Torriden', 45000, 'Serums', 'Хиалуроны хүчлийн серум, арьсыг гүнээс чийгшүүлнэ.', null),
  ('Round Lab Dokdo Toner', 'Round Lab', 38000, 'Toners', 'Докдо тонер, арьсыг цэвэрлэж чийгшүүлнэ.', null),
  ('Illiyoon Ceramide Cream', 'Illiyoon', 55000, 'Creams', 'Керамидтай крем, арьсны хамгаалалтын давхаргыг сэргээнэ.', null),
  ('COSRX Snail Mucin Essence', 'COSRX', 42000, 'Serums', 'Мэлхийн шүүсний эссенс, арьсыг сэргээж тэжээнэ.', null),
  ('Beauty of Joseon Sunscreen', 'Beauty of Joseon', 35000, 'Creams', 'Нарнаас хамгаалах крем SPF50+', null),
  ('Anua Heartleaf Toner', 'Anua', 40000, 'Toners', 'Навчит тонер, арьсыг тайвшруулна.', null);