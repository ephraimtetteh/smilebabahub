import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // { _id, name, email }
  token: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginState: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
    },

    setLogoutState: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoginState, setLogoutState, setLoading } = authSlice.actions;

export default authSlice.reducer;
