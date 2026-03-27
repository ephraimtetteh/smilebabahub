"use client";

// src/app/sell/page.tsx
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAds } from "@/src/hooks/useAds";
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
        country: (user?.country ?? "Ghana") as any,
        countryCode: (user?.currency === "NGN" ? "NG" : "GH") as any,
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
      attributes: data.attributes,
      videoUrl: data.videoUrl || null,
    });

    // Return the new ad's _id so AdForm can show "View my ad" button
    const ad = (result as any)?.payload;
    return { adId: ad?._id ?? ad?.id ?? "pending" };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4">
        <div className="max-w-xl mx-auto">
          <h1 className="text-lg font-bold text-gray-900">Post a new ad</h1>
          <p className="text-xs text-gray-400">
            Your ad will be reviewed before going live
          </p>
        </div>
      </div>
      <AdForm
        onSubmit={handleCreate}
        submitLabel="Post ad"
        loading={mutating}
        mode="create"
      />
    </div>
  );
}
