"use client";
// src/components/ads/CategoryTabs.tsx
// Reads from ad.constants — single source of truth for all categories.

import { memo } from "react";
import {
  LayoutGrid,
  ShoppingBag,
  UtensilsCrossed,
  Home,
  Shirt,
  Pill,
  Truck,
  Wrench,
  SlidersHorizontal,
} from "lucide-react";
import { CATEGORIES } from "./ad.constants";


const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  all: <LayoutGrid size={13} />,
  marketplace: <ShoppingBag size={13} />,
  food: <UtensilsCrossed size={13} />,
  apartments: <Home size={13} />,
  fashion: <Shirt size={13} />,
  pharmacy: <Pill size={13} />,
  delivery: <Truck size={13} />,
  services: <Wrench size={13} />,
};

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
            text-sm font-semibold transition whitespace-nowrap
            ${
              active === c.id
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
            }`}
        >
          {CATEGORY_ICONS[c.id]}
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
          <SlidersHorizontal size={13} /> Filters
        </button>
      )}
    </div>
  );
});

export default CategoryTabs;
