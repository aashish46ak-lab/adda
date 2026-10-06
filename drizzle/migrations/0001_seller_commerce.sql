ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS shop_id uuid REFERENCES public.shops(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS commission numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS seller_payout numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS fulfillment_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payout_status text NOT NULL DEFAULT 'unpaid';

CREATE OR REPLACE FUNCTION public.owns_shop(_shop uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.shops WHERE id = _shop AND owner_id = auth.uid() AND status = 'approved')
$$;

CREATE OR REPLACE FUNCTION public.order_item_split()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE rate numeric;
BEGIN
  IF NEW.product_id IS NOT NULL AND NEW.shop_id IS NULL THEN
    SELECT shop_id INTO NEW.shop_id FROM public.products WHERE id = NEW.product_id;
  END IF;
  SELECT commission_rate INTO rate FROM public.shops WHERE id = NEW.shop_id;
  NEW.commission := round(coalesce(NEW.line_total,0) * coalesce(rate,0) / 100, 2);
  NEW.seller_payout := coalesce(NEW.line_total,0) - NEW.commission;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_order_item_split ON public.order_items;
CREATE TRIGGER trg_order_item_split BEFORE INSERT ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.order_item_split();

CREATE POLICY "sellers read own order items" ON public.order_items FOR SELECT TO authenticated USING (public.owns_shop(shop_id));
CREATE POLICY "sellers update own order items" ON public.order_items FOR UPDATE TO authenticated USING (public.owns_shop(shop_id)) WITH CHECK (public.owns_shop(shop_id));

CREATE POLICY "sellers read own products" ON public.products FOR SELECT TO authenticated USING (public.owns_shop(shop_id));
CREATE POLICY "sellers insert own products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.owns_shop(shop_id));
CREATE POLICY "sellers update own products" ON public.products FOR UPDATE TO authenticated USING (public.owns_shop(shop_id)) WITH CHECK (public.owns_shop(shop_id));
CREATE POLICY "sellers delete own products" ON public.products FOR DELETE TO authenticated USING (public.owns_shop(shop_id));

CREATE POLICY "admins delete shops" ON public.shops FOR DELETE TO authenticated USING (public.is_admin());