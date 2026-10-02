import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import ScrollToTop from "@/components/ScrollToTop";
import SmartSearchBar from "@/components/SmartSearchBar";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { productCover } from "@/lib/productImages";
import { rs } from "@/lib/media";
import { useLang } from "@/i18n/LanguageContext";
import {
  ArrowRight,
  BadgeCheck,
  Flame,
  Package,
  ShieldCheck,
  Star,
  Store,
  Truck,
  UserPlus,
  Zap,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  images: string[];
  featured: boolean;
  stock: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
}

const DEMO_SELLERS = [
  { slug: "kathmandu-sports", name: "Kathmandu Sports", rating: 4.8, products: 42 },
  { slug: "pokhara-fashion", name: "Pokhara Fashion", rating: 4.6, products: 89 },
  { slug: "nepal-gadget-house", name: "Nepal Gadget House", rating: 4.7, products: 156 },
  { slug: "himalayan-beauty", name: "Himalayan Beauty", rating: 4.9, products: 67 },
  { slug: "jersey-house-nepal", name: "Jersey House Nepal", rating: 4.7, products: 38 },
  { slug: "biratnagar-electronics", name: "Biratnagar Electronics", rating: 4.4, products: 110 },
];

const TRUST = [
  { icon: ShieldCheck, label: "Safe Payment" },
  { icon: Truck, label: "Nationwide Delivery" },
  { icon: BadgeCheck, label: "Verified Sellers" },
];

