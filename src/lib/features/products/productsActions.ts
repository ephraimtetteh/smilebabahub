// src/store/productsActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/src/lib/api/axios";
import {
  Product,
  ProductFilters,
  GetProductsResponse,
} from "@/src/types/product.types";

// ── Fetch product feed ─────────────────────────────────────────────────────
export const fetchProducts = createAsyncThunk<
  GetProductsResponse,
  ProductFilters
>("products/fetchProducts", async (filters, { rejectWithValue }) => {
  try {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== ""),
    );
    const res = await axiosInstance.get("/products", { params });
    return res.data as GetProductsResponse;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ?? "Failed to load products",
    );
  }
});

// ── Fetch featured products by category (homepage sections) ───────────────
export const fetchFeaturedProducts = createAsyncThunk<
  { category: string; products: Product[] },
  { country?: string; category?: string; limit?: number }
>(
  "products/fetchFeaturedProducts",
  async ({ country, category = "all", limit = 7 }, { rejectWithValue }) => {
    try {
      const params: Record<string, unknown> = { limit };
      if (country) params.country = country;
      if (category && category !== "all") params.category = category;
      // "newest" works even with no view data; switch to "popular" once you have traffic
      params.sort = "newest";

      const res = await axiosInstance.get("/products", { params });
      return {
        category,
        products: (res.data.products ?? res.data) as Product[],
      };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to load featured products",
      );
    }
  },
);

// ── Fetch single product ───────────────────────────────────────────────────
export const fetchProductById = createAsyncThunk<Product, string>(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      return (res.data.product ?? res.data) as Product;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Product not found",
      );
    }
  },
);

// ── Fetch vendor's own products ────────────────────────────────────────────
export const fetchMyProducts = createAsyncThunk<
  GetProductsResponse,
  { page?: number; limit?: number }
>("products/fetchMyProducts", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/products/my", { params });
    return res.data as GetProductsResponse;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ?? "Failed to load your products",
    );
  }
});

// ── Delete product ─────────────────────────────────────────────────────────
export const deleteProduct = createAsyncThunk<string, string>(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
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
