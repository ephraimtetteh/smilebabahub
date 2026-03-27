// src/store/adsSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Ad, AdsMeta, AdFilters } from "@/src/types/ad.types";
import {
  fetchAds,
  fetchAdById,
  fetchMyAds,
  createAd,
  updateAd,
  deleteAd,
  boostAd,
  markAsSold,
  togglePause,
  moderateAd,
} from "./adsActions";

interface AdsState {
  // ── Public feed ──────────────────────────────────────────────────────────
  ads: Ad[];
  meta: AdsMeta | null;
  filters: AdFilters;
  feedLoading: boolean;
  feedError: string | null;

  // ── Single ad ────────────────────────────────────────────────────────────
  current: Ad | null;
  currentLoading: boolean;
  currentError: string | null;

  // ── My ads (vendor dashboard) ─────────────────────────────────────────────
  myAds: Ad[];
  myAdsMeta: AdsMeta | null;
  myAdsStats: {
    activeCount: number;
    soldCount: number;
    pausedCount: number;
    totalViews: number;
  } | null;
  myAdsLoading: boolean;
  myAdsError: string | null;
  myAdsStatus: "all" | "active" | "paused" | "sold" | "expired" | "pending";

  // ── Mutations ────────────────────────────────────────────────────────────
  mutating: boolean;
  mutateError: string | null;
  lastCreated: Ad | null;
}

const defaultMeta: AdsMeta = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  hasNext: false,
};

const initialState: AdsState = {
  ads: [],
  meta: null,
  filters: { sort: "newest", page: 1, limit: 20 },
  feedLoading: false,
  feedError: null,

  current: null,
  currentLoading: false,
  currentError: null,

  myAds: [],
  myAdsMeta: null,
  myAdsStats: null,
  myAdsLoading: false,
  myAdsError: null,
  myAdsStatus: "all",

  mutating: false,
  mutateError: null,
  lastCreated: null,
};

