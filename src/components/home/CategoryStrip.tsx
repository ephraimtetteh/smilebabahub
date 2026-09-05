"use client";

// src/components/home/CategoryStrip.tsx
//
// The icon row above the footer. Every tile points at a real
// category.main value, so nothing lands on an empty page.

import Link from "next/link";
import {
  Car, Home, Cpu, Shirt, Briefcase, Wrench,
  Sofa, Smartphone, Grid3x3, type LucideIcon,
} from "lucide-react";

interface Shortcut {
  label: string;
  icon: LucideIcon;
  color: string;
  href: string;
}

const SHORTCUTS: Shortcut[] = [
  { label: "Vehicles",      icon: Car,        color: "text-blue-500",    href: "/ads?category=marketplace&q=car" },
  { label: "Property",      icon: Home,       color: "text-emerald-500", href: "/ads?category=apartments" },
  { label: "Electronics",   icon: Cpu,        color: "text-violet-500",  href: "/ads?category=phones" },
  { label: "Fashion",       icon: Shirt,      color: "text-red-500",     href: "/ads?category=fashion" },
  { label: "Jobs",          icon: Briefcase,  color: "text-blue-600",    href: "/ads?category=jobs" },
  { label: "Services",      icon: Wrench,     color: "text-amber-500",   href: "/ads?category=services" },
  { label: "Home & Living", icon: Sofa,       color: "text-emerald-600", href: "/ads?category=home-office" },
  { label: "Phones",        icon: Smartphone, color: "text-blue-500",    href: "/ads?category=phones" },
  { label: "More",          icon: Grid3x3,    color: "text-gray-500",    href: "/ads" },
];

export default function CategoryStrip() {
  return (
    <section className="mt-10">
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-9 sm:gap-3">
        {SHORTCUTS.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group flex flex-col items-center rounded-xl border border-gray-100
                         bg-white px-1 py-3 transition hover:border-gray-200 hover:shadow-sm"
            >
              <Icon size={20} className={s.color} strokeWidth={1.9} />
              <span className="mt-1.5 line-clamp-1 text-[10px] font-medium text-gray-600 sm:text-[11px]">
                {s.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}




 
