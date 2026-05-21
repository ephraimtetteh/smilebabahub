"use client";

// src/app/page.tsx  (or src/components/HomePage.tsx)
//
// Marketplace homepage with country-scoped live data.
// All categories are pre-fetched for the carousels and highlight blocks.
// No footer — the project already has one in the global layout.

import { useEffect } from "react";
import { useProducts } from "@/src/hooks/useProducts";

import NewsTicker from "@/src/components/home/NewsTicker";
import CategorySidebar from "@/src/components/home/CategorySidebar";
import LiveRadioCard from "@/src/components/home/LiveRadioCard";
import LiveTvCard from "@/src/components/home/LiveTvCard";
import HighlightsColumn from "@/src/components/home/HighlightsColumn";
import CtaBanners from "@/src/components/home/CtaBanners";
import ProductCarousel from "@/src/components/home/ProductCarousel";
import TrustBar from "@/src/components/home/TrustBar";

// All categories the homepage uses — kept in one place so the prefetch
// effect stays in sync with what the carousels and highlights display.
const HOMEPAGE_CATEGORIES = [
  "food",
  "apartments",
  "marketplace",
  "fashion",
  "pharmacy",
  "services",
] as const;

export default function HomePage() {
  const { featured, featuredLoading, loadFeatured, userCountry } =
    useProducts();

  // Prefetch every category in parallel — country-scoped.
  // The Redux slice deduplicates per-country fetches, so this is safe to call
  // even when the country changes (e.g. admin switching markets).
  useEffect(() => {
    if (!userCountry) return;
    HOMEPAGE_CATEGORIES.forEach((cat) => loadFeatured(userCountry, cat));
  }, [userCountry, loadFeatured]);

  const restaurants = featured?.food ?? [];
  const apartments = featured?.apartments ?? [];
  const deals = featured?.marketplace ?? [];

  return (
    <main className="bg-gray-50">
      {/* Slim breaking-news strip — directly under header */}
      <NewsTicker />

      {/* ── 4-column hero row ── */}
      <section className="max-w-[1340px] mx-auto px-3 sm:px-4 py-4">
        <div className="grid grid-cols-12 gap-3">
          {/* Col 1 — Shop By Category (left sidebar) */}
          <div className="col-span-12 lg:col-span-3">
            <CategorySidebar title="SHOP BY CATEGORY" viewAllHref="/ads" />
          </div>

          {/* Col 2 — Live Radio (dark) */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <LiveRadioCard />
          </div>

          {/* Col 3 — Live TV (dark) */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <LiveTvCard />
          </div>

          {/* Col 4 — Food Highlights + News Highlights (rotating) */}
          <div className="col-span-12 lg:col-span-3">
            <HighlightsColumn />
          </div>
        </div>
      </section>

      {/* ── 4 CTA banner cards ── */}
      <CtaBanners />

      {/* ── 3-column carousel row — all carousels side by side ── */}
      <section className="max-w-[1340px] mx-auto px-3 sm:px-4 py-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <ProductCarousel
            title="TRENDING RESTAURANTS"
            items={restaurants}
            loading={featuredLoading}
            viewAllHref="/ads?category=food"
            emptyHint="No restaurants in your area yet."
            showBestSellerBadge
          />

          <ProductCarousel
            title="POPULAR APARTMENTS"
            items={apartments}
            loading={featuredLoading}
            viewAllHref="/ads?category=apartments"
            emptyHint="No properties listed yet."
            showBestSellerBadge
          />

          <ProductCarousel
            title="HOT DEALS NEAR YOU"
            items={deals}
            loading={featuredLoading}
            viewAllHref="/ads"
            emptyHint="No deals available yet."
            showDiscount
          />
        </div>
      </section>

      {/* ── Trust bar ── */}
      <TrustBar />
    </main>
  );
}
