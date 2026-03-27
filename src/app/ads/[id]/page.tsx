"use client";

// app/ads/[id]/page.tsx — thin orchestrator
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAds } from "@/src/hooks/useAds";
import { useSubscriptionGuard } from "@/src/hooks/useSubscriptionGuard";
import { useAppSelector } from "@/src/app/redux";
import { BoostTier } from "@/src/types/ad.types";
import { BOOST_BADGE, formatAdPrice } from "../(components)/ad.constants";
import ImageGallery from "../(components)/ImageGallery";
import AdAttributes from "../(components)/AdAttributes";
import AdOwnerActions from "../(components)/AdOwnerActions";
import RelatedAds from "../(components)/RelatedAds";
import { BoostModal, DeleteConfirmModal } from "../(components)/AdModals";
import ContactCard from "../(components)/ContactCard";


export default function AdDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const {
    current: ad,
    currentLoading,
    currentError,
    loadAdById,
    loadAds,
    ads,
    submitBoostAd,
    submitMarkSold,
    submitTogglePause,
    submitDeleteAd,
    logContactClick,
    mutating,
  } = useAds();

  const { guard } = useSubscriptionGuard();
  const user = useAppSelector((s) => s.auth.user);
  const isOwner = Boolean(
    user && ad && String(ad.postedBy?._id) === String(user._id),
  );
  const isVendor = user?.role === "vendor";

  const [boostModal, setBoostModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) loadAdById(id);
  }, [id]);

  useEffect(() => {
    if (ad?.category?.main) loadAds({ category: ad.category.main, limit: 8 });
  }, [ad?.category?.main]);

  const handleBoost = (tier: BoostTier) => {
    guard({ type: "boost_product", payload: { adId: id } }, async () => {
      await submitBoostAd(id, tier);
      setBoostModal(false);
    });
  };

  const handleDelete = async () => {
    await submitDeleteAd(id);
    router.push("/ads");
  };

  // ── Loading ──
  if (currentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div
          className="w-10 h-10 border-2 border-yellow-400 border-t-transparent
          rounded-full animate-spin"
        />
      </div>
    );
  }

  // ── Error / not found ──
  if (currentError || !ad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-4xl mb-3">😕</p>
          <p className="text-gray-700 font-semibold">Ad not found</p>
          <p className="text-sm text-gray-400 mt-1 mb-5">{currentError}</p>
          <Link
            href="/ads"
            className="px-5 py-2.5 bg-yellow-400 text-black font-bold rounded-xl text-sm"
          >
            Browse other ads →
          </Link>
        </div>
      </div>
    );
  }

  const sym = ad.price?.currency === "NGN" ? "₦" : "₵";
  const boostBadge = ad.boost?.isBoosted
    ? BOOST_BADGE[ad.boost.boostTier]
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
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
          {ad.category?.sub && (
            <>
              <span>›</span>
              <span className="text-gray-600 capitalize">
                {ad.category.sub}
              </span>
            </>
          )}
        </nav>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* ── LEFT ── */}
          <div className="space-y-5">
            {/* Gallery */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <ImageGallery images={ad.images} title={ad.title} />
            </div>

            {/* Title + price */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                  {ad.title}
                </h1>
                {boostBadge && (
                  <span
                    className={`flex-shrink-0 text-[11px] font-bold px-2.5 py-1
                    rounded-full border ${boostBadge.cls}`}
                  >
                    {boostBadge.label}
                  </span>
                )}
              </div>

              <p className="text-3xl font-black text-gray-900 mb-1">
                {formatAdPrice(
                  ad.price?.amount,
                  ad.price?.currency,
                  ad.price?.display,
                )}
                <span className="text-sm font-normal text-gray-400 ml-2">
                  {ad.price?.currency}
                </span>
              </p>
              {ad.negotiable === "yes" && (
                <span className="text-sm text-green-600 font-medium">
                  ✓ Price is negotiable
                </span>
              )}

              {/* Chips */}
              <div className="flex flex-wrap gap-2 mt-4">
                {ad.delivery?.available && (
                  <span
                    className="text-xs bg-blue-50 text-blue-700 border border-blue-100
                    px-3 py-1 rounded-full font-medium"
                  >
                    🚚 Delivery available
                    {ad.delivery.fee > 0
                      ? ` · ${sym}${ad.delivery.fee}`
                      : " · Free"}
                  </span>
                )}
                {ad.isSold && (
                  <span className="text-xs bg-red-100 text-red-600 font-bold px-3 py-1 rounded-full">
                    SOLD
                  </span>
                )}
                {ad.daysLeft !== null && ad.daysLeft! <= 3 && !ad.isSold && (
                  <span className="text-xs bg-orange-100 text-orange-600 font-bold px-3 py-1 rounded-full">
                    ⏰ Expires in {ad.daysLeft} day
                    {ad.daysLeft !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {ad.description && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {ad.description}
                </p>
              </div>
            )}

            {/* Attributes */}
            <AdAttributes ad={ad} />

            {/* Tags */}
            {ad.tags && ad.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {ad.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/ads?search=${tag}`}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600
                      px-3 py-1 rounded-full transition"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT ── */}
          <div className="space-y-4">
            <ContactCard
              ad={ad}
              onReveal={() => logContactClick(id)}
              onWhatsApp={() => logContactClick(id)}
            />

            {/* Location */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 mb-3">Location</h2>
              <div className="flex items-start gap-2">
                <span className="text-lg">📍</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {[
                      ad.location?.city,
                      ad.location?.region,
                      ad.location?.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {ad.location?.address && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {ad.location.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: "👁️", label: "Views", value: ad.views },
                  { icon: "❤️", label: "Saves", value: ad.saves },
                  { icon: "📞", label: "Contacts", value: ad.contactClicks },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-lg font-black text-gray-900">
                      {s.value ?? 0}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {s.icon} {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner actions */}
            {isOwner && (
              <AdOwnerActions
                ad={ad}
                mutating={mutating}
                onBoostOpen={() => setBoostModal(true)}
                onTogglePause={() => submitTogglePause(id)}
                onMarkSold={() => submitMarkSold(id)}
                onDeleteOpen={() => setDeleteConfirm(true)}
              />
            )}

            {/* Non-owner vendor nudge */}
            {!isOwner && isVendor && !ad.boost?.isBoosted && (
              <div
                className="bg-gradient-to-r from-yellow-50 to-amber-50 border
                border-yellow-200 rounded-2xl p-4 text-center"
              >
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Are you a vendor?
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Boost your own ads to appear at the top of results.
                </p>
                <Link
                  href="/ads/my"
                  className="text-xs font-bold text-yellow-700 hover:underline"
                >
                  Manage my ads →
                </Link>
              </div>
            )}
          </div>
        </div>

        <RelatedAds ads={ads} currentId={id} />
      </div>

      {boostModal && (
        <BoostModal
          adId={ad._id}
          mutating={mutating}
          onBoost={handleBoost}
          onClose={() => setBoostModal(false)}
        />
      )}

      {deleteConfirm && (
        <DeleteConfirmModal
          mutating={mutating}
          onConfirm={handleDelete}
          onClose={() => setDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
