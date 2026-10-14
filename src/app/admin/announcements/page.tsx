"use client";

// client/src/app/admin/announcements/page.tsx
//
// Compose an announcement, see who it reaches, send it, watch it go.
//
// ─── THE PART THAT MATTERS MOST ──────────────────────────────────────
//
// The audience count updates as the filters change, before anything is
// sent. Sending to the wrong ten thousand people is not reversible —
// there's no unsend, and a notification that has already buzzed a phone
// cannot be recalled.
//
// So the count is prominent, the confirmation states the number, and the
// send button says how many people it's about to reach rather than just
// "Send".

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Megaphone,
  Users,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  BellOff,
  RefreshCw,
  ChevronLeft,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";

import axiosInstance from "@/src/lib/api/axios";

type Segment = "all" | "vendors" | "buyers" | "subscribers";

const SEGMENTS: Array<{ id: Segment; label: string; hint: string }> = [
  { id: "all", label: "Everyone", hint: "Every active account" },
  { id: "vendors", label: "Vendors", hint: "Anyone with a store" },
  { id: "buyers", label: "Buyers", hint: "People who don't sell" },
  { id: "subscribers", label: "Subscribers", hint: "On a paid plan" },
];

const COUNTRIES = [
  { id: "", label: "Both countries" },
  { id: "Ghana", label: "Ghana only" },
  { id: "Nigeria", label: "Nigeria only" },
];

interface Preview {
  total: number;
  withPush: number;
  withoutPush: number;
}

interface Broadcast {
  _id: string;
  title: string;
  message: string;
  status: "sending" | "completed" | "failed";
  total: number;
  delivered: number;
  pushed: number;
  failed: number;
  audience: { segment: string; country?: string };
  createdAt: string;
  createdBy?: { username?: string };
  error?: string;
}

