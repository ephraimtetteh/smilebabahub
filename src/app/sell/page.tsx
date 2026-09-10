"use client";

// client/src/app/sell/page.tsx
//
// ─── THE SPINNER BUG ─────────────────────────────────────────────────
//
// I had both a `ran` ref and a `cancelled` flag. In React 18 StrictMode
// the effect mounts, cleans up, and remounts:
//
//   run 1  fires the request, cleanup sets cancelled = true
//   run 2  sees ran.current === true and returns early
//   run 1's response arrives → cancelled → ignored
//
// So the only request that fires is the one whose result is discarded,
// and the gate never leaves "checking". A permanent spinner.
//
// The ref was there to stop a refresh storm, but the storm came from the
// axios interceptor storing "undefined" as a token — fixed at source.
// One guard is enough here, and `cancelled` is the correct one, because
// it protects against setting state after unmount rather than against
// running twice.
//
// ─── AND WHY IT ASKS THE SERVER ──────────────────────────────────────
//
// The old guard read isVendor from Redux, bounced to /onboarding, which
// saw status complete and bounced back. One call answers it without a
// stale flag in the loop:
//
//     401                  → sign in
//     needsOnboarding true → onboard
//     otherwise            → show the form

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { useAds } from "@/src/hooks/useAds";
import { useViewCountry } from "@/src/hooks/useViewCountry";
import { useAppSelector } from "@/src/app/redux";
import axiosInstance from "@/src/lib/api/axios";
import { AdFormData } from "@/src/types/adForm.types";
import {
  AdImage,
  AdCondition,
  Negotiable,
  DeliveryOption,
} from "@/src/types/ad.types";
import AdForm from "../ads/(components)/AdForm";

type Gate = "checking" | "allowed";

export default function SellPage() {
  const router = useRouter();
  const params = useSearchParams();

  const { user } = useAppSelector((s) => s.auth);
  const { submitCreateAd, mutating, mutateError } = useAds();
  const { country: viewCountry, currency: viewCurrency } = useViewCountry();

  const [gate, setGate] = useState<Gate>("checking");

  /** Set by the Post Ad menu, so the form opens on the right category. */
  const presetCategory = params.get("category") ?? undefined;

  useEffect(() => {
    if (mutateError) toast.error(mutateError);
  }, [mutateError]);

  // ─── The gate ─────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const here = `/sell${window.location.search}`;

    axiosInstance
      .get("/onboarding/me")
      .then(({ data }) => {
        if (cancelled) return;

        if (data?.needsOnboarding) {
          localStorage.setItem("redirectAfterOnboarding", here);
          router.replace("/onboarding");
          return;
        }

        setGate("allowed");
      })
      .catch((err: any) => {
        if (cancelled) return;

        const status = err?.response?.status;

        if (status === 401 || status === 403) {
          localStorage.setItem("redirectAfterLogin", here);
          router.replace(
            `/auth/login?reason=sell&returnUrl=${encodeURIComponent(here)}`,
          );
          return;
        }

        // 404 means the route isn't deployed yet. A network error means
        // the backend is down. Neither is a permissions problem, and
        // neither should stop someone posting — createAd validates on
        // submit and returns a clear error if they genuinely can't.
        if (status === 404) {
          console.warn(
            "[sell] /onboarding/me returned 404 — is the route mounted?",
          );
        }
        setGate("allowed");
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  // ─── Submit ───────────────────────────────────────────────────────
  const handleCreate = useCallback(
    async (images: AdImage[], data: AdFormData) => {
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
        images,
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

        // Category-specific fields folded into attributes (EAV) so they're
        // searchable and displayable
        attributes: [
          ...(data.attributes ?? []),

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

      const ad = (result as any)?.payload;
      return { adId: ad?._id ?? ad?.id ?? "pending" };
    },
    [submitCreateAd, user, viewCountry, viewCurrency],
  );

  const handleExit = () => {
    if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else {
      router.push("/ads/my");
    }
  };

  if (gate === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 size={32} className="mx-auto animate-spin text-amber-400" />
          <p className="mt-3 text-xs text-gray-500">Checking your store…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-14 z-30 border-b border-gray-100 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
        <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-3.5 sm:px-6">
          <button
            onClick={handleExit}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-all hover:bg-gray-200 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-base font-bold leading-tight text-gray-900">
              Post a new ad
            </h1>
            <p className="text-[11px] leading-tight text-gray-400">
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
        initialValues={
          presetCategory ? { category: presetCategory } : undefined
        }
      />
    </div>
  );
}
