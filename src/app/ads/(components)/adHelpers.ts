// src/components/ads/ProductDetail/adHelpers.ts

import { AdMode } from "@/src/types/ad.types";


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
  return "marketplace";
}

/** Returns the currency symbol for a given currency code */
export function currencySym(currency?: string): string {
  return currency === "NGN" ? "₦" : "₵";
}
