"use client";
// src/components/ads/ProductDetail/BookingModal.tsx

import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Home, Minus, Plus, CheckCircle2 } from "lucide-react";
import { useAppSelector } from "@/src/app/redux";
import axiosInstance from "@/src/lib/api/axios";
import ModalShell from "./ModalShell";
import { ModalProps } from "@/src/types/ad.types";
import { BtnSpinner } from "../../ads/(components)/AdUI";


export default function BookingModal({ ad, sym, onClose }: ModalProps) {
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
  const today = new Date().toISOString().split("T")[0];

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

  if (done) {
    return (
      <ModalShell
        icon={<Home size={18} className="text-[#ffc105]" />}
        title="Book this property"
        onClose={onClose}
      >
        <div className="p-8 text-center">
          <CheckCircle2 size={52} className="text-green-500 mx-auto mb-4" />
          <h4 className="text-xl font-black text-gray-900 mb-2">
            Booking confirmed!
          </h4>
          <p className="text-sm text-gray-500 mb-6">
            The host will confirm your booking. Check your history for updates.
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
      </ModalShell>
    );
  }

  return (
    <ModalShell
      icon={<Home size={18} className="text-[#ffc105]" />}
      title="Book this property"
      onClose={onClose}
    >
      <div className="p-5 space-y-4">
        {/* Property snapshot */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            {ad.images?.[0]?.url ? (
              <Image
                src={ad.images[0].url}
                alt={ad.title}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <span className="block w-full h-full bg-gray-200 rounded-xl" />
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

        {/* Date pickers */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Check-in", value: checkIn, min: today, set: setCheckIn },
            {
              label: "Check-out",
              value: checkOut,
              min: checkIn || today,
              set: setCheckOut,
            },
          ].map(({ label, value, min, set }) => (
            <div key={label}>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                {label}
              </label>
              <input
                type="date"
                value={value}
                min={min}
                onChange={(e) => set(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5
                  text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          ))}
        </div>

        {/* Guest stepper */}
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
        )}

        <button
          onClick={handleBook}
          disabled={loading || !checkIn || !checkOut}
          className="w-full py-3.5 bg-[#ffc105] text-black font-black rounded-2xl
            text-sm hover:bg-amber-400 transition disabled:opacity-50 active:scale-[0.99]"
        >
          {loading ? (
            <BtnSpinner label="Booking…" />
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
    </ModalShell>
  );
}
