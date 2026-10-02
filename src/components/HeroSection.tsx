import { Link } from "react-router-dom";
import { ShoppingBasket, Store, UserPlus, Search } from "lucide-react";
import SmartSearchBar from "./SmartSearchBar";
import { useLang } from "@/i18n/LanguageContext";

const HeroSection = () => {
  const { t } = useLang();

  const boxes = [
    { to: "/products", icon: ShoppingBasket, title: t("shop"), desc: t("buyProductsDesc") },
    { to: "/sellers", icon: Store, title: t("exploreSellers") || "Explore Sellers", desc: t("galleryDesc") },
    { to: "/become-seller", icon: UserPlus, title: t("becomeSeller") || "Become a Seller", desc: "Open your digital shop on ADDA" },
    { to: "/products", icon: Search, title: t("search").split("…")[0] || "Search", desc: "Products, sellers & brands" },
  ];

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(170,30%,97%)] via-[hsl(168,25%,95%)] to-[hsl(166,22%,93%)]" />
      <div className="absolute top-[-10%] right-[-5%] w-[28rem] h-[28rem] rounded-full bg-primary/10 blur-[110px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[22rem] h-[22rem] rounded-full bg-accent/10 blur-[100px]" />

      <div className="relative z-10 container mx-auto px-4 pt-28 pb-14">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative z-30 mb-6 opacity-0 animate-fade-in-up">
            <SmartSearchBar variant="hero" />
          </div>

          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 opacity-0 animate-fade-in-up border border-primary/20 bg-card shadow-sm"
            style={{ animationDelay: "0.08s" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="font-body text-primary text-[10px] sm:text-xs uppercase tracking-[0.22em] font-semibold">
              {t("heroBadge")}
            </span>
          </div>

          <h1
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.08] mb-5 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.16s" }}
          >
            {t("heroTitle1")}
            <span className="block text-primary">{t("heroTitle2")}</span>
          </h1>

          <p
            className="font-body text-muted-foreground text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.24s" }}
          >
            {t("heroSub")}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-body text-sm font-semibold px-6 py-3 rounded-xl shadow-sm hover:opacity-95 transition-opacity"
            >
              <ShoppingBasket size={16} /> {t("shop")}
            </Link>
            <Link
              to="/become-seller"
              className="inline-flex items-center gap-2 border border-border bg-card text-foreground font-body text-sm font-semibold px-6 py-3 rounded-xl shadow-sm hover:border-primary/40 transition-colors"
            >
              <UserPlus size={16} /> {t("becomeSeller") || "Become a Seller"}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: "0.38s" }}>
            {boxes.map(({ to, icon: Icon, title, desc }) => (
              <Link
                key={to + title}
                to={to}
                className="rounded-2xl border border-border bg-card p-4 text-left shadow-sm hover:border-primary/35 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-2">
                  <Icon className="text-primary" size={20} />
                </div>
                <p className="font-display font-bold text-sm text-foreground">{title}</p>
                <p className="font-body text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
