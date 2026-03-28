"use client";

// src/app/vendor/dashboard/(components)/PerformanceMetrics.tsx
// Real charts from Redux myAds data — views trend + engagement breakdown.
// Fixes: nested LineChart, no hardcoded data, proper ResponsiveContainer usage.

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Activity,
  Eye,
  Phone,
  Heart,
  BarChart2,
} from "lucide-react";
import { useAppSelector } from "@/src/app/redux";
import { Ad } from "@/src/types/ad.types";

// ── Helpers ────────────────────────────────────────────────────────────────

/** Group ads by month and sum views + contactClicks */
function buildMonthlyTrend(ads: Ad[]) {
  const map: Record<
    string,
    { views: number; contacts: number; saves: number }
  > = {};

  ads.forEach((ad) => {
    const d = new Date(ad.createdAt);
    const key = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
    if (!map[key]) map[key] = { views: 0, contacts: 0, saves: 0 };
    map[key].views += ad.views ?? 0;
    map[key].contacts += ad.contactClicks ?? 0;
    map[key].saves += ad.saves ?? 0;
  });

  // Last 7 entries (months)
  return Object.entries(map)
    .slice(-7)
    .map(([name, v]) => ({ name, ...v }));
}

/** Build per-ad engagement data (top 7 by views) */
function buildEngagementData(ads: Ad[]) {
  return [...ads]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 7)
    .map((ad) => ({
      name: ad.title.length > 14 ? ad.title.slice(0, 14) + "…" : ad.title,
      views: ad.views ?? 0,
      contacts: ad.contactClicks ?? 0,
      saves: ad.saves ?? 0,
    }));
}

// ── Empty chart placeholder ────────────────────────────────────────────────
function EmptyChart({ message }: { message: string }) {
  return (
    <div className="w-full h-[280px] flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-2">
          <BarChart2 size={44} className="text-gray-200 mx-auto mb-2" />
        </p>
        <p className="text-sm text-gray-400">{message}</p>
      </div>
    </div>
  );
}

// ── Skeleton chart ─────────────────────────────────────────────────────────
function ChartSkeleton() {
  return (
    <div
      className="w-full h-[280px] bg-gray-50 rounded-xl animate-pulse
      flex items-end gap-2 px-4 pb-4"
    >
      {[40, 70, 55, 85, 60, 90, 75].map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-gray-200 rounded-t-lg"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

// ── Sales trend chart (line) ───────────────────────────────────────────────
function SalesTrendChart({
  data,
}: {
  data: ReturnType<typeof buildMonthlyTrend>;
}) {
  if (!data.length)
    return <EmptyChart message="No data yet — post ads to see trends" />;

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              fontSize: "12px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#ffc105"
            strokeWidth={2.5}
            dot={{ fill: "#ffc105", strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5 }}
            name="Views"
          />
          <Line
            type="monotone"
            dataKey="contacts"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={{ fill: "#6366f1", strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5 }}
            name="Contacts"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Performance / engagement chart (area) ─────────────────────────────────
function EngagementChart({
  data,
}: {
  data: ReturnType<typeof buildEngagementData>;
}) {
  if (!data.length)
    return <EmptyChart message="Post ads to see engagement metrics" />;

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffc105" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ffc105" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradContacts" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              fontSize: "12px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#ffc105"
            strokeWidth={2}
            fill="url(#gradViews)"
            name="Views"
          />
          <Area
            type="monotone"
            dataKey="contacts"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#gradContacts)"
            name="Contacts"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Summary mini-stats ─────────────────────────────────────────────────────
function MiniStat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 leading-none">{label}</p>
        <p className="text-sm font-bold text-gray-900 leading-tight">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function PerformanceMetrics() {
  const myAds = useAppSelector((s) => s.ads.myAds);
  const stats = useAppSelector((s) => s.ads.myAdsStats);
  const loading = useAppSelector((s) => s.ads.myAdsLoading);

  const trendData = useMemo(() => buildMonthlyTrend(myAds), [myAds]);
  const engagementData = useMemo(() => buildEngagementData(myAds), [myAds]);

  const totalViews = stats?.totalViews ?? 0;
  const totalContacts = myAds.reduce((s, a) => s + (a.contactClicks ?? 0), 0);
  const totalSaves = myAds.reduce((s, a) => s + (a.saves ?? 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
      {/* ── Sales Trend ── */}
      <div
        className="bg-white shadow shadow-neutral-300 p-5 sm:p-6
        flex flex-col w-full rounded-2xl"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between pb-4 mb-4
          border-b border-gray-100"
        >
          <h3 className="flex items-center gap-2 text-base sm:text-lg font-bold text-gray-900">
            <TrendingUp size={18} className="text-blue-500" />
            Sales Trend
          </h3>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">
              {totalViews.toLocaleString()}
            </p>
            <p className="text-xs text-green-500">total views</p>
          </div>
        </div>

        {/* Mini stats row */}
        <div className="flex gap-5 mb-4 flex-wrap">
          <MiniStat
            icon={<Eye size={13} className="text-yellow-600" />}
            label="Views"
            value={totalViews}
            color="bg-yellow-50"
          />
          <MiniStat
            icon={<Phone size={13} className="text-indigo-600" />}
            label="Contacts"
            value={totalContacts}
            color="bg-indigo-50"
          />
          <MiniStat
            icon={<Heart size={13} className="text-pink-600" />}
            label="Saves"
            value={totalSaves}
            color="bg-pink-50"
          />
        </div>

        {/* Chart */}
        {loading && !myAds.length ? (
          <ChartSkeleton />
        ) : (
          <SalesTrendChart data={trendData} />
        )}
      </div>

      {/* ── Performance Metrics ── */}
      <div
        className="bg-white shadow shadow-neutral-300 p-5 sm:p-6
        flex flex-col w-full rounded-2xl"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between pb-4 mb-4
          border-b border-gray-100"
        >
          <h3 className="flex items-center gap-2 text-base sm:text-lg font-bold text-gray-900">
            <Activity size={18} className="text-purple-500" />
            Ad Engagement
          </h3>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">{myAds.length}</p>
            <p className="text-xs text-purple-500">
              ad{myAds.length !== 1 ? "s" : ""} tracked
            </p>
          </div>
        </div>

        {/* Mini stats row */}
        <div className="flex gap-5 mb-4 flex-wrap">
          <MiniStat
            icon={<TrendingUp size={13} className="text-green-600" />}
            label="Active"
            value={stats?.activeCount ?? 0}
            color="bg-green-50"
          />
          <MiniStat
            icon={<Eye size={13} className="text-blue-600" />}
            label="Avg views/ad"
            value={myAds.length ? Math.round(totalViews / myAds.length) : 0}
            color="bg-blue-50"
          />
          <MiniStat
            icon={<Phone size={13} className="text-orange-600" />}
            label="Avg contacts/ad"
            value={
              myAds.length ? (totalContacts / myAds.length).toFixed(1) : "0"
            }
            color="bg-orange-50"
          />
        </div>

        {/* Chart */}
        {loading && !myAds.length ? (
          <ChartSkeleton />
        ) : (
          <EngagementChart data={engagementData} />
        )}
      </div>
    </div>
  );
}
