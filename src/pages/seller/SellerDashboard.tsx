import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Star,
  Wallet,
  Settings,
  PlusCircle,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import { useAuth } from "@/hooks/useAuth";

const nav = [
  { label: "Dashboard", href: "/seller", icon: LayoutDashboard },
  { label: "My Shop", href: "/seller", icon: ShoppingBag },
  { label: "Products", href: "/seller", icon: Package },
  { label: "Add Product", href: "/seller", icon: PlusCircle },
  { label: "Orders", href: "/seller", icon: ShoppingBag },
  { label: "Reviews", href: "/seller", icon: Star },
  { label: "Earnings", href: "/seller", icon: Wallet },
  { label: "Settings", href: "/seller", icon: Settings },
];

const stats = [
  { label: "Total Sales", value: "Rs. 1,24,500", icon: TrendingUp },
  { label: "Orders", value: "86", icon: ShoppingBag },
  { label: "Products", value: "24", icon: Package },
  { label: "Pending", value: "5", icon: AlertCircle },
];

const SellerDashboard = () => {
  const { user } = useAuth();

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0">
            <div className="rounded-2xl border border-border bg-card p-4 sticky top-20">
              <p className="font-display font-bold text-sm mb-1">Seller Panel</p>
              <p className="text-xs text-muted-foreground mb-4 truncate">{user?.email}</p>
              <nav className="space-y-0.5">
                {nav.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-primary transition-colors"
                  >
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t border-border">
                <Link
                  to="/become-seller"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Complete shop profile →
                </Link>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h1 className="font-display text-2xl font-bold">Seller Dashboard</h1>
                <p className="text-sm text-muted-foreground">Your shop performance on ADDA</p>
              </div>
              <Link
                to="/become-seller"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl"
              >
                <PlusCircle size={16} /> Add Product
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
                    <s.icon size={16} className="text-primary" />
                  </div>
                  <p className="font-display text-xl font-bold">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="font-display font-bold mb-3">Recent orders</h2>
                <p className="text-sm text-muted-foreground">
                  Orders will appear here once your shop is approved and you receive sales.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="font-display font-bold mb-3">Shop status</h2>
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 text-amber-700 text-xs font-semibold px-3 py-1 mb-2">
                  Pending approval
                </div>
                <p className="text-sm text-muted-foreground">
                  Admin reviews new sellers before products go live. You can still prepare your catalogue.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center">
              <p className="font-display font-bold mb-1">Ma mero pasal ADDA ma rakhna sakchu</p>
              <p className="text-sm text-muted-foreground mb-3">
                Full product management, order processing and earnings will unlock after approval.
              </p>
              <Link to="/sellers" className="text-sm font-semibold text-primary hover:underline">
                See how other shops look →
              </Link>
            </div>
          </main>
        </div>
      </div>
    </PageShell>
  );
};

export default SellerDashboard;
