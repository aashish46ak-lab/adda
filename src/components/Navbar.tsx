import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, ShoppingBasket, Info, Phone, ShoppingCart, LayoutDashboard, LogIn, LogOut, ReceiptText, Heart, Store } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/i18n/LanguageContext";
import SmartSearchBar from "./SmartSearchBar";
import { InstallButton } from "./InstallPrompt";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { count } = useCart();
  const { user, isAdmin, signOut, openAuthModal } = useAuth();
  const { t } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg = scrolled
    ? "bg-card/95 backdrop-blur-xl border-b border-border shadow-sm"
    : "bg-background/90 backdrop-blur-md border-b border-border/70";

  const navLinks = [
    { label: t("home") || "Home", href: "/", icon: Home },
    { label: t("products") || "Shop", href: "/products", icon: ShoppingBasket },
    { label: "Sellers", href: "/sellers", icon: Store },
    { label: t("about") || "About", href: "/about", icon: Info },
    { label: t("contact") || "Contact", href: "/contact", icon: Phone },
  ];

  const accountLinks = [
    { label: t("orders") || "Orders", href: "/my-orders", icon: ReceiptText },
    { label: t("wishlist") || "Wishlist", href: "/wishlist", icon: Heart },
    ...(isAdmin ? [{ label: t("admin") || "Admin", href: "/admin", icon: LayoutDashboard }] : []),
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className="container mx-auto flex items-center justify-between gap-2 py-2.5 px-3 sm:px-4">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
            <Link to="/" className="flex items-center gap-2 min-w-0">
              <img src="/adda-logo.svg" alt="ADDA" className="h-8 sm:h-9 w-auto shrink-0" />
              <span className="hidden xs:flex flex-col min-w-0 sm:flex">
                <span className="font-display text-base sm:text-lg font-extrabold leading-none tracking-tight text-primary">
                  ADDA
                </span>
                <span className="font-body text-[9px] sm:text-[10px] font-medium leading-tight text-muted-foreground truncate max-w-[120px] sm:max-w-[160px]">
                  Sabai Seller, Eutai Adda
                </span>
              </span>
            </Link>
            <InstallButton />
          </div>

          <div className="hidden md:block flex-1 max-w-md mx-2">
            <SmartSearchBar variant="navbar" />
          </div>

          <ul className="hidden lg:flex items-center gap-0.5">
            {[...navLinks.slice(0, 4), ...accountLinks].map((l) => (
              <li key={l.href}>
                <Link
                  to={l.href}
                  className={`flex items-center gap-1.5 font-body text-xs font-medium px-2 py-1.5 rounded-md transition-all ${
                    location.pathname === l.href ? "text-primary bg-secondary" : "text-foreground/80 hover:text-primary hover:bg-secondary/70"
                  }`}
                >
                  <l.icon size={14} />
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              {user ? (
                <button type="button" onClick={() => signOut()} className="flex items-center gap-1.5 font-body text-xs font-medium px-2 py-1.5 rounded-md text-foreground/80 hover:text-primary hover:bg-secondary/70">
                  <LogOut size={14} /> {t("signOut") || "Sign out"}
                </button>
              ) : (
                <button type="button" onClick={() => openAuthModal()} className="flex items-center gap-1.5 font-body text-xs font-medium px-2 py-1.5 rounded-md text-foreground/80 hover:text-primary hover:bg-secondary/70">
                  <LogIn size={14} /> {t("signIn") || "Sign in"}
                </button>
              )}
            </li>
          </ul>

          <div className="flex items-center gap-1 shrink-0">
            {isAdmin && (
              <Link to="/admin" className="hidden sm:inline-flex items-center gap-1.5 font-body text-xs font-semibold px-2.5 py-1.5 rounded-md bg-secondary text-primary hover:bg-primary/15">
                <LayoutDashboard size={16} /> Admin
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="sm:hidden p-2 rounded-md text-primary hover:bg-secondary" aria-label="Admin">
                <LayoutDashboard size={18} />
              </Link>
            )}
            <Link to="/wishlist" aria-label={t("wishlist") || "Wishlist"} className="p-2 rounded-md text-foreground hover:bg-secondary">
              <Heart size={18} />
            </Link>
            <Link to="/cart" aria-label={t("cart") || "Cart"} className="relative p-2 rounded-md text-foreground hover:bg-secondary">
              <ShoppingCart size={18} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground font-body text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">{count}</span>
              )}
            </Link>
            <button type="button" onClick={() => setOpen(!open)} className="lg:hidden text-foreground p-1" aria-label="Menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-foreground/25 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
          <div className="fixed top-[52px] right-0 z-50 w-64 max-w-[85vw] bg-card border-l border-b border-border shadow-xl rounded-bl-2xl lg:hidden">
            <div className="p-3 border-b border-border md:hidden">
              <SmartSearchBar variant="navbar" />
            </div>
            <ul className="flex flex-col gap-1 p-3 max-h-[70vh] overflow-y-auto">
              {[...navLinks, ...accountLinks].map((l) => (
                <li key={l.href}>
                  <Link to={l.href} onClick={() => setOpen(false)} className={`flex items-center gap-2.5 font-body text-[12px] font-medium rounded-lg px-3 py-2.5 ${location.pathname === l.href ? "text-primary bg-secondary" : "text-foreground/80 hover:text-primary hover:bg-secondary/70"}`}>
                    <l.icon size={15} className="text-primary shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                {user ? (
                  <button type="button" onClick={() => { setOpen(false); signOut(); }} className="w-full flex items-center gap-2.5 font-body text-[12px] font-medium rounded-lg px-3 py-2.5 text-foreground/80 hover:bg-secondary/70">
                    <LogOut size={15} className="text-primary shrink-0" /> {t("signOut") || "Sign out"}
                  </button>
                ) : (
                  <button type="button" onClick={() => { setOpen(false); openAuthModal(); }} className="w-full flex items-center gap-2.5 font-body text-[12px] font-medium rounded-lg px-3 py-2.5 text-foreground/80 hover:bg-secondary/70">
                    <LogIn size={15} className="text-primary shrink-0" /> {t("signIn") || "Sign in"}
                  </button>
                )}
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
