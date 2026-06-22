"use client";

// src/app/admin/promotions/page.tsx
//
// Admin tab for managing promo-video campaigns submitted by vendors.
//
// Reads from:
//   GET   /smilebaba/admin/promotions   — list with filters
//   PATCH /smilebaba/admin/promotions/:id  — change status, notes, schedule

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Search,
  Filter,
  Megaphone,
  Eye,
  Check,
  X,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Play,
  MessageSquare,
  ChevronDown,
  RefreshCw,
  ExternalLink,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/src/lib/api/axios";

const STATUS_META: Record<
  string,
  { label: string; color: string; emoji: string }
> = {
  pending_review: {
    label: "Under Review",
    color: "bg-yellow-100 text-yellow-800",
    emoji: "👀",
  },
  approved: {
    label: "Approved",
    color: "bg-blue-100 text-blue-800",
    emoji: "✅",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800",
    emoji: "❌",
  },
  pending_payment: {
    label: "Awaiting Payment",
    color: "bg-orange-100 text-orange-800",
    emoji: "💳",
  },
  paid: { label: "Paid", color: "bg-green-100 text-green-800", emoji: "💰" },
  scheduled: {
    label: "Scheduled",
    color: "bg-indigo-100 text-indigo-800",
    emoji: "📅",
  },
  active: { label: "Live", color: "bg-pink-100 text-pink-800", emoji: "🎬" },
  completed: {
    label: "Completed",
    color: "bg-gray-200 text-gray-800",
    emoji: "🏁",
  },
  refunded: {
    label: "Refunded",
    color: "bg-gray-100 text-gray-500",
    emoji: "↩️",
  },
};

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "pending_review", label: "Under Review" },
  { id: "approved", label: "Approved" },
  { id: "pending_payment", label: "Awaiting Pay" },
  { id: "paid", label: "Paid" },
  { id: "scheduled", label: "Scheduled" },
  { id: "active", label: "Live" },
  { id: "completed", label: "Completed" },
  { id: "rejected", label: "Rejected" },
];

interface Promotion {
  _id: string;
  title: string;
  description?: string;
  tier: "starter" | "growth" | "enterprise";
  status: keyof typeof STATUS_META;
  amount: number;
  currency: "GHS" | "NGN";
  days: number;
  videoUrl: string;
  videoName?: string;
  country: string;
  promotionType?: string;
  targetRegion?: string;
  targetAudience?: string;
  startDate?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  preferredContact?: string;
  adminNotes?: string;
  rejectionReason?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  paidAt?: string;
  user?: { _id: string; username: string; email: string };
  createdAt: string;
}

interface Summary {
  total: number;
  byStatus: Record<string, number>;
  totalRevenue: { GHS: number; NGN: number };
  pendingReviews: number;
}

