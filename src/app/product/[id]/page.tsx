"use client";

// src/app/product/[id]/page.tsx

import React, { useEffect, useState, useCallback } from "react";
import SafeImage from "@/src/components/SafeImage";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Phone,
  MessageCircle,
  X,
  CalendarDays,
  MapPin,
  Clock,
  Eye,
  Heart,
  Share2,
  Tag,
  Truck,
  ChevronRight,
  Frown,
  Shield,
  BadgeCheck,
  ShoppingCart,
  Megaphone,
  Pencil,
  ImageOff,
  UtensilsCrossed,
  CreditCard,
  Minus,
  Plus,
  CheckCircle2,
  Package,
  Home,
} from "lucide-react";

import Button from "@/src/components/Button";
import AsideCard from "@/src/components/AsideCard";
import Socials from "@/src/components/Socials";
import ChatRoom from "@/src/components/ChatRoom";
import Offer from "@/src/components/Offer";
import FeaturedProducts from "@/src/components/FeaturedProducts";

import { useAds } from "@/src/hooks/useAds";
import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { addToCart, calculateTotals } from "@/src/lib/features/cart/cartSlice";
import axiosInstance from "@/src/lib/api/axios";
import { safetyTips } from "@/src/constants/safetyTips";
import {
  CONDITION_LABELS,
  BOOST_BADGE,
  formatAdPrice,
  formatDate,
} from "@/src/app/ads/(components)/ad.constants";

// ── Helpers ─────────────────────────────────────────────────────────────────
function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  if (!value) return null;
  return (
    <div
      className="flex items-start justify-between py-3
      border-b border-gray-100 last:border-0 gap-4"
    >
      <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
        {label}
      </span>
      <span className="text-sm text-gray-900 font-semibold text-right">
        {value}
      </span>
    </div>
  );
}

