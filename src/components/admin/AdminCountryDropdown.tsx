"use client";

// src/components/admin/AdminCountryDropdown.tsx
// Shown in Navbar ONLY for admin users.
// Lets them toggle between Ghana and Nigeria to view each country's data.

import React, { useRef, useState, useEffect } from "react";
import { ChevronDown, Globe, CheckCircle2 } from "lucide-react";
import { AdminCountry, useAdminCountry } from "@/src/hooks/useAdminCountry";


const COUNTRIES: {
  value: AdminCountry;
  flag: string;
  currency: string;
  sym: string;
}[] = [
  { value: "Ghana", flag: "🇬🇭", currency: "GHS", sym: "₵" },
  { value: "Nigeria", flag: "🇳🇬", currency: "NGN", sym: "₦" },
];

export default function AdminCountryDropdown() {
  const { isAdmin, viewCountry, switching, switchCountry } = useAdminCountry();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!isAdmin) return null;

  const current =
    COUNTRIES.find((c) => c.value === viewCountry) ?? COUNTRIES[0];

  return (
    <div ref={ref} className="relative z-50">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={switching}
        className="flex items-center gap-1.5 text-white bg-white/10 border border-white/20
          px-2.5 py-1.5 rounded-full text-xs font-semibold hover:bg-white/20 transition
          disabled:opacity-60"
        title="Switch admin country view"
      >
        <span className="text-sm leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.value}</span>
        <span className="hidden sm:inline text-white/60">{current.sym}</span>
        {switching ? (
          <span
            className="w-3 h-3 border border-white/40 border-t-white rounded-full
            animate-spin"
          />
        ) : (
          <ChevronDown
            size={11}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl
          shadow-xl border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-50">
            <div
              className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold
              uppercase tracking-wider"
            >
              <Globe size={11} />
              Admin country view
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
              Toggle to see listings, stats and orders for each country
            </p>
          </div>

          {/* Country options */}
          <div className="py-1.5">
            {COUNTRIES.map((c) => {
              const isActive = viewCountry === c.value;
              return (
                <button
                  key={c.value}
                  onClick={() => {
                    switchCountry(c.value);
                    setOpen(false);
                  }}
                  disabled={switching}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm
                    transition disabled:opacity-50
                    ${
                      isActive
                        ? "bg-amber-50 text-gray-900"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">{c.value}</p>
                    <p className="text-[11px] text-gray-400">
                      {c.currency} · {c.sym}
                    </p>
                  </div>
                  {isActive && (
                    <CheckCircle2
                      size={15}
                      className="text-[#ffc105] fill-amber-50 flex-shrink-0"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active badge */}
          <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50/50">
            <p className="text-[11px] text-gray-400">
              Currently viewing:
              <span className="font-bold text-gray-700 ml-1">
                {current.flag} {current.value}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
