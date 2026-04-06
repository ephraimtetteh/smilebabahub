"use client";
// src/app/admin/marketers/page.tsx
// Detail panel · individual email · bulk email · country filter

import { useEffect, useState, useCallback } from "react";
import { useAdmin } from "@/src/hooks/useAdmin";
import axiosInstance from "@/src/lib/api/axios";
import { toast } from "react-toastify";
import {
  Search,
  Loader2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Mail,
  X,
  Send,
  Users,
  Phone,
  Calendar,
  TrendingUp,
  Globe,
  Copy,
  Check,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GH", { dateStyle: "medium" });
}
const FLAG: Record<string, string> = { Ghana: "🇬🇭", Nigeria: "🇳🇬" };

// ── Copy button ────────────────────────────────────────────────────────────
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="p-1 hover:bg-gray-100 rounded transition">
      {copied ? (
        <Check size={11} className="text-green-500" />
      ) : (
        <Copy size={11} className="text-gray-400" />
      )}
    </button>
  );
}

// ── Email modal ────────────────────────────────────────────────────────────
function EmailModal({
  marketer,
  onClose,
}: {
  marketer: { _id: string; name: string; email: string };
  onClose: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!subject.trim() || !message.trim())
      return toast.error("Subject and message required");
    setSending(true);
    try {
      await axiosInstance.post("/admin/email/send", {
        recipientId: marketer._id,
        recipientType: "marketer",
        subject: subject.trim(),
        message: message.trim(),
      });
      toast.success(`Email sent to ${marketer.email}`);
      onClose();
    } catch {
      toast.error("Failed to send email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Mail size={15} className="text-[#ffc105]" />
            <span className="font-black text-sm">Email {marketer.name}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg"
          >
            <X size={15} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-xs text-gray-400">
            To: <strong>{marketer.email}</strong>
          </p>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#ffc105]"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message…"
            rows={5}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#ffc105] resize-none"
          />
          <button
            onClick={send}
            disabled={sending}
            className="w-full py-3 bg-[#ffc105] text-black font-black rounded-2xl
              text-sm hover:bg-yellow-300 transition disabled:opacity-60
              flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <span
                  className="w-4 h-4 border-2 border-black/20 border-t-black
                  rounded-full animate-spin"
                />
                Sending…
              </>
            ) : (
              <>
                <Send size={14} />
                Send email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Bulk email modal ───────────────────────────────────────────────────────
function BulkEmailModal({ onClose }: { onClose: () => void }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!subject.trim() || !message.trim())
      return toast.error("Subject and message required");
    setSending(true);
    try {
      await axiosInstance.post("/admin/email/bulk", {
        audience: "marketers",
        subject: subject.trim(),
        message: message.trim(),
      });
      toast.success("Bulk email queued for all marketers");
      onClose();
    } catch {
      toast.error("Failed to start bulk email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Mail size={15} className="text-[#ffc105]" />
            <span className="font-black text-sm">
              Bulk email — all marketers
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg"
          >
            <X size={15} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div
            className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2
            text-xs text-amber-700 font-medium"
          >
            ⚠ This sends to every active marketer. Cannot be undone.
          </div>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#ffc105]"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message…"
            rows={6}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#ffc105] resize-none"
          />
          <button
            onClick={send}
            disabled={sending}
            className="w-full py-3 bg-[#ffc105] text-black font-black rounded-2xl
              text-sm hover:bg-yellow-300 transition disabled:opacity-60
              flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <span
                  className="w-4 h-4 border-2 border-black/20 border-t-black
                  rounded-full animate-spin"
                />
                Sending…
              </>
            ) : (
              <>
                <Send size={14} />
                Send to all marketers
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Marketer detail panel ──────────────────────────────────────────────────
function MarketerDetailPanel({
  marketer,
  onClose,
  onEmail,
  onPayout,
}: {
  marketer: any;
  onClose: () => void;
  onEmail: () => void;
  onPayout: (id: string, currency: "GHS" | "NGN") => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
        <div
          className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4
          flex items-center justify-between z-10"
        >
          <span className="font-black text-gray-900">Marketer detail</span>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Profile */}
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-2xl bg-[#ffc105]/10 flex items-center
              justify-center text-xl font-black text-[#ffc105] flex-shrink-0"
            >
              {marketer.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-gray-900">{marketer.name}</p>
              <p className="text-xs text-gray-500">{marketer.email}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                  ${marketer.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                >
                  {marketer.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <button
              onClick={onEmail}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ffc105] text-black
                font-bold text-xs rounded-xl hover:bg-yellow-300 transition flex-shrink-0"
            >
              <Mail size={12} /> Email
            </button>
          </div>

          {/* Referral code */}
          <div className="bg-gray-900 rounded-2xl p-4">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
              Referral code
            </p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-black text-[#ffc105] tracking-widest">
                {marketer.referralCode}
              </span>
              <CopyBtn text={marketer.referralCode} />
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Total referrals",
                value: marketer.totalReferrals ?? 0,
                sym: "",
              },
              {
                label: "Active referrals",
                value: marketer.activeReferrals ?? 0,
                sym: "",
              },
              {
                label: "Earned GHS",
                value: marketer.totalEarningsGHS ?? 0,
                sym: "₵",
              },
              {
                label: "Earned NGN",
                value: marketer.totalEarningsNGN ?? 0,
                sym: "₦",
              },
              {
                label: "Pending GHS",
                value: marketer.pendingPayoutGHS ?? 0,
                sym: "₵",
              },
              {
                label: "Pending NGN",
                value: marketer.pendingPayoutNGN ?? 0,
                sym: "₦",
              },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                  {s.label}
                </p>
                <p className="text-lg font-black text-gray-900 mt-0.5">
                  {s.sym}
                  {Number(s.value).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="space-y-2">
            {marketer.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={13} className="text-gray-400" /> {marketer.phone}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={13} className="text-gray-400" />
              Joined {fmtDate(marketer.createdAt)}
            </div>
            {marketer.lastLogin && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp size={13} className="text-gray-400" />
                Last login {fmtDate(marketer.lastLogin)}
              </div>
            )}
          </div>

          {/* Payout actions */}
          {(marketer.pendingPayoutGHS > 0 || marketer.pendingPayoutNGN > 0) && (
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Mark payout
              </p>
              <div className="flex gap-2">
                {marketer.pendingPayoutGHS > 0 && (
                  <button
                    onClick={() => onPayout(marketer._id, "GHS")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5
                      bg-blue-100 text-blue-700 font-bold text-xs rounded-xl
                      hover:bg-blue-200 transition"
                  >
                    <CheckCircle2 size={13} />
                    Settle ₵{marketer.pendingPayoutGHS.toLocaleString()} GHS
                  </button>
                )}
                {marketer.pendingPayoutNGN > 0 && (
                  <button
                    onClick={() => onPayout(marketer._id, "NGN")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5
                      bg-green-100 text-green-700 font-bold text-xs rounded-xl
                      hover:bg-green-200 transition"
                  >
                    <CheckCircle2 size={13} />
                    Settle ₦{marketer.pendingPayoutNGN.toLocaleString()} NGN
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function AdminMarketersPage() {
  const { data, loading, error, fetch, patch } = useAdmin<any>("marketers");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [paying, setPaying] = useState<string | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [emailTarget, setEmailTarget] = useState<any | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);

  const load = useCallback(
    (overrides?: object) => fetch({ search, page, limit: 20, ...overrides }),
    [search, page],
  );

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load({ page: 1 });
  };

  const handlePayout = async (id: string, currency: "GHS" | "NGN") => {
    setPaying(`${id}-${currency}`);
    try {
      await patch(id, "payout", { currency });
      toast.success(`${currency} payout marked as settled`);
      load();
      if (selected?._id === id) {
        // refresh panel
        setSelected((prev: any) =>
          prev ? { ...prev, [`pendingPayout${currency}`]: 0 } : prev,
        );
      }
    } catch {
      toast.error("Failed to mark payout");
    } finally {
      setPaying(null);
    }
  };

  const meta = data?.meta ?? {};
  const marketers = data?.marketers ?? [];
  const totals = data?.totals ?? {};

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900">Marketers</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {meta.total ?? 0} registered marketers
          </p>
        </div>
        <button
          onClick={() => setBulkOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold
            bg-white border border-gray-200 text-gray-600 rounded-xl
            hover:bg-gray-50 transition"
        >
          <Mail size={12} /> Bulk email marketers
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Total referrals",
            value: totals.totalReferrals ?? 0,
            sym: "",
          },
          {
            label: "Revenue GHS",
            value: totals.totalEarningsGHS ?? 0,
            sym: "₵",
          },
          {
            label: "Revenue NGN",
            value: totals.totalEarningsNGN ?? 0,
            sym: "₦",
          },
          { label: "Pending GHS", value: totals.pendingGHS ?? 0, sym: "₵" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-gray-100 p-4"
          >
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-xl font-black text-gray-900">
              {s.sym}
              {Number(s.value).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, code…"
            className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm
              focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-[#ffc105] text-black font-bold text-sm
            rounded-xl hover:bg-amber-400 transition"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 size={28} className="animate-spin text-[#ffc105]" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm p-6">{error}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {[
                      "Marketer",
                      "Code",
                      "Referrals",
                      "Earned GHS",
                      "Earned NGN",
                      "Pending",
                      "Joined",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-bold
                        text-gray-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {marketers.map((m: any) => (
                    <tr
                      key={m._id}
                      className="hover:bg-gray-50/50 cursor-pointer transition"
                      onClick={() => setSelected(m)}
                    >
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-900">{m.name}</p>
                        <p className="text-xs text-gray-400">{m.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs font-black text-[#ffc105]">
                            {m.referralCode}
                          </span>
                          <CopyBtn text={m.referralCode} />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-center">
                        {m.totalReferrals}
                      </td>
                      <td className="px-4 py-3 font-medium text-sm">
                        ₵{m.totalEarningsGHS.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-medium text-sm">
                        ₦{m.totalEarningsNGN.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          {m.pendingPayoutGHS > 0 && (
                            <p className="text-orange-600 font-bold text-xs">
                              ₵{m.pendingPayoutGHS.toLocaleString()}
                            </p>
                          )}
                          {m.pendingPayoutNGN > 0 && (
                            <p className="text-orange-600 font-bold text-xs">
                              ₦{m.pendingPayoutNGN.toLocaleString()}
                            </p>
                          )}
                          {!m.pendingPayoutGHS && !m.pendingPayoutNGN && (
                            <span className="text-xs text-gray-400">
                              Settled
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {fmtDate(m.createdAt)}
                      </td>
                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setEmailTarget(m)}
                          className="p-1.5 hover:bg-[#ffc105]/10 rounded-lg transition"
                          title="Send email"
                        >
                          <Mail size={13} className="text-[#ffc105]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta.pages > 1 && (
              <div
                className="flex items-center justify-between px-5 py-4
                border-t border-gray-100"
              >
                <p className="text-xs text-gray-400">
                  Page {meta.page} of {meta.pages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const p = page - 1;
                      setPage(p);
                      load({ page: p });
                    }}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg
                      border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => {
                      const p = page + 1;
                      setPage(p);
                      load({ page: p });
                    }}
                    disabled={page >= meta.pages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg
                      border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <MarketerDetailPanel
          marketer={selected}
          onClose={() => setSelected(null)}
          onEmail={() => {
            setEmailTarget(selected);
            setSelected(null);
          }}
          onPayout={handlePayout}
        />
      )}

      {/* Individual email */}
      {emailTarget && (
        <EmailModal
          marketer={emailTarget}
          onClose={() => setEmailTarget(null)}
        />
      )}

      {/* Bulk email */}
      {bulkOpen && <BulkEmailModal onClose={() => setBulkOpen(false)} />}
    </div>
  );
}
