This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



src/
├── app/                         Next.js App Router pages
│   ├── layout.tsx               Root layout (providers, toast, navbar)
│   ├── page.tsx                 Home page
│   ├── ads/
│   │   ├── page.tsx             AdsLandingPage — public feed
│   │   ├── [id]/page.tsx        AdDetail — single ad view
│   │   ├── [id]/edit/page.tsx   EditAdPage — edit own ad
│   │   └── my/page.tsx          MyAdsPage — vendor's own ads
│   ├── sell/page.tsx            SellPage — post new ad
│   ├── product/[id]/page.tsx    ProductDetails — product view
│   ├── marketPlace/page.tsx     Marketplace category landing
│   ├── food/page.tsx            Food category landing
│   ├── restate/page.tsx         Real estate category landing
│   ├── subscribe/page.tsx       Subscription plans
│   ├── payment-success/page.tsx Payment confirmed
│   ├── payment-failed/page.tsx  Payment failed
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── vendor/
│       ├── dashboard/page.tsx   Vendor analytics dashboard
│       ├── products/page.tsx    Vendor product management
│       └── orders/page.tsx      Order summary
│
├── components/
│   ├── ads/                     Ad-specific components
│   │   ├── AdForm.tsx           Multi-step ad posting form
│   │   ├── AdCard.tsx           Single ad card
│   │   ├── AdGrid.tsx           Responsive ad grid
│   │   ├── BestsellersRow.tsx   Boosted ads row
│   │   ├── AdsHero.tsx          Hero search section
│   │   ├── CategoryTabs.tsx     Category filter tabs
│   │   ├── FiltersPanel.tsx     Advanced filters
│   │   ├── AdModals.tsx         Boost + delete confirm modals
│   │   └── ad.constants.ts      Format helpers, badge configs
│   ├── category/
│   │   └── CategoryShared.tsx   Shared layout for category pages
│   ├── VendorComponents/
│   │   ├── VendorProductCard.tsx
│   │   ├── VendorStatsStrip.tsx
│   │   ├── VendorStatusTabs.tsx
│   │   └── VendorProductSkeleton.tsx
│   ├── FeaturedProducts.tsx     Homepage featured section
│   ├── FeaturedCard.tsx         Featured product card
│   ├── Navbar.tsx               Top navigation
│   ├── Radio.tsx                Live radio player
│   ├── Video.tsx                Promotional video + CTA
│   ├── NewSearch.tsx            Marketplace search bar
│   ├── NotificationBell.tsx     Notification dropdown
│   └── ProtectedRoute.tsx       Auth/role guard wrapper
│
├── store/
│   ├── store.ts                 Redux store config
│   ├── authSlice.ts             Auth state
│   ├── authActions.ts           Auth thunks
│   ├── adsSlice.ts              Ads state
│   ├── adsActions.ts            Ads thunks
│   ├── productsSlice.ts         Products state
│   └── productsActions.ts       Products thunks
│
├── hooks/
│   ├── useAds.ts                Convenience wrapper for ads Redux
│   ├── useProducts.ts           Convenience wrapper for products Redux
│   ├── useSubscriptionGuard.ts  Redirect to /subscribe if not vendor
│   ├── useResumeAction.ts       Resume pending action after payment
│   └── useAppUpdates.ts         Connect to SSE for deploy notifications
│
├── lib/
│   ├── api/axios.ts             Axios instance with token interceptor
│   ├── uploadToCloudinary.ts    Browser-side Cloudinary upload
│   └── cloudinary.js            Backend Cloudinary config (delete images)
│
└── types/
    ├── ad.types.ts              All ad TypeScript types
    ├── product.types.ts         Product types
    ├── adForm.types.ts          Form data types
    └── types.ts                 User, auth response types







    import Hero from "@/src/components/Hero";
import Video from "@/src/components/Video";
import React from "react";
import AppDownload from "@/src/components/App";
import FeaturedProducts from "../components/FeaturedProducts";

const HomePage = () => {
  return (
    <div className="w-full flex flex-col flex-1 items-center justify-center max-relative">
      {/* Hero renders the fixed background + a spacer div */}
      <Hero />

      {/* Scrollable content — sits on top of the fixed hero via z-10 + white bg */}
      <div className="max-sm:relative w-full bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="w-full flex flex-col px-4 md:px-16 lg:px-14 xl:px-12">
          <FeaturedProducts category="apartments" />
          <div className="items-center justify-center w-full gap-8 px-3 lg:px-12 mt-10 mb-5">
            <div className="w-full">
              <h1 className="lg:text-4xl font-bold py-12 capitalize text-center">
                Promote your Business & products <br /> Live On smileBaba TV
              </h1>
              <Video />
            </div>
          </div>
       
          <FeaturedProducts category="food" />
          <FeaturedProducts category="marketplace" />
        </div>
        <AppDownload />
      </div>
    </div>
  );
};

