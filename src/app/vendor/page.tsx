"use client";

// src/app/vendor/dashboard/page.tsx

import React, { useEffect } from "react";
import { LayoutDashboard } from "lucide-react";
import FilterCards from "./(components)/FilterCards";
import PerformanceMetrics from "./(components)/PerformanceMetrics";
import { useAds } from "@/src/hooks/useAds";
import { useAppSelector } from "@/src/app/redux";
import ProtectedRoute from "@/src/components/ProtectRoute";

function DashboardInner() {
  const { loadMyAds } = useAds();
  const user = useAppSelector((s) => s.auth.user);

  // Load vendor's full ad list on mount so charts and stats have data
  useEffect(() => {
    loadMyAds({ limit: 100 } as any); // fetch up to 100 for chart accuracy
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

        {/* Plan badge */}
        {user?.subscription?.plan && (
          <div
            className="hidden sm:flex items-center gap-1.5 bg-yellow-50
            border border-yellow-200 text-yellow-700 text-xs font-semibold
            px-3 py-1.5 rounded-full"
          >
            <span>⭐</span>
            {user.subscription.plan} plan
          </div>
        )}
      </div>

      {/* ── Stat cards ── */}
      <FilterCards />

      {/* ── Charts ── */}
      <PerformanceMetrics />
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
