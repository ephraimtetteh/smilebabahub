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
  const isExpired = ad.isExpired;
  const daysLeft = ad.daysLeft ?? null;
  const expiringSoon = !isExpired && daysLeft !== null && daysLeft <= 3;

  return (
    <Link
      href={`/ads/${ad._id}`}
      className={`group relative bg-white rounded-2xl border shadow-sm
        hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col
        ${
          isExpired
            ? "border-gray-200 opacity-60 hover:opacity-80"
            : "border-gray-100"
        }`}
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
        {ad.coverImage ? (
          <SafeImage
            src={ad.coverImage}
            alt={ad.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className={`object-cover group-hover:scale-105 transition-transform duration-300
              ${isExpired ? "grayscale-[40%]" : ""}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff size={28} className="text-gray-200" />
          </div>
        )}

        {/* Boost badge */}
        {badge && !isExpired && (
          <span
            className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5
            rounded-full ${badge.cardCls}`}
          >
            {badge.label}
          </span>
        )}

        {/* Condition */}
        {ad.condition && ad.condition !== "not_applicable" && !isExpired && (
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

        {/* EXPIRED overlay */}
        {isExpired && (
          <div className="absolute inset-0 bg-gray-900/30 flex items-center justify-center">
            <span
              className="bg-gray-800/80 text-white text-[11px] font-bold
              px-3 py-1 rounded-full tracking-wide flex items-center gap-1.5"
            >
              <Clock size={10} /> Listing expired
            </span>
          </div>
        )}

        {/* Expiring soon warning */}
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
          className={`font-semibold line-clamp-2 mb-1
          ${isExpired ? "text-gray-400" : "text-gray-800"}
          ${compact ? "text-xs" : "text-sm"}`}
        >
          {ad.title}
        </h3>

        <p
          className={`font-black mb-1
          ${isExpired ? "text-gray-400" : "text-gray-900"}
          ${compact ? "text-sm" : "text-base"}`}
        >
          {formatAdPrice(
            ad.price?.amount,
            ad.price?.currency,
            ad.price?.display,
          )}
          {!compact && ad.negotiable === "yes" && !isExpired && (
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

        {!compact && ad.delivery?.available && !isExpired && (
          <span className="flex items-center gap-1 text-[10px] text-blue-600 font-medium mt-1">
            <Truck size={11} /> Delivery available
          </span>
        )}

        {/* Expired note at bottom of card */}
        {isExpired && !compact && (
          <p className="text-[10px] text-orange-500 font-medium mt-1.5 flex items-center gap-1">
            <Clock size={9} /> Renew to make active again
          </p>
        )}
      </div>
    </Link>
  );
});

export default AdCard;
