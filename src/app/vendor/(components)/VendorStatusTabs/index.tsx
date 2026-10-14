"use client";
// src/components/VendorComponents/VendorStatusTabs.tsx
import { memo } from "react";
import {
  LayoutList,
  TrendingUp,
  Clock,
  Pause,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export const STATUS_TABS = [
  { id: "all", label: "All", icon: <LayoutList size={14} /> },
  { id: "active", label: "Active", icon: <TrendingUp size={14} /> },
  { id: "pending", label: "In Review", icon: <Clock size={14} /> },
  { id: "paused", label: "Paused", icon: <Pause size={14} /> },
  { id: "sold", label: "Sold", icon: <CheckCircle2 size={14} /> },
  { id: "expired", label: "Expired", icon: <XCircle size={14} /> },
] as const;

export type StatusTabId = (typeof STATUS_TABS)[number]["id"];

interface VendorStatusTabsProps {
  active: StatusTabId;
  onChange: (id: StatusTabId) => void;
}

const VendorStatusTabs = memo(function VendorStatusTabs({
  active,
  onChange,
}: VendorStatusTabsProps) {
  return (
    <div
      className="flex gap-1.5 bg-white border border-gray-100 shadow-sm
      rounded-2xl p-1 overflow-x-auto scrollbar-none"
    >
      {STATUS_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2
            rounded-xl text-xs font-semibold transition whitespace-nowrap
            ${
              active === tab.id
                ? "bg-[#ffc105] text-black"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
});

export default VendorStatusTabs;
