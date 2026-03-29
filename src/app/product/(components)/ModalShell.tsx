"use client";
// src/components/ads/ProductDetail/ModalShell.tsx
// Shared modal backdrop + container + header used by all three modals.

import React from "react";
import { X } from "lucide-react";

interface ModalShellProps {
  icon: React.ReactNode;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ModalShell({
  icon,
  title,
  onClose,
  children,
}: ModalShellProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center
      justify-center p-4"
    >
      <div
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden
        max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5 border-b border-gray-100
          sticky top-0 bg-white z-10"
        >
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-black text-gray-900 text-lg">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center
              justify-center hover:bg-gray-200 transition flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
