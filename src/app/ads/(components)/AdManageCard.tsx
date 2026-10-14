"use client";

// src/components/ads/AdManageCard.tsx
import { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Ad, BoostTier } from "@/src/types/ad.types";
import { formatAdPrice, formatDate, BOOST_BADGE } from "./ad.constants";
import { BoostModal } from "./AdModals";

interface AdManageCardProps {
  ad: Ad;
  onBoost: (tier: BoostTier) => void;
  onPause: () => void;
  onSold: () => void;
  onDelete: () => void;
  mutating?: boolean;
}

const AdManageCard = memo(function AdManageCard({
  ad,
  onBoost,
  onPause,
  onSold,
  onDelete,
  mutating = false,
}: AdManageCardProps) {
  const [boostOpen, setBoostOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const boost = ad.boost;
  const boostBadge = boost?.isBoosted ? BOOST_BADGE[boost.boostTier] : null;
  const isSold = ad.isSold;
  const isPaused = ad.isPaused;
  const isExpired = ad.isExpired;

  const handleBoost = (tier: BoostTier) => {
    onBoost(tier);
    setBoostOpen(false);
  };

  const statusBadge = (() => {
    if (isSold) return { label: "Sold", cls: "bg-green-100 text-green-700" };
    if (isPaused) return { label: "Paused", cls: "bg-gray-100 text-gray-500" };
    if (isExpired) return { label: "Expired", cls: "bg-red-100 text-red-500" };
    const mod = ad.moderation?.status;
    if (mod === "pending")
      return { label: "In review", cls: "bg-yellow-100 text-yellow-700" };
    if (mod === "rejected")
      return { label: "Rejected", cls: "bg-red-100 text-red-500" };
    return { label: "Active", cls: "bg-blue-100 text-blue-700" };
  })();

  return (
    <>
      <div
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden
        hover:shadow-md transition-shadow"
      >
        <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
          {/* Thumbnail */}
          <div
            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden
            bg-gray-100 flex-shrink-0"
          >
            {ad.coverImage ? (
              <Image
                src={ad.coverImage}
                alt={ad.title}
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                🖼️
              </div>
            )}
            {boostBadge && (
              <div
                className={`absolute bottom-0 left-0 right-0 text-[9px] font-bold
                text-center py-0.5 ${boostBadge.cardCls}`}
              >
                {boostBadge.label}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {ad.title}
                </p>
                <p className="text-base font-black text-gray-900">
                  {formatAdPrice(
                    ad.price?.amount,
                    ad.price?.currency,
                    ad.price?.display,
                  )}
                </p>
              </div>
              <span
                className={`flex-shrink-0 text-[11px] font-semibold px-2 py-0.5
                rounded-full ${statusBadge.cls}`}
              >
                {statusBadge.label}
              </span>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-3 mt-1.5">
              <span className="text-[11px] text-gray-400">
                👁️ {ad.views ?? 0} views
              </span>
              <span className="text-[11px] text-gray-400">
                📞 {ad.contactClicks ?? 0} contacts
              </span>
              {ad.daysLeft !== null && ad.daysLeft !== undefined && !isSold && (
                <span
                  className={`text-[11px] font-medium
                  ${ad.daysLeft <= 3 ? "text-orange-500" : "text-gray-400"}`}
                >
                  ⏰ {ad.daysLeft}d left
                </span>
              )}
              <span className="text-[11px] text-gray-400">
                {formatDate(ad.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex border-t border-gray-100 divide-x divide-gray-100">
          {/* View */}
          <Link
            href={`/ads/${ad._id}`}
            className="flex-1 py-2.5 text-xs font-medium text-gray-600
              hover:bg-gray-50 transition text-center"
          >
            View
          </Link>

          {/* Edit */}
          <Link
            href={`/ads/${ad._id}/edit`}
            className="flex-1 py-2.5 text-xs font-medium text-gray-600
              hover:bg-gray-50 transition text-center"
          >
            Edit
          </Link>

          {/* Boost */}
          {!isSold && !isExpired && (
            <button
              onClick={() => setBoostOpen(true)}
              className="flex-1 py-2.5 text-xs font-bold text-amber-600
                hover:bg-amber-50 transition"
            >
              🚀 Boost
            </button>
          )}

          {/* Pause / Resume */}
          {!isSold && !isExpired && (
            <button
              onClick={onPause}
              disabled={mutating}
              className="flex-1 py-2.5 text-xs font-medium text-gray-600
                hover:bg-gray-50 transition disabled:opacity-40"
            >
              {isPaused ? "▶ Resume" : "⏸ Pause"}
            </button>
          )}

          {/* Mark sold */}
          {!isSold && (
            <button
              onClick={onSold}
              disabled={mutating}
              className="flex-1 py-2.5 text-xs font-medium text-green-600
                hover:bg-green-50 transition disabled:opacity-40"
            >
              ✅ Sold
            </button>
          )}

          {/* Delete */}
          <button
            onClick={() => setDeleteConfirm(true)}
            className="flex-1 py-2.5 text-xs font-medium text-red-500
              hover:bg-red-50 transition"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Boost modal */}
      {boostOpen && (
        <BoostModal
          adId={ad._id}
          mutating={mutating}
          onBoost={handleBoost}
          onClose={() => setBoostOpen(false)}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center">
            <p className="text-3xl mb-3">🗑️</p>
            <p className="text-lg font-black text-gray-900 mb-2">
              Delete this ad?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              This cannot be undone. The ad will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold
                  rounded-2xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setDeleteConfirm(false);
                }}
                disabled={mutating}
                className="flex-1 py-3 bg-red-500 text-white font-bold
                  rounded-2xl text-sm disabled:opacity-50"
              >
                {mutating ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default AdManageCard;
