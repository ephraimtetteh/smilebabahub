"use client";
// src/app/admin/users/ModerationActions.tsx
//
// Suspend / lift / remove an account, for fraud and abuse reports.
// Shown at the bottom of the user detail panel.
//
//   Suspend  — reversible. Signs them out everywhere, hides their listings,
//              stops payouts, blocks messages to them.
//   Remove   — permanent, for confirmed fraud. Anonymises the account and
//              bans the email/phone so they can't sign up again. Orders,
//              bookings and payments are kept as records.
//
// The server enforces every rule here (admin only, not yourself, not
// another admin, email typed to confirm). This UI just makes it clear.

import { useState } from "react";
import axiosInstance from "@/src/lib/api/axios";
import { toast } from "react-toastify";
import { ShieldAlert, ShieldCheck, Trash2, Loader2, History } from "lucide-react";

type Target = {
  _id: string;
  username?: string;
  email?: string;
  role?: string;
  isSuspended?: boolean;
  isDeleted?: boolean;
  suspensionReason?: string;
  suspendedAt?: string;
};

type AuditEntry = {
  _id: string;
  action: string;
  reason?: string;
  createdAt: string;
  admin?: { username?: string; email?: string };
};

const ACTION_LABEL: Record<string, string> = {
  suspend: "Suspended",
  unsuspend: "Suspension lifted",
  remove_fraud: "Removed for fraud",
};

