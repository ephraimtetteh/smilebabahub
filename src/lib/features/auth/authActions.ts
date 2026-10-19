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

// ── Shared helpers ─────────────────────────────────────────────────────────

/**
 * Only same-site paths. "//evil.com" starts with "/" too, and the browser
 * treats it as another site — the old startsWith("/") check let it through.
 */
export function safeReturnPath(p?: string | null): string | null {
  if (!p || typeof p !== "string") return null;
  if (!p.startsWith("/") || p.startsWith("//") || p.startsWith("/\\")) return null;
  return p;
}

/** Where a signed-in user goes: explicit returnUrl → role default → "/". */
function redirectFor(role?: string, returnUrl?: string | null) {
  const safe = safeReturnPath(returnUrl);
  if (safe) return safe;
  if (role === "vendor") return "/vendor/dashboard";
  if (role === "admin") return "/admin";
  return "/";
}

export const TWO_FACTOR_KEY = "sb.2fa.challenge";

/**
 * Password was right but the account has Google Authenticator on. Park the
 * short-lived challenge (5 min) in sessionStorage — never localStorage —
 * and send the user to /auth/two-factor.
 */
function parkTwoFactorChallenge(challengeToken: string, returnUrl?: string | null) {
  try {
    sessionStorage.setItem(
      TWO_FACTOR_KEY,
      JSON.stringify({ challengeToken, returnUrl: safeReturnPath(returnUrl), at: Date.now() }),
    );
  } catch {
    /* private mode — the two-factor page will ask them to sign in again */
  }
}

/** Store the session from any successful login-shaped response. */
function completeLogin(dispatch: any, data: any) {
  if (data?.accessToken) {
    safeStorage.set("accessToken", data.accessToken);
    dispatch(setAccessToken(data.accessToken));
  }
  dispatch(setUser(data.user));
  dispatch(setIsAuthenticated(true));
}

// ── LOGIN ──────────────────────────────────────────────────────────────────
export const login = createAsyncThunk<
  LoginResponseProp & { redirectTo?: string },
  { email: string; password: string; returnUrl?: string }
>("/smilebaba/auth/login", async (userData, { dispatch }) => {
  try {
    dispatch(setIsAuthenticating(true));

    const response = await axiosInstance.post<any>(
      "/auth/login",
      { email: userData.email, password: userData.password },
    );

    const returnUrl =
      userData.returnUrl ||
      (typeof window !== "undefined"
        ? (new URLSearchParams(window.location.search).get("returnUrl") ?? "")
        : "");

    // Google Authenticator is on for this account → second step
    if (response.data?.requires2FA) {
      parkTwoFactorChallenge(response.data.challengeToken, returnUrl);
      return { ...response.data, requires2FA: true, redirectTo: "/auth/two-factor" };
    }

    completeLogin(dispatch, response.data);
    return { ...response.data, redirectTo: redirectFor(response.data.user?.role, returnUrl) };
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

// ── GOOGLE OAuth login ────────────────────────────────────────────────────
export const googleLogin = createAsyncThunk<
  LoginResponseProp & { redirectTo?: string; isNewUser?: boolean },
  string // Google ID token
>("auth/googleLogin", async (idToken, { dispatch }) => {
  try {
    dispatch(setIsAuthenticating(true));
    const response = await axiosInstance.post<LoginResponseProp>(
      "/auth/oauth/google",
      { idToken },
    );
    if ((response.data as any)?.requires2FA) {
      parkTwoFactorChallenge((response.data as any).challengeToken, null);
      return { ...(response.data as any), requires2FA: true, redirectTo: "/auth/two-factor" };
    }
    completeLogin(dispatch, response.data);
    return { ...response.data, redirectTo: redirectFor(response.data.user?.role, null) };
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



// ── FACEBOOK OAuth login ──────────────────────────────────────────────────
export const facebookLogin = createAsyncThunk<
  LoginResponseProp & { redirectTo?: string; isNewUser?: boolean },
  string // Facebook access token
>("auth/facebookLogin", async (accessToken, { dispatch }) => {
  try {
    dispatch(setIsAuthenticating(true));
    const response = await axiosInstance.post<LoginResponseProp>(
      "/auth/oauth/facebook",
      { accessToken },
    );
    if ((response.data as any)?.requires2FA) {
      parkTwoFactorChallenge((response.data as any).challengeToken, null);
      return { ...(response.data as any), requires2FA: true, redirectTo: "/auth/two-factor" };
    }
    completeLogin(dispatch, response.data);
    return { ...response.data, redirectTo: redirectFor(response.data.user?.role, null) };
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
// ── TWO-FACTOR: second step of login ──────────────────────────────────────
export const verifyTwoFactorLogin = createAsyncThunk<
  any,
  { code: string }
>("auth/verifyTwoFactorLogin", async ({ code }, { dispatch }) => {
  let parked: { challengeToken?: string; returnUrl?: string | null } = {};
  try {
    parked = JSON.parse(sessionStorage.getItem(TWO_FACTOR_KEY) ?? "{}");
  } catch {}
  if (!parked.challengeToken) {
    const err: any = new Error("Your sign-in timed out. Please sign in again.");
    err.code = "CHALLENGE_EXPIRED";
    throw err;
  }
  const response = await axiosInstance.post<any>("/auth/2fa/verify-login", {
    challengeToken: parked.challengeToken,
    code,
  });
  try {
    sessionStorage.removeItem(TWO_FACTOR_KEY);
  } catch {}
  completeLogin(dispatch, response.data);
  return { ...response.data, redirectTo: redirectFor(response.data.user?.role, parked.returnUrl) };
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
