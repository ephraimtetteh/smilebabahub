"use client";

// src/components/ads/AdModals.tsx
import { memo, useEffect, useState } from "react";
import { Zap, Star, TrendingUp, Trash2, X } from "lucide-react";
import { BoostTier } from "@/src/types/ad.types";
import { BOOST_TIERS } from "./ad.constants";
import { useViewCountry } from "@/src/hooks/useViewCountry";
import axiosInstance from "@/src/lib/api/axios";

type PricedTier = {
  id: BoostTier;
  label: string;
  desc: string;
  days: number;
  display: string;
};

// Lucide icon per tier
const TIER_ICON: Record<string, React.ReactNode> = {
  standard: <Zap size={20} className="text-amber-500" />,
  featured: <TrendingUp size={20} className="text-blue-500" />,
  premium: <Star size={20} className="text-purple-500 fill-purple-400" />,
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
  const { currency: userCurrency, paymentRegion } = useViewCountry();
  const [tiers, setTiers] = useState<PricedTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<BoostTier | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  // Redirect triggered by state change — avoids the immutability lint rule
  useEffect(() => {
    if (redirectUrl) {
      window.location.assign(redirectUrl);
    }
  }, [redirectUrl]);

  useEffect(() => {
    axiosInstance
      .get(`/payments/boost/pricing?currency=${userCurrency}`)
      .then((res) => {
        setTiers((res.data.tiers as PricedTier[]) ?? []);
      })
      .catch(() => {
        setTiers(
          BOOST_TIERS.map((b) => ({
            id: b.tier,
            label: b.label,
            desc: b.desc,
            days: b.days,
            display: "—",
          })),
        );
      })
      .finally(() => setLoading(false));
  }, [userCurrency]);

  const handlePay = async (tier: BoostTier) => {
    setPaying(tier);
    try {
      const endpoint = `/payments/boost/${paymentRegion}/initialize`;
      const res = await axiosInstance.post(endpoint, {
        adId,
        tier,
        returnUrl: window.location.pathname,
      });
      if (res.data.paymentLink) {
        setRedirectUrl(res.data.paymentLink);
      } else {
        onBoost(tier); // fallback
        setPaying(null);
      }
    } catch {
      onBoost(tier); // fallback
      setPaying(null);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center
      justify-center p-4"
    >
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-gray-900">Boost this ad</h3>
            <p className="text-sm text-gray-500">Reach more buyers instantly</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center
              justify-center hover:bg-gray-200 transition"
          >
            <X size={15} className="text-gray-500" />
          </button>
        </div>

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
          <div className="space-y-3 mb-4">
            {tiers.map((b) => (
              <button
                key={b.id}
                onClick={() => handlePay(b.id)}
                disabled={mutating || paying !== null}
                className="w-full flex items-start gap-3 p-4 bg-gray-50 border-2
                  border-gray-100 rounded-2xl hover:border-yellow-400 transition
                  text-left disabled:opacity-50 active:scale-[0.99]"
              >
                <span
                  className="flex-shrink-0 w-9 h-9 bg-white rounded-xl
                  flex items-center justify-center shadow-sm"
                >
                  {TIER_ICON[b.id]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-bold text-gray-900">{b.label}</p>
                    <p className="text-sm font-black text-yellow-600">
                      {paying === b.id ? (
                        <span
                          className="w-4 h-4 border-2 border-yellow-400
                          border-t-transparent rounded-full animate-spin inline-block"
                        />
                      ) : (
                        b.display
                      )}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">{b.desc}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {b.days} days · one-time
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 text-gray-500 text-sm font-medium
            hover:text-gray-700 transition"
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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center">
        <div
          className="w-14 h-14 bg-red-50 rounded-2xl flex items-center
          justify-center mx-auto mb-3"
        >
          <Trash2 size={26} className="text-red-500" />
        </div>
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
