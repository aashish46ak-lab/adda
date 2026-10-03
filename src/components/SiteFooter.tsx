import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import { useSiteSettings, getBranding, getSocial } from "@/hooks/useSiteSettings";

/** Footer — ADDA branding + social */
const SiteFooter = () => {
  const { settings } = useSiteSettings();
  const branding = getBranding(settings);
  const social = getSocial(settings);
  const footerText = (settings.footer?.text as string) || "";

  const hasSocial = social.facebook || social.instagram || social.tiktok || social.youtube;
  const logoSrc = "/adda-logo.png";

  return (
    <footer className="border-t border-border bg-card/50 py-8">
      <div className="container mx-auto px-4 flex flex-col items-center gap-3 text-center">
        <Link to="/" className="inline-flex items-center">
          <img src={logoSrc} alt="ADDA" className="h-12 w-auto" loading="lazy" />
        </Link>
        <p className="font-body text-xs text-muted-foreground max-w-md">
          {footerText ||
            "Nepal's multi-vendor marketplace. Seller haru ko digital Adda. Many sellers, one place."}
        </p>

        {hasSocial ? (
          <div className="flex items-center gap-3">
            {social.facebook ? (
              <a href={social.facebook} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={16} />
              </a>
            ) : null}
            {social.instagram ? (
              <a href={social.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={16} />
              </a>
            ) : null}
            {social.tiktok ? (
              <a href={social.tiktok} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="TikTok">
                <MessageCircle size={16} />
              </a>
            ) : null}
            {social.youtube ? (
              <a href={social.youtube} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="YouTube">
                <Youtube size={16} />
              </a>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
          <Link to="/about" className="hover:text-primary">About</Link>
          <Link to="/sellers" className="hover:text-primary">Explore Sellers</Link>
          <Link to="/become-seller" className="hover:text-primary">Become a Seller</Link>
          <Link to="/policy/privacy" className="hover:text-primary">Privacy</Link>
          <Link to="/policy/terms" className="hover:text-primary">Terms</Link>
          <Link to="/contact" className="hover:text-primary">Contact</Link>
        </div>

        <p className="font-body text-xs text-muted-foreground">
          © {new Date().getFullYear()} ADDA. All Rights Reserved.
        </p>
        <p className="font-body text-[11px] text-muted-foreground/70">Sabai Seller, Eutai Adda</p>
      </div>
    </footer>
  );
};

export default SiteFooter;
