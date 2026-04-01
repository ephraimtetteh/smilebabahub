"use client";
// src/components/ads/ProductDetail/index.tsx
// Orchestrator only — all heavy logic lives in the sub-components.

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import {
  Phone,
  MessageCircle,
  ChevronRight,
  MapPin,
  Clock,
  Eye,
  Heart,
  Shield,
  ShoppingCart,
  Megaphone,
  Truck,
  Tag,
  Frown,
  Pencil,
  CreditCard,
  CalendarDays,
  UtensilsCrossed,
} from "lucide-react";

import { useAds } from "@/src/hooks/useAds";
import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { addToCart, calculateTotals } from "@/src/lib/features/cart/cartSlice";
import { safetyTips } from "@/src/constants/safetyTips";
import {
  CONDITION_LABELS,
  BOOST_BADGE,
  formatAdPrice,
  formatDate,
} from "@/src/app/ads/(components)/ad.constants";
import FeaturedProducts from "@/src/components/FeaturedProducts";

// Sub-components


// Lazy-imported originals (still used for chat / offer)
import Offer from "@/src/components/Offer";
import Socials from "@/src/components/Socials";
import { currencySym, resolveMode } from "../../ads/(components)/adHelpers";
import { AdMode } from "@/src/types/ad.types";
import BuyModal from "../(components)/BuyModal";
import BookingModal from "../(components)/BookingModal";
import OrderModal from "../(components)/OrderModal";
import AdGallery from "../../ads/(components)/AdGallery";
import { DetailRow, Section } from "../../ads/(components)/AdUI";
import ChatButton from "@/src/components/Chat/ChatButton";


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

  // Modal open states
  const [buyOpen, setBuyOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);

  // Callback-request state
  const [callRequest, setCallRequest] = useState(false);
  const [callName, setCallName] = useState("");
  const [callPhone, setCallPhone] = useState("");
  const [phoneReveal, setPhoneReveal] = useState(false);

  useEffect(() => {
    if (id) loadAdById(id);
  }, [id]);

  if (currentLoading || (!ad && !currentError)) {
    return (
      <div className="pt-32 pb-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-6 bg-gray-100 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-36 bg-gray-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentError || !ad) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center
        text-center px-4 pt-32"
      >
        <Frown size={52} className="text-gray-200 mb-4" />
        <h2 className="text-2xl font-black text-gray-800 mb-2">
          Listing not found
        </h2>
        <p className="text-gray-500 mb-6">
          {currentError ?? "This listing may have been removed."}
        </p>
        <Link
          href="/ads"
          className="px-6 py-3 bg-[#ffc105] text-black font-bold
          rounded-2xl hover:bg-amber-400 transition"
        >
          Browse listings
        </Link>
      </div>
    );
  }

  const mode: AdMode = resolveMode(ad.category?.main, pathname);
  const sym = currencySym(ad.price?.currency);
  const isNigeria =
    ad.location?.country?.toLowerCase().includes("nigeria") ||
    ad.price?.currency === "NGN";
  const isOwner =
    user && String(ad.postedBy?._id ?? ad.postedBy) === String(user._id);
  const boostBadge =
    ad.boost?.isBoosted && ad.boost?.boostTier
      ? BOOST_BADGE[ad.boost.boostTier as keyof typeof BOOST_BADGE]
      : null;
  const waNumber = ad.contact?.whatsapp?.replace(/\D/g, "");
  const waMsg = encodeURIComponent(
    `Hi, I saw your listing "${ad.title}" on SmileBaba Hub.`,
  );

  const handleAddToCart = () => {
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
    toast.success("Added to cart");
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

  // Primary CTA config per mode — typed as Record<AdMode> so TS knows all keys are handled
  const ctaMap: Record<
    AdMode,
    { label: string; icon: React.ReactNode; open: () => void }
  > = {
    marketplace: {
      label: "Buy now",
      icon: <CreditCard size={16} />,
      open: () => setBuyOpen(true),
    },
    food: {
      label: "Order now",
      icon: <UtensilsCrossed size={16} />,
      open: () => setOrderOpen(true),
    },
    apartments: {
      label: "Book now",
      icon: <CalendarDays size={16} />,
      open: () => setBookOpen(true),
    },
  };
  const cta = ctaMap[mode];

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
        <Link href="/ads" className="hover:text-gray-600">
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
        {/* ── LEFT ── */}
        <div className="space-y-6">
          <AdGallery
            images={ad.images ?? []}
            title={ad.title}
            boostBadge={boostBadge}
          />

          {/* Title + description */}
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
                <Clock size={12} />
                {formatDate(ad.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {ad.views ?? 0} views
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-7 whitespace-pre-line">
              {ad.description}
            </p>
          </Section>

          {/* Actions */}
          <Section>
            {!isOwner && !ad.isSold ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={cta.open}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5
                    bg-[#ffc105] text-black font-black rounded-2xl text-sm
                    hover:bg-amber-400 transition active:scale-[0.99]"
                >
                  {cta.icon}
                  {cta.label}
                </button>
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
              </div>
            ) : ad.isSold ? (
              <div
                className="flex items-center justify-center py-3 bg-gray-100
                rounded-2xl text-sm text-gray-500 font-bold"
              >
                Sold
              </div>
            ) : (
              <div
                className="flex items-center justify-center py-3 bg-gray-50
                border border-gray-200 rounded-2xl text-sm text-gray-500"
              >
                This is your listing
              </div>
            )}

            {mode === "marketplace" && !isOwner && (
              <div className="mt-3">
                {!offerOpen ? (
                  <button
                    onClick={() => setOfferOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3
                        border-2 border-gray-200 text-gray-700 font-bold rounded-2xl
                        text-sm hover:border-[#ffc105] hover:text-[#ffc105] transition"
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
            {ad.attributes?.map((attr: any) => (
              <DetailRow
                key={attr.key}
                label={attr.key.replace(/_/g, " ")}
                value={String(attr.value)}
              />
            ))}
          </Section>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="space-y-4">
          {/* Price + CTA */}
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
                Delivery
                {ad.delivery.fee === 0
                  ? " · Free"
                  : ` · ${sym}${ad.delivery.fee.toLocaleString()}`}
              </div>
            )}

            {!isOwner && !ad.isSold && (
              <button
                onClick={cta.open}
                className="w-full flex items-center justify-center gap-2 py-3.5
                  bg-[#ffc105] text-black font-black rounded-2xl text-sm
                  hover:bg-amber-400 transition mb-2"
              >
                {cta.icon}
                {cta.label}
              </button>
            )}

            {/* Callback */}
            {!callRequest ? (
              <button
                onClick={() => setCallRequest(true)}
                className="w-full py-3 border-2 border-gray-200 text-gray-700 font-bold
                  rounded-2xl text-sm hover:border-[#ffc105] hover:text-[#ffc105] transition"
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
          </Section>

          {/* Seller */}
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
                  {ad.contact?.name ?? ad.postedBy?.username ?? "Seller"}
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
              {/* Nigeria: WhatsApp first (primary channel), phone second */}
              {/* Ghana: phone reveal first, WhatsApp second */}

              {isNigeria && waNumber && (
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

              {ad.contact?.showPhone !== false && (
                <button
                  onClick={() => {
                    setPhoneReveal(true);
                    logContactClick(id);
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-3
                    font-bold rounded-2xl text-sm transition
                    ${
                      phoneReveal
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                >
                  <Phone size={15} />
                  {phoneReveal ? ad.contact.phone : "Show Phone Number"}
                </button>
              )}

              {!isNigeria && waNumber && (
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

              {!isOwner && (
                <ChatButton
                  sellerId={String(ad.postedBy?._id ?? ad.postedBy ?? "")}
                  sellerName={
                    ad.contact?.name ?? ad.postedBy?.username ?? "Seller"
                  }
                />
              )}
            </div>

            <div
              className="flex items-center gap-1.5 text-[11px] text-gray-400
              mt-4 justify-center"
            >
              <Shield size={12} className="text-gray-300" />
              Meet in a public place. Never pay in advance.
            </div>
          </Section>

          {/* Stats */}
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
                  <Pencil size={14} />
                  Edit ad
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

          {/* Safety */}
          <Section title="Safety Tips">
            <ul className="space-y-2">
              {safetyTips.map((tip: string, i: number) => (
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

      {/* Related */}
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