export default function AdminPromotionsPage() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Promotion | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const params: any = {};
      if (filter !== "all") params.status = filter;
      if (search.trim()) params.search = search.trim();

      const { data } = await axiosInstance.get("/admin/promotions", { params });
      setPromos(data.promotions ?? []);
      setSummary(data.summary ?? null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to load campaigns");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  // Search with debounce
  useEffect(() => {
    const t = setTimeout(() => load(), 400);
    return () => clearTimeout(t);
  }, [search]);

  const refresh = () => {
    setRefreshing(true);
    load();
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-[1340px] mx-auto px-3 sm:px-4 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Megaphone size={20} className="text-yellow-700" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                Promo Campaigns
              </h1>
              <p className="text-xs text-gray-500">
                Review, approve, and schedule vendor video promos
              </p>
            </div>
          </div>
          <button
            onClick={refresh}
            className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50
              text-gray-700 text-xs font-bold px-3 py-2 rounded-xl transition"
          >
            <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />{" "}
            Refresh
          </button>
        </div>

        {/* Summary cards */}
        {summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <SummaryTile
              emoji="📊"
              label="Total campaigns"
              value={summary.total.toLocaleString()}
            />
            <SummaryTile
              emoji="👀"
              label="Need review"
              value={(summary.byStatus.pending_review ?? 0).toLocaleString()}
              highlight={(summary.byStatus.pending_review ?? 0) > 0}
            />
            <SummaryTile
              emoji="💰"
              label="Revenue (GHS)"
              value={`₵${(summary.totalRevenue.GHS ?? 0).toLocaleString()}`}
            />
            <SummaryTile
              emoji="💰"
              label="Revenue (NGN)"
              value={`₦${(summary.totalRevenue.NGN ?? 0).toLocaleString()}`}
            />
          </div>
        )}

        {/* Filter tabs */}
        <div className="bg-white border border-gray-100 rounded-2xl p-3 mb-4">
          <div
            className="flex items-center gap-2 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <Filter size={14} className="text-gray-400 flex-shrink-0" />
            {FILTER_TABS.map((t) => {
              const count =
                t.id === "all"
                  ? summary?.total
                  : (summary?.byStatus[t.id] ?? 0);
              return (
                <button
                  key={t.id}
                  onClick={() => setFilter(t.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap
                    transition flex items-center gap-1.5
                    ${
                      filter === t.id
                        ? "bg-gray-900 text-yellow-400"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {t.label}
                  {count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full
                      ${filter === t.id ? "bg-yellow-400 text-black" : "bg-white text-gray-700"}`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <div className="bg-white border border-gray-100 rounded-2xl p-3 mb-4 flex items-center gap-2">
          <Search size={14} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, vendor name, email…"
            className="flex-1 text-sm outline-none bg-transparent"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={28} className="animate-spin text-yellow-500" />
          </div>
        ) : promos.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl py-16 text-center">
            <Megaphone size={36} className="text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No campaigns in {filter}.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            {/* Desktop table */}
            <table className="hidden md:table w-full text-sm">
              <thead
                className="bg-gray-50 border-b border-gray-100 text-[11px]
                font-black text-gray-500 tracking-wider uppercase"
              >
                <tr>
                  <th className="text-left px-4 py-3">Campaign</th>
                  <th className="text-left px-4 py-3">Vendor</th>
                  <th className="text-left px-4 py-3">Tier</th>
                  <th className="text-left px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Submitted</th>
                  <th className="text-right px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {promos.map((p) => {
                  const meta = STATUS_META[p.status];
                  const sym = p.currency === "NGN" ? "₦" : "₵";
                  return (
                    <tr
                      key={p._id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-900 line-clamp-1">
                          {p.title}
                        </p>
                        <p className="text-[11px] text-gray-500">{p.country}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-900">
                          {p.user?.username ?? "—"}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {p.user?.email}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block bg-yellow-100 text-yellow-700
                          text-[10px] font-black px-2 py-0.5 rounded uppercase"
                        >
                          {p.tier}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {p.days} days
                        </p>
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-gray-900">
                        {sym}
                        {p.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`${meta.color} text-[10px] font-black px-2 py-1 rounded-full`}
                        >
                          {meta.emoji} {meta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-gray-500">
                        {new Date(p.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelected(p)}
                          className="inline-flex items-center gap-1 bg-gray-900 hover:bg-gray-800
                            text-yellow-400 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition"
                        >
                          <Eye size={11} /> Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {promos.map((p) => {
                const meta = STATUS_META[p.status];
                const sym = p.currency === "NGN" ? "₦" : "₵";
                return (
                  <button
                    key={p._id}
                    onClick={() => setSelected(p)}
                    className="w-full text-left p-4 hover:bg-gray-50 transition active:bg-gray-100"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900 line-clamp-1">
                          {p.title}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {p.user?.username ?? "—"} · {p.country}
                        </p>
                      </div>
                      <span
                        className={`${meta.color} text-[10px] font-black px-2 py-0.5
                        rounded-full whitespace-nowrap flex-shrink-0`}
                      >
                        {meta.emoji} {meta.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span
                        className="bg-yellow-100 text-yellow-700 font-black
                        px-2 py-0.5 rounded uppercase"
                      >
                        {p.tier} · {p.days}d
                      </span>
                      <span className="font-bold text-gray-900">
                        {sym}
                        {p.amount.toLocaleString()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <CampaignDetailModal
          promo={selected}
          onClose={() => setSelected(null)}
          onUpdated={() => {
            setSelected(null);
            load();
          }}
        />
      )}
    </main>
  );
}

// ─── Summary tile ───────────────────────────────────────────────────────────
function SummaryTile({
  emoji,
  label,
  value,
  highlight,
}: {
  emoji: string;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-white border rounded-2xl p-4 transition
      ${highlight ? "border-yellow-400 ring-2 ring-yellow-100" : "border-gray-100"}`}
    >
      <div className="text-2xl mb-1">{emoji}</div>
      <p className="text-xl font-black text-gray-900">{value}</p>
      <p className="text-[10px] text-gray-500 font-bold tracking-wider uppercase mt-0.5">
        {label}
      </p>
    </div>
  );
}

// ─── Detail / action modal ─────────────────────────────────────────────────
function CampaignDetailModal({
  promo,
  onClose,
  onUpdated,
}: {
  promo: Promotion;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState(promo.adminNotes ?? "");
  const [reason, setReason] = useState(promo.rejectionReason ?? "");
  const [start, setStart] = useState(promo.scheduledStart?.slice(0, 16) ?? "");
  const [end, setEnd] = useState(promo.scheduledEnd?.slice(0, 16) ?? "");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const sym = promo.currency === "NGN" ? "₦" : "₵";

  const update = async (status: string, extras: any = {}) => {
    setUpdating(true);
    try {
      await axiosInstance.patch(`/admin/promotions/${promo._id}`, {
        status,
        adminNotes: notes,
        ...extras,
      });
      toast.success(`Campaign ${status.replace("_", " ")}`);
      onUpdated();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const approve = () => update("approved");
  const reject = () => {
    if (!reason.trim()) {
      setShowRejectInput(true);
      toast.info("Please provide a rejection reason");
      return;
    }
    update("rejected", { rejectionReason: reason });
  };
  const schedule = () => {
    if (!start || !end) {
      toast.info("Please set start and end dates");
      return;
    }
    update("scheduled", { scheduledStart: start, scheduledEnd: end });
  };
  const goLive = () => update("active");
  const complete = () => update("completed");

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center
      justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl
        max-h-[95vh] overflow-y-auto"
      >
        {/* Header */}
        <div
          className="sticky top-0 bg-white border-b border-gray-100 p-4
          flex items-center justify-between z-10"
        >
          <div className="flex-1 min-w-0 pr-3">
            <p className="text-[10px] font-black text-yellow-700 tracking-wider">
              CAMPAIGN DETAILS
            </p>
            <h2 className="text-base sm:text-lg font-black text-gray-900 truncate">
              {promo.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full
              flex items-center justify-center flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Video preview */}
          <video
            src={promo.videoUrl}
            controls
            className="w-full rounded-xl bg-black aspect-video"
          />

          {/* Status pill */}
          <div className="flex items-center justify-center">
            <span
              className={`${STATUS_META[promo.status].color} text-sm font-black
              px-4 py-1.5 rounded-full`}
            >
              {STATUS_META[promo.status].emoji}{" "}
              {STATUS_META[promo.status].label}
            </span>
          </div>

          {/* Plan + amount */}
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Tier" value={promo.tier.toUpperCase()} />
            <Stat label="Duration" value={`${promo.days} days`} />
            <Stat
              label="Amount"
              value={`${sym}${promo.amount.toLocaleString()}`}
            />
          </div>

          {/* Campaign info */}
          <Section title="Campaign info">
            {promo.description && (
              <Field label="Description" value={promo.description} />
            )}
            {promo.promotionType && (
              <Field label="Type" value={promo.promotionType} />
            )}
            {promo.targetRegion && (
              <Field label="Target region" value={promo.targetRegion} />
            )}
            {promo.targetAudience && (
              <Field label="Target audience" value={promo.targetAudience} />
            )}
            {promo.startDate && (
              <Field
                label="Preferred start"
                value={new Date(promo.startDate).toLocaleDateString("en-GB", {
                  dateStyle: "long",
                })}
              />
            )}
            <Field label="Country" value={promo.country} />
          </Section>

          {/* Vendor contact */}
          <Section title="Vendor">
            <Field
              label="Name"
              value={promo.contactName ?? promo.user?.username ?? "—"}
            />
            <Field
              label="Email"
              value={promo.contactEmail ?? promo.user?.email ?? "—"}
              icon={<Mail size={12} />}
            />
            <Field
              label="Phone"
              value={promo.contactPhone ?? "—"}
              icon={<Phone size={12} />}
            />
            {promo.preferredContact && (
              <Field label="Preferred" value={promo.preferredContact} />
            )}
          </Section>

          {/* Admin notes */}
          <Section title="Admin notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Internal notes about this campaign (not visible to vendor)"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                outline-none focus:border-yellow-400"
            />
          </Section>

          {/* Reject reason */}
          {(showRejectInput || promo.status === "rejected") && (
            <Section title="Rejection reason (visible to vendor)">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                placeholder="Why was this campaign rejected?"
                className="w-full border border-red-200 rounded-xl px-3 py-2 text-sm
                  outline-none focus:border-red-400"
              />
            </Section>
          )}

          {/* Scheduling */}
          {(promo.status === "paid" || promo.status === "scheduled") && (
            <Section title="Schedule">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[11px] font-bold text-gray-700 mb-1">
                    Start
                  </p>
                  <input
                    type="datetime-local"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-2 py-1.5 text-xs
                      outline-none focus:border-yellow-400"
                  />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-700 mb-1">
                    End
                  </p>
                  <input
                    type="datetime-local"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-2 py-1.5 text-xs
                      outline-none focus:border-yellow-400"
                  />
                </div>
              </div>
            </Section>
          )}

          {/* Action buttons — adapt to current status */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-[10px] font-black text-gray-500 tracking-wider mb-2">
              ACTIONS
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {promo.status === "pending_review" && (
                <>
                  <ActionBtn
                    onClick={approve}
                    disabled={updating}
                    color="green"
                    icon={<CheckCircle2 size={14} />}
                    label="Approve"
                  />
                  <ActionBtn
                    onClick={() => setShowRejectInput(true)}
                    disabled={updating}
                    color="red"
                    icon={<XCircle size={14} />}
                    label="Reject"
                  />
                </>
              )}

              {showRejectInput &&
                promo.status === "pending_review" &&
                reason.trim() && (
                  <ActionBtn
                    onClick={reject}
                    disabled={updating}
                    color="red"
                    icon={<XCircle size={14} />}
                    label="Confirm rejection"
                  />
                )}

              {promo.status === "paid" && (
                <ActionBtn
                  onClick={schedule}
                  disabled={updating || !start || !end}
                  color="indigo"
                  icon={<Calendar size={14} />}
                  label="Schedule"
                />
              )}

              {promo.status === "scheduled" && (
                <ActionBtn
                  onClick={goLive}
                  disabled={updating}
                  color="pink"
                  icon={<Play size={14} />}
                  label="Go Live"
                />
              )}

              {promo.status === "active" && (
                <ActionBtn
                  onClick={complete}
                  disabled={updating}
                  color="gray"
                  icon={<Check size={14} />}
                  label="Mark complete"
                />
              )}

              {/* Always available — save notes */}
              <ActionBtn
                onClick={() => update(promo.status)}
                disabled={updating}
                color="yellow"
                icon={<MessageSquare size={14} />}
                label="Save notes"
              />
            </div>

            {updating && (
              <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-500">
                <Loader2 size={12} className="animate-spin" /> Updating…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Presentational helpers ────────────────────────────────────────────────
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-black text-gray-500 tracking-wider mb-2">
        {title.toUpperCase()}
      </p>
      <div className="bg-gray-50 rounded-xl p-3 space-y-2">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <p className="text-[11px] text-gray-500 font-medium">{label}</p>
      <p className="text-xs text-gray-900 font-medium text-right flex items-center gap-1">
        {icon} {value}
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center">
      <p className="text-sm font-black text-gray-900">{value}</p>
      <p className="text-[9px] text-gray-500 font-bold tracking-wider mt-0.5">
        {label.toUpperCase()}
      </p>
    </div>
  );
}

function ActionBtn({
  onClick,
  disabled,
  color,
  icon,
  label,
}: {
  onClick: () => void;
  disabled: boolean;
  color: string;
  icon: React.ReactNode;
  label: string;
}) {
  const colors: Record<string, string> = {
    green: "bg-green-500 hover:bg-green-600 text-white",
    red: "bg-red-500 hover:bg-red-600 text-white",
    indigo: "bg-indigo-500 hover:bg-indigo-600 text-white",
    pink: "bg-pink-500 hover:bg-pink-600 text-white",
    gray: "bg-gray-700 hover:bg-gray-800 text-white",
    yellow: "bg-yellow-400 hover:bg-yellow-300 text-black",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${colors[color]} font-black text-xs py-2.5 rounded-xl transition
        flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95`}
    >
      {icon} {label}
    </button>
  );
}
