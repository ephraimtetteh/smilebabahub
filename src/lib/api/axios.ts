import axios from "axios";


const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});



axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post("/auth/refresh");

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);




export default axiosInstance;