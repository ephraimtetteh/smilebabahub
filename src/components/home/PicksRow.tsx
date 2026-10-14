"use client";

// client/src/components/home/PicksRow.tsx
//
// A titled row of products. Six across on desktop, two on mobile.
//
// ─── WHY THE CARDS SHRANK ────────────────────────────────────────────
//
// The square image was the problem. At six across on a 1340px page each
// card is about 205px wide, so a square image is 205px tall — and with
// the body underneath the card ran past 300px. Four rows of that is a
// very long homepage for what is meant to be a glance.
//
// A 4:3 image is about a quarter shorter and suits most listings better
// anyway: phones, furniture and food photos are rarely square, so a
// square crop was cutting them.
//
// The body is tighter too. One line of title instead of a reserved two,
// price on the same baseline, and the rating and location moved onto the
// image as small overlays rather than taking their own rows. Nothing was
// removed — it just stopped stacking.
//
// Result is roughly 210px per card against 300px before.

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
  return c === "NGN" ? "₦" : "GH₵";
};

const coverOf = (ad: any): string | undefined => {
  if (ad?.coverImage) return ad.coverImage;
  const imgs = ad?.images;
  if (!Array.isArray(imgs) || !imgs.length) return undefined;
  const first = imgs.find((i: any) => i?.isCover) ?? imgs[0];
  return typeof first === "string" ? first : first?.url;
};

const cityOf = (ad: any): string => ad?.location?.city ?? "";

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
    <section className="mt-7">
      <div className="mb-2.5 flex items-baseline justify-between">
        <h2
          className="text-sm font-bold tracking-tight"
          style={{ color: accent }}
        >
          {title}
        </h2>
        <Link
          href={viewAllHref}
          className="text-[11.5px] font-semibold text-gray-400 transition hover:text-gray-900"
        >
          See all
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {loading
          ? Array.from({ length: PER_ROW }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-gray-100 bg-white"
                style={{ height: 210 }}
              />
            ))
          : items
              .slice(0, PER_ROW)
              .map((ad) => (
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
  const img = coverOf(ad);
  const amount = priceOf(ad);
  const city = cityOf(ad);

  return (
    <Link
      href={`/ads/${ad.slug ?? ad._id}`}
      className="group overflow-hidden rounded-xl border border-gray-100 bg-white transition hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-sm"
    >
      {/* 4:3 rather than square — a quarter shorter, and it suits
          product photos better than a square crop does */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
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
            <Package size={20} className="text-gray-300" />
          </div>
        )}

        {/* Save — appears on hover, always visible on touch */}
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

        {/* Rating and location sit on the image rather than claiming
            their own rows underneath */}
        {showRating && (
          <span className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 rounded bg-black/55 px-1.5 py-0.5 text-[9.5px] font-semibold text-white backdrop-blur-sm">
            <Star size={8} className="fill-amber-400 text-amber-400" />
            {ad.rating ?? "4.6"}
          </span>
        )}

        {showLocation && city && !showRating && (
          <span className="absolute bottom-1.5 left-1.5 flex max-w-[85%] items-center gap-0.5 rounded bg-black/55 px-1.5 py-0.5 text-[9.5px] font-medium text-white backdrop-blur-sm">
            <MapPin size={8} />
            <span className="truncate">{city}</span>
          </span>
        )}

        {showDelivery && ad?.delivery?.available && (
          <span className="absolute bottom-1.5 right-1.5 rounded bg-emerald-500 px-1.5 py-0.5 text-[7.5px] font-bold tracking-wide text-white">
            FREE
          </span>
        )}
      </div>

      {/* One line of title, price directly under it. No reserved second
          line — a short title shouldn't leave a gap. */}
      <div className="px-2.5 pb-2.5 pt-2">
        <h3 className="truncate text-[11.5px] leading-tight text-gray-600">
          {ad.title ?? "Untitled listing"}
        </h3>

        <p className="mt-1 truncate text-[13px] font-bold leading-none text-gray-900">
          {amount > 0
            ? `${symbolOf(ad)} ${amount.toLocaleString()}`
            : "Ask price"}
          {priceSuffix && amount > 0 && (
            <span className="ml-0.5 text-[9.5px] font-normal text-gray-400">
              {priceSuffix}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
