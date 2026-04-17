"use client";

// src/app/vendor/dashboard/page.tsx

import React, { useEffect } from "react";
import { LayoutDashboard, Sparkles } from "lucide-react";

import { useAds } from "@/src/hooks/useAds";
import { useAppSelector } from "@/src/app/redux";
import ExpiryModal from "../(components)/ExpiryModal";
import FilterCards from "../(components)/FilterCards";
import PerformanceMetrics from "../(components)/PerformanceMetrics";
import VendorMessages from "../(components)/VendorMessages";
import ProtectedRoute from "@/src/components/ProtectRoute";




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
