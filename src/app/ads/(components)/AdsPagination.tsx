"use client";

// src/components/ads/AdsPagination.tsx
import { memo } from "react";
import { AdsMeta } from "@/src/types/ad.types";

interface AdsPaginationProps {
  meta: AdsMeta;
  onPage: (page: number) => void;
}

const AdsPagination = memo(function AdsPagination({
  meta,
  onPage,
}: AdsPaginationProps) {
  if (meta.totalPages <= 1) return null;

  // Show a window of 5 pages centred on the current page
  const pages: number[] = [];
  const start = Math.max(1, meta.page - 2);
  for (let p = start; p <= Math.min(start + 4, meta.totalPages); p++) {
    pages.push(p);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        disabled={meta.page === 1}
        onClick={() => onPage(meta.page - 1)}
        className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl
          bg-white hover:bg-gray-50 disabled:opacity-40 transition"
      >
        ← Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`w-9 h-9 text-sm font-semibold rounded-xl transition
            ${
              p === meta.page
                ? "bg-yellow-400 text-black"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
        >
          {p}
        </button>
      ))}

      <button
        disabled={!meta.hasNext}
        onClick={() => onPage(meta.page + 1)}
        className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl
          bg-white hover:bg-gray-50 disabled:opacity-40 transition"
      >
        Next →
      </button>
    </div>
  );
});

export default AdsPagination;
