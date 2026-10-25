// src/lib/aliexpress.ts
//
// SmileBaba Global — AliExpress products in our own pages.
//
// The website only talks to OUR backend (/aliexpress/*); the AliExpress
// keys never reach the browser. "Buy on AliExpress" goes to our backend's
// /aliexpress/go/:id, which redirects through the tracked link — that's
// what earns SmileBaba the commission.

import axiosInstance from "@/src/lib/api/axios";

export interface GlobalProduct {
  id: string;
  source: "aliexpress";
  title: string;
  image: string;
  images: string[];
  price: {
    usd: number;
    usdWas: number | null;
    local: number | null;
    localWas: number | null;
    currency: "GHS" | "NGN";
    approximate: boolean;
  };
  discount: string | null;
  rating: number | null;
  orders: number;
  shipDays: number | null;
  category: string | null;
  shop: string | null;
}

export type GlobalSort = "popular" | "price_asc" | "price_desc";

export const GLOBAL_DEPARTMENTS: { id: string; label: string; q: string }[] = [
  { id: "all", label: "Top picks", q: "" },
  { id: "phone", label: "Phone accessories", q: "phone accessories" },
  { id: "electronics", label: "Electronics", q: "electronics gadgets" },
  { id: "women", label: "Women", q: "women fashion" },
  { id: "men", label: "Men", q: "men fashion" },
  { id: "beauty", label: "Beauty", q: "beauty makeup" },
  { id: "hair", label: "Hair & wigs", q: "human hair wig" },
  { id: "home", label: "Home & kitchen", q: "home kitchen" },
  { id: "watches", label: "Watches", q: "watch" },
  { id: "bags", label: "Bags & shoes", q: "bags shoes" },
  { id: "kids", label: "Kids & baby", q: "baby kids" },
  { id: "sports", label: "Sports", q: "sports fitness" },
];

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/smilebaba").replace(/\/+$/, "");

/** The website's "Buy on AliExpress" href — our backend builds the tracked link. */
export function buyHref(id: string, title?: string) {
  const t = title ? `?t=${encodeURIComponent(title.slice(0, 120))}` : "";
  return `${API_BASE}/aliexpress/go/${encodeURIComponent(id)}${t}`;
}

/** AliExpress serves smaller copies when you add _<w>x<h>.jpg */
export const aeThumb = (url: string, size = 350) =>
  /\.(jpe?g|png|webp)$/i.test(url) ? `${url}_${size}x${size}.jpg` : url;

export const formatLocal = (p: GlobalProduct["price"], which: "now" | "was" = "now") => {
  const local = which === "now" ? p.local : p.localWas;
  const usd = which === "now" ? p.usd : p.usdWas;
  if (local) return `${p.currency === "NGN" ? "₦" : "GH₵"}${local.toLocaleString()}`;
  return usd ? `US$${usd.toFixed(2)}` : "";
};

export async function fetchGlobalStatus(): Promise<boolean> {
  try {
    const { data } = await axiosInstance.get("/aliexpress/status");
    return !!data?.enabled;
  } catch {
    return false;
  }
}

export async function fetchGlobalProducts(opts: {
  q?: string;
  page?: number;
  sort?: GlobalSort;
  country?: string;
}) {
  const { data } = await axiosInstance.get("/aliexpress/products", {
    params: {
      q: opts.q?.trim() || undefined,
      page: opts.page ?? 1,
      sort: opts.sort ?? "popular",
      country: opts.country || undefined,
    },
  });
  return {
    enabled: !!data?.enabled,
    items: (Array.isArray(data?.items) ? data.items : []) as GlobalProduct[],
    page: Number(data?.page ?? 1),
    hasMore: !!data?.hasMore,
  };
}

export async function fetchGlobalProduct(id: string, country?: string) {
  const { data } = await axiosInstance.get(`/aliexpress/products/${encodeURIComponent(id)}`, {
    params: { country: country || undefined },
  });
  return data?.item as GlobalProduct;
}
