"use client";
// src/lib/referral/ReferralCapture.tsx
//
// Marketer referral links, on every page:
//   · A ?ref=<code> in any URL (old emails used /subscribe?ref=…) is saved.
//   · /r/<code> saves it too (see app/r/[code]/page.tsx).
//   · Once the person is signed in, the saved code is sent to the server
//     ONCE (POST /marketers/referral/claim) and forgotten. The server
//     applies the rules: first referral wins, no self-referral, only
//     before the first paid plan.
// Kept for 30 days.

import { useEffect } from "react";
import { useAppSelector } from "@/src/app/redux";
import axiosInstance from "@/src/lib/api/axios";

const KEY = "sb.ref";
const MAX_AGE_MS = 30 * 24 * 3600 * 1000;
const VALID = /^[A-Za-z0-9-]{4,32}$/;

export function savePendingReferral(code: string) {
  if (!VALID.test(code)) return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ code: code.toUpperCase(), at: Date.now() }));
  } catch {}
}

export function readPendingReferral(): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const { code, at } = JSON.parse(raw);
    if (!code || Date.now() - Number(at) > MAX_AGE_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return String(code);
  } catch {
    return null;
  }
}

export function clearPendingReferral() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

export default function ReferralCapture() {
  const isAuthenticated = useAppSelector((s: any) => s.auth?.isAuthenticated);

  // Save ?ref= from any page
  useEffect(() => {
    try {
      const ref = new URLSearchParams(window.location.search).get("ref");
      if (ref) savePendingReferral(ref);
    } catch {}
  }, []);

  // Apply once signed in
  useEffect(() => {
    if (!isAuthenticated) return;
    const code = readPendingReferral();
    if (!code) return;
    axiosInstance
      .post("/marketers/referral/claim", { ref: code, source: "link" })
      .catch(() => {})
      .finally(clearPendingReferral);
  }, [isAuthenticated]);

  return null;
}
