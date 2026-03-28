// src/lib/features/ads/adsActions.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/src/lib/api/axios";

// Always resolve to a valid country — never send empty string to backend.
function resolveCountry(explicit: string | undefined, state: any): string {
  return (
    explicit ||
    state?.auth?.user?.country ||
    state?.auth?.guestCountry ||
    "Ghana"
  );
}

// ── Fetch public feed ─────────────────────────────────────────────────────────
export const fetchAds = createAsyncThunk(
  "ads/fetchAds",
  async (filters: Record<string, any>, { rejectWithValue, getState }) => {
    try {
      const country = resolveCountry(filters.country, getState());
      const params = Object.fromEntries(
        Object.entries({ ...filters, country }).filter(
          ([, v]) => v !== undefined && v !== "",
        ),
      );
      const res = await axiosInstance.get("/ads", { params });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to load ads",
      );
    }
  },
);

// ── Fetch single ad by ID ─────────────────────────────────────────────────────
export const fetchAdById = createAsyncThunk(
  "ads/fetchAdById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/ads/${id}`);
      return res.data.ad;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message ?? "Ad not found");
    }
  },
);

// ── Fetch single ad by slug ───────────────────────────────────────────────────
export const fetchAdBySlug = createAsyncThunk(
  "ads/fetchAdBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/ads/slug/${slug}`);
      return res.data.ad;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message ?? "Ad not found");
    }
  },
);

// ── Fetch vendor's own ads ────────────────────────────────────────────────────
export const fetchMyAds = createAsyncThunk(
  "ads/fetchMyAds",
  async (
    params: { status?: string; page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const res = await axiosInstance.get("/ads/my", { params });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to load your ads",
      );
    }
  },
);

// ── Create ad ─────────────────────────────────────────────────────────────────
export const createAd = createAsyncThunk(
  "ads/createAd",
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/ads", payload);
      return res.data.ad;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to create ad",
      );
    }
  },
);

// ── Update ad ─────────────────────────────────────────────────────────────────
export const updateAd = createAsyncThunk(
  "ads/updateAd",
  async (
    { id, payload }: { id: string; payload: any },
    { rejectWithValue },
  ) => {
    try {
      const res = await axiosInstance.patch(`/ads/${id}`, payload);
      return res.data.ad;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to update ad",
      );
    }
  },
);

// ── Delete ad ─────────────────────────────────────────────────────────────────
export const deleteAd = createAsyncThunk(
  "ads/deleteAd",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/ads/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to delete ad",
      );
    }
  },
);

// ── Boost ad ──────────────────────────────────────────────────────────────────
export const boostAd = createAsyncThunk(
  "ads/boostAd",
  async ({ id, tier }: { id: string; tier?: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/ads/${id}/boost`, { tier });
      return res.data.ad;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to boost ad",
      );
    }
  },
);

// ── Mark as sold ──────────────────────────────────────────────────────────────
export const markAsSold = createAsyncThunk(
  "ads/markAsSold",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/ads/${id}/sold`);
      return res.data.ad;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to mark as sold",
      );
    }
  },
);

// ── Toggle pause ──────────────────────────────────────────────────────────────
export const togglePause = createAsyncThunk(
  "ads/togglePause",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/ads/${id}/pause`);
      return res.data.ad;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to toggle pause",
      );
    }
  },
);

// ── Record contact click ───────────────────────────────────────────────────────
export const recordContactClick = createAsyncThunk(
  "ads/recordContactClick",
  async (id: string) => {
    try {
      await axiosInstance.post(`/ads/${id}/contact-click`);
    } catch {}
  },
);

// ── Moderate ad (manual admin flag only — ads auto-approve on post) ────────────
export const moderateAd = createAsyncThunk(
  "ads/moderateAd",
  async (
    {
      id,
      status,
      rejectReason,
    }: {
      id: string;
      status: "approved" | "rejected" | "flagged";
      rejectReason?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await axiosInstance.patch(`/ads/${id}/moderate`, {
        status,
        rejectReason,
      });
      return res.data.ad;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to moderate ad",
      );
    }
  },
);
