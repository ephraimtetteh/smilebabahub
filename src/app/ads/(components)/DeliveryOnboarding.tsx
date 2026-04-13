"use client";
// src/components/ads/DeliveryOnboarding.tsx
// Bolt/Uber-style onboarding form for delivery category ads.
// Replaces the standard Step 1 basic-info fields when category === "delivery".
// Still uses AdFormData — just the extra delivery* fields.

import { AdFormData } from "@/src/types/adForm.types";
import {
  Truck,
  Bike,
  Car,
  Package,
  MapPin,
  Clock,
  Navigation,
  CheckCircle2,
  Shield,
  Phone,
  ChevronRight,
  Zap,
} from "lucide-react";

// ── Vehicle type options ───────────────────────────────────────────────────
const VEHICLE_TYPES = [
  {
    id: "bike",
    label: "Bike",
    icon: <Bike size={22} />,
    desc: "Fast, for small items",
  },
  { id: "car", label: "Car", icon: <Car size={22} />, desc: "Medium loads" },
  {
    id: "van",
    label: "Van",
    icon: <Truck size={22} />,
    desc: "Larger deliveries",
  },
  {
    id: "truck",
    label: "Truck",
    icon: <Truck size={22} />,
    desc: "Bulk / haulage",
  },
  {
    id: "foot",
    label: "On foot",
    icon: <Package size={22} />,
    desc: "Nearby errands",
  },
];

const WORKING_HOURS_OPTIONS = [
  "7am – 10pm daily",
  "6am – midnight daily",
  "24 / 7",
  "Weekdays only (8am – 6pm)",
  "Weekends only",
  "Custom (specify in notes)",
];

// ── Input styles ───────────────────────────────────────────────────────────
const inp =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-white outline-none transition focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400";
const lbl =
  "block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide";
const hint = "text-[11px] text-gray-400 mt-1";

interface Props {
  form: AdFormData;
  set: (field: keyof AdFormData, value: any) => void;
  errors: Partial<Record<keyof AdFormData, string>>;
}

