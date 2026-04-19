import axios from "axios";
import { safeStorage } from "@/src/utils/safeStorage";

// ── Two base URLs ──────────────────────────────────────────────────────────
//
// DIRECT_API  — used for non-auth requests (products, ads, etc.)
//               Goes straight to the Express backend.
//               Cookies from this domain are NOT needed for these requests.
//
// PROXY_BASE  — used for ALL auth requests (login, refresh, logout, register)
//               Goes through the Next.js /api/* rewrite proxy.
//               This ensures the refreshToken cookie is set on the FRONTEND
//               domain (smilebabahub.com), not the backend domain
//               (smilebababackend.onrender.com).
//
// WHY THIS MATTERS:
//   If login hits the backend directly, the browser stores the cookie on
//   smilebababackend.onrender.com. Later when we call /api/auth/refresh
//   on smilebabahub.com (Vercel), the browser won't send that cookie —
//   it belongs to a different domain. Result: 401 on every refresh.
//
//   Routing auth through /api/* makes the browser believe it's talking to
//   smilebabahub.com for both login AND refresh, so the cookie round-trips.

const DIRECT_API =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/smilebaba";

// In dev: proxy base = "" (calls /api/* on localhost:3000, rewrites to :3001)
// In prod: proxy base = "" (calls /api/* on smilebabahub.com, Vercel proxies to Render)
const PROXY_BASE = "";

// Auth endpoints always go through the Next.js proxy
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

// Refresh always goes through proxy
const REFRESH_URL = "/api/auth/refresh";

const axiosInstance = axios.create({
  baseURL: DIRECT_API,
  withCredentials: true,
});

// ── Request interceptor ────────────────────────────────────────────────────
// 1. Attach the Bearer token from safeStorage on every request
// 2. Re-route auth calls through the /api/* proxy so cookies are set on
//    the frontend domain
axiosInstance.interceptors.request.use((config) => {
  const token = safeStorage.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Re-route auth paths through the Next.js proxy
  const url = config.url ?? "";
  const isAuthPath = AUTH_PATHS.some((p) => url.startsWith(p));

  if (isAuthPath) {
    // Strip the direct baseURL — use the proxy instead
    // /auth/login → /api/auth/login (handled by next.config.js rewrite)
    config.baseURL = PROXY_BASE;
    config.url = `/api${url.startsWith("/") ? "" : "/"}${url}`;
  }

  return config;
});

// ── Response interceptor ───────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
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
        // Always use the proxy URL so the cookie is sent to the same domain
        const res = await axios.post(
          REFRESH_URL,
          {},
          { withCredentials: true },
        );
        const newToken = res.data.accessToken;

        safeStorage.set("accessToken", newToken);
        processQueue(null, newToken);

        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(original);
      } catch (err) {
        processQueue(err, null);
        safeStorage.remove("accessToken");

        if (typeof window !== "undefined") {
          const returnUrl = encodeURIComponent(
            window.location.pathname + window.location.search,
          );
          window.location.href = `/auth/login?reason=session_expired&returnUrl=${returnUrl}`;
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
