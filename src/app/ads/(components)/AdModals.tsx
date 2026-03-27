"use client";

// src/components/ads/AdModals.tsx
import { memo, useEffect, useState } from "react";
import { BoostTier } from "@/src/types/ad.types";
import axiosInstance from "@/src/lib/api/axios";
import { useAppSelector } from "../../redux";
import { BOOST_TIERS } from "./ad.constants";

// ── Boost tier with real price from backend ────────────────────────────────
type PricedTier = {
  id: BoostTier;
  label: string;
  desc: string;
  days: number;
  display: string;
  icon: string;
};

// ── Boost modal ────────────────────────────────────────────────────────────
interface BoostModalProps {
  adId: string;
  mutating: boolean;
  onBoost: (tier: BoostTier) => void;
  onClose: () => void;
}

export const BoostModal = memo(function BoostModal({
  adId,
  mutating,
  onBoost,
  onClose,
}: BoostModalProps) {
  const userCurrency = useAppSelector((s) => s.auth.user?.currency ?? "GHS");
  const [tiers, setTiers] = useState<PricedTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<BoostTier | null>(null);

  // Fetch real prices from backend
  useEffect(() => {
    axiosInstance
      .get(`/payments/boost/pricing?currency=${userCurrency}`)
      .then((res) => {
        // Merge backend prices with frontend icons
        const iconMap: Record<string, string> = {
          standard: "🔶",
          featured: "🔵",
          premium: "⭐",
        };
        setTiers(
          (res.data.tiers as PricedTier[]).map((t) => ({
            ...t,
            icon: iconMap[t.id] ?? "🚀",
          })),
        );
      })
      .catch(() => {
        // Fallback to static config if pricing endpoint fails
        setTiers(
          BOOST_TIERS.map((b) => ({
            id: b.tier,
            label: b.label,
            desc: b.desc,
            days: b.days,
            display: "—",
            icon: b.icon,
          })),
        );
      })
      .finally(() => setLoading(false));
  }, [userCurrency]);

  const handleBoostPay = async (tier: BoostTier) => {
    setPaying(tier);
    try {
      // Determine country endpoint
      const endpoint =
        userCurrency === "NGN"
          ? `/payments/boost/ng/initialize`
          : `/payments/boost/gh/initialize`;

      const res = await axiosInstance.post(endpoint, {
        adId,
        tier,
        returnUrl: window.location.pathname,
      });

      // Redirect to Flutterwave payment page
      if (res.data.paymentLink) {
        window.location.href = res.data.paymentLink;
      }
    } catch (err: any) {
      // Fallback: let parent handle (free boost for now)
      onBoost(tier);
    } finally {
      setPaying(null);
    }
  };

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

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3 mb-5">
            {tiers.map((b) => (
              <button
                key={b.id}
                onClick={() => handleBoostPay(b.id)}
                disabled={mutating || paying !== null}
                className="w-full flex items-start gap-3 p-4 bg-gray-50 border-2
                  border-gray-100 rounded-2xl hover:border-yellow-400 transition
                  text-left disabled:opacity-50 active:scale-[0.99]"
              >
                <span className="text-2xl flex-shrink-0">{b.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900">{b.label}</p>
                    <p className="text-sm font-black text-yellow-600">
                      {paying === b.id ? (
                        <span className="flex items-center gap-1">
                          <span
                            className="w-3 h-3 border-2 border-yellow-400
                              border-t-transparent rounded-full animate-spin inline-block"
                          />
                        </span>
                      ) : (
                        b.display
                      )}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">{b.desc}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {b.days} days · one-time payment
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

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
