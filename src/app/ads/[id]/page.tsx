"use client";

// client/src/components/ads/ProductDetail/index.tsx
//
// ─── WHAT CHANGED, AND WHY ───────────────────────────────────────────
//
// 1 · The primary CTA was rendered twice — once in the left Actions
//     section and once in the sidebar, both calling cta.open. Two
//     identical primary buttons on one page.
//
//     There's one now. On mobile the sidebar renders first so the price
//     and the action are above the fold; on desktop it sits on the right
//     where it was.
//
// 2 · resolveMode decided the CTA, and it has no idea what "ecommerce"
//     is. Anything unmapped fell through to a default, which is why
//     "Book now" turned up on products.
//
//     The CTA now comes from listingPolicy — canBook means book,
//     canAddToCart means buy, and neither means the listing is a
//     classified with no price, where contact is the action.
//
// 3 · "Request a call back" showed a success toast and did nothing. It
//     now posts to /ads/:id/callback, and only appears where contact is
//     allowed at all. Asking a fridge vendor to ring you is fine; the
//     policy just decides whether that category works that way.
//
// 4 · handleAddToCart omitted vendorId, vendorName and currency. The
//     cart groups by vendorId, so every item from this page landed in
//     one group labelled "Vendor" — and the currency defaulted to GHS,
//     which made createOrder reject a Nigerian checkout as MIXED_CURRENCY.
//
// 5 · The seller contact block is now SellerContactPanel, which applies
//     the same category rules as the app. A buyer who finds a phone
//     number here and not in the app will simply use the website.
//
// resolveMode is still used for the modal choice, which is what it's
// actually good at.

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Phone,
  MessageCircle,
  ChevronRight,
  MapPin,
  Clock,
  Eye,
  Heart,
  ShoppingCart,
  Megaphone,
  Truck,
  Tag,
  Frown,
  Pencil,
  CreditCard,
  CalendarDays,
  UtensilsCrossed,
  Loader2,
  ShieldCheck,
} from "lucide-react";

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
import FeaturedProducts from "@/src/components/FeaturedProducts";

import Offer from "@/src/components/Offer";
import Socials from "@/src/components/Socials";
import BuyModal from "../../product/(components)/BuyModal";
import OrderModal from "../../product/(components)/OrderModal";
import BookStayModal from "@/src/components/booking/BookStayModal";
import AdGallery from "../(components)/AdGallery";
import { DetailRow, Section } from "../(components)/AdUI";
import SellerContactPanel from "../(components)/SellerContactPanel";
import DeliveryTracker from "../(components)/DeliveryTracker";
import { AdMode } from "@/src/types/ad.types";
import { currencySym, resolveMode } from "../(components)/adHelpers";
import {
  getListingPolicy,
  canAddToCart as policyCanAddToCart,
  isStay,
} from "@/src/lib/util/listingPolicy";

const ProductDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const {
    current: ad,
    currentLoading,
    currentError,
    loadAdById,
    logContactClick,
  } = useAds();

  const [buyOpen, setBuyOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  // /ads/:id?book=1 (old /ads/:id/book links redirect here) opens booking
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("book") === "1") {
      setBookOpen(true);
    }
  }, []);
  const [offerOpen, setOfferOpen] = useState(false);

  const [callRequest, setCallRequest] = useState(false);
  const [callName, setCallName] = useState("");
  const [callPhone, setCallPhone] = useState("");
  const [callSending, setCallSending] = useState(false);

  useEffect(() => {
    if (id) loadAdById(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    setCallName(user?.username ?? "");
    setCallPhone(user?.phone ?? "");
  }, [user?._id]);

  // ─── Loading ──────────────────────────────────────────────────────
  if (currentLoading || (!ad && !currentError)) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-32 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <div className="aspect-[4/3] animate-pulse rounded-2xl bg-gray-100" />
            <div className="h-6 w-3/4 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Not found ────────────────────────────────────────────────────
  if (currentError || !ad) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-32 text-center">
        <Frown size={52} className="mb-4 text-gray-200" />
        <h2 className="mb-2 text-2xl font-black text-gray-800">
          Listing not found
        </h2>
        <p className="mb-6 text-gray-500">
          {currentError ?? "This listing may have been removed."}
        </p>
        <Link
          href="/ads"
          className="rounded-2xl bg-[#ffc105] px-6 py-3 font-bold text-black transition hover:bg-amber-400"
        >
          Browse listings
        </Link>
      </div>
    );
  }

  // ─── Derived ──────────────────────────────────────────────────────
  const mode: AdMode = resolveMode(ad.category?.main, pathname);
  const sym = currencySym(ad.price?.currency);

  const vendorObj =
    typeof ad.postedBy === "object" ? (ad.postedBy as any) : null;
  const vendorId = String(vendorObj?._id ?? ad.postedBy ?? "");
  const vendorName =
    ad.contact?.name ?? vendorObj?.storeName ?? vendorObj?.username ?? "Seller";

  const isOwner = Boolean(user && vendorId && vendorId === String(user._id));

  const boostBadge =
    ad.boost?.isBoosted && ad.boost?.boostTier
      ? BOOST_BADGE[ad.boost.boostTier as keyof typeof BOOST_BADGE]
      : null;

  const policy = getListingPolicy(ad as any);
  const stay = isStay(ad as any);
  const cartable = policyCanAddToCart(ad as any);
  const category = String(ad.category?.main ?? "").toLowerCase();

  const waNumber = String(ad.contact?.whatsapp ?? "").replace(/\D/g, "");
  const waMsg = encodeURIComponent(
    `Hi, I saw your listing "${ad.title}" on SmileBaba Hub.`,
  );

  /**
   * The CTA comes from the policy, not from resolveMode.
   *
   * canBook is only ever true for stays. canAddToCart is true for
   * anything priced and buyable. Neither means it's a classified with no
   * price, where the action is to talk to someone.
   */
  const cta = (() => {
    if (policy.canBook) {
      return {
        label: "Book now",
        icon: <CalendarDays size={16} />,
        open: () => setBookOpen(true), // was /ads/:id/book — a 404
      };
    }

    if (cartable) {
      const isFood = category === "food";
      return {
        label: isFood ? "Order now" : "Buy now",
        icon: isFood ? <UtensilsCrossed size={16} /> : <CreditCard size={16} />,
        open: () => (isFood ? setOrderOpen(true) : setBuyOpen(true)),
      };
    }

    // No price, or a service — contact is the transaction
    return {
      label: category === "services" ? "Request service" : "Contact seller",
      icon: <MessageCircle size={16} />,
      open: () => {
        if (policy.showWhatsApp && waNumber) {
          window.open(`https://wa.me/${waNumber}?text=${waMsg}`, "_blank");
          logContactClick(id);
          return;
        }
        if (policy.showPhone && ad.contact?.phone) {
          window.open(`tel:${ad.contact.phone}`);
          logContactClick(id);
          return;
        }

        const target = `/chat?with=${vendorId}&name=${encodeURIComponent(vendorName)}`;
        if (!user) {
          localStorage.setItem("redirectAfterLogin", target);
          router.push(`/auth/login?returnUrl=${encodeURIComponent(target)}`);
          return;
        }
        router.push(target);
      },
    };
  })();

  // ─── Cart ─────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: ad._id,
        adId: ad._id,
        title: ad.title,
        price: ad.price?.amount ?? 0,
        image: ad.images?.[0]?.url ?? "",
        category: ad.category?.main ?? "",
        currency: ad.price?.currency ?? "GHS",
        amount: 1,

        // The cart groups by these. Without them every seller merges
        // into one group under a single delivery address.
        vendorId,
        vendorName,

        deliveryAvailable: ad.delivery?.available ?? false,
        deliveryFee: ad.delivery?.fee ?? 0,
      }),
    );
    dispatch(calculateTotals());
    toast.success("Added to cart");
  };

  // ─── Call back ────────────────────────────────────────────────────
  const handleCallbackSubmit = async () => {
    if (!callName.trim() || !callPhone.trim()) {
      toast.error("Please enter your name and phone number");
      return;
    }
    if (callPhone.replace(/\D/g, "").length < 7) {
      toast.error("That phone number doesn't look right");
      return;
    }

    setCallSending(true);
    try {
      const { data } = await axiosInstance.post(`/ads/${id}/callback`, {
        name: callName.trim(),
        phone: callPhone.trim(),
      });
      toast.success(data.message ?? "The seller will call you back.");
      setCallRequest(false);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Couldn't send that. Please try again.",
      );
    } finally {
      setCallSending(false);
    }
  };

  const sellable = !isOwner && !ad.isSold;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 md:px-8 lg:px-16">
      {/* Modals */}
      {buyOpen && (
        <BuyModal ad={ad} sym={sym} onClose={() => setBuyOpen(false)} />
      )}
      {orderOpen && (
        <OrderModal ad={ad} sym={sym} onClose={() => setOrderOpen(false)} />
      )}
      {bookOpen && policy.canBook && (
        <BookStayModal ad={ad} sym={sym} onClose={() => setBookOpen(false)} />
      )}

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-gray-400">
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
              className="capitalize hover:text-gray-600"
            >
              {ad.category.main}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="max-w-[160px] truncate text-gray-600">{ad.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        {/* ═══ LEFT ═══ */}
        {/* order-2 on mobile so the price and CTA lead; normal on desktop */}
        <div className="order-2 space-y-6 lg:order-1">
          <AdGallery
            images={ad.images ?? []}
            title={ad.title}
            boostBadge={boostBadge}
          />

          {/* Title and description */}
          <Section>
            {ad.category?.main && (
              <nav className="mb-3 flex items-center gap-1.5 text-xs text-gray-400">
                <Tag size={11} />
                <Link
                  href={`/ads?category=${ad.category.main}`}
                  className="capitalize hover:text-gray-600"
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

            <h1 className="mb-2 text-2xl font-black text-gray-900">
              {ad.title}
            </h1>

            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-gray-400">
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

            <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
              {ad.description}
            </p>
          </Section>

          {/* Secondary actions — the primary CTA lives in the sidebar */}
          {sellable && (cartable || category === "marketplace") && (
            <Section>
              {cartable && (
                <button
                  onClick={handleAddToCart}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#ffc105] bg-white py-3.5 text-sm font-bold text-[#ffc105] transition hover:bg-yellow-50"
                >
                  <ShoppingCart size={16} />
                  Add to cart
                </button>
              )}

              {category === "marketplace" && (
                <div className={cartable ? "mt-3" : ""}>
                  {!offerOpen ? (
                    <button
                      onClick={() => setOfferOpen(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 py-3 text-sm font-bold text-gray-700 transition hover:border-[#ffc105] hover:text-[#ffc105]"
                    >
                      <Megaphone size={15} />
                      Make an offer
                    </button>
                  ) : (
                    <Offer onClose={() => setOfferOpen(false)} />
                  )}
                </div>
              )}

              <div className="mt-4 border-t border-gray-100 pt-4">
                <Socials />
              </div>
            </Section>
          )}

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
                  <span
                    className={
                      ad.daysLeft != null && ad.daysLeft <= 3
                        ? "text-orange-500"
                        : ""
                    }
                  >
                    {formatDate(ad.expiresAt)}
                    {ad.daysLeft != null && ` (${ad.daysLeft}d left)`}
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
                label={attr.label ?? attr.key.replace(/_/g, " ")}
                value={
                  attr.value === "yes"
                    ? "Yes"
                    : attr.value === "no"
                      ? "No"
                      : String(attr.value)
                }
              />
            ))}
          </Section>
        </div>

        {/* ═══ RIGHT ═══ */}
        <aside className="order-1 space-y-4 lg:order-2">
          {/* Price and the single primary CTA */}
          <Section>
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <p className="text-3xl font-black text-gray-900">
                  {formatAdPrice(
                    ad.price?.amount,
                    ad.price?.currency,
                    (ad.price as any)?.display,
                  )}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {ad.price?.currency}
                  {stay ? " / night" : ""}
                </p>
              </div>
              {ad.negotiable === "yes" && (
                <span className="flex-shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                  Negotiable
                </span>
              )}
            </div>

            {ad.delivery?.available && (
              <div className="mb-3 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-600">
                <Truck size={14} />
                Delivery
                {ad.delivery.fee === 0
                  ? " · Free"
                  : ` · ${sym}${ad.delivery.fee.toLocaleString()}`}
              </div>
            )}

            {ad.isSold ? (
              <div className="flex items-center justify-center rounded-2xl bg-gray-100 py-3 text-sm font-bold text-gray-500">
                Sold
              </div>
            ) : isOwner ? (
              <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 py-3 text-sm text-gray-500">
                This is your listing
              </div>
            ) : (
              <>
                <button
                  onClick={cta.open}
                  className="mb-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ffc105] py-3.5 text-sm font-black text-black transition hover:bg-amber-400"
                >
                  {cta.icon}
                  {cta.label}
                </button>

                {/* Escrow promise, where it applies */}
                {policy.showEscrowNote && (
                  <p className="mb-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-gray-400">
                    <ShieldCheck
                      size={12}
                      className="mt-0.5 flex-shrink-0 text-emerald-500"
                    />
                    {stay
                      ? "Your payment is held until you check in."
                      : "Your payment is held until you confirm delivery."}
                  </p>
                )}

                {/* Call back — only where the category allows contact at
                    all. Offering it on a listing whose vendor you can't
                    reach would be a second dead end. */}
                {(policy.showPhone ||
                  policy.showWhatsApp ||
                  policy.showChat) && (
                  <>
                    {!callRequest ? (
                      <button
                        onClick={() => setCallRequest(true)}
                        className="w-full rounded-2xl border-2 border-gray-200 py-3 text-sm font-bold text-gray-700 transition hover:border-[#ffc105] hover:text-[#ffc105]"
                      >
                        Request a call back
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500">
                          Leave your details and the seller will call you:
                        </p>
                        <input
                          type="text"
                          placeholder="Your name"
                          value={callName}
                          onChange={(e) => setCallName(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <input
                          type="tel"
                          placeholder="Your phone"
                          value={callPhone}
                          onChange={(e) => setCallPhone(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleCallbackSubmit}
                            disabled={callSending}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ffc105] py-2.5 text-sm font-bold text-black transition hover:bg-amber-400 disabled:opacity-60"
                          >
                            {callSending ? (
                              <>
                                <Loader2 size={13} className="animate-spin" />
                                Sending…
                              </>
                            ) : (
                              "Submit"
                            )}
                          </button>
                          <button
                            onClick={() => setCallRequest(false)}
                            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </Section>

          {/* Seller — all contact rules live in here */}
          <SellerContactPanel
            ad={ad as any}
            isOwner={isOwner}
            onContactClick={() => logContactClick(id)}
          />

          {/* Delivery tracker, for delivery listings only */}
          {mode === "delivery" && (
            <DeliveryTracker
              vendorName={vendorName}
              vendorPhone={ad.contact?.phone}
              city={ad.location?.city}
              region={ad.location?.region}
              address={ad.location?.address}
              coordinates={
                (ad.location as any)?.coordinates?.lat != null &&
                (ad.location as any)?.coordinates?.lng != null
                  ? {
                      lat: (ad.location as any).coordinates.lat,
                      lng: (ad.location as any).coordinates.lng,
                    }
                  : null
              }
            />
          )}

          {/* Stats */}
          <Section>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { icon: <Eye size={16} />, label: "Views", value: ad.views },
                {
                  icon: <Heart size={16} />,
                  label: "Saves",
                  value: (ad as any).saves,
                },
                {
                  icon: <Phone size={16} />,
                  label: "Contacts",
                  value: (ad as any).contactClicks,
                },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-gray-50 py-3">
                  <div className="mb-1 flex justify-center text-gray-400">
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

          {/* Owner */}
          {isOwner && (
            <Section title="Manage your ad">
              <div className="space-y-2">
                <Link
                  href={`/ads/${id}/edit`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
                >
                  <Pencil size={14} />
                  Edit ad
                </Link>
                <Link
                  href="/ads/my"
                  className="flex w-full items-center justify-center rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  My ads dashboard
                </Link>
              </div>
            </Section>
          )}

          {/* Safety — only for classifieds, where meeting in person is
              the norm. On an escrow-backed order it contradicts the
              buyer-protection promise two blocks up. */}
          {!policy.showEscrowNote && (
            <Section title="Safety tips">
              <ul className="space-y-2">
                {safetyTips.map((tip: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="mt-0.5 flex-shrink-0 font-bold text-[#ffc105]">
                      ✓
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </Section>
          )}
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
