// src/hooks/useProducts.ts
"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import {
  fetchProducts,
  fetchFeaturedProducts,
  fetchProductById,
  fetchMyProducts,
  deleteProduct,
} from "@/src/lib/features/products/productsActions";
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

  // ── Selectors ──────────────────────────────────────────────────────────
  const products = useAppSelector((s) => s.products?.products ?? []);
  const meta = useAppSelector((s) => s.products?.meta ?? null);
  const filters = useAppSelector(
    (s) => s.products?.filters ?? { sort: "newest", page: 1, limit: 20 },
  );
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

  const userCurrency = useAppSelector((s) => s.auth.user?.currency ?? "GHS");
  const userCountry = useAppSelector((s) => s.auth.user?.country);

  // ── Actions ────────────────────────────────────────────────────────────
  const loadProducts = useCallback(
    (f?: Partial<ProductFilters>) =>
      dispatch(fetchProducts({ ...filters, ...f })),
    [dispatch, filters],
  );

  const loadFeatured = useCallback(
    (country?: string, category = "all") =>
      dispatch(
        fetchFeaturedProducts({
          country: country ?? userCountry,
          category,
          limit: 7,
        }),
      ),
    [dispatch, userCountry],
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

  // ── Filter helpers ─────────────────────────────────────────────────────
  const applyProductFilters = useCallback(
    (f: Partial<ProductFilters>) => dispatch(setProductFilters(f)),
    [dispatch],
  );

  const clearProductFilters = useCallback(
    () => dispatch(resetProductFilters()),
    [dispatch],
  );

  const goToProductPage = useCallback(
    (page: number) => dispatch(setProductPage(page)),
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

  // ── Price display helper ───────────────────────────────────────────────
  const formatProductPrice = useCallback(
    (amount: number, currency?: string) => {
      const c = currency ?? userCurrency;
      const sym = c === "NGN" ? "₦" : "₵";
      return `${sym}${Number(amount).toLocaleString()}`;
    },
    [userCurrency],
  );

  return {
    // State
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

    // Actions
    loadProducts,
    loadFeatured,
    loadProductById,
    loadMyProducts,
    removeProduct,

    // Filters
    applyProductFilters,
    clearProductFilters,
    goToProductPage,
    clearProduct,
    clearError,

    // Utils
    formatProductPrice,
  };
}
