import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store, CheckCircle2, Loader2 } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useLang } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BecomeSeller = () => {
  const { t } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    shopName: "",
    description: "",
    address: "",
    category: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.shopName) {
      toast.error("Please fill required fields");
      return;
    }
    if (!user) {
      toast.error("Please sign in to apply");
      navigate("/auth?redirect=/become-seller");
      return;
    }
    setBusy(true);
    const slug = `${form.shopName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString(36).slice(-4)}`;
    const { error } = await supabase.from("shops").insert({
      owner_id: user.id,
      name: form.shopName,
      slug,
      city: form.address || null,
      description: [form.description, `Contact: ${form.fullName}, ${form.phone}${form.email ? ", " + form.email : ""}`, form.category && `Category: ${form.category}`].filter(Boolean).join("\n"),
      status: "pending",
    });
    setBusy(false);
    if (error) return toast.error(error.message.includes("duplicate") ? "You already have a shop application" : error.message);
    setSubmitted(true);
    toast.success("Application received! We'll review and notify you.");
  };

  const field =
    "w-full border border-border rounded-lg px-3 py-2.5 font-body text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";

  if (submitted) {
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-16 max-w-lg text-center">
          <CheckCircle2 className="mx-auto text-primary mb-4" size={48} />
          <h1 className="font-display text-2xl font-bold mb-2">Application submitted</h1>
          <p className="font-body text-muted-foreground text-sm mb-6">
            Thank you for applying to sell on ADDA. Our team will review your shop details. Status: <strong>Pending</strong>.
          </p>
          <Link to="/" className="inline-flex bg-primary text-primary-foreground font-semibold text-sm px-5 py-2.5 rounded-xl">
            Back to ADDA
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-10 max-w-xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Store className="text-primary" size={28} />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            {t("becomeSeller") || "Become an ADDA Seller"}
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            Ma mero pasal ADDA ma rakhna sakchu. Open your digital shop and reach buyers across Nepal.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div>
            <label className="font-body text-xs font-medium text-muted-foreground">Full name *</label>
            <input className={field} value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-body text-xs font-medium text-muted-foreground">Phone *</label>
              <input className={field} value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
            </div>
            <div>
              <label className="font-body text-xs font-medium text-muted-foreground">Email</label>
              <input type="email" className={field} value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
          </div>
          <div>
            <label className="font-body text-xs font-medium text-muted-foreground">Shop name *</label>
            <input className={field} value={form.shopName} onChange={(e) => set("shopName", e.target.value)} required placeholder="e.g. Kathmandu Sports" />
          </div>
          <div>
            <label className="font-body text-xs font-medium text-muted-foreground">Shop description</label>
            <textarea rows={3} className={`${field} resize-none`} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div>
            <label className="font-body text-xs font-medium text-muted-foreground">Address</label>
            <input className={field} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="City / District" />
          </div>
          <div>
            <label className="font-body text-xs font-medium text-muted-foreground">Main category</label>
            <select className={field} value={form.category} onChange={(e) => set("category", e.target.value)}>
              <option value="">Select category</option>
              <option>Fashion</option>
              <option>Jerseys & Sports</option>
              <option>Electronics</option>
              <option>Mobiles</option>
              <option>Beauty</option>
              <option>Home & Living</option>
              <option>Grocery</option>
              <option>Books</option>
              <option>Kids</option>
              <option>Automotive</option>
              <option>Accessories</option>
            </select>
          </div>

          <p className="font-body text-[11px] text-muted-foreground">
            After submit, status is <strong>Pending</strong>. Admin approves before you can list products.
          </p>

          <button
            type="submit"
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-body text-sm font-semibold py-3 rounded-xl disabled:opacity-60"
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Store size={16} />}
            Submit application
          </button>
        </form>
      </div>
    </PageShell>
  );
};

export default BecomeSeller;
