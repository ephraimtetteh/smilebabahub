"use client";

// src/components/home/MobileShortcuts.tsx
// MOBILE-ONLY: 5-column emoji shortcut grid.
// Replaces the vertical sidebar from desktop. Same categories, simpler layout.

import Link from "next/link";
import { CATEGORIES_SIDEBAR } from "./home.constants";

export default function MobileShortcuts() {
  return (
    <section className="lg:hidden bg-white pt-2 pb-3 px-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-black text-gray-900 tracking-wider">
          SHORTCUTS
        </h2>
        <Link
          href="/ads"
          className="text-xs text-blue-600 font-bold hover:underline"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {CATEGORIES_SIDEBAR.map((cat) => (
          <Link
            key={cat.id}
            href={`/ads?category=${cat.id}`}
            className="flex flex-col items-center text-center
              active:scale-95 transition"
          >
            <div
              className="w-full aspect-square bg-white border border-gray-100
              rounded-2xl flex items-center justify-center mb-1.5
              shadow-sm hover:shadow-md transition"
            >
              <span className="text-3xl">{cat.emoji}</span>
            </div>
            <p className="text-[10px] font-bold text-gray-700 leading-tight line-clamp-2">
              {cat.label.split(" & ")[0]}
              {cat.label.includes(" & ") && (
                <>
                  <br />& {cat.label.split(" & ")[1]}
                </>
              )}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
