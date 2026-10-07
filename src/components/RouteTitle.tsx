import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TITLES: [RegExp, string, string][] = [
  [/^\/products\/?$/, "All Products", "Shop electronics, fashion, shoes, beauty and more from sellers across Nepal."],
  [/^\/sellers/, "Explore Shops", "Discover trusted shops and sellers across Nepal on ADDA."],
  [/^\/become-seller/, "Become a Seller", "Open your online shop on ADDA and reach customers across Nepal."],
  [/^\/about/, "About Us", "Learn about ADDA, Nepal's multi-vendor marketplace."],
  [/^\/contact/, "Contact", "Get in touch with the ADDA team."],
  [/^\/gallery/, "Gallery", "Photos from ADDA."],
  [/^\/cart/, "Your Cart", "Review the items in your cart."],
  [/^\/wishlist/, "Wishlist", "Products you saved for later."],
  [/^\/checkout/, "Checkout", "Complete your order securely."],
  [/^\/my-orders/, "My Orders", "Track your orders and deliveries."],
  [/^\/seller/, "Seller Center", "Manage your shop on ADDA."],
  [/^\/admin/, "Admin", "ADDA platform dashboard."],
  [/^\/auth/, "Sign In", "Sign in to your ADDA account."],
  [/^\/bulk-order/, "Bulk Order", "Place bulk orders on ADDA."],
];

/** Sets a sensible per-page title/description; pages with their own data may override. */
const RouteTitle = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const hit = TITLES.find(([re]) => re.test(pathname));
    if (!hit) return;
    document.title = `${hit[1]} | ADDA`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", hit[2]);
  }, [pathname]);
  return null;
};
export default RouteTitle;
