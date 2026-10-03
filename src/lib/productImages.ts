import dairy from "@/assets/dairy.jpg";
import goat from "@/assets/goat.jpg";
import chicken from "@/assets/chicken.jpg";
import crops from "@/assets/crops.jpg";
import phone from "@/assets/category-phone.jpg";
import headphones from "@/assets/category-headphones.jpg";
import fashion from "@/assets/category-fashion.jpg";
import shoes from "@/assets/category-shoes.jpg";
import beauty from "@/assets/category-beauty.jpg";
import home from "@/assets/category-home.jpg";
import sports from "@/assets/category-sports.jpg";
import { isVideoUrl } from "@/lib/media";

/** Temporary product photos until admin uploads real ones. */
export function productPlaceholder(name: string, categoryHint = ""): string {
  const s = `${name} ${categoryHint}`.toLowerCase();
  if (/phone|vivo|samsung|iphone|mobile/.test(s)) return phone;
  if (/headphone|earbud|audio/.test(s)) return headphones;
  if (/shoe|sneaker|footwear/.test(s)) return shoes;
  if (/jersey|sport|football/.test(s)) return sports;
  if (/beauty|skincare|cosmetic/.test(s)) return beauty;
  if (/home|kitchen|mixer|appliance/.test(s)) return home;
  if (/shirt|fashion|dress|clothing/.test(s)) return fashion;
  if (/goat|khasi|masu|mutton/.test(s)) return goat;
  if (/chicken|kukhura|egg|anda|poultry/.test(s)) return chicken;
  if (/rice|wheat|crop|vegetable|chamal|gahu|grain|dal/.test(s)) return crops;
  return dairy;
}

/** First displayable image (skip video), else smart placeholder. */
export function productCover(images: string[] | null | undefined, name: string, categoryHint = ""): string {
  const list = images ?? [];
  const photo = list.find((u) => u && !isVideoUrl(u));
  if (photo) return photo;
  if (list[0] && !isVideoUrl(list[0])) return list[0];
  return productPlaceholder(name, categoryHint);
}
