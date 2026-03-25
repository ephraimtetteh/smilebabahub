import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { ToastContainer } from "react-toastify";
import LayoutWrapper from "@/src/components/LayoutShell";
import { RadioProvider } from "@/src/components/RadioContext";

// ── Font 
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-outfit",
});

// ── Viewport (separate from metadata in Next.js 14+)
export const viewport: Viewport = {
  themeColor: "#ffc105",
  width: "device-width",
  initialScale: 1,
};

// ── Root metadata 
export const metadata: Metadata = {
  // %s is replaced by page-level titles e.g. "Marketplace | SmileBaba Hub"
  title: {
    default: "SmileBaba Hub — Buy, Sell Everything you need",
    template: "%s | SmileBaba Hub",
  },
  description:
    "SmileBaba Hub is the trusted online marketplace to buy and sell products, food, and apartments across Ghana and Nigeria. Discover great deals, connect with verified vendors, and shop smarter every day.",
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
    "food delivery Ghana",
    "apartments Ghana",
    "short stay Accra",
  ],
  authors: [{ name: "SmileBaba Hub", url: "https://smilebabahub.com" }],
  creator: "SmileBaba Hub",
  metadataBase: new URL("https://smilebabahub.com"),

  openGraph: {
    title: "SmileBaba Hub — Buy & Sell in Ghana and Nigeria",
    description:
      "Find deals on phones, cars, electronics, food, fashion, and apartments from verified vendors across Ghana and Nigeria.",
    url: "https://smilebabahub.com",
    siteName: "SmileBaba Hub",
    locale: "en_GH",
    type: "website",
    images: [
      {
        url: "/og-home.jpg", 
        width: 1200,
        height: 630,
        alt: "SmileBaba Hub — Ghana & Nigeria Online Marketplace",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SmileBaba Hub — Buy & Sell in Ghana and Nigeria",
    description:
      "Phones, cars, food, fashion and apartments from verified vendors across Ghana and Nigeria.",
    images: ["/og-home.jpg"],
    site: "@smilebabahub", // 
  },

  alternates: {
    canonical: "https://smilebabahub.com",
  },

  // Favicon + icons — replaces the <Head> block
  icons: {
    icon: "/logo1.png",
    shortcut: "/logo1.png",
    apple: "/logo1.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

// ── Root layout ────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={`relative min-h-screen ${outfit.className} antialiased`}>
       
            <RadioProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </RadioProvider>

        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss={false}
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
