// src/components/Hero.tsx
// Hero section with prominent "Post an Ad" CTA so vendors can find it easily.
// Drop-in replacement for the existing hero div in your homepage/layout.

"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/app/redux";
import { PlusCircle, ChevronRight } from "lucide-react";
import Radio from "@/src/components/Radio";
import MarketplaceSearch from "./NewSearch";
import Link from "next/link";
import HeroSection from "./HeroSection";

export default function Hero() {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  const handlePostAd = () => {
    if (!user) {
      router.push("/auth/login?reason=sell&returnUrl=/sell");
    } else if (user.role === "guest") {
      router.push("/subscribe?returnUrl=/sell");
    } else {
      router.push("/sell");
    }
  };

  return (
    <div className="relative w-full bg-[#ffd700]">
      <div
        className="flex flex-col items-center justify-center
        px-4 sm:px-8 pt-16 sm:pt-10 lg:pt-18 pb-8 text-center"
      >
        {/* Headline */}
        {/* <div className="max-w-3xl">
          <h3
            className="text-xl sm:text-2xl lg:text-4xl font-semibold
            text-black/80 leading-tight capitalize"
          >
            Find food, homes <br className="hidden sm:block" />
            &amp; everything you need —
            <br className="hidden sm:block" />
            all in one place
          </h3>
        </div> */}

        {/* Search + Radio */}
        <div className="w-full max-w-5xl mt-6 space-y-2">
          <MarketplaceSearch />
          <Radio />
        </div>

        {/* ── CTA strip ───────────────────────────────────────────────── */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          {/* Primary — Post an Ad */}
          <button
            onClick={handlePostAd}
            className="group flex items-center gap-2.5 bg-black text-[#ffd700]
              font-bold text-sm px-6 py-3 rounded-full shadow-lg
              hover:bg-gray-900 active:scale-95 transition-all duration-150
              whitespace-nowrap"
          >
            <PlusCircle size={18} className="flex-shrink-0" />
            Post a free ad
            <ChevronRight
              size={15}
              className="opacity-60 group-hover:translate-x-0.5 transition-transform"
            />
          </button>

          {/* Secondary — Browse */}
          <Link
            href="/ads"
            className="text-sm font-medium text-black/70 hover:text-black
              underline underline-offset-2 transition"
          >
            Browse listings
          </Link>
        </div>

        {/* Trust nudge */}
        <p className="mt-3 text-[11px] text-black/50 font-medium">
          Free for your first listing · No credit card needed
        </p>

        {/* <HeroSection radio={<Radio />} search={<MarketplaceSearch />} /> */}
      </div>
    </div>
  );
}
