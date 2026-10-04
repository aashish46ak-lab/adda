import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Clock, Package, Store, TrendingUp, Wallet } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { productCover } from "@/lib/productImages";
import { rs } from "@/lib/media";

interface Shop { id: string; name: string; status: string; city: string | null; commission_rate: number; rating: number }
interface Prod { id: string; name: string; price: number; sale_price: number | null; stock: number; images: string[]; is_active: boolean }

const SellerDashboard = () => {
  const { user } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Prod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: s } = await supabase.from("shops").select("id,name,status,city,commission_rate,rating").eq("owner_id", user.id).maybeSingle();
      setShop(s as Shop | null);
      if (s) {
        const { data: p } = await supabase.from("products").select("id,name,price,sale_price,stock,images,is_active").eq("shop_id", s.id).order("created_at", { ascending: false });
        setProducts((p as Prod[]) ?? []);
      }
      setLoading(false);
    })();
  }, [user]);

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

  const stockValue = products.reduce((a, p) => a + Number(p.sale_price ?? p.price) * p.stock, 0);
  const low = products.filter((p) => p.stock <= 5);
  const stats = [
    { label: "Products", value: products.length, icon: Package },
    { label: "Active listings", value: products.filter((p) => p.is_active).length, icon: TrendingUp },
    { label: "Low stock", value: low.length, icon: AlertCircle },
    { label: "Stock value", value: rs(stockValue), icon: Wallet },
  ];

  return (
    <PageShell>
      <div className="container mx-auto space-y-6 px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-card p-5">
          <div>
            <p className="text-xs font-bold uppercase text-accent">Seller Center</p>
            <h1 className="font-display text-2xl font-bold">{shop.name}</h1>
            <p className="text-xs text-muted-foreground">{shop.city} · Rating {shop.rating} · Commission {shop.commission_rate}%</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${shop.status === "approved" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            {shop.status === "approved" ? "Live" : <span className="inline-flex items-center gap-1"><Clock size={12} /> Awaiting approval</span>}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-md border border-border bg-card p-4">
              <s.icon size={18} className="text-accent" />
              <p className="mt-2 font-display text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-md border border-border bg-card">
          <div className="border-b border-border p-4"><h2 className="font-display font-bold">Your products</h2></div>
          {products.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No products listed yet. Contact the ADDA team to add your first products.</p>
          ) : (
            <ul className="divide-y divide-border">
              {products.map((p) => (
                <li key={p.id} className="flex items-center gap-3 p-3">
                  <img src={productCover(p.images, p.name)} alt="" className="h-12 w-12 rounded-sm object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{rs(Number(p.sale_price ?? p.price))} · {p.stock} in stock</p>
                  </div>
                  {p.stock <= 5 && <span className="rounded-sm bg-destructive px-2 py-0.5 text-[10px] font-bold text-destructive-foreground">Low</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageShell>
  );
};
export default SellerDashboard;
