"use client";
// src/components/ads/ProductDetail/AdUI.tsx
// Lightweight shared UI — DetailRow and Section card.

import React from "react";
import Image from "next/image";
import { CheckCircle2, ImageOff } from "lucide-react";
import Link from "next/link";

export function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  if (!value) return null;
  return (
    <div
      className="flex items-start justify-between py-3
      border-b border-gray-100 last:border-0 gap-4"
    >
      <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
        {label}
      </span>
      <span className="text-sm text-gray-900 font-semibold text-right">
        {value}
      </span>
    </div>
  );
}

export function Section({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100
      overflow-hidden ${className}`}
    >
      {title && (
        <h3
          className="text-sm font-bold text-gray-500 uppercase tracking-wider
          px-5 pt-4 pb-2 border-b border-gray-100"
        >
          {title}
        </h3>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

// Reusable spinner shown inside buttons while loading
export function BtnSpinner({ label }: { label: string }) {
  return (
    <span className="flex items-center justify-center gap-2">
      <span
        className="w-4 h-4 border-2 border-black/30 border-t-black
        rounded-full animate-spin"
      />
      {label}
    </span>
  );
}

// Modal success screen (same layout for all three modals)
export function SuccessScreen({
  title,
  body,
  ctaHref,
  ctaLabel,
  onClose,
  dismissLabel = "Close",
}: {
  title: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
  onClose: () => void;
  dismissLabel?: string;
}) {
  
  return (
    <div className="p-8 text-center">
      <CheckCircle2 size={52} className="text-green-500 mx-auto mb-4" />
      <h4 className="text-xl font-black text-gray-900 mb-2">{title}</h4>
      <p className="text-sm text-gray-500 mb-6">{body}</p>
      <div className="space-y-2">
        <Link
          href={ctaHref}
          className="block w-full py-3 bg-[#ffc105] text-black font-bold
            rounded-2xl text-sm hover:bg-amber-400 transition text-center"
        >
          {ctaLabel}
        </Link>
        <button
          onClick={onClose}
          className="block w-full py-2.5 text-gray-500 text-sm hover:text-gray-700"
        >
          {dismissLabel}
        </button>
      </div>
    </div>
  );
}

// Thumbnail image row used inside modals
export function AdThumb({ ad }: { ad: any }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        {ad.images?.[0]?.url ? (
          <Image
            src={ad.images[0].url}
            alt={ad.title}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <ImageOff size={20} className="text-gray-300 m-auto mt-2" />
        )}
      </div>
      <div className="min-w-0 flex-1">{/* children injected by caller */}</div>
    </div>
  );
}
