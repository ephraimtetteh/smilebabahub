"use client";
// src/components/AnalyticsTracker.tsx
// Drop this inside your root layout (inside StoreProvider).
// Tracks every page navigation silently — never blocks the UI.
//
// Usage in src/app/layout.tsx or your LayoutWrapper:
//   import AnalyticsTracker from "@/src/components/AnalyticsTracker";
//   <AnalyticsTracker />

import { useAnalytics } from "@/src/hooks/useAnalytics";

export default function AnalyticsTracker() {
  useAnalytics();
  return null;
}
