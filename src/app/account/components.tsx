"use client";

import Link from "next/link";
import { STATUS_LABEL } from "./types";

// ── Skeleton ──────────────────────────────────────────────────────────────
export function Skeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 sm:p-5 animate-pulse
          border border-gray-100 shadow-sm pt-10"
        >
          <div className="flex gap-3 items-center">
            <div className="w-11 h-11 bg-gray-100 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
            <div className="space-y-1.5">
              <div className="h-4 bg-gray-100 rounded w-16" />
              <div className="h-3 bg-gray-100 rounded w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────
export function Empty({ type }: { type: "orders" | "bookings" }) {
  const isOrders = type === "orders";
  return (
    <div
      className="bg-white rounded-2xl p-10 sm:p-16 text-center
      border border-gray-100 shadow-sm pt-20"
    >
      <p className="text-4xl mb-3">{isOrders ? "🛍️" : "🏡"}</p>
      <p className="text-gray-700 font-semibold text-sm mb-1">
        No {isOrders ? "orders" : "bookings"} yet
      </p>
      <p className="text-xs text-gray-400 mb-6 max-w-xs mx-auto leading-relaxed">
        {isOrders
          ? "Browse food and marketplace listings to place your first order."
          : "Browse apartments and short stays to make a booking."}
      </p>
      <Link
        href={isOrders ? "/marketPlace" : "/restate"}
        className="inline-block px-5 py-2.5 bg-yellow-400 text-black text-sm
          font-semibold rounded-xl hover:bg-yellow-300 transition active:scale-95"
      >
        {isOrders ? "Browse marketplace →" : "Browse apartments →"}
      </Link>
    </div>
  );
}

// ── Status filter pills ────────────────────────────────────────────────────
export function StatusPills({
  statuses,
  active,
  onChange,
}: {
  statuses: readonly string[];
  active: string;
  onChange: (s: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
      {statuses.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold
            transition capitalize
            ${
              active === s
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400"
            }`}
        >
          {s === "all" ? "All" : (STATUS_LABEL[s] ?? s.replace(/_/g, " "))}
        </button>
      ))}
    </div>
  );
}

// ── Error banner ───────────────────────────────────────────────────────────
export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      className="bg-red-50 border border-red-200 rounded-2xl p-5
      text-red-600 text-sm text-center"
    >
      {message}
    </div>
  );
}

// ── Upgrade CTA ────────────────────────────────────────────────────────────
export function UpgradeCTA() {
  return (
    <div
      className="mt-8 bg-gradient-to-r from-yellow-400/10 to-yellow-400/5
      border border-yellow-400/20 rounded-2xl p-5 text-center"
    >
      <p className="text-sm font-semibold text-gray-700 mb-1">
        Want to sell on SmileBaba?
      </p>
      <p className="text-xs text-gray-500 mb-4 max-w-xs mx-auto leading-relaxed">
        Subscribe to a vendor plan and start listing your products, food, or
        properties.
      </p>
      <Link
        href="/subscribe"
        className="inline-block px-5 py-2.5 bg-yellow-400 text-black text-xs
          font-bold rounded-xl hover:bg-yellow-300 transition active:scale-95"
      >
        Become a vendor →
      </Link>
    </div>
  );
}

// ── Page shell — consistent header + back link ─────────────────────────────
export function PageShell({
  title,
  subtitle,
  backHref = "/",
  backLabel = "← Back",
  children,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 pt-20">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href={backHref}
            className="text-xs text-gray-400 hover:text-gray-600 transition mb-3 inline-block"
          >
            {backLabel}
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
