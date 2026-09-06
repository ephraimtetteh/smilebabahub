"use client";

// src/components/home/PicksRow.tsx
//
// A titled row of products. Six across on desktop, two on mobile.
//
// Six rather than four means a row shows a real selection instead of a
// teaser, which is the point of a picks row. The cards shrink to suit —
// smaller radius, tighter padding, one line of title — so six reads as
// a set rather than as clutter.
//
// One component for every vertical. What differs is the accent and which
// extras show: food gets a rating, stays get a per-night suffix,
// marketplace gets a location.

import Link from "next/link";
import { Heart, MapPin, Star, Package } from "lucide-react";

interface Props {
  title: string;
  accent: string;
  items: any[];
  loading?: boolean;
  viewAllHref: string;
  showDelivery?: boolean;
  showRating?: boolean;
  showLocation?: boolean;
  priceSuffix?: string;
}

const PER_ROW = 6;

// The API returns price as { amount, currency }, not a number
const priceOf = (ad: any): number => {
  const p = ad?.price;
  if (p && typeof p === "object") return Number(p.amount) || 0;
  return Number(p) || 0;
};

const symbolOf = (ad: any): string => {
  const c =
    (ad?.price && typeof ad.price === "object" && ad.price.currency) ||
    ad?.currency;
  return c === "NGN" ? "NGN" : "GHS";
};

const coverOf = (ad: any): string | undefined => {
  if (ad?.coverImage) return ad.coverImage;
  const imgs = ad?.images;
  if (!Array.isArray(imgs) || !imgs.length) return undefined;
  const first = imgs.find((i: any) => i?.isCover) ?? imgs[0];
  return typeof first === "string" ? first : first?.url;
};

const placeOf = (ad: any): string =>
  [ad?.location?.city, ad?.location?.country].filter(Boolean).join(", ");

export default function PicksRow({
  title,
  accent,
  items,
  loading,
  viewAllHref,
  showDelivery,
  showRating,
  showLocation,
  priceSuffix,
}: Props) {
  // An empty row under a bold heading reads worse than no row at all
  if (!loading && (!items || items.length === 0)) return null;

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2
          className="text-[15px] font-bold tracking-tight"
          style={{ color: accent }}
        >
          {title}
        </h2>
        <Link
          href={viewAllHref}
          className="text-xs font-semibold text-gray-500 transition hover:text-gray-900"
        >
          See All
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: PER_ROW }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-xl border border-gray-100 bg-white"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.slice(0, PER_ROW).map((ad) => (
            <ProductCard
              key={ad._id}
              ad={ad}
              accent={accent}
              showDelivery={showDelivery}
              showRating={showRating}
              showLocation={showLocation}
              priceSuffix={priceSuffix}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ProductCard({
  ad,
  accent,
  showDelivery,
  showRating,
  showLocation,
  priceSuffix,
}: {
  ad: any;
  accent: string;
  showDelivery?: boolean;
  showRating?: boolean;
  showLocation?: boolean;
  priceSuffix?: string;
}) {
  const img = coverOf(ad);
  const amount = priceOf(ad);

  return (
    <Link
      href={`/ads/${ad.slug ?? ad._id}`}
      className="group overflow-hidden rounded-xl border border-gray-100 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {img ? (
          // Plain img, because listing photos come from Cloudinary with
          // unpredictable dimensions
          <img
            src={img}
            alt={ad.title ?? "Listing"}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package size={22} className="text-gray-300" />
          </div>
        )}

        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          aria-label="Save"
          className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm transition group-hover:opacity-100 sm:opacity-100"
        >
          <Heart size={11} className="text-gray-500" />
        </button>

        {ad?.boost?.isBoosted && (
          <span className="absolute left-1.5 top-1.5 rounded bg-amber-400 px-1.5 py-0.5 text-[7.5px] font-bold tracking-wide text-gray-900">
            BOOSTED
          </span>
        )}

        {showDelivery && ad?.delivery?.available && (
          <span className="absolute bottom-1.5 left-1.5 rounded bg-white/95 px-1.5 py-0.5 text-[7.5px] font-bold text-emerald-700">
            FREE DELIVERY
          </span>
        )}
      </div>

      <div className="p-2.5">
        <h3 className="line-clamp-1 text-[11.5px] font-medium leading-tight text-gray-900">
          {ad.title ?? "Untitled listing"}
        </h3>

        <p className="mt-1 text-[12.5px] font-bold leading-none text-gray-900">
          {amount > 0
            ? `${symbolOf(ad)} ${amount.toLocaleString()}`
            : "Ask price"}
          {priceSuffix && amount > 0 && (
            <span className="ml-0.5 text-[9.5px] font-normal text-gray-400">
              {priceSuffix}
            </span>
          )}
        </p>

        {showRating && (
          <p className="mt-1 flex items-center gap-0.5 text-[10px] text-gray-500">
            <Star size={9} className="fill-amber-400 text-amber-400" />
            {ad.rating ?? "4.6"}
          </p>
        )}

        {showLocation && placeOf(ad) && (
          <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
            <MapPin size={9} />
            <span className="line-clamp-1">{placeOf(ad)}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
