export interface SearchItem {
  title: string;
  description: string;
  category: "product" | "page" | "category" | "seller";
  href: string;
  keywords: string[];
}

/** Static marketplace suggestions (live products come from Supabase in SmartSearchBar) */
export const searchItems: SearchItem[] = [
  { title: "Football Jersey", description: "Nepal & club jerseys", category: "product", href: "/products", keywords: ["jersey", "football", "nepal jersey", "sports", "kit"] },
  { title: "Mobile Phones", description: "Smartphones & accessories", category: "category", href: "/products", keywords: ["mobile", "phone", "smartphone", "iphone", "android", "फोन"] },
  { title: "Electronics", description: "Gadgets & devices", category: "category", href: "/products", keywords: ["electronics", "gadget", "earbuds", "charger", "power bank"] },
  { title: "Fashion", description: "Clothes & style", category: "category", href: "/products", keywords: ["fashion", "clothes", "shirt", "kurta", "jacket", "कपडा"] },
  { title: "Beauty", description: "Skincare & cosmetics", category: "category", href: "/products", keywords: ["beauty", "skincare", "cream", "makeup", "सौन्दर्य"] },
  { title: "Shoes", description: "Sneakers & footwear", category: "category", href: "/products", keywords: ["shoes", "sneakers", "boots", "जूता"] },
  { title: "Home & Living", description: "Home essentials", category: "category", href: "/products", keywords: ["home", "living", "bedsheet", "kitchen", "घर"] },
  { title: "Kathmandu Sports", description: "Sports seller on ADDA", category: "seller", href: "/shop/kathmandu-sports", keywords: ["kathmandu sports", "seller", "jersey seller"] },
  { title: "Nepal Gadget House", description: "Electronics seller", category: "seller", href: "/shop/nepal-gadget-house", keywords: ["gadget", "electronics seller"] },
  { title: "Explore Sellers", description: "Browse all shops", category: "page", href: "/sellers", keywords: ["sellers", "shops", "stores", "पसल", "explore"] },
  { title: "Become a Seller", description: "Open your shop on ADDA", category: "page", href: "/become-seller", keywords: ["sell", "seller", "shop", "register", "बेच्नु"] },
  { title: "My Orders", description: "Track your orders", category: "page", href: "/my-orders", keywords: ["orders", "track", "delivery", "अर्डर"] },
  { title: "Cart", description: "Your shopping cart", category: "page", href: "/cart", keywords: ["cart", "basket", "checkout"] },
  { title: "Contact", description: "Help & support", category: "page", href: "/contact", keywords: ["contact", "help", "support", "सम्पर्क"] },
];

function fuzzyMatch(text: string, query: string): boolean {
  if (text.includes(query)) return true;
  if (query.length >= 3) {
    for (let i = 0; i <= text.length - query.length + 1; i++) {
      const sub = text.slice(i, i + query.length);
      let diff = 0;
      for (let j = 0; j < query.length; j++) {
        if (sub[j] !== query[j]) diff++;
      }
      if (diff <= 1) return true;
    }
  }
  return false;
}

export function searchQuery(query: string): { results: SearchItem[]; didYouMean: string | null } {
  const q = query.toLowerCase().trim();
  if (!q) return { results: [], didYouMean: null };

  const scored: { item: SearchItem; score: number }[] = [];

  for (const item of searchItems) {
    let bestScore = 0;
    const titleLower = item.title.toLowerCase();
    const descLower = item.description.toLowerCase();

    if (titleLower.includes(q)) bestScore = Math.max(bestScore, 100);
    if (titleLower.startsWith(q)) bestScore = Math.max(bestScore, 110);

    for (const kw of item.keywords) {
      const kwLower = kw.toLowerCase();
      if (kwLower === q) bestScore = Math.max(bestScore, 95);
      else if (kwLower.includes(q)) bestScore = Math.max(bestScore, 80);
      else if (q.includes(kwLower)) bestScore = Math.max(bestScore, 70);
    }

    if (descLower.includes(q)) bestScore = Math.max(bestScore, 50);

    if (bestScore === 0) {
      for (const kw of item.keywords) {
        if (fuzzyMatch(kw.toLowerCase(), q)) {
          bestScore = Math.max(bestScore, 40);
          break;
        }
      }
    }
    if (bestScore === 0 && fuzzyMatch(titleLower, q)) bestScore = 30;

    if (bestScore > 0) scored.push({ item, score: bestScore });
  }

  scored.sort((a, b) => b.score - a.score);
  const results = scored.map((s) => s.item);

  let didYouMean: string | null = null;
  if (results.length === 0 && q.length >= 2) {
    let bestDist = Infinity;
    for (const item of searchItems) {
      for (const kw of item.keywords) {
        const k = kw.toLowerCase();
        if (Math.abs(k.length - q.length) > 2) continue;
        let dist = 0;
        for (let i = 0; i < Math.min(k.length, q.length); i++) {
          if (k[i] !== q[i]) dist++;
        }
        dist += Math.abs(k.length - q.length);
        if (dist < bestDist && dist <= 3) {
          bestDist = dist;
          didYouMean = item.title;
        }
      }
    }
  }

  return { results: results.slice(0, 12), didYouMean };
}
