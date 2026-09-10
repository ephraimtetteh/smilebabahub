"use client";

// client/src/components/PostAdMenu.tsx
//
// The Post Ad button and its vertical picker.
//
// All the routing logic lives in useSellFlow, shared with PostAdCTA, so
// the navbar and the homepage block can't drift apart on what happens
// when someone taps Post.

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ShoppingBag,
  Store,
  UtensilsCrossed,
  BedDouble,
  ChevronDown,
  Loader2,
  Plus,
  type LucideIcon,
} from "lucide-react";

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

interface Props {
  variant?: "desktop" | "mobile";
  /** Called once a route is chosen, so the drawer can close */
  onNavigate?: () => void;
}

export default function PostAdMenu({ variant = "desktop", onNavigate }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    onNavigate?.();
  }, [onNavigate]);

  const { start, checking, verticals } = useSellFlow(close);

  // Outside click, same pattern as NavDropdown
  useEffect(() => {
    if (variant !== "desktop") return;

    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [variant]);

  // ─── Mobile: expands in place inside the drawer ───────────────────
  if (variant === "mobile") {
    return (
      <div className="w-full max-w-xs">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-yellow-400 px-8 py-3 text-base font-bold text-black transition hover:bg-yellow-300 active:scale-95"
        >
          <Plus size={18} strokeWidth={2.6} />
          Post Ad
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="mt-3 space-y-2">
            {verticals.map((v) => (
              <Option
                key={v.id}
                vertical={v}
                busy={checking === v.id}
                disabled={!!checking}
                onPress={() => start(v)}
                dark
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── Desktop: pill with a dropdown ────────────────────────────────
  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 ${
          open
            ? "bg-yellow-300 text-black"
            : "bg-yellow-400 text-black hover:bg-yellow-300"
        }`}
      >
        Post Ad
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[200] mt-2 w-64 animate-in fade-in slide-in-from-top-1 rounded-2xl border border-gray-100 bg-white py-2 shadow-xl duration-150">
          <p className="px-4 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            What are you listing?
          </p>

          {verticals.map((v) => (
            <Option
              key={v.id}
              vertical={v}
              busy={checking === v.id}
              disabled={!!checking}
              onPress={() => start(v)}
            />
          ))}

          <div className="mt-1 border-t border-gray-100 px-4 pb-1 pt-2.5">
            <p className="text-[10.5px] leading-relaxed text-gray-400">
              No fee to list. We take 5% only when you make a sale.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── One option ──────────────────────────────────────────────────────
function Option({
  vertical,
  busy,
  disabled,
  onPress,
  dark,
}: {
  vertical: SellVertical;
  busy: boolean;
  disabled: boolean;
  onPress: () => void;
  dark?: boolean;
}) {
  const s = STYLES[vertical.id] ?? STYLES.marketplace;
  const Icon = s.icon;

  return (
    <button
      onClick={onPress}
      disabled={disabled}
      className={
        dark
          ? "flex w-full items-center gap-3 rounded-2xl bg-white/10 p-3 text-left transition hover:bg-white/15 disabled:opacity-50"
          : "flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-gray-50 disabled:opacity-50"
      }
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-xl ${
          dark ? "h-9 w-9" : "h-8 w-8"
        }`}
        style={{ background: s.tint }}
      >
        {busy ? (
          <Loader2
            size={dark ? 16 : 15}
            className="animate-spin"
            style={{ color: s.colour }}
          />
        ) : (
          <Icon
            size={dark ? 17 : 16}
            style={{ color: s.colour }}
            strokeWidth={2}
          />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block font-semibold ${
            dark ? "text-sm text-white" : "text-sm text-gray-900"
          }`}
        >
          {vertical.label}
        </span>
        <span
          className={`mt-0.5 block truncate text-[11px] ${
            dark ? "text-white/50" : "text-gray-400"
          }`}
        >
          {vertical.hint}
        </span>
      </span>
    </button>
  );
}
