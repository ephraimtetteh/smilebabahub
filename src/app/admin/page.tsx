"use client";
// src/app/admin/page.tsx — Admin Analytics Dashboard
// Polls /admin/analytics/live every 30s + /admin/analytics/hourly for chart.
// No external chart library needed — pure SVG sparklines.

import { useEffect, useRef, useState, useCallback } from "react";
import { useAdmin } from "@/src/hooks/useAdmin";
import { useViewCountry } from "@/src/hooks/useViewCountry";
import axiosInstance from "@/src/lib/api/axios";
import {
  Users,
  CreditCard,
  ShoppingBag,
  Megaphone,
  TrendingUp,
  Loader2,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Activity,
  Wifi,
  Eye,
  Clock,
  RefreshCw,
  ArrowUpRight,
  Zap,
  BarChart2,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(1)}k`
      : String(n);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GH", { dateStyle: "medium" });

const timeAgo = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
};

// ── SVG Sparkline ──────────────────────────────────────────────────────────
function Sparkline({
  data,
  color = "#ffc105",
  height = 40,
  width = 120,
}: {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}) {
  if (!data.length) return <div style={{ width, height }} />;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <defs>
        <linearGradient
          id={`sg-${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${pts} ${width},${height}`}
        fill={`url(#sg-${color.replace("#", "")})`}
      />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last point dot */}
      {data.length > 1 &&
        (() => {
          const last = data[data.length - 1];
          const x = width;
          const y = height - ((last - min) / range) * (height - 4) - 2;
          return <circle cx={x} cy={y} r="3" fill={color} />;
        })()}
    </svg>
  );
}

