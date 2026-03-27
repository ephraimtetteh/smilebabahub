// src/components/ads/ad.constants.ts
import { AdCondition } from "@/src/types/ad.types";

export const CATEGORIES = [
  { id: "all", label: "All", icon: "🏪" },
  { id: "marketplace", label: "Marketplace", icon: "🛍️" },
  { id: "food", label: "Food", icon: "🍔" },
  { id: "apartments", label: "Apartments", icon: "🏠" },
] as const;

export const CONDITIONS: { id: AdCondition | "all"; label: string }[] = [
  { id: "all", label: "Any condition" },
  { id: "brand_new", label: "Brand new" },
  { id: "foreign_used", label: "Foreign used" },
  { id: "local_used", label: "Local used" },
  { id: "refurbished", label: "Refurbished" },
];

export const SORT_OPTIONS = [
  { id: "newest", label: "Newest first" },
  { id: "price_asc", label: "Price: Low → High" },
  { id: "price_desc", label: "Price: High → Low" },
  { id: "popular", label: "Most viewed" },
] as const;

export const CONDITION_LABELS: Record<string, string> = {
  brand_new: "Brand New",
  foreign_used: "Foreign Used",
  local_used: "Local Used",
  refurbished: "Refurbished",
  not_applicable: "—",
};

export const BOOST_BADGE: Record<
  string,
  { label: string; cls: string; cardCls: string }
> = {
  premium: {
    label: "⭐ Premium Featured",
    cls: "bg-purple-100 text-purple-700 border-purple-200",
    cardCls: "bg-purple-500 text-white",
  },
  featured: {
    label: "🔵 Promoted",
    cls: "bg-blue-100 text-blue-700 border-blue-200",
    cardCls: "bg-blue-500 text-white",
  },
  standard: {
    label: "🔶 Boosted",
    cls: "bg-amber-100 text-amber-700 border-amber-200",
    cardCls: "bg-amber-400 text-black",
  },
};

export const BOOST_TIERS = [
  {
    tier: "standard" as const,
    label: "Standard Boost",
    desc: "Appear higher in search results",
    days: 7,
    icon: "🔶",
  },
  {
    tier: "featured" as const,
    label: "Featured",
    desc: "Promoted badge + priority placement",
    days: 14,
    icon: "🔵",
  },
  {
    tier: "premium" as const,
    label: "Premium",
    desc: "Top of all results + homepage feature",
    days: 30,
    icon: "⭐",
  },
];

export const TIER_SORT: Record<string, number> = {
  premium: 3,
  featured: 2,
  standard: 1,
};

export function formatAdPrice(
  amount: number | undefined,
  currency: string | undefined,
  display?: string,
): string {
  if (display) return display;
  const sym = currency === "NGN" ? "₦" : "₵";
  return `${sym}${Number(amount ?? 0).toLocaleString()}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
