"use client";
// src/app/admin/page.tsx — Admin Analytics Dashboard
// Real-time overview: revenue, users, live traffic, country breakdown, page activity

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import axiosInstance from "@/src/lib/api/axios";
import { useAdmin } from "@/src/hooks/useAdmin";
import { useViewCountry } from "@/src/hooks/useViewCountry";
import {
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Eye,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  Activity,
  Zap,
  ArrowRight,
  MapPin,
  FileText,
  BarChart2,
  Clock,
  Wifi,
  WifiOff,
  ChevronRight,
  Package,
  Award,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(1)}k`
      : String(Math.round(n));

const fmtTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const relTime = (iso: string) => {
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
};

// ── Sub-components ─────────────────────────────────────────────────────────

function LiveDot({ on = true }: { on?: boolean }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      {on && (
        <span
          className="animate-ping absolute inline-flex h-full w-full
        rounded-full bg-green-400 opacity-75"
        />
      )}
      <span
        className={`relative inline-flex rounded-full h-2.5 w-2.5
        ${on ? "bg-green-500" : "bg-gray-300"}`}
      />
    </span>
  );
}

function KPI({
  label,
  value,
  icon,
  sub,
  accent,
  warn,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  sub?: string;
  accent?: boolean;
  warn?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 border flex flex-col gap-3
      ${
        accent
          ? "bg-gray-900 text-white border-gray-800"
          : warn
            ? "bg-orange-50 border-orange-200"
            : "bg-white border-gray-100 shadow-sm"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center
        ${accent ? "bg-white/10" : warn ? "bg-orange-100" : "bg-gray-50"}`}
      >
        {icon}
      </div>
      <div>
        <p
          className={`text-2xl font-black tracking-tight
          ${accent ? "text-white" : warn ? "text-orange-700" : "text-gray-900"}`}
        >
          {value}
        </p>
        <p
          className={`text-xs font-semibold mt-0.5
          ${accent ? "text-white/60" : warn ? "text-orange-500" : "text-gray-500"}`}
        >
          {label}
        </p>
        {sub && (
          <p
            className={`text-[11px] mt-0.5 ${accent ? "text-white/40" : "text-gray-400"}`}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function MiniBar({
  value,
  max,
  color = "#ffc105",
}: {
  value: number;
  max: number;
  color?: string;
}) {
  const w = max > 0 ? Math.max(2, (value / max) * 100) : 0;
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${w}%`, backgroundColor: color }}
      />
    </div>
  );
}

function Sparkline({
  data,
  color = "#ffc105",
}: {
  data: number[];
  color?: string;
}) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const w = 100;
  const h = 36;
  const step = w / Math.max(data.length - 1, 1);
  const pts = data
    .map((v, i) => `${i * step},${h - (v / max) * (h - 2)}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible opacity-80">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HourlyChart({ data }: { data: { hour: string; count: number }[] }) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-0.5 h-16 w-full">
      {data.map((d, i) => {
        const h = Math.max((d.count / max) * 60, d.count > 0 ? 3 : 0);
        const isNow = i === data.length - 1;
        return (
          <div
            key={d.hour}
            className="flex-1 flex flex-col items-center gap-0.5"
            title={`${d.hour}: ${d.count} views`}
          >
            <div
              className="w-full rounded-t transition-all duration-500"
              style={{
                height: `${h}px`,
                background: isNow ? "#ffc105" : "#ffc10540",
                minHeight: d.count > 0 ? "2px" : "0",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function DeviceIcon({ device }: { device: string }) {
  if (device === "mobile")
    return <Smartphone size={12} className="text-blue-500" />;
  if (device === "tablet")
    return <Tablet size={12} className="text-purple-500" />;
  return <Monitor size={12} className="text-gray-500" />;
}

function SectionHead({
  icon,
  title,
  badge,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-sm font-black text-gray-900">{title}</h2>
        {badge && (
          <span
            className="bg-yellow-100 text-yellow-700 text-[10px] font-bold
            px-2 py-0.5 rounded-full border border-yellow-200"
          >
            {badge}
          </span>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5"
        >
          {action.label} <ChevronRight size={12} />
        </Link>
      )}
    </div>
  );
}

// ── Country flag ──────────────────────────────────────────────────────────
function CountryFlag({ country }: { country: string }) {
  const lower = (country ?? "").toLowerCase();
  if (lower.includes("ghana")) return <span className="text-sm">🇬🇭</span>;
  if (lower.includes("nigeria")) return <span className="text-sm">🇳🇬</span>;
  if (lower.includes("united states") || lower.includes("usa"))
    return <span className="text-sm">🇺🇸</span>;
  if (lower.includes("united kingdom") || lower.includes("uk"))
    return <span className="text-sm">🇬🇧</span>;
  return <Globe size={12} className="text-gray-400" />;
}

// ── Main page ──────────────────────────────────────────────────────────────
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
  const [connected, setConnected] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const overviewRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLive = useCallback(async () => {
    try {
      const [liveRes, hourlyRes] = await Promise.all([
        axiosInstance.get("/admin/analytics/live"),
        axiosInstance.get("/admin/analytics/hourly"),
      ]);
      setLive(liveRes.data);
      setHourly(hourlyRes.data.hourly ?? []);
      setLastUpdate(new Date());
      setPulse(true);
      setConnected(true);
      setTimeout(() => setPulse(false), 600);
    } catch {
      setConnected(false);
    } finally {
      setLiveLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
    fetchLive();
    // Live analytics every 30s
    timerRef.current = setInterval(fetchLive, 30_000);
    // Revenue/stats every 90s (after cache expires)
    overviewRef.current = setInterval(fetchOverview, 90_000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (overviewRef.current) clearInterval(overviewRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = overviewData?.stats;
  const recentUsers = overviewData?.recentUsers ?? [];
  const recentPurchases = overviewData?.recentPurchases ?? [];

  const ghsRevenue = stats ? `₵${fmt(stats.revenueGHS)}` : "—";
  const ngnRevenue = stats ? `₦${fmt(stats.revenueNGN)}` : "—";

  const byCountry = live?.breakdown?.byCountry ?? [];
  const byDevice = live?.breakdown?.byDevice ?? [];
  const byPage = live?.breakdown?.byPage ?? [];
  const byReferrer = live?.breakdown?.byReferrer ?? [];
  const recentActivity = live?.recentActivity ?? [];

  const maxCountry = Math.max(...byCountry.map((c: any) => c.count), 1);
  const maxPage = Math.max(...byPage.map((p: any) => p.count), 1);
  const hourlyCounts = hourly.map((h: any) => h.count ?? 0);

  const onlineNow = live?.live?.onlineNow ?? 0;
  const views24h = live?.live?.views24h ?? 0;
  const views1h = live?.live?.views1h ?? 0;
  const views5min = live?.live?.views5min ?? 0;

  return (
    <div className="space-y-6 pb-10">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <LiveDot on={connected} />
            <p className="text-xs text-gray-400">
              {connected
                ? `Live · refreshes every 30s${lastUpdate ? ` · updated ${relTime(lastUpdate.toISOString())}` : ""}`
                : "Offline — retrying…"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              fetchOverview();
              fetchLive();
            }}
            disabled={liveLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border
              border-gray-200 rounded-xl text-xs font-semibold text-gray-600
              hover:bg-gray-50 transition disabled:opacity-40"
          >
            <RefreshCw
              size={13}
              className={liveLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
          <Link
            href="/admin/analytics/business"
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-900
              rounded-xl text-xs font-semibold text-white hover:bg-gray-800 transition"
          >
            <BarChart2 size={13} /> Business report
          </Link>
        </div>
      </div>

      {/* ── Revenue KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI
          label="Revenue (GHS)"
          value={ghsRevenue}
          accent
          sub={
            stats
              ? `₵${fmt(stats.subRevenueGHS)} subs + ₵${fmt(stats.boostRevenueGHS)} boosts`
              : undefined
          }
          icon={<DollarSign size={16} className="text-yellow-400" />}
        />
        <KPI
          label="Revenue (NGN)"
          value={ngnRevenue}
          accent
          sub={
            stats
              ? `₦${fmt(stats.subRevenueNGN)} subs + ₦${fmt(stats.boostRevenueNGN)} boosts`
              : undefined
          }
          icon={<DollarSign size={16} className="text-yellow-400" />}
        />
        <KPI
          label="Total users"
          value={overviewLoading ? "…" : fmt(stats?.totalUsers ?? 0)}
          sub={`${fmt(stats?.totalVendors ?? 0)} vendors`}
          icon={<Users size={16} className="text-blue-500" />}
        />
        <KPI
          label="Active listings"
          value={overviewLoading ? "…" : fmt(stats?.totalAds ?? 0)}
          icon={<ShoppingBag size={16} className="text-purple-500" />}
        />
      </div>

      {/* ── Live stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Wifi size={13} className="text-green-500" />
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Online now
            </p>
          </div>
          <p className="text-3xl font-black text-gray-900">{onlineNow}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            active socket connections
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={13} className="text-blue-500" />
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Last 5 min
            </p>
          </div>
          <p className="text-3xl font-black text-gray-900">{views5min}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">page views</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={13} className="text-purple-500" />
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Last hour
            </p>
          </div>
          <p className="text-3xl font-black text-gray-900">{fmt(views1h)}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">page views</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Eye size={13} className="text-yellow-500" />
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              24 hours
            </p>
          </div>
          <p className="text-3xl font-black text-gray-900">{fmt(views24h)}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">page views</p>
        </div>
      </div>

      {/* ── Hourly chart ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <SectionHead
            icon={<Activity size={14} className="text-white" />}
            title="Page activity — last 24h"
          />
          <div className="flex items-center gap-1">
            <Sparkline data={hourlyCounts.slice(-8)} />
          </div>
        </div>
        <HourlyChart data={hourly} />
        <div className="flex justify-between mt-2">
          <p className="text-[10px] text-gray-400">24h ago</p>
          <p className="text-[10px] text-yellow-600 font-semibold">now</p>
        </div>
      </div>

      {/* ── Country + Device + Pages ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Traffic by country */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <SectionHead
            icon={<Globe size={14} className="text-white" />}
            title="Traffic by country"
            badge="24h"
          />
          {byCountry.length === 0 ? (
            <p className="text-xs text-gray-300 py-6 text-center">
              No data yet
            </p>
          ) : (
            <div className="space-y-3">
              {byCountry.slice(0, 8).map((c: any) => (
                <div key={c.country}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <CountryFlag country={c.country} />
                      <p className="text-xs font-semibold text-gray-700 truncate">
                        {c.country || "Unknown"}
                      </p>
                    </div>
                    <span className="text-xs font-black text-gray-900 flex-shrink-0 ml-2">
                      {fmt(c.count)}
                    </span>
                  </div>
                  <MiniBar
                    value={c.count}
                    max={maxCountry}
                    color={
                      c.country?.toLowerCase().includes("ghana")
                        ? "#ffc105"
                        : c.country?.toLowerCase().includes("nigeria")
                          ? "#22c55e"
                          : "#9ca3af"
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Devices */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <SectionHead
            icon={<Monitor size={14} className="text-white" />}
            title="Device breakdown"
            badge="24h"
          />
          {byDevice.length === 0 ? (
            <p className="text-xs text-gray-300 py-6 text-center">
              No data yet
            </p>
          ) : (
            <div className="space-y-4">
              {byDevice.map((d: any) => {
                const total = byDevice.reduce(
                  (s: number, x: any) => s + x.count,
                  0,
                );
                const pct =
                  total > 0 ? ((d.count / total) * 100).toFixed(0) : "0";
                return (
                  <div key={d.device}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <DeviceIcon device={d.device} />
                        <p className="text-xs font-semibold text-gray-700 capitalize">
                          {d.device || "desktop"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">
                          {pct}%
                        </span>
                        <span className="text-xs font-black text-gray-900">
                          {fmt(d.count)}
                        </span>
                      </div>
                    </div>
                    <MiniBar
                      value={d.count}
                      max={Math.max(...byDevice.map((x: any) => x.count), 1)}
                      color={
                        d.device === "mobile"
                          ? "#3b82f6"
                          : d.device === "tablet"
                            ? "#a855f7"
                            : "#9ca3af"
                      }
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Referrers */}
          {byReferrer.length > 0 && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                Top referrers
              </p>
              {byReferrer.slice(0, 4).map((r: any) => (
                <div
                  key={r.referrer}
                  className="flex items-center justify-between
                  text-xs py-1"
                >
                  <p className="text-gray-600 truncate max-w-[140px]">
                    {r.referrer?.replace(/^https?:\/\/(www\.)?/, "") ||
                      "direct"}
                  </p>
                  <span className="font-bold text-gray-900 flex-shrink-0">
                    {fmt(r.count)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top pages */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <SectionHead
            icon={<FileText size={14} className="text-white" />}
            title="Top pages"
            badge="24h"
          />
          {byPage.length === 0 ? (
            <p className="text-xs text-gray-300 py-6 text-center">
              No data yet
            </p>
          ) : (
            <div className="space-y-2.5">
              {byPage.slice(0, 10).map((p: any, i: number) => (
                <div key={p.path} className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-gray-300 w-4 flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 font-medium truncate">
                      {p.path || "/"}
                    </p>
                    <MiniBar value={p.count} max={maxPage} color="#6366f1" />
                  </div>
                  <span className="text-xs font-black text-gray-900 flex-shrink-0">
                    {fmt(p.count)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Live activity feed + recent payments ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Live activity feed */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <SectionHead
              icon={<Zap size={14} className="text-white" />}
              title="Live page views"
            />
            <div className="flex items-center gap-1.5">
              <LiveDot on={connected} />
              <span className="text-[11px] text-gray-400">
                {connected ? "streaming" : "offline"}
              </span>
            </div>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-xs text-gray-300 py-6 text-center">
              No recent activity
            </p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {recentActivity.map((a: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 py-1.5
                  border-b border-gray-50 last:border-0"
                >
                  <DeviceIcon device={a.device} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {a.path || "/"}
                    </p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <CountryFlag country={a.country} />
                      {a.country || "Unknown"}
                      {a.userId && (
                        <span
                          className="bg-blue-50 text-blue-500 px-1.5 py-0.5
                          rounded-full text-[9px] font-bold ml-1"
                        >
                          logged in
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 flex-shrink-0 font-mono">
                    {relTime(a.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent payments */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <SectionHead
            icon={<DollarSign size={14} className="text-white" />}
            title="Recent payments"
            action={{ label: "View all", href: "/admin/subscriptions" }}
          />
          {recentPurchases.length === 0 ? (
            <p className="text-xs text-gray-300 py-6 text-center">
              No payments yet
            </p>
          ) : (
            <div className="space-y-2.5">
              {recentPurchases.map((p: any) => (
                <div key={p._id} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center
                    justify-center flex-shrink-0"
                  >
                    {p.type === "boost" ? (
                      <Zap size={13} className="text-yellow-600" />
                    ) : (
                      <Award size={13} className="text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {p.user?.username ?? "—"}
                    </p>
                    <p className="text-[10px] text-gray-400">{p.title}</p>
                  </div>
                  <p className="text-xs font-black text-gray-900 flex-shrink-0">
                    {p.currency === "NGN" ? "₦" : "₵"}
                    {fmt(p.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Recent signups ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <SectionHead
          icon={<Users size={14} className="text-white" />}
          title="Recent signups"
          action={{ label: "All users", href: "/admin/users" }}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[480px]">
            <thead>
              <tr className="border-b border-gray-100">
                {["User", "Role", "Country", "Joined"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[10px] font-bold text-gray-400
                    uppercase tracking-wider pb-2 pr-4"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentUsers.map((u: any) => (
                <tr key={u._id} className="hover:bg-gray-50/50 transition">
                  <td className="py-2.5 pr-4">
                    <p className="font-semibold text-gray-900">{u.username}</p>
                    <p className="text-gray-400 text-[10px]">{u.email}</p>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold
                      ${
                        u.role === "vendor"
                          ? "bg-yellow-100 text-yellow-700"
                          : u.role === "admin"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <CountryFlag country={u.country ?? ""} />
                      {u.country || "—"}
                    </div>
                  </td>
                  <td className="py-2.5 text-gray-400">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString("en-GH")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
