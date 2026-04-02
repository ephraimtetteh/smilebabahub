"use client";
// src/components/CountrySwitcher.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Universal country switcher for ALL users (guests, vendors, admins).
//
// Behaviour:
//   - Your IP-detected country is the default — shown as "(Your location)"
//   - Picking a different country locks the switch
//   - A "Reset to my location" option clears the manual pick
//   - Instant — no API call, pure Redux state

import React, { useRef, useState, useEffect } from "react";
import {
  Globe,
  ChevronDown,
  CheckCircle2,
  MapPin,
  RotateCcw,
} from "lucide-react";
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
  compact?: boolean; // flag + chevron only (no label) — for tight spaces
}

export default function CountrySwitcher({ compact = false }: Props) {
  const {
    country,
    detectedCountry,
    isManuallySelected,
    guestDetecting,
    switchCountry,
    resetToAuto,
  } = useViewCountry();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
    // If user picks the same as their detected country, treat as "reset to auto"
    // so we don't unnecessarily lock selectedCountry to a static value
    if (c === detectedCountry) {
      resetToAuto();
    } else {
      switchCountry(c);
    }
    setOpen(false);
  };

  const handleReset = () => {
    resetToAuto();
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative z-50">
      {/* ── Trigger ─────────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={guestDetecting}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full
          bg-white/10 border border-white/20 text-white text-xs font-semibold
          hover:bg-white/20 active:scale-95 transition-all disabled:opacity-40"
        aria-label="Switch country"
        title={`Viewing ${current.label} (${current.currency})${isManuallySelected ? " — manually selected" : " — auto-detected"}`}
      >
        {guestDetecting ? (
          // Detecting spinner
          <span
            className="w-3.5 h-3.5 border border-white/40 border-t-white
            rounded-full animate-spin"
          />
        ) : (
          <span className="text-sm leading-none">{current.flag}</span>
        )}

        {!compact && !guestDetecting && (
          <>
            <span className="hidden sm:inline">{current.label}</span>
            <span className="hidden sm:inline text-white/50">
              {current.sym}
            </span>
          </>
        )}

        {/* Dot indicator when manually overriding */}
        {isManuallySelected && !guestDetecting && (
          <span
            className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0"
            title="Manually selected"
          />
        )}

        <ChevronDown
          size={11}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* ── Dropdown ────────────────────────────────────────────────────── */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl
          shadow-xl border border-gray-100 overflow-hidden"
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
              {isManuallySelected
                ? "You've manually selected a market. Reset to use your detected location."
                : "Your location was detected automatically."}
            </p>
          </div>

          {/* Country options */}
          <div className="py-1.5">
            {COUNTRIES.map((c) => {
              const isActive = country === c.value;
              const isDetected = detectedCountry === c.value;

              return (
                <button
                  key={c.value}
                  onClick={() => handleSwitch(c.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3
                    text-sm transition text-left
                    ${
                      isActive
                        ? "bg-amber-50 text-gray-900"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <span className="text-xl leading-none">{c.flag}</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-sm">{c.label}</p>
                      {/* "Your location" badge on detected country */}
                      {isDetected && (
                        <span
                          className="flex items-center gap-0.5 text-[9px]
                          font-bold text-green-600 bg-green-50 px-1.5 py-0.5
                          rounded-full border border-green-100 whitespace-nowrap"
                        >
                          <MapPin size={8} />
                          Your location
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {c.currency} · {c.sym}
                    </p>
                  </div>

                  {isActive && (
                    <CheckCircle2
                      size={16}
                      className="text-[#ffc105] flex-shrink-0"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Reset to auto — only shown when manually overriding */}
          {isManuallySelected && (
            <div className="border-t border-gray-50 px-3 py-2.5">
              <button
                onClick={handleReset}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs
                  text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl
                  transition font-medium"
              >
                <RotateCcw size={12} />
                Reset to my location
                <span className="ml-auto text-[10px] text-gray-300 font-normal">
                  {detectedCountry}
                </span>
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50/50">
            <p className="text-[11px] text-gray-400">
              {isManuallySelected ? "Manually set to" : "Auto-detected:"}
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
