"use client";

// src/app/vendor/products/page.tsx
// Shows ALL ads and products posted by the logged-in vendor.
// Replaces static Products data with real Redux/API data.

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { FaPlus, FaBoxOpen } from "react-icons/fa6";

import Button         from "@/src/components/Button";


import { useAds }        from "@/src/hooks/useAds";
import { useAppSelector } from "@/src/app/redux";
import { AdImage, AdCondition, Negotiable, DeliveryOption, BoostTier } from "@/src/types/ad.types";
import { AdFormData } from "@/src/types/adForm.types";
import VendorStatsStrip from "../(components)/VendorProductStatsStrip";
import VendorStatusTabs, { StatusTabId } from "../(components)/VendorStatusTabs";
import VendorProductCard from "../(components)/VendorProductCard";
import AdForm from "../../ads/(components)/AdForm";
import ProtectedRoute from "@/src/components/ProtectRoute";
import { VendorProductSkeletonGrid } from "../(components)/VendorProdouctSkeleton";

function ProductpageInner() {
  const [showAdd,   setShowAdd]   = useState(false);
  const [search,    setSearch]    = useState("");
  const [activeTab, setActiveTab] = useState<StatusTabId>("all");

  const {
    myAds, myAdsLoading, myAdsError, myAdsStats,
    loadMyAds, submitCreateAd,
    submitBoostAd, submitTogglePause,
    submitMarkSold, submitDeleteAd,
    mutating,
  } = useAds();

  useEffect(() => {
    loadMyAds({ status: activeTab === "all" ? undefined : activeTab });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const filtered = myAds.filter((ad) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      ad.title?.toLowerCase().includes(q) ||
      ad.category?.main?.toLowerCase().includes(q) ||
      ad.category?.sub?.toLowerCase().includes(q) ||
      ad.location?.city?.toLowerCase().includes(q)
    );
  });

  const user = useAppSelector((s) => s.auth.user);

  const handleDelete   = useCallback(async (id: string) => { await submitDeleteAd(id);   toast.success("Ad deleted");        }, [submitDeleteAd]);

  const handleCreate = async (images: AdImage[], data: AdFormData) => {
    const result = await submitCreateAd({
      title:       data.title,
      description: data.description,
      category: {
        main: data.category,
        sub:  data.subcategory || undefined,
        leaf: data.type        || undefined,
        path: [data.category, data.subcategory, data.type].filter(Boolean).join(" > "),
      },
      images,
      price:      { amount: Number(data.price), currency: data.currency },
      negotiable: (data.negotiable || "not_sure") as Negotiable,
      condition:  (data.condition  || "not_applicable") as AdCondition,
      location: {
        country:     (user?.country ?? "Ghana") as any,
        countryCode: (user?.currency === "NGN" ? "NG" : "GH") as any,
        region:      data.region,
        city:        data.city        || undefined,
        address:     data.address     || undefined,
      },
      contact: {
        name:      data.name,
        phone:     data.phone,
        whatsapp:  data.whatsapp  || null,
        showPhone: data.showPhone,
      },
      delivery: {
        available:   data.delivery,
        option:      (data.deliveryOption || "pickup_only") as DeliveryOption,
        fee:         Number(data.deliveryFee) || 0,
        feeCurrency: data.currency,
        note:        data.deliveryNote || null,
      },
      tags:       data.tags.split(",").map((t) => t.trim()).filter(Boolean),
      attributes: data.attributes,
      videoUrl:   data.videoUrl || null,
    });

    const ad = (result as any)?.payload;
    return { adId: ad?._id ?? "pending" };
  };
  const handlePause    = useCallback(async (id: string) => { await submitTogglePause(id); toast.success("Ad updated");          }, [submitTogglePause]);
  const handleMarkSold = useCallback(async (id: string) => { await submitMarkSold(id);   toast.success("Marked as sold ✅");   }, [submitMarkSold]);
  const handleBoost    = useCallback((id: string, tier: BoostTier) => { submitBoostAd(id, tier); }, [submitBoostAd]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col gap-6 py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            My Products &amp; Ads
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage all your listings
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
              🔍
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="pl-8 pr-4 py-2 border border-gray-200 rounded-xl text-sm
                text-gray-700 bg-white focus:outline-none focus:ring-2
                focus:ring-yellow-400 w-52"
            />
          </div>
          <Button
            text="Add Product"
            icon={<FaPlus />}
            className="flex items-center justify-center gap-2 text-white whitespace-nowrap"
            onClick={() => setShowAdd(true)}
          />
        </div>
      </div>

      {/* Stats */}
      <VendorStatsStrip
        stats={
          myAdsStats ?? {
            activeCount: 0,
            soldCount: 0,
            pausedCount: 0,
            totalViews: 0,
          }
        }
        loading={myAdsLoading && !myAdsStats}
      />

      {/* Status tabs */}
      <VendorStatusTabs active={activeTab} onChange={setActiveTab} />

      {/* Error */}
      {myAdsError && !myAdsLoading && (
        <div
          className="bg-red-50 border border-red-200 text-red-600 text-sm
          rounded-2xl p-4 text-center"
        >
          {myAdsError}
          <button
            onClick={() => loadMyAds({})}
            className="ml-3 underline font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {myAdsLoading && <VendorProductSkeletonGrid count={6} />}

      {/* Empty */}
      {!myAdsLoading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <FaBoxOpen className="text-5xl text-gray-200 mx-auto mb-4" />
          <p className="text-gray-700 font-semibold text-sm mb-1">
            {search
              ? `No results for "${search}"`
              : activeTab === "all"
                ? "No products yet"
                : `No ${activeTab} products`}
          </p>
          <p className="text-xs text-gray-400 mb-6">
            {search
              ? "Try a different keyword"
              : activeTab === "all"
                ? "Click Add Product to get started"
                : `You have no ${activeTab} listings right now`}
          </p>
          {!search && activeTab === "all" && (
            <Button
              text="Add Your First Product"
              icon={<FaPlus />}
              className="flex items-center justify-center gap-2 text-white mx-auto"
              onClick={() => setShowAdd(true)}
            />
          )}
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-sm text-yellow-600 hover:underline font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {!myAdsLoading && filtered.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              {search ? ` matching "${search}"` : ""}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((ad) => (
              <VendorProductCard
                key={ad._id}
                ad={ad}
                mutating={mutating}
                onBoost={(tier) => handleBoost(ad._id, tier)}
                onPause={() => handlePause(ad._id)}
                onMarkSold={() => handleMarkSold(ad._id)}
                onDelete={() => handleDelete(ad._id)}
              />
            ))}
          </div>
        </>
      )}

      {/* Bottom CTA */}
      {!myAdsLoading && (
        <div
          className="bg-gradient-to-r from-yellow-50 to-amber-50 border
          border-yellow-200 rounded-2xl p-5 text-center"
        >
          <p className="text-sm font-semibold text-gray-700 mb-1">
            Ready to sell more?
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Post a new listing and reach thousands of buyers.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => setShowAdd(true)}
              className="px-5 py-2.5 bg-[#ffc105] text-black font-bold
                rounded-xl text-sm hover:bg-amber-400 transition"
            >
              + Add via modal
            </button>
            <Link
              href="/sell"
              className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700
                font-medium rounded-xl text-sm hover:bg-gray-50 transition"
            >
              Post full ad form →
            </Link>
          </div>
        </div>
      )}

      {/* ── Add product modal ── */}
      {showAdd && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center
          justify-center p-0 sm:p-4"
        >
          <div
            className="bg-gray-50 w-full sm:max-w-xl sm:rounded-3xl
            max-h-[92vh] overflow-y-auto relative"
          >
            {/* Header */}
            <div
              className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4
              flex items-center justify-between z-10 sm:rounded-t-3xl"
            >
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Post a new ad
                </h2>
                <p className="text-xs text-gray-400">
                  Fill in the details below
                </p>
              </div>
              <button
                onClick={() => setShowAdd(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full
                  bg-gray-100 text-gray-500 hover:bg-gray-200 transition text-lg"
              >
                ✕
              </button>
            </div>

            {/* AdForm */}
            <AdForm
              mode="create"
              submitLabel="Post ad"
              loading={mutating}
              onSubmit={async (images, data) => {
                const result = await handleCreate(images, data);
                // Close modal and refresh grid on success
                if (result?.adId) {
                  setShowAdd(false);
                  loadMyAds({
                    status: activeTab === "all" ? undefined : activeTab,
                  });
                  toast.success("Ad posted successfully! 🎉");
                }
                return result;
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Productpage() {
  return (
    <ProtectedRoute requiredRole="vendor">
      <ProductpageInner />
    </ProtectedRoute>
  );
}