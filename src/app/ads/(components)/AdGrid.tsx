"use client";

// src/components/ads/AdGrid.tsx
import { memo } from "react";
import { Ad } from "@/src/types/ad.types";
import AdCard from "./AdCard";

// ── Loading skeleton ───────────────────────────────────────────────────────
export const AdSkeleton = memo(function AdSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 animate-pulse overflow-hidden">
      <div className="aspect-[4/3] bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-5 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  );
});

// ── Empty state ────────────────────────────────────────────────────────────
export const AdEmpty = memo(function AdEmpty() {
  return (
    <div className="col-span-full py-20 text-center">
      <p className="text-4xl mb-3">🔍</p>
      <p className="text-gray-600 font-medium">No ads found</p>
      <p className="text-sm text-gray-400 mt-1">
        Try adjusting your filters or search term
      </p>
    </div>
  );
});

// ── Ad grid ────────────────────────────────────────────────────────────────
interface AdGridProps {
  ads: Ad[];
  loading: boolean;
  count?: number; // skeleton count when loading
}

export const AdGrid = memo(function AdGrid({
  ads,
  loading,
  count = 12,
}: AdGridProps) {
  const gridCls =
    "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3";

  if (loading) {
    return (
      <div className={gridCls}>
        {Array.from({ length: count }).map((_, i) => (
          <AdSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!ads.length) {
    return (
      <div className={gridCls}>
        <AdEmpty />
      </div>
    );
  }

  return (
    <div className={gridCls}>
      {ads.map((ad) => (
        <AdCard key={ad._id} ad={ad} />
      ))}
    </div>
  );
});

export default AdGrid;
