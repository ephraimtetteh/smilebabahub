import axios from "axios";
import { safeStorage } from "@/src/utils/safeStorage";

const axiosInstance = axios.create({
  baseURL: "/api",
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
        const res = await axiosInstance.post("/auth/refresh");
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
