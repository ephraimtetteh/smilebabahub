"use client";

// src/app/vendor/dashboard/(components)/FilterCards.tsx
// Shows real stats from Redux: active ads, sold ads, total views, contact clicks.
// Replaces hardcoded $00.00 with actual data from myAdsStats.

import React from "react";
import {
  Activity,
  CircleDollarSign,
  BadgeCheck,
  ShoppingBasket,
  Eye,
  Phone,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useAppSelector } from "@/src/app/redux";

// ── Types ──────────────────────────────────────────────────────────────────
type CardVariant = "total_sales" | "daily_sales" | "total_earnings" | "pending";

interface FilterCardProps {
  title: string;
  value: string;
  sub?: string;
  change?: number; // positive = up, negative = down, undefined = neutral
  icon: React.ReactNode;
  variant: CardVariant;
  loading?: boolean;
}

const VARIANT_STYLES: Record<CardVariant, string> = {
  total_sales: "bg-green-100 text-green-700",
  daily_sales: "bg-blue-100 text-blue-700",
  total_earnings: "bg-yellow-100 text-yellow-700",
  pending: "bg-red-100 text-red-700",
};

// ── Single card ────────────────────────────────────────────────────────────
function FilterCard({
  title,
  value,
  sub,
  change,
  icon,
  variant,
  loading,
}: FilterCardProps) {
  const iconBg = VARIANT_STYLES[variant];
  const isUp = change !== undefined && change >= 0;

  return (
    <div
      className="flex items-center justify-between bg-white shadow
      shadow-neutral-300 rounded-2xl p-5 sm:p-6 w-full"
    >
      {loading ? (
        <div className="flex flex-col gap-2 flex-1 animate-pulse">
          <div className="h-3.5 bg-gray-100 rounded w-24" />
          <div className="h-6 bg-gray-100 rounded w-16" />
          <div className="h-3 bg-gray-100 rounded w-12" />
        </div>
      ) : (
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-gray-500 pb-1 text-[13px] font-medium">{title}</p>
          <p className="text-gray-900 pb-1 text-lg sm:text-xl font-bold truncate">
            {value}
          </p>
          {sub && <p className="text-gray-400 text-[11px]">{sub}</p>}
          {change !== undefined && (
            <div
              className={`flex items-center gap-1 text-[12px] font-medium
              ${isUp ? "text-green-500" : "text-red-500"}`}
            >
              {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(change).toFixed(1)}%
            </div>
          )}
        </div>
      )}

      <div className={`${iconBg} p-3 sm:p-4 rounded-2xl ml-4 flex-shrink-0`}>
        {icon}
      </div>
    </div>
  );
}

// ── Grid of cards ──────────────────────────────────────────────────────────
export default function FilterCards() {
  const user = useAppSelector((s) => s.auth.user);
  const stats = useAppSelector((s) => s.ads.myAdsStats);
  const myAds = useAppSelector((s) => s.ads.myAds);
  const loading = useAppSelector((s) => s.ads.myAdsLoading);

  const currency = user?.currency ?? "GHS";
  const sym = currency === "NGN" ? "₦" : "₵";

  // Derive earnings from sold ads
  const totalEarnings = myAds
    .filter((a) => a.isSold)
    .reduce((sum, a) => sum + (a.price?.amount ?? 0), 0);

  // Derive contact engagements (pending interactions)
  const totalContacts = myAds.reduce(
    (sum, a) => sum + (a.contactClicks ?? 0),
    0,
  );

  // Active ads = "total sales" proxy (listings generating interest)
  const activeCount = stats?.activeCount ?? 0;
  const soldCount = stats?.soldCount ?? 0;
  const totalViews = stats?.totalViews ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-8">
      <FilterCard
        variant="total_sales"
        title="Active Listings"
        value={String(activeCount)}
        sub={`${totalViews.toLocaleString()} total views`}
        icon={<Activity size={22} />}
        loading={loading && !stats}
      />

      <FilterCard
        variant="daily_sales"
        title="Total Views"
        value={totalViews.toLocaleString()}
        sub={`${totalContacts} contact taps`}
        icon={<Eye size={22} />}
        loading={loading && !stats}
      />

      <FilterCard
        variant="total_earnings"
        title="Revenue (Sold Ads)"
        value={
          totalEarnings > 0
            ? `${sym}${totalEarnings.toLocaleString()}`
            : `${sym}0`
        }
        sub={
          soldCount > 0
            ? `From ${soldCount} sold ad${soldCount !== 1 ? "s" : ""}`
            : "No sold ads yet"
        }
        icon={<CircleDollarSign size={22} />}
        loading={loading && !stats}
      />

      <FilterCard
        variant="pending"
        title="Contact Requests"
        value={String(totalContacts)}
        sub={`Across ${activeCount} active listing${activeCount !== 1 ? "s" : ""}`}
        icon={<Phone size={22} />}
        loading={loading && !stats}
      />
    </div>
  );
}
