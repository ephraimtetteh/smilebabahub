"use client";

// src/app/page.tsx
//
// Landing page, rebuilt to match the app.
//
// Order is deliberate — the TV hero and Send Money sit above the fold
// because they're the two things unique to SmileBaba, then the four
// verticals give people a way in, then the picks rows do the browsing.
//
//   1. TV hero
//   2. Send Money banner
//   3. Four vertical cards
//   4. E-Commerce picks
//   5. Featured promotions
//   6. Food picks
//   7. Stays picks
//   8. Marketplace picks
//   9. Category strip
//  10. Sticky radio bar
//
// Desktop keeps the news ticker and the trust bar. The old four-column
// hero row is gone — the vertical cards replace it and read better at
// every width.

import { useEffect, useMemo } from "react";
import { useProducts } from "@/src/hooks/useProducts";

import NewsTicker from "@/src/components/home/NewsTicker";
import LiveTvCard from "@/src/components/home/LiveTvCard";
import TrustBar from "@/src/components/home/TrustBar";
import MobileBottomNav from "@/src/components/home/MobileBottomNav";
import { ActivePromotions } from "@/src/components/promote/ActivePromotions";

// New
import SendMoneyBanner from "@/src/components/home/SendMoneyBanner";
import BigCategoryCards from "@/src/components/home/BigCategoryCards";
import PicksRow from "@/src/components/home/PicksRow";
import CategoryStrip from "@/src/components/home/CategoryStrip";
import StickyRadioBar from "@/src/components/home/StickyRadioBar";
import Link from "next/link";
import LiveTvHero from "../components/home/LiveTvHero";
import CtaBanners from "../components/home/CtaBanners";

// The real category.main values. E-Commerce isn't one of them — it's
// three retail categories shown together, which is why the row merges
// rather than fetching a category that doesn't exist.
const HOMEPAGE_CATEGORIES = [
  "ecommerce",
  "phones",
  "fashion",
  "home-office",
  "food",
  "apartments",
  "marketplace",
] as const;

export default function HomePage() {
  const { featured, featuredLoading, loadFeatured, userCountry } =
    useProducts();

  useEffect(() => {
    if (!userCountry) return;
    HOMEPAGE_CATEGORIES.forEach((cat) => loadFeatured(userCountry, cat));
  }, [userCountry, loadFeatured]);

  // Interleave the three retail categories rather than concatenating, so
  // the row isn't four phones followed by four shirts.
  const ecommerce = useMemo(() => {
    const lists = [
      featured?.ecommerce ?? [],
      featured?.phones ?? [],
      featured?.fashion ?? [],
      featured?.["home-office"] ?? [],
    ];
    const out: any[] = [];
    const longest = Math.max(...lists.map((l) => l.length));
    for (let i = 0; i < longest; i++) {
      for (const list of lists) if (list[i]) out.push(list[i]);
    }
    return out.slice(0, 6);
  }, [featured]);

  const restaurants = featured?.food ?? [];
  const apartments = featured?.apartments ?? [];
  const deals = featured?.marketplace ?? [];

  return (
    <main className="bg-gray-50 pb-32 lg:pb-24 mt-20">
      {/* ─── Desktop news ticker ─── */}
      <div className="hidden lg:block">
        <NewsTicker />
      </div>

      <div className="max-w-[1340px] mx-auto px-3 sm:px-4">
        {/* ─── 1. TV hero ─── */}
        {/* replacing <LiveTvCard variant="wide" /> */}
        <section className="pt-3">
          <LiveTvHero />
        </section>
        {/* ─── 2. Send Money ─── */}
        <section className="mt-4">
          <SendMoneyBanner />
        </section>
        {/* ─── 3. Verticals ─── */}
        <section className="mt-4">
          <BigCategoryCards />
        </section>
        {/* ─── 4. E-Commerce ─── */}
        <PicksRow
          title="E-Commerce Picks for You"
          accent="#059669"
          items={ecommerce}
          loading={featuredLoading}
          viewAllHref="/ads?category=phones,fashion,home-office"
          showDelivery
        />
        {/* ─── 5. Promotions ─── */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-bold text-gray-900 tracking-tight">
              Featured Promotions
            </h2>
            <Link
              href="/promote"
              className="text-xs font-semibold text-gray-500 hover:text-gray-900"
            >
              See All
            </Link>
          </div>
          <ActivePromotions />
        </section>
        {/* ─── 6-8. Verticals ─── */}
        <PicksRow
          title="SmileBaba Food Picks"
          accent="#DC2626"
          items={restaurants}
          loading={featuredLoading}
          viewAllHref="/ads?category=food"
          // emptyHint="No restaurants in your area yet."
          showRating
        />

        <section className="mt-8">
          <CtaBanners />
        </section>

        <PicksRow
          title="SmileStays Picks"
          accent="#0D9488"
          items={apartments}
          loading={featuredLoading}
          viewAllHref="/ads?category=apartments"
          // emptyHint="No properties listed yet."
          priceSuffix="/ night"
        />
        <PicksRow
          title="Featured Products from Marketplace"
          accent="#2563EB"
          items={deals}
          loading={featuredLoading}
          viewAllHref="/ads?category=marketplace"
          // emptyHint="No listings yet."
          showLocation
        />
        {/* ─── 9. Category strip ─── */}
        <CategoryStrip />
      </div>

      {/* ─── Trust bar ─── */}
      <TrustBar />

      {/* ─── 10. Radio ─── */}
      <StickyRadioBar />

      <MobileBottomNav />
    </main>
  );
}
