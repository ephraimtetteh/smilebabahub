// hooks/useResumeAction.ts
// Place this on the /subscribe page and /payment-success page.
// After successful payment, it reads the saved state and resumes.

"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { consumeReturnState, PendingAction } from "./useSubscriptionGuard";
import { restoreSession } from "../lib/features/auth/authActions";
import { useAppDispatch } from "../app/redux";

type Options = {
  /**
   * Called with the pending action if one was saved.
   * Use this to re-trigger the original API call after payment.
   *
   * Example:
   *   onResume: (action) => {
   *     if (action.type === "boost_product") boostProduct(action.payload?.productId)
   *   }
   */
  onResume?: (action: PendingAction) => void;
  /**
   * Called when no pending action exists — you just need to navigate somewhere.
   * Defaults to router.replace(returnUrl) if omitted.
   */
  onNavigate?: (url: string) => void;
};

/**
 * Detects ?subscribed=1 in the URL (appended by verifyPayment redirect),
 * refreshes the Redux auth state so the new `vendor` role is reflected
 * immediately, then resumes the user's original action or navigates them back.
 *
 * Usage on /payment-success page:
 *   useResumeAction({
 *     onResume: (action) => {
 *       if (action.type === "boost_product") boostProduct(action.payload?.productId as string);
 *       if (action.type === "post_product")  router.push("/vendor/products/new");
 *     },
 *   });
 */
export function useResumeAction({ onResume, onNavigate }: Options = {}) {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const hasRun = useRef(false);

  useEffect(() => {
    // Run only once even in React StrictMode double-invoke
    if (hasRun.current) return;
    hasRun.current = true;

    const justSubscribed = params.get("subscribed") === "1";
    if (!justSubscribed) return;

    async function resume() {
      // Re-run restoreSession so Redux picks up the new `vendor` role
      // that the backend just set on the user document.
      await dispatch(restoreSession());

      const { returnUrl, action } = consumeReturnState();

      if (action && onResume) {
        // Let the caller re-trigger the original action (boost, post, etc.)
        onResume(action);
      } else if (returnUrl) {
        const clean = returnUrl
          .replace(/([?&])subscribed=1(&|$)/, "$1")
          .replace(/[?&]$/, "");
        if (onNavigate) {
          onNavigate(clean);
        } else {
          router.replace(clean);
        }
      } else {
        router.replace("/vendor");
      }
    }

    resume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — we only want this to run once on mount
}