function Section({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100
      overflow-hidden ${className}`}
    >
      {title && (
        <h3
          className="text-sm font-bold text-gray-500 uppercase tracking-wider
          px-5 pt-4 pb-2 border-b border-gray-100"
        >
          {title}
        </h3>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Determine mode from category + pathname ──────────────────────────────────
type AdMode = "marketplace" | "food" | "apartments";

function resolveMode(category: string | undefined, pathname: string): AdMode {
  if (
    pathname.includes("restate") ||
    pathname.includes("apartment") ||
    category === "apartments"
  ) {
    return "apartments";
  }
  if (pathname.includes("food") || category === "food") return "food";
  return "marketplace";
}

// ── Book Now modal (apartments) ─────────────────────────────────────────────
function BookingModal({
  ad,
  onClose,
  sym,
}: {
  ad: any;
  onClose: () => void;
  sym: string;
}) {
  const user = useAppSelector((s) => s.auth.user);
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const nights =
    checkIn && checkOut
      ? Math.max(
          1,
          Math.round(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              86400000,
          ),
        )
      : 0;

  const totalPrice = nights * (ad.price?.amount ?? 0);

  const handleBook = async () => {
    if (!user) {
      toast.error("Please log in to make a booking");
      router.push("/auth/login");
      return;
    }
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      toast.error("Check-out must be after check-in");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/bookings", {
        adId: ad._id,
        propertyName: ad.title,
        propertyType: ad.category?.sub ?? "apartment",
        checkIn,
        checkOut,
        guests,
        totalPrice,
        currency: ad.price?.currency ?? "GHS",
      });
      setDone(true);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Booking failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center
      justify-center p-4"
    >
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Home size={18} className="text-[#ffc105]" />
            <h3 className="font-black text-gray-900 text-lg">
              Book this property
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center
              justify-center hover:bg-gray-200 transition"
          >
            <X size={14} />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <CheckCircle2 size={52} className="text-green-500 mx-auto mb-4" />
            <h4 className="text-xl font-black text-gray-900 mb-2">
              Booking confirmed!
            </h4>
            <p className="text-sm text-gray-500 mb-6">
              The host will confirm your booking. Check your history for
              updates.
            </p>
            <div className="space-y-2">
              <Link
                href="/account/bookings"
                className="block w-full py-3 bg-[#ffc105] text-black font-bold
                  rounded-2xl text-sm hover:bg-amber-400 transition text-center"
              >
                View my bookings
              </Link>
              <button
                onClick={onClose}
                className="block w-full py-2.5 text-gray-500 text-sm hover:text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Property snapshot */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {ad.images?.[0]?.url ? (
                  <SafeImage
                    src={ad.images[0].url}
                    alt={ad.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <ImageOff size={20} className="text-gray-300 m-auto mt-2" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">
                  {ad.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {[ad.location?.city, ad.location?.region]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="text-sm font-black text-[#ffc105] mt-0.5">
                  {sym}
                  {(ad.price?.amount ?? 0).toLocaleString()} / night
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5
                    text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5
                    text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>

            {/* Guests */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                Guests
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className="w-9 h-9 bg-gray-100 rounded-full flex items-center
                    justify-center hover:bg-gray-200 transition"
                >
                  <Minus size={14} />
                </button>
                <span className="text-lg font-bold text-gray-900 w-8 text-center">
                  {guests}
                </span>
                <button
                  onClick={() => setGuests((g) => Math.min(20, g + 1))}
                  className="w-9 h-9 bg-gray-100 rounded-full flex items-center
                    justify-center hover:bg-gray-200 transition"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Price summary */}
            {nights > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">
                    {sym}
                    {(ad.price?.amount ?? 0).toLocaleString()} × {nights} night
                    {nights > 1 ? "s" : ""}
                  </span>
                  <span className="font-bold">
                    {sym}
                    {totalPrice.toLocaleString()}
                  </span>
                </div>
                <div
                  className="flex justify-between text-sm font-black text-gray-900 pt-2
                  border-t border-amber-200 mt-2"
                >
                  <span>Total</span>
                  <span className="text-[#ffc105]">
                    {sym}
                    {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleBook}
              disabled={loading || !checkIn || !checkOut}
              className="w-full py-3.5 bg-[#ffc105] text-black font-black rounded-2xl
                text-sm hover:bg-amber-400 transition disabled:opacity-50
                active:scale-[0.99]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-4 h-4 border-2 border-black/30 border-t-black
                    rounded-full animate-spin"
                  />
                  Booking…
                </span>
              ) : nights > 0 ? (
                `Book for ${sym}${totalPrice.toLocaleString()}`
              ) : (
                "Select dates to book"
              )}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Free cancellation · Host confirms within 24h
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Order Now modal (food) ──────────────────────────────────────────────────
function OrderModal({
  ad,
  onClose,
  sym,
}: {
  ad: any;
  onClose: () => void;
  sym: string;
}) {
  const user = useAppSelector((s) => s.auth.user);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [qty, setQty] = useState(1);
  const [address, setAddress] = useState(
    user?.city ? `${user.city}, ${user.country}` : "",
  );
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const unitPrice = ad.price?.amount ?? 0;
  const totalPrice = unitPrice * qty;

  const handleOrder = async () => {
    if (!user) {
      toast.error("Please log in to place an order");
      router.push("/auth/login");
      return;
    }
    if (!address.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/orders", {
        adId: ad._id,
        items: [{ name: ad.title, qty, price: unitPrice }],
        total: totalPrice,
        currency: ad.price?.currency ?? "GHS",
        deliveryAddress: address.trim(),
        notes: notes.trim(),
      });

      // Also add to cart so user can see it in cart
      dispatch(
        addToCart({
          id: ad._id,
          title: ad.title,
          price: unitPrice,
          image: ad.images?.[0]?.url ?? "",
          category: ad.category?.main ?? "food",
          amount: qty,
        }),
      );
      dispatch(calculateTotals());

      setDone(true);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Order failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center
      justify-center p-4"
    >
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={18} className="text-[#ffc105]" />
            <h3 className="font-black text-gray-900 text-lg">
              Place your order
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center
              justify-center hover:bg-gray-200 transition"
          >
            <X size={14} />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <CheckCircle2 size={52} className="text-green-500 mx-auto mb-4" />
            <h4 className="text-xl font-black text-gray-900 mb-2">
              Order placed!
            </h4>
            <p className="text-sm text-gray-500 mb-6">
              Your order is being prepared. Track it in your order history.
            </p>
            <div className="space-y-2">
              <Link
                href="/account/orders"
                className="block w-full py-3 bg-[#ffc105] text-black font-bold
                  rounded-2xl text-sm hover:bg-amber-400 transition text-center"
              >
                Track my order
              </Link>
              <button
                onClick={onClose}
                className="block w-full py-2.5 text-gray-500 text-sm hover:text-gray-700"
              >
                Continue browsing
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Item row */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {ad.images?.[0]?.url ? (
                  <SafeImage
                    src={ad.images[0].url}
                    alt={ad.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <ImageOff size={20} className="text-gray-300 m-auto mt-2" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">
                  {ad.title}
                </p>
                <p className="text-sm font-black text-[#ffc105] mt-0.5">
                  {sym}
                  {unitPrice.toLocaleString()} each
                </p>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 bg-gray-100 rounded-full flex items-center
                    justify-center hover:bg-gray-200 transition"
                >
                  <Minus size={14} />
                </button>
                <span className="text-lg font-bold text-gray-900 w-8 text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  className="w-9 h-9 bg-gray-100 rounded-full flex items-center
                    justify-center hover:bg-gray-200 transition"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Delivery address */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                Delivery address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full delivery address"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5
                  text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                Notes for seller (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Any special requests…"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5
                  text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400
                  resize-none"
              />
            </div>

            {/* Summary */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">
                  {ad.title} × {qty}
                </span>
                <span className="font-bold">
                  {sym}
                  {totalPrice.toLocaleString()}
                </span>
              </div>
              {ad.delivery?.available && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-bold text-green-600">
                    {ad.delivery.fee === 0
                      ? "Free"
                      : `${sym}${ad.delivery.fee.toLocaleString()}`}
                  </span>
                </div>
              )}
              <div
                className="flex justify-between text-sm font-black text-gray-900
                pt-2 border-t border-amber-200 mt-2"
              >
                <span>Total</span>
                <span className="text-[#ffc105]">
                  {sym}
                  {totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleOrder}
              disabled={loading}
              className="w-full py-3.5 bg-[#ffc105] text-black font-black rounded-2xl
                text-sm hover:bg-amber-400 transition disabled:opacity-50
                active:scale-[0.99]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-4 h-4 border-2 border-black/30 border-t-black
                    rounded-full animate-spin"
                  />
                  Placing order…
                </span>
              ) : (
                `Order for ${sym}${totalPrice.toLocaleString()}`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Buy Now modal (marketplace) ─────────────────────────────────────────────
function BuyModal({
  ad,
  onClose,
  sym,
}: {
  ad: any;
  onClose: () => void;
  sym: string;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [address, setAddress] = useState(
    user?.city ? `${user.city}, ${user.country}` : "",
  );

  const handleBuy = async () => {
    if (!user) {
      toast.error("Please log in to place an order");
      router.push("/auth/login");
      return;
    }
    if (!address.trim()) {
      toast.error("Please enter a delivery or pickup address");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post("/orders", {
        adId: ad._id,
        items: [{ name: ad.title, qty: 1, price: ad.price?.amount ?? 0 }],
        total: ad.price?.amount ?? 0,
        currency: ad.price?.currency ?? "GHS",
        deliveryAddress: address.trim(),
      });

      dispatch(
        addToCart({
          id: ad._id,
          title: ad.title,
          price: ad.price?.amount ?? 0,
          image: ad.images?.[0]?.url ?? "",
          category: ad.category?.main ?? "marketplace",
          amount: 1,
        }),
      );
      dispatch(calculateTotals());
      setDone(true);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Could not place order. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center
      justify-center p-4"
    >
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-[#ffc105]" />
            <h3 className="font-black text-gray-900 text-lg">Buy now</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center
              justify-center hover:bg-gray-200 transition"
          >
            <X size={14} />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <CheckCircle2 size={52} className="text-green-500 mx-auto mb-4" />
            <h4 className="text-xl font-black text-gray-900 mb-2">
              Order placed!
            </h4>
            <p className="text-sm text-gray-500 mb-6">
              The seller has been notified. They will contact you to confirm.
            </p>
            <div className="space-y-2">
              <Link
                href="/account/orders"
                className="block w-full py-3 bg-[#ffc105] text-black font-bold
                  rounded-2xl text-sm hover:bg-amber-400 transition text-center"
              >
                View my orders
              </Link>
              <button
                onClick={onClose}
                className="block w-full py-2.5 text-gray-500 text-sm hover:text-gray-700"
              >
                Continue browsing
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Product snapshot */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {ad.images?.[0]?.url ? (
                  <SafeImage
                    src={ad.images[0].url}
                    alt={ad.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <ImageOff size={20} className="text-gray-300 m-auto mt-2" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">
                  {ad.title}
                </p>
                <p className="text-xs text-gray-500 capitalize mt-0.5">
                  {ad.condition}
                </p>
                <p className="text-sm font-black text-[#ffc105] mt-0.5">
                  {sym}
                  {(ad.price?.amount ?? 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                {ad.delivery?.available
                  ? "Delivery address"
                  : "Your pickup location / contact address"}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5
                  text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Summary */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <div className="flex justify-between text-sm font-black text-gray-900">
                <span>Total</span>
                <span className="text-[#ffc105]">
                  {sym}
                  {(ad.price?.amount ?? 0).toLocaleString()}
                </span>
              </div>
              {ad.negotiable === "yes" && (
                <p className="text-xs text-green-600 mt-1 font-medium">
                  Price is negotiable — you can discuss with the seller
                </p>
              )}
            </div>

            <button
              onClick={handleBuy}
              disabled={loading}
              className="w-full py-3.5 bg-[#ffc105] text-black font-black rounded-2xl
                text-sm hover:bg-amber-400 transition disabled:opacity-50
                active:scale-[0.99]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-4 h-4 border-2 border-black/30 border-t-black
                    rounded-full animate-spin"
                  />
                  Placing order…
                </span>
              ) : (
                `Confirm purchase`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Main component
// ══════════════════════════════════════════════════════════════════════════════
const ProductDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const {
    current: ad,
    currentLoading,
    currentError,
    loadAdById,
    logContactClick,
  } = useAds();

  const [mainImage, setMainImage] = useState<string | null>(null);
  const [activeThumb, setActiveThumb] = useState(0);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [chatRoom, setChatRoom] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [callRequest, setCallRequest] = useState(false);
  const [callName, setCallName] = useState("");
  const [callPhone, setCallPhone] = useState("");
  const [buyOpen, setBuyOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);

  // Determine mode from ad category + current URL
  const mode: AdMode = ad
    ? resolveMode(ad.category?.main, pathname)
    : "marketplace";

  const isOwner = Boolean(
    user &&
    ad &&
    String(
      typeof ad.postedBy === "object"
        ? (ad.postedBy as any)?._id
        : (ad.postedBy ?? ""),
    ) === String(user._id),
  );
  const sym = ad?.price?.currency === "NGN" ? "₦" : "₵";
  const waNumber = ad?.contact?.whatsapp?.replace(/\D/g, "");
  const waMsg = encodeURIComponent(
    `Hi, I saw your listing "${ad?.title}" on SmileBaba Hub.`,
  );

  useEffect(() => {
    if (id) loadAdById(id);
  }, [id]);

  useEffect(() => {
    if (ad?.images?.length) {
      const cover = ad.images.find((i) => i.isCover) ?? ad.images[0];
      setMainImage(cover?.url ?? null);
    }
  }, [ad]);

  const handleThumbClick = (url: string, idx: number) => {
    setMainImage(url);
    setActiveThumb(idx);
  };

  const handleRevealPhone = () => {
    setPhoneRevealed(true);
    logContactClick(id);
  };

  const handleCallbackSubmit = () => {
    if (!callName.trim() || !callPhone.trim()) {
      toast.error("Please enter your name and phone number");
      return;
    }
    toast.success("Call back requested! The seller will contact you shortly.");
    setCallRequest(false);
    setCallName("");
    setCallPhone("");
  };

  const handleAddToCart = () => {
    if (!ad) return;
    dispatch(
      addToCart({
        id: ad._id,
        title: ad.title,
        price: ad.price?.amount,
        image: ad.images?.[0]?.url ?? "",
        category: ad.category?.main ?? "",
        amount: 1,
      }),
    );
    dispatch(calculateTotals());
    toast.success("Added to cart successfully");
  };

  // Dynamic primary action based on mode
  const primaryAction = {
    marketplace: {
      label: "Buy now",
      icon: <CreditCard size={16} />,
      onClick: () => setBuyOpen(true),
    },
    food: {
      label: "Order now",
      icon: <UtensilsCrossed size={16} />,
      onClick: () => setOrderOpen(true),
    },
    apartments: {
      label: "Book now",
      icon: <CalendarDays size={16} />,
      onClick: () => setBookOpen(true),
    },
  }[mode];

  // ── Loading skeleton ──
  if (currentLoading || (!ad && !currentError)) {
    return (
      <div className="pt-32 pb-20 px-4 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (currentError || !ad) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center
        text-center px-4 pt-32"
      >
        <Frown size={52} className="text-gray-200 mb-4" />
        <h2 className="text-2xl font-black text-gray-800 mb-2">Ad not found</h2>
        <p className="text-gray-500 mb-6">
          {currentError ?? "This listing may have been removed."}
        </p>
        <Link
          href="/ads"
          className="px-6 py-3 bg-[#ffc105] text-black font-bold rounded-2xl
            hover:bg-amber-400 transition"
        >
          Browse listings
        </Link>
      </div>
    );
  }

  const boostBadge =
    ad.boost?.isBoosted && ad.boost?.boostTier
      ? BOOST_BADGE[ad.boost.boostTier as keyof typeof BOOST_BADGE]
      : null;

  const images = ad.images ?? [];

  return (
    <div className="pt-28 pb-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
      {/* Modals */}
      {buyOpen && (
        <BuyModal ad={ad} sym={sym} onClose={() => setBuyOpen(false)} />
      )}
      {bookOpen && (
        <BookingModal ad={ad} sym={sym} onClose={() => setBookOpen(false)} />
      )}
      {orderOpen && (
        <OrderModal ad={ad} sym={sym} onClose={() => setOrderOpen(false)} />
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link href="/ads" className="hover:text-gray-600 capitalize">
          Listings
        </Link>
        {ad.category?.main && (
          <>
            <ChevronRight size={12} />
            <Link
              href={`/ads?category=${ad.category.main}`}
              className="hover:text-gray-600 capitalize"
            >
              {ad.category.main}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="text-gray-600 truncate max-w-[160px]">{ad.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* ════════════════ LEFT COLUMN ════════════════ */}
        <div className="space-y-6">
          {/* Image gallery */}
          <div
            className="bg-white rounded-2xl shadow-sm border border-gray-100
            overflow-hidden"
          >
            <div className="relative aspect-[4/3]">
              {mainImage ? (
                <SafeImage
                  src={mainImage}
                  alt={ad.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageOff size={52} className="text-gray-200" />
                </div>
              )}
              {boostBadge && (
                <span
                  className={`absolute top-3 left-3 text-[11px] font-bold px-2.5
                  py-1 rounded-full border ${boostBadge.cls}`}
                >
                  {boostBadge.label}
                </span>
              )}
              {images.length > 1 && (
                <div
                  className="absolute bottom-3 right-3 bg-black/60 text-white
                  text-xs px-2.5 py-1 rounded-full"
                >
                  {activeThumb + 1} / {images.length}
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto scrollbar-none">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => handleThumbClick(img.url, i)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden
                      border-2 transition-colors
                      ${i === activeThumb ? "border-yellow-400" : "border-transparent hover:border-gray-300"}`}
                  >
                    <SafeImage
                      src={img.url}
                      alt={`thumb ${i}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title + meta */}
          <Section>
            {ad.category?.main && (
              <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                <Tag size={11} />
                <Link
                  href={`/ads?category=${ad.category.main}`}
                  className="hover:text-gray-600 capitalize"
                >
                  {ad.category.main}
                </Link>
                {ad.category?.sub && (
                  <>
                    <ChevronRight size={11} />
                    <span className="capitalize">{ad.category.sub}</span>
                  </>
                )}
              </nav>
            )}
            <h1 className="text-2xl font-black text-gray-900 mb-2">
              {ad.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-4">
              {ad.location?.city && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {[ad.location.city, ad.location.region]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={12} /> {formatDate(ad.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={12} /> {ad.views ?? 0} views
              </span>
            </div>

            <p className="text-gray-600 text-sm leading-7 whitespace-pre-line">
              {ad.description}
            </p>
          </Section>

          {/* Actions row */}
          <Section>
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              {!isOwner && !ad.isSold && (
                <>
                  {/* Primary action — Buy / Order / Book */}
                  <button
                    onClick={primaryAction.onClick}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5
                      bg-[#ffc105] text-black font-black rounded-2xl text-sm
                      hover:bg-amber-400 transition active:scale-[0.99]"
                  >
                    {primaryAction.icon}
                    {primaryAction.label}
                  </button>

                  {/* Add to cart (only for marketplace/food, not apartments) */}
                  {mode !== "apartments" && (
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5
                        bg-white border-2 border-[#ffc105] text-[#ffc105] font-bold
                        rounded-2xl text-sm hover:bg-yellow-50 transition"
                    >
                      <ShoppingCart size={16} />
                      Add to cart
                    </button>
                  )}

                  {/* Make an offer (marketplace only) */}
                  {mode === "marketplace" && !offerOpen && (
                    <button
                      onClick={() => setOfferOpen(true)}
                      className="sm:hidden flex-1 flex items-center justify-center
                        gap-2 py-3.5 bg-white border-2 border-gray-200 text-gray-700
                        font-bold rounded-2xl text-sm hover:bg-gray-50 transition"
                    >
                      <Megaphone size={16} />
                      Make offer
                    </button>
                  )}
                </>
              )}

              {isOwner && (
                <div
                  className="flex-1 flex items-center justify-center gap-2 py-3
                  bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-500
                  font-medium"
                >
                  This is your listing
                </div>
              )}

              {ad.isSold && (
                <div
                  className="flex-1 flex items-center justify-center gap-2 py-3
                  bg-gray-100 rounded-2xl text-sm text-gray-500 font-bold"
                >
                  Sold
                </div>
              )}
            </div>

            {mode === "marketplace" && !isOwner && (
              <div className="mt-3">
                {!offerOpen ? (
                  <button
                    onClick={() => setOfferOpen(true)}
                    className="hidden sm:flex w-full items-center justify-center gap-2
                      py-3 border-2 border-gray-200 text-gray-700 font-bold
                      rounded-2xl text-sm hover:border-[#ffc105] hover:text-[#ffc105] transition"
                  >
                    <Megaphone size={15} />
                    Make an offer
                  </button>
                ) : (
                  <Offer onClose={() => setOfferOpen(false)} />
                )}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <Socials />
            </div>
          </Section>

          {/* Specs */}
          <Section title="Details">
            {ad.condition && ad.condition !== "not_applicable" && (
              <DetailRow
                label="Condition"
                value={
                  CONDITION_LABELS[
                    ad.condition as keyof typeof CONDITION_LABELS
                  ] ?? ad.condition
                }
              />
            )}
            {ad.negotiable === "yes" && (
              <DetailRow
                label="Negotiable"
                value={
                  <span className="text-green-600">Yes, open to offers</span>
                }
              />
            )}
            {ad.delivery?.available && (
              <DetailRow
                label="Delivery"
                value={
                  ad.delivery.fee === 0
                    ? "Free delivery"
                    : `${sym}${ad.delivery.fee.toLocaleString()}`
                }
              />
            )}
            <DetailRow
              label="Category"
              value={<span className="capitalize">{ad.category?.main}</span>}
            />
            {ad.category?.sub && (
              <DetailRow
                label="Subcategory"
                value={<span className="capitalize">{ad.category.sub}</span>}
              />
            )}
            <DetailRow label="Posted" value={formatDate(ad.createdAt)} />
            {ad.expiresAt && (
              <DetailRow
                label="Expires"
                value={
                  <span className={ad.daysLeft! <= 3 ? "text-orange-500" : ""}>
                    {formatDate(ad.expiresAt)}
                    {ad.daysLeft !== null && ` (${ad.daysLeft}d left)`}
                  </span>
                }
              />
            )}
            <DetailRow
              label="Ad ID"
              value={
                <span className="font-mono text-xs">
                  {ad._id.slice(-8).toUpperCase()}
                </span>
              }
            />
            {ad.attributes?.map((attr) => (
              <DetailRow
                key={attr.key}
                label={attr.key.replace(/_/g, " ")}
                value={String(attr.value)}
              />
            ))}
          </Section>
        </div>

        {/* ════════════════ RIGHT SIDEBAR ════════════════ */}
        <aside className="space-y-4">
          {/* Price card */}
          <Section>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <p className="text-3xl font-black text-gray-900">
                  {formatAdPrice(
                    ad.price?.amount,
                    ad.price?.currency,
                    ad.price?.display,
                  )}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {ad.price?.currency}
                  {mode === "apartments" ? " / night" : ""}
                </p>
              </div>
              {ad.negotiable === "yes" && (
                <span
                  className="text-xs bg-green-100 text-green-700 font-semibold
                  px-2.5 py-1 rounded-full flex-shrink-0"
                >
                  Negotiable
                </span>
              )}
            </div>

            {ad.delivery?.available && (
              <div
                className="flex items-center gap-2 text-sm text-blue-600
                bg-blue-50 rounded-xl px-3 py-2 mb-3"
              >
                <Truck size={14} />
                Delivery available
                {ad.delivery.fee === 0
                  ? " · Free"
                  : ` · ${sym}${ad.delivery.fee.toLocaleString()}`}
              </div>
            )}

            {/* Primary CTA repeated in sidebar */}
            {!isOwner && !ad.isSold && (
              <button
                onClick={primaryAction.onClick}
                className="w-full flex items-center justify-center gap-2 py-3.5
                  bg-[#ffc105] text-black font-black rounded-2xl text-sm
                  hover:bg-amber-400 transition active:scale-[0.99] mb-2"
              >
                {primaryAction.icon}
                {primaryAction.label}
              </button>
            )}

            {/* Callback request */}
            <div className="space-y-2">
              {!callRequest ? (
                <button
                  onClick={() => setCallRequest(true)}
                  className="w-full py-3 border-2 border-gray-200 text-gray-700
                    font-bold rounded-2xl text-sm hover:border-[#ffc105]
                    hover:text-[#ffc105] transition"
                >
                  Request a call back
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium">
                    Enter your details — the seller will call you back:
                  </p>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={callName}
                    onChange={(e) => setCallName(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm
                      focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <input
                    type="tel"
                    placeholder="Your phone"
                    value={callPhone}
                    onChange={(e) => setCallPhone(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm
                      focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCallbackSubmit}
                      className="flex-1 py-2.5 bg-[#ffc105] text-black font-bold
                        rounded-xl text-sm hover:bg-amber-400 transition"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setCallRequest(false)}
                      className="flex-1 py-2.5 border border-gray-200 text-gray-600
                        rounded-xl text-sm hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* Seller details */}
          <Section title="Seller Details">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <div
                className="w-12 h-12 rounded-full bg-[#ffc105] flex items-center
                justify-center text-black font-black text-lg flex-shrink-0"
              >
                {ad.contact?.name?.charAt(0)?.toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 truncate">
                  {ad.contact?.name ??
                    (typeof ad.postedBy === "object"
                      ? (ad.postedBy as any)?.username
                      : undefined) ??
                    "Seller"}
                </p>
                <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                  <MapPin size={11} className="flex-shrink-0" />
                  {[ad.location?.city, ad.location?.region]
                    .filter(Boolean)
                    .join(", ") || "Location not set"}
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {ad.contact?.showPhone !== false && (
                <button
                  onClick={handleRevealPhone}
                  className={`w-full flex items-center justify-center gap-2 py-3
                    font-bold rounded-2xl text-sm transition
                    ${
                      phoneRevealed
                        ? "bg-green-500 text-white hover:bg-green-400"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                >
                  <Phone size={15} />
                  {phoneRevealed ? ad.contact.phone : "Show Phone Number"}
                </button>
              )}

              {waNumber && (
                <a
                  href={`https://wa.me/${waNumber}?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => logContactClick(id)}
                  className="w-full flex items-center justify-center gap-2 py-3
                    bg-[#25D366] text-white font-bold rounded-2xl text-sm
                    hover:opacity-90 transition"
                >
                  <MessageCircle size={15} />
                  Chat on WhatsApp
                </a>
              )}

              {!chatRoom ? (
                <button
                  onClick={() => setChatRoom(true)}
                  className="w-full flex items-center justify-center gap-2 py-3
                    border-2 border-gray-200 text-gray-700 font-bold rounded-2xl
                    text-sm hover:border-[#ffc105] hover:text-[#ffc105] transition"
                >
                  <MessageCircle size={15} />
                  Start a Chat
                </button>
              ) : (
                <ChatRoom
                  icon={<X size={15} />}
                  onClose={() => setChatRoom(false)}
                />
              )}
            </div>

            <div
              className="flex items-start gap-2 text-[11px] text-gray-400
              text-center mt-4 leading-relaxed justify-center"
            >
              <Shield
                size={12}
                className="flex-shrink-0 mt-0.5 text-gray-300"
              />
              For your safety, meet in a public place. Never pay in advance.
            </div>
          </Section>

          {/* Ad stats */}
          <Section>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { icon: <Eye size={16} />, label: "Views", value: ad.views },
                { icon: <Heart size={16} />, label: "Saves", value: ad.saves },
                {
                  icon: <Phone size={16} />,
                  label: "Contacts",
                  value: ad.contactClicks,
                },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-xl py-3">
                  <div className="flex justify-center text-gray-400 mb-1">
                    {s.icon}
                  </div>
                  <p className="text-lg font-black text-gray-900">
                    {s.value ?? 0}
                  </p>
                  <p className="text-[11px] text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Owner actions */}
          {isOwner && (
            <Section title="Manage your ad">
              <div className="space-y-2">
                <Link
                  href={`/ads/${id}/edit`}
                  className="w-full flex items-center justify-center gap-2 py-2.5
                    bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm
                    hover:bg-gray-200 transition"
                >
                  <Pencil size={14} /> Edit ad
                </Link>
                <Link
                  href="/ads/my"
                  className="w-full flex items-center justify-center py-2.5
                    border border-gray-200 text-gray-600 font-medium rounded-xl
                    text-sm hover:bg-gray-50 transition"
                >
                  My ads dashboard
                </Link>
              </div>
            </Section>
          )}

          {/* Safety tips */}
          <Section title="Safety Tips">
            <ul className="space-y-2">
              {safetyTips.map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="text-[#ffc105] font-bold mt-0.5 flex-shrink-0">
                    ✓
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </Section>
        </aside>
      </div>

      {/* Related listings */}
      <div className="mt-12">
        <FeaturedProducts
          category={(ad.category?.main as any) ?? "marketplace"}
          title={`Similar ${ad.category?.main ?? "listings"}`}
          viewAllHref={`/ads?category=${ad.category?.main ?? "marketplace"}`}
          viewAllLabel="See all →"
        />
      </div>
    </div>
  );
};

export default ProductDetails;