export default function ModerationActions({
  user,
  onChanged,
}: {
  user: Target;
  onChanged: () => void;
}) {
  const [mode, setMode] = useState<null | "suspend" | "remove">(null);
  const [reason, setReason] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<AuditEntry[] | null>(null);

  if (user.role === "admin") {
    return (
      <p className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
        This is an admin account. Change the role first if it needs to be suspended.
      </p>
    );
  }

  const reset = () => {
    setMode(null);
    setReason("");
    setConfirmEmail("");
  };

  const explain = (r: any) => {
    const bits = [
      r.listingsHidden != null && `${r.listingsHidden} listing(s) hidden`,
      r.listingsRemoved != null && `${r.listingsRemoved} listing(s) removed`,
      r.listingsRestored != null && `${r.listingsRestored} listing(s) restored`,
      r.ordersCancelled ? `${r.ordersCancelled} unpaid order(s) cancelled` : null,
      r.bookingsCancelled ? `${r.bookingsCancelled} unpaid booking(s) cancelled` : null,
    ].filter(Boolean);
    return bits.join(" · ");
  };

  const run = async () => {
    if (busy) return;
    setBusy(true);
    try {
      let res;
      if (mode === "suspend") {
        res = await axiosInstance.patch(`/admin/users/${user._id}/suspend`, { reason });
      } else if (mode === "remove") {
        res = await axiosInstance.delete(`/admin/users/${user._id}`, {
          data: { reason, confirmEmail },
        });
      }
      const r = res?.data ?? {};
      toast.success(`${r.message ?? "Done"} ${explain(r)}`.trim(), { autoClose: 6000 });
      if (r.ordersInEscrow || r.bookingsInEscrow) {
        toast.warn(
          `${r.ordersInEscrow ?? 0} order(s) and ${r.bookingsInEscrow ?? 0} booking(s) are paid and in escrow — refund the buyers before closing this case.`,
          { autoClose: false },
        );
      }
      reset();
      onChanged();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "That didn't work. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const lift = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const { data } = await axiosInstance.patch(`/admin/users/${user._id}/unsuspend`, {});
      toast.success(`${data.message} ${explain(data)}`.trim());
      onChanged();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Couldn't lift the suspension.");
    } finally {
      setBusy(false);
    }
  };

  const loadHistory = async () => {
    try {
      const { data } = await axiosInstance.get(`/admin/users/${user._id}/audit`);
      setHistory(data.entries ?? []);
    } catch {
      setHistory([]);
    }
  };

  const canSubmit =
    reason.trim().length >= 3 &&
    (mode !== "remove" ||
      confirmEmail.trim().toLowerCase() === String(user.email ?? "").toLowerCase());

  return (
    <div className="border-t border-gray-100 pt-5 space-y-3">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
        <ShieldAlert size={12} /> Trust &amp; safety
      </p>

      {user.isDeleted ? (
        <div className="bg-gray-100 rounded-xl p-3 text-xs text-gray-600">
          This account was removed{user.suspensionReason ? `: ${user.suspensionReason}` : "."}
        </div>
      ) : user.isSuspended ? (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 space-y-2">
          <p className="text-xs font-bold text-red-700">
            Suspended{user.suspendedAt ? ` on ${new Date(user.suspendedAt).toLocaleDateString()}` : ""}
          </p>
          {user.suspensionReason && (
            <p className="text-xs text-red-600">Reason: {user.suspensionReason}</p>
          )}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={lift}
              disabled={busy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-800 font-bold text-xs rounded-xl hover:bg-gray-50 disabled:opacity-50"
            >
              <ShieldCheck size={12} /> Lift suspension
            </button>
            <button
              onClick={() => setMode("remove")}
              disabled={busy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 size={12} /> Remove permanently
            </button>
          </div>
        </div>
      ) : (
        !mode && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setMode("suspend")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs rounded-xl hover:bg-amber-100"
            >
              <ShieldAlert size={12} /> Suspend account
            </button>
            <button
              onClick={() => setMode("remove")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 font-bold text-xs rounded-xl hover:bg-red-100"
            >
              <Trash2 size={12} /> Remove for fraud
            </button>
          </div>
        )
      )}

      {mode && !user.isDeleted && (
        <div
          className={`rounded-2xl p-4 space-y-3 border ${
            mode === "remove" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
          }`}
        >
          <p className="text-sm font-black text-gray-900">
            {mode === "remove" ? "Remove this account permanently?" : "Suspend this account?"}
          </p>
          <ul className="text-xs text-gray-600 list-disc pl-4 space-y-0.5">
            <li>Signed out on every device immediately</li>
            <li>{mode === "remove" ? "All listings taken down for good" : "Listings hidden (they come back if you lift it)"}</li>
            <li>Payouts stop; nobody can message them</li>
            {mode === "remove" && (
              <>
                <li>Name, email, phone and payout details wiped</li>
                <li>Email and phone banned from signing up again</li>
                <li>Orders, bookings and payments kept as records</li>
              </>
            )}
            <li>They get an email telling them, with how to appeal</li>
          </ul>

          <label className="block">
            <span className="text-[11px] font-semibold text-gray-500">Reason (goes in the audit log)</span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="e.g. Took payment for 3 phones and never delivered — reports #…"
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </label>

          {mode === "remove" && (
            <label className="block">
              <span className="text-[11px] font-semibold text-gray-500">
                Type <span className="font-mono text-gray-800">{user.email}</span> to confirm
              </span>
              <input
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                autoComplete="off"
                className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-red-300"
              />
            </label>
          )}

          <div className="flex gap-2">
            <button
              onClick={run}
              disabled={!canSubmit || busy}
              className={`flex items-center gap-1.5 px-4 py-2 font-bold text-xs rounded-xl text-white disabled:opacity-40 ${
                mode === "remove" ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {busy && <Loader2 size={12} className="animate-spin" />}
              {mode === "remove" ? "Remove account" : "Suspend account"}
            </button>
            <button onClick={reset} className="px-4 py-2 text-xs font-bold text-gray-600 rounded-xl hover:bg-white">
              Cancel
            </button>
          </div>
        </div>
      )}

      <button
        onClick={loadHistory}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 hover:text-gray-600"
      >
        <History size={11} /> Moderation history
      </button>
      {history && (
        <div className="space-y-1.5">
          {history.length === 0 ? (
            <p className="text-xs text-gray-400">No moderation actions yet.</p>
          ) : (
            history.map((h) => (
              <div key={h._id} className="bg-gray-50 rounded-xl px-3 py-2">
                <p className="text-xs font-bold text-gray-800">
                  {ACTION_LABEL[h.action] ?? h.action} · {new Date(h.createdAt).toLocaleString()}
                </p>
                <p className="text-[11px] text-gray-500">
                  by {h.admin?.username ?? "admin"}
                  {h.reason ? ` — ${h.reason}` : ""}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
