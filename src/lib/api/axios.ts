import axios from "axios";
import { safeStorage } from "@/src/utils/safeStorage";

// In production: NEXT_PUBLIC_API_BASE_URL = https://smilebababackend.onrender.com/smilebaba
// In dev: direct to localhost:3001/smilebaba
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/smilebaba";

// The refresh token cookie is httpOnly and is set on the backend origin.
// When the frontend (localhost:3000) calls the backend (localhost:3001) directly,
// the browser blocks the cookie under SameSite rules.
// Solution: route the refresh call through the Next.js rewrite proxy (/api/*)
// so it appears same-origin to the browser and the cookie is forwarded.
// Always route refresh through /api/auth/refresh (Next.js rewrite proxy).
// In dev: Next.js proxies localhost:3000/api/* → localhost:3001/smilebaba/*
// In prod: Next.js proxies smilebabahub.com/api/* → smilebababackend.onrender.com/smilebaba/*
//
// Why this matters: the refreshToken cookie is set by the backend domain.
// When the browser calls the backend directly cross-origin, iOS Safari and
// some Android browsers block the cookie regardless of SameSite=None.
// Routing through the Next.js proxy makes the request appear same-origin,
// so the cookie is always forwarded and the backend receives it.
const REFRESH_URL = "/api/auth/refresh";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

// ── Request interceptor ────────────────────────────────────────────────────
// httpOnly cookies can't be read by JS in production, so we send
// the token via Authorization header from safeStorage on every request
axiosInstance.interceptors.request.use((config) => {
  const token = safeStorage.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ───────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          REFRESH_URL,
          {},
          { withCredentials: true },
        );
        const newToken = res.data.accessToken;

        safeStorage.set("accessToken", newToken);
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        safeStorage.remove("accessToken");

        // Only redirect in the browser — never during SSR
        if (typeof window !== "undefined") {
          const isProductRoute = originalRequest.url?.includes("/products");
          if (isProductRoute) {
            try {
              const draft = localStorage.getItem("sellFormDraft");
              if (draft) localStorage.setItem("pendingUpload", draft);
            } catch {}
            window.location.href = "/auth/login?reason=session_expired";
          } else {
            window.location.href = "/auth/login";
          }
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
