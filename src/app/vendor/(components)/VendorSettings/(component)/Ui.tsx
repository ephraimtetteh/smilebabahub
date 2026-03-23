"use client";

import React from "react";

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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5 sm:mb-6">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gray-50/60">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

// ── Field ──────────────────────────────────────────────────────────────────
export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 sm:mb-5">
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      {children}
      {hint && (
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{hint}</p>
      )}
    </div>
  );
}

// ── Input ──────────────────────────────────────────────────────────────────
export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 text-sm text-gray-800
        focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
        placeholder:text-gray-300 bg-white transition ${className}`}
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
      className={`w-full border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 text-sm text-gray-800
        focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
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
      className={`w-full border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 text-sm text-gray-800
        focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
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
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1
          ${checked ? "bg-yellow-500" : "bg-gray-200"}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200
            ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}

// ── SaveButton ─────────────────────────────────────────────────────────────
export function SaveButton({ loading = false }: { loading?: boolean }) {
  return (
    <button
      type="button"
      disabled={loading}
      className="mt-2 w-full sm:w-auto px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600
        disabled:bg-yellow-300 text-white text-sm font-semibold rounded-xl
        transition shadow-sm shadow-yellow-200 active:scale-95"
    >
      {loading ? "Saving…" : "Save changes"}
    </button>
  );
}

// ── PhoneInput ─────────────────────────────────────────────────────────────
export function PhoneInput({
  value,
  onChange,
  placeholder = "244 123 456",
}: {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex gap-2">
      <Select className="w-28 flex-shrink-0">
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

// ── UploadBox ──────────────────────────────────────────────────────────────
export function UploadBox({
  onClick,
  icon,
  label,
  hint,
  className = "",
}: {
  onClick: () => void;
  icon: string;
  label: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={`w-full rounded-xl border-2 border-dashed border-gray-200 bg-gray-50
        hover:border-yellow-300 hover:bg-yellow-50/50 transition cursor-pointer
        flex flex-col items-center justify-center text-center p-4 ${className}`}
    >
      <p className="text-2xl sm:text-3xl mb-1.5">{icon}</p>
      <p className="text-xs font-medium text-gray-600">{label}</p>
      {hint && <p className="text-[11px] text-gray-400 mt-0.5">{hint}</p>}
    </div>
  );
}
