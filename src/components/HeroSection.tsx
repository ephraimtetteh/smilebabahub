"use client";
// src/components/HeroSection.tsx
// Replace the existing hero <div> with this component.
// Drop-in for the existing yellow hero block — keeps MarketplaceSearch + Radio
// but adds a clear "Post a Free Ad" CTA that users can't miss.

import Link from "next/link";
import { Plus, ChevronRight, Sparkles } from "lucide-react";
import { useAppSelector } from "@/src/app/redux";

// These are passed in from the parent — same as before
interface HeroProps {
  search: React.ReactNode; // <MarketplaceSearch />
  radio: React.ReactNode; // <Radio />
}

// Quick stat pills shown under the heading
const STATS = [
  { value: "5,000+", label: "active listings" },
  { value: "Ghana & Nigeria", label: "coverage" },
  { value: "Free", label: "to post" },
];

export default function HeroSection({ search, radio }: HeroProps) {
  const user = useAppSelector((s) => s.auth.user);
  const isVendor = user?.role === "vendor" || user?.role === "admin";
  const isLoggedIn = !!user;

  // CTA destination
  const ctaHref = isVendor
    ? "/ads/create" // vendors go straight to create
    : isLoggedIn
      ? "/subscribe" // logged-in guests → subscribe first
      : "/auth/login?reason=sell"; // guests → login

  const ctaLabel = isVendor ? "Post a Free Ad" : "Start Selling Free";

  return (
    <div className="relative w-full bg-[#ffd700] overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-black/10" />

      <div
        className="relative flex flex-col items-center justify-center
        px-4 sm:px-8 pt-12 sm:pt-10 lg:pt-16 pb-4 text-center"
      >
        {/* ── Headline ── */}
        <div className="max-w-3xl">
          <h1
            className="text-xl sm:text-2xl lg:text-4xl font-semibold
            text-black/80 leading-tight capitalize"
          >
            Find food, homes <br className="hidden sm:block" />
            & everything you need —
            <br className="hidden sm:block" />
            all in one place
          </h1>
        </div>

        {/* ── Stat pills ── */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 mb-2">
          {STATS.map((s) => (
            <span
              key={s.label}
              className="flex items-center gap-1.5 text-[11px] font-semibold
                bg-black/8 text-black/70 px-3 py-1 rounded-full"
            >
              <span className="font-black text-black">{s.value}</span>
              <span>{s.label}</span>
            </span>
          ))}
        </div>

        {/* ── Search + Radio ── */}
        <div className="w-full max-w-5xl mt-4 space-y-2">
          {search}
          {radio}
        </div>

        {/* ── POST AD CTA ── */}
        {/* Visually separated from search so it reads as a distinct action */}
        <div
          className="mt-6 flex flex-col sm:flex-row items-center
          justify-center gap-3 w-full max-w-lg"
        >
          {/* Primary CTA — big, black, unmissable */}
          <Link
            href={ctaHref}
            className="group flex items-center justify-center gap-2.5
              bg-black text-[#ffd700] font-black text-sm sm:text-base
              px-7 py-3.5 rounded-2xl shadow-lg shadow-black/20
              hover:bg-gray-900 active:scale-95 transition-all duration-150
              w-full sm:w-auto"
          >
            <span
              className="w-6 h-6 rounded-lg bg-[#ffd700] text-black
              flex items-center justify-center flex-shrink-0
              group-hover:scale-110 transition-transform duration-150"
            >
              <Plus size={14} strokeWidth={3} />
            </span>
            {ctaLabel}
            <ChevronRight
              size={15}
              className="opacity-60
              group-hover:translate-x-0.5 transition-transform duration-150"
            />
          </Link>

          {/* Secondary — vendor upgrade hint or browse link */}
          {isVendor ? (
            <Link
              href="/subscribe"
              className="flex items-center gap-1.5 text-xs font-semibold
                text-black/60 hover:text-black transition-colors underline
                underline-offset-2 decoration-black/30"
            >
              <Sparkles size={12} />
              Upgrade for more listings
            </Link>
          ) : (
            <Link
              href="/ads"
              className="text-xs font-semibold text-black/60 hover:text-black
                transition-colors underline underline-offset-2 decoration-black/30"
            >
              Browse listings →
            </Link>
          )}
        </div>

        {/* ── Trust note ── */}
        <p className="mt-3 mb-2 text-[10px] text-black/40 font-medium">
          Free to post · No hidden fees · Reach buyers in Ghana & Nigeria
        </p>
      </div>
    </div>
  );
}
