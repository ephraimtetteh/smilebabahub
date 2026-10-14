"use client";
// src/components/ads/PharmacyOnboarding.tsx
// Specialised onboarding form for pharmacy category ads.
// Ensures sellers provide accurate, safe product information.

import { AdFormData } from "@/src/types/adForm.types";
import {
  Pill,
  Leaf,
  ShieldCheck,
  AlertTriangle,
  Package,
  Calendar,
  Thermometer,
  CheckCircle2,
  FlaskConical,
  BadgeCheck,
} from "lucide-react";

const PRODUCT_TYPES = [
  {
    id: "otc",
    label: "OTC Drug",
    icon: <Pill size={20} />,
    desc: "No prescription needed",
  },
  {
    id: "supplement",
    label: "Supplement",
    icon: <Leaf size={20} />,
    desc: "Vitamins & health boosts",
  },
  {
    id: "equipment",
    label: "Medical Equipment",
    icon: <FlaskConical size={20} />,
    desc: "Devices & instruments",
  },
  {
    id: "personal-care",
    label: "Personal Care",
    icon: <Package size={20} />,
    desc: "Skincare, hygiene",
  },
  {
    id: "baby-care",
    label: "Baby Care",
    icon: <Package size={20} />,
    desc: "For infants & toddlers",
  },
];

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

