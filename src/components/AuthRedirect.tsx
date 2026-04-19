"use client";
// src/components/AuthRedirect.tsx
// Mount this ONCE inside StoreProvider (e.g. in LayoutShell / AppInitializer).
// After login, authSlice.pendingRedirect is set to the role-based destination.
// This component reads it, navigates, then clears it.
//
// This pattern avoids importing router into the Redux thunk (which can't use
// Next.js hooks) while still giving clean role-based redirects.
//
// Usage in your LayoutShell / AppInitializer:
//   <AuthRedirect />

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { clearPendingRedirect } from "@/src/lib/features/auth/authSlice";

export default function AuthRedirect() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pending = useAppSelector(
    (s) => (s.auth as any).pendingRedirect as string | null,
  );

  useEffect(() => {
    if (!pending) return;
    // Navigate to the role-based destination
    router.push(pending);
    // Clear so it doesn't fire again on re-render
    dispatch(clearPendingRedirect());
  }, [pending, router, dispatch]);

  return null;
}
