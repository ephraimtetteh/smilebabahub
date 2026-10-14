"use client";

// client/src/app/auth/reset-password/page.tsx
//
// Where the email link lands. Without this page the whole flow is a dead
// end — the email arrives, the link 404s, and the person is stuck with
// no way back into their account.
//
// ─── THE TOKEN ───────────────────────────────────────────────────────
//
// It's in the URL, which means it's in browser history, and on a shared
// phone that matters. So the moment a reset succeeds the page replaces
// the URL without it and sends them to sign in.
//
// ─── AND WHY IT DOESN'T AUTO-SIGN-IN ─────────────────────────────────
//
// It would be smoother. But someone resetting a password is often doing
// it because they think someone else has access — and signing the
// browser in immediately means whoever opened that link is now in the
// account. Asking them to sign in once with the new password is one
// extra step and closes that.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Check,
} from "lucide-react";

import { useAppDispatch } from "@/src/app/redux";
import { resetPassword } from "@/src/lib/features/auth/authActions";

const YELLOW = "#FFC105";

export default function ResetPasswordPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useSearchParams();

  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // Once it's used, get it out of the address bar and out of history
  useEffect(() => {
    if (done) {
      window.history.replaceState({}, "", "/auth/reset-password");
      const t = setTimeout(() => router.replace("/auth/login"), 2600);
      return () => clearTimeout(t);
    }
  }, [done, router]);

  const rules = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    {
      label: "A letter and a number",
      ok: /[a-z]/i.test(password) && /\d/.test(password),
    },
    {
      label: "Both entries match",
      ok: password.length > 0 && password === confirm,
    },
  ];

  const canSubmit = rules.every((r) => r.ok) && !saving && !!token;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setError("");

    try {
      await dispatch(resetPassword({ token, password })).unwrap();
      setDone(true);
    } catch (err: any) {
      const msg = typeof err === "string" ? err : err?.message;

      setError(
        msg?.toLowerCase().includes("expired") ||
          msg?.toLowerCase().includes("invalid")
          ? "This link has expired or has already been used. Request a new one."
          : (msg ?? "We couldn't reset your password. Please try again."),
      );
      setSaving(false);
    }
  };

  // ─── No token ─────────────────────────────────────────────────────
  if (!token) {
    return (
      <Shell>
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle size={28} className="text-amber-600" />
          </div>
          <h1 className="mt-5 text-xl font-bold text-gray-900">
            This link isn&apos;t valid
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
            Reset links can only be used once, and they expire after 30 minutes.
          </p>
          <Link
            href="/auth/forgot-password"
            className="mt-6 inline-block w-full rounded-2xl bg-amber-400 py-3.5 text-center text-[15px] font-bold text-gray-900 transition hover:bg-amber-300"
          >
            Request a new link
          </Link>
        </div>
      </Shell>
    );
  }

  // ─── Done ─────────────────────────────────────────────────────────
  if (done) {
    return (
      <Shell>
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 size={30} className="text-emerald-600" />
          </div>
          <h1 className="mt-5 text-xl font-bold text-gray-900">
            Password changed
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
            You can sign in with your new password now. Taking you there…
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-block w-full rounded-2xl bg-amber-400 py-3.5 text-center text-[15px] font-bold text-gray-900 transition hover:bg-amber-300"
          >
            Sign in
          </Link>
        </div>
      </Shell>
    );
  }

  // ─── Form ─────────────────────────────────────────────────────────
  return (
    <Shell>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
        <KeyRound size={22} className="text-amber-600" />
      </div>

      <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
        Set a new password
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">
        Choose something you haven&apos;t used here before.
      </p>

      <form onSubmit={submit} className="mt-6">
        <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
          New password
        </label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            autoFocus
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

        <label className="mb-1.5 mt-4 block text-[13px] font-semibold text-gray-700">
          Confirm it
        </label>
        <input
          type={showPw ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Type it again"
          autoComplete="new-password"
          className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-[15px] text-gray-900 outline-none transition focus:border-gray-400"
        />

        {/* Live rather than on submit — telling someone what's wrong
            after they press the button is a wasted round trip */}
        <div className="mt-4 space-y-1.5">
          {rules.map((r) => (
            <div key={r.label} className="flex items-center gap-2">
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  r.ok ? "bg-emerald-500" : "bg-gray-200"
                }`}
              >
                {r.ok && <Check size={10} color="white" strokeWidth={3.5} />}
              </span>
              <span
                className={`text-[12.5px] ${r.ok ? "text-gray-600" : "text-gray-400"}`}
              >
                {r.label}
              </span>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="text-[13px] leading-relaxed text-red-800">{error}</p>
            {error.includes("expired") && (
              <Link
                href="/auth/forgot-password"
                className="mt-2 inline-block text-[12.5px] font-bold text-red-900 underline"
              >
                Request a new link
              </Link>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-bold transition"
          style={{
            height: 52,
            background: canSubmit ? YELLOW : "#F3F4F6",
            color: canSubmit ? "#111827" : "#9CA3AF",
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
        >
          {saving ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Saving…
            </>
          ) : (
            "Change password"
          )}
        </button>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-5 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-gray-100 bg-white p-7">
          {children}
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/auth/login"
            className="text-[13px] font-semibold text-gray-500 transition hover:text-gray-900"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
