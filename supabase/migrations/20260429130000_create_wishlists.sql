CREATE TABLE IF NOT EXISTS public.wishlists (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS wishlists_user_id_idx ON public.wishlists (user_id);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wishlist"
    ON public.wishlists FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own wishlist"
    ON public.wishlists FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own wishlist"
    ON public.wishlists FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.wishlists;
