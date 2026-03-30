"use client";
// src/components/ads/ProductDetail/OrderModal.tsx

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { UtensilsCrossed, Minus, Plus, CheckCircle2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { addToCart, calculateTotals } from "@/src/lib/features/cart/cartSlice";
import axiosInstance from "@/src/lib/api/axios";
import ModalShell from "./ModalShell";
import { useViewCountry } from "@/src/hooks/useViewCountry";
import { ModalProps } from "@/src/types/ad.types";
import { BtnSpinner } from "../../ads/(components)/AdUI";

export default function OrderModal({ ad, sym, onClose }: ModalProps) {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { country: viewCountry } = useViewCountry();

  const [qty, setQty] = useState(1);
  const [address, setAddress] = useState(
    user?.city ? `${user.city}, ${viewCountry}` : "",
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

  if (done) {
    return (
      <ModalShell
        icon={<UtensilsCrossed size={18} className="text-[#ffc105]" />}
        title="Place your order"
        onClose={onClose}
      >
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
      </ModalShell>
    );
  }

  return (
    <ModalShell
      icon={<UtensilsCrossed size={18} className="text-[#ffc105]" />}
      title="Place your order"
      onClose={onClose}
    >
      <div className="p-5 space-y-4">
        {/* Item snapshot */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            {ad.images?.[0]?.url ? (
              <img
                src={ad.images[0].url}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="block w-full h-full bg-gray-200 rounded-xl" />
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

        {/* Qty stepper */}
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

        {/* Address */}
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
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Any special requests…"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5
              text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
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
            text-sm hover:bg-amber-400 transition disabled:opacity-50 active:scale-[0.99]"
        >
          {loading ? (
            <BtnSpinner label="Placing order…" />
          ) : (
            `Order for ${sym}${totalPrice.toLocaleString()}`
          )}
        </button>
      </div>
    </ModalShell>
  );
}
