"use client";
// src/app/admin/campaigns/page.tsx
//
// Email campaigns: write once, send to an audience, watch it go out.
//
// Sending happens on the server in batches (lib/campaignRunner.js) and
// survives restarts, so this page can be closed while it runs. Always send
// yourself a test first — it goes only to your admin email.

import { useCallback, useEffect, useState } from "react";
import axiosInstance from "@/src/lib/api/axios";
import { toast } from "react-toastify";
import { Mail, Send, Pause, Play, X, Loader2, FlaskConical, RefreshCw, AlertTriangle } from "lucide-react";

type Campaign = {
  _id: string;
  subject: string;
  audience: { segment: string; country?: string; testEmail?: string };
  status: "sending" | "paused" | "completed" | "failed" | "cancelled";
  total: number;
  sent: number;
  failed: number;
  skipped: number;
  lastError?: string;
  resumeAfter?: string | null;
  createdAt: string;
  createdBy?: { username?: string };
};

const SEGMENTS = [
  { id: "all", label: "Everyone" },
  { id: "buyers", label: "Buyers (not selling)" },
  { id: "vendors", label: "Vendors & stores" },
  { id: "subscribers", label: "Paid subscribers" },
  { id: "marketers", label: "Marketers" },
];

const STATUS_STYLE: Record<Campaign["status"], string> = {
  sending: "bg-blue-50 text-blue-700",
  paused: "bg-amber-50 text-amber-700",
  completed: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
  cancelled: "bg-gray-100 text-gray-500",
};

const inputCls =
  "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-yellow-400";

