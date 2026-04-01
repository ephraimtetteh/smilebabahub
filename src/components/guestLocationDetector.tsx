"use client";

// src/components/GuestLocationDetector.tsx
// Fires once per browser session for every visitor.
// Reads their IP country from the backend → writes to Redux so all feeds
// show the right country (Ghana / Nigeria) and currency (GHS / NGN).
//
// Uses sessionStorage to prevent re-calling on every page navigation —
// the result is stable for the whole session.

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/redux";
import { setGuestLocation } from "../lib/features/auth/authSlice";
import axiosInstance from "@/src/lib/api/axios";

const SESSION_KEY = "smb_guest_country_detected";

export default function GuestLocationDetector() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((s) => s.auth.isAuthenticated);

  useEffect(() => {
    // Skip if logged in — their country comes from login/restoreSession
    if (isLoggedIn) return;

    // Skip if already detected this session
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      // sessionStorage blocked (private mode edge case) — just proceed
    }

    axiosInstance
      .get("/auth/guest-country")
      .then((res) => {
        const { country, currency } = res.data ?? {};
        if (country && currency) {
          dispatch(setGuestLocation({ country, currency }));
          try {
            sessionStorage.setItem(SESSION_KEY, "1");
          } catch {
            /* ignore */
          }
        }
      })
      .catch(() => {
        // Silently fall back to "Ghana" already in Redux initialState
      });
  }, [isLoggedIn]); // re-run if auth state changes (logout → check again)

  return null;
}
