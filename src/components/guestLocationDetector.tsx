"use client";

// src/components/GuestLocationDetector.tsx
// Drop this inside <StoreProvider> in LayoutWrapper — already done.
// Fires once on mount for every visitor. Reads their IP country from the
// backend and writes it to Redux so feeds show the right country for guests.

import React, { useEffect } from "react";
import { useAppDispatch } from "../app/redux";
import { setGuestLocation } from "../lib/features/auth/authSlice";
import axiosInstance from "@/src/lib/api/axios";

export default function GuestLocationDetector() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    axiosInstance
      .get("/auth/guest-country")
      .then((res) => {
        const { country, currency } = res.data ?? {};
        if (country && currency) {
          dispatch(setGuestLocation({ country, currency }));
        }
      })
      .catch(() => {
        // Silently fall back to "Ghana" already in Redux initialState
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
