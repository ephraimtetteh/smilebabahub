// src/app/ads/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Ads — Buy & Sell Everything you need | SmileBaba",
    template: "%s | SmileBaba Ads",
  },
  description:
    "Browse classified ads for phones, cars, electronics, food, and apartments from verified sellers across Ghana and Nigeria.",
};

export default function AdsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
