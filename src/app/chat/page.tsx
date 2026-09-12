"use client";

// client/src/app/cart/page.tsx
//
// ─── WHAT WAS MISSING ────────────────────────────────────────────────
//
// handleOrder posted to /orders and redirected to /account/orders. No
// payment. The vendor saw an order nobody had paid for, the buyer had no
// escrow protection, and SmileBaba never collected the 5%.
//
// The order now creates and then pays: one Flutterwave charge across
// every vendor in the cart, which is what orderGroup is for.
//
// ─── AND ONE THING THAT SHOULDN'T BE HERE AT ALL ─────────────────────
//
// Stays could be added to the cart. Holding dates in a cart lets two
// people both "have" the same nights, and whoever pays second hits an
// error at the worst possible moment. They're filtered out on load and
// the buyer is told why, with a link to book properly.
//
// ─── TOTALS COME FROM THE SERVER ─────────────────────────────────────
//
// The client still shows a subtotal so the page isn't blank, but the
// amount charged is whatever the server calculated. A cart total the
// buyer can edit in devtools is not a total.

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Package,
  ChevronRight,
  Store,
  MapPin,
  AlertTriangle,
  Loader2,
  BedDouble,
} from "lucide-react";

import { useAppSelector, useAppDispatch } from "@/src/app/redux";
import { useViewCountry } from "@/src/hooks/useViewCountry";
import axiosInstance from "@/src/lib/api/axios";
import {
  removeFromCart,
  increaseAmount,
  decreaseAmount,
  clearCart,
  CartItem,
} from "@/src/lib/features/cart/cartSlice";

const STAY_CATEGORIES = new Set(["apartments", "properties"]);

