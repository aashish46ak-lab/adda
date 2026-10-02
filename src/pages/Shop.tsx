import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { BadgeCheck, MapPin, Package, Star, Store, Users } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useLang } from "@/i18n/LanguageContext";

const DEMO_SHOPS: Record<
  string,
  {
    name: string;
    category: string;
    rating: number;
    products: number;
    followers: number;
    verified: boolean;
    joined: string;
    description: string;
    location: string;
    sampleProducts: { id: string; name: string; price: number; original?: number }[];
  }
> = {
  "kathmandu-sports": {
    name: "Kathmandu Sports",
    category: "Jerseys & Sports",
    rating: 4.8,
    products: 42,
    followers: 1280,
    verified: true,
    joined: "Jan 2024",
    description: "Authentic sports jerseys, kits and gear. Nepal football, cricket and more.",
    location: "Kathmandu",
    sampleProducts: [
      { id: "ks1", name: "Nepal Football Jersey 2024", price: 1899, original: 2499 },
      { id: "ks2", name: "Training Shorts", price: 899 },
      { id: "ks3", name: "Football Socks Pair", price: 349 },
    ],
  },
  "pokhara-fashion": {
    name: "Pokhara Fashion",
    category: "Fashion",
    rating: 4.6,
    products: 89,
    followers: 2100,
    verified: true,
    joined: "Mar 2024",
    description: "Trendy apparel and accessories from the lakeside city.",
    location: "Pokhara",
    sampleProducts: [
      { id: "pf1", name: "Cotton Kurta Set", price: 1599, original: 1999 },
      { id: "pf2", name: "Denim Jacket", price: 2499 },
    ],
  },
  "nepal-gadget-house": {
    name: "Nepal Gadget House",
    category: "Electronics",
    rating: 4.7,
    products: 156,
    followers: 3400,
    verified: true,
    joined: "Nov 2023",
    description: "Mobiles, accessories and gadgets with warranty support.",
    location: "Kathmandu",
    sampleProducts: [
      { id: "ng1", name: "Wireless Earbuds Pro", price: 2999, original: 3999 },
      { id: "ng2", name: "Power Bank 20000mAh", price: 1899 },
    ],
  },
  "himalayan-beauty": {
    name: "Himalayan Beauty",
    category: "Beauty",
    rating: 4.9,
    products: 67,
    followers: 980,
    verified: true,
    joined: "Feb 2024",
    description: "Natural skincare and beauty products inspired by the Himalayas.",
    location: "Lalitpur",
    sampleProducts: [{ id: "hb1", name: "Himalayan Rose Face Cream", price: 799 }],
  },
  "dharan-collection": {
    name: "Dharan Collection",
    category: "Fashion",
    rating: 4.5,
    products: 54,
    followers: 720,
    verified: false,
    joined: "Jun 2024",
    description: "Eastern Nepal fashion and lifestyle wear.",
    location: "Dharan",
    sampleProducts: [{ id: "dc1", name: "Casual Shirt", price: 1299 }],
  },
  "biratnagar-electronics": {
    name: "Biratnagar Electronics",
    category: "Electronics",
    rating: 4.4,
    products: 110,
    followers: 1500,
    verified: true,
    joined: "Dec 2023",
    description: "Trusted electronics from the east.",
    location: "Biratnagar",
    sampleProducts: [{ id: "be1", name: "Smart LED Bulb 4-Pack", price: 1499 }],
  },
  "jersey-house-nepal": {
    name: "Jersey House Nepal",
    category: "Jerseys & Sports",
    rating: 4.7,
    products: 38,
    followers: 890,
    verified: true,
    joined: "Apr 2024",
    description: "Custom and official jerseys for clubs and fans.",
    location: "Kathmandu",
    sampleProducts: [
      { id: "jh1", name: "Custom Name Jersey", price: 2199 },
      { id: "jh2", name: "Training Jersey", price: 1299 },
    ],
  },
  "itahari-home": {
    name: "Itahari Home & Living",
    category: "Home & Living",
    rating: 4.6,
    products: 73,
    followers: 640,
    verified: false,
    joined: "May 2024",
    description: "Home essentials and living products.",
    location: "Itahari",
    sampleProducts: [{ id: "ih1", name: "Cotton Bedsheet Set", price: 1899 }],
  },
};

const Shop = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLang();
  const shop = useMemo(() => (slug ? DEMO_SHOPS[slug] : null), [slug]);

  if (!shop) {
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-16 text-center">
          <Store className="mx-auto text-muted-foreground mb-3" size={40} />
          <h1 className="font-display text-2xl font-bold mb-2">Shop not found</h1>
          <p className="text-sm text-muted-foreground mb-6">This seller shop does not exist or is not active yet.</p>
          <Link to="/sellers" className="inline-flex bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-xl">
            Explore Sellers
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary to-[hsl(220,40%,28%)] text-primary-foreground">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <Store size={36} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-2xl md:text-3xl font-bold">{shop.name}</h1>
                {shop.verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                    <BadgeCheck size={14} /> {t("verified") || "Verified"}
                  </span>
                )}
              </div>
              <p className="text-sm opacity-90 mt-1">{shop.category}</p>
              <p className="text-sm opacity-80 mt-2 max-w-xl">{shop.description}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-xs opacity-90">
                <span className="inline-flex items-center gap-1">
                  <Star size={12} className="fill-current" /> {shop.rating}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Package size={12} /> {shop.products} products
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users size={12} /> {shop.followers.toLocaleString()} followers
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} /> {shop.location}
                </span>
                <span>Joined {shop.joined}</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button type="button" className="bg-accent text-accent-foreground font-semibold text-sm px-4 py-2 rounded-xl">
                {t("follow") || "Follow"}
              </button>
              <button type="button" className="bg-white/15 font-semibold text-sm px-4 py-2 rounded-xl">
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="font-display text-xl font-bold mb-4">Products from {shop.name}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shop.sampleProducts.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="aspect-square rounded-xl bg-secondary mb-3 flex items-center justify-center">
                <Package className="text-muted-foreground" size={32} />
              </div>
              <p className="font-display font-semibold text-sm">{p.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t("soldBy") || "Sold by"} {shop.name}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-bold text-primary">Rs. {p.price.toLocaleString()}</span>
                {p.original && (
                  <span className="text-xs text-muted-foreground line-through">Rs. {p.original.toLocaleString()}</span>
                )}
              </div>
              <button
                type="button"
                className="mt-3 w-full text-sm font-semibold py-2 rounded-lg bg-primary text-primary-foreground"
              >
                {t("addToCart") || "Add to Cart"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/sellers" className="text-sm font-semibold text-primary hover:underline">
            ← Back to Explore Sellers
          </Link>
        </div>
      </div>
    </PageShell>
  );
};

export default Shop;
