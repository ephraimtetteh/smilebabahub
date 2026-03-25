"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/src/lib/api/axios";
import { safeStorage } from "@/src/utils/safeStorage";

export default function MarketerLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axiosInstance.post("/marketers/login", form);
  
      safeStorage.set("marketerAccessToken", res.data.accessToken);
      router.push("/marketer/dashboard");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#111] flex items-center justify-center px-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
      />

      {/* Background glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px]
        bg-[#ffc105]/8 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/marketer" className="text-xl font-bold text-white">
            Smile<span className="text-[#ffc105]">Baba</span>
          </Link>
          <p className="text-xs text-gray-500 mt-1 tracking-widest uppercase">
            Marketer portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#1a1a1a] border border-white/8 rounded-3xl p-7 sm:p-8">
          <h1
            className="text-xl font-black text-white mb-1"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 mb-7">
            Log in to your marketer dashboard
          </p>

          {error && (
            <div
              className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20
              rounded-xl text-red-400 text-sm"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                Email address
              </label>
              <input
                required
                type="email"
                placeholder="kwame@email.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="text-xs text-gray-500 hover:text-gray-300 transition"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              <input
                required
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                className={inputCls}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#ffc105] text-black font-black rounded-xl
                hover:bg-amber-300 transition disabled:opacity-50 text-sm active:scale-[0.99] mt-2"
            >
              {loading ? "Logging in…" : "Log in →"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/8 text-center space-y-2">
            <p className="text-xs text-gray-500">
              Don`t have an account?{" "}
              <Link
                href="/marketer/register"
                className="text-[#ffc105] hover:underline font-medium"
              >
                Register as a marketer
              </Link>
            </p>
            <p className="text-xs text-gray-500">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-400 transition"
              >
                ← Back to SmileBaba
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls = `w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5
  text-white text-sm placeholder:text-gray-700
  focus:outline-none focus:ring-2 focus:ring-[#ffc105] focus:border-transparent transition`;
