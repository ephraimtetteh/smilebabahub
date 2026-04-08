"use client";
// Vendor Settings → Security tab
// Real password change via PATCH /auth/password.
// Session data is illustrative (session management needs backend work to be real).

import { useState } from "react";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { SectionCard, Field, Input, SaveButton } from "../(components)/UI";
import axiosInstance from "@/src/lib/api/axios";
import { toast } from "react-toastify";
import { useVendorSettings } from "@/src/hooks/useVendorSettings";

function PasswordInput({
  label,
  value,
  onChange,
  hint,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  required?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label} hint={hint} required={required}>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </Field>
  );
}

export default function SecurityTab() {
  const { user, saving } = useVendorSettings();
  const [pwd, setPwd] = useState({ current: "", newPwd: "", confirm: "" });
  const [pwdSaving, setPwdSaving] = useState(false);

  const strength = (() => {
    const p = pwd.newPwd;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const handlePasswordChange = async () => {
    if (!pwd.current || !pwd.newPwd || !pwd.confirm) {
      toast.error("All fields are required");
      return;
    }
    if (pwd.newPwd !== pwd.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (pwd.newPwd.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    setPwdSaving(true);
    try {
      await axiosInstance.patch("/auth/password", {
        currentPassword: pwd.current,
        newPassword: pwd.newPwd,
      });
      toast.success("Password changed successfully");
      setPwd({ current: "", newPwd: "", confirm: "" });
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to change password");
    } finally {
      setPwdSaving(false);
    }
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = [
    "",
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-500",
  ][strength];

  return (
    <div>
      <SectionCard title="Change password">
        <PasswordInput
          label="Current password"
          value={pwd.current}
          onChange={(v) => setPwd((p) => ({ ...p, current: v }))}
          required
        />
        <PasswordInput
          label="New password"
          value={pwd.newPwd}
          onChange={(v) => setPwd((p) => ({ ...p, newPwd: v }))}
          hint="At least 8 characters with a number and special character"
          required
        />
        {pwd.newPwd && (
          <div className="mb-4 -mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors
                  ${i <= strength ? strengthColor : "bg-gray-100"}`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Strength: <strong>{strengthLabel}</strong>
            </p>
          </div>
        )}
        <PasswordInput
          label="Confirm new password"
          value={pwd.confirm}
          onChange={(v) => setPwd((p) => ({ ...p, confirm: v }))}
          required
        />
        {pwd.newPwd && pwd.confirm && pwd.newPwd !== pwd.confirm && (
          <p className="flex items-center gap-1 text-xs text-red-500 -mt-2 mb-3">
            <AlertTriangle size={11} /> Passwords do not match
          </p>
        )}
        <SaveButton
          saving={pwdSaving}
          label="Change password"
          onClick={handlePasswordChange}
        />
      </SectionCard>

      <SectionCard
        title="Two-factor authentication"
        description="Add extra security to your account"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
            <div className="flex items-center gap-3">
              <span className="text-xl">📱</span>
              <div>
                <p className="text-sm font-bold text-gray-700">
                  Authenticator app
                </p>
                <p className="text-xs text-gray-500">
                  Google Authenticator or Authy
                </p>
              </div>
            </div>
            <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-full">
              Enabled
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-xl">💬</span>
              <div>
                <p className="text-sm font-bold text-gray-700">
                  SMS verification
                </p>
                <p className="text-xs text-gray-500">
                  {user?.phone
                    ? `+${user.phone.replace(/\D/g, "").slice(0, 4)}••••`
                    : "Not set"}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="text-xs bg-[#ffc105] text-black font-bold px-3 py-1.5 rounded-full hover:bg-yellow-300 transition"
            >
              Enable
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Danger zone">
        <div className="p-4 rounded-xl border border-red-100 bg-red-50">
          <p className="text-sm font-bold text-red-700 mb-1">
            Delete vendor account
          </p>
          <p className="text-xs text-red-500 mb-3 leading-relaxed">
            Permanently deletes your store, listings, and all data. Cannot be
            undone.
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold
              rounded-xl transition active:scale-95"
          >
            Request account deletion
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
