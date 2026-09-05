"use client";

// src/components/home/BigCategoryCards.tsx
//
// The four verticals. Four across on desktop, two on mobile — the same
// 2×2 the app shows.
//
// Each card carries its own tint and accent, which is what lets someone
// scan the row without reading it.

import Link from "next/link";
import {
  ShoppingBag,
  Store,
  UtensilsCrossed,
  BedDouble,
  type LucideIcon,
} from "lucide-react";

interface Vertical {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  icon: LucideIcon;
  bg: string;
  accent: string;
  button: string;
  /** Emoji stand-ins until there's product photography */
  art: string[];
}

const VERTICALS: Vertical[] = [
  {
    id: "ecommerce",
    tag: "E-COMMERCE",
    title: "Shop from\nTrusted Brands",
    subtitle: "Quality products with warranty and fast delivery.",
    cta: "Shop Now",
    href: "/ads?category=phones,fashion,home-office",
    icon: ShoppingBag,
    bg: "bg-emerald-50",
    accent: "text-emerald-600",
    button: "bg-emerald-600 hover:bg-emerald-700",
    art: ["🎧", "👜", "👟"],
  },
  {
    id: "marketplace",
    tag: "MARKETPLACE",
    title: "Buy, Sell &\nConnect with People",
    subtitle: "Great deals from individuals and businesses near you.",
    cta: "Explore Now",
    href: "/ads?category=marketplace",
    icon: Store,
    bg: "bg-blue-50",
    accent: "text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
    art: ["🪑", "📱", "🏀"],
  },
  {
    id: "food",
    tag: "SMILEBABA FOOD",
    title: "Order your favorite\nmeals & enjoy",
    subtitle: "Delicious meals from trusted restaurants near you.",
    cta: "Order Now",
    href: "/ads?category=food",
    icon: UtensilsCrossed,
    bg: "bg-red-50",
    accent: "text-red-600",
    button: "bg-red-600 hover:bg-red-700",
    art: ["🍛", "🥗"],
  },
  {
    id: "stays",
    tag: "SMILESTAYS",
    title: "Find & Book\nComfortable Stays",
    subtitle: "Apartments, studios, villas and more for any stay.",
    cta: "Explore Stays",
    href: "/ads?category=apartments",
    icon: BedDouble,
    bg: "bg-teal-50",
    accent: "text-teal-600",
    button: "bg-teal-600 hover:bg-teal-700",
    art: ["🛏️", "🪴"],
  },
];

export default function BigCategoryCards() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {VERTICALS.map((v) => (
        <Card key={v.id} vertical={v} />
      ))}
    </div>
  );
}

function Card({ vertical: v }: { vertical: Vertical }) {
  const Icon = v.icon;

  return (
    <Link
      href={v.href}
      className={`group relative flex min-h-[180px] flex-col justify-between
                  overflow-hidden rounded-2xl ${v.bg} p-4
                  transition hover:shadow-md sm:min-h-[210px] sm:p-5`}
    >
      {/* Art — decorative, hidden from screen readers */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 select-none"
        aria-hidden
      >
        <span className="absolute bottom-2 right-3 text-5xl sm:text-6xl">
          {v.art[0]}
        </span>
        {v.art[1] && (
          <span className="absolute bottom-10 right-14 rotate-[-8deg] text-3xl sm:bottom-14 sm:right-16 sm:text-4xl">
            {v.art[1]}
          </span>
        )}
        {v.art[2] && (
          <span className="absolute bottom-1 right-16 rotate-[10deg] text-2xl sm:right-20 sm:text-3xl">
            {v.art[2]}
          </span>
        )}
      </div>

      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
            <Icon size={15} className={v.accent} strokeWidth={2.2} />
          </span>
          <span className={`text-[9px] font-bold tracking-widest ${v.accent}`}>
            {v.tag}
          </span>
        </div>

        <h3
          className={`mt-3 whitespace-pre-line text-[15px] font-bold leading-tight
                      tracking-tight ${v.accent} sm:text-lg`}
        >
          {v.title}
        </h3>
        <p className="mt-1.5 max-w-[70%] text-[11px] leading-snug text-gray-500 sm:text-xs">
          {v.subtitle}
        </p>
      </div>

      <span
        className={`relative mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg
                    ${v.button} px-3 py-1.5 text-[11px] font-bold text-white
                    transition sm:text-xs`}
      >
        {v.cta}
        <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
