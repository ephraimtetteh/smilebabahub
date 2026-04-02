// src/hooks/useViewCountry.ts
// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for country/currency.
//
// Resolution priority (first truthy wins):
//   1. selectedCountry  — user explicitly picked via CountrySwitcher
//   2. user.country     — logged-in user's country from login response (cf-ipcountry)
//   3. guestCountry     — guest visitor's country from IP detection
//   4. "Ghana"          — safe fallback
//
// Key behaviours:
//   - IP-detected country is the DEFAULT — no manual action needed
//   - Manual selection only activates when user explicitly switches
//   - "Auto" option in CountrySwitcher clears selectedCountry → IP takes over again
//   - login/logout in authSlice clears selectedCountry automatically

"use client";

import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { useCallback } from "react";
import { setSelectedCountry } from "@/src/lib/features/auth/authSlice";

export type ViewCountry = "Ghana" | "Nigeria";
export type ViewCurrency = "GHS" | "NGN";

function canonical(raw: string | undefined): ViewCountry | undefined {
  if (!raw) return undefined;
  const lc = raw.toLowerCase();
  if (lc.includes("nigeria")) return "Nigeria";
  if (lc.includes("ghana")) return "Ghana";
  return undefined;
}

export function useViewCountry() {
  const dispatch = useAppDispatch();

  // ── Resolved country (what everything in the UI uses) ──────────────────
  const country: ViewCountry = useAppSelector((s) => {
    const selected = canonical((s.auth as any)?.selectedCountry);
    if (selected) return selected;

    const userCountry = canonical(s.auth?.user?.country);
    if (userCountry) return userCountry;

    const guestCountry = canonical((s.auth as any)?.guestCountry);
    if (guestCountry) return guestCountry;

    return "Ghana";
  });

  // ── Auto-detected country (IP-based, before any manual selection) ───────
  // This is what the switcher shows as "Your location" / default
  const detectedCountry: ViewCountry = useAppSelector((s) => {
    const userCountry = canonical(s.auth?.user?.country);
    if (userCountry) return userCountry;

    const guestCountry = canonical((s.auth as any)?.guestCountry);
    if (guestCountry) return guestCountry;

    return "Ghana";
  });

  // ── Whether the user has manually overridden IP detection ───────────────
  const isManuallySelected = useAppSelector(
    (s) => !!canonical((s.auth as any)?.selectedCountry),
  );

  // ── Detecting flag — products wait for this before fetching ────────────
  const guestDetecting = useAppSelector(
    (s) => ((s.auth as any)?.guestDetecting as boolean) ?? false,
  );

  const currency: ViewCurrency = country === "Nigeria" ? "NGN" : "GHS";
  const sym = currency === "NGN" ? "₦" : "₵";
  const isNigeria = country === "Nigeria";
  const isGhana = country === "Ghana";
  const paymentRegion = currency === "NGN" ? "ng" : "gh";

  // Set a specific country (manual override)
  const switchCountry = useCallback(
    (c: ViewCountry) => dispatch(setSelectedCountry(c)),
    [dispatch],
  );

  // Clear manual selection — IP detection takes over again
  const resetToAuto = useCallback(
    () => dispatch(setSelectedCountry("")),
    [dispatch],
  );

  return {
    country, // resolved country (use this everywhere)
    detectedCountry, // IP-detected default (before any manual pick)
    isManuallySelected, // true if user has overridden IP detection
    currency,
    sym,
    isNigeria,
    isGhana,
    paymentRegion,
    guestDetecting,
    switchCountry,
    resetToAuto,
  };
}
