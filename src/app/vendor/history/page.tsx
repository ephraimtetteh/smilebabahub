"use client";

// src/app/vendor/purchase-history/page.tsx

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Receipt,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import axiosInstance from "@/src/lib/api/axios";
import { useResumeAction } from "@/src/hooks/useResumeAction";
import { useAppSelector } from "@/src/app/redux";

// ── Types ──────────────────────────────────────────────────────────────────
type Purchase = {
  _id: string;
  title: string;
  planId: string;
  billingCycle: string;
  amount: number;
  currency: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  txRef: string;
};

// ── Helpers ────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysLeft(iso: string) {
  return Math.max(
    0,
    Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000),
  );
}

function formatAmount(amount: number, currency: string) {
  const sym =
    currency === "NGN" ? "₦" : currency === "GHS" ? "₵" : currency + " ";
  return `${sym}${Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const PLAN_ICONS: Record<string, string> = {
  Basic: "🟢",
  standard: "🔵",
  popular: "🟡",
  premium: "⭐",
};

// ── Skeleton card ──────────────────────────────────────────────────────────
function PurchaseSkeleton() {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5
      animate-pulse flex gap-4"
    >
      <div className="w-11 h-11 bg-gray-100 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="h-4 bg-gray-100 rounded w-20" />
        <div className="h-6 bg-gray-100 rounded-full w-24" />
      </div>
    </div>
  );
}

// ── Status badge ───────────────────────────────────────────────────────────
function StatusBadge({ remaining }: { remaining: number }) {
  if (remaining === 0) {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs font-semibold
        px-2.5 py-1 rounded-full bg-gray-100 text-gray-500"
      >
        <XCircle size={11} /> Expired
      </span>
    );
  }
  if (remaining <= 3) {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs font-semibold
        px-2.5 py-1 rounded-full bg-red-100 text-red-600"
      >
        <AlertCircle size={11} />
        {remaining === 1 ? "Expires tomorrow" : `${remaining} days left`}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold
      px-2.5 py-1 rounded-full bg-green-100 text-green-600"
    >
      <CheckCircle2 size={11} /> {remaining} days left
    </span>
  );
}

// ── Single purchase card ───────────────────────────────────────────────────
function PurchaseCard({ p }: { p: Purchase }) {
  const remaining = daysLeft(p.periodEnd);
  const isActive = remaining > 0;
  const planIcon = PLAN_ICONS[p.planId] ?? "🧾";

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm p-4 sm:p-5
      transition-shadow hover:shadow-md
      ${isActive ? "border-gray-100" : "border-gray-100 opacity-75"}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center
          text-xl flex-shrink-0
          ${isActive ? "bg-amber-50 border border-amber-100" : "bg-gray-50 border border-gray-100"}`}
        >
          {planIcon}
        </div>

        {/* Middle */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{p.title}</p>
          <p className="text-xs text-gray-400 mt-0.5 capitalize">
            {p.billingCycle} billing
          </p>

          {/* Date range */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1.5">
            <Calendar size={11} />
            <span>{formatDate(p.periodStart)}</span>
            <ChevronRight size={11} />
            <span>{formatDate(p.periodEnd)}</span>
          </div>

          {/* Tx ref */}
          <p className="text-[10px] text-gray-300 mt-1 font-mono truncate">
            Ref: {p.txRef}
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <p className="text-sm font-black text-gray-900">
            {formatAmount(p.amount, p.currency)}
          </p>
          <StatusBadge remaining={remaining} />
        </div>
      </div>
    </div>
  );
}