export default HomePage;



"use client";

// src/app/page.tsx — SmileBaba Hub Homepage

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ChevronRight,
  MapPin,
  Smartphone,
  ShoppingBag,
  UtensilsCrossed,
  Home,
  Star,
  ArrowRight,
  Apple,
  Play,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Package,
} from "lucide-react";
import { useAppSelector } from "@/src/app/redux";

import FeaturedProducts from "@/src/components/FeaturedProducts";
import Video from "@/src/components/Video";
import Radio from "@/src/components/Radio";

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────
function Hero() {
  const user = useAppSelector((s) => s.auth.user);
  const country = user?.country ?? "Ghana";
  const flag = country === "Nigeria" ? "🇳🇬" : "🇬🇭";

  return (
    <section
      className="relative w-full min-h-[90vh] flex items-center
      justify-center overflow-hidden bg-[#0f0f0f]"
    >
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full
          bg-yellow-400/20 blur-[120px]"
        />
        <div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full
          bg-yellow-600/15 blur-[100px]"
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[800px] h-[400px] rounded-full bg-amber-400/10 blur-[80px]"
        />
      </div>

      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8
        flex flex-col items-center text-center py-20"
      >
        {/* Country badge */}
        <div
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm
          border border-white/20 text-white/80 text-xs font-semibold
          px-4 py-2 rounded-full mb-6"
        >
          <span>{flag}</span>
          <span>#1 Marketplace in {country}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400">Live</span>
        </div>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black
          text-white leading-[1.1] mb-6 tracking-tight"
        >
          Buy & Sell
          <span
            className="block text-transparent bg-clip-text
            bg-gradient-to-r from-yellow-400 to-amber-500"
          >
            Anything in {country}
          </span>
        </h1>

        <p className="text-white/60 text-base sm:text-lg max-w-xl mb-10 leading-relaxed">
          From smartphones to street food, apartments to services — SmileBaba
          connects buyers and sellers across {country}.
        </p>

        {/* Search bar */}
        <div className="w-full max-w-2xl">
          <Link
            href="/ads"
            className="flex items-center bg-white rounded-2xl px-5 py-4 gap-3
              shadow-2xl shadow-black/50 hover:shadow-yellow-400/20
              transition-all duration-300 group"
          >
            <Search size={20} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-400 text-sm sm:text-base flex-1 text-left">
              Search products, food, apartments in {country}…
            </span>
            <div
              className="flex-shrink-0 bg-[#ffc105] text-black font-bold
              px-4 py-2 rounded-xl text-sm flex items-center gap-1.5
              group-hover:bg-amber-400 transition"
            >
              Search <ArrowRight size={14} />
            </div>
          </Link>
        </div>

        {/* Quick category links */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          {[
            {
              label: "Marketplace",
              icon: <ShoppingBag size={14} />,
              href: "/marketPlace",
            },
            {
              label: "Food",
              icon: <UtensilsCrossed size={14} />,
              href: "/food",
            },
            { label: "Apartments", icon: <Home size={14} />, href: "/restate" },
            {
              label: "Electronics",
              icon: <Smartphone size={14} />,
              href: "/ads?category=marketplace&sub=electronics",
            },
          ].map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20
                backdrop-blur-sm border border-white/20 text-white text-xs
                font-semibold px-4 py-2 rounded-full transition-all"
            >
              {c.icon} {c.label}
            </Link>
          ))}
        </div>

        {/* Stats row */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10
          mt-12 text-white/60 text-xs sm:text-sm"
        >
          {[
            { value: "50K+", label: "Active listings" },
            { value: "12K+", label: "Verified vendors" },
            { value: "2", label: "Countries" },
            { value: "100K+", label: "Monthly visitors" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5">
              <span className="text-xl sm:text-2xl font-black text-white">
                {s.value}
              </span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          className="w-full fill-white"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRUST BAR
// ─────────────────────────────────────────────────────────────────────────────
function TrustBar() {
  const items = [
    {
      icon: <Shield size={18} className="text-green-600" />,
      text: "Verified Sellers",
      sub: "All vendors are reviewed",
    },
    {
      icon: <Zap size={18} className="text-yellow-600" />,
      text: "Instant Contact",
      sub: "Call or WhatsApp sellers",
    },
    {
      icon: <MapPin size={18} className="text-blue-600" />,
      text: "Local Listings",
      sub: "Filtered by your country",
    },
    {
      icon: <Users size={18} className="text-purple-600" />,
      text: "Growing Community",
      sub: "12,000+ active vendors",
    },
  ];

  return (
    <div className="w-full border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50
                transition"
            >
              <div
                className="w-9 h-9 rounded-xl bg-gray-100 flex items-center
                justify-center flex-shrink-0"
              >
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">
                  {item.text}
                </p>
                <p className="text-[10px] text-gray-400 truncate">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
function Section({
  title,
  sub,
  children,
  className = "",
}: {
  title?: string;
  sub?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`w-full py-10 ${className}`}>
      {title && (
        <div className="mb-6 px-1">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            {title}
          </h2>
          {sub && <p className="text-sm text-gray-400 mt-1">{sub}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: <Search size={24} className="text-yellow-600" />,
      title: "Browse or Search",
      desc: "Search by category, location, or keyword. Listings are filtered to your country.",
      color: "bg-yellow-50",
    },
    {
      n: "02",
      icon: <Users size={24} className="text-blue-600" />,
      title: "Contact the Seller",
      desc: "Tap to reveal the seller's phone number or send a WhatsApp message directly.",
      color: "bg-blue-50",
    },
    {
      n: "03",
      icon: <Shield size={24} className="text-green-600" />,
      title: "Meet & Pay Safely",
      desc: "Meet in a public place, inspect the item, and pay only when satisfied.",
      color: "bg-green-50",
    },
    {
      n: "04",
      icon: <Package size={24} className="text-purple-600" />,
      title: "Sell Your Items",
      desc: "Post your first ad free. Upgrade to a vendor plan to post unlimited listings.",
      color: "bg-purple-50",
    },
  ];

  return (
    <Section title="How it works" sub="Buying and selling made simple">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s) => (
          <div
            key={s.n}
            className="relative bg-white rounded-3xl border border-gray-100
              shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <span
              className="absolute top-4 right-4 text-[11px] font-black
              text-gray-200"
            >
              {s.n}
            </span>
            <div
              className={`w-12 h-12 rounded-2xl ${s.color} flex items-center
              justify-center mb-4`}
            >
              {s.icon}
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">{s.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP DOWNLOAD
// ─────────────────────────────────────────────────────────────────────────────
function AppDownload() {
  return (
    <section className="w-full bg-[#0f0f0f] py-16 px-4 overflow-hidden relative">
      {/* Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]
        bg-yellow-400/10 blur-[100px] pointer-events-none"
      />

      <div
        className="relative z-10 max-w-5xl mx-auto flex flex-col lg:flex-row
        items-center gap-10"
      >
        {/* Left */}
        <div className="flex-1 text-center lg:text-left">
          <div
            className="inline-flex items-center gap-2 bg-yellow-400/10
            border border-yellow-400/30 text-yellow-400 text-xs font-bold
            px-3 py-1.5 rounded-full mb-5"
          >
            <Zap size={11} /> Coming soon
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
            SmileBaba in your
            <span className="text-yellow-400"> pocket</span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-7 max-w-md">
            Get instant notifications when new listings match your search. Chat
            with sellers, track your ads, and manage your store — all from the
            SmileBaba mobile app.
          </p>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            {/* App Store */}
            <button
              className="flex items-center gap-3 bg-white text-black
              px-5 py-3 rounded-2xl font-semibold text-sm hover:bg-gray-100
              transition active:scale-95"
            >
              <Apple size={20} />
              <div className="text-left">
                <p className="text-[10px] text-gray-500 leading-none">
                  Download on the
                </p>
                <p className="font-black leading-tight">App Store</p>
              </div>
            </button>

            {/* Google Play */}
            <button
              className="flex items-center gap-3 bg-white/10 border
              border-white/20 text-white px-5 py-3 rounded-2xl font-semibold
              text-sm hover:bg-white/15 transition active:scale-95"
            >
              <Play size={18} className="fill-white" />
              <div className="text-left">
                <p className="text-[10px] text-white/50 leading-none">
                  Get it on
                </p>
                <p className="font-black leading-tight">Google Play</p>
              </div>
            </button>
          </div>

          {/* Mini stats */}
          <div className="flex gap-6 mt-8 justify-center lg:justify-start">
            {[
              { value: "4.8", label: "App Store rating" },
              { value: "50K+", label: "Downloads" },
              { value: "Free", label: "Always" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl font-black text-white">{s.value}</p>
                <p className="text-[10px] text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — phone mockup */}
        <div className="flex-shrink-0 relative">
          <div
            className="w-56 sm:w-64 aspect-[9/19] bg-gradient-to-b from-gray-800
            to-gray-900 rounded-[3rem] border-4 border-gray-700 shadow-2xl
            flex flex-col items-center justify-center overflow-hidden
            relative"
          >
            {/* Notch */}
            <div className="absolute top-4 w-24 h-5 bg-gray-900 rounded-full z-10" />
            {/* Screen content */}
            <div
              className="w-full h-full bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]
              flex items-center justify-center"
            >
              <div className="text-center">
                <div
                  className="w-16 h-16 bg-[#ffc105] rounded-2xl flex items-center
                  justify-center mx-auto mb-3 shadow-xl shadow-yellow-400/40"
                >
                  <ShoppingBag size={28} className="text-black" />
                </div>
                <p className="text-white font-black text-lg">SmileBaba</p>
                <p className="text-white/40 text-xs mt-1">
                  Buy &amp; Sell Locally
                </p>
              </div>
            </div>
            {/* Home indicator */}
            <div className="absolute bottom-3 w-20 h-1 bg-gray-600 rounded-full" />
          </div>

          {/* Floating badge */}
          <div
            className="absolute -top-3 -right-3 bg-yellow-400 text-black
            text-xs font-black px-3 py-1.5 rounded-full shadow-lg
            flex items-center gap-1"
          >
            <Star size={11} className="fill-black" /> 4.8
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SELL CTA
// ─────────────────────────────────────────────────────────────────────────────
function SellCta() {
  const user = useAppSelector((s) => s.auth.user);

  return (
    <section className="w-full py-10 px-1">
      <div
        className="bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500
        rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center
        justify-between gap-6 shadow-xl shadow-yellow-400/20 relative overflow-hidden"
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 bg-white/10
          rounded-full pointer-events-none"
        />
        <div
          className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10
          rounded-full pointer-events-none"
        />

        <div className="relative z-10 text-center sm:text-left">
          <p className="text-2xl sm:text-3xl font-black text-black mb-2">
            Start selling today
          </p>
          <p className="text-black/60 text-sm max-w-md">
            {user
              ? `Post your first listing as ${user.username} and reach thousands of buyers in ${user.country}.`
              : "Create a free account and start reaching thousands of buyers in your area."}
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-3 flex-shrink-0">
          {user ? (
            <Link
              href="/sell"
              className="flex items-center gap-2 bg-black text-white font-bold
                px-7 py-3.5 rounded-2xl text-sm hover:bg-gray-900 transition
                active:scale-95 whitespace-nowrap"
            >
              <Package size={16} /> Post an ad
            </Link>
          ) : (
            <>
              <Link
                href="/auth/register"
                className="flex items-center gap-2 bg-black text-white font-bold
                  px-7 py-3.5 rounded-2xl text-sm hover:bg-gray-900 transition
                  active:scale-95 whitespace-nowrap"
              >
                Get started free
              </Link>
              <Link
                href="/ads"
                className="flex items-center gap-2 bg-white/80 text-black font-semibold
                  px-7 py-3.5 rounded-2xl text-sm hover:bg-white transition
                  whitespace-nowrap"
              >
                Browse listings <ChevronRight size={14} />
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
      {/* Full-bleed dark hero */}
      <Hero />

      {/* White scrollable content */}
      <div className="w-full bg-white">
        {/* Trust bar */}
        <TrustBar />

        {/* Main content — max-width container */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          {/* Radio player */}
          <div className="pt-8">
            <Radio />
          </div>

          {/* Apartments featured */}
          <Section>
            <FeaturedProducts
              category="apartments"
              title="Apartments & Short Stays"
              viewAllHref="/restate"
              viewAllLabel="View all properties"
            />
          </Section>

          {/* How it works */}
          <HowItWorks />

          {/* Food featured */}
          <Section>
            <FeaturedProducts
              category="food"
              title="Food & Restaurants"
              viewAllHref="/food"
              viewAllLabel="See all food listings"
            />
          </Section>

          {/* Sell CTA */}
          <SellCta />

          {/* Marketplace featured */}
          <Section>
            <FeaturedProducts
              category="marketplace"
              title="Shop the Marketplace"
              viewAllHref="/marketPlace"
              viewAllLabel="Browse marketplace"
            />
          </Section>
        </div>

        {/* Full-bleed video promo */}
        <div className="w-full py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                Promote your business on SmileBaba TV
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Reach thousands of buyers through live video, radio, and social
                media
              </p>
            </div>
            <Video />
          </div>
        </div>

        {/* Full-bleed dark app download */}
        <AppDownload />
      </div>
    </div>
  );
}