function fmt(amount: number, sym: string) {
  return `${sym}${Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function groupByVendor(items: CartItem[]): Record<string, CartItem[]> {
  return items.reduce(
    (acc, item) => {
      const key = item.vendorId || "unknown";
      (acc[key] ??= []).push(item);
      return acc;
    },
    {} as Record<string, CartItem[]>,
  );
}

// ═══════════════════════════════════════════════════════════════════════
export default function CartPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { sym, currency } = useViewCountry();

  const { cartItems } = useAppSelector((s) => s.cart);
  const user = useAppSelector((s) => s.auth.user);

  const [addresses, setAddresses] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [removedStays, setRemovedStays] = useState<string[]>([]);

  // ─── Hygiene ──────────────────────────────────────────────────────
  //
  // Stays shouldn't be here. Rather than silently dropping them — which
  // makes someone think the site lost their booking — they're removed
  // with an explanation and a way to book properly.
  useEffect(() => {
    const stays = cartItems.filter((i) =>
      STAY_CATEGORIES.has(String(i.category ?? "").toLowerCase()),
    );
    if (stays.length === 0) return;

    stays.forEach((s) => dispatch(removeFromCart(s.id)));
    setRemovedStays(stays.map((s) => s.title));
  }, [cartItems, dispatch]);

  const vendorGroups = useMemo(() => groupByVendor(cartItems), [cartItems]);
  const vendorIds = useMemo(() => Object.keys(vendorGroups), [vendorGroups]);

  const subtotal = useMemo(
    () => cartItems.reduce((s, i) => s + i.price * i.amount, 0),
    [cartItems],
  );

  const setAddress = (vendorId: string, val: string) =>
    setAddresses((prev) => ({ ...prev, [vendorId]: val }));

  // ─── Place and pay ────────────────────────────────────────────────
  const handleCheckout = useCallback(async () => {
    if (!user) {
      localStorage.setItem("redirectAfterLogin", "/cart");
      router.push("/auth/login?returnUrl=/cart");
      return;
    }

    const missing = vendorIds.find((vid) => !(addresses[vid] || "").trim());
    if (missing) {
      toast.error(
        vendorIds.length > 1
          ? "Please enter a delivery address for each seller"
          : "Please enter your delivery address",
      );
      return;
    }

    setPlacing(true);

    try {
      // One call, the whole cart. The server splits it into one order per
      // vendor sharing an orderGroup, and prices every line itself — the
      // client never sends a total.
      const { data } = await axiosInstance.post("/orders", {
        currency,
        groups: vendorIds.map((vendorId) => ({
          vendorId,
          deliveryAddress: (addresses[vendorId] || "").trim(),
          items: vendorGroups[vendorId].map((i) => ({
            adId: i.adId ?? i.id,
            quantity: i.amount,
          })),
        })),
      });

      const orderGroup = data?.orderGroup ?? data?.orders?.[0]?.orderGroup;

      if (!orderGroup) {
        throw new Error("Order created but no payment group returned");
      }

      // Single charge across every vendor in the cart
      const pay = await axiosInstance.post(`/orders/group/${orderGroup}/pay`, {
        returnUrl: "/account/orders",
      });

      const link = pay?.data?.paymentLink;
      if (!link) throw new Error("No payment link returned");

      // Only clear once payment has somewhere to go. Clearing before this
      // would lose the cart if the redirect failed.
      dispatch(clearCart());
      window.location.assign(link);
    } catch (err: any) {
      const res = err?.response?.data;

      // The vendor took the listing down, or someone else bought it,
      // between adding to cart and checking out
      if (res?.code === "ITEM_UNAVAILABLE" && res?.adId) {
        dispatch(removeFromCart(res.adId));
        toast.error(
          res.message ?? "One item is no longer available and was removed.",
        );
      } else {
        toast.error(
          res?.message ??
            err?.message ??
            "Couldn't complete checkout. Please try again.",
        );
      }
      setPlacing(false);
    }
  }, [user, vendorIds, vendorGroups, addresses, currency, dispatch, router]);

  // ─── Empty ────────────────────────────────────────────────────────
  if (!cartItems.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-xs text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <ShoppingCart size={34} className="text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Your cart is empty
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Browse listings and add items to your cart to get started.
          </p>

          {removedStays.length > 0 && (
            <div className="mt-5 rounded-2xl bg-teal-50 p-4 text-left">
              <p className="flex items-center gap-2 text-[13px] font-bold text-teal-900">
                <BedDouble size={14} />
                Stays are booked, not carted
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-teal-700">
                {removedStays.join(", ")} needs dates. Open the listing and pick
                your check-in and check-out.
              </p>
            </div>
          )}

          <Link
            href="/ads"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-6 py-3 text-sm font-bold text-gray-900 transition hover:bg-amber-300"
          >
            Browse listings
            <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* ─── Header ─── */}
      <div className="sticky top-0 z-20 border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3.5">
          <button
            onClick={() => router.back()}
            className="rounded-xl p-1.5 transition hover:bg-gray-100"
          >
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <ShoppingCart size={17} className="text-amber-500" />
            <span className="text-sm font-bold text-gray-900">Cart</span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
            </span>
          </div>
          <button
            onClick={() => {
              dispatch(clearCart());
              toast.info("Cart cleared");
            }}
            className="ml-auto rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-50 hover:text-red-500"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Removed stays */}
        {removedStays.length > 0 && (
          <div className="mb-4 flex items-start gap-3 rounded-2xl bg-teal-50 p-4">
            <BedDouble size={16} className="mt-0.5 shrink-0 text-teal-600" />
            <div className="flex-1">
              <p className="text-[13px] font-bold text-teal-900">
                Stays are booked, not carted
              </p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-teal-700">
                We removed {removedStays.join(", ")} because a stay needs
                check-in and check-out dates. Open the listing to book it.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col items-start gap-6 lg:flex-row">
          {/* ─── Vendor groups ─── */}
          <div className="flex-1 space-y-4">
            {vendorIds.map((vendorId) => (
              <VendorGroup
                key={vendorId}
                vendorId={vendorId}
                vendorName={vendorGroups[vendorId][0]?.vendorName ?? "Vendor"}
                vendorSlug={(vendorGroups[vendorId][0] as any)?.vendorSlug}
                items={vendorGroups[vendorId]}
                sym={sym}
                address={addresses[vendorId] ?? ""}
                onAddressChange={setAddress}
              />
            ))}

            <Link
              href="/ads"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:underline"
            >
              <ArrowLeft size={14} /> Continue shopping
            </Link>
          </div>

          {/* ─── Summary ─── */}
          <div className="w-full flex-shrink-0 lg:w-[330px]">
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              vendorCount={vendorIds.length}
              sym={sym}
              onCheckout={handleCheckout}
              placing={placing}
              signedIn={!!user}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Vendor group ────────────────────────────────────────────────────
function VendorGroup({
  vendorId,
  vendorName,
  vendorSlug,
  items,
  sym,
  address,
  onAddressChange,
}: {
  vendorId: string;
  vendorName: string;
  vendorSlug?: string;
  items: CartItem[];
  sym: string;
  address: string;
  onAddressChange: (vendorId: string, val: string) => void;
}) {
  const groupSubtotal = items.reduce((s, i) => s + i.price * i.amount, 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-5 py-3">
        <Store size={13} className="text-amber-500" />
        {vendorSlug ? (
          <Link
            href={`/vendors/${vendorSlug}`}
            className="truncate text-xs font-bold text-gray-700 hover:underline"
          >
            {vendorName}
          </Link>
        ) : (
          <span className="truncate text-xs font-bold text-gray-700">
            {vendorName}
          </span>
        )}
        <span className="ml-auto text-xs text-gray-400">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="px-5">
        {items.map((item) => (
          <CartItemRow key={item.id} item={item} sym={sym} />
        ))}
      </div>

      <div className="border-t border-gray-50 px-5 pb-4 pt-3">
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
          <MapPin size={11} className="text-blue-500" />
          Delivery address for this seller
        </label>
        <input
          value={address}
          onChange={(e) => onAddressChange(vendorId, e.target.value)}
          placeholder="Street, area, and a landmark if it helps"
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400"
        />

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-gray-400">
            <Truck size={11} />
            Delivery calculated at checkout
          </span>
          <span className="font-bold text-gray-800">
            {fmt(groupSubtotal, sym)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Item row ────────────────────────────────────────────────────────
function CartItemRow({ item, sym }: { item: CartItem; sym: string }) {
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center gap-3 border-b border-gray-50 py-4 last:border-0">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package size={20} className="text-gray-300" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-bold text-gray-900">
          {item.title}
        </p>
        <p className="mt-1 text-sm font-bold text-gray-900">
          {fmt(item.price * item.amount, sym)}
        </p>
        {item.amount > 1 && (
          <p className="text-[11px] text-gray-400">
            {fmt(item.price, sym)} each
          </p>
        )}
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        <button
          onClick={() => dispatch(decreaseAmount(item.id))}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 transition hover:bg-gray-100 active:scale-95"
          aria-label="Decrease"
        >
          <Minus size={11} />
        </button>
        <span className="w-5 text-center text-sm font-bold">{item.amount}</span>
        <button
          onClick={() => dispatch(increaseAmount(item.id))}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 transition hover:bg-gray-100 active:scale-95"
          aria-label="Increase"
        >
          <Plus size={11} />
        </button>
      </div>

      <button
        onClick={() => dispatch(removeFromCart(item.id))}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 transition hover:bg-red-50 hover:text-red-400"
        aria-label="Remove"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ─── Summary ─────────────────────────────────────────────────────────
function OrderSummary({
  cartItems,
  subtotal,
  vendorCount,
  sym,
  onCheckout,
  placing,
  signedIn,
}: {
  cartItems: CartItem[];
  subtotal: number;
  vendorCount: number;
  sym: string;
  onCheckout: () => void;
  placing: boolean;
  signedIn: boolean;
}) {
  const itemCount = cartItems.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="sticky top-[72px] space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="text-base font-bold text-gray-900">Order summary</h2>

      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Items ({itemCount})</span>
          <span className="font-semibold text-gray-900">
            {fmt(subtotal, sym)}
          </span>
        </div>

        {/* Delivery isn't known until the server prices it against the
            vendor's own rules. Guessing here and charging something else
            at Flutterwave is how you get a chargeback. */}
        <div className="flex justify-between text-gray-500">
          <span className="flex items-center gap-1">
            <Truck size={12} className="text-blue-400" /> Delivery
          </span>
          <span className="text-xs text-gray-400">Calculated at checkout</span>
        </div>

        {vendorCount > 1 && (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-700">
            Your cart has items from {vendorCount} sellers. You pay once — we
            split it and each seller ships separately.
          </p>
        )}

        <div className="flex justify-between border-t border-gray-100 pt-2.5">
          <span className="font-bold text-gray-900">Subtotal</span>
          <span className="text-base font-bold text-gray-900">
            {fmt(subtotal, sym)}
          </span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={placing}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 py-3.5 text-sm font-bold text-gray-900 transition hover:bg-amber-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {placing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Taking you to payment…
          </>
        ) : signedIn ? (
          <>
            Checkout · {fmt(subtotal, sym)}
            <ChevronRight size={15} />
          </>
        ) : (
          "Sign in to check out"
        )}
      </button>

      <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 px-3 py-2.5">
        <ShieldCheck
          size={14}
          className="mt-0.5 flex-shrink-0 text-emerald-600"
        />
        <p className="text-[11px] leading-relaxed text-emerald-800">
          We hold your payment until you confirm the item arrived. If it
          doesn&apos;t, you get it back.
        </p>
      </div>

      <div className="space-y-1.5 border-t border-gray-100 pt-3">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between text-xs text-gray-500"
          >
            <span className="mr-2 flex-1 truncate">
              {item.title} × {item.amount}
            </span>
            <span className="flex-shrink-0 font-semibold text-gray-700">
              {fmt(item.price * item.amount, sym)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