// ── Summary strip ──────────────────────────────────────────────────────────
function SummaryStrip({
  purchases,
  currency,
}: {
  purchases: Purchase[];
  currency: string;
}) {
  const totalSpent = purchases.reduce((s, p) => s + p.amount, 0);
  const active = purchases.filter((p) => daysLeft(p.periodEnd) > 0).length;
  const sym = currency === "NGN" ? "₦" : "₵";

  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      {[
        {
          icon: <Receipt size={16} className="text-blue-600" />,
          label: "Total purchases",
          value: purchases.length,
          bg: "bg-blue-50",
        },
        {
          icon: <CheckCircle2 size={16} className="text-green-600" />,
          label: "Active plans",
          value: active,
          bg: "bg-green-50",
        },
        {
          icon: <CreditCard size={16} className="text-yellow-600" />,
          label: "Total spent",
          value: `${sym}${totalSpent.toLocaleString()}`,
          bg: "bg-yellow-50",
        },
      ].map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-2xl border border-gray-100
          shadow-sm p-3 flex flex-col gap-1"
        >
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.bg}`}
          >
            {s.icon}
          </div>
          <p className="text-xs text-gray-400 leading-none mt-1">{s.label}</p>
          <p className="text-sm font-black text-gray-900">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = useAppSelector((s) => s.auth.user);
  const currency = user?.currency ?? "GHS";
  const sym = currency === "NGN" ? "₦" : "₵";

  // Resume any pending action after subscription payment
  useResumeAction();

  const fetchHistory = () => {
    setLoading(true);
    setError(null);
    axiosInstance
      .get("/payments/history")
      .then((res) => setPurchases(res.data.purchases ?? []))
      .catch(() =>
        setError("Failed to load purchase history. Please try again."),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Current active subscription (most recent active purchase)
  const activePlan = purchases.find((p) => daysLeft(p.periodEnd) > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Receipt size={22} className="text-[#ffc105]" />
              Purchase History
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              All your SmileBaba subscription payments
            </p>
          </div>

          <button
            onClick={fetchHistory}
            disabled={loading}
            className="w-9 h-9 flex items-center justify-center bg-white
              border border-gray-200 rounded-xl text-gray-500
              hover:bg-gray-50 transition disabled:opacity-40"
            title="Refresh"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* ── Active plan banner ── */}
        {activePlan && !loading && (
          <div
            className="bg-gradient-to-r from-amber-50 to-yellow-50 border
            border-yellow-200 rounded-2xl p-4 mb-5 flex items-center
            justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl bg-[#ffc105] flex items-center
                justify-center text-xl"
              >
                {PLAN_ICONS[activePlan.planId] ?? "⭐"}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-yellow-600" />
                  {activePlan.title}
                </p>
                <p className="text-xs text-gray-500">
                  Active · expires {formatDate(activePlan.periodEnd)} (
                  {daysLeft(activePlan.periodEnd)} days left)
                </p>
              </div>
            </div>
            <Link
              href="/subscribe?renew=1"
              className="flex-shrink-0 flex items-center gap-1 text-xs
                font-bold text-yellow-700 hover:underline"
            >
              Renew <ExternalLink size={11} />
            </Link>
          </div>
        )}

        {/* ── Summary strip ── */}
        {!loading && purchases.length > 0 && (
          <SummaryStrip purchases={purchases} currency={currency} />
        )}

        {/* ── Loading skeletons ── */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <PurchaseSkeleton key={i} />
            ))}
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div
            className="bg-red-50 border border-red-200 rounded-2xl p-5
            flex items-start gap-3"
          >
            <AlertCircle
              size={18}
              className="text-red-500 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm font-semibold text-red-700">
                Something went wrong
              </p>
              <p className="text-sm text-red-600 mt-0.5">{error}</p>
              <button
                onClick={fetchHistory}
                className="mt-3 text-xs font-bold text-red-600 underline
                  hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && purchases.length === 0 && (
          <div
            className="bg-white rounded-2xl p-10 text-center shadow-sm
            border border-gray-100"
          >
            <div
              className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center
              justify-center text-3xl mx-auto mb-4"
            >
              🧾
            </div>
            <p className="text-gray-800 font-bold text-base">
              No purchases yet
            </p>
            <p className="text-sm text-gray-400 mt-1 mb-5">
              Subscribe to a plan to start selling on SmileBaba
            </p>
            <Link
              href="/subscribe"
              className="inline-flex items-center gap-2 px-6 py-2.5
                bg-[#ffc105] text-black font-bold rounded-xl
                hover:bg-amber-400 transition text-sm"
            >
              <Sparkles size={14} />
              View plans
            </Link>
          </div>
        )}

        {/* ── Purchase list ── */}
        {!loading && purchases.length > 0 && (
          <div className="space-y-3">
            {purchases.map((p) => (
              <PurchaseCard key={p._id} p={p} />
            ))}
          </div>
        )}

        {/* ── Bottom CTA ── */}
        {!loading && purchases.length > 0 && (
          <div
            className="mt-6 flex flex-col sm:flex-row items-center
            justify-center gap-3"
          >
            <Link
              href="/subscribe"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ffc105]
                text-black font-bold rounded-xl hover:bg-amber-400
                transition text-sm"
            >
              <Sparkles size={14} />
              Upgrade or renew plan
            </Link>
            <Link
              href="/ads/my"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white
                border border-gray-200 text-gray-700 font-medium rounded-xl
                hover:bg-gray-50 transition text-sm"
            >
              My ads <ChevronRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
