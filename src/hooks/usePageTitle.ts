import { useEffect } from "react";

const SITE = "ADDA";

/** Sets document.title for SEO (per-page titles in search results). */
export function usePageTitle(title?: string, description?: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} | ${SITE}` : `${SITE} | Sabai Seller, Eutai Adda`;

    let meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? null;
    if (description && meta) meta.setAttribute("content", description);

    return () => {
      document.title = prev;
      if (meta && prevDesc != null) meta.setAttribute("content", prevDesc);
    };
  }, [title, description]);
}
