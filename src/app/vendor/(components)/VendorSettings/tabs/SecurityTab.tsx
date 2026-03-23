"use client";

import { useState } from "react";
import { SectionCard, Field, Input, SaveButton } from "../(component)/Ui";

const SESSIONS = [
  {
    device: "Chrome on Windows",
    location: "Kumasi, Ghana",
    time: "Now",
    current: true,
  },
  {
    device: "Safari on iPhone",
    location: "Accra, Ghana",
    time: "2 hours ago",
    current: false,
  },
  {
    device: "Firefox on MacOS",
    location: "Lagos, Nigeria",
    time: "3 days ago",
    current: false,
  },
];

export default function SecurityTab() {
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const toggle = (k: keyof typeof show) =>
    setShow((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div>
      {/* ── Change Password ── */}
      <SectionCard title="Change Password">
        <Field label="Current password" required>
          <div className="relative">
            <Input
              type={show.old ? "text" : "password"}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => toggle("old")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs hover:text-gray-600"
            >
              {show.old ? "Hide" : "Show"}
            </button>
          </div>
        </Field>
        <Field
          label="New password"
          hint="At least 8 characters with a number and special character"
          required
        >
          <div className="relative">
            <Input
              type={show.new ? "text" : "password"}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => toggle("new")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs hover:text-gray-600"
            >
              {show.new ? "Hide" : "Show"}
            </button>
          </div>
        </Field>
        <Field label="Confirm new password" required>
          <div className="relative">
            <Input
              type={show.confirm ? "text" : "password"}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => toggle("confirm")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs hover:text-gray-600"
            >
              {show.confirm ? "Hide" : "Show"}
            </button>
          </div>
        </Field>
        <SaveButton />
      </SectionCard>

      {/* ── Two-Factor Auth ── */}
      <SectionCard
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-green-50 border border-green-100">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl sm:text-2xl flex-shrink-0">📱</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-700">
                  Authenticator app
                </p>
                <p className="text-xs text-gray-500">
                  Google Authenticator or Authy
                </p>
              </div>
            </div>
            <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 sm:px-3 py-1 rounded-full flex-shrink-0">
              Enabled
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl sm:text-2xl flex-shrink-0">💬</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-700">
                  SMS verification
                </p>
                <p className="text-xs text-gray-500">+233 •••• 456</p>
              </div>
            </div>
            <button
              type="button"
              className="text-xs bg-orange-500 text-white font-semibold px-3 py-1.5 rounded-full
                hover:bg-orange-600 transition flex-shrink-0 active:scale-95"
            >
              Enable
            </button>
          </div>
        </div>
      </SectionCard>

      {/* ── Active Sessions ── */}
      <SectionCard
        title="Active Sessions"
        description="Devices currently logged into your account"
      >
        <div className="space-y-0">
          {SESSIONS.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 py-3 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-lg sm:text-xl flex-shrink-0">
                  {s.device.includes("iPhone") ? "📱" : "💻"}
                </span>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                    {s.device}
                  </p>
                  <p className="text-xs text-gray-400">
                    {s.location} · {s.time}
                  </p>
                </div>
              </div>
              {s.current ? (
                <span className="text-xs bg-green-100 text-green-600 font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
                  Current
                </span>
              ) : (
                <button
                  type="button"
                  className="text-xs text-red-500 font-medium hover:underline flex-shrink-0"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-3 w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-sm
            font-medium hover:bg-red-50 transition active:scale-[0.99]"
        >
          Sign out all other devices
        </button>
      </SectionCard>

      {/* ── Danger Zone ── */}
      <SectionCard title="Danger Zone">
        <div className="p-4 rounded-xl border border-red-100 bg-red-50">
          <p className="text-sm font-semibold text-red-700 mb-1">
            Delete vendor account
          </p>
          <p className="text-xs text-red-500 mb-3 leading-relaxed">
            This will permanently delete your store, listings, and all data.
            This cannot be undone.
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold
              rounded-xl transition active:scale-95"
          >
            Request account deletion
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
