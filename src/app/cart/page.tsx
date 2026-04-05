"use client";
// src/app/cart/page.tsx

import React, { useState } from "react";
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
  Tag,
  Store,
  MapPin,
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

// ── Helpers ────────────────────────────────────────────────────────────────
function fmt(amount: number, sym: string) {
  return `${sym}${Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Group cart items by vendorId so we can post one order per vendor
function groupByVendor(items: CartItem[]): Record<string, CartItem[]> {
  return items.reduce(
    (acc, item) => {
      const key = item.vendorId || "unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, CartItem[]>,
  );
}

// ── Single cart item row ───────────────────────────────────────────────────
function CartItemRow({ item }: { item: CartItem }) {
  const dispatch = useAppDispatch();
  const { sym } = useViewCountry();

  return (
    <div className="flex items-center gap-3 py-4 border-b border-gray-50 last:border-0">
      {/* Image */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
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
          <div className="w-full h-full flex items-center justify-center">
            <Package size={20} className="text-gray-300" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 line-clamp-1">
          {item.title}
        </p>
        {item.category && (
          <span
            className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-semibold
            text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full capitalize"
          >
            <Tag size={8} /> {item.category}
          </span>
        )}
        <p className="text-sm font-black text-gray-900 mt-1">
          {fmt(item.price * item.amount, sym)}
        </p>
        {item.amount > 1 && (
          <p className="text-[11px] text-gray-400">
            {fmt(item.price, sym)} each
          </p>
        )}
      </div>

      {/* Qty */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => dispatch(decreaseAmount(item.id))}
          className="w-7 h-7 rounded-full border border-gray-200 flex items-center
            justify-center hover:bg-gray-100 transition active:scale-95"
        >
          <Minus size={11} />
        </button>
        <span className="w-5 text-center text-sm font-bold">{item.amount}</span>
        <button
          onClick={() => dispatch(increaseAmount(item.id))}
          className="w-7 h-7 rounded-full border border-gray-200 flex items-center
            justify-center hover:bg-gray-100 transition active:scale-95"
        >
          <Plus size={11} />
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={() => dispatch(removeFromCart(item.id))}
        className="w-7 h-7 flex items-center justify-center text-gray-300
          hover:text-red-400 hover:bg-red-50 rounded-lg transition"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ── Vendor group card ──────────────────────────────────────────────────────
function VendorGroup({
  vendorId,
  vendorName,
  items,
  sym,
  address,
  onAddressChange,
}: {
  vendorId: string;
  vendorName: string;
  items: CartItem[];
  sym: string;
  address: string;
  onAddressChange: (vendorId: string, val: string) => void;
}) {
  const groupSubtotal = items.reduce((s, i) => s + i.price * i.amount, 0);
  const deliveryFee = items.reduce(
    (max, i) => (i.deliveryAvailable ? Math.max(max, i.deliveryFee ?? 0) : max),
    0,
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Vendor header */}
      <div
        className="px-5 py-3 bg-gray-50 border-b border-gray-100
        flex items-center gap-2"
      >
        <Store size={13} className="text-[#ffc105]" />
        <span className="text-xs font-bold text-gray-700 truncate">
          {vendorName || "Vendor"}
        </span>
        <span className="ml-auto text-xs text-gray-400">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Items */}
      <div className="px-5">
        {items.map((item) => (
          <CartItemRow key={item.id} item={item} />
        ))}
      </div>

      {/* Delivery address per vendor */}
      <div className="px-5 pb-4 pt-2 border-t border-gray-50">
        <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
          <MapPin size={11} className="text-blue-500" />
          Delivery address for this seller
        </label>
        <input
          value={address}
          onChange={(e) => onAddressChange(vendorId, e.target.value)}
          placeholder="Enter your delivery / pickup address"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
            text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ffc105]
            focus:border-[#ffc105]"
        />

        {/* Group subtotal + delivery */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Truck size={11} className="text-blue-400" />
            <span>
              Delivery:{" "}
              <strong
                className={
                  deliveryFee === 0 ? "text-green-600" : "text-gray-700"
                }
              >
                {deliveryFee === 0 ? "Free" : fmt(deliveryFee, sym)}
              </strong>
            </span>
          </div>
          <span className="font-bold text-gray-800">
            Subtotal: {fmt(groupSubtotal + deliveryFee, sym)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Order summary sidebar ──────────────────────────────────────────────────
function OrderSummary({
  cartItems,
  subTotal,
  delivery,
  total,
  sym,
  onOrder,
  ordering,
}: {
  cartItems: CartItem[];
  subTotal: number;
  delivery: number;
  total: number;
  sym: string;
  onOrder: () => void;
  ordering: boolean;
}) {
  const vendorCount = new Set(cartItems.map((i) => i.vendorId)).size;
  const itemCount = cartItems.reduce((s, i) => s + i.amount, 0);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5
      sticky top-[72px] space-y-4"
    >
      <h2 className="text-base font-black text-gray-900">Order summary</h2>

      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Items ({itemCount})</span>
          <span className="font-semibold text-gray-900">
            {fmt(subTotal, sym)}
          </span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span className="flex items-center gap-1">
            <Truck size={12} className="text-blue-400" /> Delivery
          </span>
          <span
            className={`font-semibold ${delivery === 0 ? "text-green-600" : "text-gray-900"}`}
          >
            {delivery === 0 ? "Free" : fmt(delivery, sym)}
          </span>
        </div>
        {vendorCount > 1 && (
          <p className="text-[11px] text-amber-600 bg-amber-50 rounded-xl px-3 py-2 leading-relaxed">
            Your cart has items from {vendorCount} sellers — {vendorCount}{" "}
            separate orders will be placed.
          </p>
        )}
        <div className="border-t border-gray-100 pt-2.5 flex justify-between">
          <span className="font-black text-gray-900">Total</span>
          <span className="font-black text-gray-900 text-base">
            {fmt(total, sym)}
          </span>
        </div>
      </div>

      <button
        onClick={onOrder}
        disabled={ordering}
        className="w-full py-3.5 bg-[#ffc105] text-black font-black rounded-2xl
          text-sm hover:bg-yellow-300 transition active:scale-[0.98]
          disabled:opacity-60 disabled:cursor-not-allowed
          flex items-center justify-center gap-2"
      >
        {ordering ? (
          <>
            <span
              className="w-4 h-4 border-2 border-black/20 border-t-black
              rounded-full animate-spin"
            />
            Placing order{vendorCount > 1 ? "s" : ""}…
          </>
        ) : (
          <>
            Place order{vendorCount > 1 ? "s" : ""} · {fmt(total, sym)}
            <ChevronRight size={15} />
          </>
        )}
      </button>

      <div
        className="flex items-center gap-2 text-[11px] text-gray-400
        bg-gray-50 rounded-xl px-3 py-2.5"
      >
        <ShieldCheck size={12} className="text-green-500 flex-shrink-0" />
        Secure checkout · Verified by Flutterwave
      </div>

      {/* Quick item preview */}
      <div className="space-y-1.5">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between text-xs text-gray-500"
          >
            <span className="truncate flex-1 mr-2">
              {item.title} × {item.amount}
            </span>
            <span className="font-semibold text-gray-700 flex-shrink-0">
              {fmt(item.price * item.amount, sym)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Empty cart ─────────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-xs">
        <div
          className="w-20 h-20 bg-[#ffc105]/10 rounded-full flex items-center
          justify-center mx-auto mb-5"
        >
          <ShoppingCart size={36} className="text-[#ffc105]" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Browse listings and add items to your cart to get started.
        </p>
        <Link
          href="/ads"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#ffc105] text-black
            font-bold rounded-2xl text-sm hover:bg-yellow-300 transition active:scale-95"
        >
          Browse listings <ChevronRight size={15} />
        </Link>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function CartPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { sym, currency } = useViewCountry();

  const { cartItems, subTotal, delivery, total } = useAppSelector(
    (s) => s.cart,
  );
  const user = useAppSelector((s) => s.auth.user);

  // One delivery address input per vendor group
  const [addresses, setAddresses] = useState<Record<string, string>>({});
  const [ordering, setOrdering] = useState(false);

  const setAddress = (vendorId: string, val: string) =>
    setAddresses((prev) => ({ ...prev, [vendorId]: val }));

  if (!cartItems.length) return <EmptyCart />;

  const vendorGroups = groupByVendor(cartItems);
  const vendorIds = Object.keys(vendorGroups);

  const handleOrder = async () => {
    if (!user) {
      toast.info("Please log in to place an order");
      router.push("/auth/login");
      return;
    }

    // Validate every vendor group has an address
    const missing = vendorIds.find((vid) => !(addresses[vid] || "").trim());
    if (missing) {
      toast.error(
        vendorIds.length > 1
          ? "Please enter a delivery address for each seller"
          : "Please enter your delivery address",
      );
      return;
    }

    setOrdering(true);
    let successCount = 0;

    try {
      // Post one order per vendor group
      await Promise.all(
        vendorIds.map(async (vendorId) => {
          const items = vendorGroups[vendorId];
          const orderTotal =
            items.reduce((s, i) => s + i.price * i.amount, 0) +
            items.reduce(
              (max, i) =>
                i.deliveryAvailable ? Math.max(max, i.deliveryFee ?? 0) : max,
              0,
            );

          await axiosInstance.post("/orders", {
            adId: items[0].adId || items[0].id,
            items: items.map((i) => ({
              name: i.title,
              qty: i.amount,
              price: i.price,
            })),
            total: orderTotal,
            currency: items[0].currency || currency,
            deliveryAddress: (addresses[vendorId] || "").trim(),
          });

          successCount++;
        }),
      );

      dispatch(clearCart());
      toast.success(
        successCount > 1
          ? `${successCount} orders placed! Vendors have been notified. 🎉`
          : "Order placed! The vendor has been notified. 🎉",
        { autoClose: 4000 },
      );
      router.push("/account/orders");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
          "Failed to place order. Please try again.",
      );
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* ── Sticky header ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 hover:bg-gray-100 rounded-xl transition"
          >
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <ShoppingCart size={17} className="text-[#ffc105]" />
            <span className="font-black text-gray-900 text-sm">Cart</span>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
            </span>
          </div>
          <button
            onClick={() => {
              dispatch(clearCart());
              toast.info("Cart cleared");
            }}
            className="ml-auto text-xs text-red-400 hover:text-red-500
              hover:bg-red-50 px-3 py-1.5 rounded-lg transition font-medium"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ── Left: vendor groups ── */}
          <div className="flex-1 space-y-4">
            {vendorIds.map((vendorId) => (
              <VendorGroup
                key={vendorId}
                vendorId={vendorId}
                vendorName={vendorGroups[vendorId][0]?.vendorName ?? "Vendor"}
                items={vendorGroups[vendorId]}
                sym={sym}
                address={addresses[vendorId] ?? ""}
                onAddressChange={setAddress}
              />
            ))}

            <Link
              href="/ads"
              className="inline-flex items-center gap-1.5 text-sm text-[#ffc105]
                font-semibold hover:underline"
            >
              <ArrowLeft size={14} /> Continue shopping
            </Link>
          </div>

          {/* ── Right: summary ── */}
          <div className="w-full lg:w-[320px] flex-shrink-0">
            <OrderSummary
              cartItems={cartItems}
              subTotal={subTotal}
              delivery={delivery}
              total={total}
              sym={sym}
              onOrder={handleOrder}
              ordering={ordering}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
