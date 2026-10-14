"use client";
// src/components/ads/AdCard.tsx
// Renders a single ad tile in the feed.
// Expired ads show at low priority (plan-priority sort) with subtle dimming.
// "Expired" badge and expiry modal are shown ONLY to the owning vendor and admins.

import { memo, useState } from "react";
import SafeImage from "@/src/components/SafeImage";
import Link from "next/link";
import {
  MapPin,
  Truck,
  ImageOff,
  Clock,
  X,
  RefreshCw,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { Ad } from "@/src/types/ad.types";
import { BOOST_BADGE, formatAdPrice } from "./ad.constants";
import { useAppSelector } from "@/src/app/redux";

interface AdCardProps {
  ad: Ad;
  compact?: boolean;
}

// ── Expiry detail modal — only shown to the owning vendor / admin ──────────
function ExpiryModal({ ad, onClose }: { ad: Ad; onClose: () => void }) {
  const expiryDate = ad.expiresAt
    ? new Date(ad.expiresAt).toLocaleDateString("en-GH", { dateStyle: "long" })
    : null;
  const planName =
    (ad as any).plan === "premium"
      ? "SuperSmile"
      : (ad as any).plan === "popular"
        ? "HappySmile"
        : (ad as any).plan === "standard"
          ? "BasicSmile"
          : "Smile (Free)";

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center
        justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-orange-50 border-b border-orange-100 px-5 pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 bg-orange-100 rounded-xl flex items-center
                justify-center flex-shrink-0"
              >
                <AlertTriangle size={18} className="text-orange-500" />
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-sm">
                  Listing expired
                </h3>
                <p className="text-xs text-orange-600 mt-0.5">
                  {expiryDate
                    ? `Expired on ${expiryDate}`
                    : "Expiry date unknown"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 bg-gray-100 rounded-full flex items-center
                justify-center hover:bg-gray-200 transition flex-shrink-0"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Ad summary */}
          <div className="bg-gray-50 rounded-xl px-4 py-3">
            <p className="text-xs font-bold text-gray-800 line-clamp-2">
              {ad.title}
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              Plan: <strong>{planName}</strong>
              {(ad as any).daysLeft === 0 && " · Expired today"}
            </p>
          </div>

          {/* What happened */}
          <div className="text-xs text-gray-600 leading-relaxed space-y-1.5">
            <p>
              Your listing has expired and is now showing at the{" "}
              <strong>bottom of the feed</strong> with lower priority.
            </p>
            <p>
              Renew your subscription to move it back to the top and reach more
              buyers.
            </p>
          </div>

          {/* What this means */}
          <div className="space-y-2">
            {[
              {
                label: "Still visible to buyers",
                color: "text-green-600",
                icon: "✓",
              },
              {
                label: "Low placement in feed",
                color: "text-orange-500",
                icon: "↓",
              },
              { label: "No boost available", color: "text-red-500", icon: "✗" },
              {
                label: "Renew to restore priority",
                color: "text-blue-600",
                icon: "↑",
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className={`text-sm font-black ${item.color} w-4`}>
                  {item.icon}
                </span>
                <span className="text-xs text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="space-y-2 pt-1">
            <Link
              href="/subscription?renew=1"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-3
                bg-yellow-400 text-black font-black text-sm rounded-2xl
                hover:bg-yellow-300 active:scale-[0.99] transition"
            >
              <RefreshCw size={14} /> Renew subscription
            </Link>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs text-gray-500 hover:text-gray-700 transition"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main card ──────────────────────────────────────────────────────────────
const AdCard = memo(function AdCard({ ad, compact = false }: AdCardProps) {
  const authUser = useAppSelector((s) => s.auth.user);
  const isBoosted = ad.boost?.isBoosted;
  const boostTier = ad.boost?.boostTier;
  const badge = isBoosted && boostTier ? BOOST_BADGE[boostTier] : null;

  const isExpired =
    (ad as any).isExpired ||
    (ad.expiresAt ? new Date(ad.expiresAt) < new Date() : false);

  const daysLeft = ad.daysLeft ?? null;
  const expiringSoon =
    daysLeft !== null && daysLeft <= 3 && daysLeft > 0 && !isExpired;

  // Only vendor who owns this ad OR admin sees expiry info
  const isOwner =
    authUser &&
    String((ad as any).postedBy?._id ?? (ad as any).postedBy) === authUser._id;
  const isAdmin = authUser?.role === "admin";
  const showExpiry = isExpired && (isOwner || isAdmin);

  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className={`group relative bg-white rounded-2xl border border-gray-100 shadow-sm
          hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col
          ${isExpired ? "opacity-75" : ""}`}
      >
        {/* Make the whole card clickable except for expired-owner interaction */}
        <Link
          href={`/ads/${ad._id}`}
          className="flex flex-col flex-1"
          onClick={(e) => {
            // If vendor clicks expired card, show modal instead of navigating
            if (showExpiry) {
              e.preventDefault();
              setShowModal(true);
            }
          }}
        >
          {/* ── Image ── */}
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
            {ad.coverImage ? (
              <SafeImage
                src={ad.coverImage}
                alt={ad.title}
                fill
                sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 20vw, 16vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageOff size={28} className="text-gray-200" />
              </div>
            )}

            {/* Boost badge — top left */}
            {badge && (
              <span
                className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5
                rounded-full ${badge.cardCls}`}
              >
                {badge.label}
              </span>
            )}

            {/* Condition — top right (only when not expired for non-owners) */}
            {ad.condition &&
              ad.condition !== "not_applicable" &&
              !isExpired && (
                <span
                  className="absolute top-2 right-2 text-[10px] font-medium px-2 py-0.5
                bg-black/50 text-white rounded-full capitalize"
                >
                  {ad.condition.replace(/_/g, " ")}
                </span>
              )}

            {/* Expired indicator — ONLY for owner / admin */}
            {showExpiry && (
              <>
                {/* Subtle warm tint over image */}
                <div className="absolute inset-0 bg-orange-900/20" />
                {/* Expired badge — top right */}
                <span
                  className="absolute top-2 right-2 flex items-center gap-1
                  bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5
                  rounded-full shadow-sm"
                >
                  <Clock size={9} /> Expired
                </span>
                {/* Tap to renew hint at bottom */}
                <div
                  className="absolute bottom-0 inset-x-0 bg-orange-500/90 py-1.5
                  text-white text-[10px] font-bold text-center"
                >
                  Tap to see renewal options
                </div>
              </>
            )}

            {/* SOLD overlay */}
            {ad.isSold && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-black text-lg tracking-wider">
                  SOLD
                </span>
              </div>
            )}

            {/* Expiring soon warning — for owner only */}
            {expiringSoon && (isOwner || isAdmin) && (
              <span
                className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5
                bg-orange-500 text-white rounded-full flex items-center gap-1"
              >
                <Clock size={9} /> {daysLeft}d left
              </span>
            )}
          </div>

          {/* ── Body ── */}
          <div className="p-3 flex flex-col flex-1">
            <h3
              className={`font-semibold text-gray-800 line-clamp-2 mb-1
              ${compact ? "text-xs" : "text-sm"}`}
            >
              {ad.title}
            </h3>

            <p
              className={`font-black mb-1
              ${compact ? "text-sm text-gray-900" : "text-base text-gray-900"}`}
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

            <div className="flex items-center gap-1 text-xs text-gray-400 mt-auto pt-1">
              <MapPin size={11} className="flex-shrink-0" />
              <span className="truncate">
                {[ad.location?.city, ad.location?.region]
                  .filter(Boolean)
                  .join(", ") || "Location TBD"}
              </span>
            </div>

            {!compact && ad.delivery?.available && (
              <span className="flex items-center gap-1 text-[10px] text-blue-600 font-medium mt-1.5">
                <Truck size={11} /> Delivery available
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Expiry modal — only for vendor/admin */}
      {showModal && showExpiry && (
        <ExpiryModal ad={ad} onClose={() => setShowModal(false)} />
      )}
    </>
  );
});

export default AdCard;
