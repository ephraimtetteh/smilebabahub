"use client";

// src/app/sell/page.tsx
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { useAds } from "@/src/hooks/useAds";
import { useViewCountry } from "@/src/hooks/useViewCountry";
import { useAppSelector } from "@/src/app/redux";
import { saveReturnState } from "@/src/hooks/useSubscriptionGuard";
import { AdFormData } from "@/src/types/adForm.types";
import {
  AdImage,
  AdCondition,
  Negotiable,
  DeliveryOption,
} from "@/src/types/ad.types";
import AdForm from "../ads/(components)/AdForm";

export default function SellPage() {
  const router = useRouter();
  const { isAuthenticated, hasCheckedAuth, user } = useAppSelector(
    (s) => s.auth,
  );
  const isVendor = isAuthenticated && user?.role === "vendor";
  const { submitCreateAd, mutating, mutateError } = useAds();
  const { country: viewCountry, currency: viewCurrency } = useViewCountry();

  useEffect(() => {
    if (mutateError) toast.error(mutateError);
  }, [mutateError]);

  // Auth + vendor guard
  useEffect(() => {
    if (!hasCheckedAuth) return;
    if (!isAuthenticated) {
      saveReturnState({ type: "post_product" });
      router.push("/auth/login?reason=sell");
    } else if (!isVendor) {
      saveReturnState({ type: "post_product" });
      toast.info("You need a vendor subscription to post ads.");
      router.push("/subscribe");
    }
  }, [hasCheckedAuth, isAuthenticated, isVendor, router]);

  if (!hasCheckedAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div
          className="w-10 h-10 border-2 border-yellow-400 border-t-transparent
          rounded-full animate-spin"
        />
      </div>
    );
  }

  if (!isVendor) return null;

  // onSubmit receives already-uploaded Cloudinary images + form data
  // Returns { adId } so AdForm can build the "View my ad" link in success screen
  const handleCreate = async (images: AdImage[], data: AdFormData) => {
    const result = await submitCreateAd({
      title: data.title,
      description: data.description,
      category: {
        main: data.category,
        sub: data.subcategory || undefined,
        leaf: data.type || undefined,
        path: [data.category, data.subcategory, data.type]
          .filter(Boolean)
          .join(" > "),
      },
      images, // ← already uploaded to Cloudinary by AdForm
      price: { amount: Number(data.price), currency: data.currency },
      negotiable: (data.negotiable || "not_sure") as Negotiable,
      condition: (data.condition || "not_applicable") as AdCondition,
      location: {
        country: (user?.country ?? viewCountry ?? "Ghana") as any,
        countryCode: ((user?.currency ?? viewCurrency) === "NGN"
          ? "NG"
          : "GH") as any,
        region: data.region,
        city: data.city || undefined,
        address: data.address || undefined,
      },
      contact: {
        name: data.name,
        phone: data.phone,
        whatsapp: data.whatsapp || null,
        showPhone: data.showPhone,
      },
      delivery: {
        available: data.delivery,
        option: (data.deliveryOption || "pickup_only") as DeliveryOption,
        fee: Number(data.deliveryFee) || 0,
        feeCurrency: data.currency,
        note: data.deliveryNote || null,
      },
      tags: data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      videoUrl: data.videoUrl || null,

      // Merge category-specific fields into attributes (EAV)
      // so delivery + pharmacy details are searchable and displayable
      attributes: [
        ...(data.attributes ?? []),

        // Delivery fields
        ...(data.category === "delivery"
          ? [
              data.deliveryServiceType && {
                key: "vehicle_type",
                value: data.deliveryServiceType,
                label: "Vehicle type",
              },
              data.deliveryCoverageArea && {
                key: "coverage_area",
                value: data.deliveryCoverageArea,
                label: "Coverage area",
              },
              data.deliveryWorkingHours && {
                key: "working_hours",
                value: data.deliveryWorkingHours,
                label: "Working hours",
              },
              data.deliveryMinOrder && {
                key: "min_order",
                value: data.deliveryMinOrder,
                label: "Min order",
              },
              {
                key: "has_tracking",
                value: data.deliveryHasTracking ? "yes" : "no",
                label: "Live tracking",
              },
            ].filter(Boolean)
          : []),

        // Pharmacy fields
        ...(data.category === "pharmacy"
          ? [
              data.pharmacyProductType && {
                key: "product_type",
                value: data.pharmacyProductType,
                label: "Product type",
              },
              data.pharmacyBrand && {
                key: "brand",
                value: data.pharmacyBrand,
                label: "Brand",
              },
              data.pharmacyDosage && {
                key: "dosage",
                value: data.pharmacyDosage,
                label: "Dosage",
              },
              data.pharmacyPackSize && {
                key: "pack_size",
                value: data.pharmacyPackSize,
                label: "Pack size",
              },
              data.pharmacyExpiryDate && {
                key: "expiry",
                value: data.pharmacyExpiryDate,
                label: "Expiry date",
              },
              data.pharmacyNafdacNo && {
                key: "nafdac_no",
                value: data.pharmacyNafdacNo,
                label: "NAFDAC / FDA",
              },
              data.pharmacyStorageInfo && {
                key: "storage",
                value: data.pharmacyStorageInfo,
                label: "Storage",
              },
              {
                key: "prescription_required",
                value: data.pharmacyPrescription ? "yes" : "no",
                label: "Prescription",
              },
            ].filter(Boolean)
          : []),
      ] as any[],
    });

    // Return the new ad's _id so AdForm can show "View my ad" button
    const ad = (result as any)?.payload;
    return { adId: ad?._id ?? ad?.id ?? "pending" };
  };

  const handleExit = () => {
    // Go back if history exists, otherwise go to my ads
    if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else {
      router.push("/ads/my");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div
        className="bg-white border-b border-gray-100 sticky top-14 z-30
        shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
      >
        <div
          className="max-w-xl mx-auto px-4 sm:px-6 py-3.5
          flex items-center gap-3"
        >
          <button
            onClick={handleExit}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center
              text-gray-600 hover:bg-gray-200 active:scale-95 transition-all
              flex-shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-gray-900 leading-tight">
              Post a new ad
            </h1>
            <p className="text-[11px] text-gray-400 leading-tight">
              Fill in the details below — takes about 2 minutes
            </p>
          </div>
        </div>
      </div>
      <AdForm
        onSubmit={handleCreate}
        onExit={handleExit}
        submitLabel="Post ad"
        loading={mutating}
        mode="create"
      />
    </div>
  );
}
