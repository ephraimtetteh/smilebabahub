"use client";

// src/components/ads/BestsellersRow.tsx
import { memo, useMemo } from "react";
import { Ad } from "@/src/types/ad.types";
import { TIER_SORT } from "../ad.constants";
import AdCard from "../AdCard";


interface BestsellersRowProps {
  ads: Ad[];
  limit?: number;
}

const BestsellersRow = memo(function BestsellersRow({
  ads,
  limit = 6,
}: BestsellersRowProps) {
  const boosted = useMemo(
    () =>
      ads
        .filter((a) => a.boost?.isBoosted)
        .sort(
          (a, b) =>
            (TIER_SORT[b.boost.boostTier] ?? 0) -
            (TIER_SORT[a.boost.boostTier] ?? 0),
        )
        .slice(0, limit),
    [ads, limit],
  );

  if (!boosted.length) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">⭐</span>
        <h2 className="text-lg font-bold text-gray-900">
          Featured &amp; Boosted Ads
        </h2>
        <span
          className="text-xs bg-amber-100 text-amber-700 font-semibold
          px-2 py-0.5 rounded-full ml-1"
        >
          Promoted
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {boosted.map((ad) => (
          <AdCard key={ad._id} ad={ad} />
        ))}
      </div>
    </section>
  );
});

export default BestsellersRow;