export default function AnnouncementsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [actionLabel, setActionLabel] = useState("");

  const [segment, setSegment] = useState<Segment>("all");
  const [country, setCountry] = useState("");
  const [sendPush, setSendPush] = useState(true);

  const [preview, setPreview] = useState<Preview | null>(null);
  const [counting, setCounting] = useState(false);
  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const [history, setHistory] = useState<Broadcast[]>([]);

  // ─── Audience count ───────────────────────────────────────────────
  const countAudience = useCallback(async () => {
    setCounting(true);
    try {
      const { data } = await axiosInstance.get("/admin/broadcasts/preview", {
        params: { segment, country: country || undefined },
      });
      setPreview(data);
    } catch {
      setPreview(null);
    } finally {
      setCounting(false);
    }
  }, [segment, country]);

  useEffect(() => {
    countAudience();
  }, [countAudience]);

  // ─── History ──────────────────────────────────────────────────────
  const loadHistory = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/admin/broadcasts?limit=10");
      setHistory(data.broadcasts ?? []);
    } catch {
      /* the page still works without it */
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Poll while something is in flight, so progress is visible rather
  // than the admin wondering whether it worked
  useEffect(() => {
    const active = history.some((b) => b.status === "sending");
    if (!active) return;
    const t = setInterval(loadHistory, 3000);
    return () => clearInterval(t);
  }, [history, loadHistory]);

  // ─── Send ─────────────────────────────────────────────────────────
  const send = async () => {
    setSending(true);
    try {
      const { data } = await axiosInstance.post("/admin/broadcasts", {
        title: title.trim(),
        message: message.trim(),
        actionUrl: actionUrl.trim() || undefined,
        actionLabel: actionLabel.trim() || undefined,
        segment,
        country: country || undefined,
        sendPush,
      });

      toast.success(data.message);
      setTitle("");
      setMessage("");
      setActionUrl("");
      setActionLabel("");
      setConfirming(false);
      loadHistory();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Couldn't send that announcement.",
      );
    } finally {
      setSending(false);
    }
  };

  const resume = async (id: string) => {
    try {
      const { data } = await axiosInstance.post(
        `/admin/broadcasts/${id}/resume`,
      );
      toast.info(data.message);
      loadHistory();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Couldn't resume that.");
    }
  };

  const canSend =
    title.trim().length >= 3 &&
    message.trim().length >= 10 &&
    (preview?.total ?? 0) > 0 &&
    !sending;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin"
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-gray-400 transition hover:text-gray-600"
        >
          <ChevronLeft size={13} />
          Back to admin
        </Link>

        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100">
            <Megaphone size={20} className="text-amber-600" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Announcements
            </h1>
            <p className="text-sm text-gray-500">
              Send an in-app notification and a push to everyone who matches.
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          {/* ═══ Compose ═══ */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <h2 className="text-sm font-bold text-gray-900">Message</h2>

              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                  Title
                  <span className="ml-1.5 font-normal text-gray-400">
                    {title.length}/80
                  </span>
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 80))}
                  placeholder="New: book apartments on SmileBaba"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-amber-400"
                />
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                  Message
                  <span className="ml-1.5 font-normal text-gray-400">
                    {message.length}/500
                  </span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                  rows={4}
                  placeholder="Find furnished apartments and short lets across Accra and Lagos, with your payment held safely until you check in."
                  className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-amber-400"
                />
                {/* A push preview truncates around here on most phones */}
                {message.length > 120 && (
                  <p className="mt-1.5 text-[11px] text-gray-400">
                    Phones show roughly the first 120 characters in the tray.
                    The full text appears in the app.
                  </p>
                )}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                    Opens{" "}
                    <span className="font-normal text-gray-400">optional</span>
                  </label>
                  <input
                    value={actionUrl}
                    onChange={(e) => setActionUrl(e.target.value)}
                    placeholder="/ads?category=apartments"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                    Button label{" "}
                    <span className="font-normal text-gray-400">optional</span>
                  </label>
                  <input
                    value={actionLabel}
                    onChange={(e) =>
                      setActionLabel(e.target.value.slice(0, 40))
                    }
                    placeholder="Browse stays"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* ═══ Audience ═══ */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <h2 className="text-sm font-bold text-gray-900">Who gets it</h2>

              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {SEGMENTS.map((s) => {
                  const on = segment === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSegment(s.id)}
                      className={`rounded-xl border p-3 text-left transition ${
                        on
                          ? "border-amber-400 bg-amber-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="block text-[13px] font-bold text-gray-900">
                        {s.label}
                      </span>
                      <span className="mt-0.5 block text-[10.5px] leading-tight text-gray-400">
                        {s.hint}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex gap-2">
                {COUNTRIES.map((c) => {
                  const on = country === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCountry(c.id)}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                        on
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>

              <label className="mt-4 flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={sendPush}
                  onChange={(e) => setSendPush(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-amber-400"
                />
                <span className="text-[12.5px] leading-relaxed text-gray-600">
                  Also send a push notification.{" "}
                  <span className="text-gray-400">
                    Everyone gets the in-app notification either way.
                  </span>
                </span>
              </label>
            </div>
          </div>

          {/* ═══ Sidebar ═══ */}
          <div className="space-y-4">
            {/* Reach */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900">Reach</h2>
                <button
                  onClick={countAudience}
                  className="text-gray-300 transition hover:text-gray-600"
                  aria-label="Recount"
                >
                  <RefreshCw
                    size={13}
                    className={counting ? "animate-spin" : ""}
                  />
                </button>
              </div>

              {counting && !preview ? (
                <div className="py-6 text-center">
                  <Loader2
                    size={20}
                    className="mx-auto animate-spin text-amber-400"
                  />
                </div>
              ) : preview ? (
                <>
                  <p className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
                    {preview.total.toLocaleString()}
                  </p>
                  <p className="text-[12.5px] text-gray-500">
                    {preview.total === 1 ? "person" : "people"} will see this
                  </p>

                  {sendPush && (
                    <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-2 text-[12px] text-gray-600">
                        <Smartphone size={13} className="text-emerald-500" />
                        <span className="font-semibold">
                          {preview.withPush.toLocaleString()}
                        </span>
                        get a push
                      </div>
                      {/* Worth showing. An admin expecting ten thousand
                          phones to buzz should know it's three thousand. */}
                      {preview.withoutPush > 0 && (
                        <div className="flex items-center gap-2 text-[12px] text-gray-500">
                          <BellOff size={13} className="text-gray-300" />
                          <span className="font-semibold">
                            {preview.withoutPush.toLocaleString()}
                          </span>
                          in-app only
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <p className="mt-3 text-[12.5px] text-gray-400">
                  Couldn&apos;t count that audience.
                </p>
              )}
            </div>

            {/* Send */}
            {!confirming ? (
              <button
                onClick={() => setConfirming(true)}
                disabled={!canSend}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 py-3.5 text-sm font-bold text-gray-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
              >
                <Send size={15} />
                Send to {(preview?.total ?? 0).toLocaleString()}
              </button>
            ) : (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle
                    size={16}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />
                  <div>
                    <p className="text-[13px] font-bold text-amber-900">
                      Send to {(preview?.total ?? 0).toLocaleString()} people?
                    </p>
                    {/* Said plainly, because it's true and it's the whole
                        reason for the extra step */}
                    <p className="mt-1 text-[12px] leading-relaxed text-amber-700">
                      This can&apos;t be undone. A notification that has already
                      reached a phone can&apos;t be recalled.
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 flex gap-2">
                  <button
                    onClick={() => setConfirming(false)}
                    disabled={sending}
                    className="flex-1 rounded-xl border border-amber-300 bg-white py-2.5 text-[13px] font-semibold text-amber-800 transition hover:bg-amber-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={send}
                    disabled={sending}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gray-900 py-2.5 text-[13px] font-bold text-white transition hover:bg-black disabled:opacity-60"
                  >
                    {sending ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        Sending
                      </>
                    ) : (
                      "Yes, send it"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Preview */}
            {(title || message) && (
              <div className="rounded-2xl border border-gray-100 bg-white p-4">
                <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  How it looks
                </p>
                <div className="rounded-xl bg-gray-900 p-3">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-[10px] font-bold text-gray-900">
                      SB
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-white">
                        {title || "Title"}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-white/60">
                        {message || "Your message will appear here."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══ History ═══ */}
        {history.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-bold text-gray-900">Recent</h2>
            <div className="space-y-2.5">
              {history.map((b) => (
                <HistoryRow key={b._id} broadcast={b} onResume={resume} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ─── History row ─────────────────────────────────────────────────────
function HistoryRow({
  broadcast: b,
  onResume,
}: {
  broadcast: Broadcast;
  onResume: (id: string) => void;
}) {
  const pct = b.total > 0 ? Math.round((b.delivered / b.total) * 100) : 0;

  const tone =
    b.status === "completed"
      ? { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle2 }
      : b.status === "failed"
        ? { bg: "bg-red-50", text: "text-red-700", icon: AlertTriangle }
        : { bg: "bg-blue-50", text: "text-blue-700", icon: Clock };

  const Icon = tone.icon;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone.bg}`}
        >
          <Icon size={15} className={tone.text} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-bold text-gray-900">
            {b.title}
          </p>
          <p className="mt-0.5 line-clamp-1 text-[12px] text-gray-500">
            {b.message}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400">
            <span className="capitalize">{b.audience?.segment ?? "all"}</span>
            {b.audience?.country && <span>{b.audience.country}</span>}
            <span>
              {b.delivered.toLocaleString()} of {b.total.toLocaleString()}{" "}
              notified
            </span>
            {b.pushed > 0 && <span>{b.pushed.toLocaleString()} pushed</span>}
            {b.failed > 0 && (
              <span className="text-red-500">
                {b.failed.toLocaleString()} failed
              </span>
            )}
          </div>

          {b.status === "sending" && (
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-amber-400 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          )}

          {b.status === "failed" && (
            <div className="mt-2 flex items-center gap-3">
              <p className="flex-1 text-[11px] text-red-600">{b.error}</p>
              {/* Resumes from lastUserId, so nobody gets it twice */}
              <button
                onClick={() => onResume(b._id)}
                className="shrink-0 rounded-lg bg-gray-900 px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-black"
              >
                Resume
              </button>
            </div>
          )}
        </div>

        <span className="shrink-0 text-[11px] text-gray-400">
          {new Date(b.createdAt).toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>
    </div>
  );
}
