"use client";
// src/app/admin/analytics/business/page.tsx
// Comprehensive business analytics for decision-making.
// 6 sections: Revenue, Growth, Engagement, Payments, Marketers, Retention

import { useEffect, useState, useCallback, useRef } from "react";
import axiosInstance from "@/src/lib/api/axios";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingBag,
  BarChart2,
  Target,
  RefreshCw,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Zap,
  Store,
  Globe,
  CreditCard,
  UserCheck,
  AlertTriangle,
  Award,
  Percent,
  Eye,
  Phone,
  Calendar,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
type Days = 7 | 14 | 30 | 90;
type Country = "all" | "Ghana" | "Nigeria";

interface BusinessData {
  meta: { country: string; days: number; generatedAt: string };
  revenue: RevenueData;
  growth: GrowthData;
  engagement: EngagementData;
  payments: PaymentData;
  marketers: MarketerData;
  retention: RetentionData;
}

interface RevenueData {
  byCurrency: Record<
    string,
    { subscription: number; boost: number; total: number; count: number }
  >;
  changePercent: Record<string, number>;
  byPlan: {
    plan: string;
    currency: string;
    total: number;
    count: number;
    avgValue: number;
  }[];
  byBillingCycle: { cycle: string; total: number; count: number }[];
  dailyTrend: { date: string; GHS: number; NGN: number; count: number }[];
  avgOrderValue: { currency: string; avg: number; count: number }[];
  byGateway: { currency: string; total: number; count: number }[];
}

interface GrowthData {
  newUsers: number;
  userGrowthPct: number;
  newAds: number;
  adGrowthPct: number;
  usersByRole: Record<string, number>;
  usersByCountry: { country: string; count: number }[];
  vendorsByPlan: { plan: string; count: number }[];
}

interface EngagementData {
  byCategory: {
    _id: string;
    total: number;
    active: number;
    totalViews: number;
    totalContacts: number;
    boosted: number;
  }[];
  topAds: {
    title: string;
    category: string;
    country: string;
    views: number;
    contacts: number;
    conversion: number;
    boosted: boolean;
    price: number;
    currency: string;
    vendor: string;
  }[];
  conversionByCategory: {
    category: string;
    views: number;
    contacts: number;
    conversionRate: number;
    adCount: number;
  }[];
}

interface PaymentData {
  total: number;
  successful: number;
  failed: number;
  pending: number;
  successRate: number;
}

interface MarketerData {
  commissionByCurrency: {
    currency: string;
    totalRev: number;
    commission: number;
    count: number;
  }[];
  topMarketers: {
    name: string;
    revenue: number;
    count: number;
    currency: string;
    commission: number;
  }[];
  referralStats: {
    totalCodes: number;
    usedCodes: number;
    totalRefs: number;
    totalEarned: number;
  };
}

