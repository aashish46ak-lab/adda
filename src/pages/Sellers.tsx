import { Link } from "react-router-dom";
import { Store, Star, Package, BadgeCheck } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useLang } from "@/i18n/LanguageContext";

// Demo sellers until full multi-vendor backend is live
const DEMO_SELLERS = [
  { id: "1", slug: "kathmandu-sports", name: "Kathmandu Sports", category: "Jerseys & Sports", rating: 4.8, products: 42, followers: 1280, verified: true, logo: null },
  { id: "2", slug: "pokhara-fashion", name: "Pokhara Fashion", category: "Fashion", rating: 4.6, products: 89, followers: 2100, verified: true, logo: null },
  { id: "3", slug: "nepal-gadget-house", name: "Nepal Gadget House", category: "Electronics", rating: 4.7, products: 156, followers: 3400, verified: true, logo: null },
  { id: "4", slug: "himalayan-beauty", name: "Himalayan Beauty", category: "Beauty", rating: 4.9, products: 67, followers: 980, verified: true, logo: null },
  { id: "5", slug: "dharan-collection", name: "Dharan Collection", category: "Fashion", rating: 4.5, products: 54, followers: 720, verified: false, logo: null },
  { id: "6", slug: "biratnagar-electronics", name: "Biratnagar Electronics", category: "Electronics", rating: 4.4, products: 110, followers: 1500, verified: true, logo: null },
  { id: "7", slug: "jersey-house-nepal", name: "Jersey House Nepal", category: "Jerseys & Sports", rating: 4.7, products: 38, followers: 890, verified: true, logo: null },
  { id: "8", slug: "itahari-home", name: "Itahari Home & Living", category: "Home & Living", rating: 4.6, products: 73, followers: 640, verified: false, logo: null },
];

const Sellers = () => {
  const { t } = useLang();

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t("exploreSellers") || "Explore Sellers"}
          </h1>
          <p className="font-body text-muted-foreground text-sm">
            Discover independent shops on ADDA. Follow sellers you love and shop directly from their storefronts.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {DEMO_SELLERS.map((s) => (
            <Link
              key={s.id}
              to={`/shop/${s.slug}`}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                  <Store className="text-primary" size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-display font-bold text-foreground truncate">{s.name}</h2>
                    {s.verified && (
                      <BadgeCheck size={16} className="text-primary shrink-0" aria-label="Verified" />
                    )}
                  </div>
                  <p className="font-body text-xs text-muted-foreground">{s.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  {s.rating}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Package size={12} />
                  {s.products} products
                </span>
                <span>{s.followers.toLocaleString()} followers</span>
              </div>

              <div className="mt-4 flex gap-2">
                <span className="flex-1 text-center text-xs font-semibold py-2 rounded-lg bg-primary text-primary-foreground">
                  Visit Shop
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-8">
          <h3 className="font-display font-bold text-lg mb-2">Want to sell on ADDA?</h3>
          <p className="font-body text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Open your digital shop and reach customers across Nepal. Ma mero pasal ADDA ma rakhna sakchu.
          </p>
          <Link
            to="/become-seller"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-body text-sm font-semibold px-6 py-3 rounded-xl"
          >
            {t("becomeSeller") || "Become a Seller"}
          </Link>
        </div>
      </div>
    </PageShell>
  );
};

export default Sellers;
