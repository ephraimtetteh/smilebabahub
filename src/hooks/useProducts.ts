// src/hooks/useProducts.ts
"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/src/app/redux";

// Thunks — real project path
import {
  fetchProducts,
  fetchFeaturedProducts,
  fetchProductById,
  fetchMyProducts,
  deleteProduct,
} from "@/src/lib/features/products/productsActions";

// Slice actions — real project path
import {
  setProductFilters,
  resetProductFilters,
  setProductPage,
  clearCurrentProduct,
  clearProductMutateError,
} from "@/src/lib/features/products/productsSlice";

import type { ProductFilters } from "@/src/types/product.types";

export function useProducts() {
  const dispatch = useAppDispatch();

  // ── State ─────────────────────────────────────────────────────────────────
  const products = useAppSelector((s) => s.products?.products ?? []);
  const meta = useAppSelector((s) => s.products?.meta ?? null);
  const filters = useAppSelector((s) => s.products?.filters ?? {});
  const feedLoading = useAppSelector((s) => s.products?.feedLoading ?? false);
  const feedError = useAppSelector((s) => s.products?.feedError ?? null);

  const featured = useAppSelector((s) => s.products?.featuredByCategory ?? {});
  const featuredLoading = useAppSelector(
    (s) => s.products?.featuredLoading ?? false,
  );

  const current = useAppSelector((s) => s.products?.current ?? null);
  const currentLoading = useAppSelector(
    (s) => s.products?.currentLoading ?? false,
  );
  const currentError = useAppSelector((s) => s.products?.currentError ?? null);

  const myProducts = useAppSelector((s) => s.products?.myProducts ?? []);
  const myMeta = useAppSelector((s) => s.products?.myMeta ?? null);
  const myLoading = useAppSelector((s) => s.products?.myLoading ?? false);
  const myError = useAppSelector((s) => s.products?.myError ?? null);

  const mutating = useAppSelector((s) => s.products?.mutating ?? false);
  const mutateError = useAppSelector((s) => s.products?.mutateError ?? null);

  // Country resolution priority:
  //   1. adminViewCountry — admin switched view (overrides everything)
  //   2. user.country     — logged-in user's detected country
  //   3. guestCountry     — guest IP detection
  //   4. "Ghana"          — safe fallback
  const userCountry = useAppSelector(
    (s) =>
      (s.auth as any)?.adminViewCountry ??
      s.auth?.user?.country ??
      (s.auth as any)?.guestCountry ??
      "Ghana",
  );
  const userCurrency = useAppSelector((s) => {
    const country =
      (s.auth as any)?.adminViewCountry ?? s.auth?.user?.country ?? "";
    return country.toLowerCase().includes("nigeria")
      ? "NGN"
      : (s.auth?.user?.currency ?? (s.auth as any)?.guestCurrency ?? "GHS");
  });

  // ── Actions ───────────────────────────────────────────────────────────────
  const loadProducts = useCallback(
    (f?: Partial<ProductFilters>) =>
      dispatch(fetchProducts({ country: userCountry, ...filters, ...f })),
    [dispatch, filters, userCountry],
  );

  const loadFeatured = useCallback(
    (country?: string, category = "all") =>
      dispatch(
        fetchFeaturedProducts({
          // Pass undefined if empty so thunk reads from Redux state directly
          country: country || undefined,
          category,
          limit: 7,
        }),
      ),
    [dispatch],
  );

  const loadProductById = useCallback(
    (id: string) => dispatch(fetchProductById(id)),
    [dispatch],
  );

  const loadMyProducts = useCallback(
    (params?: { page?: number; limit?: number }) =>
      dispatch(fetchMyProducts(params ?? {})),
    [dispatch],
  );

  const removeProduct = useCallback(
    (id: string) => dispatch(deleteProduct(id)),
    [dispatch],
  );

  // ── Filter helpers ────────────────────────────────────────────────────────
  const applyProductFilters = useCallback(
    (f: Partial<ProductFilters>) => dispatch(setProductFilters(f)),
    [dispatch],
  );
  const clearProductFilters = useCallback(
    () => dispatch(resetProductFilters()),
    [dispatch],
  );
  const goToProductPage = useCallback(
    (p: number) => dispatch(setProductPage(p)),
    [dispatch],
  );
  const clearProduct = useCallback(
    () => dispatch(clearCurrentProduct()),
    [dispatch],
  );
  const clearError = useCallback(
    () => dispatch(clearProductMutateError()),
    [dispatch],
  );

  const formatProductPrice = useCallback(
    (amount: number, currency?: string) => {
      const sym = (currency ?? userCurrency) === "NGN" ? "₦" : "₵";
      return `${sym}${Number(amount).toLocaleString()}`;
    },
    [userCurrency],
  );

  return {
    products,
    meta,
    filters,
    feedLoading,
    feedError,
    featured,
    featuredLoading,
    current,
    currentLoading,
    currentError,
    myProducts,
    myMeta,
    myLoading,
    myError,
    mutating,
    mutateError,
    userCurrency,
    userCountry,
    loadProducts,
    loadFeatured,
    loadProductById,
    loadMyProducts,
    removeProduct,
    applyProductFilters,
    clearProductFilters,
    goToProductPage,
    clearProduct,
    clearError,
    formatProductPrice,
  };
}
