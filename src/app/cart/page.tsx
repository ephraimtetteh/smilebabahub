"use client";

// client/src/app/cart/page.tsx
//
// ─── THE CONTRACT, FROM THE CONTROLLER ───────────────────────────────
//
//     POST /orders
//     { items: [{ adId, quantity }], deliveryAddress, paymentMethod, notes }
//       → { orderGroup, orders, summary }
//
//     POST /orders/group/:orderGroup/pay
//       → { paymentLink }
//
// Three things that matter and that I got wrong before:
//
//   · It reads `it.adId ?? it.id`. Sending { name, qty, price } means
//     nothing matches, `wanted` stays empty, and it answers "Your cart
//     is empty". That was the 400.
//
//   · It groups by vendor itself and returns one orderGroup. So this is
//     a single POST for the whole cart, not one per vendor.
//
//   · One deliveryAddress for the whole checkout, not one per vendor.
//
// ─── PRICES ARE NOT SENT ─────────────────────────────────────────────
//
// The client sends ids and quantities. Every price, subtotal, commission
// and payout is computed server-side from the Ad documents. The totals
// shown here are a preview — if a vendor changed a price since the item
// went in the cart, the server's number wins, which is correct.
//
// ─── AND NO DELIVERY LINE ────────────────────────────────────────────
//
// `total: subtotal` in the controller, with "delivery fee added by the
// vendor when known". Showing a delivery total here would be a number
// nobody is going to charge.

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
  Loader2,
  BedDouble,
  AlertTriangle,
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

  const [placing, setPlacing] = useState(false);
  const [removedStays, setRemovedStays] = useState<string[]>([]);

  // One address for the whole checkout — the controller stores a single
  // deliveryAddress per order and uses the same one across the group
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setFullName(user?.username ?? "");
    setPhone(user?.phone ?? "");
    setCity(user?.city ?? "");
  }, [user?._id]);

  // ─── Stays don't belong in a cart ─────────────────────────────────
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

  /**
   * The controller rejects a cart that mixes currencies. Catching it
   * here means an explanation instead of a 400 after they've filled in
   * an address.
   */
  const mixedCurrency = useMemo(() => {
    const set = new Set(cartItems.map((i) => i.currency ?? currency));
    return set.size > 1;
  }, [cartItems, currency]);

  // ─── Place and pay ────────────────────────────────────────────────
  const handleCheckout = useCallback(async () => {
    if (!user) {
      localStorage.setItem("redirectAfterLogin", "/cart");
      router.push("/auth/login?returnUrl=/cart");
      return;
    }

    if (mixedCurrency) {
      toast.error(
        "Your cart mixes currencies. Check out one country's items at a time.",
      );
      return;
    }

    if (!fullName.trim() || !address.trim()) {
      toast.error("We need a name and a delivery address");
      return;
    }
    if (phone.replace(/\D/g, "").length < 7) {
      toast.error("We need a phone number the vendor can reach you on");
      return;
    }

    setPlacing(true);

    try {
      // Ids and quantities only. The server prices everything.
      const { data } = await axiosInstance.post("/orders", {
        items: cartItems.map((i) => ({
          adId: i.adId ?? i.id,
          quantity: i.amount,
        })),
        deliveryAddress: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          landmark: landmark.trim() || undefined,
        },
        paymentMethod: "momo",
        notes: notes.trim() || undefined,
      });

      const orderGroup = data?.orderGroup;
      if (!orderGroup) throw new Error("No order group returned");

      // One charge across every vendor in the cart
      const pay = await axiosInstance.post(
        `/orders/group/${orderGroup}/pay`,
        {},
      );

      const link =
        pay?.data?.paymentLink ?? pay?.data?.link ?? pay?.data?.checkoutUrl;

      if (!link) throw new Error("No payment link returned");

      // Cleared only once payment has somewhere to go. Clearing earlier
      // would lose the cart if the redirect failed.
      dispatch(clearCart());
      window.location.assign(link);
    } catch (err: any) {
      const res = err?.response?.data;

      // The controller names the items that went away — take them out
      // rather than making someone hunt for the problem
      if (res?.code === "ITEMS_UNAVAILABLE" && Array.isArray(res.unavailable)) {
        res.unavailable.forEach((id: string) => dispatch(removeFromCart(id)));
        toast.error(res.message ?? "Some items are no longer available.");
      } else if (res?.code === "OWN_LISTING") {
        toast.error("You can't buy your own listing.");
      } else if (res?.code === "MIXED_CURRENCY") {
        toast.error(res.message);
      } else {
        toast.error(
          res?.message ?? err?.message ?? "Couldn't place your order.",
        );
      }
      setPlacing(false);
    }
  }, [
    user,
    cartItems,
    mixedCurrency,
    fullName,
    phone,
    address,
    city,
    landmark,
    notes,
    dispatch,
    router,
  ]);

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
        {removedStays.length > 0 && (
          <Notice
            tone="teal"
            icon={BedDouble}
            title="Stays are booked, not carted"
          >
            We removed {removedStays.join(", ")} because a stay needs check-in
            and check-out dates. Open the listing to book it.
          </Notice>
        )}

        {mixedCurrency && (
          <Notice
            tone="amber"
            icon={AlertTriangle}
            title="Two currencies in one cart"
          >
            SmileBaba can only check out one country&apos;s items at a time.
            Remove the items priced in the other currency and order them
            separately.
          </Notice>
        )}

        <div className="flex flex-col items-start gap-6 lg:flex-row">
          <div className="flex-1 space-y-4">
            {vendorIds.map((vendorId) => (
              <VendorGroup
                key={vendorId}
                vendorName={vendorGroups[vendorId][0]?.vendorName ?? "Vendor"}
                items={vendorGroups[vendorId]}
                sym={sym}
              />
            ))}

            {/* ─── Delivery ─── */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <MapPin size={14} className="text-blue-500" />
                Where should this go?
              </h2>
              <p className="mt-1 text-[12px] text-gray-500">
                {vendorIds.length > 1
                  ? `All ${vendorIds.length} sellers deliver to this address.`
                  : "The seller delivers to this address."}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Input
                  label="Full name"
                  value={fullName}
                  onChange={setFullName}
                  placeholder="Kwame Mensah"
                />
                <Input
                  label="Phone number"
                  value={phone}
                  onChange={setPhone}
                  placeholder="024 123 4567"
                  type="tel"
                />
              </div>

              <Input
                label="Address"
                value={address}
                onChange={setAddress}
                placeholder="House number, street, area"
                className="mt-3"
              />

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Input
                  label="City"
                  value={city}
                  onChange={setCity}
                  placeholder="Accra"
                />
                <Input
                  label="Landmark"
                  optional
                  value={landmark}
                  onChange={setLandmark}
                  placeholder="Near Accra Mall"
                />
              </div>

              <Input
                label="Note for the seller"
                optional
                value={notes}
                onChange={setNotes}
                placeholder="Call when you arrive, gate is blue"
                className="mt-3"
              />
            </div>

            <Link
              href="/ads"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:underline"
            >
              <ArrowLeft size={14} /> Continue shopping
            </Link>
          </div>

          <div className="w-full flex-shrink-0 lg:w-[330px]">
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              vendorCount={vendorIds.length}
              sym={sym}
              onCheckout={handleCheckout}
              placing={placing}
              signedIn={!!user}
              blocked={mixedCurrency}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Vendor group ────────────────────────────────────────────────────
function VendorGroup({
  vendorName,
  items,
  sym,
}: {
  vendorName: string;
  items: CartItem[];
  sym: string;
}) {
  const groupSubtotal = items.reduce((s, i) => s + i.price * i.amount, 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-5 py-3">
        <Store size={13} className="text-amber-500" />
        <span className="truncate text-xs font-bold text-gray-700">
          {vendorName}
        </span>
        <span className="ml-auto text-xs text-gray-400">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="px-5">
        {items.map((item) => (
          <CartItemRow key={item.id} item={item} sym={sym} />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-gray-50 px-5 py-3">
        <span className="flex items-center gap-1.5 text-[11.5px] text-gray-400">
          <Truck size={11} />
          Delivery confirmed by the seller
        </span>
        <span className="text-sm font-bold text-gray-800">
          {fmt(groupSubtotal, sym)}
        </span>
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
  blocked,
}: {
  cartItems: CartItem[];
  subtotal: number;
  vendorCount: number;
  sym: string;
  onCheckout: () => void;
  placing: boolean;
  signedIn: boolean;
  blocked: boolean;
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

        {/* No delivery line. The controller sets total to the subtotal
            and the vendor adds delivery once they know it, so a number
            here would be one nobody is going to charge. */}
        <div className="flex justify-between text-gray-500">
          <span className="flex items-center gap-1">
            <Truck size={12} className="text-blue-400" /> Delivery
          </span>
          <span className="text-xs text-gray-400">Confirmed by seller</span>
        </div>

        {vendorCount > 1 && (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-700">
            Items from {vendorCount} sellers. You pay once — each seller ships
            and is paid separately.
          </p>
        )}

        <div className="flex justify-between border-t border-gray-100 pt-2.5">
          <span className="font-bold text-gray-900">Total</span>
          <span className="text-base font-bold text-gray-900">
            {fmt(subtotal, sym)}
          </span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={placing || blocked}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 py-3.5 text-sm font-bold text-gray-900 transition hover:bg-amber-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {placing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Taking you to payment…
          </>
        ) : !signedIn ? (
          "Sign in to check out"
        ) : (
          <>
            Pay {fmt(subtotal, sym)}
            <ChevronRight size={15} />
          </>
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

// ─── Bits ────────────────────────────────────────────────────────────
function Notice({
  tone,
  icon: Icon,
  title,
  children,
}: {
  tone: "teal" | "amber";
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
  const c =
    tone === "teal"
      ? {
          bg: "bg-teal-50",
          icon: "text-teal-600",
          head: "text-teal-900",
          body: "text-teal-700",
        }
      : {
          bg: "bg-amber-50",
          icon: "text-amber-600",
          head: "text-amber-900",
          body: "text-amber-700",
        };

  return (
    <div className={`mb-4 flex items-start gap-3 rounded-2xl ${c.bg} p-4`}>
      <Icon size={16} className={`mt-0.5 shrink-0 ${c.icon}`} />
      <div className="flex-1">
        <p className={`text-[13px] font-bold ${c.head}`}>{title}</p>
        <p className={`mt-1 text-[12.5px] leading-relaxed ${c.body}`}>
          {children}
        </p>
      </div>
    </div>
  );
}

function Input({
  label,
  optional,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  label: string;
  optional?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold text-gray-500">
        {label}
        {optional && (
          <span className="font-normal text-gray-400"> optional</span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400"
      />
    </div>
  );
}
