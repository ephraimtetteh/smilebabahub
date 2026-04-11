"use client";
// src/app/admin/marketers/stats/page.tsx
// Country breakdown + registration timeline for marketers.

import { useEffect, useState } from "react";
import axiosInstance from "@/src/lib/api/axios";
import {
  Users,
  Globe,
  TrendingUp,
  Loader2,
  RefreshCw,
  Award,
  Calendar,
} from "lucide-react";

const FLAG: Record<string, string> = { Ghana: "🇬🇭", Nigeria: "🇳🇬" };

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

// ── Mini bar chart (registrations by day) ──────────────────────────────────
function RegChart({
  data,
  height = 80,
}: {
  data: { date: string; label: string; count: number }[];
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-px" style={{ height }}>
      {data.map((d, i) => {
        const pct = Math.max((d.count / max) * 100, d.count > 0 ? 5 : 1);
        const isWeekend =
          new Date(d.date).getDay() === 0 || new Date(d.date).getDay() === 6;
        return (
          <div
            key={d.date}
            className="flex-1 flex flex-col items-center group"
            title={`${d.label}: ${d.count} new`}
          >
            <div
              className={`w-full rounded-sm transition-all duration-300
                ${
                  d.count > 0
                    ? "bg-[#ffc105] group-hover:bg-amber-400"
                    : isWeekend
                      ? "bg-gray-100"
                      : "bg-gray-100"
                }`}
              style={{ height: `${pct}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────
function Card({
  label,
  value,
  sub,
  flag,
  icon,
  highlight = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  flag?: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4
      ${highlight ? "bg-[#ffc105]/10 border-[#ffc105]/30" : "bg-white border-gray-100"}`}
    >
      {flag && <span className="text-2xl block mb-1">{flag}</span>}
      {icon && !flag && (
        <div
          className="w-8 h-8 rounded-lg bg-[#ffc105]/10 text-[#ffc105]
          flex items-center justify-center mb-2"
        >
          {icon}
        </div>
      )}
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function AdminMarketerStatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [country, setCountry] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/marketers/stats");
      setStats(res.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const counts = stats?.counts ?? {};
  const regs = stats?.registrations ?? [];
  const top = stats?.topByReferrals ?? [];

  // Filter registrations by country (approximate — use all if no country field)
  const filteredRegs = country === "all" ? regs : regs; // backend returns all — country filter applied to counts only

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Marketer Stats</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Country breakdown · registration trends
          </p>
        </div>
        <button
          onClick={load}
          className="p-1.5 hover:bg-gray-100 rounded-xl transition"
        >
          <RefreshCw size={14} className="text-gray-500" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={28} className="animate-spin text-[#ffc105]" />
        </div>
      ) : (
        <>
          {/* Country breakdown */}
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              By country
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Card
                label="Total marketers"
                value={fmt(counts.total ?? 0)}
                icon={<Users size={16} />}
                highlight
              />
              <Card
                label="Ghana"
                value={fmt(counts.gh ?? 0)}
                sub={`${counts.activeGH ?? 0} active`}
                flag="🇬🇭"
              />
              <Card
                label="Nigeria"
                value={fmt(counts.ng ?? 0)}
                sub={`${counts.activeNG ?? 0} active`}
                flag="🇳🇬"
              />
              <Card
                label="Other / unset"
                value={fmt(
                  (counts.total ?? 0) - (counts.gh ?? 0) - (counts.ng ?? 0),
                )}
                flag="🌍"
              />
            </div>
          </div>

          {/* Country proportion bars */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Globe size={15} className="text-[#ffc105]" />
              Country distribution
            </h3>
            {[
              {
                label: "Ghana",
                value: counts.gh ?? 0,
                color: "bg-[#ffc105]",
                flag: "🇬🇭",
              },
              {
                label: "Nigeria",
                value: counts.ng ?? 0,
                color: "bg-green-500",
                flag: "🇳🇬",
              },
              {
                label: "Other",
                value: Math.max(
                  0,
                  (counts.total ?? 0) - (counts.gh ?? 0) - (counts.ng ?? 0),
                ),
                color: "bg-gray-300",
                flag: "🌍",
              },
            ].map((c) => {
              const pct =
                counts.total > 0
                  ? Math.round((c.value / counts.total) * 100)
                  : 0;
              return (
                <div key={c.label} className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-700 flex items-center gap-1.5">
                      <span>{c.flag}</span> {c.label}
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      {c.value} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${c.color} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* New registrations */}
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              New registrations
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                <p className="text-xs text-gray-400 mb-1 flex items-center justify-center gap-1">
                  <Calendar size={11} /> Today
                </p>
                <p className="text-3xl font-black text-gray-900">
                  {counts.newToday ?? 0}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                <p className="text-xs text-gray-400 mb-1 flex items-center justify-center gap-1">
                  <Calendar size={11} /> This week
                </p>
                <p className="text-3xl font-black text-gray-900">
                  {counts.newWeek ?? 0}
                </p>
              </div>
              <div className="bg-[#ffc105]/10 border border-[#ffc105]/30 rounded-2xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
                  <TrendingUp size={11} /> This month
                </p>
                <p className="text-3xl font-black text-gray-900">
                  {counts.newMonth ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* Registration timeline chart */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <TrendingUp size={15} className="text-[#ffc105]" />
              <h3 className="font-bold text-sm text-gray-900">
                Daily registrations — last 30 days
              </h3>
            </div>
            <div className="px-5 py-4">
              <RegChart data={filteredRegs} />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-gray-300">30 days ago</span>
                <span className="text-[10px] text-gray-300">today</span>
              </div>
            </div>
          </div>

          {/* Top performers */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <Award size={15} className="text-[#ffc105]" />
              <h3 className="font-bold text-sm text-gray-900">
                Top marketers by referrals
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {top.length === 0 ? (
                <p className="text-xs text-gray-300 px-5 py-4">No data yet</p>
              ) : (
                top.map((m: any, i: number) => (
                  <div
                    key={m._id}
                    className="px-5 py-3 flex items-center gap-3"
                  >
                    <span className="text-xs font-black text-gray-300 w-5 flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {m.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {m.email}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-gray-700">
                        {m.totalReferrals} referrals
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {FLAG[m.country] ?? "🌍"} {m.country ?? "Unknown"}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 min-w-[60px]">
                      {m.totalEarningsGHS > 0 && (
                        <p className="text-xs font-black text-[#ffc105]">
                          ₵{m.totalEarningsGHS.toLocaleString()}
                        </p>
                      )}
                      {m.totalEarningsNGN > 0 && (
                        <p className="text-xs font-black text-green-600">
                          ₦{m.totalEarningsNGN.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
