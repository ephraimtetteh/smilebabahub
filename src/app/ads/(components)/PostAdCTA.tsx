"use client";

// client/src/components/ads/PostAdCTA.tsx
//
// The "have something to sell" block.
//
// Routing lives in useSellFlow, shared with the navbar's PostAdMenu, so
// the two can't disagree about what happens when someone taps Post.

import { memo } from "react";
import {
  ShoppingBag,
  Store,
  UtensilsCrossed,
  BedDouble,
  ArrowRight,
  Loader2,
  type LucideIcon,
} from "lucide-react";

import { useAppSelector } from "@/src/app/redux";
import { useSellFlow, type SellVertical } from "@/src/hooks/useSellFlow";

/** Presentation only. The routes live in useSellFlow. */
const STYLES: Record<
  string,
  { icon: LucideIcon; colour: string; tint: string }
> = {
  ecommerce: { icon: ShoppingBag, colour: "#059669", tint: "#ECFDF5" },
  stays: { icon: BedDouble, colour: "#0D9488", tint: "#F0FDFA" },
  food: { icon: UtensilsCrossed, colour: "#DC2626", tint: "#FEF2F2" },
  marketplace: { icon: Store, colour: "#2563EB", tint: "#EFF6FF" },
};

/** Longer labels, since there's room here that the navbar doesn't have. */
const LABELS: Record<string, string> = {
  ecommerce: "Sell a product",
  stays: "List a place",
  food: "List food",
  marketplace: "Post anything else",
};

interface PostAdCTAProps {
  country?: string;
}

const PostAdCTA = memo(function PostAdCTA({ country }: PostAdCTAProps) {
  const { user } = useAppSelector((s) => s.auth);
  const { start, checking, verticals } = useSellFlow();

  /**
   * Only used for the heading. The routing decision comes from the
   * server, so a stale Redux user can change the wording but never send
   * anyone to the wrong place.
   */
  const isVendor = !!user?.storeName || user?.role === "vendor";

  return (
    <section className="mt-12 overflow-hidden rounded-3xl bg-[#1a1a1a] p-6 sm:p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          {isVendor ? "Post another listing" : "Have something to sell?"}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-400">
          {isVendor
            ? "Pick what you're listing and we'll take you to the right form."
            : `Reach thousands of buyers across ${country ?? "Ghana and Nigeria"}. No fee to join — we take 5% only when you make a sale.`}
        </p>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {verticals.map((v: SellVertical) => {
          const s = STYLES[v.id] ?? STYLES.marketplace;
          const Icon = s.icon;
          const busy = checking === v.id;

          return (
            <button
              key={v.id}
              onClick={() => start(v)}
              disabled={!!checking}
              className="group flex items-center gap-3 rounded-2xl bg-white/5 p-4 text-left transition hover:bg-white/10 disabled:opacity-50"
              style={{ opacity: checking && !busy ? 0.4 : 1 }}
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ background: s.tint }}
              >
                {busy ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                    style={{ color: s.colour }}
                  />
                ) : (
                  <Icon size={19} style={{ color: s.colour }} strokeWidth={2} />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-white">
                  {LABELS[v.id] ?? v.label}
                </span>
                <span className="mt-0.5 block truncate text-xs text-gray-400">
                  {v.hint}
                </span>
              </span>

              <ArrowRight
                size={15}
                className="shrink-0 text-gray-600 transition group-hover:translate-x-0.5 group-hover:text-amber-400"
              />
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-gray-500">
        Buyers pay through SmileBaba and we hold the money until they confirm
        delivery. You keep 95% of every sale.
      </p>
    </section>
  );
});

export default PostAdCTA;
