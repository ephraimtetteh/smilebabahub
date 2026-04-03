// src/lib/features/products/productsActions.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/src/lib/api/axios";

// Resolve country for API calls — mirrors useViewCountry priority.
// Returns null when country detection is still in-flight (guestDetecting=true)
// so callers can skip the fetch rather than sending "Ghana" to a Nigerian user.
function resolveCountry(
  explicit: string | undefined,
  state: any,
): string | null {
  const VALID = ["Ghana", "Nigeria"];

  // If geo detection is in-flight for a guest, don't guess — skip the fetch.
  // FeaturedProducts already guards on guestDetecting, but thunks called
  // from elsewhere need this safety net too.
  const isAuthenticated = state?.auth?.isAuthenticated;
  const guestDetecting = state?.auth?.guestDetecting;
  if (!isAuthenticated && guestDetecting) return null;

  // 1. Manual CountrySwitcher selection wins over everything
  const selected = state?.auth?.selectedCountry;
  if (selected && VALID.includes(selected)) return selected;

  // 2. Explicit caller override (e.g. URL query param)
  if (explicit) {
    if (VALID.includes(explicit)) return explicit;
    const lc = explicit.toLowerCase();
    if (lc.includes("nigeria")) return "Nigeria";
    if (lc.includes("ghana")) return "Ghana";
  }

  // 3. Logged-in user's IP-detected country (validated — rejects stale values)
  const userCountry = state?.auth?.user?.country;
  if (userCountry && VALID.includes(userCountry)) return userCountry;

  // 4. Guest IP-detected country
  const guestCountry = state?.auth?.guestCountry;
  if (guestCountry && VALID.includes(guestCountry)) return guestCountry;

  // 5. Fallback — only reached before any detection has run at all
  //    (first paint before GuestLocationDetector mounts)
  return "Ghana";
}

// ── Fetch product feed ────────────────────────────────────────────────────────
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (filters: Record<string, any>, { rejectWithValue, getState }) => {
    try {
      const country = resolveCountry(filters.country, getState());
      // null means geo detection is in-flight — abort to avoid fetching with wrong country
      if (country === null) return rejectWithValue("detecting");

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
      const resolvedCountry = resolveCountry(country, getState());
      // null means geo detection is in-flight — wait for it to complete
      if (resolvedCountry === null) return rejectWithValue("detecting");

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
