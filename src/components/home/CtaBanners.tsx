"use client";

// src/components/home/CtaBanners.tsx
// 4-column CTA banner row below the hero.

import Link from "next/link";
import {
  Megaphone,
  BadgeDollarSign,
  Home as HomeIcon,
  Sparkles,
} from "lucide-react";

const BANNERS = [
  {
    title: "BOOST YOUR SALES",
    desc: "Reach more customers across Ghana & Nigeria.",
    color: "from-emerald-700 to-emerald-900",
    icon: Megaphone,
    href: "/sell?boost=1",
    cta: "Boost an ad",
  },
  {
    title: "PLACE ADS HERE",
    desc: "Promote your business to millions of active users.",
    color: "from-purple-700 to-purple-900",
    icon: BadgeDollarSign,
    href: "/sell",
    cta: "Post an ad",
  },
  {
    title: "LIST YOUR PROPERTY",
    desc: "Get quality tenants and buyers faster.",
    color: "from-slate-700 to-slate-900",
    icon: HomeIcon,
    href: "/sell?category=apartments",
    cta: "List property",
  },
  {
    title: "GROW YOUR BRAND",
    desc: "Get your video promo on Radio, TV & socials — one plan.",
    color: "from-orange-600 to-red-700",
    icon: Sparkles,
    href: "/promote",
    cta: "Promote now",
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
            <div>
              <p className="text-sm font-black mb-1.5 tracking-wide">
                {b.title}
              </p>
              <p className="text-[11px] text-white/80 leading-relaxed max-w-[150px]">
                {b.desc}
              </p>
            </div>
            <div className="flex items-end justify-between">
              <span
                className="bg-yellow-400 text-black text-[10px] font-black
                px-3 py-1.5 rounded group-hover:bg-yellow-300 transition"
              >
                {b.cta} →
              </span>
            </div>
            <b.icon
              size={56}
              className="absolute right-2 top-1/2 -translate-y-1/2
              text-yellow-300 opacity-40 group-hover:opacity-70 group-hover:scale-110 transition"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
