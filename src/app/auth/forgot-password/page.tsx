"use client";

// client/src/app/auth/forgot-password/page.tsx
//
// ─── TWO BUGS FIXED ──────────────────────────────────────────────────
//
// 1 · The button had both type="submit" and onClick={handleSubmit},
//     inside a form with onSubmit={handleSubmit}. That fires twice —
//     once from the click, once from the form. Every request sent two
//     emails and burned two hits against resetLimiter, so a second
//     genuine attempt would hit the rate limit.
//
// 2 · There was no success state. The toast fired and the person was
//     left looking at the same form, so most people pressed it again —
//     which, with the double-submit, meant four emails and a lockout.
//
// ─── AND ONE THING IT DOES DELIBERATELY ──────────────────────────────
//
// It says "if an account exists" rather than confirming one does. The
// backend already answers the same way for a real and a made-up address
// — otherwise this page becomes a way to check which emails have
// SmileBaba accounts.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

import { useAppDispatch } from "@/src/app/redux";
import { forgotPassword } from "@/src/lib/features/auth/authActions";

const YELLOW = "#FFC105";

/** Long enough that a slow inbox isn't mistaken for a failure. */
const RESEND_SECONDS = 45;

export default function ForgotPasswordPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState(params.get("email") ?? "");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!emailOk || sending || cooldown > 0) return;

    setSending(true);
    setError("");

    try {
      await dispatch(forgotPassword(email.trim().toLowerCase())).unwrap();
      setSent(true);
      setCooldown(RESEND_SECONDS);
    } catch (err: any) {
      const msg = typeof err === "string" ? err : err?.message;

      // Too many attempts is worth saying plainly — "failed to send" would
      // have someone retrying into a longer lockout
      setError(
        msg?.toLowerCase().includes("too many")
          ? "Too many attempts. Wait a few minutes and try again."
          : (msg ?? "We couldn't send that. Check the address and try again."),
      );
    } finally {
      setSending(false);
    }
  };

  // ─── Sent ─────────────────────────────────────────────────────────
  if (sent) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-5 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 size={30} className="text-emerald-600" />
            </div>

            <h1 className="mt-5 text-xl font-bold tracking-tight text-gray-900">
              Check your email
            </h1>

            {/* "If an account exists" rather than confirming one does —
                otherwise this page tells anyone which addresses are
                registered */}
            <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
              If an account exists for{" "}
              <span className="font-semibold text-gray-900">{email}</span>,
              we&apos;ve sent a link to reset your password.
            </p>

            <div className="mt-5 rounded-2xl bg-gray-50 p-4 text-left">
              <p className="text-[12px] font-bold text-gray-700">Not there?</p>
              <ul className="mt-2 space-y-1.5 text-[12px] leading-relaxed text-gray-500">
                <li>· Check your spam or promotions folder</li>
                <li>· The link works for 30 minutes</li>
                <li>· Make sure the address is spelled correctly</li>
              </ul>
            </div>

            <button
              onClick={() => submit()}
              disabled={cooldown > 0 || sending}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3 text-[14px] font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Sending…
                </>
              ) : cooldown > 0 ? (
                `Send again in ${cooldown}s`
              ) : (
                <>
                  <RefreshCw size={14} />
                  Send it again
                </>
              )}
            </button>

            <button
              onClick={() => {
                setSent(false);
                setError("");
              }}
              className="mt-2.5 w-full py-2 text-[13px] font-semibold text-gray-500 transition hover:text-gray-900"
            >
              Use a different email
            </button>
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

  // ─── Form ─────────────────────────────────────────────────────────
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-5 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/auth/login"
          className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 transition hover:text-gray-900"
        >
          <ArrowLeft size={14} />
          Back to sign in
        </Link>

        <div className="rounded-3xl border border-gray-100 bg-white p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
            <Mail size={22} className="text-amber-600" />
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Enter the email you signed up with and we&apos;ll send you a link to
            set a new one.
          </p>

          {/* One handler, on the form. The button is type="submit" and
              carries no onClick — that combination is what was sending
              every request twice. */}
          <form onSubmit={submit} className="mt-6">
            <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="you@example.com"
              autoComplete="email"
              autoFocus
              className={`h-12 w-full rounded-2xl border px-4 text-[15px] text-gray-900 outline-none transition ${
                error
                  ? "border-red-300 focus:border-red-400"
                  : "border-gray-200 focus:border-gray-400"
              }`}
            />

            {error && (
              <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] leading-relaxed text-red-800">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!emailOk || sending}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-bold transition"
              style={{
                height: 52,
                background: emailOk && !sending ? YELLOW : "#F3F4F6",
                color: emailOk && !sending ? "#111827" : "#9CA3AF",
                cursor: emailOk && !sending ? "pointer" : "not-allowed",
              }}
            >
              {sending ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Sending…
                </>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-[13.5px] text-gray-500">
            Remembered it?{" "}
            <Link href="/auth/login" className="font-bold text-gray-900">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
