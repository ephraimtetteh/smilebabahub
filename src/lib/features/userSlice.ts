import { InitialState } from "@/src/types/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: InitialState = {
  user: {
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
    setRegisterState: (state, action) => {
      if (!action.payload) return;
      state.user = { ...state.user, ...action.payload };
    },

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
  setRegisterState,
  setLoginState,
  setLogoutState,
} = authSlice.actions;
const authReducer = authSlice.reducer
export default authReducer;

