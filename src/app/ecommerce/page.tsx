"use client";

// src/app/ecommerce/page.tsx
//
// The E-Commerce vertical.
//
// E-Commerce isn't a category in the database — it's three retail
// categories (phones, fashion, home-office) presented as one storefront.
// That distinction lives here and in the query, so nothing downstream has
// to know about it.
//
// Route: /ecommerce
// Linked from the home page's vertical card and the header.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Truck,
  BadgeCheck,
  ShieldCheck,
  RotateCcw,
  Smartphone,
  Shirt,
  Sofa,
  Laptop,
  Headphones,
  Watch,
  Tv,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";

import { useProducts } from "@/src/hooks/useProducts";
import PicksRow from "@/src/components/home/PicksRow";

const ACCENT = "#059669";
const CATEGORIES = ["ecommerce", "phones", "fashion", "home-office"] as const;

const PERKS = [
  { icon: Truck, title: "Fast Delivery", hint: "Same-day possible" },
  { icon: BadgeCheck, title: "Verified", hint: "Trusted vendors" },
  { icon: ShieldCheck, title: "Secure Payment", hint: "Held until delivery" },
  { icon: RotateCcw, title: "Easy Returns", hint: "Per vendor policy" },
];

interface Tile {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

// The first three filter by a real category. The rest search, because
// they're groupings the data doesn't have yet — better a search that
// returns something than a category that returns nothing.
const TILES: Tile[] = [
  {
    id: "phones",
    label: "Phones",
    icon: Smartphone,
    href: "/ads?category=ecommerce,phones",
  },
  {
    id: "fashion",
    label: "Fashion",
    icon: Shirt,
    href: "/ads?category=ecommerce,fashion",
  },
  { id: "home", label: "Home", icon: Sofa, href: "/ads?category=home-office" },
  { id: "laptops", label: "Laptops", icon: Laptop, href: "/ads?q=laptop" },
  { id: "audio", label: "Audio", icon: Headphones, href: "/ads?q=headphones" },
  { id: "watches", label: "Watches", icon: Watch, href: "/ads?q=watch" },
  { id: "tv", label: "TV", icon: Tv, href: "/ads?q=television" },
  { id: "gaming", label: "Gaming", icon: Gamepad2, href: "/ads?q=gaming" },
];

export default function EcommercePage() {
  const { featured, featuredLoading, loadFeatured, userCountry } =
    useProducts();
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    if (!userCountry) return;
    CATEGORIES.forEach((cat) => loadFeatured(userCountry, cat));
  }, [userCountry, loadFeatured]);

  const phones = featured?.phones ?? [];
  const fashion = featured?.fashion ?? [];
  const home = featured?.["home-office"] ?? [];

  // Interleaved, so the row isn't four phones then four shirts
  const all = useMemo(() => {
    const out: any[] = [];
    const lists = [phones, fashion, home];
    const longest = Math.max(...lists.map((l) => l.length));
    for (let i = 0; i < longest; i++) {
      for (const list of lists) if (list[i]) out.push(list[i]);
    }
    return out;
  }, [phones, fashion, home]);

  const shown = useMemo(
    () =>
      verifiedOnly
        ? all.filter(
            (a) =>
              a?.postedBy?.isSubscribed ||
              (a?.subscription?.planPriority ?? 0) >= 2,
          )
        : all,
    [all, verifiedOnly],
  );

  return (
    <main className="bg-gray-50 pb-32 mt-20">
      <div className="mx-auto max-w-[1340px] px-3 sm:px-4">
        {/* ─── Breadcrumb ─── */}
        <nav className="pt-4 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-600">
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-gray-600">E-Commerce</span>
        </nav>

        {/* ─── Hero ─── */}
        <section className="relative mt-3 overflow-hidden rounded-3xl bg-emerald-900 p-6 sm:p-9">
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64
                       rounded-full bg-emerald-600/40"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 right-24 h-36 w-36
                       rounded-full bg-emerald-500/30"
            aria-hidden
          />

          <div className="relative max-w-xl">
            <span
              className="inline-block rounded-md bg-white/15 px-2.5 py-1
                         text-[10px] font-bold tracking-widest text-white"
            >
              TRUSTED BRANDS
            </span>

            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              Shop from brands
              <br />
              you can trust
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
              Phones, fashion and home essentials from verified vendors — with
              your payment held until the item reaches you.
            </p>

            <Link
              href="/ads?category=ecommerce,phones,fashion,home-office"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white
                         px-5 py-2.5 text-sm font-bold text-emerald-700
                         transition hover:bg-emerald-50"
            >
              Shop everything
              <span aria-hidden>→</span>
            </Link>

            {/* Perks */}
            <div className="mt-7 grid grid-cols-2 gap-4 rounded-2xl bg-white/10 p-4 sm:grid-cols-4">
              {PERKS.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className="flex items-center gap-2.5">
                    <Icon
                      size={17}
                      className="shrink-0 text-white"
                      strokeWidth={2}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-bold text-white">
                        {p.title}
                      </p>
                      <p className="truncate text-[10px] text-white/60">
                        {p.hint}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Tiles ─── */}
        <section className="mt-8">
          <h2 className="mb-3 text-[15px] font-bold tracking-tight text-gray-900">
            Shop by category
          </h2>
          <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-8 sm:gap-3">
            {TILES.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.id}
                  href={t.href}
                  className="flex flex-col items-center rounded-2xl border border-gray-100
                             bg-white px-1 py-4 transition hover:border-emerald-200
                             hover:shadow-sm"
                >
                  <Icon
                    size={21}
                    className="text-emerald-600"
                    strokeWidth={1.9}
                  />
                  <span className="mt-2 line-clamp-1 text-[10px] font-medium text-gray-600 sm:text-[11px]">
                    {t.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ─── Per-category rows ─── */}
        <PicksRow
          title="Phones & Gadgets"
          accent={ACCENT}
          items={phones}
          loading={featuredLoading}
          viewAllHref="/ads?category=ecommerce,phones"
          showDelivery
        />
        <PicksRow
          title="Fashion & Beauty"
          accent={ACCENT}
          items={fashion}
          loading={featuredLoading}
          viewAllHref="/ads?category=ecommerce,fashion"
          showDelivery
        />
        <PicksRow
          title="Home & Office"
          accent={ACCENT}
          items={home}
          loading={featuredLoading}
          viewAllHref="/ads?category=ecommerce,home-office"
          showDelivery
        />

        {/* ─── Everything ─── */}
        <section className="mt-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[15px] font-bold tracking-tight text-gray-900">
              All products
              {shown.length > 0 && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  {shown.length} item{shown.length === 1 ? "" : "s"}
                </span>
              )}
            </h2>

            <button
              onClick={() => setVerifiedOnly((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5
                          text-xs font-semibold transition ${
                            verifiedOnly
                              ? "bg-emerald-600 text-white"
                              : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                          }`}
            >
              <BadgeCheck size={13} />
              Verified vendors only
            </button>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 animate-pulse rounded-2xl border border-gray-100 bg-white"
                />
              ))}
            </div>
          ) : shown.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center">
              <ShoppingBag size={30} className="mx-auto text-gray-300" />
              <p className="mt-3 text-sm font-semibold text-gray-900">
                {verifiedOnly ? "No verified listings yet" : "Nothing here yet"}
              </p>
              <p className="mx-auto mt-1.5 max-w-xs text-xs leading-relaxed text-gray-500">
                {verifiedOnly
                  ? "Try turning the filter off to see everything available."
                  : "Vendors haven't listed retail products in your area yet."}
              </p>
              {verifiedOnly && (
                <button
                  onClick={() => setVerifiedOnly(false)}
                  className="mt-4 rounded-full bg-emerald-600 px-4 py-2 text-xs
                             font-bold text-white transition hover:bg-emerald-700"
                >
                  Show everything
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {shown.map((ad) => (
                <GridCard key={ad._id} ad={ad} />
              ))}
            </div>
          )}
        </section>

        {/* ─── Sell CTA ─── */}
        <section className="mt-10 overflow-hidden rounded-3xl bg-gray-900 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Selling retail products?
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/60">
                List on SmileBaba and reach buyers across Ghana and Nigeria. We
                hold payment until delivery, so buyers trust you from day one.
              </p>
            </div>
            <Link
              href="/sell"
              className="rounded-full bg-amber-400 px-6 py-3 text-sm font-bold
                         text-gray-900 transition hover:bg-amber-300"
            >
              Start selling
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

// ─── Grid card ───────────────────────────────────────────────────────
function GridCard({ ad }: { ad: any }) {
  const amount =
    ad?.price && typeof ad.price === "object"
      ? Number(ad.price.amount) || 0
      : Number(ad?.price) || 0;

  const sym = (ad?.price?.currency ?? ad?.currency) === "NGN" ? "₦" : "GH₵";

  const img =
    ad?.coverImage ??
    (Array.isArray(ad?.images)
      ? typeof ad.images[0] === "string"
        ? ad.images[0]
        : ad.images[0]?.url
      : undefined);

  const verified =
    ad?.postedBy?.isSubscribed || (ad?.subscription?.planPriority ?? 0) >= 2;

  return (
    <Link
      href={`/ads/${ad.slug ?? ad._id}`}
      className="group overflow-hidden rounded-2xl border border-gray-100 bg-white
                 transition hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {img ? (
          <img
            src={img}
            alt={ad.title ?? "Product"}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl">
            📦
          </div>
        )}

        {verified && (
          <span
            className="absolute left-2 top-2 rounded-md bg-amber-400 px-1.5 py-0.5
                       text-[8px] font-bold tracking-wide text-gray-900"
          >
            VERIFIED
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="line-clamp-2 min-h-[32px] text-[13px] font-medium leading-tight text-gray-900">
          {ad.title ?? "Untitled listing"}
        </h3>
        <p className="mt-1.5 text-sm font-bold text-gray-900">
          {amount > 0 ? `${sym} ${amount.toLocaleString()}` : "Ask price"}
        </p>
        {ad?.delivery?.available && (
          <span
            className="mt-2 inline-block rounded bg-emerald-50 px-1.5 py-0.5
                       text-[9px] font-semibold text-emerald-700"
          >
            Free Delivery
          </span>
        )}
      </div>
    </Link>
  );
}