export default function DeliveryOnboarding({ form, set, errors }: Props) {
  return (
    <div className="space-y-6">
      {/* ── Hero intro ── */}
      <div
        className="bg-gradient-to-br from-gray-950 to-gray-800 text-white
        rounded-2xl px-5 py-6 flex items-start gap-4"
      >
        <div
          className="w-12 h-12 bg-[#ffd700] rounded-xl flex items-center
          justify-center flex-shrink-0"
        >
          <Navigation size={22} className="text-black" />
        </div>
        <div>
          <h2 className="font-black text-lg leading-tight">
            Set up your delivery profile
          </h2>
          <p className="text-sm text-gray-400 mt-1 leading-relaxed">
            Tell customers about your service — vehicle type, coverage area, and
            speed. A complete profile gets 3× more bookings.
          </p>
        </div>
      </div>

      {/* ── Step A: What do you deliver? ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-6 h-6 bg-[#ffd700] text-black rounded-full text-xs
            font-black flex items-center justify-center flex-shrink-0"
          >
            1
          </span>
          <h3 className="font-bold text-sm text-gray-900">
            What`s your vehicle?
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {VEHICLE_TYPES.map((v) => {
            const active = form.deliveryServiceType === v.id;
            return (
              <button
                type="button"
                key={v.id}
                onClick={() => set("deliveryServiceType", v.id)}
                className={[
                  "flex flex-col items-center gap-2 p-4 rounded-2xl border-2",
                  "text-center transition-all duration-150 active:scale-95",
                  active
                    ? "border-[#ffd700] bg-[#ffd700]/10"
                    : "border-gray-200 bg-white hover:border-gray-300",
                ].join(" ")}
              >
                <span className={active ? "text-gray-900" : "text-gray-400"}>
                  {v.icon}
                </span>
                <div>
                  <p
                    className={`text-sm font-bold ${active ? "text-gray-900" : "text-gray-600"}`}
                  >
                    {v.label}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{v.desc}</p>
                </div>
                {active && (
                  <CheckCircle2 size={14} className="text-[#ffd700]" />
                )}
              </button>
            );
          })}
        </div>
        {errors.deliveryServiceType && (
          <p className="text-xs text-red-500 mt-1">
            {errors.deliveryServiceType}
          </p>
        )}
      </section>

      {/* ── Step B: Service name ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-6 h-6 bg-[#ffd700] text-black rounded-full text-xs
            font-black flex items-center justify-center flex-shrink-0"
          >
            2
          </span>
          <h3 className="font-bold text-sm text-gray-900">Name your service</h3>
        </div>
        <label className={lbl}>Service name</label>
        <input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. Fast Accra Rider · Same-day delivery"
          maxLength={120}
          className={`${inp} ${errors.title ? "border-red-400 bg-red-50" : ""}`}
        />
        {errors.title && (
          <p className="text-xs text-red-500 mt-1">{errors.title}</p>
        )}
        <p className={hint}>This is what customers will see first</p>
      </section>

      {/* ── Step C: Coverage area ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-6 h-6 bg-[#ffd700] text-black rounded-full text-xs
            font-black flex items-center justify-center flex-shrink-0"
          >
            3
          </span>
          <h3 className="font-bold text-sm text-gray-900">
            Where do you operate?
          </h3>
        </div>

        <div
          className="bg-blue-50 border border-blue-100 rounded-xl p-3
          flex items-start gap-2 mb-3"
        >
          <MapPin size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            Customers use this to see if you cover their area. Be specific —
            list neighbourhoods or zones.
          </p>
        </div>

        <label className={lbl}>Coverage area</label>
        <textarea
          value={form.deliveryCoverageArea}
          onChange={(e) => set("deliveryCoverageArea", e.target.value)}
          placeholder="e.g. Accra Central, Tema, Madina, East Legon — 30km radius"
          rows={3}
          className={`${inp} resize-none`}
        />
      </section>

      {/* ── Step D: Working hours ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-6 h-6 bg-[#ffd700] text-black rounded-full text-xs
            font-black flex items-center justify-center flex-shrink-0"
          >
            4
          </span>
          <h3 className="font-bold text-sm text-gray-900">Working hours</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {WORKING_HOURS_OPTIONS.map((h) => {
            const active = form.deliveryWorkingHours === h;
            return (
              <button
                type="button"
                key={h}
                onClick={() => set("deliveryWorkingHours", h)}
                className={[
                  "px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition",
                  active
                    ? "border-[#ffd700] bg-[#ffd700]/10 text-gray-900"
                    : "border-gray-200 text-gray-500 hover:border-gray-300",
                ].join(" ")}
              >
                <Clock size={11} className="inline mr-1.5 opacity-60" />
                {h}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Step E: Features / tracking ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-6 h-6 bg-[#ffd700] text-black rounded-full text-xs
            font-black flex items-center justify-center flex-shrink-0"
          >
            5
          </span>
          <h3 className="font-bold text-sm text-gray-900">Features</h3>
        </div>

        <div className="space-y-2">
          {/* Live tracking */}
          <label
            className={[
              "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition",
              form.deliveryHasTracking
                ? "border-[#ffd700] bg-[#ffd700]/10"
                : "border-gray-200 bg-white hover:border-gray-300",
            ].join(" ")}
          >
            <input
              type="checkbox"
              checked={form.deliveryHasTracking}
              onChange={(e) => set("deliveryHasTracking", e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center
              justify-center transition flex-shrink-0
              ${
                form.deliveryHasTracking
                  ? "border-[#ffd700] bg-[#ffd700]"
                  : "border-gray-300"
              }`}
            >
              {form.deliveryHasTracking && (
                <CheckCircle2 size={12} className="text-black" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Navigation size={13} className="text-teal-500" />
                Live tracking available
              </p>
              <p className="text-xs text-gray-400">
                Customers can see your location on a map
              </p>
            </div>
          </label>

          {/* Minimum order */}
          <div className="p-3.5 rounded-xl border border-gray-200 bg-white">
            <label className="text-sm font-bold text-gray-900 flex items-center gap-1.5 mb-2">
              <Zap size={13} className="text-yellow-500" />
              Minimum order amount (optional)
            </label>
            <input
              type="number"
              min="0"
              value={form.deliveryMinOrder}
              onChange={(e) => set("deliveryMinOrder", e.target.value)}
              placeholder="0 = no minimum"
              className={inp}
            />
          </div>
        </div>
      </section>

      {/* ── Step F: Description / what you tell customers ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-6 h-6 bg-[#ffd700] text-black rounded-full text-xs
            font-black flex items-center justify-center flex-shrink-0"
          >
            6
          </span>
          <h3 className="font-bold text-sm text-gray-900">
            Tell customers about your service
          </h3>
        </div>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="e.g. Professional same-day rider with 5 years experience. I handle fragile items with care. Text me first to confirm availability."
          rows={4}
          className={`${inp} resize-none ${errors.description ? "border-red-400 bg-red-50" : ""}`}
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description}</p>
        )}
      </section>

      {/* ── Trust badge ── */}
      <div
        className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100
        rounded-2xl"
      >
        <Shield size={18} className="text-green-500 flex-shrink-0" />
        <div>
          <p className="text-xs font-bold text-gray-900">
            Your profile is secure
          </p>
          <p className="text-[11px] text-gray-400">
            Customers can only contact you through SmileBaba — your phone number
            is protected.
          </p>
        </div>
      </div>
    </div>
  );
}
