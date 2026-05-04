"use client";
// src/components/ads/AdCard.tsx
// Renders a single ad tile in the feed.
// Expired ads show at low priority with a dimmed overlay + "Expired" badge.

import { memo } from "react";
import SafeImage from "@/src/components/SafeImage";
import Link from "next/link";
import { MapPin, Truck, ImageOff, Clock } from "lucide-react";
import { Ad } from "@/src/types/ad.types";
import { BOOST_BADGE, formatAdPrice } from "./ad.constants";

interface AdCardProps {
  ad: Ad;
  compact?: boolean;
}

const AdCard = memo(function AdCard({ ad, compact = false }: AdCardProps) {
  const isBoosted = ad.boost?.isBoosted;
  const boostTier = ad.boost?.boostTier;
  const badge = isBoosted && boostTier ? BOOST_BADGE[boostTier] : null;
  const isExpired =
    (ad as any).isExpired ||
    (ad.expiresAt ? new Date(ad.expiresAt) < new Date() : false);
  // Expired ads are NOT filtered out — they show at bottom of feed with reduced opacity
  // daysLeft warning badge shown for ads expiring within 3 days
  // so vendors can see it if they're browsing their own listings.
  const daysLeft = ad.daysLeft ?? null;
  const expiringSoon = daysLeft !== null && daysLeft <= 3 && daysLeft > 0;

  return (
    <Link
      href={`/ads/${ad._id}`}
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm
        hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
        {ad.coverImage ? (
          <SafeImage
            src={ad.coverImage}
            alt={ad.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff size={28} className="text-gray-200" />
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

        {/* Condition */}
        {ad.condition && ad.condition !== "not_applicable" && (
          <span
            className="absolute top-2 right-2 text-[10px] font-medium px-2 py-0.5
            bg-black/50 text-white rounded-full capitalize"
          >
            {ad.condition.replace(/_/g, " ")}
          </span>
        )}

        {/* SOLD overlay */}
        {ad.isSold && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-black text-lg tracking-wider">
              SOLD
            </span>
          </div>
        )}

        {/* Expired badge — shown at bottom of feed, not hidden */}
        {isExpired && !ad.isSold && (
          <>
            <div className="absolute inset-0 bg-gray-900/30" />
            <span
              className="absolute top-2 right-2 bg-gray-800/90 text-gray-300
              text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-600"
            >
              Expired
            </span>
          </>
        )}

        {/* Expiring soon warning — visible to vendor browsing their own listings */}
        {expiringSoon && (
          <span
            className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5
            bg-orange-500 text-white rounded-full flex items-center gap-1"
          >
            <Clock size={9} /> {daysLeft}d left
          </span>
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

        <div className="flex items-center gap-1 text-xs text-gray-400 mt-auto">
          <MapPin size={11} className="flex-shrink-0" />
          <span className="truncate">
            {[ad.location?.city, ad.location?.region]
              .filter(Boolean)
              .join(", ")}
          </span>
        </div>

        {!compact && ad.delivery?.available && (
          <span className="flex items-center gap-1 text-[10px] text-blue-600 font-medium mt-1">
            <Truck size={11} /> Delivery available
          </span>
        )}
      </div>
    </Link>
  );
});

export default AdCard;
