"use client";
// src/components/BackendWakeUp.tsx
// Pings the backend health endpoint on app load to wake Render from sleep.
// Render free tier spins down after 15 min of inactivity.
// A cold start takes 15-30s — if this ping happens before the user logs in,
// the backend is warm by the time restoreSession fires.
//
// Usage: mount once in your root layout, inside StoreProvider.
//   <BackendWakeUp />

import { useEffect } from "react";

const BACKEND =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/smilebaba";

export default function BackendWakeUp() {
  useEffect(() => {
    // Fire-and-forget — never block anything
    fetch(`${BACKEND}/health`, { method: "GET", cache: "no-store" }).catch(
      () => {},
    ); // silent — if it fails, restoreSession handles it
  }, []);

  return null;
}
