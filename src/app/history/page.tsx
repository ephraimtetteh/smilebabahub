"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/src/lib/api/axios";
import { useResumeAction } from "@/src/hooks/useResumeAction";
import { useAppSelector } from "../redux";

// ── Types ──────────────────────────────────────────────────────────────────
type PurchaseType = "subscription" | "order" | "booking";

type Purchase = {
  _id: string;
  type: PurchaseType;
  // Subscription fields
  title?: string;
  planId?: string;
  billingCycle?: string;
  periodStart?: string;
  periodEnd?: string;
  // Order fields
  items?: { name: string; qty: number; price: number }[];
  vendor?: string;
  deliveryAddress?: string;
  // Booking fields
  propertyName?: string;
  propertyType?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  // Shared
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  txRef?: string;
};

type TabType = "all" | "subscriptions" | "orders" | "bookings";

// ── Helpers ────────────────────────────────────────────────────────────────
const CURRENCY_SYMBOLS: Record<string, string> = { GHS: "₵", NGN: "₦" };

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

function nights(a: string, b: string) {
  return Math.max(
    1,
    Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000),
  );
}

const STATUS_STYLE: Record<string, string> = {
  active: "bg-green-100 text-green-600",
  expiring: "bg-orange-100 text-orange-600",
  expired: "bg-gray-100 text-gray-500",
  delivered: "bg-green-100 text-green-600",
  confirmed: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-500",
  checked_out: "bg-gray-100 text-gray-500",
  checked_in: "bg-green-100 text-green-600",
};

const TYPE_CONFIG: Record<
  PurchaseType,
  { icon: string; bg: string; label: string }
> = {
  subscription: {
    icon: "⭐",
    bg: "bg-amber-50 border-amber-100",
    label: "Subscription",
  },
  order: { icon: "🛍️", bg: "bg-orange-50 border-orange-100", label: "Order" },
  booking: { icon: "🏡", bg: "bg-blue-50 border-blue-100", label: "Booking" },
};

// ── Skeleton ──────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 sm:p-5 animate-pulse
          border border-gray-100 shadow-sm"
        >
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
            <div className="space-y-1.5 text-right">
              <div className="h-4 bg-gray-100 rounded w-16" />
              <div className="h-3 bg-gray-100 rounded w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Purchase card ──────────────────────────────────────────────────────────
