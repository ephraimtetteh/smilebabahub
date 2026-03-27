"use client";

// src/app/sell/page.tsx
// Replaces the old ProductUpload page.
// Uses AdForm (the shared create/edit form) wired to the ads backend.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAds } from "@/src/hooks/useAds";
import { useAppSelector } from "@/src/app/redux";
import { saveReturnState } from "@/src/hooks/useSubscriptionGuard";
import { AdFormData } from "@/src/types/adForm.types";
import { AdCondition, Negotiable, DeliveryOption } from "@/src/types/ad.types";
import axiosInstance from "@/src/lib/api/axios";
import AdForm from "../ads/(components)/AdForm";

export default function SellPage() {
  const router = useRouter();
  const { isAuthenticated, hasCheckedAuth, user } = useAppSelector(
    (s) => s.auth,
  );
  const isVendor = isAuthenticated && user?.role === "vendor";

  const { lastCreated } = useAds();

  // Redirect to the new ad after creation
  useEffect(() => {
    if (lastCreated) {
      toast.success("Ad posted successfully! 🎉");
      router.push(`/ads/${lastCreated._id}`);
    }
  }, [lastCreated, router]);

  // Guard: not logged in → save state and redirect to login
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

  if (!isVendor) return null; // redirect in progress

  const handleCreate = async (fd: FormData, data: AdFormData) => {
    try {
      // The AdForm builds the FormData payload — send it directly
      // axiosInstance handles auth headers
      await axiosInstance.post("/ads", {
        title: data.title,
        description: data.description,
        category: {
          main: data.category,
          sub: data.subcategory,
          leaf: data.type,
          path: [data.category, data.subcategory, data.type]
            .filter(Boolean)
            .join(" > "),
        },
        price: { amount: Number(data.price), currency: data.currency },
        negotiable: data.negotiable || "not_sure",
        condition: data.condition || "not_applicable",
        location: {
          country: user?.country ?? "Ghana",
          countryCode: user?.currency === "NGN" ? "NG" : "GH",
          region: data.region,
          city: data.city,
          address: data.address,
        },
        contact: {
          name: data.name,
          phone: data.phone,
          whatsapp: data.whatsapp || null,
          showPhone: data.showPhone,
        },
        delivery: {
          available: data.delivery,
          option: data.deliveryOption || "pickup_only",
          fee: Number(data.deliveryFee) || 0,
          note: data.deliveryNote || null,
        },
        tags: data.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        attributes: data.attributes,
        // Note: images are handled via Cloudinary upload separately
        // (AdForm shows previews; real upload happens here or in the controller)
      });

      localStorage.removeItem("adFormDraft");
    } catch (error: any) {
      if (error?.response?.data?.code === "SUBSCRIPTION_REQUIRED") {
        toast.info("A vendor subscription is required to post ads.");
        saveReturnState({ type: "post_product" });
        router.push("/subscribe");
      } else {
        toast.error("Failed to post ad. Please try again.");
      }
      throw error;
    }
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

      <AdForm onSubmit={handleCreate} submitLabel="Post ad" />
    </div>
  );
}
