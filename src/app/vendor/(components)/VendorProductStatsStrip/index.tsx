"use client";

// src/components/VendorComponents/VendorStatsStrip.tsx
import { memo } from "react";

interface Stats {
  activeCount: number;
  soldCount: number;
  pausedCount: number;
  totalViews: number;
}

interface VendorStatsStripProps {
  stats: Stats;
  loading: boolean;
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm
      p-4 flex items-center gap-3`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center
        text-lg flex-shrink-0 ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xl font-black text-gray-900 leading-none">
          {value.toLocaleString()}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

const VendorStatsStrip = memo(function VendorStatsStrip({
  stats,
  loading,
}: VendorStatsStripProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100
            p-4 h-20 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard
        icon="🟢"
        label="Active listings"
        value={stats.activeCount}
        color="bg-green-50"
      />
      <StatCard
        icon="✅"
        label="Sold"
        value={stats.soldCount}
        color="bg-blue-50"
      />
      <StatCard
        icon="⏸️"
        label="Paused"
        value={stats.pausedCount}
        color="bg-gray-50"
      />
      <StatCard
        icon="👁️"
        label="Total views"
        value={stats.totalViews}
        color="bg-yellow-50"
      />
    </div>
  );
});

export default VendorStatsStrip;
