// src/lib/features/cart/cartSlice.ts
// Cart slice — stores items added from ads/products.
// CartItem shape mirrors what BuyModal / OrderModal dispatch.

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string; // ad._id
  adId?: string; // same as id — explicit for order POST
  title: string;
  price: number; // unit price
  image: string; // cover image URL
  category: string; // "marketplace" | "food" | "apartments"
  currency?: string; // "GHS" | "NGN" — optional, falls back to active country
  amount: number; // quantity
  // Vendor info — optional for backward compat with old call sites
  vendorId?: string;
  vendorName?: string;
  // Delivery info from the ad — optional
  deliveryAvailable?: boolean;
  deliveryFee?: number;
}

interface CartState {
  cartItems: CartItem[];
  subTotal: number;
  delivery: number;
  total: number;
}

const initialState: CartState = {
  cartItems: [],
  subTotal: 0,
  delivery: 0,
  total: 0,
};

// ── Helpers ────────────────────────────────────────────────────────────────
function calcTotals(state: CartState) {
  state.subTotal = state.cartItems.reduce(
    (sum, item) => sum + item.price * item.amount,
    0,
  );
  const maxFee = state.cartItems.reduce((max, item) => {
    if (!item.deliveryAvailable) return max;
    return Math.max(max, item.deliveryFee ?? 0);
  }, 0);
  state.delivery = maxFee;
  state.total = state.subTotal + state.delivery;
}

// ── Slice ──────────────────────────────────────────────────────────────────
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add item or increment quantity if already in cart.
    // Accepts the old minimal shape { id, title, price, image, category, amount }
    // as well as the full shape with vendor/delivery info.
    addToCart: (
      state,
      action: PayloadAction<Omit<CartItem, "amount"> & { amount?: number }>,
    ) => {
      const { id, amount = 1, ...rest } = action.payload;
      const existing = state.cartItems.find((i) => i.id === id);
      if (existing) {
        existing.amount += amount;
      } else {
        state.cartItems.push({
          id,
          adId: rest.adId ?? id,
          title: rest.title,
          price: rest.price,
          image: rest.image,
          category: rest.category,
          currency: rest.currency ?? "GHS",
          amount,
          vendorId: rest.vendorId ?? "",
          vendorName: rest.vendorName ?? "Vendor",
          deliveryAvailable: rest.deliveryAvailable ?? false,
          deliveryFee: rest.deliveryFee ?? 0,
        });
      }
      calcTotals(state);
    },

    // Remove item completely
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
      calcTotals(state);
    },

    // Increase quantity by 1
    increaseAmount: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((i) => i.id === action.payload);
      if (item) item.amount += 1;
      calcTotals(state);
    },

    // Decrease quantity by 1 — remove if reaches 0
    decreaseAmount: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((i) => i.id === action.payload);
      if (!item) return;
      if (item.amount <= 1) {
        state.cartItems = state.cartItems.filter(
          (i) => i.id !== action.payload,
        );
      } else {
        item.amount -= 1;
      }
      calcTotals(state);
    },

    // Recalculate totals (call after any external mutation)
    calculateTotals: (state) => {
      calcTotals(state);
    },

    // Clear all items
    clearCart: (state) => {
      state.cartItems = [];
      state.subTotal = 0;
      state.delivery = 0;
      state.total = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseAmount,
  decreaseAmount,
  calculateTotals,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
