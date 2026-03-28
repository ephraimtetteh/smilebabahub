"use client";

// src/components/category/CategoryShared.tsx
// All shared building blocks for category landing pages.
// Zero emojis — all icons from lucide-react.

import React, { useEffect, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  MapPin,
  Eye,
  Flame,
  Clock,
  Tag,
  Globe,
  Car,
  Smartphone,
  Shirt,
  Sofa,
  Phone,
  UtensilsCrossed,
  Home,
  Wrench,
  Building2,
  BedDouble,
  BedSingle,
  CalendarDays,
  KeyRound,
  Map,
  Beef,
  CupSoda,
  ShoppingCart,
  Croissant,
  ChefHat,
  Coffee,
  Utensils,
  Star,
  Zap,
  ImageOff,
  TrendingUp,
} from "lucide-react";

import FeaturedProducts from "@/src/components/FeaturedProducts";
import { useAds } from "@/src/hooks/useAds";
import { useAppSelector } from "@/src/app/redux";
import { Ad } from "@/src/types/ad.types";

import Radio from "@/src/components/Radio";
import Video from "@/src/components/Video";
import MarketplaceSearch from "@/src/components/NewSearch";
import { formatAdPrice } from "@/src/app/ads/(components)/ad.constants";

// ─────────────────────────────────────────────────────────────────────────────
// 1. COUNTRY CHIP
// ─────────────────────────────────────────────────────────────────────────────
export function CountryChip({
  country,
  currency,
  label,
}: {
  country?: string;
  currency?: string;
  label?: string;
}) {
  if (!country) return null;

  // Country flags are still fine as text (they're flag emoji, universally supported)
  const flag = country === "Ghana" ? "🇬🇭" : country === "Nigeria" ? "🇳🇬" : null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 -mb-4">
      {flag ? (
        <span className="text-base leading-none">{flag}</span>
      ) : (
        <Globe size={14} className="text-gray-400" />
      )}
      <span>
        {label ?? "Listings"} in{" "}
        <strong className="text-gray-700">{country}</strong>
      </span>
      <span className="text-gray-300">·</span>
      <span className="text-gray-400">
        {currency === "NGN" ? "₦ NGN" : "₵ GHS"}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. SECTION HEADER
// ─────────────────────────────────────────────────────────────────────────────
export function SectionHeader({
  icon,
  title,
  href,
  linkLabel = "View all",
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

// ─────────────────────────────────────────────────────────────────────────────
// 3. AD CARD
// ─────────────────────────────────────────────────────────────────────────────
export const AdCard = memo(function AdCard({ ad }: { ad: Ad }) {
  const cover = ad.coverImage ?? ad.images?.[0]?.url ?? "";

  return (
    <Link
      href={`/product/${ad._id}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm
        overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
    >
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
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff size={28} className="text-gray-200" />
          </div>
        )}
        {ad.boost?.isBoosted && (
          <span
            className="absolute top-2 left-2 flex items-center gap-1 text-[10px]
            font-bold bg-yellow-400 text-black px-2 py-0.5 rounded-full"
          >
            <Zap size={9} /> Boosted
          </span>
        )}
        {ad.condition === "brand_new" && (
          <span
            className="absolute top-2 right-2 flex items-center gap-1 text-[10px]
            font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full"
          >
            <Star size={9} /> New
          </span>
        )}
      </div>

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
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. AD CARD SKELETON
// ─────────────────────────────────────────────────────────────────────────────
export function AdCardSkeleton() {
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

// ─────────────────────────────────────────────────────────────────────────────
// 5. AD CARD GRID
// ─────────────────────────────────────────────────────────────────────────────
export function AdCardGrid({
  ads,
  loading,
  emptyMessage,
  emptyHref,
}: {
  ads: Ad[];
  loading: boolean;
  emptyMessage: string;
  emptyHref?: string;
}) {
  const gridCls =
    "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3";

  if (loading) {
    return (
      <div className={gridCls}>
        {Array.from({ length: 7 }).map((_, i) => (
          <AdCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!ads.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <ImageOff size={36} className="text-gray-200 mx-auto mb-3" />
        <p className="text-gray-400 text-sm mb-3">{emptyMessage}</p>
        {emptyHref && (
          <Link
            href={emptyHref}
            className="inline-block px-5 py-2 bg-[#ffc105] text-black font-bold
              rounded-xl text-sm hover:bg-amber-400 transition"
          >
            Post the first ad
          </Link>
        )}
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
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SELL CTA BANNER
// ─────────────────────────────────────────────────────────────────────────────
export function SellCtaBanner({ country }: { country?: string }) {
  const user = useAppSelector((s) => s.auth.user);
  if (!user) return null;

  return (
    <section
      className="bg-gradient-to-r from-yellow-400 to-amber-400 rounded-3xl
      p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md"
    >
      <div>
        <p className="text-xl sm:text-2xl font-black text-black">
          Have something to sell?
        </p>
        <p className="text-sm text-black/70 mt-1">
          Post a free ad and reach thousands of buyers
          {country ? ` in ${country}` : ""}.
        </p>
      </div>
      <Link
        href="/sell"
        className="flex-shrink-0 flex items-center gap-2 px-7 py-3 bg-black
          text-white font-bold rounded-2xl text-sm hover:bg-gray-900
          transition active:scale-95 whitespace-nowrap"
      >
        Post an ad <ChevronRight size={15} />
      </Link>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. CATEGORY QUICK LINKS  — icon is a Lucide ReactNode, not an emoji string
// ─────────────────────────────────────────────────────────────────────────────
export type CategoryLink = {
  label: string;
  icon: React.ReactNode;
  href: string;
  color: string; // bg-* tailwind class for the icon bubble
};

export function CategoryQuickLinks({
  links,
  country,
}: {
  links: CategoryLink[];
  country?: string;
}) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
      {links.map((cat) => (
        <Link
          key={cat.href}
          href={`${cat.href}${country ? `&country=${country}` : ""}`}
          className="flex flex-col items-center gap-2 bg-white rounded-2xl
            border border-gray-100 shadow-sm py-3.5 px-2 hover:border-yellow-300
            hover:shadow-md transition group text-center"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center
            flex-shrink-0 ${cat.color} group-hover:scale-110 transition-transform`}
          >
            {cat.icon}
          </div>
          <span
            className="text-[11px] font-semibold text-gray-600
            group-hover:text-yellow-700 truncate w-full text-center leading-tight"
          >
            {cat.label}
          </span>
        </Link>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. CATEGORY LANDING LAYOUT
// ─────────────────────────────────────────────────────────────────────────────
export interface CategoryPageConfig {
  category: "marketplace" | "food" | "apartments";
  countryLabel: string;
  featuredTitle: string;
  featuredHref: string;
  bestSellingTitle: string;
  recentTitle: string;
  quickLinks: CategoryLink[];
  showSearch?: boolean;
  showRadio?: boolean;
  showVideo?: boolean;
}

export function CategoryLandingLayout({
  config,
}: {
  config: CategoryPageConfig;
}) {
  const {
    category,
    countryLabel,
    featuredTitle,
    featuredHref,
    bestSellingTitle,
    recentTitle,
    quickLinks,
    showSearch = true,
    showRadio = true,
    showVideo = true,
  } = config;

  const { ads, feedLoading, loadAds, userCountry, userCurrency } = useAds();
  const hasCheckedAuth = useAppSelector((s) => s.auth.hasCheckedAuth);

  useEffect(() => {
    if (!hasCheckedAuth) return;
    loadAds({
      country: userCountry as any,
      category,
      sort: "newest",
      page: 1,
      limit: 24,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCheckedAuth, userCountry]);

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
      {showRadio && <Radio />}

      <div
        className="w-full 
        flex flex-col gap-10 py-10"
      >
        <CountryChip
          country={userCountry}
          currency={userCurrency}
          label={countryLabel}
        />

        {showSearch && (
          <div className="w-full">
            <MarketplaceSearch />
          </div>
        )}

        <CategoryQuickLinks links={quickLinks} country={userCountry} />

        <section>
          <SectionHeader
            icon={<Tag size={18} className="text-[#ffc105]" />}
            title={featuredTitle}
            href={featuredHref}
          />
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <FeaturedProducts
              category={category}
              title=""
              viewAllHref={featuredHref}
            />
          </div>
        </section>

        {showVideo && (
          <section className="rounded-2xl overflow-hidden shadow-sm">
            <Video />
          </section>
        )}

        <section>
          <SectionHeader
            icon={<Flame size={18} className="text-orange-500" />}
            title={bestSellingTitle}
            href={`/ads?category=${category}&sort=popular`}
          />
          <AdCardGrid
            ads={bestSelling}
            loading={feedLoading}
            emptyMessage={`No listings yet in ${userCountry ?? "your area"}`}
            emptyHref="/sell"
          />
        </section>

        <section>
          <SectionHeader
            icon={<Clock size={18} className="text-blue-500" />}
            title={recentTitle}
            href={`/ads?category=${category}&sort=newest`}
          />
          <AdCardGrid
            ads={recentlyPosted}
            loading={feedLoading}
            emptyMessage={`No recent listings in ${userCountry ?? "your area"}`}
          />
        </section>

        <SellCtaBanner country={userCountry} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Icon maps — imported by each page to build their quickLinks arrays
// ─────────────────────────────────────────────────────────────────────────────
export const MARKETPLACE_LINKS: CategoryLink[] = [
  {
    label: "Vehicles",
    icon: <Car size={20} className="text-blue-600" />,
    color: "bg-blue-50",
    href: "/ads?category=marketplace&sub=vehicles",
  },
  {
    label: "Electronics",
    icon: <Smartphone size={20} className="text-indigo-600" />,
    color: "bg-indigo-50",
    href: "/ads?category=marketplace&sub=electronics",
  },
  {
    label: "Fashion",
    icon: <Shirt size={20} className="text-pink-600" />,
    color: "bg-pink-50",
    href: "/ads?category=marketplace&sub=fashion",
  },
  {
    label: "Furniture",
    icon: <Sofa size={20} className="text-amber-600" />,
    color: "bg-amber-50",
    href: "/ads?category=marketplace&sub=furniture",
  },
  {
    label: "Phones",
    icon: <Phone size={20} className="text-green-600" />,
    color: "bg-green-50",
    href: "/ads?category=marketplace&sub=phones",
  },
  {
    label: "Food",
    icon: <UtensilsCrossed size={20} className="text-orange-600" />,
    color: "bg-orange-50",
    href: "/food",
  },
  {
    label: "Apartments",
    icon: <Home size={20} className="text-teal-600" />,
    color: "bg-teal-50",
    href: "/restate",
  },
  {
    label: "Services",
    icon: <Wrench size={20} className="text-gray-600" />,
    color: "bg-gray-100",
    href: "/ads?category=marketplace&sub=services",
  },
];

export const FOOD_LINKS: CategoryLink[] = [
  {
    label: "Fast Food",
    icon: <Beef size={20} className="text-red-600" />,
    color: "bg-red-50",
    href: "/ads?category=food&sub=fast-food",
  },
  {
    label: "Local Dishes",
    icon: <UtensilsCrossed size={20} className="text-orange-600" />,
    color: "bg-orange-50",
    href: "/ads?category=food&sub=local-dishes",
  },
  {
    label: "Drinks",
    icon: <CupSoda size={20} className="text-blue-600" />,
    color: "bg-blue-50",
    href: "/ads?category=food&sub=drinks",
  },
  {
    label: "Groceries",
    icon: <ShoppingCart size={20} className="text-green-600" />,
    color: "bg-green-50",
    href: "/ads?category=food&sub=groceries",
  },
  {
    label: "Pastries",
    icon: <Croissant size={20} className="text-amber-600" />,
    color: "bg-amber-50",
    href: "/ads?category=food&sub=pastries",
  },
  {
    label: "Catering",
    icon: <ChefHat size={20} className="text-purple-600" />,
    color: "bg-purple-50",
    href: "/ads?category=food&sub=catering",
  },
  {
    label: "Beverages",
    icon: <Coffee size={20} className="text-brown-600 text-yellow-800" />,
    color: "bg-yellow-50",
    href: "/ads?category=food&sub=beverages",
  },
  {
    label: "All Food",
    icon: <Utensils size={20} className="text-gray-600" />,
    color: "bg-gray-100",
    href: "/ads?category=food",
  },
];

export const REALESTATE_LINKS: CategoryLink[] = [
  {
    label: "Self-contained",
    icon: <Home size={20} className="text-teal-600" />,
    color: "bg-teal-50",
    href: "/ads?category=apartments&sub=self-contained",
  },
  {
    label: "Chamber & Hall",
    icon: <BedDouble size={20} className="text-blue-600" />,
    color: "bg-blue-50",
    href: "/ads?category=apartments&sub=chamber-hall",
  },
  {
    label: "Studio",
    icon: <Building2 size={20} className="text-indigo-600" />,
    color: "bg-indigo-50",
    href: "/ads?category=apartments&sub=studio",
  },
  {
    label: "2-Bedroom",
    icon: <BedSingle size={20} className="text-green-600" />,
    color: "bg-green-50",
    href: "/ads?category=apartments&sub=2-bedroom",
  },
  {
    label: "3-Bedroom+",
    icon: <BedDouble size={20} className="text-purple-600" />,
    color: "bg-purple-50",
    href: "/ads?category=apartments&sub=3-bedroom-plus",
  },
  {
    label: "Short Stay",
    icon: <CalendarDays size={20} className="text-pink-600" />,
    color: "bg-pink-50",
    href: "/ads?category=apartments&sub=short-stay",
  },
  {
    label: "Buy",
    icon: <KeyRound size={20} className="text-amber-600" />,
    color: "bg-amber-50",
    href: "/ads?category=apartments&negotiable=no",
  },
  {
    label: "All Properties",
    icon: <Map size={20} className="text-gray-600" />,
    color: "bg-gray-100",
    href: "/ads?category=apartments",
  },
];
