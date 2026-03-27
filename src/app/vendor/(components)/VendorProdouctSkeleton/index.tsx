"use client";

import { memo } from "react";

const VendorProductSkeleton = memo(function VendorProductSkeleton() {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 animate-pulse
      overflow-hidden"
    >
      <div className="h-44 bg-gray-100" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-5 bg-gray-100 rounded w-1/3" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="h-8 bg-gray-100 rounded-xl" />
          <div className="h-8 bg-gray-100 rounded-xl" />
          <div className="h-8 bg-gray-100 rounded-xl" />
          <div className="h-8 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
});

export function VendorProductSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <VendorProductSkeleton key={i} />
      ))}
    </div>
  );
}

export default VendorProductSkeleton;
