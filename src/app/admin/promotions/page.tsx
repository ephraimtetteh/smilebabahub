// frontend/app/admin/promotions/page.tsx
//
// Admin promotions management. Shows the new video/business promotion
// workflow: submitted → under_review → payment_pending → paid → live → expired
// (with reject/refund side-branches)

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  MoreVertical,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Play,
  Eye,
  Check,
  X,
  DollarSign,
  Clock,
  Plus,
} from "lucide-react";

import axiosInstance from "@/src/lib/api/axios"; 

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "submitted", label: "New" },
  { key: "under_review", label: "Under review" },
  { key: "payment_pending", label: "Payment pending" },
  { key: "paid", label: "Paid" },
  { key: "live", label: "Live" },
  { key: "expired", label: "Expired" },
  { key: "rejected", label: "Rejected" },
] as const;

type StatusKey = (typeof STATUS_TABS)[number]["key"];

interface Promotion {
  _id: string;
  status: string;
  tier: string;
  amount: number;
  currency: string;
  country: string;
  days: number;
  businessName: string;
  category?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  paymentRef?: string;
  paidAt?: string;
  liveAt?: string;
  expiresAt?: string;
  createdAt: string;
  userId?: { username: string; email: string };
}

interface ListRes {
  counts: Record<string, number>;
  promotions: Promotion[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export default function AdminPromotionsPage() {
  const [status, setStatus] = useState<StatusKey>("all");
  const [country, setCountry] = useState<"" | "Ghana" | "Nigeria">("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ListRes | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const s = sp.get("status") as StatusKey;
    if (s && STATUS_TABS.some((t) => t.key === s)) setStatus(s);
  }, []);

  const fetchData = useCallback(async () => {
    setRefreshing(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (status !== "all") params.set("status", status);
      if (country) params.set("country", country);
      if (search.trim()) params.set("search", search.trim());

      const res = await axiosInstance.get<ListRes>(
        `/admin/promotions?${params}`,
      );
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [status, country, search, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => {
    setPage(1);
  }, [status, country, search]);

  const handleAction = async (id: string, action: string) => {
    let reason = "",
      notes = "";
    if (action === "reject" || action === "refund") {
      reason = window.prompt(`Reason for ${action}?`) ?? "";
      if (!reason) {
        return;
      }
    }
    if (action === "send_payment_link") {
      notes = window.prompt("Notes for the advertiser (optional):") ?? "";
    }
    setActionId(id);
    try {
      await axiosInstance.patch(`/admin/promotions/${id}`, {
        action,
        reason,
        notes,
      });
      await fetchData();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Action failed");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Promotions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review video submissions, send payment links, mark campaigns live.
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-bold text-gray-700"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />{" "}
          Refresh
        </button>

        <Link
          href="/admin/promotions/new"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-black"
        >
          <Plus size={14} /> New promotion
        </Link>
      </div>

      {/* Status chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const active = status === tab.key;
          const count = data?.counts?.[tab.key] ?? 0;
          return (
            <button
              key={tab.key}
              onClick={() => setStatus(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 transition ${
                active
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                  active
                    ? "bg-yellow-400 text-gray-900"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Country + search */}
      <div className="mt-4 flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {[
            { v: "", label: "All countries" },
            { v: "Ghana", label: "🇬🇭 Ghana" },
            { v: "Nigeria", label: "🇳🇬 Nigeria" },
          ].map((c) => (
            <button
              key={c.v}
              onClick={() => setCountry(c.v as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black ${
                country === c.v
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex-1 max-w-md relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search business, title, payment ref..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-yellow-400 outline-none"
          />
        </div>
      </div>

      {/* Review banner */}
      {(data?.counts?.submitted ?? 0) + (data?.counts?.paid ?? 0) > 0 && (
        <div className="mt-4 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-orange-600 flex-shrink-0" />
            <div className="flex-1 text-sm">
              {(data?.counts?.submitted ?? 0) > 0 && (
                <button
                  onClick={() => setStatus("submitted")}
                  className="font-black text-orange-900 hover:underline mr-3"
                >
                  {data!.counts.submitted} new to review
                </button>
              )}
              {(data?.counts?.paid ?? 0) > 0 && (
                <button
                  onClick={() => setStatus("paid")}
                  className="font-black text-orange-900 hover:underline"
                >
                  {data!.counts.paid} paid, ready to go live
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">Loading…</div>
        ) : !data?.promotions.length ? (
          <div className="p-12 text-center">
            <div className="text-3xl">📭</div>
            <div className="mt-3 font-black text-gray-700">
              No promotions found
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <Th>BUSINESS</Th>
                  <Th>TIER</Th>
                  <Th>AMOUNT</Th>
                  <Th>STATUS</Th>
                  <Th>CREATED</Th>
                  <Th align="right">ACTIONS</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.promotions.map((p) => (
                  <PromoRow
                    key={p._id}
                    promo={p}
                    onAction={handleAction}
                    actionLoading={actionId === p._id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && data.pagination.pages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Page {data.pagination.page} of {data.pagination.pages} ·{" "}
              {data.pagination.total} total
            </div>
            <div className="flex gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-8 h-8 rounded-lg border border-gray-200 disabled:opacity-30 flex items-center justify-center hover:bg-gray-50"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={page === data.pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className="w-8 h-8 rounded-lg border border-gray-200 disabled:opacity-30 flex items-center justify-center hover:bg-gray-50"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Th({
  children,
  align,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-3 text-[10px] font-black tracking-wider text-gray-500 text-${align ?? "left"}`}
    >
      {children}
    </th>
  );
}

function PromoRow({
  promo,
  onAction,
  actionLoading,
}: {
  promo: Promotion;
  onAction: (id: string, action: string) => void;
  actionLoading: boolean;
}) {
  const sym = promo.currency === "NGN" ? "₦" : "GHC";
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <Link
          href={`/admin/promotions/${promo._id}`}
          className="flex items-center gap-3 group"
        >
          {promo.thumbnailUrl ? (
            <div className="relative">
              <img
                src={promo.thumbnailUrl}
                alt=""
                className="w-14 h-10 rounded-lg object-cover"
              />
              <Play
                size={12}
                className="absolute inset-0 m-auto text-white drop-shadow"
                fill="currentColor"
              />
            </div>
          ) : (
            <div className="w-14 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Play size={12} className="text-gray-500" />
            </div>
          )}
          <div>
            <div
              className="text-sm font-black text-gray-900 group-hover:text-yellow-700 truncate"
              style={{ maxWidth: 200 }}
            >
              {promo.businessName}
            </div>
            <div
              className="text-[10px] text-gray-500 mt-0.5 truncate"
              style={{ maxWidth: 200 }}
            >
              {promo.title || promo.category || "—"}
            </div>
          </div>
        </Link>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs font-black text-gray-700 capitalize">
          {promo.tier}
        </span>
        <div className="text-[10px] text-gray-500">{promo.days} days</div>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm font-black text-gray-900">
          {sym} {promo.amount.toLocaleString()}
        </span>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={promo.status} />
      </td>
      <td className="px-4 py-3">
        <span className="text-xs text-gray-600">
          {new Date(promo.createdAt).toLocaleDateString()}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <ActionMenu promo={promo} onAction={onAction} loading={actionLoading} />
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    submitted: { label: "New", cls: "bg-blue-100    text-blue-800" },
    under_review: { label: "Reviewing", cls: "bg-purple-100  text-purple-800" },
    payment_pending: {
      label: "Awaiting payment",
      cls: "bg-yellow-100 text-yellow-800",
    },
    paid: { label: "Paid", cls: "bg-emerald-100 text-emerald-800" },
    live: { label: "Live", cls: "bg-green-100   text-green-800" },
    expired: { label: "Expired", cls: "bg-gray-100    text-gray-500" },
    rejected: { label: "Rejected", cls: "bg-red-100     text-red-800" },
    refunded: { label: "Refunded", cls: "bg-orange-100  text-orange-800" },
  };
  const c = cfg[status] ?? { label: status, cls: "bg-gray-100 text-gray-700" };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${c.cls}`}>
      {c.label}
    </span>
  );
}

function ActionMenu({ promo, onAction, loading }: any) {
  const [open, setOpen] = useState(false);

  const options: {
    label: string;
    action: string;
    icon: React.ReactNode;
    danger?: boolean;
  }[] = [];
  if (promo.status === "submitted") {
    options.push({
      label: "Start review",
      action: "start_review",
      icon: <Eye size={13} />,
    });
    options.push({
      label: "Send payment link",
      action: "send_payment_link",
      icon: <DollarSign size={13} />,
    });
    options.push({
      label: "Reject",
      action: "reject",
      icon: <X size={13} />,
      danger: true,
    });
  } else if (promo.status === "under_review") {
    options.push({
      label: "Send payment link",
      action: "send_payment_link",
      icon: <DollarSign size={13} />,
    });
    options.push({
      label: "Reject",
      action: "reject",
      icon: <X size={13} />,
      danger: true,
    });
  } else if (promo.status === "paid") {
    options.push({
      label: "Mark live now",
      action: "mark_live",
      icon: <Check size={13} />,
    });
    options.push({
      label: "Refund",
      action: "refund",
      icon: <DollarSign size={13} />,
    });
  } else if (promo.status === "live") {
    options.push({
      label: "Expire now",
      action: "expire",
      icon: <Clock size={13} />,
    });
    options.push({
      label: "Refund",
      action: "refund",
      icon: <DollarSign size={13} />,
    });
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center"
      >
        <MoreVertical size={14} />
      </button>
      {open && (
        <>
          <button
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl border border-gray-200 shadow-lg z-20 py-1">
            {options.length === 0 && (
              <div className="px-3 py-2 text-xs text-gray-400">
                No actions available
              </div>
            )}
            {options.map((o) => (
              <button
                key={o.action}
                onClick={() => {
                  setOpen(false);
                  onAction(promo._id, o.action);
                }}
                className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center gap-2 hover:bg-gray-50 ${
                  o.danger ? "text-red-600" : "text-gray-700"
                }`}
              >
                {o.icon} {o.label}
              </button>
            ))}
            <Link
              href={`/admin/promotions/${promo._id}`}
              className="block px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-t border-gray-100"
            >
              View details →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
