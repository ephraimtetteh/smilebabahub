// frontend/components/promote/AdminStatsPanel.tsx
//
// Admin-only stats panel rendered at the top of the public /promote page.
// Renders nothing if viewer is not admin. Self-fetches its own data.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Activity, Eye, EyeOff } from "lucide-react";
import axiosInstance from "@/src/lib/api/axios";
import { useAppSelector } from "@/src/app/redux";


interface OverviewStats {
  revenue: {
    today: Record<string, { revenue: number; count: number }>;
    week: Record<string, { revenue: number; count: number }>;
    month: Record<string, { revenue: number; count: number }>;
    all: Record<string, { revenue: number; count: number }>;
  };
  counts: {
    all: number;
    pending: number;
    paid: number;
    approved: number;
    rejected: number;
    expired: number;
  };
  pendingApprovals: number;
  conversion: { submitted: number; paid: number; rate: number };
}

export function AdminStatsPanel() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);
  const { user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (user?.role !== "admin") {
      setLoading(false);
      return;
    }
    axiosInstance
      .get<OverviewStats>("/promote/admin-stats")
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [user?.role]);

  if (user?.role !== "admin") return null;
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 mt-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-32" />
      </div>
    );
  }
  if (!stats) return null;

  const fmtBucket = (b: OverviewStats["revenue"]["today"]) =>
    Object.entries(b)
      .filter(([, v]) => v.revenue > 0)
      .map(([cur, v]) => ({
        sym: cur === "NGN" ? "₦" : "GHC",
        amount: v.revenue.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        }),
        count: v.count,
      }));

  const today = fmtBucket(stats.revenue.today);
  const week = fmtBucket(stats.revenue.week);
  const month = fmtBucket(stats.revenue.month);
  const all = fmtBucket(stats.revenue.all);

  return (
    <div className="mx-auto max-w-7xl px-6 mt-6">
      <div className="bg-gray-900 text-white rounded-2xl p-6 border-2 border-yellow-400 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
              <Activity size={18} className="text-gray-900" />
            </div>
            <div>
              <div className="text-[10px] font-black tracking-widest text-yellow-400">
                ADMIN VIEW
              </div>
              <div className="font-black">Promotion payment overview</div>
            </div>
          </div>
          <button
            onClick={() => setHidden((h) => !h)}
            className="text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1.5"
          >
            {hidden ? (
              <>
                <Eye size={13} /> Show
              </>
            ) : (
              <>
                <EyeOff size={13} /> Hide
              </>
            )}
          </button>
        </div>

        {!hidden && (
          <>
            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              <RevenuePill label="Today" buckets={today} />
              <RevenuePill label="Last 7 days" buckets={week} />
              <RevenuePill label="This month" buckets={month} highlight />
              <RevenuePill label="All time" buckets={all} />
            </div>

            <div className="mt-5 pt-5 border-t border-white/10">
              <div className="text-[10px] font-black tracking-wider text-gray-400 mb-2">
                STATUS BREAKDOWN
              </div>
              <div className="flex flex-wrap gap-2">
                <CountChip
                  label="Pending"
                  count={stats.counts.pending}
                  tone="gray"
                />
                <CountChip
                  label="Paid"
                  count={stats.counts.paid}
                  tone="yellow"
                />
                <CountChip
                  label="Approved"
                  count={stats.counts.approved}
                  tone="green"
                />
                <CountChip
                  label="Rejected"
                  count={stats.counts.rejected}
                  tone="red"
                />
                <CountChip
                  label="Expired"
                  count={stats.counts.expired}
                  tone="gray"
                />
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              {stats.pendingApprovals > 0 ? (
                <Link
                  href="/admin/promotions?status=paid"
                  className="flex items-center gap-2 px-3 py-2 bg-orange-500/20 border border-orange-500 rounded-xl hover:bg-orange-500/30 transition"
                >
                  <AlertCircle size={14} className="text-orange-400" />
                  <span className="text-sm font-black text-orange-200">
                    {stats.pendingApprovals} awaiting approval
                  </span>
                </Link>
              ) : (
                <div className="text-sm text-green-400 font-bold flex items-center gap-2">
                  ✓ All paid promotions approved
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="text-xs text-gray-300">
                  <span className="text-gray-500">Conversion:</span>{" "}
                  <span className="font-black text-yellow-400">
                    {(stats.conversion.rate * 100).toFixed(0)}%
                  </span>
                </div>
                <Link
                  href="/admin/promotions"
                  className="text-xs font-black text-yellow-400 hover:underline flex items-center gap-1"
                >
                  Manage all <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function RevenuePill({
  label,
  buckets,
  highlight,
}: {
  label: string;
  buckets: { sym: string; amount: string; count: number }[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3 ${highlight ? "bg-yellow-400/10 border border-yellow-400/30" : "bg-white/5"}`}
    >
      <div className="text-[10px] font-black tracking-wider text-gray-400 uppercase">
        {label}
      </div>
      <div className="mt-1.5 space-y-0.5">
        {buckets.length === 0 ? (
          <div className="text-sm text-gray-500">—</div>
        ) : (
          buckets.map((b, i) => (
            <div key={i} className="text-sm font-black text-white">
              <span className={highlight ? "text-yellow-400" : ""}>
                {b.sym}
              </span>{" "}
              {b.amount}
              <span className="text-[10px] font-bold text-gray-400 ml-1">
                ({b.count})
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function CountChip({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "yellow" | "green" | "red" | "gray";
}) {
  const cls = {
    yellow: "bg-yellow-400/15 text-yellow-300 border-yellow-400/30",
    green: "bg-green-500/15  text-green-300  border-green-500/30",
    red: "bg-red-500/15    text-red-300    border-red-500/30",
    gray: "bg-white/10      text-gray-300   border-white/20",
  }[tone];
  return (
    <div className={`px-3 py-1.5 rounded-lg text-xs font-black border ${cls}`}>
      {label} <span className="ml-1">{count}</span>
    </div>
  );
}
