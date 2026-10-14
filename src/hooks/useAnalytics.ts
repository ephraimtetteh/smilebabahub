"use client";
// src/hooks/useAnalytics.ts
// Tracks page views. Call once in your root layout or LayoutWrapper.
// Fire-and-forget — never awaited, never blocks navigation.
//
// Sends country in the request body so the backend can attribute views
// to the correct country without relying on Cloudflare headers
// (cf-ipcountry doesn't exist on Render deployments).

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/src/app/redux";
import axiosInstance from "@/src/lib/api/axios";

export function useAnalytics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  // Read country from Redux — covers both logged-in users and guests
  // (guestCountry is set by the IP detection hook on first load)
  const country = useAppSelector(
    (s) =>
      s.auth.selectedCountry ??
      s.auth.user?.country ??
      s.auth.guestCountry ??
      null,
  );

  useEffect(() => {
    // Skip if same path (React StrictMode double-fire)
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    // Fire-and-forget — never block navigation or throw
    axiosInstance
      .post("/analytics", {
        path: pathname,
        country: country ?? undefined,
        referrer:
          typeof document !== "undefined" ? document.referrer || null : null,
      })
      .catch(() => {});
  }, [pathname, country]);
}
