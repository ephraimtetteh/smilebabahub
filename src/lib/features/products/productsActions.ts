// src/lib/features/products/productsActions.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/src/lib/api/axios";

// Always resolve to a valid country — never send an empty string to backend.
// Priority: explicit arg → logged-in user.country → guestCountry → "Ghana"
function resolveCountry(explicit: string | undefined, state: any): string {
  return (
    explicit ||
    state?.auth?.user?.country ||
    state?.auth?.guestCountry ||
    "Ghana"
  );
}

// ── Fetch product feed ────────────────────────────────────────────────────────
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (filters: Record<string, any>, { rejectWithValue, getState }) => {
    try {
      const country = resolveCountry(filters.country, getState());
      const params = Object.fromEntries(
        Object.entries({ ...filters, country }).filter(
          ([, v]) => v !== undefined && v !== "",
        ),
      );
      const res = await axiosInstance.get("/products", { params });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to load products",
      );
    }
  },
);

// ── Fetch featured products by category (homepage) ────────────────────────────
export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeaturedProducts",
  async (
    {
      country,
      category = "all",
      limit = 7,
    }: { country?: string; category?: string; limit?: number },
    { rejectWithValue, getState },
  ) => {
    try {
      // Always resolve — never send empty country to backend
      const resolvedCountry = resolveCountry(country, getState());

      const params: Record<string, any> = {
        country: resolvedCountry,
        limit,
        sort: "newest",
      };
      if (category && category !== "all") params.category = category;

      const res = await axiosInstance.get("/products", { params });
      return {
        category,
        products: res.data.products ?? res.data ?? [],
      };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to load featured products",
      );
    }
  },
);

// ── Fetch single product by ID ────────────────────────────────────────────────
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      return res.data.product ?? res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Product not found",
      );
    }
  },
);

// ── Fetch vendor's own products ───────────────────────────────────────────────
export const fetchMyProducts = createAsyncThunk(
  "products/fetchMyProducts",
  async (params: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/products/my", { params });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to load your products",
      );
    }
  },
);

// ── Delete product ────────────────────────────────────────────────────────────
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/products/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to delete product",
      );
    }
  },
);
