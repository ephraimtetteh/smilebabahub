"use client";

// src/app/ads/[id]/edit/page.tsx
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAds } from "@/src/hooks/useAds";
import { useAppSelector } from "@/src/app/redux";
import { AdFormData } from "@/src/types/adForm.types";
import {
  AdCondition,
  Negotiable,
  DeliveryOption,
  AdCurrency,
} from "@/src/types/ad.types";
import AdForm from "../../(components)/AdForm";

// ── Map the Ad model shape back to AdFormData for pre-filling the form ──────
function adToFormData(
  ad: NonNullable<ReturnType<typeof useAds>["current"]>,
): Partial<AdFormData> {
  return {
    title: ad.title ?? "",
    description: ad.description ?? "",
    category: ad.category?.main ?? "",
    subcategory: ad.category?.sub ?? "",
    type: ad.category?.leaf ?? "",
    condition: (ad.condition !== "not_applicable" ? ad.condition : "") as
      | AdCondition
      | "",
    negotiable: (ad.negotiable ?? "") as Negotiable | "",
    tags: ad.tags?.join(", ") ?? "",
    videoUrl: ad.videoUrl ?? "",
    price: String(ad.price?.amount ?? ""),
    currency: (ad.price?.currency ?? "GHS") as AdCurrency,
    delivery: ad.delivery?.available ?? false,
    deliveryOption: (ad.delivery?.option ?? "") as DeliveryOption | "",
    deliveryFee: String(ad.delivery?.fee ?? ""),
    deliveryNote: ad.delivery?.note ?? "",
    region: ad.location?.region ?? "",
    city: ad.location?.city ?? "",
    address: ad.location?.address ?? "",
    name: ad.contact?.name ?? "",
    phone: ad.contact?.phone ?? "",
    whatsapp: ad.contact?.whatsapp ?? "",
    showPhone: ad.contact?.showPhone ?? true,
    attributes: ad.attributes ?? [],
  };
}

export default function EditAdPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  const {
    current: ad,
    currentLoading,
    currentError,
    loadAdById,
    submitUpdateAd,
    mutating,
  } = useAds();

  useEffect(() => {
    if (id) loadAdById(id);
  }, [id]);

  // ── Guard: only owner can edit ──────────────────────────────────────────
  const isOwner = Boolean(
    user && ad && String(ad.postedBy?._id) === String(user._id),
  );

  // ── Loading ──────────────────────────────────────────────────────────────
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

  // ── Error / not found ────────────────────────────────────────────────────
  if (currentError || !ad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-4xl mb-3">😕</p>
          <p className="text-gray-700 font-semibold">Ad not found</p>
          <Link
            href="/ads/my"
            className="mt-4 inline-block px-5 py-2.5 bg-yellow-400 text-black
              font-bold rounded-xl text-sm"
          >
            ← My ads
          </Link>
        </div>
      </div>
    );
  }

  // ── Not owner ────────────────────────────────────────────────────────────
  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-4xl mb-3">🔒</p>
          <p className="text-gray-700 font-semibold">
            Not authorised to edit this ad
          </p>
          <Link
            href={`/ads/${id}`}
            className="mt-4 inline-block px-5 py-2.5 bg-yellow-400 text-black
              font-bold rounded-xl text-sm"
          >
            View ad
          </Link>
        </div>
      </div>
    );
  }

  // ── Existing image URLs for preview in the photo step ───────────────────
  const existingImageUrls = ad.images?.map((img) => img.url) ?? [];

  const handleUpdate = async (_fd: FormData, data: AdFormData) => {
    const result = await submitUpdateAd(id, {
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
      negotiable: (data.negotiable || "not_sure") as Negotiable,
      condition: (data.condition || "not_applicable") as AdCondition,
      location: {
        country: (user?.country ?? "Ghana") as any,
        countryCode: (user?.currency === "NGN" ? "NG" : "GH") as any,
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
        option: (data.deliveryOption || "pickup_only") as DeliveryOption,
        fee: Number(data.deliveryFee) || 0,
        note: data.deliveryNote || null,
      },
      tags: data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      attributes: data.attributes,
    });

    if ((result as any)?.meta?.requestStatus === "fulfilled") {
      toast.success("Ad updated successfully");
      router.push(`/ads/${id}`);
    } else {
      toast.error("Failed to update ad");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Edit ad</h1>
            <p className="text-xs text-gray-400 truncate max-w-xs">
              {ad.title}
            </p>
          </div>
          <Link
            href={`/ads/${id}`}
            className="text-xs text-gray-500 hover:text-gray-700 transition"
          >
            ← Back to ad
          </Link>
        </div>
      </div>

      <AdForm
        initialValues={adToFormData(ad)}
        existingImageUrls={existingImageUrls}
        onSubmit={handleUpdate}
        submitLabel="Save changes"
        loading={mutating}
      />
    </div>
  );
}
