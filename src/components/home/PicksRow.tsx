"use client";

// src/components/home/PicksRow.tsx
//
// A titled row of four products. One component for all four verticals —
// what differs is the accent, and which extras each shows: food gets a
// rating, stays get "/ night", marketplace gets a location.
//
// Scrolls horizontally on mobile rather than stacking, so a row stays a
// row and the page doesn't become a mile long.

import Link from "next/link";
import { Heart, MapPin, Star, CheckCircle2 } from "lucide-react";

interface Props {
  title: string;
  accent: string;
  items: any[];
  loading?: boolean;
  viewAllHref: string;
  emptyHint?: string;
  /** "Free Delivery" chip */
  showDelivery?: boolean;
  /** Star rating under the price */
  showRating?: boolean;
  /** City and country under the price */
  showLocation?: boolean;
  /** e.g. "/ night" */
  priceSuffix?: string;
}

// ─── Shape helpers — the API returns price as { amount, currency } ────
const price = (ad: any): number => {
  const p = ad?.price;
  if (p && typeof p === "object") return Number(p.amount) || 0;
  return Number(p) || 0;
};

const symbol = (ad: any): string => {
  const c =
    (ad?.price && typeof ad.price === "object" && ad.price.currency) ||
    ad?.currency;
  return c === "NGN" ? "₦" : "GH₵";
};

const cover = (ad: any): string | undefined => {
  if (ad?.coverImage) return ad.coverImage;
  const imgs = ad?.images;
  if (!Array.isArray(imgs) || !imgs.length) return undefined;
  const first = imgs.find((i: any) => i?.isCover) ?? imgs[0];
  return typeof first === "string" ? first : first?.url;
};

const place = (ad: any): string =>
  [ad?.location?.city, ad?.location?.country].filter(Boolean).join(", ");

export default function PicksRow({
  title,
  accent,
  items,
  loading,
  viewAllHref,
  emptyHint,
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
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl border border-gray-100 bg-white"
            />
          ))}
        </div>
      ) : (
        <div
          className="-mx-3 flex snap-x gap-3 overflow-x-auto px-3 pb-1
                     sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible
                     sm:px-0 lg:grid-cols-4"
        >
          {items.slice(0, 4).map((ad) => (
            <ProductCard
              key={ad._id}
              ad={ad}
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
  showDelivery,
  showRating,
  showLocation,
  priceSuffix,
}: {
  ad: any;
  showDelivery?: boolean;
  showRating?: boolean;
  showLocation?: boolean;
  priceSuffix?: string;
}) {
  const img = cover(ad);
  const amount = price(ad);

  return (
    <Link
      href={`/ads/${ad.slug ?? ad._id}`}
      className="group w-[46vw] shrink-0 snap-start overflow-hidden rounded-2xl
                 border border-gray-100 bg-white transition hover:shadow-md
                 sm:w-auto"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {img ? (
          // Plain img rather than next/image — listing photos come from
          // Cloudinary with unpredictable dimensions
          <img
            src={img}
            alt={ad.title ?? "Listing"}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300
                       group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl">
            📦
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault(); /* wire saves here */
          }}
          aria-label="Save"
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center
                     rounded-full bg-white/90 shadow-sm transition hover:bg-white"
        >
          <Heart size={13} className="text-gray-500" />
        </button>

        {ad?.boost?.isBoosted && (
          <span
            className="absolute left-2 top-2 rounded-md bg-amber-400 px-1.5 py-0.5
                       text-[8px] font-bold tracking-wide text-gray-900"
          >
            BOOSTED
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        <h3 className="line-clamp-2 min-h-[32px] text-[13px] font-medium leading-tight text-gray-900">
          {ad.title ?? "Untitled listing"}
        </h3>

        {ad?.attributes?.[0]?.value && (
          <p className="mt-0.5 line-clamp-1 text-[11px] text-gray-400">
            {String(ad.attributes[0].value)}
          </p>
        )}

        <p className="mt-1.5 text-sm font-bold text-gray-900">
          {amount > 0
            ? `${symbol(ad)} ${amount.toLocaleString()}`
            : "Ask price"}
          {priceSuffix && amount > 0 && (
            <span className="ml-1 text-[11px] font-normal text-gray-400">
              {priceSuffix}
            </span>
          )}
        </p>

        {showRating && (
          <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            {ad.rating ?? "4.6"}
            {ad.reviewCount ? ` (${ad.reviewCount})` : ""}
          </p>
        )}

        {showLocation && place(ad) && (
          <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
            <MapPin size={10} />
            <span className="line-clamp-1">{place(ad)}</span>
          </p>
        )}

        {showDelivery && ad?.delivery?.available && (
          <span
            className="mt-2 inline-flex items-center gap-1 rounded bg-emerald-50
                       px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700"
          >
            <CheckCircle2 size={9} />
            Free Delivery
          </span>
        )}
      </div>
    </Link>
  );
}
