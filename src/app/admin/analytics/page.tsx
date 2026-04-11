"use client";
// src/app/admin/analytics/page.tsx
// Weekly / Monthly analytics with period switcher and multi-series charts.

import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/src/lib/api/axios";
import { useViewCountry } from "@/src/hooks/useViewCountry";
import {
  BarChart2,
  TrendingUp,
  Users,
  Megaphone,
  Globe,
  Loader2,
  RefreshCw,
  Download,
} from "lucide-react";

type Period = "daily" | "weekly" | "monthly";
type DataPoint = {
  key: string;
  label: string;
  views: number;
  newUsers: number;
  marketers: number;
  revenueGHS: number;
  revenueNGN: number;
};

const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(1)}k`
      : String(n);

// ── SVG bar chart ─────────────────────────────────────────────────────────
function BarChart({
  data,
  valueKey,
  color = "#ffc105",
  height = 180,
}: {
  data: DataPoint[];
  valueKey: keyof DataPoint;
  color?: string;
  height?: number;
}) {
  if (!data.length)
    return (
      <div
        className="flex items-center justify-center text-xs text-gray-300"
        style={{ height }}
      >
        No data
      </div>
    );

  const values = data.map((d) => Number(d[valueKey]));
  const max = Math.max(...values, 1);
  const barW = Math.max(4, Math.floor(480 / data.length) - 2);

  return (
    <div className="overflow-x-auto">
      <svg
        width={Math.max(480, data.length * (barW + 2))}
        height={height + 24}
        className="block"
      >
        {data.map((d, i) => {
          const v = Number(d[valueKey]);
          const bh = Math.max((v / max) * height, v > 0 ? 3 : 0);
          const x = i * (barW + 2);
          const y = height - bh;
          const isLast = i === data.length - 1;
          return (
            <g key={d.key}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={bh}
                fill={isLast ? color : color + "80"}
                rx={2}
                className="transition-all duration-500 hover:opacity-100"
              >
                <title>
                  {d.label}: {fmt(v)}
                </title>
              </rect>
              {/* X label — show every nth label to avoid clutter */}
              {(i % Math.max(1, Math.floor(data.length / 8)) === 0 ||
                isLast) && (
                <text
                  x={x + barW / 2}
                  y={height + 16}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#9ca3af"
                >
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Line sparkline ─────────────────────────────────────────────────────────
function LineChart({
  data,
  valueKey,
  color = "#ffc105",
  height = 120,
}: {
  data: DataPoint[];
  valueKey: keyof DataPoint;
  color?: string;
  height?: number;
}) {
  const values = data.map((d) => Number(d[valueKey]));
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = max - min || 1;
  const W = 480;

  if (!data.length) return null;

  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * W;
      const y = height - 4 - ((v - min) / range) * (height - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient
          id={`lg-${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity=".2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${pts} ${W},${height}`}
        fill={`url(#lg-${color.replace("#", "")})`}
      />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Stat tile ──────────────────────────────────────────────────────────────
function Tile({
  label,
  value,
  sub,
  icon,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 flex items-start gap-3
      ${accent ? "bg-[#ffc105]/10 border-[#ffc105]/30" : "bg-white border-gray-100"}`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
        ${accent ? "bg-[#ffc105] text-black" : "bg-[#ffc105]/10 text-[#ffc105]"}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-xl font-black text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function AdminAnalyticsPage() {
  const { currency } = useViewCountry();
  const [period, setPeriod] = useState<Period>("weekly");
  const [country, setCountry] = useState<string>("all");
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<keyof DataPoint>("views");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ period });
      if (country !== "all") params.set("country", country);
      const res = await axiosInstance.get(`/admin/analytics/period?${params}`);
      setData(res.data.data ?? []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [period, country]);

  useEffect(() => {
    load();
  }, [load]);

  // Totals
  const totals = data.reduce(
    (acc, d) => ({
      views: acc.views + d.views,
      newUsers: acc.newUsers + d.newUsers,
      marketers: acc.marketers + d.marketers,
      revenueGHS: acc.revenueGHS + d.revenueGHS,
      revenueNGN: acc.revenueNGN + d.revenueNGN,
    }),
    { views: 0, newUsers: 0, marketers: 0, revenueGHS: 0, revenueNGN: 0 },
  );

  const periodLabel =
    period === "daily"
      ? "30 days"
      : period === "weekly"
        ? "12 weeks"
        : "12 months";

  const SERIES: { key: keyof DataPoint; label: string; color: string }[] = [
    { key: "views", label: "Page views", color: "#ffc105" },
    { key: "newUsers", label: "New users", color: "#3b82f6" },
    { key: "marketers", label: "New marketers", color: "#8b5cf6" },
    {
      key: currency === "NGN" ? "revenueNGN" : "revenueGHS",
      label: `Revenue (${currency})`,
      color: "#10b981",
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Trends over {periodLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Country */}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="text-xs border border-gray-200 rounded-xl px-3 py-1.5
              bg-white focus:outline-none focus:ring-2 focus:ring-[#ffc105]"
          >
            <option value="all">All countries</option>
            <option value="Ghana">🇬🇭 Ghana</option>
            <option value="Nigeria">🇳🇬 Nigeria</option>
          </select>
          {/* Period */}
          <div className="flex border border-gray-200 rounded-xl overflow-hidden">
            {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-semibold capitalize transition
                  ${
                    period === p
                      ? "bg-[#ffc105] text-black"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={load}
            className="p-1.5 hover:bg-gray-100 rounded-xl transition"
          >
            <RefreshCw size={14} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Tile
          label={`Views (${periodLabel})`}
          value={fmt(totals.views)}
          icon={<BarChart2 size={17} />}
        />
        <Tile
          label="New users"
          value={fmt(totals.newUsers)}
          icon={<Users size={17} />}
        />
        <Tile
          label="New marketers"
          value={fmt(totals.marketers)}
          icon={<Megaphone size={17} />}
        />
        <Tile
          label={`Revenue (${currency})`}
          value={
            currency === "NGN"
              ? `₦${fmt(totals.revenueNGN)}`
              : `₵${fmt(totals.revenueGHS)}`
          }
          icon={<TrendingUp size={17} />}
          accent
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={28} className="animate-spin text-[#ffc105]" />
        </div>
      ) : (
        <>
          {/* Series selector + main chart */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div
              className="px-5 py-4 border-b border-gray-50 flex flex-wrap
              items-center gap-2"
            >
              <BarChart2 size={15} className="text-[#ffc105]" />
              <h3 className="font-bold text-sm text-gray-900">Trend chart</h3>
              <div className="ml-auto flex gap-1.5 flex-wrap">
                {SERIES.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSeries(s.key)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition
                      ${
                        series === s.key
                          ? "text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    style={series === s.key ? { background: s.color } : {}}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-5 py-4">
              <BarChart
                data={data}
                valueKey={series}
                color={SERIES.find((s) => s.key === series)?.color ?? "#ffc105"}
              />
            </div>
          </div>

          {/* Side-by-side line charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {SERIES.filter((s) => s.key !== series).map((s) => (
              <div
                key={s.key}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <div className="px-5 py-3 border-b border-gray-50 flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: s.color }}
                  />
                  <h4 className="text-sm font-bold text-gray-900">{s.label}</h4>
                  <span className="ml-auto text-xs font-black text-gray-700">
                    {s.key === "revenueGHS"
                      ? `₵${fmt(totals.revenueGHS)}`
                      : s.key === "revenueNGN"
                        ? `₦${fmt(totals.revenueNGN)}`
                        : fmt(
                            totals[
                              s.key as "views" | "newUsers" | "marketers"
                            ] ?? 0,
                          )}
                  </span>
                </div>
                <div className="px-5 py-3">
                  <LineChart
                    data={data}
                    valueKey={s.key}
                    color={s.color}
                    height={100}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Data table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h3 className="font-bold text-sm text-gray-900">Raw data</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Period",
                      "Views",
                      "New Users",
                      "Marketers",
                      "Revenue (GHS)",
                      "Revenue (NGN)",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left font-bold text-gray-500 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[...data].reverse().map((d) => (
                    <tr key={d.key} className="hover:bg-gray-50/50">
                      <td className="px-4 py-2 font-medium text-gray-700">
                        {d.label}
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {d.views.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {d.newUsers.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {d.marketers.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        ₵{d.revenueGHS.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        ₦{d.revenueNGN.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
