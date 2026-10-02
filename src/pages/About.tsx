import Navbar from "@/components/Navbar";
import PageShell from "@/components/PageShell";
import ScrollToTop from "@/components/ScrollToTop";
import SiteFooter from "@/components/SiteFooter";
import { Link } from "react-router-dom";
import {
  ShieldCheck, Globe2, Handshake, Store, Users, BadgeCheck, Tag, Headset,
  Lock, Sparkles, HeartHandshake, PackageSearch, Target, Eye,
} from "lucide-react";

const values = [
  { icon: Store, title: "Many Sellers, One Adda", desc: "Independent shops list products in one place so buyers can discover and compare easily." },
  { icon: ShieldCheck, title: "Trust & Transparency", desc: "Clear product info, verified sellers where possible, and accountable order handling." },
  { icon: Globe2, title: "Nationwide Reach", desc: "Shop from sellers across Nepal — fashion, electronics, jerseys, beauty and more." },
  { icon: Handshake, title: "Grow With Partners", desc: "We help sellers open digital shops and reach more customers." },
];

const whyUs = [
  { icon: BadgeCheck, title: "Trusted Marketplace", desc: "One platform for many sellers with a consistent shopping experience." },
  { icon: PackageSearch, title: "Wide Catalogue", desc: "Products from different shops in categories that matter to you." },
  { icon: Tag, title: "Fair Pricing", desc: "Compare options and find deals from independent sellers." },
  { icon: Headset, title: "Support", desc: "Help when you need it — before and after purchase." },
  { icon: Lock, title: "Secure Experience", desc: "Straightforward ordering with protected account data." },
  { icon: Sparkles, title: "Always Improving", desc: "New sellers, categories and features keep landing on ADDA." },
  { icon: HeartHandshake, title: "Customer First", desc: "Your trust is how we measure success." },
  { icon: Users, title: "Built for Nepal", desc: "Designed for Nepali shoppers and sellers — Sabai Seller, Eutai Adda." },
];

const About = () => (
  <div className="min-h-screen pt-14">
    <Navbar />
    <PageShell title="About ADDA" subtitle="Nepal's multi-vendor marketplace — Sabai Seller, Eutai Adda">
      <div className="container mx-auto px-4 py-16 space-y-16">
        <section className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold">What is ADDA?</h2>
          <p className="font-body text-base text-foreground/80 leading-relaxed">
            <strong className="text-primary">ADDA</strong> is a digital gathering place for sellers and buyers.
            Open a shop, list products, and reach customers across Nepal — or browse many sellers in one cart.
          </p>
          <p className="font-body text-base text-foreground/80 leading-relaxed">
            Ma mero pasal ADDA ma rakhna sakchu. Whether you sell jerseys, gadgets, fashion or home goods,
            ADDA is built so your shop can grow online.
          </p>
        </section>

        <section>
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold">What we stand for</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card rounded-xl border border-border p-8 text-center shadow-sm">
                <div className="w-14 h-14 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Icon className="text-primary" size={28} />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl border border-border p-8">
            <Target className="text-primary mb-4" size={24} />
            <h3 className="font-display text-xl font-bold mb-3">Mission</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Make it easy for anyone in Nepal to open a digital shop and for customers to discover products from many sellers in one place.
            </p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-8">
            <Eye className="text-primary mb-4" size={24} />
            <h3 className="font-display text-xl font-bold mb-3">Vision</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Become Nepal's go-to multi-vendor marketplace — trusted by shoppers and empowering for sellers.
            </p>
          </div>
        </section>

        <section>
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold">Why ADDA</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {whyUs.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <Icon className="text-primary mb-3" size={26} />
                <h3 className="font-display text-base font-bold mb-1.5">{title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center flex flex-wrap justify-center gap-3">
          <Link to="/sellers" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl">
            <Store size={18} /> Explore Sellers
          </Link>
          <Link to="/become-seller" className="inline-flex items-center gap-2 border border-border font-semibold px-6 py-3 rounded-xl">
            Become a Seller
          </Link>
        </div>
      </div>
    </PageShell>
    <SiteFooter />
    <ScrollToTop />
  </div>
);

export default About;
