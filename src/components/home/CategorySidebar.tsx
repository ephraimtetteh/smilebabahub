"use client";

// src/components/home/CategorySidebar.tsx
// Vertical category list with emoji icons (matches design).

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CATEGORIES_SIDEBAR, type CategoryDef } from "./home.constants";

interface Props {
  title: string;
  viewAllHref?: string;
  compact?: boolean;
  categories?: CategoryDef[];
}

export default function CategorySidebar({
  title,
  viewAllHref = "/ads",
  compact = false,
  categories = CATEGORIES_SIDEBAR,
}: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[11px] font-black text-gray-900 tracking-wider">
          {title}
        </h3>
        <Link
          href={viewAllHref}
          className="text-[11px] text-gray-500 hover:text-yellow-600 font-bold"
        >
          View all →
        </Link>
      </div>

      <div
        className="space-y-2 max-h-[600px] overflow-y-auto pr-1
        scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
      >
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/ads?category=${c.id}`}
            className={`flex items-center gap-3 ${c.color} rounded-xl p-2.5
              hover:shadow-md hover:scale-[1.01] transition group`}
          >
            {/* Emoji tile */}
            <div
              className="w-10 h-10 rounded-lg bg-white shadow-sm
              flex items-center justify-center flex-shrink-0 text-[20px]"
            >
              {c.emoji}
            </div>

            <div className="flex-1 min-w-0">
              <p
                className={`font-bold text-gray-900 truncate leading-tight
                ${compact ? "text-[11px]" : "text-xs"}`}
              >
                {c.label}
              </p>
              <p className="text-[10px] text-gray-500 truncate">{c.sub}</p>
            </div>

            <div
              className={`w-7 h-7 rounded-lg ${c.tagBg} flex-shrink-0
              flex items-center justify-center
              group-hover:scale-110 transition`}
            >
              <ChevronRight size={14} className="text-white" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
