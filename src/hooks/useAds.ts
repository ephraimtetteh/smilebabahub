// src/hooks/useAds.ts
// Convenience hook — wraps all ads Redux state and actions in one place.
// Import this in any component that needs to work with ads.

"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import {
  fetchAds,
  fetchAdById,
  fetchAdBySlug,
  fetchMyAds,
  createAd,
  updateAd,
  deleteAd,
  boostAd,
  markAsSold,
  togglePause,
  recordContactClick,
  moderateAd,
} from "@/src/lib/features/ads/adsActions";
import {
  setFilters,
  resetFilters,
  setPage,
  setMyAdsStatus,
  clearCurrent,
  clearMutateError,
  patchAd,
  removeAd,
} from "@/src/lib/features/ads/adsSlice";
import type {
  AdFilters,
  CreateAdPayload,
  UpdateAdPayload,
} from "@/src/types/ad.types";

export function useAds() {
  const dispatch = useAppDispatch();

  // ── Selectors ─────────────────────────────────────────────────────────
  const ads = useAppSelector((s) => s.ads.ads);
  const meta = useAppSelector((s) => s.ads.meta);
  const filters = useAppSelector((s) => s.ads.filters);
  const feedLoading = useAppSelector((s) => s.ads.feedLoading);
  const feedError = useAppSelector((s) => s.ads.feedError);

  const current = useAppSelector((s) => s.ads.current);
  const currentLoading = useAppSelector((s) => s.ads.currentLoading);
  const currentError = useAppSelector((s) => s.ads.currentError);

  const myAds = useAppSelector((s) => s.ads.myAds);
  const myAdsMeta = useAppSelector((s) => s.ads.myAdsMeta);
  const myAdsStats = useAppSelector((s) => s.ads.myAdsStats);
  const myAdsLoading = useAppSelector((s) => s.ads.myAdsLoading);
  const myAdsError = useAppSelector((s) => s.ads.myAdsError);
  const myAdsStatus = useAppSelector((s) => s.ads.myAdsStatus);

  const mutating = useAppSelector((s) => s.ads.mutating);
  const mutateError = useAppSelector((s) => s.ads.mutateError);
  const lastCreated = useAppSelector((s) => s.ads.lastCreated);

  // Also pull currency for price display
  const userCurrency = useAppSelector((s) => s.auth.user?.currency ?? "GHS");
  const userCountry = useAppSelector((s) => s.auth.user?.country);

  // Actions — each call takes EXPLICIT params, never auto-merges stale Redux filters
  const loadAds = useCallback(
    (f: Partial<AdFilters> = {}) => dispatch(fetchAds(f)),
    [dispatch],
  );

  const loadAdById = useCallback(
    (id: string) => dispatch(fetchAdById(id)),
    [dispatch],
  );

  const loadAdBySlug = useCallback(
    (slug: string) => dispatch(fetchAdBySlug(slug)),
    [dispatch],
  );

  const loadMyAds = useCallback(
    (params?: { status?: string; page?: number }) =>
      dispatch(fetchMyAds(params ?? {})),
    [dispatch],
  );

  const submitCreateAd = useCallback(
    (payload: CreateAdPayload) => dispatch(createAd(payload)),
    [dispatch],
  );

  const submitUpdateAd = useCallback(
    (id: string, payload: UpdateAdPayload) =>
      dispatch(updateAd({ id, payload })),
    [dispatch],
  );

  const submitDeleteAd = useCallback(
    (id: string) => dispatch(deleteAd(id)),
    [dispatch],
  );

  const submitBoostAd = useCallback(
    (id: string, tier?: "standard" | "featured" | "premium") =>
      dispatch(boostAd({ id, tier })),
    [dispatch],
  );

  const submitMarkSold = useCallback(
    (id: string) => dispatch(markAsSold(id)),
    [dispatch],
  );

  const submitTogglePause = useCallback(
    (id: string) => dispatch(togglePause(id)),
    [dispatch],
  );

  const submitModerate = useCallback(
    (
      id: string,
      status: "approved" | "rejected" | "flagged",
      rejectReason?: string,
    ) => dispatch(moderateAd({ id, status, rejectReason })),
    [dispatch],
  );

  const logContactClick = useCallback(
    (id: string) => dispatch(recordContactClick(id)),
    [dispatch],
  );

  // ── Filter helpers ────────────────────────────────────────────────────
  const applyFilters = useCallback(
    (f: Partial<AdFilters>) => dispatch(setFilters(f)),
    [dispatch],
  );

  const clearFilters = useCallback(() => dispatch(resetFilters()), [dispatch]);

  const goToPage = useCallback(
    (page: number) => dispatch(setPage(page)),
    [dispatch],
  );

  const changeMyAdsStatus = useCallback(
    (status: typeof myAdsStatus) => dispatch(setMyAdsStatus(status)),
    [dispatch],
  );

  const clearCurrentAd = useCallback(
    () => dispatch(clearCurrent()),
    [dispatch],
  );

  const clearError = useCallback(
    () => dispatch(clearMutateError()),
    [dispatch],
  );

  // ── Price display helper ───────────────────────────────────────────────
  const formatPrice = useCallback(
    (amount: number, currency?: string) => {
      const c = currency ?? userCurrency;
      const sym = c === "NGN" ? "₦" : "₵";
      return `${sym}${Number(amount).toLocaleString()}`;
    },
    [userCurrency],
  );

  return {
    // State
    ads,
    meta,
    filters,
    feedLoading,
    feedError,
    current,
    currentLoading,
    currentError,
    myAds,
    myAdsMeta,
    myAdsStats,
    myAdsLoading,
    myAdsError,
    myAdsStatus,
    mutating,
    mutateError,
    lastCreated,
    userCurrency,
    userCountry,

    // Actions
    loadAds,
    loadAdById,
    loadAdBySlug,
    loadMyAds,
    submitCreateAd,
    submitUpdateAd,
    submitDeleteAd,
    submitBoostAd,
    submitMarkSold,
    submitTogglePause,
    submitModerate,
    logContactClick,

    // Filter helpers
    applyFilters,
    clearFilters,
    goToPage,
    changeMyAdsStatus,
    clearCurrentAd,
    clearError,

    // Utils
    formatPrice,
  };
}
