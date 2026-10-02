import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, LayoutGrid, Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";

const BottomNav = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { count } = useCart();
  const { user, openAuthModal } = useAuth();

  // Hide on admin / seller dashboard and auth pages
  const hide =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/seller") ||
    location.pathname === "/auth" ||
    location.pathname.startsWith("/checkout");

  if (!isMobile || hide) return null;

  const items = [
    { to: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
    { to: "/products", label: "Categories", icon: LayoutGrid, match: (p: string) => p.startsWith("/products") || p.startsWith("/sellers") },
    { to: "/products?focus=search", label: "Search", icon: Search, match: () => false, isSearch: true },
    { to: "/cart", label: "Cart", icon: ShoppingCart, match: (p: string) => p === "/cart", badge: count },
    { to: user ? "/my-orders" : "#account", label: "Account", icon: User, match: (p: string) => p === "/my-orders" || p === "/wishlist", isAccount: true },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Bottom navigation"
    >
      <ul className="grid grid-cols-5 h-14">
        {items.map((item) => {
          const active = item.match(location.pathname);
          const Icon = item.icon;

          const onClick = (e: React.MouseEvent) => {
            if (item.isAccount && !user) {
              e.preventDefault();
              openAuthModal();
              return;
            }
            if (item.isSearch) {
              e.preventDefault();
              navigate("/products");
              // Focus search after short delay
              setTimeout(() => {
                const el = document.querySelector<HTMLInputElement>('input[type="search"], input[placeholder*="Search"], input[placeholder*="search"]');
                el?.focus();
              }, 300);
            }
          };

          return (
            <li key={item.label} className="flex">
              <Link
                to={item.isAccount && !user ? "#" : item.to}
                onClick={onClick}
                className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span className="relative">
                  <Icon size={22} strokeWidth={active ? 2.25 : 1.75} />
                  {item.badge != null && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-accent text-accent-foreground text-[9px] font-bold flex items-center justify-center">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
