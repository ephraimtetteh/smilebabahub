"use client";

// src/app/ads/my/page.tsx
import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  LayoutList,
  TrendingUp,
  Pause,
  CheckCircle2,
  XCircle,
  Eye,
  Plus,
  Package,
  BarChart2,
} from "lucide-react";
import { useAds } from "@/src/hooks/useAds";
import AdManageCard from "../(components)/AdManageCard";
import ProtectedRoute from "@/src/components/ProtectRoute";


const STATUS_TABS = [
  { id: "all", label: "All", icon: <LayoutList size={13} /> },
  { id: "active", label: "Active", icon: <TrendingUp size={13} /> },
  { id: "paused", label: "Paused", icon: <Pause size={13} /> },
  { id: "sold", label: "Sold", icon: <CheckCircle2 size={13} /> },
  { id: "expired", label: "Expired", icon: <XCircle size={13} /> },
] as const;

type StatusId = (typeof STATUS_TABS)[number]["id"];

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value?: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 text-center">
      <div className="flex justify-center mb-1 text-gray-400">{icon}</div>
      <p className="text-xl font-black text-gray-900">
        {value?.toLocaleString() ?? 0}
      </p>
      <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

function MyAdsPage() {
  const searchParams = useSearchParams();
  const {
    myAds,
    myAdsLoading,
    myAdsError,
    myAdsStats,
    myAdsStatus,
    loadMyAds,
    changeMyAdsStatus,
    submitBoostAd,
    submitMarkSold,
    submitTogglePause,
    submitDeleteAd,
    mutating,
  } = useAds();

  // Honour ?status=expired (or ?filter=expired) from URL — e.g. from ExpiryModal
  useEffect(() => {
    const urlStatus = searchParams.get("status") || searchParams.get("filter");
    const valid = ["all", "active", "paused", "sold", "expired"];
    if (urlStatus && valid.includes(urlStatus) && urlStatus !== myAdsStatus) {
      changeMyAdsStatus(urlStatus as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadMyAds({ status: myAdsStatus });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myAdsStatus]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">My ads</h1>
            <p className="text-xs text-gray-400">Manage all your listings</p>
          </div>
          <Link
            href="/sell"
            className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400 text-black
              font-bold rounded-xl text-xs hover:bg-yellow-300 transition active:scale-95"
          >
            <Plus size={13} /> Post new ad
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats strip */}
        {myAdsStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatCard
              icon={<TrendingUp size={16} />}
              label="Active listings"
              value={myAdsStats.activeCount}
            />
            <StatCard
              icon={<CheckCircle2 size={16} />}
              label="Sold"
              value={myAdsStats.soldCount}
            />
            <StatCard
              icon={<Pause size={16} />}
              label="Paused"
              value={myAdsStats.pausedCount}
            />
            <StatCard
              icon={<Eye size={16} />}
              label="Total views"
              value={myAdsStats.totalViews}
            />
          </div>
        )}

        {/* Status tabs */}
        <div
          className="flex gap-1.5 bg-white border border-gray-100 shadow-sm
          rounded-2xl p-1 mb-5 overflow-x-auto scrollbar-none"
        >
          {STATUS_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => changeMyAdsStatus(t.id as any)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl
                text-xs font-semibold transition
                ${
                  myAdsStatus === t.id
                    ? "bg-yellow-400 text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {myAdsError && !myAdsLoading && (
          <div
            className="bg-red-50 border border-red-200 rounded-2xl p-4
            text-red-600 text-sm text-center mb-4"
          >
            {myAdsError}
          </div>
        )}

        {/* Loading */}
        {myAdsLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100
                p-4 animate-pulse flex gap-4"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-5 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!myAdsLoading && myAds.length === 0 && (
          <div
            className="bg-white rounded-2xl border border-gray-100 shadow-sm
            p-10 sm:p-16 text-center"
          >
            <Package size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-700 font-semibold text-sm mb-1">
              No {myAdsStatus === "all" ? "" : myAdsStatus} ads yet
            </p>
            <p className="text-xs text-gray-400 mb-6">
              {myAdsStatus === "all"
                ? "You haven't posted any ads. Create your first listing now."
                : `You have no ${myAdsStatus} ads at the moment.`}
            </p>
            {myAdsStatus === "all" && (
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 px-5 py-2.5
                  bg-yellow-400 text-black font-bold rounded-xl text-sm
                  hover:bg-yellow-300 transition"
              >
                <Plus size={14} /> Post your first ad
              </Link>
            )}
          </div>
        )}

        {/* Ad list */}
        {!myAdsLoading && myAds.length > 0 && (
          <div className="space-y-3">
            {myAds.map((ad) => (
              <AdManageCard
                key={ad._id}
                ad={ad}
                mutating={mutating}
                onBoost={(tier) => submitBoostAd(ad._id, tier)}
                onPause={() => submitTogglePause(ad._id)}
                onSold={() => submitMarkSold(ad._id)}
                onDelete={() => submitDeleteAd(ad._id)}
              />
            ))}
          </div>
        )}

        {/* Post CTA */}
        {!myAdsLoading && (
          <div
            className="mt-8 bg-gradient-to-r from-yellow-50 to-amber-50
            border border-yellow-200 rounded-2xl p-5 text-center"
          >
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Ready to sell more?
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Post a new listing and reach thousands of buyers.
            </p>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-yellow-400
                text-black font-bold rounded-xl text-sm hover:bg-yellow-300 transition"
            >
              <Plus size={14} /> Post a new ad
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyAdsPageWrapper() {
  return (
    <ProtectedRoute requiredRole="vendor">
      <MyAdsPage />
    </ProtectedRoute>
  );
}
