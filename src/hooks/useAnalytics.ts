"use client";
// src/hooks/useAnalytics.ts
// Tracks page views. Call once in your root layout or LayoutWrapper.
// Fire-and-forget — never awaited, never blocks navigation.

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import axiosInstance from "@/src/lib/api/axios";

export function useAnalytics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    // Skip if same path (React StrictMode double-fire)
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    // Fire-and-forget — never block navigation
    axiosInstance
      .post("/analytics", {
        path: pathname,
        referrer:
          typeof document !== "undefined" ? document.referrer || null : null,
      })
      .catch(() => {}); // silently ignore errors
  }, [pathname]);
}
