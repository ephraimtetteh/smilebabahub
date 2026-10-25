"use client";
// src/components/global/GlobalProductCard.tsx
// An AliExpress product in SmileBaba colours. The black GLOBAL tag sets it
// apart from local listings (which have escrow and local delivery).

import Link from "next/link";
import { useState } from "react";
import { Globe, Star } from "lucide-react";
import { aeThumb, formatLocal, type GlobalProduct } from "@/src/lib/aliexpress";

export default function GlobalProductCard({ item }: { item: GlobalProduct }) {
  const [broken, setBroken] = useState(false);
  return (
    <Link
      href={`/ecommerce/global/${item.id}`}
      className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {!broken ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={aeThumb(item.image)}
            alt={item.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setBroken(true)}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Globe size={26} className="text-gray-300" />
          </div>
        )}
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-gray-900 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-[#FFC105]">
          <Globe size={9} /> GLOBAL
        </span>
        {item.discount && (
          <span className="absolute right-2 top-2 rounded-md bg-[#FFC105] px-1.5 py-0.5 text-[10px] font-extrabold text-gray-900">
            -{item.discount}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 min-h-[32px] text-[13px] font-medium leading-tight text-gray-900">
          {item.title}
        </h3>
        <p className="mt-1.5 text-sm font-extrabold text-gray-900">≈ {formatLocal(item.price)}</p>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-500">
          {item.rating ? (
            <span className="inline-flex items-center gap-0.5">
              <Star size={10} className="fill-[#FFC105] text-[#FFC105]" />
              {item.rating.toFixed(0)}%
            </span>
          ) : null}
          {item.orders > 0 && (
            <span>
              {item.rating ? "· " : ""}
              {item.orders >= 1000 ? `${Math.floor(item.orders / 1000)}k+` : item.orders} sold
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
