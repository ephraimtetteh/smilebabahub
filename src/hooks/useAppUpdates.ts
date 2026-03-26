// hooks/useAppUpdates.ts
// Connect once in your root layout — handles auto-reload on new deploys
// and prevents stale cached versions from serving old JS/CSS.

"use client";

import { useEffect, useRef } from "react";

// SSE must connect directly to the backend — Next.js rewrite proxies
// cannot forward long-lived streaming connections.
// NEXT_PUBLIC_API_BASE_URL is set in Render env vars.
const SSE_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/smilebaba";

// Stored in sessionStorage so we only reload ONCE per version per tab
const SEEN_VERSION_KEY = "smilebaba_app_version";

export function useAppUpdates() {
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const connect = () => {
      const es = new EventSource(`${SSE_BASE}/updates/app`, {
        withCredentials: true,
      });
      esRef.current = es;

      es.addEventListener("app-update", (event) => {
        try {
          const data = JSON.parse(event.data) as {
            version: string;
            message?: string;
          };
          const seenVer = sessionStorage.getItem(SEEN_VERSION_KEY);

          if (seenVer === data.version) return;

          sessionStorage.setItem(SEEN_VERSION_KEY, data.version);
          console.info(`[SmileBaba] New version ${data.version} — reloading`);
          setTimeout(() => window.location.reload(), 1500);
        } catch {
          // malformed message — ignore
        }
      });

      es.onerror = () => {
        es.close();
        // Reconnect after 5s — stops the flood of errors in the console
        setTimeout(connect, 5_000);
      };
    };

    connect();

    return () => {
      esRef.current?.close();
    };
  }, []);
}