// ── Slice ─────────────────────────────────────────────────────────────────
export const adsSlice = createSlice({
  name: "ads",
  initialState,

  reducers: {
    // Update filters and reset to page 1
    setFilters: (state, action: PayloadAction<Partial<AdFilters>>) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    resetFilters: (state) => {
      state.filters = { sort: "newest", page: 1, limit: 20 };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    setMyAdsStatus: (state, action: PayloadAction<AdsState["myAdsStatus"]>) => {
      state.myAdsStatus = action.payload;
    },
    clearCurrent: (state) => {
      state.current = null;
      state.currentError = null;
    },
    clearMutateError: (state) => {
      state.mutateError = null;
    },
    // Optimistically update a single ad in both lists
    patchAd: (
      state,
      action: PayloadAction<{ id: string; patch: Partial<Ad> }>,
    ) => {
      const { id, patch } = action.payload;

      const feedIdx = state.ads.findIndex((a) => a._id === id);
      if (feedIdx !== -1)
        state.ads[feedIdx] = { ...state.ads[feedIdx], ...patch };

      const myIdx = state.myAds.findIndex((a) => a._id === id);
      if (myIdx !== -1)
        state.myAds[myIdx] = { ...state.myAds[myIdx], ...patch };

      if (state.current?._id === id)
        state.current = { ...state.current, ...patch };
    },
    removeAd: (state, action: PayloadAction<string>) => {
      state.ads = state.ads.filter((a) => a._id !== action.payload);
      state.myAds = state.myAds.filter((a) => a._id !== action.payload);
      if (state.current?._id === action.payload) state.current = null;
    },
  },

  extraReducers: (builder) => {
    // ── Fetch public feed ────────────────────────────────────────────────
    builder
      .addCase(fetchAds.pending, (state) => {
        state.feedLoading = true;
        state.feedError = null;
      })
      .addCase(fetchAds.fulfilled, (state, action) => {
        state.feedLoading = false;
        state.ads = action.payload.ads;
        state.meta = action.payload.meta;
      })
      .addCase(fetchAds.rejected, (state, action) => {
        state.feedLoading = false;
        state.feedError = (action.payload as string) ?? "Failed to load ads";
      });

    // ── Fetch single ad ──────────────────────────────────────────────────
    builder
      .addCase(fetchAdById.pending, (state) => {
        state.currentLoading = true;
        state.currentError = null;
      })
      .addCase(fetchAdById.fulfilled, (state, action) => {
        state.currentLoading = false;
        state.current = action.payload;
      })
      .addCase(fetchAdById.rejected, (state, action) => {
        state.currentLoading = false;
        state.currentError = (action.payload as string) ?? "Failed to load ad";
      });

    // ── Fetch my ads ─────────────────────────────────────────────────────
    builder
      .addCase(fetchMyAds.pending, (state) => {
        state.myAdsLoading = true;
        state.myAdsError = null;
      })
      .addCase(fetchMyAds.fulfilled, (state, action) => {
        state.myAdsLoading = false;
        state.myAds = action.payload.ads;
        state.myAdsMeta = action.payload.meta;
        state.myAdsStats = action.payload.stats;
      })
      .addCase(fetchMyAds.rejected, (state, action) => {
        state.myAdsLoading = false;
        state.myAdsError =
          (action.payload as string) ?? "Failed to load your ads";
      });

    // ── Create ad ────────────────────────────────────────────────────────
    builder
      .addCase(createAd.pending, (state) => {
        state.mutating = true;
        state.mutateError = null;
        state.lastCreated = null;
      })
      .addCase(createAd.fulfilled, (state, action) => {
        state.mutating = false;
        state.lastCreated = action.payload;
        state.myAds = [action.payload, ...state.myAds];
      })
      .addCase(createAd.rejected, (state, action) => {
        state.mutating = false;
        state.mutateError = (action.payload as string) ?? "Failed to create ad";
      });

    // ── Update ad ────────────────────────────────────────────────────────
    builder
      .addCase(updateAd.pending, (state) => {
        state.mutating = true;
        state.mutateError = null;
      })
      .addCase(updateAd.fulfilled, (state, action) => {
        state.mutating = false;
        const updated = action.payload;
        const idx = state.myAds.findIndex((a) => a._id === updated._id);
        if (idx !== -1) state.myAds[idx] = updated;
        if (state.current?._id === updated._id) state.current = updated;
      })
      .addCase(updateAd.rejected, (state, action) => {
        state.mutating = false;
        state.mutateError = (action.payload as string) ?? "Failed to update ad";
      });

    // ── Delete ad ────────────────────────────────────────────────────────
    builder
      .addCase(deleteAd.pending, (state) => {
        state.mutating = true;
        state.mutateError = null;
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        const id = action.payload; // deleted ad _id
        state.mutating = false;
        state.ads = state.ads.filter((a) => a._id !== id);
        state.myAds = state.myAds.filter((a) => a._id !== id);
        if (state.current?._id === id) state.current = null;
      })
      .addCase(deleteAd.rejected, (state, action) => {
        state.mutating = false;
        state.mutateError = (action.payload as string) ?? "Failed to delete ad";
      });

    // ── Boost ad ─────────────────────────────────────────────────────────
    builder.addCase(boostAd.fulfilled, (state, action) => {
      const { id, boost } = action.payload;
      [state.ads, state.myAds].forEach((list) => {
        const idx = list.findIndex((a) => a._id === id);
        if (idx !== -1) list[idx].boost = boost;
      });
    });

    // ── Mark sold ────────────────────────────────────────────────────────
    builder.addCase(markAsSold.fulfilled, (state, action) => {
      const id = action.payload;
      [state.ads, state.myAds].forEach((list) => {
        const idx = list.findIndex((a) => a._id === id);
        if (idx !== -1) {
          list[idx].isSold = true;
          list[idx].isActive = false;
        }
      });
    });

    // ── Toggle pause ─────────────────────────────────────────────────────
    builder.addCase(togglePause.fulfilled, (state, action) => {
      const { id, isPaused } = action.payload;
      [state.ads, state.myAds].forEach((list) => {
        const idx = list.findIndex((a) => a._id === id);
        if (idx !== -1) {
          list[idx].isPaused = isPaused;
          list[idx].isActive = !isPaused;
        }
      });
    });

    // ── Moderate (admin) ─────────────────────────────────────────────────
    builder.addCase(moderateAd.fulfilled, (state, action) => {
      const updated = action.payload;
      const idx = state.ads.findIndex((a) => a._id === updated._id);
      if (idx !== -1) state.ads[idx] = updated;
    });
  },
});

export const {
  setFilters,
  resetFilters,
  setPage,
  setMyAdsStatus,
  clearCurrent,
  clearMutateError,
  patchAd,
  removeAd,
} = adsSlice.actions;

export default adsSlice.reducer;
