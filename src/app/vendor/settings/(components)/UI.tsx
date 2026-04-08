"use client";
// src/components/vendor/settings/ui.tsx
// Shared UI primitives for all vendor settings tabs.
// Colour scheme: #ffc105 yellow — matches SmileBaba project theme.

import React from "react";
import { Loader2 } from "lucide-react";

// ── SectionCard ────────────────────────────────────────────────────────────
export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
      <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Field ──────────────────────────────────────────────────────────────────
export function Field({
  label,
  hint,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {hint && !error && (
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{hint}</p>
      )}
    </div>
  );
}

// ── Input ──────────────────────────────────────────────────────────────────
export function Input({
  className = "",
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={`w-full border rounded-xl px-3 py-2.5 text-sm text-gray-800
        focus:outline-none focus:ring-2 focus:ring-[#ffc105] focus:border-[#ffc105]
        placeholder:text-gray-300 bg-white transition
        ${error ? "border-red-300 bg-red-50" : "border-gray-200"}
        ${className}`}
    />
  );
}

// ── Select ─────────────────────────────────────────────────────────────────
export function Select({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
        focus:outline-none focus:ring-2 focus:ring-[#ffc105] focus:border-[#ffc105]
        bg-white transition ${className}`}
    >
      {children}
    </select>
  );
}

// ── Textarea ───────────────────────────────────────────────────────────────
export function Textarea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800
        focus:outline-none focus:ring-2 focus:ring-[#ffc105] focus:border-[#ffc105]
        placeholder:text-gray-300 bg-white transition resize-none ${className}`}
    />
  );
}

// ── Toggle ─────────────────────────────────────────────────────────────────
export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 leading-snug">
          {label}
        </p>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
          border-2 border-transparent transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-[#ffc105] focus:ring-offset-1
          ${checked ? "bg-[#ffc105]" : "bg-gray-200"}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow
          transition duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}

// ── SaveButton ─────────────────────────────────────────────────────────────
export function SaveButton({
  saving = false,
  label = "Save changes",
  onClick,
}: {
  saving?: boolean;
  label?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={saving}
      onClick={onClick}
      className="mt-2 flex items-center gap-2 px-6 py-2.5 bg-[#ffc105] hover:bg-yellow-300
        disabled:opacity-60 text-black text-sm font-black rounded-xl
        transition shadow-sm active:scale-95"
    >
      {saving && <Loader2 size={14} className="animate-spin" />}
      {saving ? "Saving…" : label}
    </button>
  );
}

// ── PhoneInput ─────────────────────────────────────────────────────────────
export function PhoneInput({
  value,
  onChange,
  placeholder = "244 123 456",
  country = "GH",
}: {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  country?: string;
}) {
  return (
    <div className="flex gap-2">
      <Select
        className="w-28 flex-shrink-0"
        value={country === "NG" ? "+234" : "+233"}
      >
        <option value="+233">🇬🇭 +233</option>
        <option value="+234">🇳🇬 +234</option>
      </Select>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}

// ── ImageUpload ────────────────────────────────────────────────────────────
export function ImageUpload({
  label,
  hint,
  value,
  icon,
  onChange,
  className = "",
}: {
  label: string;
  hint?: string;
  value?: string | null;
  icon: string;
  onChange: (url: string, file: File) => void;
  className?: string;
}) {
  const ref = React.useRef<HTMLInputElement>(null);
  return (
    <div>
      {label && (
        <p className="text-xs font-semibold text-gray-600 mb-1.5">{label}</p>
      )}
      <div
        onClick={() => ref.current?.click()}
        className={`w-full rounded-xl border-2 border-dashed cursor-pointer
          flex items-center justify-center overflow-hidden transition
          ${value ? "border-[#ffc105]" : "border-gray-200 hover:border-[#ffc105] bg-gray-50"}
          ${className}`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-4">
            <p className="text-2xl">{icon}</p>
            <p className="text-xs text-gray-400 mt-1">Click to upload</p>
            {hint && <p className="text-[11px] text-gray-300 mt-0.5">{hint}</p>}
          </div>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onChange(URL.createObjectURL(f), f);
        }}
      />
    </div>
  );
}

// ── Status badge ───────────────────────────────────────────────────────────
export function StatusBadge({
  status,
}: {
  status: "verified" | "pending" | "not_submitted";
}) {
  const map = {
    verified: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    not_submitted: "bg-gray-100 text-gray-500",
  };
  const label = {
    verified: "✓ Verified",
    pending: "⏳ Under review",
    not_submitted: "Not submitted",
  };
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${map[status]}`}
    >
      {label[status]}
    </span>
  );
}
