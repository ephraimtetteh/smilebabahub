// Example: How to use useSubscriptionGuard on any vendor-only action
// This replaces any existing boost/post buttons throughout the app

"use client";

import { useSubscriptionGuard } from "@/src/hooks/useSubscriptionGuard";
import axiosInstance from "@/src/lib/api/axios";

// ── Example 1: Post Product button ────────────────────────────────────────
// Drop anywhere you have "Post Product" / "Add Listing"
export function PostProductButton() {
  const { guard } = useSubscriptionGuard();

  const handlePost = () => {
    // This only runs if user is already a vendor
    // Otherwise guard() saves state and redirects to /subscribe
    window.location.href = "/vendor/products/new";
  };

  return (
    <button
      onClick={() => guard({ type: "post_product" }, handlePost)}
      className="px-4 py-2 bg-[#ffc105] text-black font-bold rounded-xl hover:bg-amber-400 transition"
    >
      Post Product
    </button>
  );
}

// ── Example 2: Boost Product button ───────────────────────────────────────
// Drop on the product card (already in VendorSubscription)
export function BoostButton({ productId }: { productId: string }) {
  const { guard, handleApiError } = useSubscriptionGuard();

  const handleBoost = async () => {
    try {
      await axiosInstance.post(`/listings/${productId}/boost`);
      alert("Product boosted! 🚀");
    } catch (err) {
      // If the backend says SUBSCRIPTION_REQUIRED, redirect to subscribe
      if (
        !handleApiError(err, { type: "boost_product", payload: { productId } })
      ) {
        console.error("Boost failed:", err);
      }
    }
  };

  return (
    <button
      onClick={() =>
        guard({ type: "boost_product", payload: { productId } }, handleBoost)
      }
      className="px-4 py-2 bg-[#ffc105] text-black font-bold rounded-xl text-sm w-full"
    >
      Boost
    </button>
  );
}

// ── Example 3: Using on payment-success / any page that needs to resume ───
// Add this to your /payment-success page component:
//
// import { useResumeAction } from "@/src/hooks/useResumeAction";
//
// export default function PaymentSuccessPage() {
//   useResumeAction({
//     onResume: (action) => {
//       if (action.type === "boost_product") {
//         boostProduct(action.payload?.productId as string);
//       }
//       if (action.type === "post_product") {
//         router.push("/vendor/products/new");
//       }
//     },
//   });
//
//   return <div>Payment successful! Resuming your action…</div>;
// }

// ── Example 4: Guard a whole page with Next.js middleware ─────────────────
// In middleware.ts (root of project):
//
// import { NextRequest, NextResponse } from "next/server";
//
// const VENDOR_PATHS = ["/vendor/products/new", "/vendor/boost"];
//
// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//   const isVendorPath = VENDOR_PATHS.some((p) => pathname.startsWith(p));
//
//   if (isVendorPath) {
//     const role = req.cookies.get("user_role")?.value;
//     if (role !== "vendor") {
//       const url = req.nextUrl.clone();
//       url.pathname = "/subscribe";
//       // returnUrl encoded in cookie or query param
//       url.searchParams.set("from", pathname);
//       return NextResponse.redirect(url);
//     }
//   }
//   return NextResponse.next();
// }
