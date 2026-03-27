"use client";

import React, { useEffect } from "react";
import Title from "@/src/components/Title";
import { FeaturedGrid } from "./FeaturedCard";
import Link from "next/link";
import { useProducts } from "@/src/hooks/useProducts";

interface FeaturedProps {
  className?: string;
  category?: "marketplace" | "food" | "apartments" | "all";
  title?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

const CATEGORY_DEFAULTS: Record<string, { title: string; href: string }> = {
  food: { title: "Food & Restaurants", href: "/food" },
  marketplace: { title: "Browse our marketplace", href: "/marketPlace" },
  apartments: { title: "Apartments & Short Stays", href: "/restate" },
  all: { title: "Browse our marketplace", href: "/marketPlace" },
};

// ── Skeleton ──────────────────────────────────────────────────────────────
function FeaturedSkeleton({ className }: { className?: string }) {
  return (
    <div className={`${className} flex flex-col px-3 sm:px-6`}>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="h-7 bg-gray-100 rounded-xl w-64 animate-pulse" />
        <div className="h-8 bg-gray-100 rounded-xl w-24 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 animate-pulse"
          >
            <div className="aspect-[4/3] bg-gray-100 rounded-t-2xl" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
const FeaturedProducts = ({
  className,
  category = "all",
  title,
  viewAllHref,
  viewAllLabel = "View all →",
}: FeaturedProps) => {
  const {
    featured, // Record<string, Product[]>
    featuredLoading,
    loadFeatured,
    userCountry,
  } = useProducts();

  // Fetch this category on mount (or when country changes)
  useEffect(() => {
    loadFeatured(userCountry, category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCountry, category]);

  const items = featured[category] ?? [];
  const defaults = CATEGORY_DEFAULTS[category] ?? CATEGORY_DEFAULTS.all;

  if (featuredLoading && !items.length) {
    return <FeaturedSkeleton className={className} />;
  }

  if (!items.length) return null;

  return (
    <div className={`${className} flex flex-col text-black px-3 sm:px-6`}>
      <div className="flex items-center justify-between mb-6 gap-4">
        <Title title={title ?? defaults.title} />
        <Link
          href={viewAllHref ?? defaults.href}
          onClick={() => window.scrollTo(0, 0)}
          className="flex-shrink-0 px-4 py-2 text-sm font-medium border border-gray-300
            rounded-xl bg-white hover:bg-gray-50 transition-all whitespace-nowrap"
        >
          {viewAllLabel}
        </Link>
      </div>

      <FeaturedGrid items={items} />
    </div>
  );
};

export default FeaturedProducts;