function PurchaseCard({ p, sym }: { p: Purchase; sym: string }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = TYPE_CONFIG[p.type];

  // Derive display values per type
  const title = (() => {
    if (p.type === "subscription") return p.title ?? "Subscription";
    if (p.type === "order")
      return `${p.items?.length ?? 0} item${p.items?.length !== 1 ? "s" : ""} · ${p.vendor ?? ""}`;
    if (p.type === "booking") return p.propertyName ?? "Booking";
    return "Purchase";
  })();

  const subtitle = (() => {
    if (p.type === "subscription" && p.billingCycle)
      return `${p.billingCycle} billing`;
    if (p.type === "order" && p.vendor) return p.vendor;
    if (p.type === "booking" && p.checkIn && p.checkOut)
      return `${formatDate(p.checkIn)} → ${formatDate(p.checkOut)} · ${nights(p.checkIn, p.checkOut)} nights`;
    return "";
  })();

  const statusLabel = (() => {
    if (p.type === "subscription" && p.periodEnd) {
      const rem = daysLeft(p.periodEnd);
      if (rem === 0) return { label: "Expired", key: "expired" };
      if (rem <= 3) return { label: `${rem}d left`, key: "expiring" };
      if (rem === 1) return { label: "Expires tomorrow", key: "expiring" };
      return { label: `${rem} days left`, key: "active" };
    }
    return { label: p.status?.replace(/_/g, " ") ?? "—", key: p.status ?? "" };
  })();

  const hasExpand = p.type === "order" && (p.items?.length ?? 0) > 0;

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden
      hover:shadow-md transition-shadow"
    >
      {/* Main row */}
      <div
        className={`flex items-start gap-3 sm:gap-4 p-4 sm:p-5
          ${hasExpand ? "cursor-pointer hover:bg-gray-50/60 transition" : ""}`}
        onClick={() => hasExpand && setExpanded(!expanded)}
      >
        {/* Type icon */}
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center
          text-lg flex-shrink-0 ${cfg.bg}`}
        >
          {cfg.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {title}
            </p>
            <span
              className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5
              rounded-full font-medium flex-shrink-0 mt-0.5"
            >
              {cfg.label}
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5 capitalize truncate">
              {subtitle}
            </p>
          )}
          <p className="text-xs text-gray-300 mt-0.5">
            {formatDate(p.createdAt)}
          </p>
        </div>

        {/* Amount + status */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <p className="text-sm font-bold text-gray-900">
            {sym}
            {Number(p.amount).toLocaleString()}
          </p>
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize
            ${STATUS_STYLE[statusLabel.key] ?? "bg-gray-100 text-gray-500"}`}
          >
            {statusLabel.label}
          </span>
          {hasExpand && (
            <span
              className={`text-gray-300 text-xs transition-transform duration-200
              ${expanded ? "rotate-180" : ""}`}
            >
              ▾
            </span>
          )}
        </div>
      </div>

      {/* Expanded: order items */}
      {expanded && p.type === "order" && p.items && (
        <div className="border-t border-gray-100 px-4 sm:px-5 py-4 bg-gray-50/50">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
            Items
          </p>
          <div className="space-y-2">
            {p.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between text-xs text-gray-600"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-md bg-gray-200 text-gray-500 text-[10px]
                    font-bold flex items-center justify-center flex-shrink-0"
                  >
                    {item.qty}
                  </span>
                  {item.name}
                </div>
                <span className="font-semibold">
                  {sym}
                  {(item.price * item.qty).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          {p.deliveryAddress && (
            <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-200">
              📍 {p.deliveryAddress}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
const TABS: { id: TabType; label: string; icon: string }[] = [
  { id: "all", label: "All", icon: "📋" },
  { id: "subscriptions", label: "Subscriptions", icon: "⭐" },
  { id: "orders", label: "Orders", icon: "🛍️" },
  { id: "bookings", label: "Bookings", icon: "🏡" },
];

export default function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabType>("all");

  const userCurrency = useAppSelector((state) => state.auth.user?.currency);
  const sym = CURRENCY_SYMBOLS[userCurrency ?? "GHS"] ?? "₵";

  useResumeAction();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all three purchase types in parallel
        const [subRes, orderRes, bookingRes] = await Promise.allSettled([
          axiosInstance.get("/payments/history"),
          axiosInstance.get("/orders/my"),
          axiosInstance.get("/bookings/my"),
        ]);

        const all: Purchase[] = [];

        if (subRes.status === "fulfilled") {
          const subs: Purchase[] = (subRes.value.data.purchases ?? []).map(
            (p: Purchase) => ({ ...p, type: "subscription" as const }),
          );
          all.push(...subs);
        }

        if (orderRes.status === "fulfilled") {
          const orders: Purchase[] = (orderRes.value.data.orders ?? []).map(
            (o: Purchase) => ({
              ...o,
              type: "order" as const,
              amount: o.amount,
            }),
          );
          all.push(...orders);
        }

        if (bookingRes.status === "fulfilled") {
          const bookings: Purchase[] = (
            bookingRes.value.data.bookings ?? []
          ).map((b: Purchase) => ({
            ...b,
            type: "booking" as const,
            amount: b.amount,
          }));
          all.push(...bookings);
        }

        // Sort by most recent first
        all.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setPurchases(all);
      } catch {
        setError("Failed to load history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const filtered =
    tab === "all"
      ? purchases
      : purchases.filter((p) => {
          if (tab === "subscriptions") return p.type === "subscription";
          if (tab === "orders") return p.type === "order";
          if (tab === "bookings") return p.type === "booking";
          return true;
        });

  // Count per type for tab badges
  const counts = {
    all: purchases.length,
    subscriptions: purchases.filter((p) => p.type === "subscription").length,
    orders: purchases.filter((p) => p.type === "order").length,
    bookings: purchases.filter((p) => p.type === "booking").length,
  };

  // Total spent
  const totalSpent = purchases.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Purchase History
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            All your orders, bookings and subscriptions in one place
          </p>
        </div>

        {/* Summary strip */}
        {!loading && purchases.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Total purchases", value: purchases.length },
              { label: "Orders", value: counts.orders },
              {
                label: "Total spent",
                value: `${sym}${totalSpent.toLocaleString()}`,
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white border border-gray-100 shadow-sm rounded-2xl p-3 text-center"
              >
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div
          className="flex bg-white border border-gray-100 shadow-sm rounded-2xl p-1 mb-5
          overflow-x-auto scrollbar-none gap-1"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl
                text-xs font-semibold transition whitespace-nowrap
                ${
                  tab === t.id
                    ? "bg-[#ffc105] text-black shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <span>{t.icon}</span>
              {t.label}
              {!loading && counts[t.id] > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
                  ${tab === t.id ? "bg-black/10 text-black" : "bg-gray-100 text-gray-500"}`}
                >
                  {counts[t.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && <Skeleton />}

        {/* Error */}
        {!loading && error && (
          <div
            className="bg-red-50 border border-red-200 rounded-2xl p-5
            text-red-600 text-sm text-center"
          >
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div
            className="bg-white rounded-2xl p-10 sm:p-16 text-center
            border border-gray-100 shadow-sm"
          >
            <p className="text-4xl mb-3">
              {tab === "subscriptions"
                ? "⭐"
                : tab === "orders"
                  ? "🛍️"
                  : tab === "bookings"
                    ? "🏡"
                    : "🧾"}
            </p>
            <p className="text-gray-600 font-medium text-sm mb-1">
              No {tab === "all" ? "purchases" : tab} yet
            </p>
            <p className="text-xs text-gray-400 mb-6 max-w-xs mx-auto leading-relaxed">
              {tab === "subscriptions" || tab === "all"
                ? "Subscribe to a plan to start selling on SmileBaba."
                : tab === "orders"
                  ? "Browse the marketplace to place your first order."
                  : "Browse apartments to make your first booking."}
            </p>
            <Link
              href={
                tab === "bookings"
                  ? "/restate"
                  : tab === "orders"
                    ? "/marketPlace"
                    : "/subscribe"
              }
              className="inline-block px-6 py-2.5 bg-[#ffc105] text-black font-bold
                rounded-xl hover:bg-amber-400 transition text-sm"
            >
              {tab === "bookings"
                ? "Browse apartments"
                : tab === "orders"
                  ? "Browse marketplace"
                  : "View plans"}{" "}
              →
            </Link>
          </div>
        )}

        {/* List */}
        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((p) => (
              <PurchaseCard key={p._id} p={p} sym={sym} />
            ))}
          </div>
        )}

        {/* Footer CTA */}
        {!loading && purchases.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/subscribe"
              className="px-6 py-2.5 bg-[#ffc105] text-black font-bold rounded-xl
                hover:bg-amber-400 transition text-sm text-center"
            >
              Upgrade or renew plan →
            </Link>
            <Link
              href="/marketPlace"
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700
                font-medium rounded-xl hover:bg-gray-50 transition text-sm text-center"
            >
              Continue shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
