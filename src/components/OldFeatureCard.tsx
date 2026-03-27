"use client";

import React from "react";
import { assets } from "../assets/assets";
import Link from "next/link";
import Image from "next/image";
import { CardComponentProps } from "@/src/types/types";
import { useAppSelector } from "@/src/app/redux";

const CURRENCY_SYMBOLS: Record<string, string> = {
  GHS: "₵",
  NGN: "₦",
};

const OldFeaturedCard = ({ item, index }: CardComponentProps) => {
  const userCurrency = useAppSelector((state) => state.auth.user?.currency);
  const symbol = CURRENCY_SYMBOLS[userCurrency ?? "GHS"] ?? "₵";

  return (
    <Link
      href={`/product/${item.id}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="relative w-full rounded-xl bg-white border border-gray-100
        shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={item.images?.[0] || assets.upload_area}
          alt={item.title ?? "product"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Best seller badge */}
        {index % 2 === 0 && (
          <span
            className="absolute top-2 left-2 px-2.5 py-1 text-[11px] bg-white
            text-gray-800 font-semibold rounded-full shadow-sm"
          >
            🏆 Best Seller
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Seller + rating */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
            {item.seller?.name || "Unknown"}
          </p>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Image
              src={assets.starIconFilled}
              alt="rating"
              width={12}
              height={12}
            />
            <span className="text-xs text-gray-600 font-medium">4.5</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-2">
          <Image
            src={assets.locationIcon}
            alt="location"
            width={11}
            height={11}
          />
          <span className="truncate">{item.location?.city ?? "—"}</span>
        </div>

        {/* Price */}
        <p className="text-xs text-gray-400">
          {symbol}
          <span className="text-base font-bold text-gray-900 ml-0.5">
            {Number(item.price).toLocaleString()}
          </span>
        </p>
      </div>
    </Link>
  );
};

// ── 7-grid container ───────────────────────────────────────────────────────
// Breakpoints:
//   mobile (default) : 2 columns
//   sm  (640px+)     : 3 columns
//   md  (768px+)     : 4 columns
//   lg  (1024px+)    : 5 columns
//   xl  (1280px+)    : 7 columns  ← full 7-per-row on large screens
//
// Usage:
//   <FeaturedGrid items={products.slice(0, 7)} />

export function FeaturedGrid({
  items,
}: {
  items: CardComponentProps["item"][];
}) {
  const capped = items;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4 w-full">
      {capped.map((item, i) => (
        <OldFeaturedCard key={item.id ?? i} item={item} index={i} />
      ))}
    </div>
  );
}

export default OldFeaturedCard;
