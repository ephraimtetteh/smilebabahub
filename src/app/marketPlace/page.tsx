"use client";

// src/app/marketPlace/page.tsx
// Marketplace landing page — all data from Redux, country-filtered.

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ChevronRight,
  Flame,
  Clock,
  Tag,
  TrendingUp,
  MapPin,
  Eye,
} from "lucide-react";

import FeaturedProducts from "@/src/components/FeaturedProducts";
import { useAds } from "@/src/hooks/useAds";
import { useAppSelector } from "@/src/app/redux";
import { Ad } from "@/src/types/ad.types";

// ── Keep your existing components ─────────────────────────────────────────
import Radio from "@/src/components/Radio";
import Video from "@/src/components/Video";
import MarketplaceSearch from "@/src/components/NewSearch";
import { formatAdPrice } from "../ads/(components)/ad.constants";

// ── Ad card used in Best Selling & Recently Posted ─────────────────────────
function AdCard({ ad }: { ad: Ad }) {
  const cover = ad.coverImage ?? ad.images?.[0]?.url ?? "";
  const sym = ad.price?.currency === "NGN" ? "₦" : "₵";

  return (
    <Link
      href={`/product/${ad._id}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm
        overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt={ad.title}
            fill
            sizes="(max-width: 640px) 50vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl text-gray-200">
            🖼️
          </div>
        )}
        {ad.boost?.isBoosted && (
          <span
            className="absolute top-2 left-2 text-[10px] font-bold bg-yellow-400
            text-black px-2 py-0.5 rounded-full"
          >
            ⭐ Boosted
          </span>
        )}
        {ad.condition === "brand_new" && (
          <span
            className="absolute top-2 right-2 text-[10px] font-bold bg-blue-500
            text-white px-2 py-0.5 rounded-full"
          >
            New
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-gray-800 font-semibold line-clamp-1 mb-0.5">
          {ad.title}
        </p>
        <p className="text-sm font-black text-gray-900 mt-auto">
          {formatAdPrice(
            ad.price?.amount,
            ad.price?.currency,
            ad.price?.display,
          )}
        </p>
        <div className="flex items-center justify-between mt-1.5">
          {ad.location?.city && (
            <span className="flex items-center gap-0.5 text-[10px] text-gray-400 truncate">
              <MapPin size={9} /> {ad.location.city}
            </span>
          )}
          <span className="flex items-center gap-0.5 text-[10px] text-gray-400 ml-auto">
            <Eye size={9} /> {ad.views ?? 0}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Ad card skeleton ───────────────────────────────────────────────────────
function AdCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 animate-pulse overflow-hidden">
      <div className="aspect-[4/3] bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/3" />
        <div className="h-2.5 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────────────────
function SectionHeader({
  icon,
  title,
  href,
  linkLabel = "View all →",
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-900">
        {icon}
        {title}
      </h2>
      <Link
        href={href}
        className="flex items-center gap-1 text-sm font-medium text-gray-500
          hover:text-gray-800 transition whitespace-nowrap"
      >
        {linkLabel} <ChevronRight size={14} />
      </Link>
    </div>
  );
}

// ── Category quick-links ───────────────────────────────────────────────────
const CATEGORIES = [
  { label: "Vehicles", emoji: "🚗", q: "vehicles" },
  { label: "Electronics", emoji: "📱", q: "electronics" },
  { label: "Fashion", emoji: "👗", q: "fashion" },
  { label: "Furniture", emoji: "🛋️", q: "furniture" },
  { label: "Phones", emoji: "📲", q: "phones" },
  { label: "Food", emoji: "🍔", q: "food" },
  { label: "Apartments", emoji: "🏠", q: "apartments" },
  { label: "Services", emoji: "🔧", q: "services" },
];

// ── Main page ──────────────────────────────────────────────────────────────
export default function MarketPlace() {
  const { ads, feedLoading, loadAds, userCountry, userCurrency } = useAds();
  const hasCheckedAuth = useAppSelector((s) => s.auth.hasCheckedAuth);
  const user = useAppSelector((s) => s.auth.user);

  const flag =
    userCountry === "Ghana" ? "🇬🇭" : userCountry === "Nigeria" ? "🇳🇬" : "🌍";

  // Fetch marketplace ads once auth is resolved
  useEffect(() => {
    if (!hasCheckedAuth) return;
    loadAds({
      country: userCountry as any,
      category: "marketplace",
      sort: "newest",
      page: 1,
      limit: 24,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCheckedAuth, userCountry]);

  // Split ads into best-selling (most views) and recently posted
  const bestSelling = [...ads]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 7);

  const recentlyPosted = [...ads]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 7);

  return (
    <div className="w-full min-h-screen bg-gray-50 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 pt-20">
      {/* ── Radio / hero sidebar ── */}

      <Radio />

      <div className="w-full  flex flex-col gap-10 py-10">
        {/* ── Country chip ── */}
        {userCountry && (
          <div className="flex items-center gap-2 text-sm text-gray-500 -mb-4">
            <span>{flag}</span>
            <span>
              Marketplace in{" "}
              <strong className="text-gray-700">{userCountry}</strong>
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-400">
              {userCurrency === "NGN" ? "₦ NGN" : "₵ GHS"}
            </span>
          </div>
        )}

        {/* ── Search ── */}
        <div className="w-full">
          <MarketplaceSearch />
        </div>

        {/* ── Category quick links ── */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.q}
              href={`/ads?category=marketplace&sub=${cat.q}&country=${userCountry ?? ""}`}
              className="flex flex-col items-center gap-1.5 bg-white rounded-2xl
                border border-gray-100 shadow-sm py-3 px-2 hover:border-yellow-300
                hover:bg-yellow-50 transition group text-center"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span
                className="text-[11px] font-semibold text-gray-600
                group-hover:text-yellow-700 truncate w-full text-center leading-tight"
              >
                {cat.label}
              </span>
            </Link>
          ))}
        </div>

        {/* ── Featured products (from Redux, country-filtered) ── */}
        <section>
          <SectionHeader
            icon={<Tag size={18} className="text-[#ffc105]" />}
            title="Featured Products"
            href="/ads?category=marketplace"
          />
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <FeaturedProducts
              category="marketplace"
              title=""
              viewAllHref="/ads?category=marketplace"
            />
          </div>
        </section>

        {/* ── Video section ── */}
        <section className="rounded-2xl overflow-hidden shadow-sm">
          <Video />
        </section>

        {/* ── Best Selling — most viewed ads ── */}
        <section>
          <SectionHeader
            icon={<Flame size={18} className="text-orange-500" />}
            title="Best Selling"
            href="/ads?category=marketplace&sort=popular"
          />
          {feedLoading ? (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
              lg:grid-cols-5 xl:grid-cols-7 gap-3"
            >
              {Array.from({ length: 7 }).map((_, i) => (
                <AdCardSkeleton key={i} />
              ))}
            </div>
          ) : bestSelling.length > 0 ? (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
              lg:grid-cols-5 xl:grid-cols-7 gap-3"
            >
              {bestSelling.map((ad) => (
                <AdCard key={ad._id} ad={ad} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <p className="text-gray-400 text-sm">
                No listings yet in {userCountry}
              </p>
              <Link
                href="/sell"
                className="inline-block mt-3 px-5 py-2 bg-[#ffc105] text-black
                  font-bold rounded-xl text-sm hover:bg-amber-400 transition"
              >
                Post the first ad →
              </Link>
            </div>
          )}
        </section>

        {/* ── Recently Posted ── */}
        <section>
          <SectionHeader
            icon={<Clock size={18} className="text-blue-500" />}
            title="Recently Posted"
            href="/ads?category=marketplace&sort=newest"
          />
          {feedLoading ? (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
              lg:grid-cols-5 xl:grid-cols-7 gap-3"
            >
              {Array.from({ length: 7 }).map((_, i) => (
                <AdCardSkeleton key={i} />
              ))}
            </div>
          ) : recentlyPosted.length > 0 ? (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
              lg:grid-cols-5 xl:grid-cols-7 gap-3"
            >
              {recentlyPosted.map((ad) => (
                <AdCard key={ad._id} ad={ad} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <p className="text-gray-400 text-sm">
                No recent listings in {userCountry}
              </p>
            </div>
          )}
        </section>

        {/* ── Sell CTA banner ── */}
        {user && (
          <section
            className="bg-gradient-to-r from-yellow-400 to-amber-400
            rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center
            justify-between gap-4 shadow-md"
          >
            <div>
              <p className="text-xl sm:text-2xl font-black text-black">
                Have something to sell?
              </p>
              <p className="text-sm text-black/70 mt-1">
                Post a free ad and reach thousands of buyers in{" "}
                {userCountry ?? "your area"}.
              </p>
            </div>
            <Link
              href="/sell"
              className="flex-shrink-0 px-7 py-3 bg-black text-white font-bold
                rounded-2xl text-sm hover:bg-gray-900 transition active:scale-95
                whitespace-nowrap"
            >
              Post an ad →
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
