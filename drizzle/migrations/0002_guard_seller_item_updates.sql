CREATE OR REPLACE FUNCTION public.guard_order_item_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN
    NEW.payout_status := OLD.payout_status;
    NEW.commission := OLD.commission;
    NEW.seller_payout := OLD.seller_payout;
    NEW.line_total := OLD.line_total;
    NEW.shop_id := OLD.shop_id;
    NEW.quantity := OLD.quantity;
    NEW.unit_price := OLD.unit_price;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_guard_order_item_update ON public.order_items;
CREATE TRIGGER trg_guard_order_item_update BEFORE UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.guard_order_item_update();

CREATE OR REPLACE FUNCTION public.guard_shop_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN
    NEW.status := OLD.status;
    NEW.commission_rate := OLD.commission_rate;
    NEW.owner_id := OLD.owner_id;
    NEW.rating := OLD.rating;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_guard_shop_update ON public.shops;
CREATE TRIGGER trg_guard_shop_update BEFORE UPDATE ON public.shops FOR EACH ROW EXECUTE FUNCTION public.guard_shop_update();