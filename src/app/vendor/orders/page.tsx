"use client";

// src/app/vendor/orders/page.tsx
// Vendor order summary — shows all their ads as "orders" with real status,
// price, contact clicks, views, and quick actions.
// Uses Lucide icons throughout (no react-icons).

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  Pause,
  Play,
  Zap,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ShoppingBag,
  Clock,
  DollarSign,
  Phone,
  Package,
  AlertCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";


import { useAds } from "@/src/hooks/useAds";
import { Ad } from "@/src/types/ad.types";
import { formatAdPrice, formatDate } from "../../ads/(components)/ad.constants";
import ProtectedRoute from "@/src/components/ProtectRoute";


// ── Status config ──────────────────────────────────────────────────────────
type StatusConfig = { label: string; cls: string; icon: React.ReactNode };

function getStatus(ad: Ad): StatusConfig {
  if (ad.isSold)
    return {
      label: "Sold",
      cls: "bg-green-100 text-green-700 border-green-200",
      icon: <CheckCircle size={12} />,
    };
  if (ad.isPaused)
    return {
      label: "Paused",
      cls: "bg-gray-100 text-gray-500 border-gray-200",
      icon: <Pause size={12} />,
    };
  if ((ad as any).isExpired)
    return {
      label: "Expired",
      cls: "bg-red-100 text-red-500 border-red-200",
      icon: <XCircle size={12} />,
    };
  if (ad.moderation?.status === "rejected")
    return {
      label: "Rejected",
      cls: "bg-red-100 text-red-600 border-red-200",
      icon: <AlertCircle size={12} />,
    };
  if (ad.moderation?.status === "pending")
    return {
      label: "In Review",
      cls: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: <Clock size={12} />,
    };
  if (ad.isActive)
    return {
      label: "Active",
      cls: "bg-blue-100 text-blue-700 border-blue-200",
      icon: <TrendingUp size={12} />,
    };
  return {
    label: "Inactive",
    cls: "bg-gray-100 text-gray-400 border-gray-200",
    icon: <AlertCircle size={12} />,
  };
}

const STATUS_TABS = [
  { id: "all", label: "All", icon: <Package size={14} /> },
  { id: "active", label: "Active", icon: <TrendingUp size={14} /> },
  { id: "pending", label: "In Review", icon: <Clock size={14} /> },
  { id: "paused", label: "Paused", icon: <Pause size={14} /> },
  { id: "sold", label: "Sold", icon: <CheckCircle size={14} /> },
  { id: "expired", label: "Expired", icon: <XCircle size={14} /> },
] as const;

type StatusTabId = (typeof STATUS_TABS)[number]["id"];

// ── Summary stat card ──────────────────────────────────────────────────────
function SummaryCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center
        flex-shrink-0 ${color}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 truncate">{label}</p>
        <p className="text-xl font-black text-gray-900 leading-tight">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Single order row ───────────────────────────────────────────────────────
