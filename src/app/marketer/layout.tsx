// app/marketPlace/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";

// ── SEO Metadata ───────────────────────────────────────────────────────────
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
  alternates: {
    canonical: "https://smilebabahub.com/marketPlace",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ── Structured data (JSON-LD) ──────────────────────────────────────────────
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

// ── Layout ─────────────────────────────────────────────────────────────────
export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ── SEO hero header ── */}
      {/* Visible to search crawlers and users — improves on-page SEO signals */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="flex items-center gap-1.5 text-xs text-gray-400">
              <li>
                <Link href="/" className="hover:text-gray-600 transition">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li className="text-gray-600 font-medium">Marketplace</li>
            </ol>
          </nav>

          {/* H1 — primary keyword target */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Marketplace — Buy &amp; Sell in Ghana and Nigeria
          </h1>

          {/* Subheader — secondary keywords + value proposition */}
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl leading-relaxed">
            Browse thousands of listings from verified vendors across Ghana and
            Nigeria. Shop{" "}
            <a
              href="/marketPlace?category=phones"
              className="text-yellow-600 hover:underline font-medium"
            >
              phones
            </a>
            ,{" "}
            <a
              href="/marketPlace?category=cars"
              className="text-yellow-600 hover:underline font-medium"
            >
              cars
            </a>
            ,{" "}
            <a
              href="/marketPlace?category=electronics"
              className="text-yellow-600 hover:underline font-medium"
            >
              electronics
            </a>
            ,{" "}
            <a
              href="/marketPlace?category=fashion"
              className="text-yellow-600 hover:underline font-medium"
            >
              fashion
            </a>
            , and{" "}
            <a
              href="/marketPlace?category=services"
              className="text-yellow-600 hover:underline font-medium"
            >
              services
            </a>{" "}
            — or{" "}
            <a
              href="/sell"
              className="text-yellow-600 hover:underline font-medium"
            >
              post your free ad
            </a>{" "}
            today.
          </p>

          {/* Trust signals strip */}
          <div className="flex flex-wrap gap-4 mt-4">
            {[
              { icon: "✅", text: "Verified vendors" },
              { icon: "🇬🇭", text: "Available in Ghana" },
              { icon: "🇳🇬", text: "Available in Nigeria" },
              { icon: "🚀", text: "Free to post an ad" },
            ].map((s) => (
              <div
                key={s.text}
                className="flex items-center gap-1.5 text-xs text-gray-500"
              >
                <span>{s.icon}</span>
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
