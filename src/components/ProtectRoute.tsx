"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../app/redux";

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

  const { user, isAuthenticated, hasCheckedAuth } = useAppSelector(
    (state) => state.auth,
  );

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

    // Optional role gate — e.g. requiredRole="vendor" blocks guests
    if (requiredRole && user?.role !== requiredRole) {
      router.push(requiredRole === "vendor" ? "/subscribe" : "/auth/login");
    }
  }, [hasCheckedAuth, isAuthenticated, user, requiredRole, router]);

  // ── Show spinner while auth state is still being determined ────────────
  if (!hasCheckedAuth) return <FullPageSpinner />;

  // ── Render nothing during the redirect tick ────────────────────────────
  if (!isAuthenticated) return null;
  if (requiredRole && user?.role !== requiredRole) return null;

  return <>{children}</>;
}
