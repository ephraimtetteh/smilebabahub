// hooks/useSubscriptionGuard.ts
// Drop this into any component that needs vendor access.
// It checks role on the frontend first (fast), then handles 403s from the API.

"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useAppSelector } from "../app/redux";


const RETURN_URL_KEY = "smilebaba_return_url";
const RETURN_ACTION_KEY = "smilebaba_return_action";

export type PendingAction = {
  type: "post_product" | "boost_product" | "create_listing" | string;
  payload?: Record<string, unknown>;
};

// ── Pure helpers (no hooks — safe to call anywhere) ────────────────────────

/**
 * Saves the user's current path + pending action so we can resume after subscribe.
 */
export function saveReturnState(action?: PendingAction) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    RETURN_URL_KEY,
    window.location.pathname + window.location.search,
  );
  if (action) {
    sessionStorage.setItem(RETURN_ACTION_KEY, JSON.stringify(action));
  }
}

/**
 * Reads and clears the saved return state (call once after payment success).
 */
export function consumeReturnState(): {
  returnUrl: string | null;
  action: PendingAction | null;
} {
  if (typeof window === "undefined") return { returnUrl: null, action: null };

  const returnUrl = sessionStorage.getItem(RETURN_URL_KEY);
  const rawAction = sessionStorage.getItem(RETURN_ACTION_KEY);

  sessionStorage.removeItem(RETURN_URL_KEY);
  sessionStorage.removeItem(RETURN_ACTION_KEY);

  return {
    returnUrl,
    action: rawAction ? (JSON.parse(rawAction) as PendingAction) : null,
  };
}

// ── Main hook ─────────────────────────────────────────────────────────────

/**
 * Wraps any vendor-only action with a subscription gate.
 *
 * Usage:
 *   const { guard } = useSubscriptionGuard();
 *
 *   <Button onClick={() => guard({ type: "post_product" }, handlePost)}>
 *     Post Product
 *   </Button>
 */
export function useSubscriptionGuard() {
  const router = useRouter();

  // Read directly from Redux auth slice — no context needed
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const isVendor =
    isAuthenticated &&
    (user?.role === "vendor" ||
      user?.role === "admin" ||
      user?.isAdmin === true);

  const redirectToSubscribe = useCallback(
    (action?: PendingAction) => {
      saveReturnState(action);
      router.push("/subscription");
    },
    [router],
  );

  /**
   * Guard a vendor-only action.
   * - Vendor → runs `fn` immediately and returns its result
   * - Not authenticated → redirects to /login (preserving return state)
   * - Authenticated but not vendor → redirects to /subscribe
   */
  const guard = useCallback(
    <T>(action: PendingAction | null, fn: () => T | Promise<T>): T | void => {
      if (!isAuthenticated) {
        saveReturnState(action ?? undefined);
        router.push("/auth/login");
        return;
      }
      if (isVendor) {
        return fn() as T;
      }
      redirectToSubscribe(action ?? undefined);
    },
    [isAuthenticated, isVendor, redirectToSubscribe, router],
  );

  /**
   * Handle 403 SUBSCRIPTION_REQUIRED API responses inside catch blocks.
   * Returns true if the error was handled (so you know not to rethrow).
   *
   * Usage:
   *   catch (err) {
   *     if (!handleApiError(err, { type: "boost_product", payload: { id } })) throw err;
   *   }
   */
  const handleApiError = useCallback(
    (error: unknown, action?: PendingAction): boolean => {
      const err = error as { response?: { data?: { code?: string } } };
      if (err?.response?.data?.code === "SUBSCRIPTION_REQUIRED") {
        redirectToSubscribe(action);
        return true;
      }
      return false;
    },
    [redirectToSubscribe],
  );

  return {
    guard,
    handleApiError,
    isVendor,
    isAuthenticated,
    redirectToSubscribe,
  };
}