interface RetentionData {
  activeVendors: number;
  expiringInWeek: number;
  churnedInPeriod: number;
  churnRate: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const GHS = (n: number) =>
  `₵${n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M" : n >= 1_000 ? (n / 1_000).toFixed(1) + "k" : n.toFixed(0)}`;
const NGN = (n: number) =>
  `₦${n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M" : n >= 1_000 ? (n / 1_000).toFixed(1) + "k" : n.toFixed(0)}`;
const fmt = (n: number, cur?: string) => (cur === "NGN" ? NGN(n) : GHS(n));
const pct = (n: number) => `${n >= 0 ? "+" : ""}${n}%`;
const num = (n: number) =>
  n >= 1_000 ? `${(n / 1_000).toFixed(1)}k` : String(n);

const CATEGORY_ICON: Record<string, string> = {
  marketplace: "🛒",
  food: "🍽️",
  apartments: "🏠",
  fashion: "👗",
  pharmacy: "💊",
  delivery: "🚚",
  services: "🔧",
};

// ── Sub-components ─────────────────────────────────────────────────────────

function Trend({ value, suffix = "%" }: { value: number; suffix?: string }) {
  if (value === 0)
    return (
      <span className="flex items-center gap-0.5 text-gray-400 text-xs font-semibold">
        <Minus size={11} />0{suffix}
      </span>
    );
  const up = value > 0;
  return (
    <span
      className={`flex items-center gap-0.5 text-xs font-bold
      ${up ? "text-green-600" : "text-red-500"}`}
    >
      {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {up ? "+" : ""}
      {value}
      {suffix}
    </span>
  );
}

function KPI({
  label,
  value,
  sub,
  trend,
  icon,
  accent = false,
  warning = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  trend?: number;
  icon: React.ReactNode;
  accent?: boolean;
  warning?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 border flex flex-col gap-3
      ${
        accent
          ? "bg-gray-900 text-white border-gray-800"
          : warning
            ? "bg-orange-50 border-orange-200"
            : "bg-white border-gray-100 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center
          ${accent ? "bg-white/10" : warning ? "bg-orange-100" : "bg-gray-50"}`}
        >
          {icon}
        </div>
        {trend !== undefined && <Trend value={trend} />}
      </div>
      <div>
        <p
          className={`text-2xl font-black tracking-tight
          ${accent ? "text-white" : warning ? "text-orange-700" : "text-gray-900"}`}
        >
          {value}
        </p>
        <p
          className={`text-xs font-semibold mt-0.5
          ${accent ? "text-white/60" : warning ? "text-orange-500" : "text-gray-500"}`}
        >
          {label}
        </p>
        {sub && (
          <p
            className={`text-[11px] mt-0.5
            ${accent ? "text-white/40" : "text-gray-400"}`}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-black text-gray-900">{title}</h2>
        <p className="text-xs text-gray-400">{desc}</p>
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
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${w}%`, backgroundColor: color }}
      />
    </div>
  );
}

// Simple inline sparkline using SVG
function Spark({
  data,
  color = "#ffc105",
}: {
  data: number[];
  color?: string;
}) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const w = 80;
  const h = 28;
  const step = w / Math.max(data.length - 1, 1);
  const pts = data
    .map((v, i) => `${i * step},${h - (v / max) * (h - 2)}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
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

// Bar chart row
function BarRow({
  label,
  value,
  max,
  format,
  sub,
}: {
  label: string;
  value: number;
  max: number;
  format?: (n: number) => string;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <p className="text-xs text-gray-600 w-24 flex-shrink-0 truncate font-medium capitalize">
        {label}
      </p>
      <div className="flex-1">
        <MiniBar value={value} max={max} />
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xs font-black text-gray-900">
          {format ? format(value) : num(value)}
        </p>
        {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

// Daily trend mini chart
function DailyTrend({
  data,
  currency,
}: {
  data: { date: string; GHS: number; NGN: number; count: number }[];
  currency: "GHS" | "NGN";
}) {
  if (!data.length)
    return <p className="text-xs text-gray-300 py-4 text-center">No data</p>;

  const values = data.map((d) => d[currency]);
  const max = Math.max(...values, 1);
  const W = 440;
  const H = 80;
  const barW = Math.max(4, Math.floor(W / data.length) - 1);

  return (
    <div className="overflow-x-auto">
      <svg
        width={Math.max(W, data.length * (barW + 1))}
        height={H + 20}
        className="block"
      >
        {data.map((d, i) => {
          const v = d[currency];
          const bh = Math.max((v / max) * H, v > 0 ? 3 : 0);
          const x = i * (barW + 1);
          const isToday = i === data.length - 1;
          return (
            <g key={d.date}>
              <rect
                x={x}
                y={H - bh}
                width={barW}
                height={bh}
                fill={isToday ? "#ffc105" : "#ffc10540"}
                rx={2}
              >
                <title>
                  {d.date}: {fmt(v, currency)} ({d.count} txns)
                </title>
              </rect>
              {i % Math.ceil(data.length / 7) === 0 && (
                <text
                  x={x + barW / 2}
                  y={H + 14}
                  textAnchor="middle"
                  fill="#9ca3af"
                  fontSize="9"
                >
                  {d.date.slice(5)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function TableHead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className="border-b border-gray-100">
        {cols.map((c) => (
          <th
            key={c}
            className="text-left text-[10px] font-bold text-gray-400 uppercase
            tracking-wider pb-2 pr-4 first:pl-0 last:pr-0"
          >
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function ConversionBadge({ rate }: { rate: number }) {
  const color =
    rate >= 10
      ? "bg-green-100 text-green-700"
      : rate >= 5
        ? "bg-yellow-100 text-yellow-700"
        : rate >= 2
          ? "bg-orange-100 text-orange-600"
          : "bg-red-50 text-red-500";
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${color}`}>
      {rate.toFixed(1)}%
    </span>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AdminBusinessAnalytics() {
  const [data, setData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState<Days>(30);
  const [country, setCountry] = useState<Country>("all");
  const [section, setSection] = useState<string>("revenue");
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(
        `/admin/analytics/business?country=${country}&days=${days}`,
        { signal: ctrl.signal },
      );
      setData(res.data);
    } catch (err: any) {
      if (err.name !== "CanceledError") setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [country, days]);

  useEffect(() => {
    load();
  }, [load]);

  // ── Export as JSON ──────────────────────────────────────────────────────
  const exportJSON = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `smilebaba-analytics-${data.meta.days}d-${data.meta.country}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Export as CSV ───────────────────────────────────────────────────────
  const exportCSV = () => {
    if (!data) return;
    const rows = [
      ["Metric", "Value", "Currency", "Period"],
      ...Object.entries(data.revenue.byCurrency).map(([cur, v]) => [
        "Total Revenue",
        v.total,
        cur,
        `${days}d`,
      ]),
      ...Object.entries(data.revenue.byCurrency).map(([cur, v]) => [
        "Subscription Revenue",
        v.subscription,
        cur,
        `${days}d`,
      ]),
      ...Object.entries(data.revenue.byCurrency).map(([cur, v]) => [
        "Boost Revenue",
        v.boost,
        cur,
        `${days}d`,
      ]),
      ["New Users", data.growth.newUsers, "", `${days}d`],
      ["New Ads", data.growth.newAds, "", `${days}d`],
      ["Active Vendors", data.retention.activeVendors, "", "current"],
      ["Payment Success Rate", data.payments.successRate + "%", "", `${days}d`],
      ["Churn Rate", data.retention.churnRate + "%", "", `${days}d`],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `smilebaba-kpis-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SECTIONS = [
    { id: "revenue", label: "Revenue", icon: <DollarSign size={14} /> },
    { id: "growth", label: "Growth", icon: <TrendingUp size={14} /> },
    { id: "engagement", label: "Engagement", icon: <Eye size={14} /> },
    { id: "payments", label: "Payments", icon: <CreditCard size={14} /> },
    { id: "marketers", label: "Marketers", icon: <Award size={14} /> },
    { id: "retention", label: "Retention", icon: <UserCheck size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div>
              <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <BarChart2 size={20} className="text-yellow-500" />
                Business Analytics
              </h1>
              {data && (
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Updated {new Date(data.meta.generatedAt).toLocaleTimeString()}
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Country */}
              <div className="relative">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value as Country)}
                  className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold
                    bg-white border border-gray-200 rounded-xl text-gray-700
                    focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer"
                >
                  <option value="all">🌍 All countries</option>
                  <option value="Ghana">🇬🇭 Ghana</option>
                  <option value="Nigeria">🇳🇬 Nigeria</option>
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              {/* Period */}
              <div className="flex bg-gray-100 rounded-xl p-0.5 gap-0.5">
                {([7, 14, 30, 90] as Days[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all
                      ${days === d ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    {d}d
                  </button>
                ))}
              </div>

              <button
                onClick={load}
                disabled={loading}
                className="w-8 h-8 flex items-center justify-center bg-white border
                  border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50
                  transition disabled:opacity-40"
              >
                <RefreshCw
                  size={13}
                  className={loading ? "animate-spin" : ""}
                />
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={exportCSV}
                  disabled={!data}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold
                    bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition
                    disabled:opacity-40"
                >
                  <Download size={12} /> CSV
                </button>
                <button
                  onClick={exportJSON}
                  disabled={!data}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold
                    bg-white border border-gray-200 text-gray-700 rounded-xl
                    hover:bg-gray-50 transition disabled:opacity-40"
                >
                  <Download size={12} /> JSON
                </button>
              </div>
            </div>
          </div>

          {/* Section nav */}
          <div className="flex gap-1 mt-3 overflow-x-auto scrollbar-none pb-0.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                  font-semibold transition flex-shrink-0
                  ${
                    section === s.id
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div
              className="w-10 h-10 border-2 border-yellow-400 border-t-transparent
              rounded-full animate-spin"
            />
            <p className="text-sm text-gray-400">Loading business data…</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-600 font-semibold text-sm">{error}</p>
            <button
              onClick={load}
              className="mt-3 text-xs text-red-400 hover:text-red-600"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && data && (
          <div className="space-y-8">
            {/* ══ REVENUE ══════════════════════════════════════════════════ */}
            {section === "revenue" && (
              <div className="space-y-6">
                <SectionTitle
                  icon={<DollarSign size={18} className="text-yellow-400" />}
                  title="Revenue"
                  desc="Subscription + boost income, trends and plan breakdown"
                />

                {/* KPI row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {Object.entries(data.revenue.byCurrency).map(([cur, v]) => (
                    <KPI
                      key={cur}
                      accent
                      label={`Total (${cur})`}
                      value={fmt(v.total, cur)}
                      sub={`${v.count} transactions`}
                      trend={data.revenue.changePercent[cur]}
                      icon={
                        <DollarSign size={16} className="text-yellow-400" />
                      }
                    />
                  ))}
                  {data.revenue.avgOrderValue.map((a) => (
                    <KPI
                      key={a.currency}
                      label={`Avg. order (${a.currency})`}
                      value={fmt(a.avg, a.currency)}
                      sub={`across ${a.count} payments`}
                      icon={<Zap size={16} className="text-yellow-500" />}
                    />
                  ))}
                </div>

                {/* Daily trend + plan breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Daily Revenue Chart */}
                  {(["GHS", "NGN"] as const)
                    .filter((c) => data.revenue.byCurrency[c])
                    .map((cur) => (
                      <div
                        key={cur}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm font-black text-gray-900">
                              Daily Revenue ({cur})
                            </p>
                            <p className="text-[11px] text-gray-400">
                              Last {days} days
                            </p>
                          </div>
                          <span className="text-lg">
                            {cur === "GHS" ? "🇬🇭" : "🇳🇬"}
                          </span>
                        </div>
                        <DailyTrend
                          data={data.revenue.dailyTrend}
                          currency={cur}
                        />
                      </div>
                    ))}
                </div>

                {/* Plan breakdown + Billing cycle */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-sm font-black text-gray-900 mb-4">
                      Revenue by Plan
                    </p>
                    <div className="space-y-3">
                      {data.revenue.byPlan.length === 0 && (
                        <p className="text-xs text-gray-300 py-4 text-center">
                          No data
                        </p>
                      )}
                      {data.revenue.byPlan.map((p, i) => {
                        const maxTotal = Math.max(
                          ...data.revenue.byPlan.map((x) => x.total),
                          1,
                        );
                        return (
                          <BarRow
                            key={i}
                            label={p.plan ?? "Unknown"}
                            value={p.total}
                            max={maxTotal}
                            format={(v) => fmt(v, p.currency)}
                            sub={`${p.count} subs · avg ${fmt(p.avgValue, p.currency)}`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-sm font-black text-gray-900 mb-1">
                      Billing Cycle Split
                    </p>
                    <p className="text-[11px] text-gray-400 mb-4">
                      Monthly vs annual subscriptions
                    </p>
                    <div className="space-y-4">
                      {data.revenue.byBillingCycle.map((b) => {
                        const total = data.revenue.byBillingCycle.reduce(
                          (s, x) => s + x.count,
                          0,
                        );
                        const pct =
                          total > 0
                            ? ((b.count / total) * 100).toFixed(1)
                            : "0";
                        return (
                          <div key={b.cycle}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-semibold text-gray-700 capitalize">
                                {b.cycle === "once" ? "One-time" : b.cycle}
                              </span>
                              <span className="text-gray-500">
                                {pct}% · {b.count} subs
                              </span>
                            </div>
                            <MiniBar
                              value={b.count}
                              max={total}
                              color={
                                b.cycle === "yearly" ? "#16a34a" : "#ffc105"
                              }
                            />
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <p className="text-[11px] text-gray-400 font-semibold mb-2">
                        💡 Insight
                      </p>
                      {(() => {
                        const yr = data.revenue.byBillingCycle.find(
                          (b) => b.cycle === "yearly",
                        );
                        const mo = data.revenue.byBillingCycle.find(
                          (b) => b.cycle === "monthly",
                        );
                        const total = (yr?.count ?? 0) + (mo?.count ?? 0);
                        const yrPct =
                          total > 0
                            ? (((yr?.count ?? 0) / total) * 100).toFixed(0)
                            : 0;
                        return (
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {Number(yrPct) < 20
                              ? `Only ${yrPct}% of vendors are on annual billing. Offering a stronger annual discount could improve cash flow and reduce churn.`
                              : `${yrPct}% of vendors chose annual billing — strong cash flow signal. Consider a loyalty reward for these vendors.`}
                          </p>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ GROWTH ═══════════════════════════════════════════════════ */}
            {section === "growth" && (
              <div className="space-y-6">
                <SectionTitle
                  icon={<TrendingUp size={18} className="text-green-500" />}
                  title="User & Platform Growth"
                  desc="Registrations, vendor adoption, and country-level breakdown"
                />

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <KPI
                    label="New users"
                    value={num(data.growth.newUsers)}
                    trend={data.growth.userGrowthPct}
                    icon={<Users size={16} className="text-blue-500" />}
                  />
                  <KPI
                    label="New ads posted"
                    value={num(data.growth.newAds)}
                    trend={data.growth.adGrowthPct}
                    icon={<ShoppingBag size={16} className="text-purple-500" />}
                  />
                  <KPI
                    label="Total vendors"
                    accent
                    value={num(data.growth.usersByRole["vendor"] ?? 0)}
                    sub="all time"
                    icon={<Store size={16} className="text-yellow-400" />}
                  />
                  <KPI
                    label="Active vendors"
                    value={num(data.retention.activeVendors)}
                    sub="paid plan, not expired"
                    icon={<UserCheck size={16} className="text-green-500" />}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Users by country */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-sm font-black text-gray-900 mb-4">
                      Users by Country
                    </p>
                    <div className="space-y-3">
                      {data.growth.usersByCountry.slice(0, 8).map((c) => {
                        const total = data.growth.usersByCountry.reduce(
                          (s, x) => s + x.count,
                          0,
                        );
                        const share =
                          total > 0
                            ? ((c.count / total) * 100).toFixed(1)
                            : "0";
                        const flag =
                          c.country === "Nigeria"
                            ? "🇳🇬"
                            : c.country === "Ghana"
                              ? "🇬🇭"
                              : "🌍";
                        return (
                          <BarRow
                            key={c.country}
                            label={`${flag} ${c.country || "Unknown"}`}
                            value={c.count}
                            max={data.growth.usersByCountry[0]?.count ?? 1}
                            sub={`${share}% of users`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Vendors by plan */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-sm font-black text-gray-900 mb-1">
                      Vendors by Plan
                    </p>
                    <p className="text-[11px] text-gray-400 mb-4">
                      Active subscriptions only
                    </p>
                    <div className="space-y-3">
                      {data.growth.vendorsByPlan.length === 0 && (
                        <p className="text-xs text-gray-300 py-4 text-center">
                          No active vendors
                        </p>
                      )}
                      {data.growth.vendorsByPlan.map((v) => {
                        const total = data.growth.vendorsByPlan.reduce(
                          (s, x) => s + x.count,
                          0,
                        );
                        const share =
                          total > 0
                            ? ((v.count / total) * 100).toFixed(0)
                            : "0";
                        const planColors: Record<string, string> = {
                          SuperSmile: "#6366f1",
                          HappySmile: "#ffc105",
                          BasicSmile: "#22c55e",
                          Basic: "#9ca3af",
                        };
                        return (
                          <BarRow
                            key={v.plan}
                            label={v.plan ?? "Unknown"}
                            value={v.count}
                            max={data.growth.vendorsByPlan[0]?.count ?? 1}
                            // color={planColors[v.plan] ?? "#9ca3af"}
                            sub={`${share}% of active vendors`}
                          />
                        );
                      })}
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 space-y-1.5">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Role breakdown
                      </p>
                      {Object.entries(data.growth.usersByRole).map(
                        ([role, count]) => (
                          <div
                            key={role}
                            className="flex justify-between text-xs"
                          >
                            <span className="text-gray-600 capitalize">
                              {role}
                            </span>
                            <span className="font-bold text-gray-900">
                              {num(count)}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ ENGAGEMENT ═══════════════════════════════════════════════ */}
            {section === "engagement" && (
              <div className="space-y-6">
                <SectionTitle
                  icon={<Eye size={18} className="text-purple-500" />}
                  title="Product & Ad Engagement"
                  desc="Views, contacts, conversion rates and top performing listings"
                />

                {/* Category performance */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-sm font-black text-gray-900 mb-4">
                    Performance by Category
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs min-w-[520px]">
                      <TableHead
                        cols={[
                          "Category",
                          "Ads",
                          "Active",
                          "Views",
                          "Contacts",
                          "Conv. Rate",
                          "Boosted",
                        ]}
                      />
                      <tbody className="divide-y divide-gray-50">
                        {data.engagement.byCategory.map((c) => {
                          const conv =
                            c.totalViews > 0
                              ? (
                                  (c.totalContacts / c.totalViews) *
                                  100
                                ).toFixed(1)
                              : "0";
                          return (
                            <tr
                              key={c._id}
                              className="hover:bg-gray-50/50 transition"
                            >
                              <td className="py-2.5 pr-4 font-semibold text-gray-800">
                                {CATEGORY_ICON[c._id] ?? "📦"}{" "}
                                {c._id ?? "Unknown"}
                              </td>
                              <td className="py-2.5 pr-4 text-gray-600">
                                {num(c.total)}
                              </td>
                              <td className="py-2.5 pr-4 text-green-600 font-semibold">
                                {num(c.active)}
                              </td>
                              <td className="py-2.5 pr-4 text-gray-600">
                                {num(c.totalViews)}
                              </td>
                              <td className="py-2.5 pr-4 text-gray-600">
                                {num(c.totalContacts)}
                              </td>
                              <td className="py-2.5 pr-4">
                                <ConversionBadge rate={Number(conv)} />
                              </td>
                              <td className="py-2.5 text-gray-500">
                                {num(c.boosted)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top ads + conversion by category */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Top 10 ads */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-sm font-black text-gray-900 mb-4">
                      Top 10 Ads by Views
                    </p>
                    <div className="space-y-3">
                      {data.engagement.topAds.map((a, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-[11px] font-black text-gray-300 w-4 flex-shrink-0">
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">
                              {a.boosted && (
                                <span className="text-yellow-500 mr-1">⚡</span>
                              )}
                              {a.title}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {CATEGORY_ICON[a.category] ?? "📦"} {a.category}
                              {" · "}
                              {a.country === "Nigeria" ? "🇳🇬" : "🇬🇭"} {a.vendor}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs font-black text-gray-900 flex items-center gap-0.5">
                              <Eye size={9} className="text-gray-400" />
                              {num(a.views)}
                            </p>
                            <ConversionBadge rate={a.conversion} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Conversion by category */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-sm font-black text-gray-900 mb-1">
                      Contact Conversion by Category
                    </p>
                    <p className="text-[11px] text-gray-400 mb-4">
                      % of viewers who contacted the seller
                    </p>
                    <div className="space-y-3">
                      {data.engagement.conversionByCategory.map((c) => (
                        <div key={c.category} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-700 capitalize">
                              {CATEGORY_ICON[c.category] ?? "📦"} {c.category}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-400">
                                {num(c.views)} views
                              </span>
                              <ConversionBadge rate={c.conversionRate} />
                            </div>
                          </div>
                          <MiniBar
                            value={c.conversionRate}
                            max={20}
                            color={
                              c.conversionRate >= 10
                                ? "#16a34a"
                                : c.conversionRate >= 5
                                  ? "#ffc105"
                                  : "#f97316"
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        💡 Insight
                      </p>
                      {(() => {
                        const best = data.engagement.conversionByCategory[0];
                        const worst = [
                          ...data.engagement.conversionByCategory,
                        ].reverse()[0];
                        if (!best) return null;
                        return (
                          <p className="text-xs text-gray-600 leading-relaxed">
                            <strong>{best.category}</strong> converts best at{" "}
                            {best.conversionRate}%.
                            {worst &&
                              worst.category !== best.category &&
                              ` ${worst.category} lags at ${worst.conversionRate}% — consider coaching vendors on better photos and descriptions.`}
                          </p>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ PAYMENTS ═════════════════════════════════════════════════ */}
            {section === "payments" && (
              <div className="space-y-6">
                <SectionTitle
                  icon={<CreditCard size={18} className="text-blue-500" />}
                  title="Payment Analytics"
                  desc="Success rates, failure analysis and gateway performance"
                />

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <KPI
                    label="Total transactions"
                    value={num(data.payments.total)}
                    icon={<CreditCard size={16} className="text-blue-500" />}
                  />
                  <KPI
                    label="Successful"
                    accent
                    value={num(data.payments.successful)}
                    sub={`${data.payments.successRate}% success rate`}
                    icon={<CheckCircle size={16} className="text-green-400" />}
                  />
                  <KPI
                    label="Failed"
                    value={num(data.payments.failed)}
                    warning={data.payments.failed > 10}
                    icon={<XCircle size={16} className="text-red-500" />}
                  />
                  <KPI
                    label="Pending"
                    value={num(data.payments.pending)}
                    icon={<Clock size={16} className="text-yellow-500" />}
                  />
                </div>

                {/* Success rate gauge + gateway breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <p className="text-sm font-black text-gray-900 mb-5">
                      Payment Success Rate
                    </p>

                    {/* Large gauge */}
                    <div className="flex flex-col items-center gap-2 mb-6">
                      <div className="relative w-32 h-16 overflow-hidden">
                        <svg viewBox="0 0 100 50" className="w-full">
                          <path
                            d="M 10 50 A 40 40 0 0 1 90 50"
                            fill="none"
                            stroke="#f3f4f6"
                            strokeWidth="10"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 10 50 A 40 40 0 0 1 90 50"
                            fill="none"
                            stroke="#ffc105"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={`${data.payments.successRate * 1.257} 126`}
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                          <p className="text-2xl font-black text-gray-900 leading-none">
                            {data.payments.successRate}%
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Payment success rate
                      </p>
                    </div>

                    {/* Breakdown bars */}
                    <div className="space-y-3">
                      {[
                        {
                          label: "Successful",
                          value: data.payments.successful,
                          color: "#16a34a",
                        },
                        {
                          label: "Failed",
                          value: data.payments.failed,
                          color: "#ef4444",
                        },
                        {
                          label: "Pending",
                          value: data.payments.pending,
                          color: "#f59e0b",
                        },
                      ].map((s) => (
                        <BarRow
                          key={s.label}
                          label={s.label}
                          value={s.value}
                          max={data.payments.total}
                          // color={s.color}
                        />
                      ))}
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {data.payments.successRate >= 90
                          ? "✅ Excellent payment success rate. Flutterwave integration is healthy."
                          : data.payments.successRate >= 75
                            ? "Payment success rate could be improved. Check for card decline patterns."
                            : "High payment failure rate. Investigate gateway errors and user drop-off."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-sm font-black text-gray-900 mb-1">
                      Revenue by Gateway
                    </p>
                    <p className="text-[11px] text-gray-400 mb-4">
                      GHS = Flutterwave Ghana · NGN = Flutterwave Nigeria
                    </p>
                    <div className="space-y-4">
                      {data.revenue.byGateway.map((g) => {
                        const totalRevAll = data.revenue.byGateway.reduce(
                          (s, x) => s + x.total,
                          0,
                        );
                        const share =
                          totalRevAll > 0
                            ? ((g.total / totalRevAll) * 100).toFixed(1)
                            : "0";
                        return (
                          <div key={g.currency}>
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="font-semibold text-gray-700">
                                {g.currency === "GHS" ? "🇬🇭" : "🇳🇬"}{" "}
                                {g.currency}
                              </span>
                              <span className="text-gray-500">
                                {fmt(g.total, g.currency)} · {share}%
                              </span>
                            </div>
                            <MiniBar
                              value={g.total}
                              max={totalRevAll}
                              color={
                                g.currency === "NGN" ? "#22c55e" : "#ffc105"
                              }
                            />
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {g.count} transactions
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                      {data.revenue.avgOrderValue.map((a) => (
                        <div
                          key={a.currency}
                          className="flex justify-between text-xs"
                        >
                          <span className="text-gray-600">
                            Avg. order ({a.currency})
                          </span>
                          <span className="font-black text-gray-900">
                            {fmt(a.avg, a.currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ MARKETERS ════════════════════════════════════════════════ */}
            {section === "marketers" && (
              <div className="space-y-6">
                <SectionTitle
                  icon={<Award size={18} className="text-purple-500" />}
                  title="Marketer & Referral Performance"
                  desc="Commission payout, referral conversion, top earners"
                />

                {/* Commission KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <KPI
                    label="Total codes issued"
                    value={num(data.marketers.referralStats.totalCodes)}
                    icon={<Zap size={16} className="text-yellow-500" />}
                  />
                  <KPI
                    label="Codes used"
                    value={num(data.marketers.referralStats.usedCodes)}
                    sub={`${
                      data.marketers.referralStats.totalCodes > 0
                        ? (
                            (data.marketers.referralStats.usedCodes /
                              data.marketers.referralStats.totalCodes) *
                            100
                          ).toFixed(0)
                        : 0
                    }% activation rate`}
                    icon={<UserCheck size={16} className="text-green-500" />}
                  />
                  <KPI
                    label="Total referrals"
                    value={num(data.marketers.referralStats.totalRefs)}
                    accent
                    icon={<Users size={16} className="text-yellow-400" />}
                  />
                  {data.marketers.commissionByCurrency.map((c) => (
                    <KPI
                      key={c.currency}
                      label={`Commission due (${c.currency})`}
                      value={fmt(c.commission, c.currency)}
                      sub={`from ${fmt(c.totalRev, c.currency)} revenue`}
                      icon={
                        <DollarSign size={16} className="text-purple-500" />
                      }
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Top marketers */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-sm font-black text-gray-900 mb-4">
                      Top Marketers by Revenue
                    </p>
                    {data.marketers.topMarketers.length === 0 && (
                      <p className="text-xs text-gray-300 py-6 text-center">
                        No referral revenue yet
                      </p>
                    )}
                    <div className="space-y-3">
                      {data.marketers.topMarketers.map((m, i) => {
                        const maxRev =
                          data.marketers.topMarketers[0]?.revenue ?? 1;
                        return (
                          <div key={i} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-5 h-5 rounded-full bg-gray-100 text-[10px] font-black
                                  text-gray-500 flex items-center justify-center flex-shrink-0"
                                >
                                  {i + 1}
                                </span>
                                <span className="text-xs font-semibold text-gray-800">
                                  {m.name}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-black text-gray-900">
                                  {fmt(m.revenue, m.currency)}
                                </p>
                                <p className="text-[10px] text-purple-500">
                                  {fmt(m.commission, m.currency)} earned
                                </p>
                              </div>
                            </div>
                            <MiniBar
                              value={m.revenue}
                              max={maxRev}
                              color="#a855f7"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Referral funnel */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-sm font-black text-gray-900 mb-1">
                      Referral Funnel
                    </p>
                    <p className="text-[11px] text-gray-400 mb-5">
                      Codes issued → used → vendors acquired
                    </p>

                    <div className="space-y-4">
                      {[
                        {
                          label: "Codes issued",
                          value: data.marketers.referralStats.totalCodes,
                          max: data.marketers.referralStats.totalCodes,
                          color: "#6366f1",
                        },
                        {
                          label: "Codes used",
                          value: data.marketers.referralStats.usedCodes,
                          max: data.marketers.referralStats.totalCodes,
                          color: "#ffc105",
                        },
                        {
                          label: "Vendors acquired",
                          value: data.marketers.referralStats.totalRefs,
                          max: data.marketers.referralStats.totalCodes,
                          color: "#16a34a",
                        },
                      ].map((step) => (
                        <div key={step.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-gray-700">
                              {step.label}
                            </span>
                            <span className="font-black text-gray-900">
                              {num(step.value)}
                            </span>
                          </div>
                          <MiniBar
                            value={step.value}
                            max={step.max || 1}
                            color={step.color}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        💡 Insight
                      </p>
                      {(() => {
                        const { totalCodes, usedCodes, totalRefs } =
                          data.marketers.referralStats;
                        const actRate =
                          totalCodes > 0
                            ? ((usedCodes / totalCodes) * 100).toFixed(0)
                            : 0;
                        return (
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {Number(actRate) < 30
                              ? `Only ${actRate}% of marketers have used their codes. Run a training session or incentive campaign to activate dormant marketers.`
                              : `${actRate}% code activation rate is strong. Focus on retaining these high-performing marketers with timely payouts.`}
                          </p>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ RETENTION ════════════════════════════════════════════════ */}
            {section === "retention" && (
              <div className="space-y-6">
                <SectionTitle
                  icon={<UserCheck size={18} className="text-green-500" />}
                  title="Vendor Retention & Churn"
                  desc="Active vendors, expiry risk, and subscription health"
                />

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <KPI
                    label="Active vendors"
                    accent
                    value={num(data.retention.activeVendors)}
                    sub="paid plan, not expired"
                    icon={<UserCheck size={16} className="text-yellow-400" />}
                  />
                  <KPI
                    label="Expiring this week"
                    value={num(data.retention.expiringInWeek)}
                    warning={data.retention.expiringInWeek > 0}
                    sub="action needed"
                    icon={
                      <AlertTriangle size={16} className="text-orange-500" />
                    }
                  />
                  <KPI
                    label="Churned this period"
                    value={num(data.retention.churnedInPeriod)}
                    warning={data.retention.churnedInPeriod > 5}
                    icon={<TrendingDown size={16} className="text-red-500" />}
                  />
                  <KPI
                    label="Churn rate"
                    value={`${data.retention.churnRate}%`}
                    warning={data.retention.churnRate > 10}
                    sub={`last ${days} days`}
                    icon={<Percent size={16} className="text-red-400" />}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Retention health card */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <p className="text-sm font-black text-gray-900 mb-5">
                      Subscription Health
                    </p>

                    <div className="space-y-4">
                      {[
                        {
                          label: "Active",
                          value: data.retention.activeVendors,
                          color: "#16a34a",
                          icon: "✅",
                        },
                        {
                          label: "Expiring in 7 days",
                          value: data.retention.expiringInWeek,
                          color: "#f97316",
                          icon: "⚠️",
                        },
                        {
                          label: "Churned",
                          value: data.retention.churnedInPeriod,
                          color: "#ef4444",
                          icon: "❌",
                        },
                      ].map((item) => {
                        const total =
                          data.retention.activeVendors +
                          data.retention.expiringInWeek +
                          data.retention.churnedInPeriod;
                        return (
                          <div key={item.label}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-gray-700">
                                {item.icon} {item.label}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-400">
                                  {total > 0
                                    ? ((item.value / total) * 100).toFixed(0)
                                    : 0}
                                  %
                                </span>
                                <span className="text-xs font-black text-gray-900">
                                  {num(item.value)}
                                </span>
                              </div>
                            </div>
                            <MiniBar
                              value={item.value}
                              max={Math.max(total, 1)}
                              color={item.color}
                            />
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Action items
                      </p>
                      {data.retention.expiringInWeek > 0 && (
                        <div className="flex items-start gap-2 bg-orange-50 rounded-xl p-3">
                          <AlertTriangle
                            size={14}
                            className="text-orange-500 flex-shrink-0 mt-0.5"
                          />
                          <p className="text-xs text-orange-700 leading-relaxed">
                            <strong>
                              {data.retention.expiringInWeek} vendor
                              {data.retention.expiringInWeek > 1 ? "s" : ""}
                            </strong>{" "}
                            will expire this week. Send renewal reminder emails
                            to prevent churn.
                          </p>
                        </div>
                      )}
                      {data.retention.churnRate > 10 && (
                        <div className="flex items-start gap-2 bg-red-50 rounded-xl p-3">
                          <TrendingDown
                            size={14}
                            className="text-red-500 flex-shrink-0 mt-0.5"
                          />
                          <p className="text-xs text-red-700 leading-relaxed">
                            <strong>
                              {data.retention.churnRate}% churn rate
                            </strong>{" "}
                            is above target. Consider a win-back discount for
                            recently expired vendors.
                          </p>
                        </div>
                      )}
                      {data.retention.churnRate <= 10 &&
                        data.retention.expiringInWeek === 0 && (
                          <div className="flex items-start gap-2 bg-green-50 rounded-xl p-3">
                            <CheckCircle
                              size={14}
                              className="text-green-500 flex-shrink-0 mt-0.5"
                            />
                            <p className="text-xs text-green-700 leading-relaxed">
                              Vendor retention looks healthy. Keep monitoring
                              weekly.
                            </p>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Vendors by plan (retention view) */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-sm font-black text-gray-900 mb-1">
                      Plan Distribution
                    </p>
                    <p className="text-[11px] text-gray-400 mb-4">
                      Where active vendors sit today
                    </p>
                    <div className="space-y-4">
                      {data.growth.vendorsByPlan.map((v) => {
                        const total = data.growth.vendorsByPlan.reduce(
                          (s, x) => s + x.count,
                          0,
                        );
                        const share =
                          total > 0
                            ? ((v.count / total) * 100).toFixed(1)
                            : "0";
                        const isTop =
                          v.plan === "SuperSmile" || v.plan === "HappySmile";
                        return (
                          <div
                            key={v.plan}
                            className={`rounded-xl p-3 border
                            ${isTop ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-100"}`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-black text-gray-900">
                                  {v.plan}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-0.5">
                                  {share}% of active vendors
                                </p>
                              </div>
                              <p
                                className={`text-2xl font-black
                                ${isTop ? "text-yellow-600" : "text-gray-700"}`}
                              >
                                {v.count}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Upsell insight */}
                    {(() => {
                      const basic = data.growth.vendorsByPlan.find(
                        (v) => v.plan === "BasicSmile",
                      );
                      const happy = data.growth.vendorsByPlan.find(
                        (v) => v.plan === "HappySmile",
                      );
                      const total = data.growth.vendorsByPlan.reduce(
                        (s, x) => s + x.count,
                        0,
                      );
                      const lowPct =
                        basic && total > 0
                          ? ((basic.count / total) * 100).toFixed(0)
                          : null;
                      if (!lowPct) return null;
                      return (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                            💡 Upsell opportunity
                          </p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {Number(lowPct) > 40
                              ? `${lowPct}% of vendors are on BasicSmile — the lowest paid tier. An in-app upsell nudge showing HappySmile benefits could meaningfully boost revenue.`
                              : `Plan distribution looks healthy. Focus on converting free (Basic) users to any paid plan.`}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
