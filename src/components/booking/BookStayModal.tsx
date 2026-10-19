"use client";

// src/components/booking/BookStayModal.tsx
//
// "Book now" for stays. Used by BOTH listing pages (/ads/[id] and
// /product/[id]). /ads/[id] used to send people to /ads/:id/book, which
// never existed (404) — this modal is the booking flow:
//   create booking (server prices it, holds dates 30 min)
//   → Flutterwave checkout → /bookings/complete verifies.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { X, ImageOff, Minus, Plus, CheckCircle2, Home } from "lucide-react";
import SafeImage from "@/src/components/SafeImage";
import { useAppSelector } from "@/src/app/redux";
import axiosInstance from "@/src/lib/api/axios";

// ── Book Now modal (apartments) ─────────────────────────────────────────────
export default function BookStayModal({
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
      toast.error("Please sign in to book");
      router.push(
        `/auth/login?returnUrl=${encodeURIComponent(window.location.pathname)}`,
      );
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
      // 1. Create — the server prices the stay and holds the dates for
      //    30 minutes. (Price/currency from the browser are ignored.)
      const { data: created } = await axiosInstance.post("/bookings", {
        adId: ad._id,
        propertyType: ad.category?.sub ?? "apartment",
        checkIn,
        checkOut,
        guests,
      });
      const bookingId = created?.booking?._id;
      if (!bookingId) throw new Error("Booking wasn't created");

      // 2. Payment. This step was missing: the site showed "Booking
      //    confirmed!" on an unpaid booking that the host could never act on.
      const { data: pay } = await axiosInstance.post(`/bookings/${bookingId}/pay`);
      const link = pay?.checkoutUrl ?? pay?.paymentLink ?? pay?.link;
      if (!link) throw new Error("No payment link was returned");

      // 3. Flutterwave → back to /bookings/complete, which verifies it
      window.location.href = link;
    } catch (err: any) {
      const res = err?.response?.data;
      toast.error(
        res?.code === "DATES_UNAVAILABLE"
          ? "Those dates were just taken. Please pick other dates."
          : (res?.message ?? err?.message ?? "Booking failed. Please try again."),
      );
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
              Booking requested
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
                  Opening secure checkout…
                </span>
              ) : nights > 0 ? (
                `Pay ${sym}${totalPrice.toLocaleString()} & book`
              ) : (
                "Select dates to book"
              )}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Paid securely via Flutterwave · Held until you check in · Free
              cancellation until the host confirms
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Order Now modal (food) ──────────────────────────────────────────────────