export default function AdminCampaignsPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [segment, setSegment] = useState("all");
  const [country, setCountry] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [provider, setProvider] = useState<string | null | undefined>(undefined);
  const [sending, setSending] = useState<null | "test" | "real">(null);
  const [testedSubject, setTestedSubject] = useState<string | null>(null);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const loadList = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/admin/campaigns");
      setCampaigns(data.campaigns ?? []);
      setProvider(data.provider ?? null);
    } catch {
      /* keep what we have */
    } finally {
      setLoadingList(false);
    }
  }, []);

  // Audience size as you change it
  useEffect(() => {
    let cancelled = false;
    setCount(null);
    axiosInstance
      .get("/admin/campaigns/preview", { params: { segment, country: country || undefined } })
      .then(({ data }) => !cancelled && setCount(data.count ?? 0))
      .catch(() => !cancelled && setCount(null));
    return () => {
      cancelled = true;
    };
  }, [segment, country]);

  // Refresh progress every 5 s while anything is sending
  useEffect(() => {
    loadList();
  }, [loadList]);
  const active = campaigns.some((c) => c.status === "sending");
  useEffect(() => {
    if (!active) return;
    const t = setInterval(loadList, 5000);
    return () => clearInterval(t);
  }, [active, loadList]);

  const body = () => ({
    subject: subject.trim(),
    message: message.trim(),
    ctaLabel: ctaLabel.trim() || undefined,
    ctaUrl: ctaUrl.trim() || undefined,
    segment,
    country: country || undefined,
  });

  const send = async (test: boolean) => {
    if (subject.trim().length < 3 || message.trim().length < 10) {
      toast.error("Add a subject and a message first.");
      return;
    }
    if (!test) {
      const ok = window.confirm(
        `Send "${subject.trim()}" to ${count?.toLocaleString() ?? "this audience"} people? This can't be unsent.`,
      );
      if (!ok) return;
    }
    setSending(test ? "test" : "real");
    try {
      const { data } = await axiosInstance.post("/admin/campaigns", { ...body(), test });
      toast.success(data.message, { autoClose: 7000 });
      if (test) setTestedSubject(subject.trim());
      else {
        setSubject("");
        setMessage("");
        setCtaLabel("");
        setCtaUrl("");
        setTestedSubject(null);
      }
      loadList();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Couldn't start sending.");
    } finally {
      setSending(null);
    }
  };

  const act = async (id: string, action: "pause" | "resume" | "cancel") => {
    if (action === "cancel" && !window.confirm("Stop this campaign? People not reached yet won't get it.")) return;
    try {
      await axiosInstance.post(`/admin/campaigns/${id}/${action}`);
      loadList();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "That didn't work.");
    }
  };

  const testedThis = testedSubject === subject.trim() && !!subject.trim();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <Mail size={20} /> Email campaigns
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Sends in the background in batches — you can leave this page. People who unsubscribed,
          and suspended accounts, are skipped automatically.
        </p>
      </div>

      {provider === null && (
        <div className="flex gap-2 items-start bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 text-sm">
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
          <span>
            No email provider is set on the server, so nothing can be sent. In Render → Environment add{" "}
            <code className="font-mono">RESEND_API_KEY</code> and{" "}
            <code className="font-mono">EMAIL_FROM</code>, then redeploy.
          </span>
        </div>
      )}

      {/* ── Compose ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-semibold text-gray-500">Audience</span>
            <select value={segment} onChange={(e) => setSegment(e.target.value)} className={`${inputCls} mt-1`}>
              {SEGMENTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-gray-500">Country</span>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={segment === "marketers"}
              className={`${inputCls} mt-1 disabled:opacity-50`}
            >
              <option value="">Ghana &amp; Nigeria</option>
              <option value="Ghana">🇬🇭 Ghana</option>
              <option value="Nigeria">🇳🇬 Nigeria</option>
            </select>
          </label>
        </div>
        <p className="text-xs text-gray-500">
          {count === null ? "Counting…" : `${count.toLocaleString()} people will get this.`}
        </p>

        <label className="block">
          <span className="text-xs font-semibold text-gray-500">Subject</span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={150}
            placeholder="e.g. Book your Christmas stay on SmileStays"
            className={`${inputCls} mt-1`}
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-gray-500">
            Message <span className="font-normal text-gray-400">(plain text — line breaks and links are kept; it starts with “Hi &lt;name&gt;,”)</span>
          </span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            maxLength={10000}
            className={`${inputCls} mt-1`}
          />
        </label>

        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-semibold text-gray-500">Button label (optional)</span>
            <input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} maxLength={40} placeholder="Shop now" className={`${inputCls} mt-1`} />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-gray-500">Button link</span>
            <input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://www.smilebabahub.com/…" className={`${inputCls} mt-1`} />
          </label>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => send(true)}
            disabled={!!sending}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 hover:bg-gray-50 disabled:opacity-50"
          >
            {sending === "test" ? <Loader2 size={14} className="animate-spin" /> : <FlaskConical size={14} />}
            Send me a test
          </button>
          <button
            onClick={() => send(false)}
            disabled={!!sending || !count || provider === null}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#ffc105] text-sm font-black text-black hover:bg-yellow-300 disabled:opacity-40"
          >
            {sending === "real" ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Send to {count?.toLocaleString() ?? "…"} people
          </button>
          {!testedThis && subject.trim() && (
            <span className="self-center text-xs text-amber-700">Tip: send yourself a test first.</span>
          )}
        </div>
      </div>

      {/* ── History ── */}
      <div className="bg-white border border-gray-100 rounded-2xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <p className="text-sm font-black text-gray-900">Recent campaigns</p>
          <button onClick={loadList} className="p-1.5 rounded-lg hover:bg-gray-100" aria-label="Refresh">
            <RefreshCw size={14} />
          </button>
        </div>
        {loadingList ? (
          <div className="flex justify-center py-10">
            <Loader2 size={20} className="animate-spin text-[#ffc105]" />
          </div>
        ) : campaigns.length === 0 ? (
          <p className="text-sm text-gray-400 px-5 py-8 text-center">No campaigns yet.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {campaigns.map((c) => {
              const done = c.sent + c.failed + c.skipped;
              const pct = c.total ? Math.min(100, Math.round((done / c.total) * 100)) : 0;
              const isTest = c.audience?.segment === "test";
              return (
                <li key={c._id} className="px-5 py-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {isTest && <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-full mr-1.5">TEST</span>}
                        {c.subject}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {new Date(c.createdAt).toLocaleString()} ·{" "}
                        {isTest
                          ? c.audience.testEmail
                          : `${SEGMENTS.find((s) => s.id === c.audience?.segment)?.label ?? c.audience?.segment}${c.audience?.country ? ` · ${c.audience.country}` : ""}`}
                        {c.createdBy?.username ? ` · by ${c.createdBy.username}` : ""}
                      </p>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${STATUS_STYLE[c.status]}`}>
                      {c.status}
                    </span>
                  </div>

                  {!isTest && (
                    <>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#ffc105] transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[11px] text-gray-500">
                        {c.sent.toLocaleString()} sent · {c.failed} failed · {c.skipped} skipped · of{" "}
                        {c.total.toLocaleString()} ({pct}%)
                      </p>
                    </>
                  )}
                  {c.lastError && c.status !== "completed" && (
                    <p className="text-[11px] text-amber-700">{c.lastError}</p>
                  )}

                  {!isTest && (
                    <div className="flex gap-2">
                      {c.status === "sending" && (
                        <button onClick={() => act(c._id, "pause")} className="flex items-center gap-1 text-[11px] font-bold text-gray-600 hover:text-gray-900">
                          <Pause size={11} /> Pause
                        </button>
                      )}
                      {(c.status === "paused" || c.status === "failed") && (
                        <button onClick={() => act(c._id, "resume")} className="flex items-center gap-1 text-[11px] font-bold text-gray-600 hover:text-gray-900">
                          <Play size={11} /> Resume
                        </button>
                      )}
                      {(c.status === "sending" || c.status === "paused") && (
                        <button onClick={() => act(c._id, "cancel")} className="flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700">
                          <X size={11} /> Stop
                        </button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
