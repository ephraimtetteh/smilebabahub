import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserProp } from "@/src/types/types";
import { register, restoreSession, login, logout } from "./authActions";

interface Message {
  type: string;
  message: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  hasCheckedAuth: boolean;
  accessToken: null | string;
  user: UserProp | null;
  message: Message;
  guestCountry: string; // "Ghana" | "Nigeria" — detected from IP for unauthenticated visitors
  guestCurrency: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAuthenticating: true,
  hasCheckedAuth: false,
  accessToken: null,
  user: null,
  message: { type: "", message: "" },
  guestCountry: "Ghana", // default until IP detection resolves
  guestCurrency: "GHS",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setIsAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticating = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<null | string>) => {
      state.accessToken = action.payload;
    },
    setUser: (state, action: PayloadAction<UserProp | null>) => {
      state.user = action.payload;
    },
    setMessage: (state, action: PayloadAction<Message>) => {
      state.message = action.payload;
    },
    setGuestLocation: (
      state,
      action: PayloadAction<{ country: string; currency: string }>,
    ) => {
      state.guestCountry = action.payload.country;
      state.guestCurrency = action.payload.currency;
    },
  },

  extraReducers: (builder) => {
    builder
      // ── Register ──
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.hasCheckedAuth = true;
      })

      // ── Restore session (browser refresh) ──
      .addCase(restoreSession.pending, (state) => {
        state.isAuthenticating = true;
        state.hasCheckedAuth = false;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isAuthenticating = false;
        state.isAuthenticated = true;
        state.user = action.payload; // includes currency/country
        state.hasCheckedAuth = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isAuthenticating = false;
        state.isAuthenticated = false;
        state.user = null;
        state.hasCheckedAuth = true;
        // guestCountry remains as-is — GuestLocationDetector will update it via IP
      })

      // ── Login ──
      .addCase(login.pending, (state) => {
        state.isAuthenticating = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticating = false;
        state.isAuthenticated = true;
        state.user = action.payload.user; // includes currency/country
        state.hasCheckedAuth = true;
      })
      .addCase(login.rejected, (state) => {
        state.isAuthenticating = false;
        state.isAuthenticated = false;
        state.user = null;
        state.hasCheckedAuth = true;
      })

      // ── Logout ──
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticating = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.hasCheckedAuth = true;
      });
  },
});

export const {
  setIsAuthenticated,
  setIsAuthenticating,
  setAccessToken,
  setUser,
  setMessage,
  setGuestLocation,
} = authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;
