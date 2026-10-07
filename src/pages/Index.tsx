import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, ChevronRight, Headphones, Mail, MapPin, Package, Quote, ShieldCheck, Star, Store, Truck, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import SmartSearchBar from "@/components/SmartSearchBar";
import { supabase } from "@/integrations/supabase/client";
import { productCover } from "@/lib/productImages";
import { rs } from "@/lib/media";
import heroImage from "@/assets/market-hero.jpg";
import fashion from "@/assets/category-fashion.jpg";
import headphones from "@/assets/category-headphones.jpg";
import shoes from "@/assets/category-shoes.jpg";
import beauty from "@/assets/category-beauty.jpg";
import home from "@/assets/category-home.jpg";
import sports from "@/assets/category-sports.jpg";
import phone from "@/assets/category-phone.jpg";
import dashainSale from "@/assets/dashain-sale.jpg";
import FlashSale from "@/components/FlashSale";
import { usePageTitle } from "@/hooks/usePageTitle";

interface Product {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  images: string[];
  featured: boolean;
  stock: number;
}
interface Category { id: string; name: string; slug: string; image_url: string | null }
interface Shop { id: string; name: string; slug: string; city: string | null; rating: number | null }
const testimonials = [
  { name: "Sita Sharma", place: "Kathmandu", text: "Ordered a phone during the Dashain sale and it arrived in two days. Prices were better than the local shops." },
  { name: "Bikash Gurung", place: "Pokhara", text: "I sell my handmade bags on ADDA now. The seller dashboard is simple and orders come in every week." },
  { name: "Anita Thapa", place: "Lalitpur", text: "Cash on delivery makes it easy to trust. My grocery order was packed well and delivered on time." },
];
const featuredCategories = [
  { name: "Fashion", slug: "fashion", image: fashion },
  { name: "Electronics", slug: "electronics", image: headphones },
  { name: "Shoes", slug: "shoes", image: shoes },
  { name: "Beauty", slug: "beauty", image: beauty },
  { name: "Home & Living", slug: "home", image: home },
  { name: "Sports", slug: "sports", image: sports },
];
const categoryPhoto = (name: string) => {
  const key = name.toLowerCase();
  if (/mobile|phone|tablet/.test(key)) return phone;
  if (/electronic|gadget|computer|laptop|headphone|audio|accessor/.test(key)) return headphones;
  if (/sport|jersey|fitness|outdoor/.test(key)) return sports;
  if (/shoe|footwear|sneaker|boot/.test(key)) return shoes;
  if (/beauty|care|cosmetic|skin|makeup/.test(key)) return beauty;
  if (/home|kitchen|living|furniture|decor|grocery/.test(key)) return home;
  if (/fashion|cloth|apparel|wear|dress|shirt|kid/.test(key)) return fashion;
  return headphones;
};
const ProductTile = ({ product }: { product: Product }) => {
  const price = Number(product.sale_price ?? product.price);
  const discount = product.sale_price != null && price < Number(product.price);
  return (
    <Link to={`/products/${product.id}`} className="group min-w-0 overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-accent/50">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img src={productCover(product.images, product.name)} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        {discount && <span className="absolute left-2 top-2 rounded-sm bg-accent px-2 py-1 text-[10px] font-bold text-accent-foreground">DEAL</span>}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 min-h-[2.5em] text-xs font-semibold leading-5 sm:text-sm">{product.name}</h3>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <strong className="text-sm font-bold text-foreground sm:text-base">{rs(price)}</strong>
          {discount && <span className="text-xs text-muted-foreground line-through">{rs(Number(product.price))}</span>}
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">{product.stock > 0 ? "In stock" : "Out of stock"}</p>
      </div>
    </Link>
  );
};
const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    Promise.all([
      supabase.from("products").select("id,name,price,sale_price,images,featured,stock").eq("is_active", true).order("created_at", { ascending: false }).limit(24),
      supabase.from("categories").select("id,name,slug,image_url").order("sort_order").limit(12),
      supabase.from("shops").select("id,name,slug,city,rating").eq("status", "approved").order("rating", { ascending: false }).limit(8),
    ]).then(([p, c, s]) => {
      if (!mounted) return;
      setProducts((p.data as Product[]) ?? []);
      setCategories((c.data as Category[]) ?? []);
      setShops((s.data as Shop[]) ?? []);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);
  usePageTitle("Home", "Nepal's multi-vendor marketplace. Sabai Seller, Eutai Adda.");
  const deals = products.filter((p) => p.sale_price != null && Number(p.sale_price) < Number(p.price));
  const categoryList = categories.length ? categories.map((c) => ({ ...c, image: c.image_url || categoryPhoto(c.name) })) : featuredCategories;
  return (
    <div className="min-h-screen bg-background pt-14 pb-16 md:pb-0">
      <Navbar />
      <div className="sticky top-[56px] z-30 border-b border-border bg-card px-4 py-2 md:hidden"><SmartSearchBar variant="hero" /></div>
      <main>
        <div className="border-b border-border bg-primary text-primary-foreground">
          <div className="container mx-auto flex items-center justify-center gap-5 px-4 py-2 text-[10px] font-medium sm:gap-10 sm:text-xs">
            <span className="inline-flex items-center gap-1"><ShieldCheck size={14} /> Shop with confidence</span>
            <span className="inline-flex items-center gap-1"><Truck size={14} /> Across Nepal</span>
            <span className="hidden items-center gap-1 sm:inline-flex"><BadgeCheck size={14} /> Discover local shops</span>
          </div>
        </div>
        <section className="relative isolate overflow-hidden bg-secondary sm:min-h-[390px] lg:min-h-[450px] 2xl:min-h-[520px]">
          <img src={heroImage} alt="Fashion, footwear, electronics and everyday products" width={1600} height={900} className="block aspect-[16/9] w-full object-cover sm:absolute sm:inset-0 sm:-z-10 sm:aspect-auto sm:h-full" />
          <div className="container mx-auto flex items-center px-5 py-6 sm:min-h-[390px] sm:px-8 sm:py-8 lg:min-h-[450px] lg:px-12 2xl:min-h-[520px]">
            <div className="w-full sm:max-w-[360px] lg:max-w-[480px]">
              <p className="mb-3 text-[11px] font-bold uppercase text-primary sm:text-xs">Sabai Seller, Eutai Adda</p>
              <h1 className="font-display text-3xl font-extrabold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">Find your next<br /><span className="text-primary">favourite thing.</span></h1>
              <p className="mt-4 max-w-sm text-xs leading-relaxed text-foreground/80 sm:text-base">Discover what's new from shops across Nepal, all in one place.</p>
              <Link to="/products" className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-bold text-accent-foreground transition-colors hover:bg-accent/90">Explore products <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>
        <div className="border-b border-border bg-card">
          <div className="container mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 text-xs font-semibold text-muted-foreground sm:px-6">
            <Link to="/products" className="hover:text-primary">All products</Link>
            <Link to="/sellers" className="hover:text-primary">Explore shops</Link>
            <Link to="/become-seller" className="hover:text-primary">Sell on ADDA</Link>
            <Link to="/my-orders" className="hover:text-primary">Track an order</Link>
          </div>
        </div>
        <div className="container mx-auto space-y-10 px-4 py-8 sm:px-6 sm:py-10">
          <Link to="/products" aria-label="Dashain Mega Sale — shop now" className="group block overflow-hidden rounded-xl border border-border bg-card sm:relative">
            <div className="relative h-36 w-full sm:h-56 lg:h-64">
              <img src={dashainSale} alt="Dashain festival with kites, marigolds and gifts" width={1600} height={640} loading="lazy" className="h-full w-full object-cover object-center sm:object-right" />
              <div className="absolute inset-0 hidden sm:block sm:bg-gradient-to-r sm:from-background/90 sm:via-background/45 sm:to-transparent" />
            </div>
            <div className="relative px-4 py-4 sm:absolute sm:inset-y-0 sm:left-0 sm:mt-0 sm:flex sm:max-w-[55%] sm:flex-col sm:justify-center sm:p-8 lg:p-10">
              <p className="text-[11px] font-bold uppercase text-accent sm:text-xs">Festival offer</p>
              <h2 className="font-display text-xl font-extrabold text-foreground sm:text-3xl lg:text-4xl">Dashain Mega Sale</h2>
              <p className="mt-1 text-xs text-foreground/80 sm:text-sm lg:text-base">Up to 40% off fashion, gadgets & home</p>
              <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-md bg-accent px-4 py-2 text-xs font-bold text-accent-foreground sm:text-sm">Shop the sale <ArrowRight size={14} /></span>
            </div>
          </Link>
          <FlashSale products={products} />
          <section aria-labelledby="categories-title">
            <div className="mb-4 flex items-center justify-between gap-3"><div><p className="text-[11px] font-bold uppercase text-accent">Discover</p><h2 id="categories-title" className="font-display text-xl font-bold sm:text-2xl">Shop by category</h2></div><Link to="/products" className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary">View all <ChevronRight size={16} /></Link></div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
              {categoryList.slice(0, 6).map((cat) => <Link key={cat.slug} to={`/products?cat=${encodeURIComponent(cat.slug)}`} className="group min-w-0 overflow-hidden rounded-md border border-border bg-card hover:border-accent/50"><div className="aspect-[4/3] overflow-hidden bg-muted"><img src={cat.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /></div><p className="truncate px-2 py-2.5 text-center text-[11px] font-semibold sm:text-sm">{cat.name}</p></Link>)}
            </div>
          </section>
          {deals.length > 0 && <section aria-labelledby="deals-title"><div className="mb-4 flex items-end justify-between"><div><p className="text-[11px] font-bold uppercase text-accent">Worth a look</p><h2 id="deals-title" className="font-display text-xl font-bold sm:text-2xl">Current deals</h2></div><Link to="/products" className="inline-flex items-center gap-1 text-xs font-semibold text-primary">Shop all <ChevronRight size={16} /></Link></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">{deals.slice(0, 5).map((p) => <ProductTile key={p.id} product={p} />)}</div></section>}
          <section aria-labelledby="products-title"><div className="mb-4 flex items-end justify-between"><div><p className="text-[11px] font-bold uppercase text-accent">The selection</p><h2 id="products-title" className="font-display text-xl font-bold sm:text-2xl">Latest products</h2></div><Link to="/products" className="inline-flex items-center gap-1 text-xs font-semibold text-primary">See all <ChevronRight size={16} /></Link></div>
            {loading ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">{Array.from({ length: 5 }, (_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-md bg-muted" />)}</div> : products.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">{products.slice(0, 10).map((p) => <ProductTile key={p.id} product={p} />)}</div> : <div className="border-y border-border py-10 text-center"><Package size={24} className="mx-auto mb-2 text-muted-foreground" /><p className="text-sm text-muted-foreground">Products are coming soon.</p></div>}
          </section>
        </div>
        <section className="border-y border-border bg-secondary"><div className="container mx-auto grid gap-5 px-4 py-9 sm:grid-cols-3 sm:px-6"><div className="flex items-center gap-3"><Store className="shrink-0 text-accent" size={24} /><div><strong className="text-sm">Discover shops</strong><p className="text-xs text-muted-foreground">Find stores across Nepal</p></div></div><div className="flex items-center gap-3"><Truck className="shrink-0 text-accent" size={24} /><div><strong className="text-sm">Shop with ease</strong><p className="text-xs text-muted-foreground">Keep your orders in one place</p></div></div><div className="flex items-center gap-3"><Headphones className="shrink-0 text-accent" size={24} /><div><strong className="text-sm">Need help?</strong><p className="text-xs text-muted-foreground">We're here for your questions</p></div></div></div></section>
        <section className="container mx-auto flex flex-col gap-5 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><p className="text-[11px] font-bold uppercase text-accent">Your shop belongs here</p><h2 className="mt-1 font-display text-2xl font-bold">Grow with ADDA</h2><p className="mt-1 text-sm text-muted-foreground">Bring your products to customers across Nepal.</p></div><Link to="/become-seller" className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Become a seller <ArrowRight size={16} /></Link></section>
      </main>
      <SiteFooter />
    </div>
  );
};
export default Index;
