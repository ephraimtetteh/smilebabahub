"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../app/redux";
import { restoreSession } from "@/src/lib/features/auth/authActions";

// ── Spinner shown while session is being restored ─────────────────────────
function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-8 h-8 border-2 border-yellow-400 border-t-transparent
          rounded-full animate-spin"
        />
        <p className="text-xs text-gray-400">Loading…</p>
      </div>
    </div>
  );
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: "vendor" | "admin"; // optional — omit to allow any logged-in user
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user, isAuthenticated, hasCheckedAuth } = useAppSelector(
    (state) => state.auth,
  );

  // Self-heal flag: when we detect a role mismatch, attempt ONE silent session
  // refresh before bouncing. This handles the post-subscription race where the
  // backend has set role:"vendor" but our Redux store still has the stale role
  // from before the subscription was activated.
  const [revalidating, setRevalidating] = useState(false);
  const [didRevalidate, setDidRevalidate] = useState(false);

  useEffect(() => {
    // ── Wait until restoreSession has finished ──────────────────────────
    // hasCheckedAuth stays false until the refresh + /auth/me cycle completes.
    // On Render this can take 1–2 seconds on a cold start — never redirect
    // before this flag is true or you'll boot logged-in users to /login.
    if (!hasCheckedAuth) return;

    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    // Role gate. If role looks wrong, try refreshing the session ONCE
    // before bouncing. Otherwise users get sent right back to /subscription
    // immediately after subscribing.
    if (requiredRole && user?.role !== requiredRole) {
      if (!didRevalidate) {
        setRevalidating(true);
        dispatch(restoreSession())
          .unwrap()
          .catch(() => {
            /* fall through to bounce below on next render */
          })
          .finally(() => {
            setDidRevalidate(true);
            setRevalidating(false);
          });
        return;
      }
      // We already refreshed; user is genuinely not the required role.
      router.push(requiredRole === "vendor" ? "/subscription" : "/auth/login");
    }
  }, [
    hasCheckedAuth,
    isAuthenticated,
    user,
    requiredRole,
    didRevalidate,
    router,
    dispatch,
  ]);

  // Show spinner while auth state is determined OR while we're re-validating
  if (!hasCheckedAuth || revalidating) return <FullPageSpinner />;

  // Render nothing during the redirect tick
  if (!isAuthenticated) return null;
  if (requiredRole && user?.role !== requiredRole && didRevalidate) return null;

  return <>{children}</>;
}
