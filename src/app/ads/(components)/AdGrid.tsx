"use client";
// src/components/ads/AdGrid.tsx
// Responsive ad grid used across marketplace, category pages, and search.

import { memo } from "react";
import { SearchX } from "lucide-react";
import { Ad } from "@/src/types/ad.types";
import AdCard from "./AdCard";

// ── Loading skeleton ────────────────────────────────────────────────────────
export const AdSkeleton = memo(function AdSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 animate-pulse overflow-hidden">
      <div className="aspect-[4/3] bg-gray-100 rounded-t-2xl" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded-lg w-3/4" />
        <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
        <div className="h-5 bg-gray-100 rounded-lg w-2/5" />
        <div className="h-3 bg-gray-100 rounded-lg w-2/3" />
      </div>
    </div>
  );
});

// ── Empty state ─────────────────────────────────────────────────────────────
export const AdEmpty = memo(function AdEmpty({
  message,
}: {
  message?: string;
}) {
  return (
    <div className="col-span-full py-20 flex flex-col items-center gap-3 text-center">
      <SearchX size={44} className="text-gray-200" />
      <p className="text-gray-600 font-semibold">{message ?? "No ads found"}</p>
      <p className="text-sm text-gray-400">
        Try adjusting your filters or search term
      </p>
    </div>
  );
});

// ── Grid ────────────────────────────────────────────────────────────────────
// Breakpoints:
//   mobile (< 480px) : 2 columns — two cards fit comfortably
//   sm (480–768px)   : 3 columns
//   md (768–1024px)  : 4 columns
//   lg (1024–1280px) : 5 columns
//   xl (≥ 1280px)    : 6 columns
//
// gap-3 (12px) at all sizes — tighter looks better on mobile
const GRID =
  "grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3";

interface AdGridProps {
  ads: Ad[];
  loading: boolean;
  count?: number; // skeleton count
  compact?: boolean;
  emptyMessage?: string;
}

export const AdGrid = memo(function AdGrid({
  ads,
  loading,
  count = 12,
  compact = false,
  emptyMessage,
}: AdGridProps) {
  if (loading) {
    return (
      <div className={GRID}>
        {Array.from({ length: count }).map((_, i) => (
          <AdSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!ads.length) {
    return (
      <div className={GRID}>
        <AdEmpty message={emptyMessage} />
      </div>
    );
  }

  return (
    <div className={GRID}>
      {ads.map((ad) => (
        <AdCard key={ad._id} ad={ad} compact={compact} />
      ))}
    </div>
  );
});

export default AdGrid;
