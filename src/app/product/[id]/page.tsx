"use client";

// src/app/product/[id]/page.tsx

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  IoCallOutline,
  IoChatboxEllipsesOutline,
  IoCloseOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoEyeOutline,
  IoHeartOutline,
  IoShareSocialOutline,
} from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineLocalOffer, MdVerified } from "react-icons/md";
import { FaAngleRight, FaBoxOpen, FaTruck, FaTag } from "react-icons/fa6";

import Button from "@/src/components/Button";
import AsideCard from "@/src/components/AsideCard";
import Socials from "@/src/components/Socials";
import ChatRoom from "@/src/components/ChatRoom";
import Offer from "@/src/components/Offer";
import FeaturedProducts from "@/src/components/FeaturedProducts";

import { useAds } from "@/src/hooks/useAds";
import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { addToCart } from "@/src/lib/features/cart/cartSlice";
import { safetyTips } from "@/src/constants/safetyTips";
import {
  CONDITION_LABELS,
  BOOST_BADGE,
  formatAdPrice,
  formatDate,
} from "@/src/app/ads/(components)/ad.constants";

// ── Detail row used in the specs table ────────────────────────────────────
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

// ── Section card ───────────────────────────────────────────────────────────
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
      p-5 sm:p-6 ${className}`}
    >
      {title && (
        <h3
          className="text-base font-bold text-gray-900 mb-4 pb-3
          border-b border-gray-100"
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
const ProductDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
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
        image: ad.coverImage ?? ad.images?.[0]?.url ?? "",
        category: ad.category?.main ?? "",
        amount: 1,
      }),
    );
    toast.success("Added to cart! 🛒");
  };

  // ── Loading skeleton ──
  if (currentLoading || (!ad && !currentError)) {
    return (
      <div className="pt-32 pb-20 px-4 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 animate-pulse">
          <div className="space-y-4">
            <div className="h-9 bg-gray-100 rounded-xl w-3/4" />
            <div className="aspect-[4/3] bg-gray-100 rounded-2xl" />
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-xl" />
              ))}
            </div>
            <div className="h-40 bg-gray-100 rounded-2xl" />
          </div>
          <div className="space-y-4">
            <div className="h-36 bg-gray-100 rounded-2xl" />
            <div className="h-56 bg-gray-100 rounded-2xl" />
            <div className="h-32 bg-gray-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // ── Not found ──
  if (currentError || !ad) {
    return (
      <div className="pt-40 text-center px-4">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-gray-800 font-bold text-xl mb-2">
          Product not found
        </p>
        <p className="text-gray-400 text-sm mb-8">{currentError}</p>
        <Link
          href="/ads"
          className="px-8 py-3 bg-[#ffc105] text-black font-bold rounded-2xl text-sm"
        >
          Browse all ads →
        </Link>
      </div>
    );
  }

  const sym = ad.price?.currency === "NGN" ? "₦" : "₵";
  const images = ad.images ?? [];
  const boostBadge = ad.boost?.isBoosted
    ? BOOST_BADGE[ad.boost.boostTier]
    : null;
  const isOwner = user && String(ad.postedBy?._id) === String(user._id);
  const waNumber = ad.contact?.whatsapp?.replace(/\D/g, "");
  const waMsg = encodeURIComponent(
    `Hi, I saw your ad for "${ad.title}" on SmileBaba`,
  );

  return (
    <div
      className="pt-28 md:pt-32 pb-16 px-4 md:px-10 lg:px-16 xl:px-24
      max-w-7xl mx-auto"
    >
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600">
          Home
        </Link>
        <span>›</span>
        <Link href="/ads" className="hover:text-gray-600">
          Ads
        </Link>
        {ad.category?.main && (
          <>
            <span>›</span>
            <Link
              href={`/ads?category=${ad.category.main}`}
              className="hover:text-gray-600 capitalize"
            >
              {ad.category.main}
            </Link>
          </>
        )}
        <span>›</span>
        <span className="text-gray-600 truncate max-w-[200px]">{ad.title}</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        {/* ════════════════ LEFT COLUMN ════════════════ */}
        <div className="space-y-6">
          {/* ── Title + badges ── */}
          <div>
            <div className="flex items-start gap-3 flex-wrap mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex-1">
                {ad.title}
              </h1>
              {boostBadge && (
                <span
                  className={`flex-shrink-0 text-xs font-bold px-3 py-1
                  rounded-full border ${boostBadge.cls}`}
                >
                  {boostBadge.label}
                </span>
              )}
              {ad.isSold && (
                <span
                  className="flex-shrink-0 text-xs font-bold px-3 py-1
                  rounded-full bg-red-100 text-red-600"
                >
                  SOLD
                </span>
              )}
            </div>

            {/* Quick meta row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              {ad.location?.city || ad.location?.region ? (
                <span className="flex items-center gap-1">
                  <IoLocationOutline className="text-[#ffc105]" />
                  {[ad.location.city, ad.location.region]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              ) : null}
              <span className="flex items-center gap-1">
                <IoTimeOutline />
                {formatDate(ad.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <IoEyeOutline />
                {ad.views ?? 0} views
              </span>
            </div>
          </div>

          {/* ── Image gallery ── */}
          <Section>
            {/* Main image */}
            <div
              className="relative rounded-xl overflow-hidden bg-gray-100
              aspect-[4/3] mb-3"
            >
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={ad.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  🖼️
                </div>
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

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => handleThumbClick(img.url, i)}
                    className={`relative flex-shrink-0 w-18 h-18 w-[72px] h-[72px]
                      rounded-xl overflow-hidden border-2 transition
                      ${
                        i === activeThumb
                          ? "border-[#ffc105]"
                          : "border-transparent hover:border-gray-300"
                      }`}
                  >
                    <Image
                      src={img.url}
                      alt={`thumb ${i + 1}`}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </Section>

          {/* ── Description ── */}
          <Section title="Description">
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
              {ad.description || "No description provided."}
            </p>

            {ad.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                {ad.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/ads?search=${tag}`}
                    className="flex items-center gap-1 text-xs bg-gray-100
                      text-gray-600 px-3 py-1 rounded-full hover:bg-yellow-50
                      hover:text-yellow-700 transition"
                  >
                    <FaTag className="text-[10px]" /> {tag}
                  </Link>
                ))}
              </div>
            )}
          </Section>

          {/* ── Product details / specs ── */}
          <Section title="Product Details">
            <DetailRow
              label="Category"
              value={
                <span className="flex items-center gap-1.5">
                  <span className="capitalize">{ad.category?.main}</span>
                  {ad.category?.sub && (
                    <span className="text-gray-400">› {ad.category.sub}</span>
                  )}
                </span>
              }
            />
            {ad.condition && ad.condition !== "not_applicable" && (
              <DetailRow
                label="Condition"
                value={
                  <span className="text-blue-600">
                    {CONDITION_LABELS[ad.condition]}
                  </span>
                }
              />
            )}
            <DetailRow
              label="Negotiable"
              value={
                ad.negotiable === "yes" ? (
                  <span className="text-green-600">✓ Yes, open to offers</span>
                ) : ad.negotiable === "no" ? (
                  "Fixed price"
                ) : (
                  "Not specified"
                )
              }
            />
            <DetailRow
              label="Location"
              value={[
                ad.location?.address,
                ad.location?.city,
                ad.location?.region,
                ad.location?.country,
              ]
                .filter(Boolean)
                .join(", ")}
            />
            {ad.delivery?.available && (
              <DetailRow
                label="Delivery"
                value={
                  <span className="flex items-center gap-1.5">
                    <FaTruck className="text-blue-500" />
                    {ad.delivery.option?.replace(/_/g, " ")}
                    {ad.delivery.fee > 0
                      ? ` · ${sym}${ad.delivery.fee.toLocaleString()}`
                      : " · Free"}
                    {ad.delivery.note ? ` (${ad.delivery.note})` : ""}
                  </span>
                }
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

            {/* EAV attributes */}
            {ad.attributes?.map((attr) => (
              <DetailRow
                key={attr.key}
                label={attr.key.replace(/_/g, " ")}
                value={String(attr.value)}
              />
            ))}
          </Section>

          {/* ── Actions row ── */}
          <Section>
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              {!offerOpen ? (
                <button
                  onClick={() => setOfferOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3
                    bg-white border-2 border-[#ffc105] text-[#ffc105] font-bold
                    rounded-2xl text-sm hover:bg-yellow-50 transition"
                >
                  <MdOutlineLocalOffer className="text-lg" />
                  Make an offer
                </button>
              ) : (
                <div className="flex-1">
                  <Offer onClose={() => setOfferOpen(false)} />
                </div>
              )}

              {!ad.isSold && (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3
                    bg-[#ffc105] text-black font-bold rounded-2xl text-sm
                    hover:bg-amber-400 transition active:scale-[0.99]"
                >
                  🛒 Add to cart
                </button>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <Socials />
            </div>
          </Section>
        </div>

        {/* ════════════════ RIGHT SIDEBAR ════════════════ */}
        <aside className="space-y-4">
          {/* ── Price card ── */}
          <Section>
            <div className="flex items-start justify-between gap-2 mb-1">
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
                bg-blue-50 rounded-xl px-3 py-2 mt-3"
              >
                <FaTruck />
                Delivery available
                {ad.delivery.fee === 0
                  ? " · Free"
                  : ` · ${sym}${ad.delivery.fee.toLocaleString()}`}
              </div>
            )}

            <div className="mt-4 space-y-2">
              {!callRequest ? (
                <button
                  onClick={() => setCallRequest(true)}
                  className="w-full py-3 border-2 border-[#ffc105] text-[#ffc105]
                    font-bold rounded-2xl text-sm hover:bg-yellow-50 transition"
                >
                  📞 Request a call back
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium">
                    Enter your details and the seller will call you back:
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
                    placeholder="Your phone number"
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
                        font-medium rounded-xl text-sm hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* ── Seller details ── */}
          <Section title="Seller Details">
            {/* Avatar + name */}
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
              {ad.postedBy?.profilePicture ? (
                <div className="relative w-14 h-14 flex-shrink-0">
                  <Image
                    src={ad.postedBy.profilePicture}
                    alt="seller"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
              ) : (
                <div
                  className="w-14 h-14 rounded-full bg-[#ffc105] flex items-center
                  justify-center text-2xl font-black text-black flex-shrink-0"
                >
                  {ad.contact?.name?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-gray-900 truncate">
                    {ad.contact?.name}
                  </p>
                  <MdVerified className="text-blue-500 flex-shrink-0 text-sm" />
                </div>
                {ad.postedBy?.username && (
                  <p className="text-xs text-gray-400">
                    @{ad.postedBy.username}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">
                  📍{" "}
                  {[ad.location?.city, ad.location?.region]
                    .filter(Boolean)
                    .join(", ") || "Location not set"}
                </p>
              </div>
            </div>

            {/* Contact buttons */}
            <div className="space-y-2.5">
              {/* Phone reveal */}
              {ad.contact?.showPhone !== false && (
                <button
                  onClick={handleRevealPhone}
                  className={`w-full flex items-center justify-center gap-2 py-3
                    font-bold rounded-2xl text-sm transition
                    ${
                      phoneRevealed
                        ? "bg-green-500 text-white hover:bg-green-400"
                        : "bg-[#ffc105] text-black hover:bg-amber-400"
                    }`}
                >
                  <IoCallOutline className="text-lg" />
                  {phoneRevealed ? ad.contact.phone : "Show Phone Number"}
                </button>
              )}

              {/* WhatsApp */}
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
                  <FaWhatsapp className="text-lg" />
                  Chat on WhatsApp
                </a>
              )}

              {/* In-app chat */}
              {!chatRoom ? (
                <button
                  onClick={() => setChatRoom(true)}
                  className="w-full flex items-center justify-center gap-2 py-3
                    border-2 border-gray-200 text-gray-700 font-bold rounded-2xl
                    text-sm hover:border-[#ffc105] hover:text-[#ffc105] transition"
                >
                  <IoChatboxEllipsesOutline className="text-lg" />
                  Start a Chat
                </button>
              ) : (
                <ChatRoom
                  icon={<IoCloseOutline />}
                  onClose={() => setChatRoom(false)}
                />
              )}
            </div>

            {/* Safety note */}
            <p className="text-[11px] text-gray-400 text-center mt-4 leading-relaxed">
              🔒 For your safety, meet in a public place. Never transfer money
              in advance.
            </p>
          </Section>

          {/* ── Ad stats ── */}
          <Section>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                {
                  icon: <IoEyeOutline className="text-lg" />,
                  label: "Views",
                  value: ad.views,
                },
                {
                  icon: <IoHeartOutline className="text-lg" />,
                  label: "Saves",
                  value: ad.saves,
                },
                {
                  icon: <IoCallOutline className="text-lg" />,
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

          {/* ── Owner actions (if own ad) ── */}
          {isOwner && (
            <Section title="Manage your ad">
              <div className="space-y-2">
                <Link
                  href={`/ads/${id}/edit`}
                  className="w-full flex items-center justify-center py-2.5
                    bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm
                    hover:bg-gray-200 transition"
                >
                  ✏️ Edit ad
                </Link>
                <Link
                  href="/ads/my"
                  className="w-full flex items-center justify-center py-2.5
                    border border-gray-200 text-gray-600 font-medium rounded-xl
                    text-sm hover:bg-gray-50 transition"
                >
                  📋 My ads dashboard
                </Link>
              </div>
            </Section>
          )}

          {/* ── Comments ── */}
          <Section>
            <AsideCard
              href="/comments"
              count={0}
              text="Comments"
              iconText="View"
              icon={<FaAngleRight />}
            />
          </Section>

          {/* ── Safety tips ── */}
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

      {/* ── Related listings ── */}
      <div className="mt-12 space-y-8">
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
