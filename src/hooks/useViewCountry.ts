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
    const userCountry = s.auth?.user?.country;
    const guest = (s.auth as any)?.guestCountry as string | undefined;

    // Only trust user.country if it's a known valid value — never use "Unknown",
    // "", "detecting…" or any other bad value that got stored during a CPU spike.
    const VALID_COUNTRIES = ["Ghana", "Nigeria"];
    const validUserCountry = VALID_COUNTRIES.includes(userCountry ?? "")
      ? userCountry
      : undefined;

    const raw = admin || validUserCountry || guest || "Ghana";
    return raw.toLowerCase().includes("nigeria") ? "Nigeria" : "Ghana";
  });

  // True while GuestLocationDetector is waiting for /auth/guest-country response.
  // Components should NOT fire country-scoped fetches while this is true —
  // they'd use the "Ghana" default and then need to refetch when country arrives.
  const guestDetecting = useAppSelector(
    (s) => ((s.auth as any)?.guestDetecting as boolean) ?? false,
  );

  const currency: ViewCurrency = country === "Nigeria" ? "NGN" : "GHS";
  const sym: string = currency === "NGN" ? "₦" : "₵";
  const isNigeria = country === "Nigeria";
  const isGhana = country === "Ghana";
  const paymentRegion = currency === "NGN" ? "ng" : "gh";

  return {
    country,
    currency,
    sym,
    isNigeria,
    isGhana,
    paymentRegion,
    guestDetecting,
  };
}
