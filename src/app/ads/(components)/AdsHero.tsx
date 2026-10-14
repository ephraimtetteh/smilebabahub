"use client";

// src/components/ads/AdsHero.tsx
import { memo } from "react";

interface AdsHeroProps {
  country: string | undefined;
  search: string;
  onSearch: (val: string) => void;
  onSubmit: () => void;
}

const AdsHero = memo(function AdsHero({
  country,
  search,
  onSearch,
  onSubmit,
}: AdsHeroProps) {
  return (
    <div className="bg-[#1a1a1a] px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto text-center pt-20">
        <h1 className="text-2xl sm:text-4xl font-black text-white mb-2">
          Browse Ads in{" "}
          <span className="text-yellow-400">
            {country ?? "Ghana & Nigeria"}
          </span>
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Find great deals on phones, cars, homes, food, electronics and more
        </p>

        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            placeholder="Search ads e.g. iPhone 15, Toyota Corolla..."
            className="flex-1 px-4 py-3 rounded-2xl bg-white text-gray-900 text-sm
              outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={onSubmit}
            className="px-5 py-3 bg-yellow-400 text-black font-bold rounded-2xl
              hover:bg-yellow-300 transition text-sm active:scale-95"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
});

export default AdsHero;
