"use client";

// src/app/account/settings/page.tsx
//
// Account settings for every signed-in user (guests, buyers, vendors).
// Linked from /account, the header menu and /money/send — it used to 404.
// Store settings for vendors stay at /vendor/settings.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Camera,
  ShieldCheck,
  Trash2,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/src/lib/api/axios";
import { safeStorage } from "@/src/utils/safeStorage";
import { uploadToCloudinary } from "@/src/utils/uploadToCloudinary";
import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import {
  setUser,
  setAccessToken,
  setSelectedCountry,
} from "@/src/lib/features/auth/authSlice";
import { PageShell } from "@/src/app/account/components";

const card = "rounded-3xl border border-gray-100 bg-white p-6";
const label = "mb-1.5 block text-[13px] font-semibold text-gray-700";
const input =
  "h-12 w-full rounded-2xl border border-gray-200 px-4 text-[15px] text-gray-900 outline-none transition focus:border-gray-400";
const primary =
  "flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#FFC105] px-6 text-[15px] font-bold text-gray-900 transition hover:bg-amber-400 disabled:opacity-50";

const NOTIFS: { key: string; label: string; sub: string }[] = [
  { key: "newMessage", label: "New messages", sub: "When a buyer or seller writes to you" },
  { key: "orderStatus", label: "Order and booking updates", sub: "Paid, confirmed, on the way, delivered" },
  { key: "newOrder", label: "New orders (sellers)", sub: "When someone buys or books from you" },
  { key: "smsPayment", label: "SMS for payments", sub: "A text when money moves" },
  { key: "marketingTips", label: "Tips and offers", sub: "Occasional emails from SmileBaba" },
];

