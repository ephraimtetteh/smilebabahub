"use client";
// src/components/PostSubscriptionModal.tsx
// Shown after a successful subscription payment.
// Options: post a new ad, boost an existing ad, or browse their listings.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  X,
  Plus,
  Zap,
  LayoutDashboard,
  ShoppingBag,
  TrendingUp,
  Package,
  ChevronRight,
  Loader2,
} from "lucide-react";
import axiosInstance from "@/src/lib/api/axios";
import SafeImage from "@/src/components/SafeImage";
import { useViewCountry } from "@/src/hooks/useViewCountry";

interface Ad {
  _id: string;
  title: string;
  images?: { url: string }[];
  views: number;
  price?: { amount: number; currency: string };
  category?: { main: string };
  boost?: { isBoosted: boolean };
}

interface PostSubscriptionModalProps {
  onClose: () => void;
}

export default function PostSubscriptionModal({
  onClose,
}: PostSubscriptionModalProps) {
  const router = useRouter();
  const { sym } = useViewCountry();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"actions" | "boost">("actions");

  useEffect(() => {
    axiosInstance
      .get("/ads/my?limit=10")
      .then((res) => setAds(res.data.ads ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const nonBoosted = ads.filter((a) => !a.boost?.isBoosted);
  const hasBoosted = ads.some((a) => a.boost?.isBoosted);

  const handleBoostAd = (id: string) => {
    router.push(`/ads/${id}?boost=1`);
    onClose();
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center
      justify-center p-3 sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-md max-h-[88vh]
        overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 pt-5 pb-4
          border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-3xl"
        >
          <div>
            <h2 className="text-base font-black text-gray-900">
              🎉 Subscription active!
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              What do you want to do first?
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center
              justify-center hover:bg-gray-200 transition flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 mx-5 mt-4 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setTab("actions")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition
              ${tab === "actions" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
          >
            Quick actions
          </button>
          <button
            onClick={() => setTab("boost")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition
              ${tab === "boost" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
          >
            Boost an ad{" "}
            {nonBoosted.length > 0 && (
              <span
                className="ml-1 bg-yellow-400 text-black text-[9px] font-black
                px-1.5 py-0.5 rounded-full"
              >
                {nonBoosted.length}
              </span>
            )}
          </button>
        </div>

        <div className="p-5">
          {/* ── Quick actions tab ── */}
          {tab === "actions" && (
            <div className="space-y-2.5">
              {/* Post new ad */}
              <Link
                href="/sell"
                onClick={onClose}
                className="flex items-center gap-4 bg-gray-900 text-white
                  p-4 rounded-2xl hover:bg-gray-800 active:scale-[0.99]
                  transition-all group"
              >
                <div
                  className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center
                  justify-center flex-shrink-0"
                >
                  <Plus size={20} className="text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm">Post a new ad</p>
                  <p className="text-xs text-white/60 mt-0.5">
                    List a product, food, property, or service
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className="text-white/40 group-hover:text-white/80 transition"
                />
              </Link>

              {/* Go to dashboard */}
              <Link
                href="/vendor/dashboard"
                onClick={onClose}
                className="flex items-center gap-4 bg-white border border-gray-200
                  p-4 rounded-2xl hover:bg-gray-50 active:scale-[0.99]
                  transition-all group"
              >
                <div
                  className="w-10 h-10 bg-purple-100 rounded-xl flex items-center
                  justify-center flex-shrink-0"
                >
                  <LayoutDashboard size={18} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-gray-900">
                    Go to dashboard
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    View analytics, manage ads and orders
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className="text-gray-300 group-hover:text-gray-600 transition"
                />
              </Link>

              {/* Manage ads */}
              <Link
                href="/ads/my"
                onClick={onClose}
                className="flex items-center gap-4 bg-white border border-gray-200
                  p-4 rounded-2xl hover:bg-gray-50 active:scale-[0.99]
                  transition-all group"
              >
                <div
                  className="w-10 h-10 bg-blue-100 rounded-xl flex items-center
                  justify-center flex-shrink-0"
                >
                  <ShoppingBag size={18} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-gray-900">My ads</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {ads.length > 0
                      ? `You have ${ads.length} listing${ads.length !== 1 ? "s" : ""} — renew or edit them`
                      : "View and manage all your listings"}
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className="text-gray-300 group-hover:text-gray-600 transition"
                />
              </Link>

              {/* Performance */}
              <Link
                href="/vendor/dashboard"
                onClick={onClose}
                className="flex items-center gap-4 bg-white border border-gray-200
                  p-4 rounded-2xl hover:bg-gray-50 active:scale-[0.99]
                  transition-all group"
              >
                <div
                  className="w-10 h-10 bg-green-100 rounded-xl flex items-center
                  justify-center flex-shrink-0"
                >
                  <TrendingUp size={18} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-gray-900">
                    Check performance
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Views, contact clicks, and earnings
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className="text-gray-300 group-hover:text-gray-600 transition"
                />
              </Link>
            </div>
          )}

          {/* ── Boost tab ── */}
          {tab === "boost" && (
            <div>
              {loading ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <Loader2 size={24} className="animate-spin text-gray-300" />
                  <p className="text-xs text-gray-400">Loading your ads…</p>
                </div>
              ) : ads.length === 0 ? (
                <div className="text-center py-8">
                  <Package size={32} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    No ads yet
                  </p>
                  <p className="text-xs text-gray-400 mb-4 max-w-xs mx-auto">
                    Post your first listing, then come back to boost it.
                  </p>
                  <Link
                    href="/sell"
                    onClick={onClose}
                    className="inline-block px-5 py-2.5 bg-yellow-400 text-black
                      text-xs font-black rounded-xl hover:bg-yellow-300 transition"
                  >
                    Post an ad →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {hasBoosted && (
                    <p className="text-[11px] text-gray-400 mb-3">
                      ⚡ Already boosted ads are marked. Boost others to
                      maximise reach.
                    </p>
                  )}
                  {ads.map((ad) => (
                    <div
                      key={ad._id}
                      className="flex items-center gap-3 bg-white border border-gray-100
                        rounded-2xl p-3 hover:border-yellow-300 transition-all"
                    >
                      {/* Thumbnail */}
                      <div
                        className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100
                        flex-shrink-0"
                      >
                        {ad.images?.[0]?.url ? (
                          <SafeImage
                            src={ad.images[0].url}
                            alt={ad.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={16} className="text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {ad.title}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {ad.views ?? 0} views
                          {ad.price?.amount
                            ? ` · ${sym}${ad.price.amount.toLocaleString()}`
                            : ""}
                        </p>
                      </div>

                      {/* Action */}
                      {ad.boost?.isBoosted ? (
                        <span
                          className="flex items-center gap-1 px-2.5 py-1
                          bg-yellow-100 text-yellow-700 text-[10px] font-bold
                          rounded-full flex-shrink-0"
                        >
                          <Zap size={10} /> Boosted
                        </span>
                      ) : (
                        <button
                          onClick={() => handleBoostAd(ad._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5
                            bg-gray-900 text-yellow-400 text-[11px] font-black
                            rounded-xl hover:bg-gray-700 active:scale-95
                            transition-all flex-shrink-0"
                        >
                          <Zap size={11} /> Boost
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
