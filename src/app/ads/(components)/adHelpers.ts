// src/components/ads/ProductDetail/adHelpers.ts

import { AdMode } from "@/src/types/ad.types";


/** Map category string → AdMode */
const CATEGORY_MODE: Record<string, AdMode> = {
  marketplace: "marketplace",
  food: "food",
  apartments: "apartments",
  fashion: "fashion",
  delivery: "delivery",
  pharmacy: "pharmacy",
  services: "services",
};

/** Resolve display mode from ad category + current URL pathname */
export function resolveMode(
  category: string | undefined,
  pathname: string,
): AdMode {
  const path = pathname.toLowerCase();

  if (
    path.includes("restate") ||
    path.includes("apartment") ||
    category === "apartments"
  ) {
    return "apartments";
  }
  if (path.includes("food") || category === "food") return "food";
  if (category && CATEGORY_MODE[category]) return CATEGORY_MODE[category];

  return "marketplace";
}

/** Returns the currency symbol for a given currency code */
export function currencySym(currency?: string): string {
  return currency === "NGN" ? "₦" : "₵";
}
