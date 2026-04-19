"use client";
// src/components/AuthRedirect.tsx
// Handles role-based redirect after login.
// Mount ONCE in AppInitializer (inside StoreProvider).

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { clearPendingRedirect } from "@/src/lib/features/auth/authSlice";

export default function AuthRedirect() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pending = useAppSelector(
    (s) => (s.auth as any).pendingRedirect as string | null,
  );
  const firedRef = useRef(false);

  useEffect(() => {
    if (!pending || firedRef.current) return;
    firedRef.current = true;

    // Clear first so subsequent renders don't re-fire
    dispatch(clearPendingRedirect());

    // replace() so the user can't press Back to the login page
    router.replace(pending);
  }, [pending, router, dispatch]);

  // Reset guard when pending clears (next login cycle)
  useEffect(() => {
    if (!pending) firedRef.current = false;
  }, [pending]);

  return null;
}
