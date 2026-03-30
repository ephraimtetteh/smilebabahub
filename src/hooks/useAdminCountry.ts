// src/hooks/useAdminCountry.ts  (or src/components/admin/useAdminCountry.ts)
// Hook for admin users to switch their viewed country between Ghana and Nigeria.
// When country is switched:
//   1. PATCH /auth/admin/country tells the backend (for any server-side logic)
//   2. Redux adminViewCountry is updated → useAds/useProducts re-resolve country
//   3. All feeds re-fetch for the new country automatically

"use client";

import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import axiosInstance from "@/src/lib/api/axios";
import { toast } from "react-toastify";

// ── This action must be added to your authSlice (see authSlice.PATCH.md) ──
// If it doesn't exist yet, the catch block falls back to a page reload.
import { setAdminViewCountry } from "@/src/lib/features/auth/authSlice";

export type AdminCountry = "Ghana" | "Nigeria";

export function useAdminCountry() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((s) => s.auth.user);
  const isAdmin = useAppSelector(
    (s) => (s.auth as any).isAdmin ?? user?.isAdmin ?? false,
  );
  const viewCountry = useAppSelector(
    (s) => (s.auth as any).adminViewCountry ?? user?.country ?? "Ghana",
  ) as AdminCountry;

  const [switching, setSwitching] = useState(false);

  const switchCountry = useCallback(
    async (country: AdminCountry) => {
      if (!isAdmin || switching || country === viewCountry) return;
      setSwitching(true);
      try {
        // Tell backend (keeps server-side country-aware logic in sync)
        await axiosInstance.patch("/auth/admin/country", { country });

        // Update Redux — triggers re-render of all country-dependent selectors
        dispatch(setAdminViewCountry(country));

        toast.success(`Switched to ${country} view`, { autoClose: 1500 });
      } catch (err: any) {
        toast.error(err?.response?.data?.message ?? "Failed to switch country");
      } finally {
        setSwitching(false);
      }
    },
    [isAdmin, switching, viewCountry, dispatch],
  );

  return { isAdmin, viewCountry, switching, switchCountry };
}
