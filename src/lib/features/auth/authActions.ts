import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  setIsAuthenticated,
  setIsAuthenticating,
  setAccessToken,
  setUser,
  setMessage,
} from "./authSlice";
import axiosInstance from "@/src/lib/api/axios";
import getErrorMessage from "@/src/utils/getErrorMessage";
import {
  LoginResponseProp,
  RegisterResponseProp,
  UserProp,
} from "@/src/types/types";
import { safeStorage } from "@/src/utils/safeStorage";

// Always route refresh through the Next.js rewrite proxy.
// This ensures the httpOnly refreshToken cookie is forwarded correctly in
// all environments — both dev (localhost) and production (cross-domain).
const REFRESH_URL = "/api/auth/refresh";

// ── REGISTER ───────────────────────────────────────────────────────────────
export const register = createAsyncThunk<
  RegisterResponseProp,
  { username: string; email: string; password: string; phone: string },
  { rejectValue: string }
>(
  "/smilebaba/auth/register",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.post<RegisterResponseProp>(
        "/auth/register",
        userData,
      );
      dispatch(setUser(res.data.user));
      dispatch(setIsAuthenticated(true));
      return res.data;
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(setMessage({ type: "error", message }));
      return rejectWithValue(message);
    }
  },
);





// ── VERIFY OTP ─────────────────────────────────────────────────────────────
export const verifyOTP = createAsyncThunk(
  "/auth/verifyOtp",
  async (data: { phone: string; otp: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/verify-otp", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);





// ── RESEND OTP ─────────────────────────────────────────────────────────────
export const resendOTP = createAsyncThunk(
  "/auth/resendOtp",
  async (phone: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/resend-otp", { phone });
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);





// ── LOGIN ──────────────────────────────────────────────────────────────────
export const login = createAsyncThunk<
  LoginResponseProp & { redirectTo?: string },
  { email: string; password: string; returnUrl?: string }
>("/smilebaba/auth/login", async (userData, { dispatch }) => {
  try {
    dispatch(setIsAuthenticating(true));

    const response = await axiosInstance.post<LoginResponseProp>(
      "/auth/login",
      { email: userData.email, password: userData.password },
    );

    // ✅ Save token so request interceptor picks it up immediately
    if (response.data.accessToken) {
      safeStorage.set("accessToken", response.data.accessToken);
      dispatch(setAccessToken(response.data.accessToken));
    }

    dispatch(setUser(response.data.user));
    dispatch(setIsAuthenticated(true));

    // ── Role-based redirect ───────────────────────────────────────────────
    // Priority: explicit returnUrl → role-based default → "/"
    const role = response.data.user?.role;
    const returnUrl =
      userData.returnUrl ||
      (typeof window !== "undefined"
        ? (new URLSearchParams(window.location.search).get("returnUrl") ?? "")
        : "");

    let redirectTo: string;
    if (returnUrl && returnUrl.startsWith("/")) {
      redirectTo = returnUrl; // honour explicit returnUrl
    } else if (role === "vendor") {
      redirectTo = "/vendor/dashboard"; // vendors → their dashboard
    } else if (role === "admin") {
      redirectTo = "/admin"; // admins → admin panel
    } else {
      redirectTo = "/"; // guests → homepage
    }

    return { ...response.data, redirectTo };
  } catch (error) {
    dispatch(setIsAuthenticated(false));
    dispatch(setAccessToken(null));
    dispatch(setUser(null));
    dispatch(setMessage({ type: "error", message: getErrorMessage(error) }));
    throw error;
  } finally {
    dispatch(setIsAuthenticating(false));
  }
});

// ── RESTORE SESSION (browser refresh) ─────────────────────────────────────
// Called on app mount — refreshes the access token then fetches the user.
// This is what keeps the user logged in after a browser refresh.
export const restoreSession = createAsyncThunk<
  UserProp,
  void,
  { rejectValue: string }
>("auth/refresh", async (_, { dispatch, rejectWithValue }) => {
  try {
    // 1. Get a fresh access token using the httpOnly refreshToken cookie
    // 15s timeout: Render free tier cold-starts can take 10-30s.
    // If it exceeds 15s we treat the session as expired and show login.
    // Better UX than an infinite spinner.
    const refreshRes = await axios.post(
      REFRESH_URL,
      {},
      {
        withCredentials: true,
        timeout: 15000,
      },
    );
    const newToken = refreshRes.data.accessToken;

    if (newToken) {
      // ✅ Save so the request interceptor sends it on the /auth/me call below
      safeStorage.set("accessToken", newToken);
      dispatch(setAccessToken(newToken));
    }

    // 2. Fetch the full user (includes country + currency from last login)
    const response = await axiosInstance.get("/auth/me");
    return response.data.user;
  } catch (error) {
    // Clear stale token on failure so interceptor doesn't keep sending it
    safeStorage.remove("accessToken");
    dispatch(setAccessToken(null));
    return rejectWithValue(getErrorMessage(error));
  }
});

// ── FORGOT PASSWORD ────────────────────────────────────────────────────────
export const forgotPassword = createAsyncThunk(
  "/auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ── RESET PASSWORD ─────────────────────────────────────────────────────────
export const resetPassword = createAsyncThunk(
  "/auth/resetPassword",
  async (
    { token, password }: { token: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await axiosInstance.post("/auth/reset-password", {
        token,
        password,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ── VALIDATE USER (/auth/me) ───────────────────────────────────────────────
export const validateUser = createAsyncThunk(
  "/smilebaba/auth/me",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/me");
      dispatch(setUser(res.data.user));
      dispatch(setIsAuthenticated(true));
      return res.data.user;
    } catch (error) {
      dispatch(setIsAuthenticated(false));
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// ── LOGOUT ─────────────────────────────────────────────────────────────────
export const logout = createAsyncThunk(
  "/smilebaba/auth/logout",
  async (_, { dispatch }) => {
    try {
      dispatch(setIsAuthenticating(true));
      await axiosInstance.post("/auth/logout");
      safeStorage.remove("accessToken");
      dispatch(setUser(null));
      dispatch(setAccessToken(null));
      dispatch(setIsAuthenticated(false));
    } finally {
      dispatch(setIsAuthenticating(false));
    }
  },
);
