"use client";

// src/components/home/CtaBanners.tsx
// 4-column CTA banner row below the hero. Uses emojis matching the design.

import Link from "next/link";

const BANNERS = [
  {
    title: "BOOST YOUR SALES",
    desc: "Reach more customers across Africa.",
    color: "from-emerald-700 to-emerald-900",
    emoji: "📢",
    href: "/sell?boost=1",
    cta: "Advertise Now",
  },
  {
    title: "PLACE ADS HERE",
    desc: "Promote your business to millions of active users.",
    color: "from-purple-700 to-purple-900",
    emoji: "📺",
    href: "/sell",
    cta: "Advertise Now",
  },
  {
    title: "LIST YOUR PROPERTY",
    desc: "Get quality tenants faster.",
    color: "from-slate-700 to-slate-900",
    emoji: "🏠",
    href: "/sell?category=apartments",
    cta: "Advertise Now",
  },
  {
    title: "GROW YOUR BRAND",
    desc: "Stand out. Get noticed.",
    color: "from-orange-600 to-red-700",
    emoji: "🚀",
    href: "/promote",
    cta: "Advertise Now",
  },
];

export default function CtaBanners() {
  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 pb-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {BANNERS.map((b) => (
          <Link
            key={b.title}
            href={b.href}
            className={`relative bg-gradient-to-br ${b.color} text-white
              rounded-2xl p-5 overflow-hidden hover:shadow-xl
              hover:-translate-y-0.5 transition-all group min-h-[160px]
              flex flex-col justify-between`}
          >
            <div className="relative z-10">
              <p className="text-sm font-black mb-1.5 tracking-wide">
                {b.title}
              </p>
              <p className="text-[11px] text-white/80 leading-relaxed max-w-[150px]">
                {b.desc}
              </p>
            </div>
            <div className="relative z-10">
              <span
                className="inline-block bg-yellow-400 text-black text-[10px]
                font-black px-3 py-1.5 rounded group-hover:bg-yellow-300 transition"
              >
                {b.cta} →
              </span>
            </div>

            {/* Decorative emoji */}
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[80px]
              opacity-40 group-hover:opacity-70 group-hover:scale-110
              group-hover:rotate-6 transition-all duration-300"
            >
              {b.emoji}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
