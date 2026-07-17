"use client";

// src/app/promote/my/page.tsx
//
// User's dashboard of every promotion they've submitted.
// Filter chips by status, grid of cards with cover images, click through
// to the individual status page.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ChevronLeft,
  Sparkles,
  RefreshCw,
  Plus,
  Search,
  Eye,
  PlayCircle,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/src/lib/api/axios";
import type { Promotion } from "../components/types";

// ─── Filter tabs ─────────────────────────────────────────────────────
const TABS = [
  { key: "all", label: "All", matches: () => true },
  {
    key: "review",
    label: "In review",
    matches: (s: string) => ["submitted", "under_review"].includes(s),
  },
  {
    key: "action",
    label: "Needs payment",
    matches: (s: string) => s === "payment_pending",
  },
  {
    key: "live",
    label: "Live",
    matches: (s: string) => ["paid", "live"].includes(s),
  },
  {
    key: "done",
    label: "Completed",
    matches: (s: string) => ["expired"].includes(s),
  },
  {
    key: "problem",
    label: "Rejected/Refund",
    matches: (s: string) => ["rejected", "refunded"].includes(s),
  },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ─── Status badge config ─────────────────────────────────────────────
const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  submitted: { label: "Awaiting review", cls: "bg-yellow-100 text-yellow-800" },
  under_review: { label: "Under review", cls: "bg-purple-100 text-purple-800" },
  payment_pending: {
    label: "Pay to launch",
    cls: "bg-blue-100   text-blue-800",
  },
  paid: { label: "Scheduling", cls: "bg-emerald-100 text-emerald-800" },
  live: { label: "🔴 LIVE", cls: "bg-red-100    text-red-800" },
  expired: { label: "Ended", cls: "bg-gray-100   text-gray-700" },
  rejected: { label: "Not approved", cls: "bg-red-100    text-red-800" },
  refunded: { label: "Refunded", cls: "bg-orange-100 text-orange-800" },
};

