"use client";

// src/components/ads/RelatedAds.tsx
import { memo } from "react";
import { Ad } from "@/src/types/ad.types";
import AdCard from "./AdCard";

interface RelatedAdsProps {
  ads: Ad[];
  currentId: string;
  limit?: number;
}

const RelatedAds = memo(function RelatedAds({
  ads,
  currentId,
  limit = 4,
}: RelatedAdsProps) {
  const filtered = ads.filter((a) => a._id !== currentId).slice(0, limit);

  if (!filtered.length) return null;

  return (
    <div className="mt-10">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Similar ads</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {filtered.map((ad) => (
          <AdCard key={ad._id} ad={ad} compact />
        ))}
      </div>
    </div>
  );
});

export default RelatedAds;
