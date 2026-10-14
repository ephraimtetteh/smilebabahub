// src/hooks/useAds.ts
"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { useViewCountry } from "./useViewCountry";

// Thunks — real project path
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
} from "@/src/lib/features/ads/adsActions";

// Slice actions — real project path
import {
  setFilters,
  resetFilters,
  setPage,
  setMyAdsStatus,
  clearCurrent,
  clearMutateError,
} from "@/src/lib/features/ads/adsSlice";

import type {
  AdFilters,
  CreateAdPayload,
  UpdateAdPayload,
} from "@/src/types/ad.types";

export function useAds() {
  const dispatch = useAppDispatch();
  const { country: userCountry, currency: userCurrency } = useViewCountry();

  // ── State ─────────────────────────────────────────────────────────────────
  const ads = useAppSelector((s) => s.ads?.ads ?? []);
  const meta = useAppSelector((s) => s.ads?.meta ?? null);
  const filters = useAppSelector((s) => s.ads?.filters ?? {});
  const feedLoading = useAppSelector((s) => s.ads?.feedLoading ?? false);
  const feedError = useAppSelector((s) => s.ads?.feedError ?? null);

  const current = useAppSelector((s) => s.ads?.current ?? null);
  const currentLoading = useAppSelector((s) => s.ads?.currentLoading ?? false);
  const currentError = useAppSelector((s) => s.ads?.currentError ?? null);

  const myAds = useAppSelector((s) => s.ads?.myAds ?? []);
  const myAdsMeta = useAppSelector((s) => s.ads?.myAdsMeta ?? null);
  const myAdsStats = useAppSelector((s) => s.ads?.myAdsStats ?? null);
  const myAdsLoading = useAppSelector((s) => s.ads?.myAdsLoading ?? false);
  const myAdsError = useAppSelector((s) => s.ads?.myAdsError ?? null);
  const myAdsStatus = useAppSelector((s) => s.ads?.myAdsStatus ?? "all");

  const mutating = useAppSelector((s) => s.ads?.mutating ?? false);
  const mutateError = useAppSelector((s) => s.ads?.mutateError ?? null);
  const lastCreated = useAppSelector((s) => s.ads?.lastCreated ?? null);

  // ── Actions ───────────────────────────────────────────────────────────────
  const loadAds = useCallback(
    (f: Partial<AdFilters> = {}) =>
      // Pass country as undefined if empty — thunk reads from Redux state
      dispatch(
        fetchAds({
          country: f.country || userCountry || undefined,
          ...f,
        } as AdFilters),
      ),
    [dispatch, userCountry],
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
    (params?: { status?: string; page?: number; limit?: number }) =>
      dispatch(fetchMyAds(params ?? {})),
    [dispatch],
  );

  const submitCreateAd = useCallback(
    (p: CreateAdPayload) => dispatch(createAd(p)),
    [dispatch],
  );
  const submitUpdateAd = useCallback(
    (id: string, p: UpdateAdPayload) => dispatch(updateAd({ id, payload: p })),
    [dispatch],
  );
  const submitDeleteAd = useCallback(
    (id: string) => dispatch(deleteAd(id)),
    [dispatch],
  );
  const submitBoostAd = useCallback(
    (id: string, tier?: string) => dispatch(boostAd({ id, tier })),
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
  const logContactClick = useCallback(
    (id: string) => dispatch(recordContactClick(id)),
    [dispatch],
  );

  // ── Filter helpers ────────────────────────────────────────────────────────
  const applyFilters = useCallback(
    (f: Partial<AdFilters>) => dispatch(setFilters(f)),
    [dispatch],
  );
  const clearFilters = useCallback(() => dispatch(resetFilters()), [dispatch]);
  const goToPage = useCallback((p: number) => dispatch(setPage(p)), [dispatch]);
  const changeMyAdsStatus = useCallback(
    (s: any) => dispatch(setMyAdsStatus(s)),
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

  const formatPrice = useCallback(
    (amount: number, currency?: string) => {
      const sym = (currency ?? userCurrency) === "NGN" ? "₦" : "₵";
      return `${sym}${Number(amount).toLocaleString()}`;
    },
    [userCurrency],
  );

  return {
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
    logContactClick,
    applyFilters,
    clearFilters,
    goToPage,
    changeMyAdsStatus,
    clearCurrentAd,
    clearError,
    formatPrice,
  };
}
