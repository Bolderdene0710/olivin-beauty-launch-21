CREATE TABLE IF NOT EXISTS public.store_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name text NOT NULL DEFAULT 'Olivin',
    currency text NOT NULL DEFAULT 'MNT',
    logo_url text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store settings are viewable by everyone"
    ON public.store_settings FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE TRIGGER set_store_settings_updated_at
    BEFORE UPDATE ON public.store_settings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER PUBLICATION supabase_realtime ADD TABLE public.store_settings;

INSERT INTO public.store_settings (store_name, currency, logo_url)
SELECT 'Olivin', 'MNT', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.store_settings);
