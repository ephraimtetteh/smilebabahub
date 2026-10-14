"use client";

// src/components/home/TrustBar.tsx
// Responsive trust signal row. 2 cols on mobile, 4 on tablet, 6 on desktop.

import {
  Lock,
  Truck,
  ShieldCheck,
  Headphones,
  BarChart3,
  Smartphone,
} from "lucide-react";

const ITEMS = [
  { icon: Lock, title: "Secure Payments", sub: "100% safe" },
  { icon: Truck, title: "Fast Delivery", sub: "Across Ghana & Nigeria" },
  { icon: ShieldCheck, title: "Buyer Protection", sub: "Shop with confidence" },
  { icon: Headphones, title: "24/7 Support", sub: "We are here for you" },
  { icon: BarChart3, title: "Earn & Refer", sub: "Make money online" },
  { icon: Smartphone, title: "Download App", sub: "Shop on the go" },
];

export default function TrustBar() {
  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 py-3 sm:py-5">
      <div
        className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-5
        grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
      >
        {ITEMS.map((t) => (
          <div key={t.title} className="flex items-center gap-2 sm:gap-3">
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-yellow-50
              flex items-center justify-center flex-shrink-0"
            >
              <t.icon size={16} className="text-yellow-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-black text-gray-900 truncate">
                {t.title}
              </p>
              <p className="text-[9px] sm:text-[10px] text-gray-500 truncate">
                {t.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
