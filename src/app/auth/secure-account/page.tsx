"use client";

// src/app/auth/secure-account/page.tsx
//
// Where the "Wasn't you? Secure my account" button in the new-sign-in email
// lands. Nothing happens on page load (email scanners open links); the
// owner presses the button, the server signs every device out and kills
// the old password, then we go straight to choosing a new one.

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldAlert, Loader2 } from "lucide-react";
import axiosInstance from "@/src/lib/api/axios";
import { useAppDispatch } from "@/src/app/redux";
import { logout } from "@/src/lib/features/auth/authActions";

function SecureAccount() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useSearchParams().get("token") ?? "";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const go = async () => {
    setBusy(true);
    setError("");
    try {
      const { data } = await axiosInstance.post("/auth/secure-account", { token });
      await dispatch(logout()).catch(() => {});
      router.replace(`/auth/reset-password?token=${encodeURIComponent(data.resetToken)}&secured=1`);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Something went wrong. Please try again.");
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto mt-28 max-w-md px-4 pb-24">
      <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
          <ShieldAlert className="text-red-600" size={22} />
        </div>
        <h1 className="mt-4 text-xl font-black text-gray-900">Secure your account</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          If you didn&apos;t just sign in, someone may have your password. This will:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
          <li>sign out every phone and browser on your account, straight away</li>
          <li>stop your current password from working</li>
          <li>take you to choose a new password</li>
        </ul>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button
          onClick={go}
          disabled={busy || !token}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red-600 text-[15px] font-bold text-white disabled:opacity-50"
        >
          {busy ? <Loader2 size={17} className="animate-spin" /> : "Sign everyone out & change password"}
        </button>
        {!token && <p className="mt-3 text-xs text-gray-500">This link is incomplete. Open it again from the email.</p>}
        <p className="mt-4 text-xs text-gray-400">
          After that, turn on Google Authenticator in Account → Security so a password alone is never enough.
        </p>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SecureAccount />
    </Suspense>
  );
}
