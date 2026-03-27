"use client";

// src/components/ads/CategoryTabs.tsx
import { memo } from "react";
import { CATEGORIES } from "./ad.constants";

interface CategoryTabsProps {
  active: string;
  onChange: (id: string) => void;
  showFilterBtn: boolean;
  filtersOpen: boolean;
  onFilterToggle: () => void;
}

const CategoryTabs = memo(function CategoryTabs({
  active,
  onChange,
  showFilterBtn,
  filtersOpen,
  onFilterToggle,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none mb-6 pb-1">
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full
            text-sm font-semibold transition
            ${
              active === c.id
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
            }`}
        >
          <span>{c.icon}</span>
          {c.label}
        </button>
      ))}

      {showFilterBtn && (
        <button
          onClick={onFilterToggle}
          className={`ml-auto flex-shrink-0 flex items-center gap-1.5 px-4 py-2
            rounded-full text-sm font-semibold border transition
            ${
              filtersOpen
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
        >
          🔧 Filters
        </button>
      )}
    </div>
  );
});

export default CategoryTabs;
