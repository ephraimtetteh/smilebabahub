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

  // ── Guest geo ────────────────────────────────────────────────────────────
  guestCountry: string; // IP-detected country for unauthenticated visitors
  guestCurrency: string;
  guestDetecting: boolean; // true while /auth/guest-country is in-flight

  // ── Universal country switcher ────────────────────────────────────────────
  // Any user type (guest / vendor / admin) can pick a country.
  // Empty string = auto-resolve from user.country or guestCountry.
  selectedCountry: string;

  // ── Admin ─────────────────────────────────────────────────────────────────
  isAdmin: boolean;
  adminViewCountry: string; // kept for backward compat — use selectedCountry instead
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAuthenticating: true,
  hasCheckedAuth: false,
  accessToken: null,
  user: null,
  message: { type: "", message: "" },

  guestCountry: "Ghana",
  guestCurrency: "GHS",
  guestDetecting: false,

  selectedCountry: "", // "" = auto-detect

  isAdmin: false,
  adminViewCountry: "Ghana",
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

    // Guest IP detection
    setGuestLocation: (
      state,
      action: PayloadAction<{ country: string; currency: string }>,
    ) => {
      state.guestCountry = action.payload.country;
      state.guestCurrency = action.payload.currency;
    },
    setGuestDetecting: (state, action: PayloadAction<boolean>) => {
      state.guestDetecting = action.payload;
    },

    // Universal country switcher — works for everyone, instant, no API call
    setSelectedCountry: (state, action: PayloadAction<string>) => {
      state.selectedCountry = action.payload;
    },

    // Admin backward-compat alias — still works for AdminCountryDropdown
    // No longer mutates user.country (useViewCountry reads selectedCountry first)
    setAdminViewCountry: (state, action: PayloadAction<string>) => {
      state.adminViewCountry = action.payload;
      state.selectedCountry = action.payload; // unified — drives useViewCountry
    },
  },

  extraReducers: (builder) => {
    builder
      // ── Register ──────────────────────────────────────────────────────────
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.hasCheckedAuth = true;
        // Clear any guest-era manual country pick so user's detected country is used
        state.selectedCountry = "";
      })

      // ── Restore session ───────────────────────────────────────────────────
      .addCase(restoreSession.pending, (state) => {
        state.isAuthenticating = true;
        state.hasCheckedAuth = false;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isAuthenticating = false;
        state.isAuthenticated = true;
        state.user = action.payload; // IS the user (not .user)
        state.isAdmin = action.payload?.isAdmin ?? false;
        state.hasCheckedAuth = true;
        // Clear any stale guest selectedCountry so login country is used
        state.selectedCountry = "";
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isAuthenticating = false;
        state.isAuthenticated = false;
        state.user = null;
        state.hasCheckedAuth = true;
        // guestCountry stays — GuestLocationDetector manages it
      })

      // ── Login ─────────────────────────────────────────────────────────────
      .addCase(login.pending, (state) => {
        state.isAuthenticating = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticating = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isAdmin = action.payload.user?.isAdmin ?? false;
        state.hasCheckedAuth = true;
        // ── CRITICAL: clear guest selectedCountry on login ──────────────────
        // Otherwise a guest who manually picked "Nigeria" would stay on Nigeria
        // even if their account country is "Ghana", confusing them.
        // They can always re-select via CountrySwitcher after login.
        state.selectedCountry = "";
      })
      .addCase(login.rejected, (state) => {
        state.isAuthenticating = false;
        state.isAuthenticated = false;
        state.user = null;
        state.hasCheckedAuth = true;
      })

      // ── Logout ────────────────────────────────────────────────────────────
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticating = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.hasCheckedAuth = true;
        state.isAdmin = false;
        state.adminViewCountry = "Ghana";
        // ── CRITICAL: clear selectedCountry on logout ───────────────────────
        // Next visitor (guest) should get their own IP-detected country,
        // not inherit the previous user's manual selection.
        state.selectedCountry = "";
        // Keep guestCountry/guestCurrency — GuestLocationDetector re-sets these
        // on the next page load if session cache is stale.
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
  setGuestDetecting,
  setSelectedCountry,
  setAdminViewCountry,
} = authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;
