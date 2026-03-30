// src/hooks/useAdmin.ts
// Shared data-fetching hook for all admin pages.
// Wraps axiosInstance calls to /admin/* endpoints.

"use client";

import { useState, useCallback } from "react";
import axiosInstance from "@/src/lib/api/axios";

type Params = Record<string, string | number | undefined>;

function buildQuery(params: Params = {}): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") q.set(k, String(v));
  });
  const str = q.toString();
  return str ? `?${str}` : "";
}

export function useAdmin<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(
    async (params?: Params) => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(
          `/admin/${endpoint}${buildQuery(params)}`,
        );
        setData(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? "Failed to load data");
      } finally {
        setLoading(false);
      }
    },
    [endpoint],
  );

  const patch = useCallback(
    async (id: string, sub: string, body: object) => {
      await axiosInstance.patch(`/admin/${endpoint}/${id}/${sub}`, body);
    },
    [endpoint],
  );

  return { data, loading, error, fetch, patch };
}
