"use client";

// src/components/ads/AdModals.tsx
import { memo } from "react";
import { BoostTier } from "@/src/types/ad.types";
import { BOOST_TIERS } from "./ad.constants";

// ── Boost modal ────────────────────────────────────────────────────────────
interface BoostModalProps {
  mutating: boolean;
  onBoost: (tier: BoostTier) => void;
  onClose: () => void;
}

export const BoostModal = memo(function BoostModal({
  mutating,
  onBoost,
  onClose,
}: BoostModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center
      justify-center p-4"
    >
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-black text-gray-900 mb-1">Boost this ad</h3>
        <p className="text-sm text-gray-500 mb-5">
          Choose a boost tier to increase visibility and reach more buyers.
        </p>

        <div className="space-y-3 mb-5">
          {BOOST_TIERS.map((b) => (
            <button
              key={b.tier}
              onClick={() => onBoost(b.tier)}
              disabled={mutating}
              className="w-full flex items-start gap-3 p-4 bg-gray-50 border-2
                border-gray-100 rounded-2xl hover:border-yellow-400 transition
                text-left disabled:opacity-50 active:scale-[0.99]"
            >
              <span className="text-2xl flex-shrink-0">{b.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{b.label}</p>
                <p className="text-xs text-gray-500">{b.desc}</p>
                <p className="text-xs text-gray-400 mt-0.5">{b.days} days</p>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 text-gray-500 text-sm font-medium hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
});

// ── Delete confirm modal ───────────────────────────────────────────────────
interface DeleteConfirmModalProps {
  mutating: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteConfirmModal = memo(function DeleteConfirmModal({
  mutating,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center
      justify-center p-4"
    >
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center">
        <p className="text-3xl mb-3">🗑️</p>
        <h3 className="text-lg font-black text-gray-900 mb-2">
          Delete this ad?
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          This action cannot be undone. The ad and all its images will be
          permanently deleted.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold
              rounded-2xl text-sm hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={mutating}
            className="flex-1 py-3 bg-red-500 text-white font-bold
              rounded-2xl text-sm hover:bg-red-600 transition disabled:opacity-50"
          >
            {mutating ? "Deleting…" : "Yes, delete"}
          </button>
        </div>
      </div>
    </div>
  );
});
