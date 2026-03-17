import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "@/src/lib/api/axios";
import { useAppSelector } from "../app/redux";

export default function useAutoRefresh() {
  const token = useAppSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (!token) return;

    let timeout: NodeJS.Timeout;

    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp * 1000;

      const now = Date.now();
      const refreshTime = exp - now - 60 * 1000;

      if (refreshTime <= 0) return;

      timeout = setTimeout(async () => {
        try {
          await axiosInstance.post("/auth/refresh");
        } catch (err) {
          console.error("Silent refresh failed");
        }
      }, refreshTime);
    } catch (err) {
      console.error("Token decode error");
    }

    return () => clearTimeout(timeout);
  }, [token]);
}
