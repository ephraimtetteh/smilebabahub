"use client";

// src/components/ads/AdOwnerActions.tsx
import { memo } from "react";
import Link from "next/link";
import { Ad } from "@/src/types/ad.types";

interface AdOwnerActionsProps {
  ad: Ad;
  mutating: boolean;
  onBoostOpen: () => void;
  onTogglePause: () => void;
  onMarkSold: () => void;
  onDeleteOpen: () => void;
}

const AdOwnerActions = memo(function AdOwnerActions({
  ad,
  mutating,
  onBoostOpen,
  onTogglePause,
  onMarkSold,
  onDeleteOpen,
}: AdOwnerActionsProps) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
        Manage your ad
      </p>

      {/* Boost */}
      {!ad.isSold && (
        <button
          onClick={onBoostOpen}
          className="w-full py-2.5 bg-yellow-400 text-black font-bold rounded-xl
            text-sm hover:bg-yellow-300 transition"
        >
          🚀 Boost this ad
        </button>
      )}

      {/* Edit */}
      <Link
        href={`/ads/${ad._id}/edit`}
        className="w-full flex items-center justify-center py-2.5 bg-gray-100
          text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-200 transition"
      >
        ✏️ Edit ad
      </Link>

      {/* Pause / Resume */}
      <button
        onClick={onTogglePause}
        disabled={mutating}
        className="w-full py-2.5 bg-gray-100 text-gray-700 font-semibold
          rounded-xl text-sm hover:bg-gray-200 transition disabled:opacity-50"
      >
        {ad.isPaused ? "▶️ Resume listing" : "⏸️ Pause listing"}
      </button>

      {/* Mark sold */}
      {!ad.isSold && (
        <button
          onClick={onMarkSold}
          disabled={mutating}
          className="w-full py-2.5 bg-green-100 text-green-700 font-semibold
            rounded-xl text-sm hover:bg-green-200 transition disabled:opacity-50"
        >
          ✅ Mark as sold
        </button>
      )}

      {/* Delete */}
      <button
        onClick={onDeleteOpen}
        className="w-full py-2.5 bg-red-50 text-red-600 font-semibold
          rounded-xl text-sm hover:bg-red-100 transition"
      >
        🗑️ Delete ad
      </button>
    </div>
  );
});

export default AdOwnerActions;
