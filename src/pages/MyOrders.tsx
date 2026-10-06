import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PageShell from "@/components/PageShell";
import SiteFooter from "@/components/SiteFooter";
import OrderTimeline from "@/components/OrderTimeline";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { rs } from "@/lib/media";
import { ChevronDown, ChevronUp, Loader2, Store } from "lucide-react";

interface OrderRow {
  id: string;
  order_number: string;
  total: number;
  status: string;
  created_at: string;
}

interface ItemRow {
  id: string;
  product_name: string;
  quantity: number;
  line_total: number;
  shop_id: string | null;
  fulfillment_status: string;
  image_url?: string | null;
}

interface ShopRow {
  id: string;
  name: string;
  slug: string;
}

const statusStyle: Record<string, string> = {
  pending: "bg-accent/15 text-accent",
  confirmed: "bg-primary/15 text-primary",
  processing: "bg-primary/15 text-primary",
  packed: "bg-primary/15 text-primary",
  shipped: "bg-primary/20 text-primary",
  out_for_delivery: "bg-primary/20 text-primary",
  delivered: "bg-primary/20 text-primary",
  cancelled: "bg-destructive/15 text-destructive",
};

const MyOrders = () => {
  usePageTitle("My Orders", "Track orders from every shop on ADDA.");
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [itemsByOrder, setItemsByOrder] = useState<Record<string, ItemRow[]>>({});
  const [shops, setShops] = useState<Record<string, ShopRow>>({});
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = () =>
      supabase
        .from("orders")
        .select("id,order_number,total,status,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setOrders((data as OrderRow[]) ?? []);
          setLoading(false);
        });
    load();
    const channel = supabase
      .channel(`my-orders-${user.id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `user_id=eq.${user.id}` }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const toggle = async (orderId: string) => {
    if (openId === orderId) {
      setOpenId(null);
      return;
    }
    setOpenId(orderId);
    if (itemsByOrder[orderId]) return;
    setLoadingItems(true);
    const { data: items } = await supabase
      .from("order_items")
      .select("id,product_name,quantity,line_total,shop_id,fulfillment_status,image_url")
      .eq("order_id", orderId);
    const list = (items as ItemRow[]) ?? [];
    setItemsByOrder((prev) => ({ ...prev, [orderId]: list }));
    const shopIds = [...new Set(list.map((i) => i.shop_id).filter(Boolean))] as string[];
    if (shopIds.length) {
      const { data: shopRows } = await supabase.from("shops").select("id,name,slug").in("id", shopIds);
      const map: Record<string, ShopRow> = { ...shops };
      ((shopRows as ShopRow[]) ?? []).forEach((s) => {
        map[s.id] = s;
      });
      setShops(map);
    }
    setLoadingItems(false);
  };

  const groupByShop = (items: ItemRow[]) => {
    const map = new Map<string, { shopId: string; name: string; slug?: string; items: ItemRow[]; status: string }>();
    for (const it of items) {
      const sid = it.shop_id || "platform";
      if (!map.has(sid)) {
        const shop = it.shop_id ? shops[it.shop_id] : null;
        map.set(sid, {
          shopId: sid,
          name: shop?.name || "ADDA Marketplace",
          slug: shop?.slug,
          items: [],
          status: it.fulfillment_status || "pending",
        });
      }
      const g = map.get(sid)!;
      g.items.push(it);
      const rank = (s: string) =>
        ["pending", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"].indexOf(s);
      if (rank(it.fulfillment_status || "pending") < rank(g.status)) g.status = it.fulfillment_status || "pending";
    }
    return [...map.values()];
  };

  return (
    <div className="min-h-screen pt-14 pb-16 md:pb-0">
      <Navbar />
      <PageShell title="My Orders" subtitle="Track delivery progress from each shop">
        <div className="container mx-auto max-w-3xl px-4 py-10 sm:py-16">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin text-primary" size={28} />
            </div>
          ) : orders.length === 0 ? (
            <p className="font-body text-center text-muted-foreground">
              You haven't placed any orders yet.{" "}
              <Link to="/products" className="text-primary font-semibold hover:underline">
                Start shopping
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => {
                const open = openId === o.id;
                const items = itemsByOrder[o.id] ?? [];
                const groups = open ? groupByShop(items) : [];
                return (
                  <div key={o.id} className="rounded-xl border border-border bg-card overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggle(o.id)}
                      className="flex w-full items-center justify-between gap-3 p-4 sm:p-5 text-left hover:bg-secondary/40 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-display font-bold text-foreground truncate">{o.order_number}</p>
                        <p className="font-body text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`font-body text-[10px] sm:text-[11px] uppercase px-2.5 py-1 rounded-full ${statusStyle[o.status] ?? "bg-muted"}`}>
                          {o.status.replace(/_/g, " ")}
                        </span>
                        <span className="font-body font-semibold text-primary text-sm">{rs(Number(o.total))}</span>
                        {open ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
                      </div>
                    </button>
                    {open && (
                      <div className="border-t border-border px-4 pb-4 pt-3 sm:px-5 space-y-4">
                        {loadingItems && !items.length ? (
                          <div className="flex justify-center py-6">
                            <Loader2 className="animate-spin text-primary" size={22} />
                          </div>
                        ) : groups.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No line items found.</p>
                        ) : (
                          groups.map((g) => (
                            <div key={g.shopId} className="rounded-lg border border-border bg-background/60 p-3 sm:p-4">
                              <div className="mb-3 flex items-center gap-2">
                                <Store size={16} className="text-primary shrink-0" />
                                {g.slug ? (
                                  <Link to={`/shop/${g.slug}`} className="font-display text-sm font-semibold hover:text-primary">
                                    {g.name}
                                  </Link>
                                ) : (
                                  <span className="font-display text-sm font-semibold">{g.name}</span>
                                )}
                                <span className={`ml-auto text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${statusStyle[g.status] ?? "bg-muted"}`}>
                                  {g.status.replace(/_/g, " ")}
                                </span>
                              </div>
                              <ul className="mb-3 space-y-1.5">
                                {g.items.map((it) => (
                                  <li key={it.id} className="flex justify-between gap-2 text-xs sm:text-sm">
                                    <span className="text-foreground/90 truncate">
                                      {it.product_name} × {it.quantity}
                                    </span>
                                    <span className="text-muted-foreground shrink-0">{rs(Number(it.line_total))}</span>
                                  </li>
                                ))}
                              </ul>
                              <OrderTimeline status={g.status} />
                            </div>
                          ))
                        )}
                        <Link to={`/order-confirmation/${o.id}`} className="inline-flex text-xs font-semibold text-primary hover:underline">
                          Full order details →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PageShell>
      <SiteFooter />
    </div>
  );
};

export default MyOrders;
