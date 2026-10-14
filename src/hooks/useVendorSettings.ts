// src/hooks/useVendorSettings.ts
// Shared hook for all vendor settings tabs.
// Loads the current user from Redux and provides save helpers per section.

"use client";

import { useState, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/src/app/redux";
import { useViewCountry } from "@/src/hooks/useViewCountry";
import axiosInstance from "@/src/lib/api/axios";
import { setUser } from "@/src/lib/features/auth/authSlice";
import { toast } from "react-toastify";

export function useVendorSettings() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { country, currency, sym } = useViewCountry();
  const [saving, setSaving] = useState<string | null>(null);

  const save = useCallback(
    async (section: string, endpoint: string, data: object) => {
      setSaving(section);
      try {
        const res = await axiosInstance.patch(endpoint, data);
        // Update Redux if user object returned
        if (res.data.user) dispatch(setUser(res.data.user));
        toast.success(res.data.message ?? "Saved successfully");
        return true;
      } catch (err: any) {
        toast.error(err?.response?.data?.message ?? "Failed to save");
        return false;
      } finally {
        setSaving(null);
      }
    },
    [dispatch],
  );

  // Convenience wrappers per section
  const saveProfile = (data: object) => save("profile", "/auth/profile", data);
  const savePassword = (data: object) =>
    save("password", "/auth/password", data);
  const saveNotifications = (data: object) =>
    save("notifications", "/auth/notifications", data);
  const savePayments = (data: object) =>
    save("payments", "/auth/payment-details", data);
  const saveShipping = (data: object) =>
    save("shipping", "/auth/shipping", data);

  return {
    user,
    country,
    currency,
    sym,
    saving,
    saveProfile,
    savePassword,
    saveNotifications,
    savePayments,
    saveShipping,
  };
}
