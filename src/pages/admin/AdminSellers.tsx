import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { rs } from "@/lib/media";

interface Shop { id: string; name: string; city: string | null; status: string; commission_rate: number; owner_id: string | null; created_at: string }
interface Item { id: string; shop_id: string | null; product_name: string; line_total: number; commission: number; seller_payout: number; payout_status: string; fulfillment_status: string }

const AdminSellers = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    const [{ data: s }, { data: i }] = await Promise.all([
      supabase.from("shops").select("id,name,city,status,commission_rate,owner_id,created_at").order("created_at", { ascending: false }),
      supabase.from("order_items").select("id,shop_id,product_name,line_total,commission,seller_payout,payout_status,fulfillment_status").not("shop_id", "is", null),
    ]);
    setShops((s as Shop[]) ?? []); setItems((i as Item[]) ?? []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const update = async (id: string, patch: Partial<Shop>) => {
    const { error } = await supabase.from("shops").update(patch).eq("id", id);
    error ? toast.error(error.message) : toast.success("Shop updated"); load();
  };
  const payOut = async (shopId: string) => {
    const { error } = await supabase.from("order_items").update({ payout_status: "paid" }).eq("shop_id", shopId).eq("fulfillment_status", "delivered").neq("payout_status", "paid");
    error ? toast.error(error.message) : toast.success("Delivered orders marked as paid out"); load();
  };

  const totals = (id: string) => {
    const mine = items.filter((i) => i.shop_id === id && i.fulfillment_status !== "cancelled");
    return {
      sales: mine.reduce((a, i) => a + Number(i.line_total), 0),
      commission: mine.reduce((a, i) => a + Number(i.commission), 0),
      due: mine.filter((i) => i.fulfillment_status === "delivered" && i.payout_status !== "paid").reduce((a, i) => a + Number(i.seller_payout), 0),
    };
  };
  const list = shops.filter((s) => filter === "all" || s.status === filter);
  const pending = shops.filter((s) => s.status === "pending").length;
  const allCommission = items.filter((i) => i.fulfillment_status !== "cancelled").reduce((a, i) => a + Number(i.commission), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Sellers</h1>
        <p className="text-sm text-muted-foreground">{shops.length} shops · {pending} awaiting approval · {rs(allCommission)} commission earned</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {["all", "pending", "approved", "rejected", "suspended"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-md px-3 py-2 text-xs font-semibold capitalize ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{f}</button>
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {list.map((s) => {
          const t = totals(s.id);
          return (
            <div key={s.id} className="space-y-3 rounded-lg border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display font-bold">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.city ?? "—"} · Applied {new Date(s.created_at).toLocaleDateString()} {s.owner_id ? "" : "· No owner account"}</p>
                </div>
                <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-bold uppercase">{s.status}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><p className="text-muted-foreground">Sales</p><p className="font-bold">{rs(t.sales)}</p></div>
                <div><p className="text-muted-foreground">Commission</p><p className="font-bold">{rs(t.commission)}</p></div>
                <div><p className="text-muted-foreground">Payout due</p><p className="font-bold">{rs(t.due)}</p></div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {s.status !== "approved" && <Button size="sm" onClick={() => update(s.id, { status: "approved" })}>Approve</Button>}
                {s.status === "pending" && <Button size="sm" variant="outline" onClick={() => update(s.id, { status: "rejected" })}>Reject</Button>}
                {s.status === "approved" && <Button size="sm" variant="outline" onClick={() => update(s.id, { status: "suspended" })}>Hide shop</Button>}
                {t.due > 0 && <Button size="sm" variant="secondary" onClick={() => payOut(s.id)}>Mark paid</Button>}
                <label className="ml-auto flex items-center gap-1 text-xs">Fee %
                  <input type="number" defaultValue={s.commission_rate} onBlur={(e) => Number(e.target.value) !== s.commission_rate && update(s.id, { commission_rate: Number(e.target.value) })} className="w-16 rounded-md border border-border bg-muted px-2 py-1" />
                </label>
              </div>
            </div>
          );
        })}
        {list.length === 0 && <p className="text-sm text-muted-foreground">No shops here.</p>}
      </div>
    </div>
  );
};
export default AdminSellers;
