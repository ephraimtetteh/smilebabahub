// src/components/SeoHead.tsx
//
// Drop this component INSIDE your existing <body> (preferably right at the top).
// Adds JSON-LD structured data and registers the PWA service worker.
//
// Usage (in your existing src/app/layout.tsx):
//
//   import SeoHead from "@/src/components/SeoHead";
//
//   return (
//     <html lang="en">
//       <body>
//         <SeoHead />
//         {/* your existing layout content */}
//         {children}
//       </body>
//     </html>
//   );

"use client";

import { useEffect } from "react";
import Script from "next/script";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://smilebabahub.com";
const SITE_NAME = "SmileBabaHub";

export default function SeoHead() {
  // Register service worker once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return; // skip in dev

    navigator.serviceWorker
      .register("/sw.js")
      .catch((e) => console.warn("SW registration failed:", e));
  }, []);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": SITE_URL,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Africa's all-in-one super app for buying, selling, eating, renting, and earning.",
    sameAs: [
      "https://www.facebook.com/smilebabahub",
      "https://www.instagram.com/smilebabahub",
      "https://www.youtube.com/@smilebabahub",
      "https://twitter.com/smilebabahub",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "support@smilebabahub.com",
      areaServed: ["GH", "NG"],
      availableLanguage: ["English"],
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: SITE_URL,
    name: SITE_NAME,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/ads?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Script
        id="ld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Script
        id="ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
    </>
  );
}
