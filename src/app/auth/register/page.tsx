"use client";

// client/src/app/auth/register/page.tsx
//
// ─── SAME BUG AS LOGIN, SAME FIX ─────────────────────────────────────
//
// The register thunk sets the user and isAuthenticated, but — unlike
// login — it does NOT store an access token, because /auth/register
// doesn't return one:
//
//     res.status(200).json({ message, user: serializeUser(...) })
//
// No accessToken, no cookies set. So a freshly registered user has a
// Redux session and nothing to authenticate with. Every request 401s,
// the interceptor refreshes, and there's no refreshToken cookie either.
//
// That's why registration used to be followed immediately by a login
// call in the old AuthRegister component. It looked redundant and it
// wasn't — it's what actually signs them in.
//
// So this registers, then logs in with the same credentials, and lets
// the login thunk store the token. One extra round trip, and the only
// version that works without changing the backend.
//
// ─── WHY PHONE AND COUNTRY ARE HERE ──────────────────────────────────
//
// The app collects them. Without them, the same question gets asked
// again at checkout, at Send Money, and at onboarding step 2 — and
// getAds falls back to Ghana, so a Nigerian's first visit shows cedis.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  Check,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { register, login } from "@/src/lib/features/auth/authActions";
import { clearPendingRedirect } from "@/src/lib/features/auth/authSlice";

const YELLOW = "#FFC105";

const COUNTRIES = [
  {
    value: "Ghana",
    label: "Ghana",
    dial: "+233",
    flag: "🇬🇭",
    sample: "024 123 4567",
  },
  {
    value: "Nigeria",
    label: "Nigeria",
    dial: "+234",
    flag: "🇳🇬",
    sample: "0801 234 5678",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useSearchParams();

  const { isAuthenticated, isAuthenticating, hasCheckedAuth } = useAppSelector(
    (s) => s.auth,
  );

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Ghana");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const picked = COUNTRIES.find((c) => c.value === country) ?? COUNTRIES[0];

  const returnUrl =
    params.get("returnUrl") ??
    (typeof window !== "undefined"
      ? localStorage.getItem("redirectAfterLogin")
      : null) ??
    null;

  // Only once the auth check has finished — reacting to isAuthenticated
  // alone fires during restoreSession
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
  const phoneOk = phone.replace(/\D/g, "").length >= 9;
  const pwOk = password.length >= 8;
  const nameOk = username.trim().length >= 2;

  const canSubmit =
    nameOk && emailOk && phoneOk && pwOk && agreed && !submitting;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError("");

    const creds = {
      email: email.trim().toLowerCase(),
      password,
    };

    try {
      await dispatch(
        register({
          username: username.trim(),
          phone: phone.trim(),
          ...creds,
        }) as any,
      ).unwrap();
    } catch (err: any) {
      setError(
        typeof err === "string"
          ? err
          : (err?.message ??
              "We couldn't create your account. Please try again."),
      );
      setSubmitting(false);
      return;
    }

    try {
      // /auth/register returns a user but no token, so this is what
      // actually signs them in. The login thunk stores the access token
      // and sets the cookies.
      const result = await dispatch(
        login({ ...creds, returnUrl: returnUrl ?? undefined }),
      ).unwrap();

      localStorage.removeItem("redirectAfterLogin");
      dispatch(clearPendingRedirect());
      router.replace((result as any)?.redirectTo ?? returnUrl ?? "/");
    } catch {
      // The account exists — that part worked. Send them to sign in
      // rather than leaving them on a form that would now say the email
      // is taken.
      setError(
        "Your account was created, but we couldn't sign you in automatically. Please sign in.",
      );
      setSubmitting(false);
      setTimeout(() => router.replace("/auth/login"), 2200);
    }
  };

  if (!hasCheckedAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 size={26} className="animate-spin text-amber-400" />
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
            Create your account
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Buy, sell, book stays and send money across Ghana and Nigeria.
          </p>

          <form onSubmit={submit} className="mt-6">
            <Field
              label="Your name"
              value={username}
              onChange={setUsername}
              placeholder="Kwame Mensah"
              autoComplete="name"
            />

            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
              invalid={!!email && !emailOk}
              hint={
                email && !emailOk ? "That email doesn't look right." : undefined
              }
            />

            {/* Country sets the currency and the whole feed, so it gets
                its own row rather than being buried in a select */}
            <div className="mt-4">
              <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
                Country
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {COUNTRIES.map((c) => {
                  const on = country === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCountry(c.value)}
                      className={`flex items-center gap-2.5 rounded-2xl border p-3 transition ${
                        on
                          ? "border-amber-400 bg-amber-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <span className="text-xl">{c.flag}</span>
                      <span className="flex-1 text-left">
                        <span className="block text-sm font-semibold text-gray-900">
                          {c.label}
                        </span>
                        <span className="block text-[11px] text-gray-400">
                          {c.dial}
                        </span>
                      </span>
                      {on && <Check size={15} className="text-amber-600" />}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-[11.5px] text-gray-400">
                Sets your currency and the listings you see. Change it any time.
              </p>
            </div>

            <Field
              label="Phone number"
              type="tel"
              value={phone}
              onChange={setPhone}
              placeholder={picked.sample}
              autoComplete="tel"
              invalid={!!phone && !phoneOk}
              hint="Buyers only see this after they order from you."
            />

            <div className="mt-4">
              <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
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
              {password && !pwOk && (
                <p className="mt-1.5 text-[11.5px] text-red-600">
                  Use at least 8 characters.
                </p>
              )}
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-amber-400"
              />
              <span className="text-[12.5px] leading-relaxed text-gray-600">
                I agree to the{" "}
                <Link
                  href="/legal/terms"
                  className="font-semibold text-gray-900 underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/legal/privacy"
                  className="font-semibold text-gray-900 underline"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

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
                  Creating your account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-[13.5px] text-gray-500">
            Already have an account?{" "}
            <Link
              href={`/auth/login${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`}
              className="font-bold text-gray-900"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-white p-4">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-600" />
          <p className="text-[12px] leading-relaxed text-gray-500">
            Your account is free. Selling is free to start too — we take 5% only
            when you make a sale, and nothing up front.
          </p>
        </div>
      </div>
    </main>
  );
}

// ─── Field ───────────────────────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
  invalid,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
  invalid?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="mt-4">
      <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`h-12 w-full rounded-2xl border px-4 text-[15px] text-gray-900 outline-none transition ${
          invalid
            ? "border-red-300 focus:border-red-400"
            : "border-gray-200 focus:border-gray-400"
        }`}
      />
      {hint && (
        <p
          className={`mt-1.5 text-[11.5px] ${invalid ? "text-red-600" : "text-gray-400"}`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
