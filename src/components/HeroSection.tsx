"use client";
// src/components/HeroSection.tsx
// Hero section with category pills displayed ABOVE the search bar.
// Categories are scrollable, rounded-full, responsive.
// CTA button is prominent below.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, ChevronRight, Search } from "lucide-react";
import { useAppSelector } from "@/src/app/redux";

// ── Category pills shown above the search bar ─────────────────────────────
const HERO_CATEGORIES = [
  { id: "all", label: "All", icon: "✨", href: "/ads" },
  {
    id: "marketplace",
    label: "Shop",
    icon: "🛍️",
    href: "/ads?category=marketplace",
  },
  { id: "food", label: "Food", icon: "🍔", href: "/food" },
  { id: "apartments", label: "Property", icon: "🏢", href: "/restate" },
  {
    id: "fashion",
    label: "Fashion",
    icon: "👗",
    href: "/ads?category=fashion",
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    icon: "💊",
    href: "/ads?category=pharmacy",
  },
  {
    id: "delivery",
    label: "Delivery",
    icon: "🚚",
    href: "/ads?category=delivery",
  },
  {
    id: "services",
    label: "Services",
    icon: "🔧",
    href: "/ads?category=services",
  },
];

interface HeroProps {
  search?: React.ReactNode; // <MarketplaceSearch /> — optional, renders inline search if absent
  radio?: React.ReactNode; // <Radio />
}

export default function HeroSection({ search, radio }: HeroProps) {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const isVendor = user?.role === "vendor" || user?.role === "admin";
  const isLoggedIn = !!user;
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");

  const ctaHref = isVendor
    ? "/ads/create"
    : isLoggedIn
      ? "/subscription"
      : "/auth/login?reason=sell";

  const ctaLabel = isVendor ? "Post a Free Ad" : "Start Selling Free";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim())
      router.push(`/ads?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="relative w-full bg-[#ffd700] overflow-hidden">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.055] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div
        className="relative flex flex-col items-center px-4 sm:px-6
        pt-10 sm:pt-12 pb-5 text-center"
      >
        {/* ── Headline ── */}
        {/* <h1
          className="max-w-2xl text-xl sm:text-2xl lg:text-[2.4rem]
          font-bold text-black/85 leading-tight tracking-tight"
        >
          Find food, homes &amp; everything
          <br className="hidden sm:block" /> you need — all in one place
        </h1> */}

        {/* ── Category pills — above the search bar ── */}
        <div className="w-full max-w-4xl mt-5 mb-4">
          <div
            className="flex items-center gap-2 overflow-x-auto
            scrollbar-none pb-1 justify-start sm:justify-center
            px-0.5"
          >
            {HERO_CATEGORIES.map((c) => {
              const isActive = active === c.id;
              return (
                <Link
                  key={c.id}
                  href={c.href}
                  onClick={() => setActive(c.id)}
                  className={[
                    "flex items-center gap-1.5 px-4 py-1.5 rounded-full",
                    "text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0",
                    "transition-all duration-150 active:scale-95",
                    isActive
                      ? "bg-black text-[#ffd700] shadow-md"
                      : "bg-white/70 text-black/80 hover:bg-white border border-black/10",
                  ].join(" ")}
                >
                  <span className="text-sm leading-none">{c.icon}</span>
                  {c.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Search bar — shown if no external search component provided ── */}
        {search ? (
          <div className="w-full max-w-2xl space-y-2">
            {search}
            {radio}
          </div>
        ) : (
          <form onSubmit={handleSearch} className="w-full max-w-2xl flex gap-2">
            <div className="flex-1 relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search listings, food, properties…"
                className="w-full pl-10 pr-4 py-3 text-sm bg-white/80
                  border border-black/10 rounded-full shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-black/20
                  focus:bg-white placeholder-black/40 font-medium transition"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-black text-[#ffd700] text-sm font-bold
                rounded-full hover:bg-gray-900 active:scale-95 transition-all
                shadow-md shadow-black/20 flex-shrink-0"
            >
              Search
            </button>
          </form>
        )}

        {/* ── Post Ad CTA ── */}
        <div
          className="mt-5 flex flex-col sm:flex-row items-center
          justify-center gap-3 w-full max-w-md"
        >
          <Link
            href={ctaHref}
            className="group flex items-center justify-center gap-2
              bg-black text-[#ffd700] font-black text-sm
              px-7 py-3 rounded-full shadow-lg shadow-black/25
              hover:bg-gray-900 active:scale-95 transition-all duration-150
              w-full sm:w-auto"
          >
            <span
              className="w-5 h-5 rounded-full bg-[#ffd700] text-black
                flex items-center justify-center flex-shrink-0
                group-hover:scale-110 transition-transform"
            >
              <Plus size={12} strokeWidth={3} />
            </span>
            {ctaLabel}
            <ChevronRight
              size={14}
              className="opacity-50 group-hover:translate-x-0.5 transition-transform"
            />
          </Link>

          {isVendor ? (
            <Link
              href="/subscription"
              className="text-[11px] font-semibold text-black/55
                hover:text-black transition-colors underline
                underline-offset-2 decoration-black/25"
            >
              Upgrade for more listings
            </Link>
          ) : (
            <Link
              href="/ads"
              className="text-[11px] font-semibold text-black/55
                hover:text-black transition-colors"
            >
              Browse listings →
            </Link>
          )}
        </div>

        {/* ── Trust strip ── */}
        <p className="mt-3 mb-1 text-[10px] text-black/40 font-medium tracking-wide">
          Free to post · No hidden fees · Ghana 🇬🇭 & Nigeria 🇳🇬
        </p>
      </div>
    </div>
  );
}
