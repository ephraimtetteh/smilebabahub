import { createSlice } from "@reduxjs/toolkit";
import { StaticImageData } from "next/image";
import type { PayloadAction } from "@reduxjs/toolkit";

type CartItem = {
  _id: string;
  amount: number;
  image: StaticImageData
  price: number
};

interface cartState {
  cartItems: CartItem[];
  total: number;
  amount: number;
}

const initialState: cartState = {
  cartItems: [],
  total: 0,
  amount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action:PayloadAction<CartItem>) => {
      const existingItem = state.cartItems.find((item) => item?._id === action.payload._id);

      if (existingItem) {
        existingItem.amount += 1;
      } else {
        state.cartItems.push({ ...action.payload, amount: 1 });
      }
    },

    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload,
      );
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.total = 0;
      state.amount = 0;
    },

    increaseCartItem: (state, action) => {
      const item = state.cartItems.find((item) => item._id === action.payload);
      if (item) item.amount += 1;
    },

    decreaseCartItem: (state, action) => {
      const item = state.cartItems.find((item) => item._id === action.payload);
      if (item && item.amount > 1) item.amount -= 1;
    },

    calculateTotals: (state) => {
      let total = 0;
      let amount = 0;

      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });

      state.total = total;
      state.amount = amount;
    },
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
