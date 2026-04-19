"use client";

// src/app/vendor/dashboard/page.tsx

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Plus,
  Zap,
  ChevronDown,
  ChevronUp,
  Package,
  Eye,
  X,
} from "lucide-react";

import { useAds } from "@/src/hooks/useAds";
import { useAppSelector } from "@/src/app/redux";
import ExpiryModal from "../(components)/ExpiryModal";
import FilterCards from "../(components)/FilterCards";
import PerformanceMetrics from "../(components)/PerformanceMetrics";
import VendorMessages from "../(components)/VendorMessages";
import ProtectedRoute from "@/src/components/ProtectRoute";


// ── CTA bar — Post ad + Boost ad ───────────────────────────────────────────
function CTABar() {
  const router = useRouter();
  const { myAds } = useAds();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const nonBoosted = myAds.filter((a) => !a.boost?.isBoosted && a.isActive);
  const boosted = myAds.filter((a) => a.boost?.isBoosted);

  // Close panel on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative mb-5" ref={panelRef}>
      {/* ── Primary CTA row ── */}
      <div className="flex gap-2.5">
        {/* Post new ad */}
        <Link
          href="/sell"
          className="flex-1 flex items-center justify-center gap-2
            bg-gray-900 text-white font-black text-sm py-3.5 rounded-2xl
            hover:bg-gray-800 active:scale-[0.99] transition-all shadow-sm"
        >
          <Plus size={16} />
          Post new ad
        </Link>

        {/* Boost an ad */}
        <button
          onClick={() => setOpen((v) => !v)}
          className={`flex-1 flex items-center justify-center gap-2
            font-black text-sm py-3.5 rounded-2xl
            active:scale-[0.99] transition-all shadow-sm
            ${
              open
                ? "bg-yellow-400 text-black"
                : "bg-yellow-400 text-black hover:bg-yellow-300"
            }`}
        >
          <Zap size={16} />
          Boost an ad
          {nonBoosted.length > 0 && (
            <span
              className="bg-black/15 text-black text-[10px] font-black
              px-1.5 py-0.5 rounded-full leading-none"
            >
              {nonBoosted.length}
            </span>
          )}
          {open ? (
            <ChevronUp size={14} className="ml-auto" />
          ) : (
            <ChevronDown size={14} className="ml-auto" />
          )}
        </button>
      </div>

      {/* ── Boost panel dropdown ── */}
      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-2 z-30
          bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3
            border-b border-gray-100"
          >
            <div>
              <p className="text-sm font-black text-gray-900">
                Choose an ad to boost
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Boosted ads appear at the top of search results
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 bg-gray-100 rounded-full flex items-center
                justify-center hover:bg-gray-200 transition flex-shrink-0"
            >
              <X size={13} />
            </button>
          </div>

          {/* No ads state */}
          {myAds.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8 text-center px-4">
              <Package size={28} className="text-gray-200" />
              <p className="text-sm font-semibold text-gray-500">
                No listings yet
              </p>
              <p className="text-xs text-gray-400">
                Post your first ad to unlock boosting
              </p>
              <Link
                href="/sell"
                onClick={() => setOpen(false)}
                className="mt-1 px-4 py-2 bg-yellow-400 text-black text-xs
                  font-black rounded-xl hover:bg-yellow-300 transition"
              >
                Post an ad →
              </Link>
            </div>
          )}

          {/* Non-boosted ads */}
          {nonBoosted.length > 0 && (
            <div className="max-h-64 overflow-y-auto">
              {nonBoosted.map((ad) => (
                <button
                  key={ad._id}
                  onClick={() => {
                    router.push(`/ads/${ad._id}?boost=1`);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3
                    hover:bg-yellow-50 transition-colors text-left group
                    border-b border-gray-50 last:border-0"
                >
                  {/* Thumbnail */}
                  <div
                    className="w-11 h-11 rounded-xl overflow-hidden
                    bg-gray-100 flex-shrink-0"
                  >
                    {ad.images?.[0]?.url ? (
                      <Image
                        src={ad.images[0].url}
                        alt={ad.title}
                        width={44}
                        height={44}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center
                        justify-center"
                      >
                        <Package size={14} className="text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {ad.title}
                    </p>
                    <p
                      className="text-[10px] text-gray-400 flex items-center
                      gap-1 mt-0.5"
                    >
                      <Eye size={9} />
                      {ad.views ?? 0} views
                      {ad.price?.amount
                        ? ` · ${ad.price.currency === "NGN" ? "₦" : "₵"}${Number(ad.price.amount).toLocaleString()}`
                        : ""}
                    </p>
                  </div>

                  {/* Boost CTA */}
                  <span
                    className="flex items-center gap-1 px-2.5 py-1.5
                    bg-yellow-400 text-black text-[10px] font-black
                    rounded-xl group-hover:bg-yellow-300 transition
                    flex-shrink-0"
                  >
                    <Zap size={10} /> Boost
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Already boosted section */}
          {boosted.length > 0 && (
            <div className="border-t border-gray-100">
              <p
                className="text-[10px] font-bold text-gray-400 uppercase
                tracking-wider px-4 py-2"
              >
                ⚡ Already boosted
              </p>
              {boosted.map((ad) => (
                <div
                  key={ad._id}
                  className="flex items-center gap-3 px-4 py-2.5
                    border-b border-gray-50 last:border-0"
                >
                  <div
                    className="w-9 h-9 rounded-lg overflow-hidden
                    bg-gray-100 flex-shrink-0"
                  >
                    {ad.images?.[0]?.url ? (
                      <Image
                        src={ad.images[0].url}
                        alt={ad.title}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center
                        justify-center"
                      >
                        <Package size={12} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">
                      {ad.title}
                    </p>
                  </div>
                  <span
                    className="flex items-center gap-1 px-2 py-1
                    bg-yellow-100 text-yellow-700 text-[10px] font-bold
                    rounded-full flex-shrink-0"
                  >
                    <Zap size={9} /> Active
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {myAds.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <Link
                href="/ads/my"
                onClick={() => setOpen(false)}
                className="text-xs text-gray-500 hover:text-gray-700
                  font-semibold transition"
              >
                Manage all {myAds.length} listing{myAds.length !== 1 ? "s" : ""}{" "}
                →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DashboardInner() {
  const { loadMyAds } = useAds();
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    loadMyAds({ limit: 100 } as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="px-3 sm:px-4 py-4 min-h-screen bg-gray-50">
      {/* Expiry alert — shows once per session when vendor has expired/expiring ads */}
      <ExpiryModal />

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard size={20} className="text-[#ffc105]" />
            Dashboard
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Welcome back,{" "}
            <span className="font-semibold text-gray-600">
              {user?.username ?? "Vendor"}
            </span>{" "}
            · {user?.country ?? ""}
          </p>
        </div>

        {user?.subscription?.plan &&
          (() => {
            const expiry = user.subscription.expiresAt
              ? new Date(user.subscription.expiresAt)
              : null;
            const daysLeft = expiry
              ? Math.max(
                  0,
                  Math.ceil((expiry.getTime() - Date.now()) / 86400000),
                )
              : null;
            const isExpiring =
              daysLeft !== null && daysLeft <= 7 && daysLeft > 0;
            const isExpired = expiry ? expiry < new Date() : false;

            return (
              <div
                className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold
              px-3 py-1.5 rounded-full border
              ${
                isExpired
                  ? "bg-red-50 border-red-200 text-red-600"
                  : isExpiring
                    ? "bg-orange-50 border-orange-200 text-orange-600"
                    : "bg-yellow-50 border-yellow-200 text-yellow-700"
              }`}
              >
                <Sparkles size={12} />
                {user.subscription.plan}
                {daysLeft !== null && !isExpired && (
                  <span className="opacity-70">· {daysLeft}d left</span>
                )}
                {isExpired && <span>· Expired</span>}
              </div>
            );
          })()}
      </div>

      {/* ── Action CTAs ── */}
      <CTABar />

      {/* ── Stat cards ── */}
      <FilterCards />

      {/* ── Two-column layout: charts + messages ── */}
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
        <PerformanceMetrics />
        <VendorMessages />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRole="vendor">
      <DashboardInner />
    </ProtectedRoute>
  );
}
