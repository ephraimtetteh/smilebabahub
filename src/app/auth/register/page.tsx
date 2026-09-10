"use client";

// client/app/auth/register/page.tsx
//
// Create account.
//
// ─── WHAT CHANGED ────────────────────────────────────────────────────
//
// The app collects username, email, phone, country and password. The web
// form was collecting fewer, which meant a web signup produced a user
// with no phone and no country — and then:
//
//   · Checkout asks for a phone anyway, so they type it there instead
//   · Send Money blocks on missing details and opens its own modal
//   · Onboarding step 2 asks for it a third time
//   · getAds falls back to Ghana, so a Nigerian sees Ghanaian listings
//     priced in cedis on their very first visit
//
// Asking once here removes all four. Phone and country are two fields
// and both are things people know without looking anything up.
//
// ─── STEP 1 OF THE ONBOARDING FLOW ───────────────────────────────────
//
// This screen is "Create Account" in the vendor onboarding sequence.
// Nothing here mentions selling — most people signing up are buyers, and
// asking a buyer for a business name is how you lose them. The vendor
// path opens later, when they tap Post Ad.

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
import { setUser } from "@/src/lib/features/auth/authSlice";
import axiosInstance from "@/src/lib/api/axios";

const NAVY = "#0B2A63";
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
  const { isAuthenticated } = useAppSelector((s) => s.auth);

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

  /** Where to go afterwards. A query param wins over anything stored. */
  const returnUrl =
    params.get("returnUrl") ??
    (typeof window !== "undefined"
      ? localStorage.getItem("redirectAfterLogin")
      : null) ??
    "/";

  // Already signed in — no reason to show them a signup form
  useEffect(() => {
    if (isAuthenticated) router.replace(returnUrl);
  }, [isAuthenticated, returnUrl, router]);

  // ─── Validation ───────────────────────────────────────────────────
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

    try {
      const { data } = await axiosInstance.post("/auth/register", {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim(),
        country,
      });

      if (data?.user) dispatch(setUser(data.user));

      localStorage.removeItem("redirectAfterLogin");
      router.replace(returnUrl);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "We couldn't create your account. Please try again.",
      );
    } finally {
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
              hint={
                email && !emailOk ? "That email doesn't look right." : undefined
              }
              invalid={!!email && !emailOk}
            />

            {/* ─── Country ─── */}
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
              {/* Country sets the currency and which listings they see, so
                  it earns its own row rather than being buried in a select */}
              <p className="mt-1.5 text-[11.5px] text-gray-400">
                Sets your currency and the listings you see. You can change it
                any time.
              </p>
            </div>

            <Field
              label="Phone number"
              type="tel"
              value={phone}
              onChange={setPhone}
              placeholder={picked.sample}
              autoComplete="tel"
              hint="Buyers only see this after they order from you."
              invalid={!!phone && !phoneOk}
            />

            {/* ─── Password ─── */}
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

            {/* ─── Terms ─── */}
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
              className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-bold transition"
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
              href={`/auth/login${returnUrl !== "/" ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`}
              className="font-bold text-gray-900"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Not a sales pitch — just what the account is for */}
        <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-white p-4">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-600" />
          <p className="text-[12px] leading-relaxed text-gray-500">
            Your account is free. Selling is free to start too — we take 5% only
            when you make a sale, and never anything up front.
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
          className={`mt-1.5 text-[11.5px] ${
            invalid ? "text-red-600" : "text-gray-400"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
