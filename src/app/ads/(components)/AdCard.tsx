"use client";

// src/components/ads/AdCard.tsx
import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Ad } from "@/src/types/ad.types";
import { BOOST_BADGE, formatAdPrice } from "./ad.constants";

interface AdCardProps {
  ad: Ad;
  compact?: boolean; // smaller variant for related ads
}

const AdCard = memo(function AdCard({ ad, compact = false }: AdCardProps) {
  const isBoosted = ad.boost?.isBoosted;
  const boostTier = ad.boost?.boostTier;
  const badge = isBoosted && boostTier ? BOOST_BADGE[boostTier] : null;

  return (
    <Link
      href={`/ads/${ad._id}`}
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm
        hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div
        className={`relative w-full overflow-hidden bg-gray-100
        ${compact ? "aspect-[4/3]" : "aspect-[4/3]"}`}
      >
        {ad.coverImage ? (
          <Image
            src={ad.coverImage}
            alt={ad.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
            🖼️
          </div>
        )}

        {/* Boost badge */}
        {badge && (
          <span
            className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5
            rounded-full ${badge.cardCls}`}
          >
            {badge.label}
          </span>
        )}

        {/* Condition badge */}
        {ad.condition && ad.condition !== "not_applicable" && (
          <span
            className="absolute top-2 right-2 text-[10px] font-medium px-2 py-0.5
            bg-black/50 text-white rounded-full capitalize"
          >
            {ad.condition.replace(/_/g, " ")}
          </span>
        )}

        {/* Sold overlay */}
        {ad.isSold && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-black text-lg tracking-wider">
              SOLD
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col flex-1">
        <h3
          className={`font-semibold text-gray-800 line-clamp-2 mb-1
          ${compact ? "text-xs" : "text-sm"}`}
        >
          {ad.title}
        </h3>

        {/* Price */}
        <p
          className={`font-black text-gray-900 mb-1
          ${compact ? "text-sm" : "text-base"}`}
        >
          {formatAdPrice(
            ad.price?.amount,
            ad.price?.currency,
            ad.price?.display,
          )}
          {!compact && ad.negotiable === "yes" && (
            <span className="text-xs text-green-600 font-medium ml-2">
              (Negotiable)
            </span>
          )}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-400 mt-auto">
          <span>📍</span>
          <span className="truncate">
            {[ad.location?.city, ad.location?.region]
              .filter(Boolean)
              .join(", ")}
          </span>
        </div>

        {/* Delivery */}
        {!compact && ad.delivery?.available && (
          <span className="text-[10px] text-blue-600 font-medium mt-1">
            🚚 Delivery available
          </span>
        )}
      </div>
    </Link>
  );
});

export default AdCard;