const Index = () => {
  const { t } = useLang();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [p, c] = await Promise.all([
        supabase
          .from("products")
          .select("id,name,price,sale_price,images,featured,stock")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(24),
        supabase.from("categories").select("id,name,slug,image_url").order("sort_order").limit(12),
      ]);
      setProducts((p.data as Product[]) ?? []);
      setCategories((c.data as Category[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const featured = products.filter((x) => x.featured).slice(0, 8);
  const flash = products.slice(0, 6);
  const top = (featured.length ? featured : products).slice(0, 8);

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navbar />

      <div className="md:hidden sticky top-[52px] z-40 bg-background/95 backdrop-blur border-b border-border px-3 py-2">
        <SmartSearchBar variant="navbar" />
      </div>

      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-3 py-2 flex items-center justify-center gap-4 sm:gap-8 text-[11px] sm:text-xs font-medium">
          {TRUST.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1.5 opacity-95">
              <item.icon size={14} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <section className="bg-gradient-to-br from-primary via-[hsl(220,42%,22%)] to-[hsl(220,40%,16%)] text-primary-foreground">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-3">
                <Zap size={12} className="text-accent" />
                {t("heroBadge")}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                {t("heroTitle1")}
                <span className="block text-accent">{t("heroTitle2")}</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-white/80 max-w-lg">{t("heroSub")}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold text-sm px-5 py-2.5 rounded-xl"
                >
                  {t("shop")} <ArrowRight size={16} />
                </Link>
                <Link
                  to="/sellers"
                  className="inline-flex items-center gap-2 bg-white/15 font-semibold text-sm px-5 py-2.5 rounded-xl"
                >
                  <Store size={16} /> {t("exploreSellers")}
                </Link>
              </div>
            </div>
            <div className="hidden md:block flex-1 max-w-md">
              <div className="rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur">
                <p className="text-xs font-semibold text-white/70 mb-2">Search on ADDA</p>
                <SmartSearchBar variant="hero" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-3 sm:px-4 py-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-base sm:text-lg">{t("shopByCategory")}</h2>
          <Link to="/products" className="text-xs font-semibold text-primary inline-flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {(categories.length
            ? categories
            : [
                { id: "1", name: "Fashion", slug: "fashion", image_url: null },
                { id: "2", name: "Electronics", slug: "electronics", image_url: null },
                { id: "3", name: "Jerseys", slug: "jerseys", image_url: null },
                { id: "4", name: "Beauty", slug: "beauty", image_url: null },
                { id: "5", name: "Home", slug: "home", image_url: null },
                { id: "6", name: "Kids", slug: "kids", image_url: null },
              ]
          ).map((cat) => (
            <Link
              key={cat.id}
              to={`/products?cat=${cat.slug}`}
              className="shrink-0 w-[72px] sm:w-20 flex flex-col items-center gap-1.5"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center overflow-hidden">
                {cat.image_url ? (
                  <img src={cat.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Package className="text-primary" size={22} />
                )}
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-center line-clamp-2 leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-3 sm:px-4 py-2">
        <div className="rounded-2xl bg-gradient-to-r from-accent/90 to-[hsl(28,95%,45%)] p-4 text-accent-foreground">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-base sm:text-lg inline-flex items-center gap-2">
              <Flame size={18} /> Flash Deals
            </h2>
            <Link to="/products" className="text-xs font-semibold opacity-90 inline-flex items-center gap-1">
              Shop more <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {(loading ? Array.from({ length: 6 }) : flash).map((p, i) =>
              p && typeof p === "object" && "id" in p ? (
                <Link
                  key={(p as Product).id}
                  to={`/products/${(p as Product).id}`}
                  className="bg-white rounded-xl p-2 text-foreground shadow-sm"
                >
                  <div className="aspect-square rounded-lg bg-muted overflow-hidden mb-1.5">
                    <img
                      src={productCover((p as Product).images, (p as Product).name)}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-[10px] sm:text-xs font-semibold text-primary truncate">
                    {rs(Number((p as Product).sale_price ?? (p as Product).price))}
                  </p>
                </Link>
              ) : (
                <div key={i} className="bg-white/30 rounded-xl aspect-[3/4] animate-pulse" />
              ),
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-3 sm:px-4 py-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-base sm:text-lg">{t("featured")}</h2>
          <Link to="/products" className="text-xs font-semibold text-primary inline-flex items-center gap-1">
            {t("viewAll")} <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {(loading ? Array.from({ length: 8 }) : top).map((p, i) =>
            p && typeof p === "object" && "id" in p ? (
              <Link
                key={(p as Product).id}
                to={`/products/${(p as Product).id}`}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:border-primary/35 hover:shadow-md transition-all"
              >
                <div className="aspect-square bg-muted overflow-hidden relative">
                  <img
                    src={productCover((p as Product).images, (p as Product).name)}
                    alt={(p as Product).name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {(p as Product).sale_price != null &&
                    Number((p as Product).sale_price) < Number((p as Product).price) && (
                      <span className="absolute top-2 left-2 text-[10px] font-bold bg-accent text-accent-foreground px-1.5 py-0.5 rounded-md">
                        SALE
                      </span>
                    )}
                </div>
                <div className="p-2.5">
                  <p className="font-body text-xs sm:text-sm font-medium line-clamp-2 min-h-[2.5em]">{(p as Product).name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{t("soldBy")} ADDA</p>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-bold text-sm text-primary">
                      {rs(Number((p as Product).sale_price ?? (p as Product).price))}
                    </span>
                    {(p as Product).sale_price != null && (
                      <span className="text-[10px] text-muted-foreground line-through">
                        {rs(Number((p as Product).price))}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ) : (
              <div key={i} className="rounded-2xl border border-border aspect-[3/4] animate-pulse bg-muted" />
            ),
          )}
        </div>
      </section>

      <section className="container mx-auto px-3 sm:px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-base sm:text-lg">Popular Sellers</h2>
          <Link to="/sellers" className="text-xs font-semibold text-primary inline-flex items-center gap-1">
            {t("exploreSellers")} <ArrowRight size={12} />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {DEMO_SELLERS.map((s) => (
            <Link
              key={s.slug}
              to={`/shop/${s.slug}`}
              className="shrink-0 w-40 rounded-2xl border border-border bg-card p-3 shadow-sm hover:border-primary/40 transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center mb-2">
                <Store className="text-primary" size={20} />
              </div>
              <p className="font-display font-semibold text-sm truncate">{s.name}</p>
              <p className="text-[10px] text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                <Star size={10} className="fill-amber-400 text-amber-400" /> {s.rating} · {s.products} items
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="hidden md:block container mx-auto px-4 py-10">
        <div className="rounded-3xl border border-border bg-gradient-to-r from-primary to-[hsl(220,40%,22%)] text-primary-foreground p-8 lg:p-10 flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold mb-3">
              <UserPlus size={14} /> For sellers
            </div>
            <h2 className="font-display text-2xl lg:text-3xl font-bold mb-2">Join ADDA as a Seller</h2>
            <p className="text-sm text-white/80 max-w-xl">
              Ma mero pasal ADDA ma rakhna sakchu. Open your digital shop, list products, and reach customers across Nepal.
            </p>
          </div>
          <Link
            to="/become-seller"
            className="shrink-0 inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-6 py-3 rounded-xl"
          >
            {t("becomeSeller")} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="md:hidden container mx-auto px-3 py-4">
        <Link
          to="/become-seller"
          className="flex items-center justify-between rounded-2xl border border-primary/25 bg-primary/5 px-4 py-3"
        >
          <div>
            <p className="font-display font-bold text-sm">{t("becomeSeller")}</p>
            <p className="text-[11px] text-muted-foreground">Open your shop on ADDA</p>
          </div>
          <ArrowRight className="text-primary" size={18} />
        </Link>
      </section>

      <SiteFooter />
      <ScrollToTop />
      <BottomNav />
    </div>
  );
};

export default Index;
