"use client";
// src/components/ads/ProductDetail/BuyModal.tsx

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Package, CheckCircle2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { addToCart, calculateTotals } from "@/src/lib/features/cart/cartSlice";
import axiosInstance from "@/src/lib/api/axios";
import ModalShell from "./ModalShell";
import { ModalProps } from "@/src/types/ad.types";
import { BtnSpinner } from "../../ads/(components)/AdUI";

export default function BuyModal({ ad, sym, onClose }: ModalProps) {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [address, setAddress] = useState(
    user?.city ? `${user.city}, ${user.country}` : "",
  );
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

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

  if (done) {
    return (
      <ModalShell
        icon={<Package size={18} className="text-[#ffc105]" />}
        title="Buy now"
        onClose={onClose}
      >
        <div className="p-8 text-center">
          <CheckCircle2 size={52} className="text-green-500 mx-auto mb-4" />
          <h4 className="text-xl font-black text-gray-900 mb-2">
            Order placed!
          </h4>
          <p className="text-sm text-gray-500 mb-6">
            The seller has been notified and will contact you to confirm.
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
      </ModalShell>
    );
  }

  return (
    <ModalShell
      icon={<Package size={18} className="text-[#ffc105]" />}
      title="Buy now"
      onClose={onClose}
    >
      <div className="p-5 space-y-4">
        {/* Product snapshot */}
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
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm truncate">
              {ad.title}
            </p>
            {ad.condition && (
              <p className="text-xs text-gray-500 capitalize mt-0.5">
                {ad.condition}
              </p>
            )}
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
              : "Pickup location / contact address"}
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
            <p className="text-xs text-green-600 mt-1.5 font-medium">
              Price is negotiable — you can discuss with the seller
            </p>
          )}
        </div>

        <button
          onClick={handleBuy}
          disabled={loading}
          className="w-full py-3.5 bg-[#ffc105] text-black font-black rounded-2xl
            text-sm hover:bg-amber-400 transition disabled:opacity-50 active:scale-[0.99]"
        >
          {loading ? <BtnSpinner label="Placing order…" /> : "Confirm purchase"}
        </button>
      </div>
    </ModalShell>
  );
}
