import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PageShell from "@/components/PageShell";
import SiteFooter from "@/components/SiteFooter";
import ScrollToTop from "@/components/ScrollToTop";
import { useCart } from "@/hooks/useCart";
import { validateCoupon, couponSavings } from "@/lib/commerce";
import { rs } from "@/lib/media";
import { Minus, Plus, Trash2, ShoppingBag, Tag, Store } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const Cart = () => {
  const { items, bySeller, setQty, remove, subtotal, coupon, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const savings = couponSavings(coupon, subtotal);

  const apply = async () => {
    if (!code.trim()) return;
    setBusy(true);
    const { coupon: c, error } = await validateCoupon(code, subtotal);
    setBusy(false);
    if (error || !c) return toast.error(error ?? "Invalid coupon");
    applyCoupon({ code: c.code, type: c.type, value: Number(c.value) });
    toast.success(`Coupon ${c.code} applied`);
    setCode("");
  };

  return (
    <div className="min-h-screen pt-14">
      <Navbar />
      <PageShell title="My Cart" subtitle="Items grouped by seller — one checkout for all">
        <div className="container mx-auto px-4 py-10 max-w-3xl">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="mx-auto text-muted-foreground mb-4" size={40} />
              <p className="font-body text-muted-foreground mb-6">Your cart is empty.</p>
              <Link
                to="/products"
                className="inline-flex bg-primary text-primary-foreground font-body font-semibold px-6 py-3 rounded-xl"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bySeller.map((group) => (
                <div key={group.sellerId} className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
                    <Store size={16} className="text-primary" />
                    {group.sellerSlug ? (
                      <Link to={`/shop/${group.sellerSlug}`} className="font-display font-semibold text-sm hover:text-primary">
                        {group.sellerName}
                      </Link>
                    ) : (
                      <span className="font-display font-semibold text-sm">{group.sellerName}</span>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">Subtotal {rs(group.subtotal)}</span>
                  </div>
                  <div className="divide-y divide-border">
                    {group.items.map((i) => (
                      <div key={i.id} className="flex items-center gap-4 p-4">
                        <Link to={`/products/${i.id}`} className="shrink-0">
                          {i.image ? (
                            <img src={i.image} alt={i.name} className="w-16 h-16 rounded-lg object-cover" />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-secondary" />
                          )}
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/products/${i.id}`} className="font-body font-medium text-sm hover:text-primary line-clamp-2">
                            {i.name}
                          </Link>
                          <p className="font-body text-sm font-semibold text-primary mt-0.5">{rs(i.price)}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => setQty(i.id, i.quantity - 1)} aria-label="Decrease" className="p-1.5 rounded-md border border-border hover:border-primary/40">
                            <Minus size={14} />
                          </button>
                          <span className="font-body text-sm w-6 text-center">{i.quantity}</span>
                          <button type="button" onClick={() => setQty(i.id, i.quantity + 1)} aria-label="Increase" className="p-1.5 rounded-md border border-border hover:border-primary/40">
                            <Plus size={14} />
                          </button>
                        </div>
                        <button type="button" onClick={() => remove(i.id)} aria-label="Remove" className="p-2 text-muted-foreground hover:text-destructive">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                <p className="font-body text-sm font-medium flex items-center gap-2">
                  <Tag size={14} /> Coupon
                </p>
                {coupon ? (
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-body text-sm text-primary font-semibold">{coupon.code} applied</span>
                    <button type="button" onClick={removeCoupon} className="font-body text-xs text-destructive hover:underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 border border-border rounded-lg px-3 py-2 font-body text-sm bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <Button type="button" variant="outline" disabled={busy} onClick={apply}>
                      Apply
                    </Button>
                  </div>
                )}
              </div>

              <div className="bg-card border border-border rounded-xl p-6 space-y-2">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{rs(subtotal)}</span>
                </div>
                {savings.discount > 0 && (
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-primary">− {rs(savings.discount)}</span>
                  </div>
                )}
                {savings.freeShipping && <p className="font-body text-xs text-primary">Free shipping applied</p>}
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-body text-muted-foreground">Grand total</span>
                  <span className="font-display text-xl font-bold text-primary">
                    {rs(Math.max(subtotal - savings.discount, 0))}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full flex items-center justify-center bg-primary text-primary-foreground font-body font-semibold py-4 rounded-xl"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </PageShell>
      <SiteFooter />
      <ScrollToTop />
    </div>
  );
};

export default Cart;
