"use client";

// src/components/ads/FiltersPanel.tsx
import { memo } from "react";
import { CONDITIONS, SORT_OPTIONS } from "./ad.constants";

interface FiltersPanelProps {
  sym: string;
  condition: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
  onCondition: (v: string) => void;
  onMinPrice: (v: string) => void;
  onMaxPrice: (v: string) => void;
  onSort: (v: string) => void;
  onApply: () => void;
  onClear: () => void;
}

const FiltersPanel = memo(function FiltersPanel({
  sym,
  condition,
  minPrice,
  maxPrice,
  sort,
  onCondition,
  onMinPrice,
  onMaxPrice,
  onSort,
  onApply,
  onClear,
}: FiltersPanelProps) {
  const inputCls = `w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
    text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white`;

  const labelCls = "text-xs font-semibold text-gray-500 block mb-1.5";

  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 mb-6
      grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <div>
        <label className={labelCls}>Condition</label>
        <select
          value={condition}
          onChange={(e) => onCondition(e.target.value)}
          className={inputCls}
        >
          {CONDITIONS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>Min price ({sym})</label>
        <input
          type="number"
          min="0"
          value={minPrice}
          onChange={(e) => onMinPrice(e.target.value)}
          placeholder={`e.g. ${sym}500`}
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Max price ({sym})</label>
        <input
          type="number"
          min="0"
          value={maxPrice}
          onChange={(e) => onMaxPrice(e.target.value)}
          placeholder={`e.g. ${sym}10,000`}
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Sort by</label>
        <select
          value={sort}
          onChange={(e) => onSort(e.target.value)}
          className={inputCls}
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2 lg:col-span-4 flex gap-2">
        <button
          onClick={onApply}
          className="px-5 py-2 bg-yellow-400 text-black font-bold rounded-xl
            text-sm hover:bg-yellow-300 transition"
        >
          Apply filters
        </button>
        <button
          onClick={onClear}
          className="px-5 py-2 bg-white border border-gray-200 text-gray-600
            font-medium rounded-xl text-sm hover:bg-gray-50 transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
});

export default FiltersPanel;