function OrderRow({
  ad,
  mutating,
  onDelete,
  onPause,
  onMarkSold,
}: {
  ad: Ad;
  mutating: boolean;
  onDelete: () => void;
  onPause: () => void;
  onMarkSold: () => void;
}) {
  const [showActions, setShowActions] = useState(false);
  const status = getStatus(ad);
  const cover = ad.coverImage ?? ad.images?.[0]?.url ?? "";

  return (
    <div
      className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center
      gap-4 py-3.5 px-4 border-b border-gray-100 hover:bg-gray-50/50
      transition-colors text-sm"
    >
      {/* Ad info */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="relative w-10 h-10 rounded-xl overflow-hidden
          bg-gray-100 flex-shrink-0"
        >
          {cover ? (
            <Image
              src={cover}
              alt={ad.title}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center
              text-base"
            >
              🖼️
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate text-sm">
            {ad.title}
          </p>
          <p className="text-[11px] text-gray-400 font-mono mt-0.5">
            #{ad._id.slice(-8).toUpperCase()}
          </p>
        </div>
      </div>

      {/* Date */}
      <p className="text-xs text-gray-500 tabular-nums">
        {formatDate(ad.createdAt)}
      </p>

      {/* Price */}
      <p className="font-bold text-gray-900 text-sm">
        {formatAdPrice(ad.price?.amount, ad.price?.currency, ad.price?.display)}
      </p>

      {/* Engagement */}
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-[11px] text-gray-400">
          <Eye size={11} /> {ad.views ?? 0}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-gray-400">
          <Phone size={11} /> {ad.contactClicks ?? 0}
        </span>
      </div>

      {/* Status */}
      <span
        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold
        px-2.5 py-1 rounded-full border w-fit ${status.cls}`}
      >
        {status.icon}
        {status.label}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1.5 justify-end">
        <Link
          href={`/product/${ad._id}`}
          className="w-7 h-7 flex items-center justify-center rounded-lg
            bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600
            transition"
          title="View"
        >
          <Eye size={13} />
        </Link>

        <Link
          href={`/ads/${ad._id}/edit`}
          className="w-7 h-7 flex items-center justify-center rounded-lg
            bg-gray-100 text-gray-500 hover:bg-yellow-50 hover:text-yellow-600
            transition"
          title="Edit"
        >
          <Pencil size={13} />
        </Link>

        {!ad.isSold && (
          <button
            onClick={onPause}
            disabled={mutating}
            className="w-7 h-7 flex items-center justify-center rounded-lg
              bg-gray-100 text-gray-500 hover:bg-gray-200 transition
              disabled:opacity-40"
            title={ad.isPaused ? "Resume" : "Pause"}
          >
            {ad.isPaused ? <Play size={13} /> : <Pause size={13} />}
          </button>
        )}

        {!ad.isSold && (
          <button
            onClick={onMarkSold}
            disabled={mutating}
            className="w-7 h-7 flex items-center justify-center rounded-lg
              bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600
              transition disabled:opacity-40"
            title="Mark sold"
          >
            <CheckCircle size={13} />
          </button>
        )}

        <button
          onClick={onDelete}
          disabled={mutating}
          className="w-7 h-7 flex items-center justify-center rounded-lg
            bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500
            transition disabled:opacity-40"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ── Skeleton row ───────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div
      className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center
      gap-4 py-3.5 px-4 border-b border-gray-100 animate-pulse"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 bg-gray-100 rounded w-2/3" />
          <div className="h-2.5 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
      <div className="h-3 bg-gray-100 rounded w-20" />
      <div className="h-4 bg-gray-100 rounded w-16" />
      <div className="h-8 bg-gray-100 rounded w-12" />
      <div className="h-6 bg-gray-100 rounded-full w-20" />
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-7 h-7 bg-gray-100 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
function OrderSummaryInner() {
  const [activeTab, setActiveTab] = useState<StatusTabId>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const {
    myAds,
    myAdsLoading,
    myAdsError,
    myAdsStats,
    myAdsMeta,
    loadMyAds,
    submitTogglePause,
    submitMarkSold,
    submitDeleteAd,
    mutating,
  } = useAds();

  useEffect(() => {
    loadMyAds({
      status: activeTab === "all" ? undefined : activeTab,
      page,
      limit: LIMIT,
    } as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page]);

  const handleTabChange = (tab: StatusTabId) => {
    setActiveTab(tab);
    setPage(1);
    setSearch("");
  };

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this ad permanently?")) return;
      await submitDeleteAd(id);
      toast.success("Ad deleted");
    },
    [submitDeleteAd],
  );

  const handlePause = useCallback(
    async (id: string) => {
      await submitTogglePause(id);
      toast.success("Ad updated");
    },
    [submitTogglePause],
  );

  const handleMarkSold = useCallback(
    async (id: string) => {
      await submitMarkSold(id);
      toast.success("Marked as sold ");
    },
    [submitMarkSold],
  );

  const filtered = myAds.filter((ad) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      ad.title?.toLowerCase().includes(q) ||
      ad._id.toLowerCase().includes(q) ||
      ad.category?.main?.toLowerCase().includes(q)
    );
  });

  const totalPages = myAdsMeta?.totalPages ?? 1;

  // Total revenue from sold ads
  const totalRevenue = myAds
    .filter((a) => a.isSold)
    .reduce((sum, a) => sum + (a.price?.amount ?? 0), 0);
  const revCurrency = myAds[0]?.price?.currency ?? "GHS";

  return (
    <div
      className="bg-gray-50 min-h-screen flex flex-col gap-5
      py-5 px-4 sm:px-6 lg:px-8"
    >
      {/* ── Page header ── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center
        sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#ffc105]" />
            Order Summary
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Track all your listings, views, and contacts
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2
              text-gray-400 pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders…"
              className="pl-8 pr-4 py-2 border border-gray-200 rounded-xl text-sm
                text-gray-700 bg-white focus:outline-none focus:ring-2
                focus:ring-yellow-400 w-48"
            />
          </div>

          {/* Refresh */}
          <button
            onClick={() =>
              loadMyAds({
                status: activeTab === "all" ? undefined : activeTab,
                page,
              } as any)
            }
            className="w-9 h-9 flex items-center justify-center bg-white
              border border-gray-200 rounded-xl text-gray-500
              hover:bg-gray-50 transition"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* ── Stats strip ── */}
      {myAdsStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryCard
            icon={<TrendingUp size={18} className="text-blue-600" />}
            label="Active listings"
            value={myAdsStats.activeCount}
            color="bg-blue-50"
          />
          <SummaryCard
            icon={<CheckCircle size={18} className="text-green-600" />}
            label="Sold"
            value={myAdsStats.soldCount}
            sub={
              totalRevenue > 0
                ? `${revCurrency === "NGN" ? "₦" : "₵"}${totalRevenue.toLocaleString()} earned`
                : undefined
            }
            color="bg-green-50"
          />
          <SummaryCard
            icon={<Eye size={18} className="text-purple-600" />}
            label="Total views"
            value={myAdsStats.totalViews}
            color="bg-purple-50"
          />
          <SummaryCard
            icon={<Pause size={18} className="text-gray-500" />}
            label="Paused"
            value={myAdsStats.pausedCount}
            color="bg-gray-50"
          />
        </div>
      )}

      {/* ── Status tabs ── */}
      <div
        className="flex gap-1.5 bg-white border border-gray-100 shadow-sm
        rounded-2xl p-1 overflow-x-auto scrollbar-none"
      >
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2
              rounded-xl text-xs font-semibold transition whitespace-nowrap
              ${
                activeTab === tab.id
                  ? "bg-[#ffc105] text-black"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div
        className="bg-white rounded-2xl border border-gray-100 shadow-sm
        overflow-hidden"
      >
        {/* Table header */}
        <div
          className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4
          py-3 px-4 bg-gray-50 border-b border-gray-100"
        >
          {[
            "Ad / Order",
            "Date",
            "Price",
            "Engagement",
            "Status",
            "Actions",
          ].map((h) => (
            <p
              key={h}
              className={`text-xs font-semibold text-gray-500 uppercase
              tracking-wide ${h === "Actions" ? "text-right" : ""}`}
            >
              {h}
            </p>
          ))}
        </div>

        {/* Error */}
        {myAdsError && !myAdsLoading && (
          <div className="flex items-center gap-2 text-red-600 text-sm p-6">
            <AlertCircle size={16} />
            {myAdsError}
          </div>
        )}

        {/* Loading skeletons */}
        {myAdsLoading &&
          Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

        {/* Empty */}
        {!myAdsLoading && filtered.length === 0 && (
          <div className="py-16 text-center">
            <Package size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-600 font-medium text-sm">
              {search
                ? `No results for "${search}"`
                : activeTab === "all"
                  ? "No orders yet"
                  : `No ${activeTab} orders`}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {search ? "Try a different keyword" : "Post an ad to get started"}
            </p>
          </div>
        )}

        {/* Rows */}
        {!myAdsLoading &&
          filtered.map((ad) => (
            <OrderRow
              key={ad._id}
              ad={ad}
              mutating={mutating}
              onDelete={() => handleDelete(ad._id)}
              onPause={() => handlePause(ad._id)}
              onMarkSold={() => handleMarkSold(ad._id)}
            />
          ))}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Page {page} of {totalPages}
            {myAdsMeta?.total ? ` · ${myAdsMeta.total} total` : ""}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-xl
                border border-gray-200 bg-white text-gray-500 disabled:opacity-40
                hover:bg-gray-50 transition"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, page - 2) + i;
              if (p > totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-xl
                    text-xs font-semibold transition
                    ${
                      p === page
                        ? "bg-[#ffc105] text-black"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-xl
                border border-gray-200 bg-white text-gray-500 disabled:opacity-40
                hover:bg-gray-50 transition"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderSummaryPage() {
  return (
    <ProtectedRoute requiredRole="vendor">
      <OrderSummaryInner />
    </ProtectedRoute>
  );
}
