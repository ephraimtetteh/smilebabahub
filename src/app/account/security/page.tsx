"use client";

// src/app/account/security/page.tsx
//
// Two-step verification with Google Authenticator (or any TOTP app).
//
//   Off → "Turn on" → scan QR / type key → enter code → backup codes shown once
//   On  → regenerate backup codes, or turn off (password + code)

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ShieldOff,
  Loader2,
  Copy,
  Download,
  Smartphone,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/src/lib/api/axios";
import { safeStorage } from "@/src/utils/safeStorage";
import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { setAccessToken, setUser } from "@/src/lib/features/auth/authSlice";
import { PageShell } from "@/src/app/account/components";

type Status = { enabled: boolean; backupCodesLeft: number; configured: boolean };
type Setup = { secret: string; secretGrouped: string; otpauthUrl: string; qrDataUrl: string };

const btn =
  "flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-bold transition disabled:opacity-50";
const input =
  "h-12 w-full rounded-2xl border border-gray-200 px-4 text-[15px] text-gray-900 outline-none transition focus:border-gray-400";

export default function SecurityPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, hasCheckedAuth } = useAppSelector((s) => s.auth);

  const [status, setStatus] = useState<Status | null>(null);
  const [setup, setSetup] = useState<Setup | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"idle" | "disable" | "regen">("idle");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/auth/2fa/status");
      setStatus(data);
    } catch {
      setError("Couldn't load your security settings.");
    }
  }, []);

  useEffect(() => {
    if (!hasCheckedAuth) return;
    if (!user) {
      router.replace("/auth/login?returnUrl=/account/security");
      return;
    }
    load();
  }, [hasCheckedAuth, user, load, router]);

  const fail = (err: any, fallback: string) =>
    setError(err?.response?.data?.message ?? fallback);

  const start = async () => {
    setBusy(true);
    setError("");
    try {
      const { data } = await axiosInstance.post("/auth/2fa/setup");
      setSetup(data);
      setCode("");
    } catch (err) {
      fail(err, "Couldn't start setup. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const enable = async () => {
    setBusy(true);
    setError("");
    try {
      const { data } = await axiosInstance.post("/auth/2fa/enable", { code: code.replace(/\D/g, "") });
      // Turning it on signs out other devices; this one gets fresh tokens
      if (data.accessToken) {
        safeStorage.set("accessToken", data.accessToken);
        dispatch(setAccessToken(data.accessToken));
      }
      if (data.user) dispatch(setUser(data.user));
      setBackupCodes(data.backupCodes ?? []);
      setSetup(null);
      setCode("");
      await load();
      toast.success("Two-step verification is on");
    } catch (err) {
      fail(err, "That code didn't match.");
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    setError("");
    try {
      await axiosInstance.post("/auth/2fa/disable", { code: code.trim(), password });
      setMode("idle");
      setCode("");
      setPassword("");
      await load();
      toast.info("Two-step verification is off");
    } catch (err) {
      fail(err, "Couldn't turn it off.");
    } finally {
      setBusy(false);
    }
  };

  const regenerate = async () => {
    setBusy(true);
    setError("");
    try {
      const { data } = await axiosInstance.post("/auth/2fa/backup-codes", { code: code.replace(/\D/g, "") });
      setBackupCodes(data.backupCodes ?? []);
      setMode("idle");
      setCode("");
      await load();
    } catch (err) {
      fail(err, "That code didn't match.");
    } finally {
      setBusy(false);
    }
  };

  const copyCodes = () => {
    navigator.clipboard?.writeText((backupCodes ?? []).join("\n")).then(
      () => toast.success("Copied"),
      () => toast.error("Couldn't copy — write them down instead"),
    );
  };
  const downloadCodes = () => {
    const blob = new Blob(
      [
        `SmileBaba Hub backup codes (${user?.email ?? ""})\n` +
          `Each code works once. Keep them somewhere safe.\n\n` +
          (backupCodes ?? []).join("\n") +
          "\n",
      ],
      { type: "text/plain" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "smilebaba-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (!status) {
    return (
      <PageShell title="Security" backHref="/account" backLabel="← Account">
        <div className="flex justify-center py-16">
          {error ? <p className="text-sm text-red-600">{error}</p> : <Loader2 className="animate-spin text-amber-400" />}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Security"
      subtitle="Protect your account with Google Authenticator"
      backHref="/account"
      backLabel="← Account"
    >
      {/* ── Backup codes (just generated) ── */}
      {backupCodes && (
        <div className="mb-5 rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-center gap-2">
            <KeyRound size={18} className="text-amber-700" />
            <h2 className="text-base font-bold text-gray-900">Save your backup codes now</h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-amber-900">
            If you lose your phone, each of these lets you sign in once. This is the only time we&apos;ll show them.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-white p-4 font-mono text-[15px] tracking-wider text-gray-900">
            {backupCodes.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={copyCodes} className={`${btn} border border-amber-300 bg-white text-gray-900`}>
              <Copy size={16} /> Copy
            </button>
            <button onClick={downloadCodes} className={`${btn} border border-amber-300 bg-white text-gray-900`}>
              <Download size={16} /> Download
            </button>
          </div>
          <button onClick={() => setBackupCodes(null)} className={`${btn} mt-2 bg-gray-900 text-white`}>
            I&apos;ve saved them
          </button>
        </div>
      )}

      <div className="rounded-3xl border border-gray-100 bg-white p-6">
        <div className="flex items-start gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${status.enabled ? "bg-green-50" : "bg-gray-100"}`}>
            {status.enabled ? <ShieldCheck size={20} className="text-green-600" /> : <ShieldOff size={20} className="text-gray-500" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Two-step verification</h2>
            <p className="mt-1 text-sm text-gray-500">
              {status.enabled
                ? `On. You'll enter a code from Google Authenticator when you sign in. ${status.backupCodesLeft} backup code${status.backupCodesLeft === 1 ? "" : "s"} left.`
                : "Off. Anyone with your password can sign in."}
            </p>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] text-red-800">{error}</p>
        )}

        {/* ── Off, not started ── */}
        {!status.enabled && !setup && (
          status.configured ? (
            <button onClick={start} disabled={busy} className={`${btn} mt-5 bg-[#FFC105] text-gray-900`}>
              {busy ? <Loader2 size={17} className="animate-spin" /> : "Turn on"}
            </button>
          ) : (
            <p className="mt-5 text-sm text-gray-500">Two-step verification isn&apos;t available yet.</p>
          )
        )}

        {/* ── Setup in progress ── */}
        {!status.enabled && setup && (
          <div className="mt-6 space-y-5">
            <ol className="space-y-2 text-sm text-gray-700">
              <li><b>1.</b> Install <b>Google Authenticator</b> on your phone (App Store / Play Store).</li>
              <li><b>2.</b> In the app tap <b>+</b> → <b>Scan a QR code</b>, and scan this:</li>
            </ol>
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={setup.qrDataUrl} alt="QR code for Google Authenticator" width={200} height={200} className="rounded-2xl border border-gray-100" />
            </div>
            <div className="rounded-2xl bg-gray-50 p-4 text-sm">
              <p className="flex items-center gap-1.5 font-semibold text-gray-700">
                <Smartphone size={15} /> Can&apos;t scan? Choose <b>Enter a setup key</b> and type:
              </p>
              <p className="mt-2 select-all break-all font-mono text-[15px] tracking-wider text-gray-900">{setup.secretGrouped}</p>
              <p className="mt-1 text-xs text-gray-500">Account: your email · Type: Time based</p>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
                <b>3.</b> Enter the 6-digit code the app shows
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={7}
                placeholder="123 456"
                className={`${input} text-center text-xl font-bold tracking-[0.3em]`}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { setSetup(null); setError(""); }} className={`${btn} border border-gray-200 text-gray-700`}>
                Cancel
              </button>
              <button onClick={enable} disabled={busy || code.replace(/\D/g, "").length !== 6} className={`${btn} bg-[#FFC105] text-gray-900`}>
                {busy ? <Loader2 size={17} className="animate-spin" /> : <><CheckCircle2 size={16} /> Turn on</>}
              </button>
            </div>
          </div>
        )}

        {/* ── On ── */}
        {status.enabled && mode === "idle" && (
          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button onClick={() => { setMode("regen"); setError(""); setCode(""); }} className={`${btn} border border-gray-200 text-gray-800`}>
              New backup codes
            </button>
            <button onClick={() => { setMode("disable"); setError(""); setCode(""); }} className={`${btn} border border-red-200 text-red-600`}>
              Turn off
            </button>
          </div>
        )}

        {status.enabled && mode !== "idle" && (
          <div className="mt-5 space-y-3">
            {mode === "disable" && (
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password (leave blank if you sign in with Google)" autoComplete="current-password" className={input} />
            )}
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={mode === "disable" ? "6-digit code or a backup code" : "6-digit code from the app"}
              autoComplete="one-time-code"
              className={`${input} text-center tracking-[0.2em]`}
            />
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { setMode("idle"); setError(""); }} className={`${btn} border border-gray-200 text-gray-700`}>
                Cancel
              </button>
              <button
                onClick={mode === "disable" ? disable : regenerate}
                disabled={busy || code.trim().length < 6}
                className={`${btn} ${mode === "disable" ? "bg-red-600 text-white" : "bg-[#FFC105] text-gray-900"}`}
              >
                {busy ? <Loader2 size={17} className="animate-spin" /> : mode === "disable" ? "Turn off" : "Generate"}
              </button>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
