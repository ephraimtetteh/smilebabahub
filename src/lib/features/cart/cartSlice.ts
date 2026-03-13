import { createSlice } from "@reduxjs/toolkit";
import { StaticImageData } from "next/image";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CartItemProp } from "@/src/types/types";
import { login } from "../auth/authActions";

declare interface cartState {
  loading: boolean;
  cartItems: CartItemProp[];
  total: number;
  amount: number
  delivery: number,
  subTotal: number
}


const initialState: cartState = {
  cartItems: [],
  loading: false,
  total: 0,
  subTotal: 0,
  amount: 0,
  delivery: 0
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItemProp>) => {
      const existingItem = state.cartItems.find(
        (item) => item?.id === action.payload.id,
      );

      if (existingItem) {
        existingItem.amount += 1;
      } else {
        state.cartItems.push({ ...action.payload, amount: 1 });
      }
    },

    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload,
      );
    },

    clearCart: (state) => {
      state.cartItems = [];
    },

    increaseCartItem: (state, action) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) item.amount += 1;
    },

    decreaseCartItem: (state, action) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item && item.amount > 1) item.amount -= 1;
    },

    calculateTotals: (state) => {
      let subTotal = 0;
      let amount = 0;

      state.cartItems.forEach((item) => {
        amount += item.amount;
        subTotal += item.amount * item.price;
      });

      state.subTotal = subTotal;
      state.amount = amount;
      state.total = subTotal + state.delivery;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.cartItems = action.payload.cartItems;
    });
  },
});

export const {
  addToCart,
  removeCartItem,
  clearCart,
  increaseCartItem,
  decreaseCartItem,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
