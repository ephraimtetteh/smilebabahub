// src/hooks/useViewCountry.ts
// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for country/currency in the UI.
//
// Resolution priority:
//   1. adminViewCountry  — admin has toggled the country switcher (overrides all)
//   2. user.country      — logged-in user's IP-detected country
//   3. guestCountry      — unauthenticated visitor's IP-detected country
//   4. "Ghana"           — safe fallback (always produces results)
//
// Every component/page that needs country or currency should import this hook.
// When the admin switches country, ALL consumers re-render automatically.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useAppSelector } from "@/src/app/redux";

export type ViewCountry = "Ghana" | "Nigeria";
export type ViewCurrency = "GHS" | "NGN";

export function useViewCountry() {
  const country: ViewCountry = useAppSelector((s) => {
    const admin = (s.auth as any)?.adminViewCountry as string | undefined;
    const user = s.auth?.user?.country;
    const guest = (s.auth as any)?.guestCountry as string | undefined;
    const raw = admin || user || guest || "Ghana";
    // Normalise to canonical names
    return raw.toLowerCase().includes("nigeria") ? "Nigeria" : "Ghana";
  });

  const currency: ViewCurrency = country === "Nigeria" ? "NGN" : "GHS";
  const sym: string = currency === "NGN" ? "₦" : "₵";

  const isNigeria = country === "Nigeria";
  const isGhana = country === "Ghana";

  // Country-specific payment endpoint segment
  const paymentRegion = currency === "NGN" ? "ng" : "gh";

  return { country, currency, sym, isNigeria, isGhana, paymentRegion };
}
