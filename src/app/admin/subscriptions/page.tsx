"use client";
// src/app/admin/subscriptions/page.tsx
// All purchases — subscription + boost — with filters, revenue summary,
// and a per-user action modal to grant/fix subscriptions.

import { useEffect, useState, useCallback } from "react";
import { useAdmin } from "@/src/hooks/useAdmin";
import axiosInstance from "@/src/lib/api/axios";
import {
  Search,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Zap,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  Sparkles,
  AlertTriangle,
  UserCheck,
  Shield,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";

// ── Types ──────────────────────────────────────────────────────────────────
interface Purchase {
  _id: string;
  user?: { _id: string; username: string; email: string; phone?: string };
  title: string;
  planId?: string;
  billingCycle?: string;
  type: "subscription" | "boost";
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  periodEnd?: string;
  txRef?: string;
}

// ── Constants ──────────────────────────────────────────────────────────────
const PLANS = ["Basic", "standard", "popular", "premium"] as const;
const PLAN_LABELS: Record<string, string> = {
  Basic: "Smile (Free)",
  standard: "BasicSmile",
  popular: "HappySmile",
  premium: "SuperSmile",
};
const PLAN_LIMITS = {
  Basic: "1 listing · 3d",
  standard: "5 listings · 30d",
  popular: "10 listings · 30d",
  premium: "Unlimited · 60d",
} as const;

const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(1)}k`
      : String(Math.round(n));

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const sym = (cur: string) => (cur === "NGN" ? "₦" : "₵");

// ── Grant subscription modal ───────────────────────────────────────────────
function GrantModal({
  purchase,
  onClose,
  onSuccess,
}: {
  purchase: Purchase;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [planId, setPlanId] = useState(purchase.planId ?? "popular");
  const [billingCycle, setBillingCycle] = useState(
    purchase.billingCycle ?? "monthly",
  );
  const [notes, setNotes] = useState(
    "Payment reflected on Flutterwave but not in DB",
  );
  const [saving, setSaving] = useState(false);

  const handleGrant = async () => {
    if (!purchase.user?._id) return;
    setSaving(true);
    try {
      await axiosInstance.patch(
        `/admin/subscriptions/${purchase.user._id}/grant`,
        { planId, billingCycle, notes },
      );
      toast.success(
        `✅ ${PLAN_LABELS[planId]} granted to ${purchase.user.username}`,
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Failed to grant subscription",
      );
    } finally {
      setSaving(false);
    }
  };

  const user = purchase.user;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center
      justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 pt-5 pb-4
          border-b border-gray-100"
        >
          <div>
            <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
              <Shield size={16} className="text-yellow-500" />
              Grant / Fix Subscription
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {user?.username} · {user?.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-gray-100 rounded-full flex items-center
              justify-center hover:bg-gray-200 transition"
          >
            <X size={13} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Warning */}
          <div
            className="bg-amber-50 border border-amber-200 rounded-xl
            px-4 py-3 flex items-start gap-2"
          >
            <AlertTriangle
              size={14}
              className="text-amber-500 flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-amber-700 leading-relaxed">
              This grants a subscription without requiring payment. Use only
              when payment was confirmed on Flutterwave but didn&apost reflect in
              the system.
            </p>
          </div>

          {/* Current purchase */}
          {purchase.planId && (
            <div className="bg-gray-50 rounded-xl px-4 py-3 text-xs">
              <p className="font-bold text-gray-600 mb-1">
                Current purchase record
              </p>
              <p className="text-gray-500">
                {purchase.title} · {sym(purchase.currency)}
                {fmt(purchase.amount)} · {purchase.status}
              </p>
              {purchase.txRef && (
                <p className="text-gray-400 mt-0.5 font-mono text-[10px]">
                  {purchase.txRef}
                </p>
              )}
            </div>
          )}

          {/* Plan picker */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Grant plan
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PLANS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlanId(p)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border
                    text-left transition
                    ${
                      planId === p
                        ? "bg-yellow-400 border-yellow-400 text-black"
                        : "bg-white border-gray-200 text-gray-700 hover:border-yellow-300"
                    }`}
                >
                  <p>{PLAN_LABELS[p]}</p>
                  <p
                    className={`text-[10px] font-normal mt-0.5
                    ${planId === p ? "text-black/60" : "text-gray-400"}`}
                  >
                    {PLAN_LIMITS[p]}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Billing cycle */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Billing cycle
            </label>
            <div className="flex gap-2">
              {["monthly", "yearly"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setBillingCycle(c)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border
                    capitalize transition
                    ${
                      billingCycle === c
                        ? "bg-gray-900 border-gray-900 text-white"
                        : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Internal notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs
                text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
              placeholder="Reason for grant…"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-700
                text-xs font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleGrant}
              disabled={saving}
              className="flex-1 py-2.5 bg-yellow-400 text-black text-xs
                font-black rounded-xl hover:bg-yellow-300 transition
                disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {saving ? (
                <>
                  <div
                    className="w-3 h-3 border border-black/30 border-t-black
                    rounded-full animate-spin"
                  />{" "}
                  Granting…
                </>
              ) : (
                <>
                  <UserCheck size={13} /> Grant subscription
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── User detail modal ──────────────────────────────────────────────────────
function UserActionModal({
  purchase,
  onClose,
  onGranted,
}: {
  purchase: Purchase;
  onClose: () => void;
  onGranted: () => void;
}) {
  const [showGrant, setShowGrant] = useState(false);

  if (showGrant) {
    return (
      <GrantModal
        purchase={purchase}
        onClose={() => setShowGrant(false)}
        onSuccess={onGranted}
      />
    );
  }

  const user = purchase.user;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center
      justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div
          className="flex items-center justify-between px-5 pt-5 pb-4
          border-b border-gray-100"
        >
          <h3 className="font-black text-gray-900 text-sm">User Actions</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-gray-100 rounded-full flex items-center
              justify-center hover:bg-gray-200 transition"
          >
            <X size={13} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {/* User info */}
          <div className="bg-gray-50 rounded-xl px-4 py-3">
            <p className="font-black text-gray-900 text-sm">
              {user?.username ?? "—"}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
            {user?.phone && (
              <p className="text-xs text-gray-400">{user.phone}</p>
            )}
          </div>

          {/* Purchase details */}
          <div className="text-xs space-y-1.5 px-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Transaction</span>
              <span className="font-semibold text-gray-800">
                {purchase.title}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount</span>
              <span className="font-semibold text-gray-800">
                {sym(purchase.currency)}
                {fmt(purchase.amount)} {purchase.currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span
                className={`font-bold ${
                  purchase.status === "successful"
                    ? "text-green-600"
                    : purchase.status === "failed"
                      ? "text-red-500"
                      : "text-yellow-600"
                }`}
              >
                {purchase.status}
              </span>
            </div>
            {purchase.txRef && (
              <div className="flex justify-between">
                <span className="text-gray-500">Ref</span>
                <span className="font-mono text-[10px] text-gray-500">
                  {purchase.txRef.slice(-16)}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => setShowGrant(true)}
              className="w-full flex items-center gap-2.5 py-3 px-4 bg-yellow-50
                border border-yellow-200 rounded-xl hover:bg-yellow-100 transition text-left"
            >
              <Shield size={14} className="text-yellow-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-900">
                  Grant / fix subscription
                </p>
                <p className="text-[10px] text-gray-400">
                  Payment on Flutterwave but not in system
                </p>
              </div>
            </button>

            <a
              href={`/admin/users?search=${user?.email}`}
              className="w-full flex items-center gap-2.5 py-3 px-4 bg-gray-50
                border border-gray-200 rounded-xl hover:bg-gray-100 transition"
            >
              <ExternalLink size={14} className="text-gray-500 flex-shrink-0" />
              <p className="text-xs font-semibold text-gray-700">
                View full user profile
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function AdminSubscriptionsPage() {
  const { data, loading, error, fetch } = useAdmin<any>("subscriptions");

  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState("");
  const [planId, setPlanId] = useState("");
  const [typeFilter, setTypeFilter] = useState(""); // "subscription"|"boost"|""
  const [statusFilter, setStatusFilter] = useState("successful");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Purchase | null>(null);

  const load = useCallback(
    (overrides: Record<string, any> = {}) => {
      fetch({
        search,
        currency,
        planId,
        page,
        limit: 20,
        type: typeFilter,
        status: statusFilter,
        ...overrides,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [search, currency, planId, page, typeFilter, statusFilter],
  );

  useEffect(() => {
    load();
  }, []);

  const purchases: Purchase[] = data?.purchases ?? [];
  const meta = data?.meta;
  const revenue: any[] = data?.revenue ?? [];

  // Export CSV
  const exportCSV = () => {
    const rows = [
      [
        "Vendor",
        "Email",
        "Title",
        "Plan",
        "Type",
        "Amount",
        "Currency",
        "Status",
        "Date",
      ],
      ...purchases.map((p) => [
        p.user?.username ?? "—",
        p.user?.email ?? "—",
        p.title,
        p.planId ?? "—",
        p.type,
        p.amount,
        p.currency,
        p.status,
        fmtDate(p.createdAt),
      ]),
    ];
    const csv = rows.map((r) => r.map(String).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `purchases-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 pb-10">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900">
            Subscriptions & Purchases
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            All payments — subscriptions, plan upgrades and ad boosts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            disabled={!purchases.length}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border
              border-gray-200 rounded-xl text-xs font-semibold text-gray-600
              hover:bg-gray-50 transition disabled:opacity-40"
          >
            <Download size={13} /> Export
          </button>
          <button
            onClick={() => load()}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-900
              rounded-xl text-xs font-semibold text-white hover:bg-gray-800 transition"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Revenue summary ── */}
      {revenue.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {revenue.map((r: any) => (
            <div
              key={r._id}
              className="bg-white border border-gray-100 rounded-2xl
              p-4 shadow-sm"
            >
              <p className="text-2xl font-black text-gray-900">
                {sym(r._id)}
                {fmt(r.total)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {r._id} · {r.count} payments
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Type filter tabs ── */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { value: "", label: "All", icon: null },
          {
            value: "subscription",
            label: "Subscriptions",
            icon: <Sparkles size={11} />,
          },
          { value: "boost", label: "Boosts", icon: <Zap size={11} /> },
        ].map((t) => (
          <button
            key={t.value}
            onClick={() => {
              setTypeFilter(t.value);
              setPage(1);
              load({ type: t.value, page: 1 });
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs
              font-bold transition
              ${
                typeFilter === t.value
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Filters row ── */}
      <div className="flex flex-wrap gap-2">
        {/* Search */}
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load({ search, page: 1 })}
            placeholder="Search vendor…"
            className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs
              focus:outline-none focus:ring-2 focus:ring-yellow-400 w-44"
          />
        </div>

        {/* Currency */}
        <select
          value={currency}
          onChange={(e) => {
            setCurrency(e.target.value);
            setPage(1);
            load({ currency: e.target.value, page: 1 });
          }}
          className="px-3 py-2 border border-gray-200 rounded-xl text-xs
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">All currencies</option>
          <option value="GHS">🇬🇭 GHS</option>
          <option value="NGN">🇳🇬 NGN</option>
        </select>

        {/* Plan (subscription only) */}
        {(typeFilter === "" || typeFilter === "subscription") && (
          <select
            value={planId}
            onChange={(e) => {
              setPlanId(e.target.value);
              setPage(1);
              load({ planId: e.target.value, page: 1 });
            }}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs
              focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">All plans</option>
            {PLANS.map((p) => (
              <option key={p} value={p}>
                {PLAN_LABELS[p]}
              </option>
            ))}
          </select>
        )}

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
            load({ status: e.target.value, page: 1 });
          }}
          className="px-3 py-2 border border-gray-200 rounded-xl text-xs
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="successful">Successful</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
          <option value="">All statuses</option>
        </select>

        {/* Apply search */}
        <button
          onClick={() => load({ search, page: 1 })}
          className="px-3 py-2 bg-gray-900 text-white text-xs font-semibold
            rounded-xl hover:bg-gray-700 transition"
        >
          Search
        </button>
      </div>

      {/* ── Table ── */}
      {loading && (
        <div className="flex justify-center py-12">
          <div
            className="w-8 h-8 border-2 border-yellow-400 border-t-transparent
            rounded-full animate-spin"
          />
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
          <p className="text-red-600 text-sm font-semibold">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {[
                    "Vendor",
                    "Plan / Ad",
                    "Type",
                    "Amount",
                    "Status",
                    "Date",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[10px] font-bold text-gray-400
                      uppercase tracking-wider px-4 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {purchases.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-12 text-gray-400 text-sm"
                    >
                      No purchases found
                    </td>
                  </tr>
                )}
                {purchases.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/60 transition">
                    {/* Vendor */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">
                        {p.user?.username ?? "—"}
                      </p>
                      <p className="text-gray-400 text-[10px]">
                        {p.user?.email}
                      </p>
                    </td>

                    {/* Plan / Ad */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 max-w-[160px] truncate">
                        {p.title}
                      </p>
                      {p.planId && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {PLAN_LIMITS[p.planId as keyof typeof PLAN_LIMITS] ??
                            p.planId}
                        </p>
                      )}
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5
                        rounded-full text-[10px] font-bold
                        ${
                          p.type === "boost"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {p.type === "boost" ? (
                          <>
                            <Zap size={9} /> Boost
                          </>
                        ) : (
                          <>
                            <Award size={9} /> Sub
                          </>
                        )}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3 font-black text-gray-900">
                      {sym(p.currency)}
                      {fmt(p.amount)}
                      <span className="text-gray-400 font-normal ml-1">
                        {p.currency}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5
                        rounded-full text-[10px] font-bold
                        ${
                          p.status === "successful"
                            ? "bg-green-100 text-green-700"
                            : p.status === "failed"
                              ? "bg-red-100 text-red-500"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {p.status === "successful" ? (
                          <CheckCircle2 size={9} />
                        ) : p.status === "failed" ? (
                          <XCircle size={9} />
                        ) : (
                          <Clock size={9} />
                        )}
                        {p.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-gray-500">
                      {fmtDate(p.createdAt)}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(p)}
                        className="px-2.5 py-1.5 bg-gray-100 text-gray-700
                          text-[10px] font-bold rounded-lg hover:bg-yellow-100
                          hover:text-yellow-700 transition"
                      >
                        Actions
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.pages > 1 && (
            <div
              className="flex items-center justify-between px-4 py-3
              border-t border-gray-100"
            >
              <p className="text-xs text-gray-400">
                {meta.total} total · page {meta.page} of {meta.pages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const p = page - 1;
                    setPage(p);
                    load({ page: p });
                  }}
                  disabled={page <= 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg
                    border border-gray-200 text-gray-500 hover:bg-gray-50
                    disabled:opacity-30 transition"
                >
                  <ChevronLeft size={13} />
                </button>
                <span className="text-xs font-semibold text-gray-700 px-2">
                  {page}
                </span>
                <button
                  onClick={() => {
                    const p = page + 1;
                    setPage(p);
                    load({ page: p });
                  }}
                  disabled={page >= meta.pages}
                  className="w-7 h-7 flex items-center justify-center rounded-lg
                    border border-gray-200 text-gray-500 hover:bg-gray-50
                    disabled:opacity-30 transition"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── User action modal ── */}
      {selected && (
        <UserActionModal
          purchase={selected}
          onClose={() => setSelected(null)}
          onGranted={() => {
            setSelected(null);
            load();
          }}
        />
      )}
    </div>
  );
}
