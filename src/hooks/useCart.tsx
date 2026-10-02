import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string | null;
  unit: string | null;
  quantity: number;
  /** Multi-vendor fields */
  sellerId?: string;
  sellerName?: string;
  sellerSlug?: string;
}

export interface AppliedCoupon {
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
}

interface CartState {
  items: CartItem[];
  saved: CartItem[];
  coupon: AppliedCoupon | null;
  count: number;
  subtotal: number;
  /** Items grouped by seller for multi-vendor checkout */
  bySeller: { sellerId: string; sellerName: string; sellerSlug?: string; items: CartItem[]; subtotal: number }[];
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  removeSaved: (id: string) => void;
  applyCoupon: (c: AppliedCoupon) => void;
  removeCoupon: () => void;
  clear: () => void;
}

const CartContext = createContext<CartState>({
  items: [],
  saved: [],
  coupon: null,
  count: 0,
  subtotal: 0,
  bySeller: [],
  add: () => {},
  remove: () => {},
  setQty: () => {},
  saveForLater: () => {},
  moveToCart: () => {},
  removeSaved: () => {},
  applyCoupon: () => {},
  removeCoupon: () => {},
  clear: () => {},
});

const load = (key: string): CartItem[] => {
  try {
    // migrate old ekharayo keys once
    const raw = localStorage.getItem(key) ?? localStorage.getItem(key.replace("adda-", "ekharayo-")) ?? "[]";
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => load("adda-cart"));
  const [saved, setSaved] = useState<CartItem[]>(() => load("adda-saved"));
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(() => {
    try {
      const raw = localStorage.getItem("adda-coupon") ?? localStorage.getItem("ekharayo-coupon") ?? "null";
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  useEffect(() => localStorage.setItem("adda-cart", JSON.stringify(items)), [items]);
  useEffect(() => localStorage.setItem("adda-saved", JSON.stringify(saved)), [saved]);
  useEffect(() => localStorage.setItem("adda-coupon", JSON.stringify(coupon)), [coupon]);

  const add: CartState["add"] = (item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + qty } : i));
      return [...prev, { ...item, quantity: qty }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const setQty = (id: string, qty: number) =>
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))));

  const saveForLater = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) setSaved((s) => (s.some((x) => x.id === id) ? s : [...s, item]));
      return prev.filter((i) => i.id !== id);
    });
    toast.success("Saved for later");
  };

  const moveToCart = (id: string) => {
    setSaved((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        setItems((its) => {
          const existing = its.find((i) => i.id === id);
          if (existing) return its.map((i) => (i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i));
          return [...its, item];
        });
      }
      return prev.filter((i) => i.id !== id);
    });
    toast.success("Moved to cart");
  };

  const removeSaved = (id: string) => setSaved((prev) => prev.filter((i) => i.id !== id));
  const applyCoupon = (c: AppliedCoupon) => setCoupon(c);
  const removeCoupon = () => setCoupon(null);
  const clear = () => {
    setItems([]);
    setCoupon(null);
  };

  const { count, subtotal, bySeller } = useMemo(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const map = new Map<string, { sellerId: string; sellerName: string; sellerSlug?: string; items: CartItem[]; subtotal: number }>();
    for (const item of items) {
      const sid = item.sellerId || "platform";
      const sname = item.sellerName || "ADDA Marketplace";
      if (!map.has(sid)) {
        map.set(sid, { sellerId: sid, sellerName: sname, sellerSlug: item.sellerSlug, items: [], subtotal: 0 });
      }
      const g = map.get(sid)!;
      g.items.push(item);
      g.subtotal += item.price * item.quantity;
    }
    return { count, subtotal, bySeller: Array.from(map.values()) };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        saved,
        coupon,
        count,
        subtotal,
        bySeller,
        add,
        remove,
        setQty,
        saveForLater,
        moveToCart,
        removeSaved,
        applyCoupon,
        removeCoupon,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
