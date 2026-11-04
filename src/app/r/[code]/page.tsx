"use client";
// src/app/r/[code]/page.tsx
//
// A marketer's referral link: www.smilebabahub.com/r/SMB-KWAME-4X9Z
// Shows who invited the visitor, remembers the code (30 days), counts the
// visit, and sends them on to sign up (or applies it if already signed in).

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Gift, Loader2, CheckCircle2 } from "lucide-react";
import axiosInstance from "@/src/lib/api/axios";
import { useAppSelector } from "@/src/app/redux";
import { savePendingReferral, clearPendingReferral } from "@/src/lib/referral/ReferralCapture";

export default function ReferralLandingPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const isAuthenticated = useAppSelector((s: any) => s.auth?.isAuthenticated);
  const [state, setState] = useState<"loading" | "ok" | "bad">("loading");
  const [info, setInfo] = useState<{ name: string; discount: number; code: string } | null>(null);
  const [applied, setApplied] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const c = decodeURIComponent(String(code ?? "")).trim();
    if (!/^[A-Za-z0-9-]{4,32}$/.test(c)) {
      setState("bad");
      return;
    }
    axiosInstance
      .get(`/marketers/referral/${encodeURIComponent(c)}/validate`, { params: { visit: 1 } })
      .then(({ data }) => {
        setInfo({ name: data.marketerName, discount: data.discount, code: data.code });
        savePendingReferral(data.code);
        setState("ok");
      })
      .catch(() => setState("bad"));
  }, [code]);

  const applyNow = async () => {
    if (!info) return;
    setBusy(true);
    try {
      const { data } = await axiosInstance.post("/marketers/referral/claim", { ref: info.code, source: "link" });
      setApplied(data?.message ?? "Referral applied.");
    } catch (e: any) {
      setApplied(e?.response?.data?.message ?? "Couldn't apply this referral.");
    } finally {
      clearPendingReferral();
      setBusy(false);
    }
  };

  return (
    <main className="mt-20 flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        {state === "loading" ? (
          <Loader2 className="mx-auto animate-spin text-[#FFC105]" />
        ) : state === "bad" ? (
          <>
            <h1 className="text-xl font-extrabold text-gray-900">This referral link isn&apos;t valid</h1>
            <p className="mt-2 text-sm text-gray-500">Ask the person who shared it for a new one. You can still join.</p>
            <Link href="/auth/register" className="mt-6 inline-block rounded-2xl bg-[#FFC105] px-6 py-3 text-sm font-bold text-gray-900">
              Create an account
            </Link>
          </>
        ) : (
          <>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
              <Gift className="text-amber-700" size={30} />
            </span>
            <h1 className="mt-4 text-2xl font-black text-gray-900">{info?.name} invited you to SmileBaba Hub</h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Sell to buyers across Ghana and Nigeria — and get <strong>{info?.discount}% off</strong> your first paid
              plan.
            </p>

            {applied ? (
              <p className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-800">
                <CheckCircle2 size={16} /> {applied}
              </p>
            ) : isAuthenticated ? (
              <button
                onClick={applyNow}
                disabled={busy}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#FFC105] px-6 py-3 text-sm font-bold text-gray-900 disabled:opacity-60"
              >
                {busy && <Loader2 size={14} className="animate-spin" />} Apply to my account
              </button>
            ) : (
              <div className="mt-6 flex flex-col gap-2">
                <button
                  onClick={() => router.push("/auth/register?returnUrl=/subscription")}
                  className="rounded-2xl bg-[#FFC105] px-6 py-3 text-sm font-bold text-gray-900"
                >
                  Create my account
                </button>
                <Link href="/auth/login?returnUrl=/subscription" className="text-sm font-semibold text-gray-500 hover:text-gray-800">
                  I already have an account
                </Link>
              </div>
            )}
            {applied && (
              <Link href="/subscription" className="mt-4 inline-block text-sm font-bold text-amber-700 hover:underline">
                Choose a plan →
              </Link>
            )}
            <p className="mt-6 text-[11px] text-gray-400">Referral code {info?.code}</p>
          </>
        )}
      </div>
    </main>
  );
}
