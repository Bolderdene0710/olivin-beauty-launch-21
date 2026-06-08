ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS brand text;

ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS ingredients text[] NOT NULL DEFAULT '{}';

ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS how_to_use text;

ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS benefits text[] NOT NULL DEFAULT '{}';
