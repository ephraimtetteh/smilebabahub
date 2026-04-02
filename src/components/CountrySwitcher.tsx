"use client";
// src/components/CountrySwitcher.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Country toggle for ALL users — guests, vendors, and admins.
// No API call. Instant. Updates Redux → all feeds re-fetch automatically.
//
// Usage in Navbar (replace AdminCountryDropdown with this):
//   <CountrySwitcher />
//
// Optionally pass `compact` for a small pill version (mobile nav):
//   <CountrySwitcher compact />

import React, { useRef, useState, useEffect } from "react";
import { Globe, ChevronDown, CheckCircle2 } from "lucide-react";
import { useViewCountry, ViewCountry } from "@/src/hooks/useViewCountry";

const COUNTRIES: {
  value: ViewCountry;
  flag: string;
  label: string;
  currency: string;
  sym: string;
}[] = [
  { value: "Ghana", flag: "🇬🇭", label: "Ghana", currency: "GHS", sym: "₵" },
  { value: "Nigeria", flag: "🇳🇬", label: "Nigeria", currency: "NGN", sym: "₦" },
];

interface Props {
  compact?: boolean; // compact pill — flag only, no label
}

export default function CountrySwitcher({ compact = false }: Props) {
  const { country, switchCountry } = useViewCountry();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = COUNTRIES.find((c) => c.value === country) ?? COUNTRIES[0];

  const handleSwitch = (c: ViewCountry) => {
    switchCountry(c);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative z-50">
      {/* ── Trigger button ─────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full
          bg-white/10 border border-white/20 text-white text-xs font-semibold
          hover:bg-white/20 active:scale-95 transition-all"
        aria-label="Switch country"
        title={`Viewing ${current.label} (${current.currency})`}
      >
        <span className="text-sm leading-none">{current.flag}</span>
        {!compact && (
          <>
            <span className="hidden sm:inline">{current.label}</span>
            <span className="hidden sm:inline text-white/60">
              {current.sym}
            </span>
          </>
        )}
        <ChevronDown
          size={11}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* ── Dropdown ───────────────────────────────────────────────────────── */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl
          shadow-xl border border-gray-100 overflow-hidden animate-in fade-in
          slide-in-from-top-1 duration-150"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-50">
            <div
              className="flex items-center gap-1.5 text-xs font-bold
              text-gray-400 uppercase tracking-wider"
            >
              <Globe size={11} />
              Choose your market
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
              Switch to see listings and prices for your location
            </p>
          </div>

          {/* Options */}
          <div className="py-1.5">
            {COUNTRIES.map((c) => {
              const active = country === c.value;
              return (
                <button
                  key={c.value}
                  onClick={() => handleSwitch(c.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm
                    transition text-left
                    ${
                      active
                        ? "bg-amber-50 text-gray-900"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <span className="text-xl leading-none">{c.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{c.label}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {c.currency} · {c.sym} ·{" "}
                      {c.value === "Ghana" ? "Cedis" : "Naira"}
                    </p>
                  </div>
                  {active && (
                    <CheckCircle2
                      size={16}
                      className="text-[#ffc105] flex-shrink-0"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50/50">
            <p className="text-[11px] text-gray-400">
              Now viewing:
              <span className="font-bold text-gray-700 ml-1">
                {current.flag} {current.label} · {current.currency}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
