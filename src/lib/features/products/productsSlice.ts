// src/store/productsSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  Product,
  ProductsMeta,
  ProductFilters,
} from "@/src/types/product.types";
import {
  fetchProducts,
  fetchFeaturedProducts,
  fetchProductById,
  fetchMyProducts,
  deleteProduct,
} from "./productsActions";

interface ProductsState {
  // ── Public feed ───────────────────────────────────────────────────────────
  products: Product[];
  meta: ProductsMeta | null;
  filters: ProductFilters;
  feedLoading: boolean;
  feedError: string | null;

  // ── Featured (homepage sections — keyed by category) ─────────────────────
  featuredByCategory: Record<string, Product[]>; // e.g. { all: [], food: [], marketplace: [] }
  featuredLoading: boolean;
  featuredError: string | null;

  // ── Single product ────────────────────────────────────────────────────────
  current: Product | null;
  currentLoading: boolean;
  currentError: string | null;

  // ── My products (vendor dashboard) ────────────────────────────────────────
  myProducts: Product[];
  myMeta: ProductsMeta | null;
  myLoading: boolean;
  myError: string | null;

  // ── Mutations ─────────────────────────────────────────────────────────────
  mutating: boolean;
  mutateError: string | null;
}

const initialState: ProductsState = {
  products: [],
  meta: null,
  filters: { sort: "newest", page: 1, limit: 20 },
  feedLoading: false,
  feedError: null,

  featuredByCategory: {},
  featuredLoading: false,
  featuredError: null,

  current: null,
  currentLoading: false,
  currentError: null,

  myProducts: [],
  myMeta: null,
  myLoading: false,
  myError: null,

  mutating: false,
  mutateError: null,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,

  reducers: {
    setProductFilters: (
      state,
      action: PayloadAction<Partial<ProductFilters>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    resetProductFilters: (state) => {
      state.filters = { sort: "newest", page: 1, limit: 20 };
    },
    setProductPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.current = null;
      state.currentError = null;
    },
    clearProductMutateError: (state) => {
      state.mutateError = null;
    },
    removeProductFromState: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p._id !== action.payload);
      state.myProducts = state.myProducts.filter(
        (p) => p._id !== action.payload,
      );
      Object.keys(state.featuredByCategory).forEach((cat) => {
        state.featuredByCategory[cat] = state.featuredByCategory[cat].filter(
          (p) => p._id !== action.payload,
        );
      });
      if (state.current?._id === action.payload) state.current = null;
    },
  },

  extraReducers: (builder) => {
    // ── Fetch feed ─────────────────────────────────────────────────────────
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.feedLoading = true;
        state.feedError = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.feedLoading = false;
        state.products = action.payload.products;
        state.meta = action.payload.meta;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.feedLoading = false;
        state.feedError =
          (action.payload as string) ?? "Failed to load products";
      });

    // ── Fetch featured ─────────────────────────────────────────────────────
    builder
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.featuredLoading = true;
        state.featuredError = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredLoading = false;
        const { category, products } = action.payload;
        state.featuredByCategory[category] = products;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.featuredLoading = false;
        state.featuredError =
          (action.payload as string) ?? "Failed to load featured products";
      });

    // ── Fetch single ───────────────────────────────────────────────────────
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.currentLoading = true;
        state.currentError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentLoading = false;
        state.current = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.currentLoading = false;
        state.currentError = (action.payload as string) ?? "Product not found";
      });

    // ── Fetch my products ──────────────────────────────────────────────────
    builder
      .addCase(fetchMyProducts.pending, (state) => {
        state.myLoading = true;
        state.myError = null;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.myLoading = false;
        state.myProducts = action.payload.products;
        state.myMeta = action.payload.meta;
      })
      .addCase(fetchMyProducts.rejected, (state, action) => {
        state.myLoading = false;
        state.myError =
          (action.payload as string) ?? "Failed to load your products";
      });

    // ── Delete product ─────────────────────────────────────────────────────
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.mutating = true;
        state.mutateError = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const id = action.payload;
        state.mutating = false;
        state.products = state.products.filter((p) => p._id !== id);
        state.myProducts = state.myProducts.filter((p) => p._id !== id);
        Object.keys(state.featuredByCategory).forEach((cat) => {
          state.featuredByCategory[cat] = state.featuredByCategory[cat].filter(
            (p) => p._id !== id,
          );
        });
        if (state.current?._id === id) state.current = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.mutating = false;
        state.mutateError =
          (action.payload as string) ?? "Failed to delete product";
      });
  },
});

export const {
  setProductFilters,
  resetProductFilters,
  setProductPage,
  clearCurrentProduct,
  clearProductMutateError,
  removeProductFromState,
} = productsSlice.actions;

export default productsSlice.reducer;
