// src/store/adsActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/src/lib/api/axios";
import {
  Ad,
  AdFilters,
  GetAdsResponse,
  GetMyAdsResponse,
  CreateAdPayload,
  UpdateAdPayload,
  AdBoost,
} from "@/src/types/ad.types";

// ── Fetch public ad feed ───────────────────────────────────────────────────
export const fetchAds = createAsyncThunk<GetAdsResponse, AdFilters>(
  "ads/fetchAds",
  async (filters, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const country = filters.country ?? state.auth?.user?.country;

      // Never fetch without a country — backend returns empty without it
      if (!country) {
        return {
          ads: [],
          meta: { total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false },
        } as GetAdsResponse;
      }

      const params = Object.fromEntries(
        Object.entries({ ...filters, country }).filter(
          ([, v]) => v !== undefined && v !== "",
        ),
      );
      const res = await axiosInstance.get("/ads", { params });
      return res.data as GetAdsResponse;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to load ads",
      );
    }
  },
);

// ── Fetch single ad by ID ──────────────────────────────────────────────────
export const fetchAdById = createAsyncThunk<Ad, string>(
  "ads/fetchAdById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/ads/${id}`);
      return res.data.ad as Ad;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message ?? "Ad not found");
    }
  },
);

// ── Fetch single ad by slug ────────────────────────────────────────────────
export const fetchAdBySlug = createAsyncThunk<Ad, string>(
  "ads/fetchAdBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/ads/slug/${slug}`);
      return res.data.ad as Ad;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message ?? "Ad not found");
    }
  },
);

// ── Fetch my ads (vendor dashboard) ───────────────────────────────────────
export const fetchMyAds = createAsyncThunk<
  GetMyAdsResponse,
  { status?: string; page?: number; limit?: number }
>("ads/fetchMyAds", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/ads/my", { params });
    return res.data as GetMyAdsResponse;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ?? "Failed to load your ads",
    );
  }
});

// ── Create ad ──────────────────────────────────────────────────────────────
export const createAd = createAsyncThunk<Ad, CreateAdPayload>(
  "ads/createAd",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/ads", payload);
      return res.data.ad as Ad;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to create ad",
      );
    }
  },
);

// ── Update ad ──────────────────────────────────────────────────────────────
export const updateAd = createAsyncThunk<
  Ad,
  { id: string; payload: UpdateAdPayload }
>("ads/updateAd", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.patch(`/ads/${id}`, payload);
    return res.data.ad as Ad;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ?? "Failed to update ad",
    );
  }
});

// ── Delete ad ──────────────────────────────────────────────────────────────
export const deleteAd = createAsyncThunk<string, string>(
  "ads/deleteAd",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/ads/${id}`);
      return id; // return the deleted id so slice can remove it
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to delete ad",
      );
    }
  },
);

// ── Boost ad ───────────────────────────────────────────────────────────────
export const boostAd = createAsyncThunk<
  { id: string; boost: AdBoost },
  { id: string; tier?: "standard" | "featured" | "premium" }
>("ads/boostAd", async ({ id, tier = "standard" }, { rejectWithValue }) => {
  try {
    await axiosInstance.post(`/ads/${id}/boost`, { tier });
    // Backend only returns a message — construct the boost object locally
    const days: Record<string, number> = {
      standard: 7,
      featured: 14,
      premium: 30,
    };
    const d = days[tier] ?? 7;
    return {
      id,
      boost: {
        isBoosted: true,
        boostedAt: new Date().toISOString(),
        boostedUntil: new Date(Date.now() + d * 86400000).toISOString(),
        boostTier: tier,
      } as AdBoost,
    };
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ?? "Failed to boost ad",
    );
  }
});

// ── Mark ad as sold ────────────────────────────────────────────────────────
export const markAsSold = createAsyncThunk<string, string>(
  "ads/markAsSold",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.patch(`/ads/${id}/sold`);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to mark as sold",
      );
    }
  },
);

// ── Toggle pause ───────────────────────────────────────────────────────────
export const togglePause = createAsyncThunk<
  { id: string; isPaused: boolean },
  string
>("ads/togglePause", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.patch(`/ads/${id}/pause`);
    return { id, isPaused: res.data.isPaused as boolean };
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ?? "Failed to toggle pause",
    );
  }
});

// ── Record contact click (analytics) ──────────────────────────────────────
export const recordContactClick = createAsyncThunk<void, string>(
  "ads/recordContactClick",
  async (id) => {
    // Fire-and-forget — don't block UI on analytics
    axiosInstance.post(`/ads/${id}/contact-click`).catch(() => null);
  },
);

// ── Moderate ad (admin) ────────────────────────────────────────────────────
export const moderateAd = createAsyncThunk<
  Ad,
  {
    id: string;
    status: "approved" | "rejected" | "flagged";
    rejectReason?: string;
  }
>(
  "ads/moderateAd",
  async ({ id, status, rejectReason }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/ads/${id}/moderate`, {
        status,
        rejectReason,
      });
      return res.data.ad as Ad;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to moderate ad",
      );
    }
  },
);
