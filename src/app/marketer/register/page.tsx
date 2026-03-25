"use client";

import { useState } from "react";
import axiosInstance from "@/src/lib/api/axios";

type FormState = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
};

type MarketerResult = {
  referralCode: string;
  name: string;
  totalEarnings: number;
};

export default function MarketerRegisterPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [marketer, setMarketer] = useState<MarketerResult | null>(null);
  const [copied, setCopied] = useState(false);

  const set = (k: keyof FormState, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/marketers/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      setMarketer(res.data.marketer);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(
        e?.response?.data?.message ?? "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (!marketer) return;
    await navigator.clipboard.writeText(marketer.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Success screen ─────────────────────────────────────────────────────
  if (marketer) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-4">
        <div className="bg-[#252525] rounded-2xl p-8 sm:p-10 w-full max-w-md text-center">
          <div
            className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center
            text-3xl mx-auto mb-5"
          >
            🎉
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            Welcome, {marketer.name.split(" ")[0]}!
          </h2>
          <p className="text-gray-400 text-sm mb-7">
            Your marketer account is ready. Share your referral code with
            vendors to earn 20% commission on every subscription.
          </p>

          {/* Referral code display */}
          <div className="bg-[#1a1a1a] border border-amber-400/30 rounded-2xl p-5 mb-6">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">
              Your referral code
            </p>
            <p className="text-3xl font-black text-amber-400 tracking-widest mb-4">
              {marketer.referralCode}
            </p>
            <button
              onClick={copyCode}
              className="w-full py-2.5 bg-amber-400 text-black font-bold rounded-xl
                hover:bg-amber-300 transition text-sm active:scale-95"
            >
              {copied ? "✓ Copied!" : "Copy code"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-7 text-center">
            {[
              { label: "Your cut", value: "20%", sub: "per referral" },
              { label: "Vendor gets", value: "20%", sub: "discount" },
              { label: "Payout", value: "Weekly", sub: "to MoMo/Bank" },
            ].map((s) => (
              <div key={s.label} className="bg-[#1a1a1a] rounded-xl p-3">
                <p className="text-lg font-black text-amber-400">{s.value}</p>
                <p className="text-[11px] text-gray-400">{s.label}</p>
                <p className="text-[10px] text-gray-500">{s.sub}</p>
              </div>
            ))}
          </div>

          <a
            href="/marketer/dashboard"
            className="inline-block w-full py-3 bg-amber-400 text-black font-bold
              rounded-xl hover:bg-amber-300 transition text-sm"
          >
            Go to dashboard →
          </a>
        </div>
      </div>
    );
  }

  // ── Registration form ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-2">
            SmileBaba Marketers
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Become a marketer
          </h1>
          <p className="text-gray-400 text-sm">
            Refer vendors and earn{" "}
            <span className="text-amber-400 font-bold">20%</span> commission on
            every subscription they pay.
          </p>
        </div>

        {/* How it works strip */}
        <div className="flex gap-2 mb-8">
          {[
            { step: "1", text: "Register & get your unique code" },
            { step: "2", text: "Share code with vendors" },
            { step: "3", text: "Earn 20% on each subscription" },
          ].map((s) => (
            <div
              key={s.step}
              className="flex-1 bg-[#252525] rounded-xl p-3 text-center"
            >
              <div
                className="w-6 h-6 bg-amber-400 rounded-full text-black text-xs font-black
                flex items-center justify-center mx-auto mb-1.5"
              >
                {s.step}
              </div>
              <p className="text-[11px] text-gray-400 leading-tight">
                {s.text}
              </p>
            </div>
          ))}
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#252525] rounded-2xl p-6 sm:p-8 space-y-4"
        >
          {error && (
            <div
              className="px-4 py-3 bg-red-500/10 border border-red-500/30
              rounded-xl text-red-400 text-sm"
            >
              {error}
            </div>
          )}

          <Field label="Full name">
            <input
              required
              placeholder="Kwame Asante"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls}
            />
          </Field>

          <Field label="Email address">
            <input
              required
              type="email"
              placeholder="kwame@email.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className={inputCls}
            />
          </Field>

          <Field label="Phone number">
            <input
              required
              placeholder="+233 244 123 456"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className={inputCls}
            />
          </Field>

          <Field label="Password">
            <input
              required
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              className={inputCls}
            />
          </Field>

          <Field label="Confirm password">
            <input
              required
              type="password"
              placeholder="Repeat password"
              value={form.confirm}
              onChange={(e) => set("confirm", e.target.value)}
              className={inputCls}
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-400 text-black font-black rounded-xl
              hover:bg-amber-300 transition disabled:opacity-50 text-sm active:scale-[0.99] mt-2"
          >
            {loading
              ? "Creating account…"
              : "Register & get my referral code →"}
          </button>

          <p className="text-center text-xs text-gray-500 pt-1">
            Already have an account?{" "}
            <a
              href="/marketer/login"
              className="text-amber-400 hover:underline"
            >
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

const inputCls = `w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5
  text-white text-sm placeholder:text-gray-600
  focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition`;

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
