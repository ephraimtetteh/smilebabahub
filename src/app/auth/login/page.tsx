"use client";

// client/app/auth/login/page.tsx
//
// Sign in.
//
// ─── WHAT IT HAS TO GET RIGHT ────────────────────────────────────────
//
// Everything that gates on auth sends people here with somewhere to
// return to — Post Ad, Send Money, chat, checkout. If this page ignores
// that and drops everyone on the homepage, each of those flows costs the
// user a second attempt to find their way back.
//
// So returnUrl is read from three places, in order of how specific they
// are: the query param, then localStorage, then a sensible default based
// on who they turn out to be.
//
// ─── AND ONE PROMISE IT KEEPS ────────────────────────────────────────
//
// The account-deletion emails say that signing in cancels a pending
// request. The backend does that in cancelDeletionOnLogin. If someone
// signs in during their grace period, this page tells them it worked —
// otherwise they have no way of knowing whether the promise held.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { setUser } from "@/src/lib/features/auth/authSlice";
import axiosInstance from "@/src/lib/api/axios";

const YELLOW = "#FFC105";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useSearchParams();
  const { isAuthenticated, isAuthenticating } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deletionCancelled, setCancelled] = useState(false);

  /** Query param wins, then anything a gate stored on the way here. */
  const returnUrl =
    params.get("returnUrl") ??
    (typeof window !== "undefined"
      ? localStorage.getItem("redirectAfterLogin")
      : null) ??
    null;

    useEffect(() => {
      if (isAuthenticating) return;
      if (isAuthenticated) router.replace(returnUrl ?? "/");
    }, [isAuthenticated, isAuthenticating, returnUrl, router]);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = emailOk && password.length > 0 && !submitting;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError("");

    try {
      const { data } = await axiosInstance.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      const user = data?.user;
      if (user) dispatch(setUser(user));

      localStorage.removeItem("redirectAfterLogin");

      // The deletion emails promise that signing in cancels the request.
      // Say so, rather than leaving them to hope.
      if (user?.deletionRequestedAt || data?.deletionCancelled) {
        setCancelled(true);
        setTimeout(() => router.replace(returnUrl ?? "/"), 2600);
        return;
      }

      // Vendors go to their dashboard unless they were headed somewhere
      // specific — which is the whole point of returnUrl
      const destination =
        returnUrl ??
        (user?.role === "admin"
          ? "/admin"
          : user?.role === "vendor"
            ? "/vendor/dashboard"
            : "/");

      router.replace(destination);
    } catch (err: any) {
      const status = err?.response?.status;
      setError(
        status === 400 || status === 401
          ? "That email and password don't match. Try again."
          : (err?.response?.data?.message ??
              "We couldn't sign you in. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Deletion cancelled ───────────────────────────────────────────
  if (deletionCancelled) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-5">
        <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <ShieldCheck size={28} className="text-emerald-600" />
          </div>
          <h1 className="mt-5 text-xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
            Your account deletion request has been cancelled. Everything is
            exactly where you left it.
          </p>
          <p className="mt-4 text-[13px] text-gray-400">Taking you through…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-12">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          Smile<span className="text-amber-400">Baba</span>Hub
        </Link>

        <div className="mt-7 rounded-3xl border border-gray-100 bg-white p-7">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            {returnUrl && returnUrl.startsWith("/sell")
              ? "Sign in to post your listing."
              : returnUrl && returnUrl.startsWith("/money")
                ? "Sign in to send money."
                : returnUrl && returnUrl.startsWith("/chat")
                  ? "Sign in to message this seller."
                  : "Sign in to your account."}
          </p>

          <form onSubmit={submit} className="mt-6">
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
                className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-[15px] text-gray-900 outline-none transition focus:border-gray-400"
              />
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-[13px] font-semibold text-gray-700">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[12.5px] font-semibold text-gray-500 transition hover:text-gray-900"
                >
                  Forgot?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
                  className="h-12 w-full rounded-2xl border border-gray-200 pl-4 pr-12 text-[15px] text-gray-900 outline-none transition focus:border-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

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
              {submitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-[13.5px] text-gray-500">
            New to SmileBaba?{" "}
            <Link
              href={`/auth/register${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`}
              className="font-bold text-gray-900"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