// ── Hourly bar chart (last 24 h) ───────────────────────────────────────────
function HourlyChart({ data }: { data: { _id: string; count: number }[] }) {
  if (!data.length)
    return (
      <div className="flex items-center justify-center h-24 text-xs text-gray-300">
        No data yet
      </div>
    );

  const max = Math.max(...data.map((d) => d.count), 1);
  const now = new Date();

  // Fill all 24 hours, even empty ones
  const hours: { hour: string; count: number }[] = [];
  for (let i = 23; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(d.getHours() - i, 0, 0, 0);
    const key = d.toISOString().slice(0, 13) + ":00:00";
    const found = data.find((r) => r._id.startsWith(key.slice(0, 13)));
    hours.push({ hour: d.getHours() + ":00", count: found?.count ?? 0 });
  }

  return (
    <div className="flex items-end gap-0.5 h-16 w-full">
      {hours.map((h, i) => {
        const pct = Math.max((h.count / max) * 100, h.count > 0 ? 8 : 2);
        const isNow = i === 23;
        return (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-0.5 group"
            title={`${h.hour}: ${h.count} views`}
          >
            <div
              className={`w-full rounded-sm transition-all duration-500
                ${isNow ? "bg-[#ffc105]" : "bg-[#ffc105]/30 group-hover:bg-[#ffc105]/60"}`}
              style={{ height: `${pct}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  sub,
  trend,
  sparkData,
  highlight = false,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  sub?: string;
  trend?: number;
  sparkData?: number[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 flex flex-col gap-3
      ${
        highlight
          ? "bg-gradient-to-br from-[#ffc105] to-[#f59e0b] border-[#ffc105]"
          : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
          ${highlight ? "bg-black/10 text-black" : "bg-[#ffc105]/10 text-[#ffc105]"}`}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5
            ${
              highlight
                ? "bg-black/10 text-black"
                : trend >= 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-500"
            }`}
          >
            <ArrowUpRight
              size={9}
              style={{ rotate: trend < 0 ? "90deg" : "0deg" }}
            />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p
          className={`text-xs font-medium mb-0.5
          ${highlight ? "text-black/60" : "text-gray-400"}`}
        >
          {label}
        </p>
        <p
          className={`text-2xl font-black leading-none
          ${highlight ? "text-black" : "text-gray-900"}`}
        >
          {value}
        </p>
        {sub && (
          <p
            className={`text-xs mt-1
          ${highlight ? "text-black/50" : "text-gray-400"}`}
          >
            {sub}
          </p>
        )}
      </div>
      {sparkData && (
        <Sparkline
          data={sparkData}
          color={highlight ? "#000" : "#ffc105"}
          height={32}
        />
      )}
    </div>
  );
}

// ── Live pulse dot ─────────────────────────────────────────────────────────
function LiveDot() {
  return (
    <span className="relative inline-flex w-2 h-2 flex-shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
    </span>
  );
}

function DeviceIcon({ device }: { device: string }) {
  if (device === "mobile")
    return <Smartphone size={11} className="text-blue-400" />;
  if (device === "tablet")
    return <Tablet size={11} className="text-purple-400" />;
  return <Monitor size={11} className="text-gray-400" />;
}

const FLAGS: Record<string, string> = { Ghana: "🇬🇭", Nigeria: "🇳🇬" };

// ── Mini progress bar ──────────────────────────────────────────────────────
function Bar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-[#ffc105] rounded-full transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────────────────
function SectionHead({
  icon,
  title,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  badge?: string;
}) {
  return (
    <div className="px-5 py-3.5 border-b border-gray-50 flex items-center gap-2">
      <span className="text-[#ffc105]">{icon}</span>
      <h3 className="font-bold text-sm text-gray-900">{title}</h3>
      {badge && (
        <span className="ml-auto text-[10px] text-gray-400">{badge}</span>
      )}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function AdminOverviewPage() {
  const {
    data: overviewData,
    loading: overviewLoading,
    fetch: fetchOverview,
  } = useAdmin<any>("overview");
  const { currency } = useViewCountry();

  const [live, setLive] = useState<any>(null);
  const [hourly, setHourly] = useState<any[]>([]);
  const [liveLoading, setLiveLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [pulse, setPulse] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLive = useCallback(async () => {
    try {
      const [liveRes, hourlyRes] = await Promise.all([
        axiosInstance.get("/admin/analytics/live"),
        axiosInstance.get("/admin/analytics/hourly"),
      ]);
      setLive(liveRes.data);
      setHourly(hourlyRes.data.hourly ?? []);
      setLastUpdate(new Date());
      // Flash the pulse indicator
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    } catch {
      /* non-critical */
    } finally {
      setLiveLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
    fetchLive();
    timerRef.current = setInterval(fetchLive, 30_000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = overviewData?.stats;
  const recentUsers = overviewData?.recentUsers ?? [];
  const recentPurchases = overviewData?.recentPurchases ?? [];

  const revenue = stats
    ? currency === "NGN"
      ? `₦${fmt(stats.revenueNGN)}`
      : `₵${fmt(stats.revenueGHS)}`
    : "—";

  const maxCountry = Math.max(
    ...(live?.breakdown?.byCountry ?? []).map((c: any) => c.count),
    1,
  );

  // Extract hourly counts as sparkline data
  const hourlyCounts = hourly.map((h: any) => h.count ?? 0);

  return (
    <div className="space-y-6 pb-10">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            Analytics
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Live platform activity · auto-refreshes every 30s
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`transition-all duration-300
            ${pulse ? "scale-125 opacity-100" : "scale-100 opacity-60"}`}
          >
            <LiveDot />
          </span>
          <span className="text-xs text-gray-400">
            {lastUpdate ? timeAgo(lastUpdate.toISOString()) : "…"}
          </span>
          <button
            onClick={fetchLive}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition active:scale-95"
          >
            <RefreshCw size={13} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* ── Live banner ── */}
      {liveLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : (
        live && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Online now */}
            <div
              className="col-span-1 bg-gradient-to-br from-green-500 to-emerald-600
            rounded-2xl p-4 text-white"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Wifi size={13} className="opacity-80" />
                <span className="text-[11px] font-semibold opacity-80">
                  Online now
                </span>
                <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              </div>
              <p className="text-3xl font-black leading-none">
                {live.live.onlineNow}
              </p>
              <p className="text-[10px] opacity-60 mt-1">active sessions</p>
            </div>

            {/* Views 5 min */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="flex items-center gap-1 mb-2">
                <Zap size={11} className="text-[#ffc105]" />
                <span className="text-[11px] text-gray-400 font-medium">
                  5 min
                </span>
              </div>
              <p className="text-2xl font-black text-gray-900">
                {live.live.views5min}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">page views</p>
            </div>

            {/* Views 1h */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="flex items-center gap-1 mb-2">
                <Clock size={11} className="text-purple-400" />
                <span className="text-[11px] text-gray-400 font-medium">
                  1 hour
                </span>
              </div>
              <p className="text-2xl font-black text-gray-900">
                {live.live.views1h}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">page views</p>
            </div>

            {/* Views 24h */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="flex items-center gap-1 mb-2">
                <Activity size={11} className="text-blue-400" />
                <span className="text-[11px] text-gray-400 font-medium">
                  24 hours
                </span>
              </div>
              <p className="text-2xl font-black text-gray-900">
                {live.live.views24h}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">page views</p>
            </div>
          </div>
        )
      )}

      {/* ── Hourly traffic chart ── */}
      {hourly.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <SectionHead
            icon={<BarChart2 size={15} />}
            title="Traffic last 24 h"
            badge="hourly"
          />
          <div className="px-5 py-4">
            <HourlyChart data={hourly} />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-300">24h ago</span>
              <span className="text-[10px] text-gray-300">now</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Platform stats ── */}
      {overviewLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : (
        stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total users"
              value={fmt(stats.totalUsers)}
              icon={<Users size={18} />}
              sub={`${stats.totalVendors ?? 0} vendors`}
            />
            <StatCard
              label="Active listings"
              value={fmt(stats.totalAds)}
              icon={<ShoppingBag size={18} />}
            />
            <StatCard
              label="Marketers"
              value={fmt(stats.totalMarketers)}
              icon={<Megaphone size={18} />}
            />
            <StatCard
              label={`Revenue (${currency})`}
              value={revenue}
              icon={<TrendingUp size={18} />}
              sub="All time"
              sparkData={hourlyCounts.slice(-12)}
              highlight
            />
          </div>
        )
      )}

      {/* ── Breakdown + live feed ── */}
      {live && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Country + device */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <SectionHead
              icon={<Globe size={15} />}
              title="Traffic by country"
              badge="last 24h"
            />
            <div className="px-5 py-3 space-y-3">
              {live.breakdown.byCountry.length === 0 ? (
                <p className="text-xs text-gray-300 py-2">No data yet</p>
              ) : (
                live.breakdown.byCountry.map((c: any) => (
                  <div key={c.country} className="flex items-center gap-2">
                    <span className="text-base">
                      {FLAGS[c.country] ?? "🌍"}
                    </span>
                    <span className="text-xs font-medium text-gray-700 w-20 truncate">
                      {c.country}
                    </span>
                    <Bar value={c.count} max={maxCountry} />
                    <span className="text-xs font-bold text-gray-500 w-8 text-right">
                      {c.count}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="px-5 py-3 border-t border-gray-50">
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">
                By device
              </p>
              <div className="flex gap-4">
                {live.breakdown.byDevice.map((d: any) => (
                  <div key={d.device} className="flex items-center gap-1.5">
                    <DeviceIcon device={d.device} />
                    <span className="text-xs text-gray-500 capitalize">
                      {d.device}
                    </span>
                    <span className="text-xs font-bold text-gray-700">
                      {d.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top pages */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <SectionHead
              icon={<Eye size={15} />}
              title="Top pages"
              badge="last 24h"
            />
            <div className="divide-y divide-gray-50">
              {live.breakdown.byPage.length === 0 ? (
                <p className="text-xs text-gray-300 px-5 py-4">No data yet</p>
              ) : (
                live.breakdown.byPage.map((p: any, i: number) => (
                  <div
                    key={p.path}
                    className="px-5 py-2.5 flex items-center gap-2"
                  >
                    <span className="text-[10px] text-gray-300 font-bold w-4 flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-xs text-gray-700 truncate flex-1 min-w-0">
                      {p.path}
                    </span>
                    <span className="text-xs font-bold text-gray-500 flex-shrink-0">
                      {p.count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Live activity */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <SectionHead
              icon={<LiveDot />}
              title="Live activity"
              badge="last hour"
            />
            <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
              {live.recentActivity.length === 0 ? (
                <p className="text-xs text-gray-300 px-5 py-4">
                  No activity yet
                </p>
              ) : (
                live.recentActivity.map((a: any, i: number) => (
                  <div key={i} className="px-4 py-2.5 flex items-center gap-2">
                    <span className="flex-shrink-0">
                      {FLAGS[a.country] ?? "🌍"}
                    </span>
                    <DeviceIcon device={a.device} />
                    <span className="text-xs text-gray-600 truncate flex-1 min-w-0">
                      {a.path}
                    </span>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">
                      {timeAgo(a.createdAt)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Recent signups + payments ── */}
      {!overviewLoading && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <SectionHead icon={<Users size={15} />} title="Recent signups" />
            <div className="divide-y divide-gray-50">
              {recentUsers.length === 0 ? (
                <p className="text-xs text-gray-300 px-5 py-4">
                  No recent users
                </p>
              ) : (
                recentUsers.map((u: any) => (
                  <div
                    key={u._id}
                    className="px-5 py-3 flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {u.username}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {u.email}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                      ${
                        u.role === "vendor"
                          ? "bg-green-100 text-green-700"
                          : u.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-500"
                      }`}
                      >
                        {u.role}
                      </span>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {fmtDate(u.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <SectionHead
              icon={<CreditCard size={15} />}
              title="Recent payments"
            />
            <div className="divide-y divide-gray-50">
              {recentPurchases.length === 0 ? (
                <p className="text-xs text-gray-300 px-5 py-4">
                  No payments yet
                </p>
              ) : (
                recentPurchases.map((p: any) => (
                  <div
                    key={p._id}
                    className="px-5 py-3 flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">
                        {p.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {p.user?.username ?? "—"}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-sm font-black text-gray-900">
                        {p.currency === "NGN" ? "₦" : "₵"}
                        {p.amount.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {fmtDate(p.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
