"use client";

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Trophy, ImageOff } from "lucide-react";
import { useAppSelector } from "@/src/app/redux";
import { Product, getCoverImage } from "@/src/types/product.types";

// Supports the old CardComponentProps shape AND the new Product type
type FeaturedCardItem =
  | Product
  | {
      id?: string | number;
      _id?: string;
      title?: string;
      images?: (string | { url: string; isCover?: boolean })[];
      price?: number;
      currency?: string;
      location?: { city?: string; region?: string };
      seller?: { name?: string };
    };

interface CardComponentProps {
  item: FeaturedCardItem;
  index: number;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  GHS: "₵",
  NGN: "₦",
};

// Normalise item to consistent shape regardless of source
function normalise(item: FeaturedCardItem) {
  const id = (item as any)._id ?? String((item as any).id ?? "");
  const title = (item as any).title ?? "";
  const price = Number((item as any).price ?? 0);
  const currency = (item as any).currency ?? "GHS";
  const city = (item as any).location?.city ?? "";
  const region = (item as any).location?.region ?? "";
  const seller =
    (item as any).seller?.name ?? (item as any).seller?.username ?? "";

  // Image normalisation — handles string[], {url}[] or mixed
  const rawImages: (string | { url: string })[] = (item as any).images ?? [];
  const coverUrl = (() => {
    if (!rawImages.length) return "";
    const cover = rawImages.find(
      (img) => typeof img === "object" && (img as any).isCover,
    );
    const first = cover ?? rawImages[0];
    return typeof first === "string" ? first : ((first as any).url ?? "");
  })();

  return { id, title, price, currency, city, region, seller, coverUrl };
}

const FeaturedCard = memo(function FeaturedCard({
  item,
  index,
}: CardComponentProps) {
  const userCurrency = useAppSelector((state) => state.auth.user?.currency);
  const { id, title, price, currency, city, region, seller, coverUrl } =
    normalise(item);
  const sym = CURRENCY_SYMBOLS[userCurrency ?? currency ?? "GHS"] ?? "₵";

  return (
    <Link
      href={`/product/${id}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group relative w-full rounded-2xl bg-white border border-gray-100
        shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 20vw, 14vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff size={28} className="text-gray-200" />
          </div>
        )}

        {/* Best seller badge */}
        {index % 2 === 0 && (
          <span
            className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5
            text-[10px] font-bold bg-white text-gray-800 rounded-full shadow-sm"
          >
            <Trophy size={9} className="text-yellow-500" /> Best Seller
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col flex-1">
        {/* Seller + rating */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <p className="text-xs font-semibold text-gray-800 truncate">
            {seller || "Seller"}
          </p>
          <span className="flex items-center gap-0.5 text-[10px] text-gray-500 flex-shrink-0">
            <Star size={10} className="fill-yellow-400 text-yellow-400" /> 4.5
          </span>
        </div>

        {/* Title */}
        <p className="text-xs text-gray-500 line-clamp-1 mb-1">{title}</p>

        {/* Price */}
        <p className="text-sm font-black text-gray-900 mt-auto">
          {sym}
          {price.toLocaleString()}
        </p>

        {/* Location */}
        {(city || region) && (
          <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
            <span>
              <MapPin size={11} className="text-gray-400" />{" "}
            </span>
            <span className="truncate">
              {[city, region].filter(Boolean).join(", ")}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
});

export default FeaturedCard;

// ── 7-column grid ────────────────────────────────────────────────────────────
export const FeaturedGrid = memo(function FeaturedGrid({
  items,
}: {
  items: FeaturedCardItem[];
}) {
  const capped = items.slice(0, 7);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 max-w-7xl mx-auto w-full">
      {capped.map((item, i) => (
        <FeaturedCard
          key={(item as any)._id ?? (item as any).id ?? i}
          item={item}
          index={i}
        />
      ))}
    </div>
  );
});
