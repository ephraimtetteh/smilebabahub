"use client";

// src/components/GuestLocationDetector.tsx
// Detects the visitor's country from IP and writes it to Redux.
//
// Key behaviours:
//  - Skips if user is logged in (their country comes from login response)
//  - Only caches the result in sessionStorage when geo actually succeeded
//    (detected: true) — failed/fallback results are retried on next load
//  - Stores the detected country so we can verify it wasn't a bad fallback
//  - 4s timeout on the backend Geoapify call prevents hanging during CPU spikes

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/redux";
import { setGuestLocation } from "../lib/features/auth/authSlice";
import axiosInstance from "@/src/lib/api/axios";

const SESSION_KEY = "smb_geo"; // stores { country, currency }
const SESSION_DONE = "smb_geo_ok"; // set only when detected: true

function readCache(): { country: string; currency: string } | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(country: string, currency: string) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ country, currency }));
    sessionStorage.setItem(SESSION_DONE, "1");
  } catch {
    /* ignore */
  }
}

function cacheIsGood(): boolean {
  try {
    return sessionStorage.getItem(SESSION_DONE) === "1";
  } catch {
    return false;
  }
}

export default function GuestLocationDetector() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((s) => s.auth.isAuthenticated);

  useEffect(() => {
    // Logged-in users get country from login/restoreSession — skip
    if (isLoggedIn) return;

    // If we already have a confirmed-good detection this session, rehydrate
    // from cache and skip the network call
    if (cacheIsGood()) {
      const cached = readCache();
      if (cached?.country && cached?.currency) {
        dispatch(setGuestLocation(cached));
        return;
      }
    }

    // Otherwise call the backend — it returns detected: false when geo fails
    // (CPU spike, Geoapify timeout, etc.) so we know not to cache it
    axiosInstance
      .get("/auth/guest-country")
      .then((res) => {
        const { country, currency, detected } = res.data ?? {};

        if (country && currency) {
          dispatch(setGuestLocation({ country, currency }));

          // Only persist to sessionStorage when geo actually worked
          // detected: false means it fell back to Ghana — don't cache
          if (detected !== false) {
            writeCache(country, currency);
          }
        }
      })
      .catch(() => {
        // Network error — dispatch nothing, stay on Redux initialState (Ghana)
        // No cache write — will retry on next page load
      });
  }, [isLoggedIn, dispatch]);

  return null;
}
