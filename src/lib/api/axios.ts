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
const REFRESH_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "/api/auth/refresh" // dev — goes through Next.js proxy, cookie forwarded
    : `${API_BASE}/auth/refresh`; // prod — same domain, cookie works directly

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

        const isProductRoute = originalRequest.url?.includes("/products");
        if (isProductRoute) {
          const draft = localStorage.getItem("sellFormDraft");
          if (draft) localStorage.setItem("pendingUpload", draft);
          window.location.href = "/auth/login?reason=session_expired";
        } else {
          window.location.href = "/auth/login";
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
