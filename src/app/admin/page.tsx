"use client";
// src/app/admin/page.tsx — Live Admin Overview Dashboard

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
  ArrowUpRight,
  Wifi,
  Eye,
  Clock,
  RefreshCw,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GH", { dateStyle: "medium" });
}

function timeAgo(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

function pulse() {
  return "before:absolute before:inset-0 before:rounded-full before:bg-green-400 before:animate-ping before:opacity-75";
}

// ── Sub-components ─────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  sub,
  highlight = false,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 flex items-center gap-4
      ${highlight ? "bg-[#ffc105]/10 border-[#ffc105]/30" : "bg-white border-gray-100"}`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center
        flex-shrink-0 ${highlight ? "bg-[#ffc105] text-black" : "bg-[#ffc105]/10 text-[#ffc105]"}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-2xl font-black text-gray-900 leading-tight">
          {value}
        </p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function LiveDot() {
  return (
    <span className="relative inline-flex w-2.5 h-2.5 flex-shrink-0">
      <span
        className="animate-ping absolute inline-flex h-full w-full
        rounded-full bg-green-400 opacity-75"
      />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
    </span>
  );
}

function DeviceIcon({ device }: { device: string }) {
  if (device === "mobile")
    return <Smartphone size={12} className="text-blue-500" />;
  if (device === "tablet")
    return <Tablet size={12} className="text-purple-500" />;
  return <Monitor size={12} className="text-gray-400" />;
}

function CountryFlag({ country }: { country: string }) {
  const flags: Record<string, string> = { Ghana: "🇬🇭", Nigeria: "🇳🇬" };
  return <span>{flags[country] ?? "🌍"}</span>;
}

// Bar spark
function MiniBar({
  value,
  max,
  color = "bg-[#ffc105]",
}: {
  value: number;
  max: number;
  color?: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-700`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function AdminOverviewPage() {
  const {
    data: overviewData,
    loading: overviewLoading,
    fetch: fetchOverview,
  } = useAdmin<any>("overview");
  const { sym, currency } = useViewCountry();

  // Live analytics state
  const [live, setLive] = useState<any>(null);
  const [hourly, setHourly] = useState<any[]>([]);
  const [liveLoading, setLiveLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLive = useCallback(async () => {
    try {
      const [liveRes, hourlyRes] = await Promise.all([
        axiosInstance.get("/admin/analytics/live"),
        axiosInstance.get("/admin/analytics/hourly"),
      ]);
      setLive(liveRes.data);
      setHourly(hourlyRes.data.hourly ?? []);
      setLastUpdate(new Date());
    } catch {
      /* silently fail — live panel is non-critical */
    } finally {
      setLiveLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
    fetchLive();
    // Refresh live stats every 30 seconds
    intervalRef.current = setInterval(fetchLive, 30_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const stats = overviewData?.stats;
  const recentUsers = overviewData?.recentUsers ?? [];
  const recentPurchases = overviewData?.recentPurchases ?? [];

  const revenue = stats
    ? currency === "NGN"
      ? `₦${stats.revenueNGN.toLocaleString()}`
      : `₵${stats.revenueGHS.toLocaleString()}`
    : "—";

  // Max value for country bar chart
  const maxCountryCount = Math.max(
    ...(live?.breakdown?.byCountry ?? []).map((c: any) => c.count),
    1,
  );

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Overview</h1>
          <p className="text-sm text-gray-400 mt-0.5">Live platform activity</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <LiveDot />
          <span>
            {lastUpdate
              ? `Updated ${timeAgo(lastUpdate.toISOString())}`
              : "Loading…"}
          </span>
          <button
            onClick={fetchLive}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* ── LIVE BANNER ── */}
      {live && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            className="bg-green-50 border border-green-200 rounded-2xl p-4 flex
            items-center gap-3"
          >
            <div className="relative flex-shrink-0">
              <Wifi size={20} className="text-green-600" />
              <span
                className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400
                rounded-full animate-pulse"
              />
            </div>
            <div>
              <p className="text-xs text-green-600 font-medium">Online now</p>
              <p className="text-2xl font-black text-green-800">
                {live.live.onlineNow}
              </p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <p className="text-xs text-blue-500 font-medium flex items-center gap-1">
              <Clock size={11} /> Last 5 min
            </p>
            <p className="text-2xl font-black text-blue-800 mt-0.5">
              {live.live.views5min}
              <span className="text-xs font-normal text-blue-400 ml-1">
                views
              </span>
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
            <p className="text-xs text-purple-500 font-medium flex items-center gap-1">
              <Eye size={11} /> Last hour
            </p>
            <p className="text-2xl font-black text-purple-800 mt-0.5">
              {live.live.views1h}
              <span className="text-xs font-normal text-purple-400 ml-1">
                views
              </span>
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
              <Activity size={11} /> Last 24h
            </p>
            <p className="text-2xl font-black text-amber-800 mt-0.5">
              {live.live.views24h}
              <span className="text-xs font-normal text-amber-400 ml-1">
                views
              </span>
            </p>
          </div>
        </div>
      )}

      {/* ── PLATFORM STATS ── */}
      {overviewLoading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 size={28} className="animate-spin text-[#ffc105]" />
        </div>
      ) : (
        stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total users"
              value={stats.totalUsers.toLocaleString()}
              icon={<Users size={20} />}
              sub={`${stats.totalVendors} vendors`}
            />
            <StatCard
              label="Active ads"
              value={stats.totalAds.toLocaleString()}
              icon={<ShoppingBag size={20} />}
            />
            <StatCard
              label="Marketers"
              value={stats.totalMarketers.toLocaleString()}
              icon={<Megaphone size={20} />}
            />
            <StatCard
              label={`Revenue (${currency})`}
              value={revenue}
              icon={<TrendingUp size={20} />}
              sub="All time"
              highlight
            />
          </div>
        )
      )}

      {/* ── LIVE BREAKDOWN + RECENT ACTIVITY ── */}
      {live && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Country breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <Globe size={15} className="text-[#ffc105]" />
              <h3 className="font-bold text-sm text-gray-900">
                Traffic by country
              </h3>
              <span className="ml-auto text-[10px] text-gray-400">
                last 24h
              </span>
            </div>
            <div className="px-5 py-3 space-y-3">
              {live.breakdown.byCountry.length === 0 && (
                <p className="text-xs text-gray-400 py-2">No data yet</p>
              )}
              {live.breakdown.byCountry.map((c: any) => (
                <div key={c.country} className="flex items-center gap-2">
                  <CountryFlag country={c.country} />
                  <span className="text-xs font-medium text-gray-700 w-20 truncate">
                    {c.country}
                  </span>
                  <MiniBar value={c.count} max={maxCountryCount} />
                  <span className="text-xs font-bold text-gray-500 w-8 text-right">
                    {c.count}
                  </span>
                </div>
              ))}
            </div>
            {/* Device split */}
            <div className="px-5 py-3 border-t border-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Device split
              </p>
              <div className="flex gap-3">
                {live.breakdown.byDevice.map((d: any) => (
                  <div
                    key={d.device}
                    className="flex items-center gap-1.5 text-xs text-gray-500"
                  >
                    <DeviceIcon device={d.device} />
                    <span className="capitalize">{d.device}</span>
                    <span className="font-bold text-gray-700">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top pages */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <Eye size={15} className="text-[#ffc105]" />
              <h3 className="font-bold text-sm text-gray-900">Top pages</h3>
              <span className="ml-auto text-[10px] text-gray-400">
                last 24h
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {live.breakdown.byPage.length === 0 && (
                <p className="text-xs text-gray-400 px-5 py-4">No data yet</p>
              )}
              {live.breakdown.byPage.map((p: any, i: number) => (
                <div
                  key={p.path}
                  className="px-5 py-2.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] text-gray-300 font-bold w-4">
                      {i + 1}
                    </span>
                    <span className="text-xs text-gray-700 truncate max-w-[150px]">
                      {p.path}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-500 ml-2 flex-shrink-0">
                    {p.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live activity feed */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <LiveDot />
              <h3 className="font-bold text-sm text-gray-900 ml-1">
                Live activity
              </h3>
              <span className="ml-auto text-[10px] text-gray-400">
                last hour
              </span>
            </div>
            <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
              {live.recentActivity.length === 0 && (
                <p className="text-xs text-gray-400 px-5 py-4">
                  No activity yet
                </p>
              )}
              {live.recentActivity.map((a: any, i: number) => (
                <div key={i} className="px-4 py-2.5 flex items-center gap-2.5">
                  <CountryFlag country={a.country} />
                  <DeviceIcon device={a.device} />
                  <span className="text-xs text-gray-600 truncate flex-1 min-w-0">
                    {a.path}
                  </span>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">
                    {timeAgo(a.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── RECENT SIGNUPS + PAYMENTS ── */}
      {!overviewLoading && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <Users size={15} className="text-[#ffc105]" />
              <h3 className="font-bold text-sm text-gray-900">
                Recent signups
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {recentUsers.map((u: any) => (
                <div
                  key={u._id}
                  className="px-5 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {u.username}
                    </p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                  <div className="text-right">
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
                      {formatDate(u.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <CreditCard size={15} className="text-[#ffc105]" />
              <h3 className="font-bold text-sm text-gray-900">
                Recent payments
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {recentPurchases.map((p: any) => (
                <div
                  key={p._id}
                  className="px-5 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">
                      {p.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {p.user?.username ?? "—"}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black text-gray-900">
                      {p.currency === "NGN" ? "₦" : "₵"}
                      {p.amount.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {formatDate(p.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
