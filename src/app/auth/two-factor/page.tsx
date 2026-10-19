"use client";

// src/app/auth/two-factor/page.tsx
//
// Second step of sign-in for accounts with Google Authenticator on.
// The login page parks a 5-minute challenge in sessionStorage; this page
// sends it back with the 6-digit code (or a backup code).

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, KeyRound } from "lucide-react";
import { useAppDispatch } from "@/src/app/redux";
import {
  verifyTwoFactorLogin,
  TWO_FACTOR_KEY,
} from "@/src/lib/features/auth/authActions";
import { clearPendingRedirect } from "@/src/lib/features/auth/authSlice";

const YELLOW = "#FFC105";

export default function TwoFactorPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [code, setCode] = useState("");
  const [useBackup, setUseBackup] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasChallenge, setHasChallenge] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const parked = JSON.parse(sessionStorage.getItem(TWO_FACTOR_KEY) ?? "{}");
      const fresh = parked.challengeToken && Date.now() - (parked.at ?? 0) < 5 * 60 * 1000;
      setHasChallenge(!!fresh);
    } catch {
      setHasChallenge(false);
    }
  }, []);

  const clean = useBackup
    ? code.toUpperCase().replace(/[^A-Z0-9]/g, "")
    : code.replace(/\D/g, "");
  const canSubmit = (useBackup ? clean.length === 8 : clean.length === 6) && !submitting;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const result = await dispatch(verifyTwoFactorLogin({ code: clean })).unwrap();
      dispatch(clearPendingRedirect());
      router.replace(result?.redirectTo ?? "/");
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message ?? err?.message;
      if (status === 401 || err?.code === "CHALLENGE_EXPIRED") {
        setHasChallenge(false);
      }
      setError(
        status === 429
          ? "Too many wrong codes. Wait 15 minutes, then sign in again."
          : (msg ?? "That code didn't work. Try again."),
      );
      setCode("");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-12">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          Smile<span className="text-amber-400">Baba</span>Hub
        </Link>

        <div className="mt-7 rounded-3xl border border-gray-100 bg-white p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50">
            {useBackup ? (
              <KeyRound size={22} className="text-amber-600" />
            ) : (
              <ShieldCheck size={22} className="text-amber-600" />
            )}
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            {useBackup ? "Use a backup code" : "Two-step verification"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            {useBackup
              ? "Enter one of the 8-character backup codes you saved when you turned on two-step verification. Each code works once."
              : "Open Google Authenticator on your phone and enter the 6-digit code for SmileBaba Hub."}
          </p>

          {hasChallenge === false ? (
            <div className="mt-6">
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[13px] leading-relaxed text-amber-900">
                {error || "Your sign-in timed out (it lasts 5 minutes)."} Please sign in again.
              </p>
              <Link
                href="/auth/login"
                className="mt-4 flex h-12 w-full items-center justify-center rounded-2xl text-[15px] font-bold text-gray-900"
                style={{ background: YELLOW }}
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode={useBackup ? "text" : "numeric"}
                autoComplete="one-time-code"
                autoFocus
                maxLength={useBackup ? 9 : 7}
                placeholder={useBackup ? "XXXX-XXXX" : "123 456"}
                className="h-14 w-full rounded-2xl border border-gray-200 px-4 text-center text-2xl font-bold tracking-[0.3em] text-gray-900 outline-none transition focus:border-gray-400"
              />

              {error && (
                <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] leading-relaxed text-red-800">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-bold transition"
                style={{
                  height: 52,
                  background: canSubmit ? YELLOW : "#F3F4F6",
                  color: canSubmit ? "#111827" : "#9CA3AF",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                }}
              >
                {submitting ? <Loader2 size={17} className="animate-spin" /> : "Verify and sign in"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setUseBackup((v) => !v);
                  setCode("");
                  setError("");
                }}
                className="mt-4 w-full text-center text-[13px] font-semibold text-gray-500 hover:text-gray-900"
              >
                {useBackup ? "Use my authenticator app instead" : "Lost your phone? Use a backup code"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
