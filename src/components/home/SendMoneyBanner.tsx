"use client";

// src/components/home/SendMoneyBanner.tsx
//
// Full-width Send Money banner. Cream on the app, cream here — it's the
// one section that isn't a product, so it shouldn't look like one.

import Link from "next/link";

const FLAGS = ["🇺🇸", "🇬🇧", "🇨🇦", "🇮🇳", "🇮🇹", "🇳🇬", "🇬🇭"];

export default function SendMoneyBanner() {
  return (
    <Link
      href="/money/send"
      className="group block overflow-hidden rounded-2xl border border-amber-100
                 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50
                 transition hover:border-amber-200"
    >
      <div className="flex items-center gap-5 px-5 py-5 sm:px-7">
        {/* Icon */}
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center
                     rounded-2xl bg-gray-900 sm:h-16 sm:w-16"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFC105"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
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
            Fast · Secure · Reliable
          </p>

          <span
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gray-900
                       px-3.5 py-2 text-xs font-bold text-amber-400
                       transition group-hover:bg-black sm:text-[13px]"
          >
            Send Money Now
            <span aria-hidden>→</span>
          </span>
        </div>

        {/* Globe — decorative, so it goes when there's no room for it */}
        <div className="relative hidden shrink-0 items-center sm:flex">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full
                       bg-gradient-to-br from-violet-400 to-violet-600 lg:h-28 lg:w-28"
            aria-hidden
          >
            <span className="text-4xl lg:text-5xl">🌍</span>
          </div>

          <div
            className="ml-4 hidden max-w-[180px] flex-wrap gap-2 lg:flex"
            aria-hidden
          >
            {FLAGS.map((f, i) => (
              <span
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-full
                           bg-white text-base shadow-sm"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