export default function AccountSettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, hasCheckedAuth } = useAppSelector((s) => s.auth);

  // ── Profile ──────────────────────────────────────────────────────────
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [picture, setPicture] = useState("");
  const [uploading, setUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Password ─────────────────────────────────────────────────────────
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  // ── Notifications ────────────────────────────────────────────────────
  const [notifs, setNotifs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!hasCheckedAuth) return;
    if (!user) {
      router.replace("/auth/login?returnUrl=/account/settings");
      return;
    }
    const u: any = user;
    setUsername(u.username ?? "");
    setPhone(u.phone ?? "");
    setCity(u.city ?? "");
    setBio(u.bio ?? "");
    setPicture(u.profilePicture ?? "");
    setNotifs(u.notifications ?? {});
  }, [hasCheckedAuth, user, router]);

  if (!hasCheckedAuth || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 size={26} className="animate-spin text-amber-400" />
      </main>
    );
  }
  const u: any = user;

  const errMsg = (e: any, fallback: string) => e?.response?.data?.message ?? fallback;

  const pickPhoto = async (file?: File) => {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      toast.error("Use a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("That photo is over 5 MB.");
      return;
    }
    setUploading(true);
    try {
      const { url } = await uploadToCloudinary(file);
      setPicture(url);
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    if (username.trim().length < 2) {
      toast.error("Your name needs at least 2 characters.");
      return;
    }
    setSavingProfile(true);
    try {
      const { data } = await axiosInstance.patch("/auth/profile", {
        username: username.trim().slice(0, 60),
        phone: phone.trim().slice(0, 20),
        city: city.trim().slice(0, 60),
        bio: bio.trim().slice(0, 300),
        profilePicture: picture || undefined,
      });
      if (data?.user) dispatch(setUser(data.user));
      toast.success("Profile saved");
    } catch (e) {
      toast.error(errMsg(e, "Couldn't save your profile."));
    } finally {
      setSavingProfile(false);
    }
  };

  const saveCountry = async (country: "Ghana" | "Nigeria") => {
    if (country === u.country) return;
    try {
      const { data } = await axiosInstance.patch("/auth/profile", { country });
      if (data?.user) dispatch(setUser(data.user));
      dispatch(setSelectedCountry("")); // the saved choice now drives prices
      toast.success(`Prices now show in ${country === "Nigeria" ? "NGN" : "GHS"}`);
    } catch (e) {
      toast.error(errMsg(e, "Couldn't change country."));
    }
  };

  const pwOk = next.length >= 8 && /[a-z]/i.test(next) && /\d/.test(next) && next === confirm && current.length > 0;

  const savePassword = async () => {
    if (!pwOk) return;
    setSavingPw(true);
    try {
      const { data } = await axiosInstance.patch("/auth/password", {
        currentPassword: current,
        newPassword: next,
      });
      // The server signs out every other device and gives this one fresh tokens
      if (data?.accessToken) {
        safeStorage.set("accessToken", data.accessToken);
        dispatch(setAccessToken(data.accessToken));
      }
      setCurrent("");
      setNext("");
      setConfirm("");
      toast.success("Password changed. You've been signed out on other devices.");
    } catch (e) {
      toast.error(errMsg(e, "Couldn't change your password."));
    } finally {
      setSavingPw(false);
    }
  };

  const toggleNotif = async (key: string) => {
    const updated = { ...notifs, [key]: !notifs[key] };
    setNotifs(updated); // optimistic
    try {
      const { data } = await axiosInstance.patch("/auth/notifications", { notifications: updated });
      if (data?.user) dispatch(setUser(data.user));
    } catch (e) {
      setNotifs(notifs); // roll back
      toast.error(errMsg(e, "Couldn't save that setting."));
    }
  };

  return (
    <PageShell title="Settings" subtitle={u.email} backHref="/account" backLabel="← Account">
      <div className="space-y-5">
        {/* ── Profile ── */}
        <section className={card}>
          <h2 className="text-base font-bold text-gray-900">Profile</h2>

          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-amber-100"
              aria-label="Change profile photo"
            >
              {picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={picture} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-amber-700">
                  {(username || "?").charAt(0).toUpperCase()}
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 flex h-7 items-center justify-center bg-black/50">
                {uploading ? (
                  <Loader2 size={14} className="animate-spin text-white" />
                ) : (
                  <Camera size={14} className="text-white" />
                )}
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => pickPhoto(e.target.files?.[0])}
            />
            <p className="text-sm text-gray-500">Tap the photo to change it. JPG, PNG or WebP, up to 5 MB.</p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Name</label>
              <input className={input} value={username} onChange={(e) => setUsername(e.target.value)} maxLength={60} autoComplete="name" />
            </div>
            <div>
              <label className={label}>Phone</label>
              <input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} inputMode="tel" autoComplete="tel" placeholder="024 000 0000" />
            </div>
            <div>
              <label className={label}>City</label>
              <input className={input} value={city} onChange={(e) => setCity(e.target.value)} maxLength={60} autoComplete="address-level2" />
            </div>
            <div>
              <label className={label}>Email</label>
              <input className={`${input} bg-gray-50 text-gray-500`} value={u.email} disabled />
            </div>
          </div>
          <div className="mt-4">
            <label className={label}>About you</label>
            <textarea
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-[15px] text-gray-900 outline-none focus:border-gray-400"
              rows={3}
              maxLength={300}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <p className="mt-1 text-right text-xs text-gray-400">{bio.length}/300</p>
          </div>
          <button onClick={saveProfile} disabled={savingProfile || uploading} className={`${primary} mt-4`}>
            {savingProfile ? <Loader2 size={17} className="animate-spin" /> : "Save profile"}
          </button>
        </section>

        {/* ── Country ── */}
        <section className={card}>
          <h2 className="text-base font-bold text-gray-900">Country and currency</h2>
          <p className="mt-1 text-sm text-gray-500">Decides which listings you see and the currency prices show in.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {(["Ghana", "Nigeria"] as const).map((c) => (
              <button
                key={c}
                onClick={() => saveCountry(c)}
                className={`flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-bold transition ${
                  u.country === c ? "border-amber-400 bg-amber-50 text-gray-900" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {c === "Ghana" ? "🇬🇭" : "🇳🇬"} {c} · {c === "Ghana" ? "GHS" : "NGN"}
              </button>
            ))}
          </div>
        </section>

        {/* ── Password ── */}
        <section className={card}>
          <h2 className="text-base font-bold text-gray-900">Password</h2>
          <p className="mt-1 text-sm text-gray-500">Changing it signs you out on every other device.</p>
          <div className="mt-4 space-y-3">
            <input className={input} type={showPw ? "text" : "password"} placeholder="Current password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" />
            <div className="relative">
              <input className={`${input} pr-12`} type={showPw ? "text" : "password"} placeholder="New password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-label={showPw ? "Hide passwords" : "Show passwords"}>
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <input className={input} type={showPw ? "text" : "password"} placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
            <p className="text-xs text-gray-500">At least 8 characters, with a letter and a number.</p>
            {confirm && next !== confirm && <p className="text-xs text-red-600">The new passwords don&apos;t match.</p>}
          </div>
          <button onClick={savePassword} disabled={!pwOk || savingPw} className={`${primary} mt-4`}>
            {savingPw ? <Loader2 size={17} className="animate-spin" /> : "Change password"}
          </button>
          <p className="mt-3 text-xs text-gray-400">Signed up with Google? Use <Link href="/auth/forgot-password" className="font-semibold text-amber-600 hover:underline">Forgot password</Link> to set one.</p>
        </section>

        {/* ── Notifications ── */}
        <section className={card}>
          <h2 className="text-base font-bold text-gray-900">Notifications</h2>
          <div className="mt-3 divide-y divide-gray-100">
            {NOTIFS.map((n) => {
              const on = notifs[n.key] ?? true;
              return (
                <div key={n.key} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{n.label}</p>
                    <p className="text-xs text-gray-500">{n.sub}</p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={on}
                    aria-label={n.label}
                    onClick={() => toggleNotif(n.key)}
                    className={`relative h-7 w-12 shrink-0 rounded-full transition ${on ? "bg-amber-400" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-6" : "left-1"}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Security + danger ── */}
        <section className={`${card} p-0 overflow-hidden`}>
          <Link href="/account/security" className="flex items-center gap-3 px-6 py-4 transition hover:bg-gray-50">
            <ShieldCheck size={18} className="text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Security</p>
              <p className="text-xs text-gray-500">Two-step verification with Google Authenticator</p>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </Link>
          <Link href="/account/delete" className="flex items-center gap-3 border-t border-gray-100 px-6 py-4 transition hover:bg-red-50">
            <Trash2 size={18} className="text-red-500" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-600">Delete account</p>
              <p className="text-xs text-gray-500">Permanently remove your account and data</p>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </Link>
        </section>
      </div>
    </PageShell>
  );
}
