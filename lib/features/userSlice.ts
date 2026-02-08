import { InitialState } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: InitialState = {
  user: {
    cartItems: [],
    total: 0,
    amount: 0,
    isLoading: true,
    token: null,
    name: "",
    _id: "",
    email: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginState: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload.user,
        token: action.payload.token,
      };
    },

    setLogoutState: (state) => {
      state.user = initialState.user;
    },

    clearCart: (state) => {
      state.user.cartItems = [];
      state.user.total = 0;
      state.user.amount = 0;
    },

    removeCartItems: (state, action) => {
      const itemId = action.payload;
      state.user.cartItems = state.user.cartItems.filter(
        (item) => item._id !== itemId
      );
    },

    increaseCartItem: (state, action) => {
      const cartItem = state.user.cartItems.find(
        (item) => item._id === action.payload.itemId
      );
      if (cartItem) {
        cartItem.amount += 1;
      }
    },

    decreaseCartItem: (state, action) => {
      const cartItem = state.user.cartItems.find(
        (item) => item._id === action.payload.itemId
      );
      if (cartItem && cartItem.amount > 1) {
        cartItem.amount -= 1;
      }
    },

    calculateTotals: (state) => {
      let total = 0;
      let amount = 0;

      state.user.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });

      state.user.amount = amount;
      state.user.total = total;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(getCartItems.pending, (state) => {
  //       state.isLoading = true;
  //     })
  //     .addCase(getCartItems.fulfilled, (state, action) => {
  //       console.log(action);
  //       state.isLoading = false;
  //       state.cartItems = action.payload;
  //     })
  //     .addCase(getCartItems.rejected, (state) => {
  //       state.isLoading = false;
  //     });
  // },
})

export const {
  setLoginState,
  setLogoutState,
  clearCart,
  removeCartItems,
  increaseCartItem,
  decreaseCartItem,
  calculateTotals,
} = authSlice.actions;

export default authSlice.reducer;

