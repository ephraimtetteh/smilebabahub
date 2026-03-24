import axios from "axios";
import { safeStorage } from "@/src/utils/safeStorage";

const axiosInstance = axios.create({
  // ✅ Point directly to Express — NOT "/api" (that's Next.js)
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/smilebaba",
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
// Reads the token fresh from safeStorage on every request so we always
// send the latest token (critical after a refresh)
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
      // Queue concurrent requests while refresh is in progress
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
        const res = await axiosInstance.post("/auth/refresh");
        const newAccessToken = res.data.accessToken;

        // ✅ Save first — request interceptor will pick it up on retry
        safeStorage.set("accessToken", newAccessToken);

        processQueue(null, newAccessToken);

        // ✅ Also set explicitly on the retried request as a safety net
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

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
