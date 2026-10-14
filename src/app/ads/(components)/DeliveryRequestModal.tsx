"use client";
// src/components/ads/ProductDetail/DeliveryRequestModal.tsx
// Rider booking flow:
//   Customer fills pickup/dropoff/item → POST /orders
//   Rider (vendor) gets SMS → confirms → dispatched → delivered
//   Customer gets SMS at each step

import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Navigation,
  MapPin,
  Package,
  Phone,
  CheckCircle2,
  Clock,
  Truck,
} from "lucide-react";
import { useAppSelector } from "@/src/app/redux";
import axiosInstance from "@/src/lib/api/axios";
import { ModalProps } from "@/src/types/ad.types";
import ModalShell from "../../product/(components)/ModalShell";


const inp = [
  "w-full border border-gray-200 rounded-xl px-4 py-3",
  "text-sm text-gray-800 outline-none transition",
  "focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400",
].join(" ");

const lbl = "block text-xs font-semibold text-gray-500 mb-1.5";

// Safe helper — postedBy can be a string id or a populated object
function getRiderName(ad: ModalProps["ad"]): string {
  const fromContact = ad.contact?.name;
  if (fromContact) return fromContact;
  const pb = ad.postedBy;
  if (typeof pb === "object" && pb !== null)
    return (pb as any).username ?? "Rider";
  return "Rider";
}

export default function DeliveryRequestModal({ ad, sym, onClose }: ModalProps) {
  const user = useAppSelector((s) => s.auth.user);
  const riderName = getRiderName(ad);

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState(user?.city ?? "");
  const [item, setItem] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const price = ad.price?.amount ?? 0;
  const currency = ad.price?.currency ?? "GHS";

  const rawWa = ad.contact?.whatsapp ?? ad.contact?.phone ?? "";
  const waNum = rawWa.replace(/\D/g, "");
  const waText = encodeURIComponent(
    `Hi ${riderName}, I need a delivery on SmileBaba.\nPickup: ${pickup}\nDropoff: ${dropoff}\nItem: ${item}`,
  );

  const handleSubmit = async () => {
    if (!pickup.trim()) {
      toast.error("Enter pickup address");
      return;
    }
    if (!dropoff.trim()) {
      toast.error("Enter dropoff address");
      return;
    }
    if (!item.trim()) {
      toast.error("Describe what needs to be delivered");
      return;
    }
    if (!user) {
      toast.error("Please sign in to book a rider");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/orders", {
        adId: ad._id,
        items: [{ name: item.trim(), qty: 1, price }],
        total: price,
        currency,
        deliveryAddress: `Pickup: ${pickup.trim()} → Dropoff: ${dropoff.trim()}`,
        notes: notes.trim() || undefined,
      });
      setDone(true);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Booking failed — try WhatsApp below",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (done) {
    return (
      <ModalShell
        icon={<Truck size={18} className="text-green-600" />}
        title="Rider booked!"
        onClose={onClose}
      >
        <div className="flex flex-col items-center gap-4 py-6 px-5 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">Request sent!</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              {riderName} will confirm soon. You`ll get an SMS when they`re on
              the way.
            </p>
          </div>

          {/* Status timeline */}
          <div className="w-full bg-gray-50 rounded-2xl p-4 text-left space-y-3">
            {[
              {
                icon: <Clock size={13} className="text-yellow-500" />,
                label: "Awaiting confirmation",
              },
              {
                icon: <Truck size={13} className="text-blue-500" />,
                label: "Rider picks up your item",
              },
              {
                icon: <Navigation size={13} className="text-purple-500" />,
                label: "Out for delivery 🛵",
              },
              {
                icon: <CheckCircle2 size={13} className="text-green-500" />,
                label: "Delivered ✓",
              },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 bg-white border border-gray-200 rounded-full
                  flex items-center justify-center flex-shrink-0"
                >
                  {s.icon}
                </div>
                <span className="text-xs text-gray-600">{s.label}</span>
              </div>
            ))}
          </div>

          {waNum && (
            <a
              href={`https://wa.me/${waNum}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2
                bg-green-500 text-white font-bold py-3 rounded-xl text-sm
                hover:bg-green-600 transition"
            >
              <Phone size={14} /> Chat with {riderName} on WhatsApp
            </a>
          )}
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-gray-600 transition"
          >
            Close
          </button>
        </div>
      </ModalShell>
    );
  }

  // ── Booking form ──────────────────────────────────────────────────────────
  return (
    <ModalShell
      icon={<Truck size={18} className="text-gray-700" />}
      title={`Book ${riderName}`}
      onClose={onClose}
    >
      <div className="space-y-4 p-5">
        {/* Rider info strip */}
        <div className="flex items-center gap-3 bg-gray-950 text-white rounded-2xl p-3">
          <div
            className="w-10 h-10 bg-[#ffd700] rounded-xl flex items-center
            justify-center flex-shrink-0"
          >
            <Truck size={18} className="text-black" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{ad.title}</p>
            <p className="text-xs text-gray-400 truncate">
              {riderName} ·{" "}
              {price > 0
                ? `${sym}${price.toLocaleString()} starting`
                : "Negotiate with rider"}
            </p>
          </div>
        </div>

        {/* Pickup */}
        <div>
          <label className={lbl}>
            <MapPin size={11} className="inline mr-1 text-blue-500" />
            Pickup address *
          </label>
          <input
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="Where should the rider collect from?"
            className={inp}
          />
        </div>

        {/* Dropoff */}
        <div>
          <label className={lbl}>
            <Navigation size={11} className="inline mr-1 text-green-500" />
            Dropoff address *
          </label>
          <input
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            placeholder="Where should it be delivered?"
            className={inp}
          />
        </div>

        {/* Item */}
        <div>
          <label className={lbl}>
            <Package size={11} className="inline mr-1 text-amber-500" />
            What needs delivering? *
          </label>
          <input
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="e.g. Food from KFC, document, small package"
            className={inp}
          />
        </div>

        {/* Notes */}
        <div>
          <label className={lbl}>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special instructions…"
            rows={2}
            className={`${inp} resize-none`}
          />
        </div>

        {/* Price row */}
        <div
          className="flex items-center justify-between
          bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-xl px-4 py-3"
        >
          <span className="text-sm font-semibold text-gray-700">
            Agreed price
          </span>
          <span className="text-base font-black text-gray-900">
            {price > 0
              ? `${sym}${price.toLocaleString()}`
              : "Negotiate with rider"}
          </span>
        </div>

        {/* Book CTA */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2
            bg-gray-900 text-[#ffd700] font-black py-3.5 rounded-2xl text-sm
            hover:bg-gray-700 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {loading ? (
            <>
              <span
                className="w-4 h-4 border-2 border-yellow-400/40 border-t-yellow-400
                rounded-full animate-spin"
              />{" "}
              Booking…
            </>
          ) : (
            <>
              <Truck size={16} /> Book this rider
            </>
          )}
        </button>

        {/* WhatsApp fallback */}
        {waNum && (
          <a
            href={`https://wa.me/${waNum}?text=${encodeURIComponent(`Hi, I need a delivery — saw your ad on SmileBaba`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2
              border border-green-200 text-green-700 font-semibold
              py-2.5 rounded-xl text-sm hover:bg-green-50 transition"
          >
            <Phone size={13} /> Contact via WhatsApp instead
          </a>
        )}
      </div>
    </ModalShell>
  );
}
