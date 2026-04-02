// src/hooks/useViewCountry.ts
// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for country/currency in the UI.
//
// Resolution priority:
//   1. selectedCountry  — any user manually picked a country (overrides all)
//   2. user.country     — logged-in user's IP-detected country (from login)
//   3. guestCountry     — unauthenticated visitor's IP-detected country
//   4. "Ghana"          — safe fallback (always produces results)
//
// Anyone — guest, vendor, admin — can call setSelectedCountry to switch.

"use client";

import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { useCallback } from "react";
import { setSelectedCountry } from "@/src/lib/features/auth/authSlice";

export type ViewCountry = "Ghana" | "Nigeria";
export type ViewCurrency = "GHS" | "NGN";

const VALID = ["Ghana", "Nigeria"] as const;
function canonical(raw: string | undefined): ViewCountry | undefined {
  if (!raw) return undefined;
  const lc = raw.toLowerCase();
  if (lc.includes("nigeria")) return "Nigeria";
  if (lc.includes("ghana")) return "Ghana";
  return undefined;
}

export function useViewCountry() {
  const dispatch = useAppDispatch();

  const country: ViewCountry = useAppSelector((s) => {
    // 1. Manual selection (any user type)
    const selected = canonical((s.auth as any)?.selectedCountry);
    if (selected) return selected;

    // 2. Logged-in user's detected country (validated — rejects bad DB values)
    const userCountry = canonical(s.auth?.user?.country);
    if (userCountry) return userCountry;

    // 3. Guest IP-detected country
    const guestCountry = canonical((s.auth as any)?.guestCountry);
    if (guestCountry) return guestCountry;

    // 4. Safe fallback
    return "Ghana";
  });

  // True while GuestLocationDetector is in-flight
  const guestDetecting = useAppSelector(
    (s) => ((s.auth as any)?.guestDetecting as boolean) ?? false,
  );

  const currency: ViewCurrency = country === "Nigeria" ? "NGN" : "GHS";
  const sym = currency === "NGN" ? "₦" : "₵";
  const isNigeria = country === "Nigeria";
  const isGhana = country === "Ghana";
  const paymentRegion = currency === "NGN" ? "ng" : "gh";

  // Universal switcher — works for everyone, no API call needed
  const switchCountry = useCallback(
    (c: ViewCountry) => dispatch(setSelectedCountry(c)),
    [dispatch],
  );

  return {
    country,
    currency,
    sym,
    isNigeria,
    isGhana,
    paymentRegion,
    guestDetecting,
    switchCountry,
  };
}
