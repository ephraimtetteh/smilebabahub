"use client";

// src/components/home/CtaBanners.tsx
// 4 CTA banners — 4-column grid on all screens (matches mockup).
// Each card is compact so 4 fit comfortably on mobile too.

import Link from "next/link";

const BANNERS = [
  {
    title: "BOOST YOUR SALES",
    desc: "Reach more customers across Africa.",
    color: "from-emerald-700 to-emerald-900",
    emoji: "📢",
    href: "/sell?boost=1",
  },
  {
    title: "PLACE ADS HERE",
    desc: "Promote your business to millions of active users.",
    color: "from-purple-700 to-purple-900",
    emoji: "📺",
    href: "/sell",
  },
  {
    title: "LIST YOUR PROPERTY",
    desc: "Get quality tenants faster.",
    color: "from-slate-700 to-slate-900",
    emoji: "🏠",
    href: "/sell?category=apartments",
  },
  {
    title: "GROW YOUR BRAND",
    desc: "Stand out. Get noticed.",
    color: "from-orange-600 to-red-700",
    emoji: "🚀",
    href: "/promote",
  },
];

export default function CtaBanners() {
  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 pb-3 sm:pb-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {BANNERS.map((b) => (
          <Link
            key={b.title}
            href={b.href}
            className={`relative bg-gradient-to-br ${b.color} text-white
              rounded-xl sm:rounded-2xl p-3 sm:p-5 overflow-hidden
              hover:shadow-xl hover:-translate-y-0.5 transition-all group
              min-h-[110px] sm:min-h-[160px] flex flex-col justify-between`}
          >
            <div className="relative z-10">
              <p className="text-[10px] sm:text-sm font-black mb-1 sm:mb-1.5 tracking-wide leading-tight">
                {b.title}
              </p>
              <p
                className="text-[9px] sm:text-[11px] text-white/80 leading-snug
                line-clamp-2 sm:line-clamp-none max-w-[100px] sm:max-w-[150px]"
              >
                {b.desc}
              </p>
            </div>
            <div className="relative z-10">
              <span
                className="inline-block bg-yellow-400 text-black
                text-[9px] sm:text-[10px] font-black px-2 sm:px-3 py-1 sm:py-1.5
                rounded group-hover:bg-yellow-300 transition"
              >
                Advertise Now →
              </span>
            </div>

            <span
              className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2
              text-[50px] sm:text-[80px] opacity-30 sm:opacity-40
              group-hover:opacity-60 group-hover:scale-110 group-hover:rotate-6
              transition-all duration-300 pointer-events-none"
            >
              {b.emoji}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
