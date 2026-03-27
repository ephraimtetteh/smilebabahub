"use client";

// src/components/VendorComponents/VendorProductCard.tsx
import { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { Ad, BoostTier } from "@/src/types/ad.types";
import {
  formatAdPrice,
  BOOST_BADGE,
} from "@/src/app/ads/(components)/ad.constants";
import { BoostModal } from "@/src/app/ads/(components)/AdModals";

// ── Status badge config ────────────────────────────────────────────────────
function getStatus(ad: Ad): { label: string; cls: string } {
  if (ad.isSold) return { label: "Sold", cls: "bg-green-100 text-green-700" };
  if (ad.isPaused) return { label: "Paused", cls: "bg-gray-100 text-gray-500" };
  if ((ad as any).isExpired)
    return { label: "Expired", cls: "bg-red-100 text-red-500" };
  if (ad.moderation?.status === "pending")
    return { label: "In Review", cls: "bg-yellow-100 text-yellow-700" };
  if (ad.moderation?.status === "rejected")
    return { label: "Rejected", cls: "bg-red-100 text-red-600" };
  if (ad.isActive) return { label: "Active", cls: "bg-blue-100 text-blue-700" };
  return { label: "Inactive", cls: "bg-gray-100 text-gray-500" };
}

interface VendorProductCardProps {
  ad: Ad;
  mutating: boolean;
  onBoost: (tier: BoostTier) => void;
  onPause: () => void;
  onMarkSold: () => void;
  onDelete: () => void;
}

const VendorProductCard = memo(function VendorProductCard({
  ad,
  mutating,
  onBoost,
  onPause,
  onMarkSold,
  onDelete,
}: VendorProductCardProps) {
  const [boostOpen, setBoostOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const status = getStatus(ad);
  const boostBadge = ad.boost?.isBoosted
    ? BOOST_BADGE[ad.boost.boostTier]
    : null;
  const coverImg = ad.coverImage ?? ad.images?.[0]?.url ?? "";
  const sym = ad.price?.currency === "NGN" ? "₦" : "₵";

  return (
    <>
      <div
        className="bg-white rounded-2xl border border-gray-100 shadow-sm
        overflow-hidden hover:shadow-md transition-shadow group"
      >
        {/* ── Image ── */}
        <div className="relative w-full h-44 bg-gray-100 overflow-hidden">
          {coverImg ? (
            <Image
              src={coverImg}
              alt={ad.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-200">
              🖼️
            </div>
          )}

          {/* Status badge */}
          <span
            className={`absolute top-2 left-2 text-[11px] font-bold px-2.5
            py-0.5 rounded-full ${status.cls}`}
          >
            {status.label}
          </span>

          {/* Boost badge */}
          {boostBadge && (
            <span
              className={`absolute top-2 right-2 text-[10px] font-bold
              px-2 py-0.5 rounded-full ${boostBadge.cardCls}`}
            >
              {boostBadge.label}
            </span>
          )}

          {/* Sold overlay */}
          {ad.isSold && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-black text-lg tracking-widest">
                SOLD
              </span>
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-0.5">
            {ad.title}
          </h3>
          <p className="text-base font-black text-gray-900 mb-1">
            {formatAdPrice(
              ad.price?.amount,
              ad.price?.currency,
              ad.price?.display,
            )}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-4">
            <span>👁️ {ad.views ?? 0}</span>
            <span>📞 {ad.contactClicks ?? 0}</span>
            {ad.location?.city && <span>📍 {ad.location.city}</span>}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            {/* Boost */}
            {!ad.isSold && (
              <button
                onClick={() => setBoostOpen(true)}
                className="py-2 bg-[#ffc105] text-black text-xs font-bold
                  rounded-xl hover:bg-amber-400 transition active:scale-95"
              >
                🚀 Boost
              </button>
            )}

            {/* Edit */}
            <Link
              href={`/ads/${ad._id}/edit`}
              className="py-2 bg-gray-100 text-gray-700 text-xs font-semibold
                rounded-xl hover:bg-gray-200 transition text-center"
            >
              ✏️ Edit
            </Link>

            {/* Pause / Resume */}
            {!ad.isSold && (
              <button
                onClick={onPause}
                disabled={mutating}
                className="py-2 bg-gray-100 text-gray-700 text-xs font-semibold
                  rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
              >
                {ad.isPaused ? "▶ Resume" : "⏸ Pause"}
              </button>
            )}

            {/* Mark sold */}
            {!ad.isSold && (
              <button
                onClick={onMarkSold}
                disabled={mutating}
                className="py-2 bg-green-50 text-green-700 text-xs font-semibold
                  rounded-xl hover:bg-green-100 transition disabled:opacity-50"
              >
                ✅ Sold
              </button>
            )}

            {/* View */}
            <Link
              href={`/product/${ad._id}`}
              className="py-2 bg-blue-50 text-blue-700 text-xs font-semibold
                rounded-xl hover:bg-blue-100 transition text-center"
            >
              👁 View
            </Link>

            {/* Delete */}
            <button
              onClick={() => setConfirmDelete(true)}
              className="py-2 bg-red-50 text-red-500 text-xs font-semibold
                rounded-xl hover:bg-red-100 transition"
            >
              🗑 Delete
            </button>
          </div>
        </div>
      </div>

      {/* Boost modal */}
      {boostOpen && (
        <BoostModal
          adId={ad._id}
          mutating={mutating}
          onBoost={(tier) => {
            onBoost(tier);
            setBoostOpen(false);
          }}
          onClose={() => setBoostOpen(false)}
        />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center
          justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center">
            <p className="text-3xl mb-3">🗑️</p>
            <p className="text-lg font-black text-gray-900 mb-2">
              Delete this ad?
            </p>
            <p className="text-sm text-gray-500 mb-6 line-clamp-2">
              {ad.title}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold
                  rounded-2xl text-sm hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setConfirmDelete(false);
                }}
                disabled={mutating}
                className="flex-1 py-3 bg-red-500 text-white font-bold
                  rounded-2xl text-sm disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default VendorProductCard;
