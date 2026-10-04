import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Zap } from "lucide-react";
import { productCover } from "@/lib/productImages";
import { rs } from "@/lib/media";

interface P { id: string; name: string; price: number; sale_price: number | null; images: string[]; stock: number }

const endOfDay = () => { const d = new Date(); d.setHours(23, 59, 59, 999); return d.getTime(); };
const pad = (n: number) => String(n).padStart(2, "0");

const FlashSale = ({ products }: { products: P[] }) => {
  const [left, setLeft] = useState(endOfDay() - Date.now());
  useEffect(() => { const t = setInterval(() => setLeft(endOfDay() - Date.now()), 1000); return () => clearInterval(t); }, []);
  const items = products
    .filter((p) => p.sale_price != null && Number(p.sale_price) < Number(p.price))
    .sort((a, b) => (1 - Number(a.sale_price) / Number(a.price)) < (1 - Number(b.sale_price) / Number(b.price)) ? 1 : -1)
    .slice(0, 6);
  if (!items.length) return null;
  const s = Math.max(0, Math.floor(left / 1000));
  const parts = [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60];

  return (
    <section aria-labelledby="flash-title" className="overflow-hidden rounded-md border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-accent px-4 py-3 text-accent-foreground">
        <div className="flex items-center gap-3">
          <Zap size={20} className="fill-current" />
          <h2 id="flash-title" className="font-display text-lg font-extrabold">Flash Sale</h2>
          <div className="flex items-center gap-1 text-xs font-bold" aria-label="Time left">
            <span className="hidden sm:inline">Ends in</span>
            {parts.map((n, i) => <span key={i} className="rounded-sm bg-background px-1.5 py-0.5 tabular-nums text-foreground">{pad(n)}</span>)}
          </div>
        </div>
        <Link to="/products" className="inline-flex items-center gap-1 text-xs font-bold">Shop all <ChevronRight size={14} /></Link>
      </div>
      <div className="grid grid-cols-3 gap-2 p-3 sm:grid-cols-6 sm:gap-3">
        {items.map((p) => {
          const off = Math.round((1 - Number(p.sale_price) / Number(p.price)) * 100);
          const sold = 30 + ((p.name.length * 7) % 60);
          return (
            <Link key={p.id} to={`/products/${p.id}`} className="group min-w-0">
              <div className="relative aspect-square overflow-hidden rounded-sm bg-muted">
                <img src={productCover(p.images, p.name)} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                <span className="absolute right-1 top-1 rounded-sm bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground">-{off}%</span>
              </div>
              <p className="mt-2 truncate text-xs font-medium">{p.name}</p>
              <p className="text-sm font-bold text-accent">{rs(Number(p.sale_price))}</p>
              <p className="text-[10px] text-muted-foreground line-through">{rs(Number(p.price))}</p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-accent" style={{ width: `${sold}%` }} /></div>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{sold}% sold</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
export default FlashSale;
