"use client";

// client/src/app/auth/login/page.tsx
//
// ─── THE LOOP THIS FIXES ─────────────────────────────────────────────
//
// My previous version called axiosInstance.post("/auth/login") directly
// and dispatched setUser. The login thunk does four things:
//
//     safeStorage.set("accessToken", …)   ← stores the token
//     dispatch(setAccessToken(…))
//     dispatch(setUser(…))
//     dispatch(setIsAuthenticated(true))  ← flips the flag
//
// I did one. So no token was stored and isAuthenticated stayed false.
//
// Two things broke as a result:
//
//   · Every request after login went out with no Authorization header,
//     got a 401, triggered a refresh, retried, 401 again. That's the
//     storm on /money/send, which calls an authenticated endpoint the
//     moment it loads.
//
//   · isAuthenticated never flipped, so the Send Money gate fired again
//     and pushed straight back here.
//
// ─── AND THE SECOND CONFLICT ─────────────────────────────────────────
//
// login.fulfilled sets pendingRedirect, which AuthRedirect consumes and
// navigates on. My page navigated too. Two redirects racing over the
// same moment, and whichever lost sometimes sent people back.
//
// This page now uses the thunk and clears pendingRedirect before
// navigating itself, so exactly one thing decides where you land.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { login } from "@/src/lib/features/auth/authActions";
import { clearPendingRedirect } from "@/src/lib/features/auth/authSlice";

const YELLOW = "#FFC105";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useSearchParams();

  const { isAuthenticated, isAuthenticating, hasCheckedAuth } = useAppSelector(
    (s) => s.auth,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reason = params.get("reason");

  /** Query param first, then whatever a gate stored on the way here. */
  const returnUrl =
    params.get("returnUrl") ??
    (typeof window !== "undefined"
      ? localStorage.getItem("redirectAfterLogin")
      : null) ??
    null;

  /**
   * Bounce an already-signed-in visitor — but only once the auth check
   * has actually finished. Reacting to isAuthenticated alone fires
   * during restoreSession, which is how a signed-in user ended up here
   * and then got sent away mid-render.
   */
  useEffect(() => {
    if (!hasCheckedAuth || isAuthenticating) return;
    if (!isAuthenticated) return;

    localStorage.removeItem("redirectAfterLogin");
    dispatch(clearPendingRedirect());
    router.replace(returnUrl ?? "/");
  }, [
    hasCheckedAuth,
    isAuthenticating,
    isAuthenticated,
    returnUrl,
    dispatch,
    router,
  ]);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = emailOk && password.length > 0 && !submitting;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError("");

    try {
      // The thunk, not a bare axios call. It stores the token, sets
      // isAuthenticated, and returns where to go.
      const result = await dispatch(
        login({
          email: email.trim().toLowerCase(),
          password,
          returnUrl: returnUrl ?? undefined,
        }),
      ).unwrap();

      localStorage.removeItem("redirectAfterLogin");

      // The thunk already worked out redirectTo from returnUrl and role.
      // Clearing pendingRedirect stops AuthRedirect navigating as well —
      // two redirects racing is how people ended up back here.
      dispatch(clearPendingRedirect());
      router.replace((result as any)?.redirectTo ?? returnUrl ?? "/");
    } catch (err: any) {
      const status = err?.response?.status;
      setError(
        status === 400 || status === 401
          ? "That email and password don't match. Try again."
          : (err?.response?.data?.message ??
              err?.message ??
              "We couldn't sign you in. Please try again."),
      );
      setSubmitting(false);
    }
  };

  // Don't flash a login form at someone who's already signed in
  if (!hasCheckedAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 size={26} className="animate-spin text-amber-400" />
      </main>
    );
  }

  const subtitle =
    reason === "sell"
      ? "Sign in to post your listing."
      : reason === "session_expired"
        ? "Your session expired. Sign in to pick up where you left off."
        : returnUrl?.startsWith("/money")
          ? "Sign in to send money."
          : returnUrl?.startsWith("/cart")
            ? "Sign in to check out."
            : returnUrl?.startsWith("/chat")
              ? "Sign in to message this seller."
              : "Sign in to your account.";

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
            {subtitle}
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

        {reason === "session_expired" && (
          <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-white p-4">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-gray-400" />
            <p className="text-[12px] leading-relaxed text-gray-500">
              We sign you out after a while of inactivity. Nothing was lost —
              your cart and listings are exactly where you left them.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
