"use client";
// src/app/admin/users/page.tsx
// Separated Vendors / Users tabs · country filter · click for detail · email

import { useEffect, useState, useCallback } from "react";
import { useAdmin } from "@/src/hooks/useAdmin";
import axiosInstance from "@/src/lib/api/axios";
import { toast } from "react-toastify";
import {
  Search,
  Loader2,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Globe,
  Store,
  Users,
  X,
  Mail,
  ShoppingBag,
  CreditCard,
  Phone,
  MapPin,
  Calendar,
  Send,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
type Tab = "vendors" | "users";
type User = {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  role: string;
  country?: string;
  city?: string;
  createdAt: string;
  subscription?: { plan: string; expiresAt: string };
};

// ── Helpers ────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GH", { dateStyle: "medium" });
}
function daysLeft(iso: string) {
  return Math.max(
    0,
    Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000),
  );
}
const FLAG: Record<string, string> = { Ghana: "🇬🇭", Nigeria: "🇳🇬" };

// ── Role badge ─────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
  const cls =
    role === "vendor"
      ? "bg-green-100 text-green-700"
      : role === "admin"
        ? "bg-purple-100 text-purple-700"
        : "bg-gray-100 text-gray-500";
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>
      {role}
    </span>
  );
}

// ── Email modal ────────────────────────────────────────────────────────────
function EmailModal({
  recipient,
  recipientType,
  onClose,
}: {
  recipient: { _id: string; name: string; email: string };
  recipientType: "user" | "marketer";
  onClose: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required");
      return;
    }
    setSending(true);
    try {
      await axiosInstance.post("/admin/email/send", {
        recipientId: recipient._id,
        recipientType,
        subject: subject.trim(),
        message: message.trim(),
      });
      toast.success(`Email sent to ${recipient.email}`);
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
            <Mail size={16} className="text-[#ffc105]" />
            <span className="font-black text-gray-900 text-sm">
              Email {recipient.name}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={15} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-xs text-gray-400">
            To: <strong>{recipient.email}</strong>
          </p>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#ffc105]"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message…"
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
                />{" "}
                Sending…
              </>
            ) : (
              <>
                <Send size={14} /> Send email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── User detail panel ──────────────────────────────────────────────────────
function UserDetailPanel({
  userId,
  onClose,
  onEmail,
}: {
  userId: string;
  onClose: () => void;
  onEmail: (u: { _id: string; name: string; email: string }) => void;
}) {
  const { data, loading, fetch } = useAdmin<any>(`users/${userId}`);

  useEffect(() => {
    fetch();
  }, [userId]);

  const u = data?.user;
  const purchases = data?.purchases ?? [];
  const ads = data?.ads ?? [];

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
        {/* Header */}
        <div
          className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4
          flex items-center justify-between z-10"
        >
          <span className="font-black text-gray-900">User detail</span>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={16} />
          </button>
        </div>

        {loading || !u ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 size={24} className="animate-spin text-[#ffc105]" />
          </div>
        ) : (
          <div className="p-5 space-y-5">
            {/* Profile */}
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-2xl bg-[#ffc105]/10 flex items-center
                justify-center text-xl font-black text-[#ffc105] flex-shrink-0"
              >
                {u.username?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900">{u.username}</p>
                <p className="text-xs text-gray-500 mt-0.5">{u.email}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <RoleBadge role={u.role} />
                  {u.country && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      {FLAG[u.country] ?? "🌍"} {u.country}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() =>
                  onEmail({ _id: u._id, name: u.username, email: u.email })
                }
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ffc105] text-black
                  font-bold text-xs rounded-xl hover:bg-yellow-300 transition flex-shrink-0"
              >
                <Mail size={12} /> Email
              </button>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  icon: <Phone size={12} />,
                  label: "Phone",
                  value: u.phone || "—",
                },
                {
                  icon: <MapPin size={12} />,
                  label: "City",
                  value: u.city || "—",
                },
                {
                  icon: <Calendar size={12} />,
                  label: "Joined",
                  value: fmtDate(u.createdAt),
                },
                {
                  icon: <Globe size={12} />,
                  label: "Country",
                  value: u.country || "—",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-gray-50 rounded-xl p-3 flex items-start gap-2"
                >
                  <span className="text-gray-400 mt-0.5 flex-shrink-0">
                    {item.icon}
                  </span>
                  <div>
                    <p
                      className="text-[10px] text-gray-400 font-semibold uppercase
                      tracking-wider"
                    >
                      {item.label}
                    </p>
                    <p className="text-xs font-bold text-gray-800 mt-0.5 break-all">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Subscription */}
            {u.subscription?.plan && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                  Subscription
                </p>
                <p className="font-black text-gray-900">
                  {u.subscription.plan}
                </p>
                {u.subscription.expiresAt && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {daysLeft(u.subscription.expiresAt) > 0
                      ? `Expires in ${daysLeft(u.subscription.expiresAt)} days`
                      : "Expired"}
                  </p>
                )}
              </div>
            )}

            {/* Purchase history */}
            {purchases.length > 0 && (
              <div>
                <p
                  className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2
                  flex items-center gap-1.5"
                >
                  <CreditCard size={12} /> Purchase history
                </p>
                <div className="space-y-2">
                  {purchases.slice(0, 5).map((p: any) => (
                    <div
                      key={p._id}
                      className="flex items-center justify-between bg-gray-50
                        rounded-xl px-3 py-2.5"
                    >
                      <div>
                        <p className="text-xs font-bold text-gray-800">
                          {p.title}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {fmtDate(p.createdAt)}
                        </p>
                      </div>
                      <span className="text-xs font-black text-gray-900">
                        {p.currency === "NGN" ? "₦" : "₵"}
                        {p.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active ads */}
            {ads.length > 0 && (
              <div>
                <p
                  className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2
                  flex items-center gap-1.5"
                >
                  <ShoppingBag size={12} /> Active ads ({ads.length})
                </p>
                <div className="space-y-2">
                  {ads.slice(0, 5).map((ad: any) => (
                    <div
                      key={ad._id}
                      className="flex items-center justify-between bg-gray-50
                        rounded-xl px-3 py-2.5"
                    >
                      <p className="text-xs font-bold text-gray-800 truncate flex-1 mr-2">
                        {ad.title}
                      </p>
                      <span className="text-xs font-black text-gray-900 flex-shrink-0">
                        {ad.price?.currency === "NGN" ? "₦" : "₵"}
                        {(ad.price?.amount ?? 0).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Bulk email modal ───────────────────────────────────────────────────────
function BulkEmailModal({
  audience,
  country,
  onClose,
}: {
  audience: string;
  country: string;
  onClose: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const audienceLabel =
    audience === "vendors"
      ? "all vendors"
      : audience === "users"
        ? "all users"
        : "everyone";

  const send = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required");
      return;
    }
    setSending(true);
    try {
      await axiosInstance.post("/admin/email/bulk", {
        audience,
        country: country || undefined,
        subject: subject.trim(),
        message: message.trim(),
      });
      toast.success(
        `Bulk email queued for ${audienceLabel}${country ? ` in ${country}` : ""}`,
      );
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
            <Mail size={16} className="text-[#ffc105]" />
            <span className="font-black text-gray-900 text-sm">
              Bulk email — {audienceLabel}
              {country
                ? ` · ${FLAG[country] ?? ""} ${country}`
                : " · All countries"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={15} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div
            className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-xs
            text-amber-700 font-medium"
          >
            ⚠ This will send an email to every {audienceLabel}
            {country ? ` in ${country}` : ""}. This cannot be undone.
          </div>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#ffc105]"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message…"
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
                />{" "}
                Sending…
              </>
            ) : (
              <>
                <Send size={14} /> Send to {audienceLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const { data, loading, error, fetch, patch } = useAdmin<any>("users");
  const [tab, setTab] = useState<Tab>("vendors");
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [page, setPage] = useState(1);
  const [changing, setChanging] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [emailTarget, setEmailTarget] = useState<{
    _id: string;
    name: string;
    email: string;
  } | null>(null);
  const [bulkAudience, setBulkAudience] = useState<string | null>(null);

  const load = useCallback(
    (overrides?: object) => {
      fetch({
        role: tab === "vendors" ? "vendor" : "guest",
        search,
        country,
        page,
        limit: 20,
        ...overrides,
      });
    },
    [tab, search, country, page],
  );

  useEffect(() => {
    load();
  }, [tab, country]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load({ page: 1 });
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setChanging(userId);
    try {
      await patch(userId, "role", { role: newRole });
      toast.success("Role updated");
      load();
    } catch {
      toast.error("Failed to update role");
    } finally {
      setChanging(null);
    }
  };

  const meta = data?.meta ?? {};
  const users = (data?.users ?? []) as User[];

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900">Users</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {meta.totalVendors ?? 0} vendors · {meta.totalGuests ?? 0} users
            {country ? ` · ${FLAG[country] ?? ""} ${country}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setBulkAudience(tab === "vendors" ? "vendors" : "users")
            }
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold
              bg-white border border-gray-200 text-gray-600 rounded-xl
              hover:bg-gray-50 transition"
          >
            <Mail size={12} />
            Bulk email {tab}
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2">
        {(["vendors", "users"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition
              flex items-center gap-1.5
              ${
                tab === t
                  ? "bg-[#ffc105] text-black"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
          >
            {t === "vendors" ? <Store size={14} /> : <Users size={14} />}
            {t === "vendors" ? "Vendors" : "Users"}
          </button>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex gap-3 flex-wrap">
        <form
          onSubmit={handleSearch}
          className="flex gap-2 flex-1 min-w-[220px]"
        >
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${tab}…`}
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

        {/* Country filter */}
        <select
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setPage(1);
          }}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
        >
          <option value="">🌍 All countries</option>
          <option value="Ghana">🇬🇭 Ghana</option>
          <option value="Nigeria">🇳🇬 Nigeria</option>
        </select>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 size={28} className="animate-spin text-[#ffc105]" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm p-6">{error}</p>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <Users size={32} className="mb-2 opacity-30" />
            <p className="text-sm">No {tab} found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {[
                      "Name",
                      "Contact",
                      "Country",
                      tab === "vendors" ? "Plan" : "Role",
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
                  {users.map((u) => (
                    <tr
                      key={u._id}
                      className="hover:bg-gray-50/50 transition cursor-pointer"
                      onClick={() => setSelectedUser(u._id)}
                    >
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-900">{u.username}</p>
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="px-4 py-3 text-gray-500 max-w-[160px]">
                        <p className="text-xs truncate">{u.email}</p>
                        {u.phone && (
                          <p className="text-[11px] text-gray-400 truncate">
                            {u.phone}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {u.country ? (
                          <span>
                            {FLAG[u.country] ?? "🌍"} {u.country}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {tab === "vendors" ? (
                          u.subscription?.plan ? (
                            <div>
                              <span
                                className="text-xs font-bold text-amber-700
                                bg-amber-50 px-2 py-0.5 rounded-full"
                              >
                                {u.subscription.plan}
                              </span>
                              {u.subscription.expiresAt && (
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                  {daysLeft(u.subscription.expiresAt)}d left
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Free</span>
                          )
                        ) : (
                          <RoleBadge role={u.role} />
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {fmtDate(u.createdAt)}
                      </td>
                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              setEmailTarget({
                                _id: u._id,
                                name: u.username,
                                email: u.email,
                              })
                            }
                            className="p-1.5 hover:bg-[#ffc105]/10 rounded-lg transition"
                            title="Send email"
                          >
                            <Mail size={13} className="text-[#ffc105]" />
                          </button>
                          <select
                            value={u.role}
                            disabled={changing === u._id}
                            onChange={(e) =>
                              handleRoleChange(u._id, e.target.value)
                            }
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1
                              focus:outline-none focus:ring-1 focus:ring-yellow-400
                              disabled:opacity-50 bg-white"
                          >
                            <option value="guest">Guest</option>
                            <option value="vendor">Vendor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {meta.pages > 1 && (
              <div
                className="flex items-center justify-between px-5 py-4
                border-t border-gray-100"
              >
                <p className="text-xs text-gray-400">
                  Page {meta.page} of {meta.pages} · {meta.total} total
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

      {/* ── Modals & panels ── */}
      {selectedUser && (
        <UserDetailPanel
          userId={selectedUser}
          onClose={() => setSelectedUser(null)}
          onEmail={(u) => {
            setSelectedUser(null);
            setEmailTarget(u);
          }}
        />
      )}

      {emailTarget && (
        <EmailModal
          recipient={emailTarget}
          recipientType="user"
          onClose={() => setEmailTarget(null)}
        />
      )}

      {bulkAudience && (
        <BulkEmailModal
          audience={bulkAudience}
          country={country}
          onClose={() => setBulkAudience(null)}
        />
      )}
    </div>
  );
}