export default function MyPromotionsPage() {
  const router = useRouter();
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<TabKey>("all");
  const [q, setQ] = useState("");

  const load = async () => {
    setRefreshing(true);
    try {
      const { data } = await axiosInstance.get("/promote/my");
      setPromos(data.promotions ?? []);
    } catch {
      toast.error("Failed to load your promotions");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Client-side filter
  const filtered = useMemo(() => {
    const activeTab = TABS.find((t) => t.key === tab)!;
    return promos
      .filter((p) => activeTab.matches(p.status))
      .filter(
        (p) =>
          !q.trim() ||
          p.title?.toLowerCase().includes(q.toLowerCase()) ||
          p.businessName?.toLowerCase().includes(q.toLowerCase()) ||
          p.tier?.toLowerCase().includes(q.toLowerCase()),
      );
  }, [promos, tab, q]);

  // Counts per tab (for the little badge on each chip)
  const counts = useMemo(() => {
    const c: Record<TabKey, number> = {
      all: 0,
      review: 0,
      action: 0,
      live: 0,
      done: 0,
      problem: 0,
    };
    for (const p of promos) {
      c.all++;
      for (const t of TABS)
        if (t.key !== "all" && t.matches(p.status)) c[t.key as TabKey]++;
    }
    return c;
  }, [promos]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ─── Top bar ─── */}
      <section className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 flex items-center justify-between">
          <Link
            href="/promote"
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900"
          >
            <ChevronLeft size={13} /> Back to promote
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={refreshing}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100"
            >
              <RefreshCw
                size={12}
                className={refreshing ? "animate-spin" : ""}
              />{" "}
              Refresh
            </button>
            <Link
              href="/promote/submit"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-black"
            >
              <Plus size={12} /> New campaign
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            My promotions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            All your video campaigns in one place. Track review, complete
            payment, or view live analytics.
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => {
            const active = t.key === tab;
            const n = counts[t.key];
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                  active
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                {t.label}
                <span
                  className={`px-1.5 rounded text-[10px] font-black ${
                    active
                      ? "bg-yellow-400 text-black"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {n}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, business, or plan…"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-yellow-400 outline-none bg-white"
          />
        </div>

        {/* Actionable banner */}
        {counts.action > 0 && (
          <button
            onClick={() => setTab("action")}
            className="w-full bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 flex items-center justify-between hover:bg-blue-100 transition text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard size={16} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-black text-blue-900">
                  {counts.action} campaign{counts.action === 1 ? "" : "s"}{" "}
                  approved — payment needed
                </div>
                <div className="text-xs text-blue-700">
                  Tap to complete payment and go live within 48hr
                </div>
              </div>
            </div>
            <span className="text-xs font-black text-blue-700">View →</span>
          </button>
        )}

        {/* ─── Grid ─── */}
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 size={32} className="animate-spin text-yellow-500" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            hasAny={promos.length > 0}
            onClear={() => {
              setTab("all");
              setQ("");
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <PromoCard
                key={p._id}
                promo={p}
                onClick={() => router.push(`/promote/status/${p._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// ─── Card ────────────────────────────────────────────────────────────
function PromoCard({
  promo,
  onClick,
}: {
  promo: Promotion;
  onClick: () => void;
}) {
  const badge = STATUS_BADGE[promo.status] ?? {
    label: promo.status,
    cls: "bg-gray-100 text-gray-700",
  };
  const cover = promo.coverImage || promo.thumbnailUrl;
  const sym = promo.currency === "NGN" ? "₦" : "₵";

  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition group"
    >
      {/* Cover */}
      <div className="aspect-video bg-gray-100 relative">
        {cover ? (
          <img src={cover} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            📺
          </div>
        )}
        <span
          className={`absolute top-2 left-2 ${badge.cls} text-[10px] font-black px-2 py-0.5 rounded`}
        >
          {badge.label}
        </span>
        {promo.status === "live" && promo.views !== undefined && (
          <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <Eye size={10} /> {formatViews(promo.views)}
          </span>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition">
          <PlayCircle size={40} className="text-white drop-shadow-lg" />
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="font-black text-sm text-gray-900 truncate">
          {promo.title || "Untitled campaign"}
        </div>
        <div className="text-xs text-gray-500 mt-0.5 truncate">
          {promo.businessName || promo.contactName || "—"}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] font-black text-yellow-700 bg-yellow-50 px-1.5 py-0.5 rounded capitalize">
            {promo.tier} · {promo.days}d
          </span>
          <span className="text-xs font-black text-gray-900">
            {sym}
            {promo.amount.toLocaleString()}
          </span>
        </div>

        {promo.status === "payment_pending" && (
          <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] font-black text-blue-600 flex items-center gap-1">
            <AlertCircle size={11} /> Payment required to launch
          </div>
        )}
        {promo.status === "live" && promo.expiresAt && (
          <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
            Runs until{" "}
            {new Date(promo.expiresAt).toLocaleDateString("en-GH", {
              day: "numeric",
              month: "short",
            })}
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────
function EmptyState({
  hasAny,
  onClear,
}: {
  hasAny: boolean;
  onClear: () => void;
}) {
  if (!hasAny) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-10 sm:p-14 text-center">
        <div className="text-5xl mb-3">📺</div>
        <h3 className="text-lg font-black text-gray-900 mb-2">
          No campaigns yet
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
          Promote your business across SmileBaba Radio, TV, and Social. Get
          started in under 5 minutes.
        </p>
        <Link
          href="/promote/submit"
          className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black px-5 py-3 rounded-2xl text-sm"
        >
          <Sparkles size={14} /> Launch first campaign
        </Link>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
      <div className="text-3xl mb-2">🔍</div>
      <p className="text-sm font-black text-gray-900">
        No campaigns match this filter
      </p>
      <button
        onClick={onClear}
        className="mt-3 text-xs font-black text-yellow-700 hover:underline"
      >
        Clear filters
      </button>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────
function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}
