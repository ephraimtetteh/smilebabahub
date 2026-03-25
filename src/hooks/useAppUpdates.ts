// hooks/useAppUpdates.ts
// Connect once in your root layout — handles auto-reload on new deploys
// and prevents stale cached versions from serving old JS/CSS.

"use client";

import { useEffect, useRef } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/smilebaba";

// Stored in sessionStorage so we only reload ONCE per version per tab
const SEEN_VERSION_KEY = "smilebaba_app_version";

export function useAppUpdates() {
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // SSE is not available in SSR
    if (typeof window === "undefined") return;

    const connect = () => {
      // EventSource doesn't support custom headers — the endpoint is public
      const es = new EventSource("/api/updates/app", { withCredentials: true });
      esRef.current = es;

      es.addEventListener("app-update", (event) => {
        try {
          const data = JSON.parse(event.data) as {
            version: string;
            message?: string;
          };
          const seenVer = sessionStorage.getItem(SEEN_VERSION_KEY);

          if (seenVer === data.version) return; // already reloaded for this version

          sessionStorage.setItem(SEEN_VERSION_KEY, data.version);

          console.info(`[SmileBaba] New version ${data.version} — reloading`);

          // Give the user a moment before hard-reloading
          // Hard reload bypasses the browser cache
          setTimeout(() => window.location.reload(), 1500);
        } catch {
          // malformed message — ignore
        }
      });

      es.onerror = () => {
        // Reconnect after 5s on error
        es.close();
        setTimeout(connect, 5_000);
      };
    };

    connect();

    return () => {
      esRef.current?.close();
    };
  }, []);
}