export default function PharmacyOnboarding({ form, set, errors }: Props) {
  return (
    <div className="space-y-6">
      {/* ── Safety notice ── */}
      <div
        className="bg-blue-950 text-white rounded-2xl px-5 py-5
        flex items-start gap-4"
      >
        <div
          className="w-12 h-12 bg-blue-500 rounded-xl flex items-center
          justify-center flex-shrink-0"
        >
          <ShieldCheck size={22} className="text-white" />
        </div>
        <div>
          <h2 className="font-black text-base leading-tight">
            Pharmacy listing guidelines
          </h2>
          <p className="text-sm text-blue-300 mt-1 leading-relaxed">
            Only list genuine, unexpired products. Prescription drugs require
            authorisation. Falsified listings are removed and accounts
            suspended.
          </p>
        </div>
      </div>

      {/* ── Step A: Product type ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-6 h-6 bg-[#ffd700] text-black rounded-full text-xs
            font-black flex items-center justify-center flex-shrink-0"
          >
            1
          </span>
          <h3 className="font-bold text-sm text-gray-900">Product type</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PRODUCT_TYPES.map((p) => {
            const active = form.pharmacyProductType === p.id;
            return (
              <button
                type="button"
                key={p.id}
                onClick={() => set("pharmacyProductType", p.id)}
                className={[
                  "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center",
                  "transition-all duration-150 active:scale-95",
                  active
                    ? "border-[#ffd700] bg-[#ffd700]/10"
                    : "border-gray-200 bg-white hover:border-gray-300",
                ].join(" ")}
              >
                <span className={active ? "text-gray-900" : "text-gray-400"}>
                  {p.icon}
                </span>
                <div>
                  <p
                    className={`text-xs font-bold ${active ? "text-gray-900" : "text-gray-600"}`}
                  >
                    {p.label}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{p.desc}</p>
                </div>
                {active && (
                  <CheckCircle2 size={13} className="text-[#ffd700]" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Step B: Product name ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-6 h-6 bg-[#ffd700] text-black rounded-full text-xs
            font-black flex items-center justify-center flex-shrink-0"
          >
            2
          </span>
          <h3 className="font-bold text-sm text-gray-900">
            Product name & brand
          </h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className={lbl}>Product name *</label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Paracetamol 500mg Tablets"
              maxLength={120}
              className={`${inp} ${errors.title ? "border-red-400 bg-red-50" : ""}`}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>
          <div>
            <label className={lbl}>Brand / Manufacturer</label>
            <input
              value={form.pharmacyBrand}
              onChange={(e) => set("pharmacyBrand", e.target.value)}
              placeholder="e.g. GSK, Emzor, PharmaDeko"
              className={inp}
            />
          </div>
        </div>
      </section>

      {/* ── Step C: Dosage & pack size ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-6 h-6 bg-[#ffd700] text-black rounded-full text-xs
            font-black flex items-center justify-center flex-shrink-0"
          >
            3
          </span>
          <h3 className="font-bold text-sm text-gray-900">
            Dosage & pack size
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Dosage / Strength</label>
            <input
              value={form.pharmacyDosage}
              onChange={(e) => set("pharmacyDosage", e.target.value)}
              placeholder="e.g. 500mg, 10mg/5ml"
              className={inp}
            />
            <p className={hint}>Leave blank for equipment / personal care</p>
          </div>
          <div>
            <label className={lbl}>Pack size / Quantity</label>
            <input
              value={form.pharmacyPackSize}
              onChange={(e) => set("pharmacyPackSize", e.target.value)}
              placeholder="e.g. 30 tablets, 200ml"
              className={inp}
            />
          </div>
        </div>
      </section>

      {/* ── Step D: Expiry & registration ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-6 h-6 bg-[#ffd700] text-black rounded-full text-xs
            font-black flex items-center justify-center flex-shrink-0"
          >
            4
          </span>
          <h3 className="font-bold text-sm text-gray-900">
            Expiry & registration
          </h3>
        </div>

        <div
          className="bg-amber-50 border border-amber-200 rounded-xl p-3
          flex items-start gap-2 mb-3"
        >
          <AlertTriangle
            size={14}
            className="text-amber-500 flex-shrink-0 mt-0.5"
          />
          <p className="text-xs text-amber-700">
            Never list expired products. Listings are removed and accounts
            banned.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Expiry date</label>
            <input
              type="month"
              value={form.pharmacyExpiryDate}
              onChange={(e) => set("pharmacyExpiryDate", e.target.value)}
              min={new Date().toISOString().slice(0, 7)}
              className={inp}
            />
            <p className={hint}>Must be a future date</p>
          </div>
          <div>
            <label className={lbl}>NAFDAC / FDA Reg. No.</label>
            <input
              value={form.pharmacyNafdacNo}
              onChange={(e) => set("pharmacyNafdacNo", e.target.value)}
              placeholder="e.g. A4-1234"
              className={inp}
            />
            <p className={hint}>Optional but builds trust</p>
          </div>
        </div>
      </section>

      {/* ── Step E: Storage & prescription ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-6 h-6 bg-[#ffd700] text-black rounded-full text-xs
            font-black flex items-center justify-center flex-shrink-0"
          >
            5
          </span>
          <h3 className="font-bold text-sm text-gray-900">
            Storage & restrictions
          </h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className={lbl}>
              <Thermometer size={11} className="inline mr-1" />
              Storage instructions
            </label>
            <input
              value={form.pharmacyStorageInfo}
              onChange={(e) => set("pharmacyStorageInfo", e.target.value)}
              placeholder="e.g. Store below 25°C, keep away from sunlight"
              className={inp}
            />
          </div>

          {/* Prescription required toggle */}
          <label
            className={[
              "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition",
              form.pharmacyPrescription
                ? "border-red-300 bg-red-50"
                : "border-gray-200 bg-white hover:border-gray-300",
            ].join(" ")}
          >
            <input
              type="checkbox"
              checked={form.pharmacyPrescription}
              onChange={(e) => set("pharmacyPrescription", e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center
              justify-center transition flex-shrink-0
              ${
                form.pharmacyPrescription
                  ? "border-red-400 bg-red-400"
                  : "border-gray-300"
              }`}
            >
              {form.pharmacyPrescription && (
                <CheckCircle2 size={12} className="text-white" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                Prescription required
              </p>
              <p className="text-xs text-gray-400">
                Buyers must present a valid prescription to purchase
              </p>
            </div>
          </label>
        </div>
      </section>

      {/* ── Step F: Full description ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-6 h-6 bg-[#ffd700] text-black rounded-full text-xs
            font-black flex items-center justify-center flex-shrink-0"
          >
            6
          </span>
          <h3 className="font-bold text-sm text-gray-900">
            Product description
          </h3>
        </div>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Describe the product — uses, benefits, any contraindications, what's included in the pack."
          rows={4}
          className={`${inp} resize-none ${errors.description ? "border-red-400 bg-red-50" : ""}`}
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description}</p>
        )}
      </section>

      {/* ── Verification badge ── */}
      <div
        className="flex items-center gap-3 p-4 bg-green-50 border
        border-green-100 rounded-2xl"
      >
        <BadgeCheck size={20} className="text-green-500 flex-shrink-0" />
        <div>
          <p className="text-xs font-bold text-gray-900">
            Genuine products only
          </p>
          <p className="text-[11px] text-gray-400">
            By listing, you confirm this product is genuine, unexpired, and
            legally approved for sale in your country.
          </p>
        </div>
      </div>
    </div>
  );
}
