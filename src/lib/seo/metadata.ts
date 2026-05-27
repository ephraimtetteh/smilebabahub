// src/lib/seo/metadata.ts
//
// SEO metadata — import and SPREAD into your existing layout.tsx.
//
// Usage (your existing src/app/layout.tsx):
//
//   import { siteMetadata, siteViewport } from "@/src/lib/seo/metadata";
//
//   export const metadata = siteMetadata;
//   export const viewport = siteViewport;
//
// (Or if you already export `metadata` with custom fields, do:
//   export const metadata = { ...siteMetadata, title: "My Page" };)

import type { Metadata, Viewport } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://smilebabahub.com";
const SITE_NAME = "SmileBabaHub";

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SmileBabaHub — Africa's All-in-One Super App",
    template: "%s | SmileBabaHub",
  },
  description:
    "Buy, sell, eat, rent, and earn — all in one place. Ghana & Nigeria's trusted marketplace " +
    "for products, food, apartments, services, and more.",
  keywords: [
    "Ghana marketplace",
    "Nigeria marketplace",
    "online shopping Ghana",
    "buy sell Africa",
    "Accra classifieds",
    "Lagos classifieds",
    "food delivery Ghana",
    "apartment rental Lagos",
    "vendor platform",
    "African ecommerce",
    "SmileBaba",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  category: "shopping",
  manifest: "/manifest.json",

  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },

  openGraph: {
    type: "website",
    locale: "en_GH",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "SmileBabaHub — Africa's All-in-One Super App",
    description:
      "Buy, sell, eat, rent, and earn. Trusted by thousands across Ghana and Nigeria.",
    images: [
      {
        url: `${SITE_URL}/og/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "SmileBabaHub marketplace",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@smilebabahub",
    creator: "@smilebabahub",
    title: "SmileBabaHub — Africa's All-in-One Super App",
    description:
      "Buy, sell, eat, rent, earn. Ghana & Nigeria's trusted marketplace.",
    images: [`${SITE_URL}/og/og-default.jpg`],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-GH": `${SITE_URL}/?country=Ghana`,
      "en-NG": `${SITE_URL}/?country=Nigeria`,
    },
  },

  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },

  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const siteViewport: Viewport = {
  themeColor: "#ffc105",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};
