"use client";

// src/app/vendor/dashboard/page.tsx

import React, { useEffect } from "react";
import { LayoutDashboard, Sparkles } from "lucide-react";
import FilterCards        from "./(components)/FilterCards";
import PerformanceMetrics from "./(components)/PerformanceMetrics";
import VendorMessages     from "./(components)/VendorMessages";
import { useAds }         from "@/src/hooks/useAds";
import { useAppSelector } from "@/src/app/redux";
import ProtectedRoute from "@/src/components/ProtectRoute";

function DashboardInner() {
  const { loadMyAds } = useAds();
  const user          = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    loadMyAds({ limit: 100 } as any);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="px-3 sm:px-4 py-4 min-h-screen bg-gray-50">

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

        {user?.subscription?.plan && (
          <div className="hidden sm:flex items-center gap-1.5 bg-yellow-50
            border border-yellow-200 text-yellow-700 text-xs font-semibold
            px-3 py-1.5 rounded-full">
            <Sparkles size={12} />
            {user.subscription.plan} plan
          </div>
        )}
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