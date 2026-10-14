// frontend/components/admin/PromotionStatsCard.tsx
//
// Dashboard widget showing promote payment summary. Drop into the admin
// dashboard overview layout.

"use client";

import Link from "next/link";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

interface CurrencyBucket {
  revenue: number;
  count: number;
}
interface RevenueByPeriod {
  [currency: string]: CurrencyBucket;
}

interface Props {
  data?: {
    revenue: {
      today: RevenueByPeriod;
      week: RevenueByPeriod;
      month: RevenueByPeriod;
      all: RevenueByPeriod;
    };
    counts: {
      all: number;
      pending: number;
      paid: number;
      approved: number;
      rejected: number;
      expired: number;
      refunded?: number;
    };
    pendingApprovals: number;
    conversion: { submitted: number; paid: number; rate: number };
  };
  loading?: boolean;
}

const fmt = (period: RevenueByPeriod | undefined) => {
  if (!period) return [];
  return Object.entries(period)
    .filter(([, v]) => v.revenue > 0)
    .map(([cur, v]) => ({
      cur,
      label: cur === "GHS" ? "GHC" : cur === "NGN" ? "₦" : cur,
      amount: v.revenue.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      count: v.count,
    }));
};

export function PromotionStatsCard({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse h-64" />
    );
  }
  if (!data) return null;

  const today = fmt(data.revenue.today);
  const month = fmt(data.revenue.month);
  const all = fmt(data.revenue.all);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-yellow-100 rounded-xl flex items-center justify-center">
            <TrendingUp size={18} className="text-yellow-700" />
          </div>
          <div>
            <h3 className="text-base font-black text-gray-900">
              Promotion revenue
            </h3>
            <p className="text-xs text-gray-500">
              Payment activity across all plans
            </p>
          </div>
        </div>

        <Link
          href="/admin/promotions"
          className="text-xs font-black text-yellow-700 hover:underline flex items-center gap-1"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <RevenueBlock label="Today" buckets={today} />
        <RevenueBlock label="This month" buckets={month} highlight />
        <RevenueBlock label="All time" buckets={all} />
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Pending" count={data.counts.pending} tone="gray" />
          <StatusPill label="Paid" count={data.counts.paid} tone="yellow" />
          <StatusPill
            label="Approved"
            count={data.counts.approved}
            tone="green"
          />
          <StatusPill
            label="Rejected"
            count={data.counts.rejected}
            tone="red"
          />
          <StatusPill label="Expired" count={data.counts.expired} tone="gray" />
          {data.counts.refunded !== undefined && data.counts.refunded > 0 && (
            <StatusPill
              label="Refunded"
              count={data.counts.refunded}
              tone="blue"
            />
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        {data.pendingApprovals > 0 ? (
          <Link
            href="/admin/promotions?status=paid"
            className="flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            <AlertCircle size={14} />
            {data.pendingApprovals} awaiting your approval
          </Link>
        ) : (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 size={14} />
            <span className="font-bold">All paid promotions approved</span>
          </div>
        )}

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock size={11} />
          <span>{(data.conversion.rate * 100).toFixed(0)}% pay rate</span>
        </div>
      </div>
    </div>
  );
}

function RevenueBlock({
  label,
  buckets,
  highlight,
}: {
  label: string;
  buckets: ReturnType<typeof fmt>;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3 ${highlight ? "bg-yellow-50" : "bg-gray-50"}`}
    >
      <div className="text-[10px] font-black tracking-wider text-gray-500 uppercase">
        {label}
      </div>
      <div className="mt-1 space-y-0.5">
        {buckets.length === 0 ? (
          <div className="text-sm text-gray-400">—</div>
        ) : (
          buckets.map((b) => (
            <div key={b.cur} className="text-sm font-black text-gray-900">
              {b.label} {b.amount}
              <span className="text-[10px] font-bold text-gray-500 ml-1">
                ({b.count})
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatusPill({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "yellow" | "green" | "red" | "gray" | "blue";
}) {
  const cls = {
    yellow: "bg-yellow-100 text-yellow-800",
    green: "bg-green-100  text-green-800",
    red: "bg-red-100    text-red-800",
    gray: "bg-gray-100   text-gray-700",
    blue: "bg-blue-100   text-blue-800",
  }[tone];
  return (
    <div className={`px-2.5 py-1 rounded-lg text-xs font-black ${cls}`}>
      {label} <span className="ml-1">{count}</span>
    </div>
  );
}
