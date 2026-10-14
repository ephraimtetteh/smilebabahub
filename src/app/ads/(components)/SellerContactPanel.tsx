"use client";

// client/src/components/ads/(components)/SellerContactPanel.tsx
//
// The "Seller Details" block on an ad detail page, with the category
// rules applied.
//
// ─── WHAT IT REPLACES ────────────────────────────────────────────────
//
// The panel showed WhatsApp, a phone reveal and chat on every listing.
// On a phone or an apartment that's a route straight off-platform: the
// buyer calls, they agree a price on WhatsApp, and SmileBaba sees
// neither the sale nor the 5% — and the buyer loses escrow.
//
// Marketplace is the opposite. It's classifieds, built on people talking
// to each other, and hiding contact there makes the category useless.
//
// So the rules come from listingPolicy, the same file the app uses. Same
// listing, same answer on both platforms — otherwise a buyer who finds a
// number on the website simply uses the website.
//
// ─── WHEN CONTACT IS HIDDEN ──────────────────────────────────────────
//
// It explains why, rather than leaving a gap where buttons were. "No
// contact" reads as broken. "Order first and you can message them"
// reads as a reason — and it's true: the order page shows vendor chat
// and phone once money has moved.

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Phone,
  MessageCircle,
  MapPin,
  Shield,
  Lock,
  Store,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";

import { useAppSelector } from "@/src/app/redux";
import {
  getListingPolicy,
  isStay,
  isVendorSubscribed,
  type Ad,
} from "@/src/lib/util/listingPolicy";

interface Props {
  ad: Ad & Record<string, any>;
  isOwner: boolean;
  /** Fires the contact-click counter, which also feeds trending */
  onContactClick: () => void;
}

export default function SellerContactPanel({
  ad,
  isOwner,
  onContactClick,
}: Props) {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  const [phoneReveal, setPhoneReveal] = useState(false);

  const policy = getListingPolicy(ad);
  const stay = isStay(ad);
  const subscribed = isVendorSubscribed(ad);

  const vendorObj = typeof ad.postedBy === "object" ? ad.postedBy : null;
  const vendorId = String(vendorObj?._id ?? ad.postedBy ?? "");
  const vendorName =
    ad.contact?.name ?? vendorObj?.storeName ?? vendorObj?.username ?? "Seller";
  const storeSlug = vendorObj?.storeSlug;

  const phone = ad.contact?.phone ?? vendorObj?.storePhone ?? vendorObj?.phone;
  const whatsapp = ad.contact?.whatsapp ?? vendorObj?.whatsapp;
  const waNumber = String(whatsapp ?? "").replace(/\D/g, "");
  const waMsg = encodeURIComponent(
    `Hi, I saw your listing "${ad.title}" on SmileBaba Hub.`,
  );

  // `showPhone` is the vendor's own choice and can only ever restrict
  // further — it never overrides the category rule
  const showPhone =
    policy.showPhone && !!phone && ad.contact?.showPhone !== false;
  const showWhatsApp = policy.showWhatsApp && !!waNumber;
  const anyContact = policy.showChat || showPhone || showWhatsApp;

  const openChat = useCallback(() => {
    if (!vendorId) return;

    const target = `/chat?with=${vendorId}&name=${encodeURIComponent(vendorName)}`;

    if (!user) {
      localStorage.setItem("redirectAfterLogin", target);
      router.push(`/auth/login?returnUrl=${encodeURIComponent(target)}`);
      return;
    }

    router.push(target);
  }, [vendorId, vendorName, user, router]);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
        {stay ? "Hosted by" : "Sold by"}
      </h3>

      {/* ─── Vendor ─── */}
      <div className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-400 text-lg font-black text-black">
          {vendorName.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-bold text-gray-900">{vendorName}</p>
            {subscribed && (
              <span className="flex flex-shrink-0 items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5">
                <BadgeCheck size={10} className="text-amber-700" />
                <span className="text-[8.5px] font-bold tracking-wide text-amber-700">
                  VERIFIED
                </span>
              </span>
            )}
          </div>

          <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={11} className="flex-shrink-0" />
            {[ad.location?.city, ad.location?.region]
              .filter(Boolean)
              .join(", ") || "Location not set"}
          </p>

          {storeSlug && (
            <Link
              href={`/vendors/${storeSlug}`}
              className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-gray-500 transition hover:text-gray-900"
            >
              <Store size={10} />
              View store
            </Link>
          )}
        </div>
      </div>

      {/* ─── Contact, where the category allows it ─── */}
      {!isOwner && anyContact && (
        <div className="space-y-2.5">
          {showWhatsApp && (
            <a
              href={`https://wa.me/${waNumber}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onContactClick}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3 text-sm font-bold text-white transition hover:opacity-90"
            >
              <MessageCircle size={15} />
              Chat on WhatsApp
            </a>
          )}

          {showPhone && (
            <button
              onClick={() => {
                setPhoneReveal(true);
                onContactClick();
              }}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition ${
                phoneReveal
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              <Phone size={15} />
              {phoneReveal ? phone : "Show phone number"}
            </button>
          )}

          {policy.showChat && (
            <button
              onClick={openChat}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 py-3 text-sm font-bold text-gray-700 transition hover:border-amber-400 hover:text-amber-600"
            >
              <MessageCircle size={15} />
              Message seller
            </button>
          )}
        </div>
      )}

      {/* ─── Why there's no contact ─── */}
      {!isOwner && !anyContact && policy.contactNote && (
        <div className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4">
          <Lock size={14} className="mt-0.5 flex-shrink-0 text-gray-500" />
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

      {/* ─── Contact shown, vendor unverified ─── */}
      {!isOwner && anyContact && policy.contactNote && (
        <div className="mt-3 flex items-start gap-1.5">
          <Lock size={10} className="mt-0.5 flex-shrink-0 text-gray-400" />
          <p className="text-[10.5px] leading-relaxed text-gray-400">
            {policy.contactNote}
          </p>
        </div>
      )}

      {/* ─── Buyer protection ─── */}
      {policy.showEscrowNote ? (
        <div
          className="mt-4 flex items-start gap-2.5 rounded-xl p-3"
          style={{ background: stay ? "#F0FDFA" : "#ECFDF5" }}
        >
          <ShieldCheck
            size={14}
            className="mt-0.5 flex-shrink-0"
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
                : "We hold your payment until you confirm the item arrived. Pay outside SmileBaba and you lose that cover."}
            </p>
          </div>
        </div>
      ) : (
        // Classifieds with no price — there's nothing to protect, so the
        // honest advice is the old one
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
          <Shield size={12} className="text-gray-300" />
          Meet in a public place. Never pay in advance.
        </div>
      )}
    </div>
  );
}
