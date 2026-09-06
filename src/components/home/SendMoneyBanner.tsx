"use client";

// src/components/home/SendMoneyBanner.tsx
//
// Full-width Send Money banner. Cream rather than white, because it is
// the one section on the page that is not a product and should not look
// like one.

import Link from "next/link";
import { Send, Globe, ArrowRight } from "lucide-react";

export default function SendMoneyBanner() {
  return (
    <Link
      href="/money/send"
      className="group block overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 transition hover:border-amber-200"
    >
      <div className="flex items-center gap-5 px-5 py-5 sm:px-7">
        {/* Icon */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-900 sm:h-16 sm:w-16">
          <Send size={24} className="text-amber-400" strokeWidth={2.1} />
        </div>

        {/* Copy */}
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold leading-tight text-gray-900 sm:text-xl">
            Send Money
          </h2>
          <p className="text-lg font-bold leading-tight text-amber-600 sm:text-xl">
            to 120+ Countries
          </p>
          <p className="mt-1 text-xs text-gray-500 sm:text-[13px]">
            Fast, secure and reliable
          </p>

          <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3.5 py-2 text-xs font-bold text-amber-400 transition group-hover:bg-black sm:text-[13px]">
            Send Money Now
            <ArrowRight size={13} />
          </span>
        </div>

        {/* Decoration */}
        <div className="hidden shrink-0 items-center sm:flex" aria-hidden>
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-violet-600 lg:h-28 lg:w-28">
            <Globe size={44} className="text-white/90" strokeWidth={1.2} />
          </div>
        </div>
      </div>
    </Link>
  );
}
