// src/app/marketPlace/layout.tsx
// Next.js layout for all /marketPlace routes.
// Renders an SEO header (breadcrumb, H1, trust signals) above the page content.
// All icons are Lucide — flag emoji kept for 🇬🇭 / 🇳🇬 (accepted exception).

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Zap, MapPin } from "lucide-react";

// ── SEO Metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Marketplace — Buy & Sell in Ghana and Nigeria | SmileBaba",
  description:
    "Shop phones, laptops, cars, fashion, electronics and services from trusted vendors across Ghana and Nigeria. Post your ad free and reach thousands of buyers on SmileBaba Hub.",
  keywords: [
    "online marketplace Ghana",
    "buy and sell Nigeria",
    "phones for sale Ghana",
    "cars for sale Lagos",
    "electronics Accra",
    "fashion Nigeria",
    "SmileBaba marketplace",
    "post free ad Ghana",
    "second hand phones Ghana",
    "buy car Nigeria",
  ],
  openGraph: {
    title: "SmileBaba Marketplace — Buy & Sell in Ghana and Nigeria",
    description:
      "Find deals on phones, cars, electronics, fashion and more from verified vendors across Ghana and Nigeria.",
    url: "https://smilebabahub.com/marketPlace",
    siteName: "SmileBaba Hub",
    locale: "en_GH",
    type: "website",
    images: [
      {
        url: "https://smilebabahub.com/og-marketplace.jpg",
        width: 1200,
        height: 630,
        alt: "SmileBaba Marketplace — Ghana & Nigeria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmileBaba Marketplace — Buy & Sell in Ghana and Nigeria",
    description:
      "Phones, cars, fashion, electronics and services from verified vendors across Ghana and Nigeria.",
    images: ["https://smilebabahub.com/og-marketplace.jpg"],
  },
  alternates: { canonical: "https://smilebabahub.com/marketPlace" },
  robots: { index: true, follow: true },
};

// ── JSON-LD Structured data ───────────────────────────────────────────────────
const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "SmileBaba Marketplace",
  description:
    "Buy and sell phones, cars, electronics, fashion and services across Ghana and Nigeria.",
  url: "https://smilebabahub.com/marketPlace",
  provider: {
    "@type": "Organization",
    name: "SmileBaba Hub",
    url: "https://smilebabahub.com",
    logo: "https://smilebabahub.com/logo.png",
    areaServed: ["Ghana", "Nigeria"],
  },
};

// ── Trust signals ─────────────────────────────────────────────────────────────
// Flag emoji kept for Ghana / Nigeria — universally supported and expected UX.
type TrustItem = { icon: React.ReactNode; text: string };

const TRUST_ITEMS: TrustItem[] = [
  {
    icon: <CheckCircle2 size={13} className="text-green-600" />,
    text: "Verified vendors",
  },
  {
    icon: <span className="text-sm leading-none">🇬🇭</span>,
    text: "Available in Ghana",
  },
  {
    icon: <span className="text-sm leading-none">🇳🇬</span>,
    text: "Available in Nigeria",
  },
  {
    icon: <Zap size={13} className="text-yellow-600" />,
    text: "Free to post an ad",
  },
];

// ── Layout ────────────────────────────────────────────────────────────────────
export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* SEO header — visible to crawlers and users */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 pt-20 sm:pt-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="flex items-center gap-1.5 text-xs text-gray-400">
              <li>
                <Link href="/" className="hover:text-gray-600 transition">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-300">
                ›
              </li>
              <li className="text-gray-600 font-medium">Marketplace</li>
            </ol>
          </nav>

          {/* H1 */}
          {/* <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Marketplace — Buy &amp; Sell to thousands of customers
          </h1> */}

          {/* Subheader */}
          {/* <p className="text-sm sm:text-base text-gray-500 max-w-2xl leading-relaxed">
            Browse thousands of listings from verified vendors. Shop{" "}
            {["phones", "cars", "electronics", "fashion", "services"].map(
              (cat, i, arr) => (
                <span key={cat}>
                  <Link
                    href={`/ads?category=marketplace&sub=${cat}`}
                    className="text-yellow-600 hover:underline font-medium"
                  >
                    {cat}
                  </Link>
                  {i < arr.length - 1 ? ", " : " "}
                </span>
              ),
            )}
            — or{" "}
            <Link
              href="/sell"
              className="text-yellow-600 hover:underline font-medium"
            >
              post your free ad
            </Link>{" "}
            today.
          </p> */}

          {/* Trust signals */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            {TRUST_ITEMS.map((s) => (
              <div
                key={s.text}
                className="flex items-center gap-1.5 text-xs text-gray-500"
              >
                {s.icon}
                <span>{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Page content */}
      <main>{children}</main>
    </>
  );
}
