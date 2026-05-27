"use client";

// src/app/page.tsx  (or src/components/HomePage.tsx)
//
// Marketplace homepage — responsive.
//   • Mobile (< lg): vertical hierarchy matching the design mockup
//     1. News cards (horizontal scroll, photos)
//     2. Shortcuts (5x2 emoji grid)
//     3. Live & Featured (Radio + TV stacked or side-by-side)
//     4. 4-column CTA banners
//     5. Trending Restaurants carousel
//     6. Popular Apartments carousel
//     7. Trust bar
//
//   • Desktop (lg+): 4-column hero row (categories | radio | tv | highlights)
//     unchanged from the current desktop design.
//
// All sections are country-scoped via useProducts → loadFeatured(country, cat).

import { useEffect } from "react";
import { useProducts } from "@/src/hooks/useProducts";

// Mobile-only sections
import NewsCards from "@/src/components/home/NewsCards";
import MobileShortcuts from "@/src/components/home/MobileShortcuts";

// Shared (different layouts inside via Tailwind responsive utils)
import NewsTicker from "@/src/components/home/NewsTicker";
import CategorySidebar from "@/src/components/home/CategorySidebar";
import LiveRadioCard from "@/src/components/home/LiveRadioCard";
import LiveTvCard from "@/src/components/home/LiveTvCard";
import HighlightsColumn from "@/src/components/home/HighlightsColumn";
import CtaBanners from "@/src/components/home/CtaBanners";
import ProductCarousel from "@/src/components/home/ProductCarousel";
import TrustBar from "@/src/components/home/TrustBar";
import MobileBottomNav from "@/src/components/home/MobileBottomNav";

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

  // Prefetch every category in parallel — country-scoped
  useEffect(() => {
    if (!userCountry) return;
    HOMEPAGE_CATEGORIES.forEach((cat) => loadFeatured(userCountry, cat));
  }, [userCountry, loadFeatured]);

  const restaurants = featured?.food ?? [];
  const apartments = featured?.apartments ?? [];
  const deals = featured?.marketplace ?? [];

  return (
    <main className="bg-gray-50 pb-20 lg:pb-0 mt-20">
      {/* ─── DESKTOP ONLY: slim news ticker under header ─── */}
      <div className="hidden lg:block">
        <NewsTicker />
      </div>

      {/* ─── MOBILE ONLY: horizontal news cards ─── */}
      <NewsCards />

      {/* ─── MOBILE ONLY: shortcuts emoji grid ─── */}
      <MobileShortcuts />

      {/* ─── MOBILE: Live & Featured section header ─── */}
      <div className="lg:hidden px-3 pt-1 pb-2">
        <h2 className="text-xs font-black text-gray-900 tracking-wider">
          LIVE & FEATURED
        </h2>
      </div>

      {/* ─── HERO ROW: Desktop = 4-col grid, Mobile = vertical stack ─── */}
      <section className="max-w-[1340px] mx-auto px-3 sm:px-4 lg:py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Desktop sidebar (hidden on mobile, MobileShortcuts above replaces it) */}
          <div className="hidden lg:block lg:col-span-3">
            <CategorySidebar title="SHOP BY CATEGORY" viewAllHref="/ads" />
          </div>

          {/* Live Radio — full width on mobile, half on sm, 1/4 on lg */}
          <div className="col-span-1 sm:col-span-1 lg:col-span-3">
            <LiveRadioCard />
          </div>

          {/* Live TV — full width on mobile, half on sm, 1/4 on lg */}
          <div className="col-span-1 sm:col-span-1 lg:col-span-3">
            <LiveTvCard />
          </div>

          {/* Highlights — hidden on mobile (replaced by carousels below), shown on lg+ */}
          <div className="hidden lg:block lg:col-span-3">
            <HighlightsColumn />
          </div>
        </div>
      </section>

      {/* ─── 4 CTA banner cards ─── */}
      <CtaBanners />

      {/* ─── 3 carousels — side by side on desktop, stacked on mobile ─── */}
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

      {/* ─── Trust bar ─── */}
      <TrustBar />

      {/* ─── Mobile bottom tab bar (mobile only) ─── */}
      <MobileBottomNav />
    </main>
  );
}
