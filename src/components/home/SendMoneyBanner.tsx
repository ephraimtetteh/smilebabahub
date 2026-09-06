"use client";

// src/components/home/SendMoneyBanner.tsx
//
// Matches the app's navy Send Money banner rather than the cream one.
// Same colour, same headline treatment, same three trust marks — so
// someone who uses both doesn't feel like they're on two products.

import Link from "next/link";
import {
  Send,
  Globe,
  Zap,
  ShieldCheck,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";

const NAVY = "#0B2A63";
const NAVY_MID = "#123A80";

export default function SendMoneyBanner() {
  return (
    <Link
      href="/money/send"
      className="group relative block overflow-hidden rounded-2xl"
      style={{ background: NAVY }}
    >
      {/* Depth behind the globe */}
      <div
        className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full"
        style={{ background: NAVY_MID, opacity: 0.75 }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-6 top-4 h-28 w-28 rounded-full"
        style={{ background: "#1E4FA0", opacity: 0.4 }}
        aria-hidden
      />
      <Globe
        size={140}
        strokeWidth={0.7}
        className="pointer-events-none absolute -right-6 top-1 text-[#5B8DEF] opacity-30 sm:right-8"
        aria-hidden
      />

      <div className="relative flex items-center gap-4 p-5 sm:gap-5 sm:p-6">
        {/* Icon */}
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 sm:h-14 sm:w-14"
          style={{ background: NAVY_MID }}
        >
          <Send size={22} className="text-amber-400" strokeWidth={2.1} />
        </div>

        {/* Copy */}
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold leading-tight tracking-tight text-white sm:text-2xl">
            Send money
          </h2>
          <h2 className="text-lg font-bold leading-tight tracking-tight text-amber-400 sm:text-2xl">
            worldwide
          </h2>

          <p className="mt-1.5 text-xs font-semibold text-white/85 sm:text-sm">
            Fast. Secure. Reliable.
          </p>
          <p className="mt-1 hidden max-w-md text-[13px] leading-relaxed text-white/55 sm:block">
            Send money to your loved ones across the globe in seconds.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <Trust icon={Zap} label="Instant" className="text-amber-400" />
            <Trust
              icon={ShieldCheck}
              label="Secure"
              className="text-[#5B8DEF]"
            />
            <Trust
              icon={BadgeCheck}
              label="Reliable"
              className="text-green-400"
            />
          </div>
        </div>

        {/* CTA — a chip on mobile, a proper button once there's room */}
        <span className="hidden shrink-0 items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-gray-900 transition group-hover:bg-amber-300 sm:inline-flex">
          Send Now
          <ArrowRight size={15} />
        </span>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-gray-900 sm:hidden">
          <ArrowRight size={17} />
        </span>
      </div>
    </Link>
  );
}

function Trust({
  icon: Icon,
  label,
  className,
}: {
  icon: any;
  label: string;
  className: string;
}) {
  return (
    <span className="flex items-center gap-1.5">
      <Icon size={13} className={className} strokeWidth={2.4} />
      <span className="text-[11px] font-semibold text-white sm:text-xs">
        {label}
      </span>
    </span>
  );
}
