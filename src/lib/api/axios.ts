import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { safeStorage } from "@/src/utils/safeStorage";

// ── Two base URLs ──────────────────────────────────────────────────────────
//
// DIRECT_API  — non-auth requests. Straight to the Express backend.
// PROXY_BASE  — all auth requests, through the Next.js /api/* rewrite, so
//               the refreshToken cookie is set on the frontend domain
//               rather than the backend's.
//
// If login hits the backend directly, the browser stores the cookie on
// smilebababackend.onrender.com. A later call to /api/auth/refresh on
// smilebabahub.com won't send it — different domain, 401 every time.
// Routing auth through /api/* makes both look like the same origin.

const DIRECT_API =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/smilebaba";

const PROXY_BASE = "";

const AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/logout",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-otp",
  "/auth/resend-otp",
  "/auth/me",
  "/auth/guest-country",
];

const REFRESH_URL = "/api/auth/refresh";

/**
 * Strings localStorage happily stores when handed undefined or null.
 *
 * This is the bug that caused the refresh storm. `safeStorage.set(key,
 * undefined)` writes the literal "undefined", which is truthy on the way
 * back out — so every request sent `Authorization: Bearer undefined`,
 * got a 401, refreshed successfully, stored "undefined" again, and went
 * round forever.
 */
const JUNK = new Set(["undefined", "null", "", "false"]);

function readToken(): string | null {
  const raw = safeStorage.get("accessToken");
  if (!raw || JUNK.has(raw.trim())) return null;
  return raw;
}

function writeToken(value: unknown): boolean {
  if (typeof value !== "string" || JUNK.has(value.trim())) {
    // Never store junk. A refresh that returns 200 with no token is a
    // failed refresh, whatever the status code says.
    safeStorage.remove("accessToken");
    return false;
  }
  safeStorage.set("accessToken", value);
  return true;
}

const axiosInstance = axios.create({
  baseURL: DIRECT_API,
  withCredentials: true,
});

// ── Request ────────────────────────────────────────────────────────────────
axiosInstance.interceptors.request.use((config) => {
  const token = readToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Make sure a stale header from a cloned config can't survive
    delete config.headers.Authorization;
  }

  // Auth paths go through the Next.js proxy
  const url = config.url ?? "";
  if (AUTH_PATHS.some((p) => url.startsWith(p))) {
    config.baseURL = PROXY_BASE;
    config.url = `/api${url.startsWith("/") ? "" : "/"}${url}`;
  }

  return config;
});

// ── Response ───────────────────────────────────────────────────────────────
type Queued = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

let isRefreshing = false;
let queue: Queued[] = [];

/**
 * Circuit breaker.
 *
 * The _retry flag stops one request looping, but it can't stop fifty
 * different requests each getting their own refresh. If refresh keeps
 * "succeeding" without producing a usable token, that's a broken session
 * and hammering the endpoint won't fix it.
 *
 * Three attempts inside thirty seconds and we stop trying.
 */
const MAX_ATTEMPTS = 3;
const WINDOW_MS = 30_000;

let attempts = 0;
let windowStartedAt = 0;

function overBudget(): boolean {
  const now = Date.now();
  if (now - windowStartedAt > WINDOW_MS) {
    windowStartedAt = now;
    attempts = 0;
  }
  attempts += 1;
  return attempts > MAX_ATTEMPTS;
}

function drain(error: unknown, token: string | null) {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token as string)));
  queue = [];
}

/** Clear the session and send them to sign in — once. */
function endSession(reason: string) {
  safeStorage.remove("accessToken");

  if (typeof window === "undefined") return;

  // Already on an auth page? Redirecting would reload it forever.
  if (window.location.pathname.startsWith("/auth/")) return;

  const returnUrl = encodeURIComponent(
    window.location.pathname + window.location.search,
  );
  window.location.href = `/auth/login?reason=${reason}&returnUrl=${returnUrl}`;
}

axiosInstance.interceptors.response.use(
  (response) => {
    // A good response means the session is healthy — reset the breaker
    // so a later blip gets its full three attempts
    attempts = 0;
    return response;
  },

  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!original || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Never try to refresh a refresh, or a login
    const url = original.url ?? "";
    if (url.includes("/auth/refresh") || url.includes("/auth/login")) {
      return Promise.reject(error);
    }

    if (original._retry) {
      // Already retried once with a fresh token and still 401. The token
      // isn't the problem — stop.
      endSession("session_expired");
      return Promise.reject(error);
    }

    // Nothing to refresh with, and no cookie will help if we've already
    // been told we're unauthenticated
    if (overBudget()) {
      console.warn("[axios] refresh budget exhausted — ending session");
      endSession("session_expired");
      return Promise.reject(error);
    }

    // A refresh is in flight — wait for it rather than starting another
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token) => {
            original._retry = true;
            original.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(original));
          },
          reject,
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      // Bare axios on purpose — going through axiosInstance would run
      // these interceptors again and recurse
      const res = await axios.post(REFRESH_URL, {}, { withCredentials: true });

      const token = res?.data?.accessToken;

      // The bug that started all this: a 200 with no token is a failed
      // refresh. Treat it as one instead of storing "undefined".
      if (!writeToken(token)) {
        throw new Error("Refresh returned no access token");
      }

      drain(null, token);
      original.headers.Authorization = `Bearer ${token}`;
      return axiosInstance(original);
    } catch (err) {
      drain(err, null);
      endSession("session_expired");
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
