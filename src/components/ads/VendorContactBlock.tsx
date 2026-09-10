"use client";

// client/src/components/ads/VendorContactBlock.tsx
//
// The "Sold by" card on an ad detail page.
//
// On marketplace it shows contact. On E-Commerce, Food and Stays it
// doesn't — and rather than leaving a blank space where buttons were, it
// explains what the buyer gets instead. "No contact" reads as broken;
// "your payment is protected and you can message them once you've
// ordered" reads as a reason.
//
// The rules live in lib/util/listingPolicy.ts, shared in shape with the
// app's copy. The two have to agree — a buyer who sees a phone number on
// the website and not in the app will use the website, and the
// commission goes with them.

import { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  Phone,
  ShieldCheck,
  Lock,
  Store,
  BadgeCheck,
} from "lucide-react";

import { useAppSelector } from "@/src/app/redux";
import axiosInstance from "@/src/lib/api/axios";
import {
  getListingPolicy,
  isStay,
  isVendorSubscribed,
  type Ad,
} from "@/src/lib/util/listingPolicy";

export default function VendorContactBlock({ ad }: { ad: Ad }) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  const policy = getListingPolicy(ad);
  const stay = isStay(ad);
  const subscribed = isVendorSubscribed(ad);

  const vendor = ad.postedBy ?? {};
  const vendorId = vendor._id;
  const vendorName = vendor.storeName ?? vendor.username ?? "SmileBaba vendor";
  const phone = vendor.storePhone ?? vendor.phone;
  const whatsapp = vendor.whatsapp;

  const showPhone = policy.showPhone && !!phone;
  const showWhatsApp = policy.showWhatsApp && !!whatsapp;
  const anyContact = policy.showChat || showPhone || showWhatsApp;

  /** Contact taps feed the trending score as well as analytics. */
  const recordClick = useCallback(() => {
    axiosInstance.post(`/ads/${ad._id}/contact-click`).catch(() => {});
  }, [ad._id]);

  const openChat = () => {
    if (!vendorId) return;

    if (!isAuthenticated) {
      const target = `/chat/new?seller=${vendorId}&adId=${ad._id}`;
      localStorage.setItem("redirectAfterLogin", target);
      router.push(`/auth/login?returnUrl=${encodeURIComponent(target)}`);
      return;
    }

    router.push(`/chat/new?seller=${vendorId}&adId=${ad._id}`);
  };

  return (
    <section className="rounded-2xl bg-gray-50 p-5">
      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
        {stay ? "Hosted by" : "Sold by"}
      </p>

      {/* ─── Vendor ─── */}
      <div className="mt-3 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-400 text-base font-bold text-gray-900">
          {vendorName[0]?.toUpperCase() ?? "S"}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-bold text-gray-900">
              {vendorName}
            </p>
            {subscribed && (
              <span className="flex shrink-0 items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5">
                <BadgeCheck size={10} className="text-amber-700" />
                <span className="text-[8.5px] font-bold tracking-wide text-amber-700">
                  VERIFIED
                </span>
              </span>
            )}
          </div>

          {vendor.storeSlug && (
            <Link
              href={`/vendors/${vendor.storeSlug}`}
              className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 transition hover:text-gray-900"
            >
              <Store size={11} />
              View store
            </Link>
          )}
        </div>
      </div>

      {/* ─── Contact, where it's offered ─── */}
      {anyContact && (
        <div className="mt-4 flex gap-2">
          {policy.showChat && (
            <button
              onClick={openChat}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-xs font-bold text-gray-900 transition hover:bg-gray-100"
            >
              <MessageCircle size={14} />
              {showPhone || showWhatsApp ? "Message" : "Message seller"}
            </button>
          )}

          {showPhone && (
            <a
              href={`tel:${phone}`}
              onClick={recordClick}
              className="flex items-center justify-center rounded-xl bg-white px-4 py-2.5 transition hover:bg-gray-100"
              aria-label="Call vendor"
            >
              <Phone size={15} className="text-gray-900" />
            </a>
          )}

          {showWhatsApp && (
            <a
              href={`https://wa.me/${String(whatsapp).replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              onClick={recordClick}
              className="flex items-center justify-center rounded-xl bg-emerald-100 px-4 py-2.5 transition hover:bg-emerald-200"
              aria-label="Message on WhatsApp"
            >
              <MessageCircle size={15} className="text-emerald-700" />
            </a>
          )}
        </div>
      )}

      {/* ─── Why there's no contact ─── */}
      {!anyContact && policy.contactNote && (
        <div className="mt-4 flex items-start gap-3 rounded-xl bg-white p-3.5">
          <Lock size={14} className="mt-0.5 shrink-0 text-gray-500" />
          <div>
            <p className="text-xs font-bold text-gray-700">
              {stay ? "Booked through SmileBaba" : "Ordered through SmileBaba"}
            </p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-gray-500">
              {policy.contactNote}
            </p>
          </div>
        </div>
      )}

      {/* ─── Contact shown, but the vendor isn't verified ─── */}
      {anyContact && policy.contactNote && (
        <div className="mt-3 flex items-start gap-1.5">
          <Lock size={10} className="mt-0.5 shrink-0 text-gray-400" />
          <p className="text-[10.5px] leading-relaxed text-gray-400">
            {policy.contactNote}
          </p>
        </div>
      )}

      {/* ─── Buyer protection ─── */}
      {policy.showEscrowNote && (
        <div
          className="mt-3 flex items-start gap-2.5 rounded-xl p-3"
          style={{ background: stay ? "#F0FDFA" : "#ECFDF5" }}
        >
          <ShieldCheck
            size={15}
            className="mt-0.5 shrink-0"
            style={{ color: stay ? "#0D9488" : "#059669" }}
          />
          <div>
            <p
              className="text-[11px] font-bold"
              style={{ color: stay ? "#115E59" : "#065F46" }}
            >
              Buyer protection
            </p>
            <p
              className="mt-0.5 text-[10.5px] leading-relaxed"
              style={{ color: stay ? "#0F766E" : "#047857" }}
            >
              {stay
                ? "We hold your payment until you check in. If the place isn't as described, report it and we'll refund you."
                : "We hold your payment until you confirm the item arrived. Pay outside the app and you lose that cover."}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
