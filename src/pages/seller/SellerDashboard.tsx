import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Clock, Package, Pencil, Plus, Store, Trash2, TrendingUp, Wallet, XCircle } from "lucide-react";
import { toast } from "sonner";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { productCover } from "@/lib/productImages";
import { rs } from "@/lib/media";

interface Shop { id: string; name: string; status: string; city: string | null; description: string | null; commission_rate: number; rating: number }
interface Prod { id: string; name: string; price: number; sale_price: number | null; stock: number; images: string[]; is_active: boolean; description?: string | null }
interface Item { id: string; product_name: string; quantity: number; line_total: number; commission: number; seller_payout: number; fulfillment_status: string; payout_status: string; created_at: string; order_id: string }

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const blank = { id: "", name: "", price: "", sale_price: "", stock: "", image: "", description: "" };
const field = "w-full rounded-md border border-border bg-muted px-3 py-2 text-sm";

const SellerDashboard = () => {
  const { user } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Prod[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "products" | "orders" | "settings">("overview");
  const [form, setForm] = useState<typeof blank | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const { data: s } = await supabase.from("shops").select("id,name,status,city,description,commission_rate,rating").eq("owner_id", user.id).maybeSingle();
    setShop(s as Shop | null);
    if (s && s.status === "approved") {
      const [{ data: p }, { data: o }] = await Promise.all([
        supabase.from("products").select("id,name,price,sale_price,stock,images,is_active,description").eq("shop_id", s.id).order("created_at", { ascending: false }),
        supabase.from("order_items").select("id,product_name,quantity,line_total,commission,seller_payout,fulfillment_status,payout_status,created_at,order_id").eq("shop_id", s.id).order("created_at", { ascending: false }),
      ]);
      setProducts((p as Prod[]) ?? []);
      setItems((o as Item[]) ?? []);
    }
    setLoading(false);
  }, [user]);
  useEffect(() => { load(); }, [load]);

  if (loading) return <PageShell><div className="container mx-auto px-4 py-16 text-center text-sm text-muted-foreground">Loading your shop…</div></PageShell>;

  if (!shop) return (
    <PageShell>
      <div className="container mx-auto max-w-lg px-4 py-16 text-center">
        <Store className="mx-auto mb-3 text-accent" size={36} />
        <h1 className="font-display text-2xl font-bold">You don't have a shop yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">Apply to sell on ADDA. Our team reviews every shop before it goes live.</p>
        <Link to="/become-seller" className="mt-6 inline-flex rounded-md bg-accent px-5 py-3 text-sm font-bold text-accent-foreground">Become a seller</Link>
      </div>
    </PageShell>
  );

  if (shop.status !== "approved") return (
    <PageShell>
      <div className="container mx-auto max-w-lg px-4 py-16 text-center">
        {shop.status === "rejected" ? <XCircle className="mx-auto mb-3 text-destructive" size={36} /> : <Clock className="mx-auto mb-3 text-accent" size={36} />}
        <h1 className="font-display text-2xl font-bold">{shop.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {shop.status === "rejected" ? "Your application was not approved. Contact the ADDA team for details." : "Your application is under review. You'll get access to the Seller Center once approved."}
        </p>
      </div>
    </PageShell>
  );

  const save = async () => {
    if (!form || !form.name || !form.price) return toast.error("Name and price are required");
    const payload = {
      name: form.name, price: Number(form.price), sale_price: form.sale_price ? Number(form.sale_price) : null,
      stock: Number(form.stock || 0), description: form.description || null, images: form.image ? [form.image] : [], shop_id: shop.id,
    };
    const { error } = form.id
      ? await supabase.from("products").update(payload).eq("id", form.id)
      : await supabase.from("products").insert({ ...payload, slug: `${form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}` });
    if (error) return toast.error(error.message);
    toast.success("Product saved"); setForm(null); load();
  };
  const toggle = async (p: Prod) => { await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id); load(); };
  const remove = async (p: Prod) => { if (!confirm(`Delete ${p.name}?`)) return; const { error } = await supabase.from("products").delete().eq("id", p.id); if (error) toast.error(error.message); load(); };
  const setStatus = async (i: Item, s: string) => { const { error } = await supabase.from("order_items").update({ fulfillment_status: s }).eq("id", i.id); if (error) toast.error(error.message); load(); };
  const saveShop = async () => { const { error } = await supabase.from("shops").update({ name: shop.name, city: shop.city, description: shop.description }).eq("id", shop.id); error ? toast.error(error.message) : toast.success("Shop updated"); };

  const live = items.filter((i) => i.fulfillment_status !== "cancelled");
  const sales = live.reduce((a, i) => a + Number(i.line_total), 0);
  const earned = live.reduce((a, i) => a + Number(i.seller_payout), 0);
  const pendingPayout = live.filter((i) => i.payout_status !== "paid").reduce((a, i) => a + Number(i.seller_payout), 0);
  const low = products.filter((p) => p.stock <= 5);
  const stats = [
    { label: "Sales", value: rs(sales), icon: TrendingUp },
    { label: "Your earnings", value: rs(earned), icon: Wallet },
    { label: "Awaiting payout", value: rs(pendingPayout), icon: Clock },
    { label: "Low stock", value: low.length, icon: AlertCircle },
  ];
  const tabs = ["overview", "products", "orders", "settings"] as const;

  return (
    <PageShell>
      <div className="container mx-auto space-y-6 px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-card p-5">
          <div>
            <p className="text-xs font-bold uppercase text-accent">Seller Center</p>
            <h1 className="font-display text-2xl font-bold">{shop.name}</h1>
            <p className="text-xs text-muted-foreground">{shop.city} · Rating {shop.rating} · Commission {shop.commission_rate}%</p>
          </div>
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">Live</span>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`min-h-10 rounded-md px-4 text-sm font-semibold capitalize ${tab === t ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>{t}</button>
          ))}
        </div>

        {tab === "overview" && (
          <>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-md border border-border bg-card p-4">
                  <s.icon size={18} className="text-accent" />
                  <p className="mt-2 font-display text-xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            {low.length > 0 && (
              <div className="rounded-md border border-border bg-card p-4">
                <h2 className="mb-2 font-display font-bold">Restock soon</h2>
                {low.map((p) => <p key={p.id} className="text-sm text-muted-foreground">{p.name} — {p.stock} left</p>)}
              </div>
            )}
          </>
        )}

        {tab === "products" && (
          <div className="rounded-md border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="font-display font-bold">Your products ({products.length})</h2>
              <Button size="sm" onClick={() => setForm({ ...blank })}><Plus size={16} /> Add product</Button>
            </div>
            {form && (
              <div className="grid gap-3 border-b border-border p-4 sm:grid-cols-2">
                <input className={field} placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className={field} placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                <input className={field} type="number" placeholder="Price (Rs.)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <input className={field} type="number" placeholder="Sale price (optional)" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} />
                <input className={field} type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                <textarea className={`${field} sm:col-span-2`} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <div className="flex gap-2 sm:col-span-2"><Button onClick={save}>Save</Button><Button variant="outline" onClick={() => setForm(null)}>Cancel</Button></div>
              </div>
            )}
            {products.length === 0 ? <p className="p-8 text-center text-sm text-muted-foreground">No products yet. Add your first one.</p> : (
              <ul className="divide-y divide-border">
                {products.map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center gap-3 p-3">
                    <img src={productCover(p.images, p.name)} alt="" className="h-12 w-12 rounded-sm object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{rs(Number(p.sale_price ?? p.price))} · {p.stock} in stock {p.is_active ? "" : "· Hidden"}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toggle(p)}>{p.is_active ? "Hide" : "Show"}</Button>
                    <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setForm({ id: p.id, name: p.name, price: String(p.price), sale_price: p.sale_price ? String(p.sale_price) : "", stock: String(p.stock), image: p.images?.[0] ?? "", description: p.description ?? "" })}><Pencil size={16} /></Button>
                    <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => remove(p)}><Trash2 size={16} /></Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "orders" && (
          <div className="rounded-md border border-border bg-card">
            <div className="border-b border-border p-4"><h2 className="font-display font-bold">Orders to fulfil</h2></div>
            {items.length === 0 ? <p className="p-8 text-center text-sm text-muted-foreground">No orders yet.</p> : (
              <ul className="divide-y divide-border">
                {items.map((i) => (
                  <li key={i.id} className="flex flex-wrap items-center gap-3 p-3 text-sm">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{i.product_name} × {i.quantity}</p>
                      <p className="text-xs text-muted-foreground">#{i.order_id.slice(0, 8)} · {new Date(i.created_at).toLocaleDateString()} · You earn {rs(Number(i.seller_payout))} (fee {rs(Number(i.commission))}) · Payout {i.payout_status}</p>
                    </div>
                    <select value={i.fulfillment_status} onChange={(e) => setStatus(i, e.target.value)} className="rounded-md border border-border bg-muted px-2 py-2 text-xs capitalize">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "settings" && (
          <div className="max-w-xl space-y-3 rounded-md border border-border bg-card p-4">
            <input className={field} value={shop.name} onChange={(e) => setShop({ ...shop, name: e.target.value })} placeholder="Shop name" />
            <input className={field} value={shop.city ?? ""} onChange={(e) => setShop({ ...shop, city: e.target.value })} placeholder="City" />
            <textarea className={field} value={shop.description ?? ""} onChange={(e) => setShop({ ...shop, description: e.target.value })} placeholder="About your shop" />
            <Button onClick={saveShop}>Save shop</Button>
          </div>
        )}
      </div>
    </PageShell>
  );
};
export default SellerDashboard;
