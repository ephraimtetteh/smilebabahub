"use client";
// src/app/admin/system/page.tsx
// System health dashboard + report generation.

import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/src/lib/api/axios";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  RefreshCw,
  Download,
  FileText,
  Clock,
  Server,
  Database,
  Mail,
  CreditCard,
  Cloud,
  Zap,
  AlertOctagon,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────
type CheckStatus = "ok" | "warning" | "error";
type Check = {
  service: string;
  status: CheckStatus;
  ms?: number;
  note?: string;
  value?: number;
};
type HealthData = {
  overall: string;
  uptime: number;
  checks: Check[];
  ts: string;
};
type ErrorEntry = {
  id: string;
  ts: string;
  source: string;
  message: string;
  stack: string | null;
  context: Record<string, any>;
};

type ReportData = {
  period: string;
  generatedAt: string;
  since: string;
  summary: {
    newUsers: number;
    newVendors: number;
    newMarketers: number;
    newAds: number;
    revenue: Record<string, { total: number; count: number }>;
    successPayments: number;
    failedPayments: number;
    paymentSuccessRate: number;
  };
  topAds: {
    title: string;
    views: number;
    contactClicks: number;
    conversion: string;
    country?: string;
    vendor?: string;
  }[];
  topPages: { path: string; views: number }[];
};

// ── Helpers ────────────────────────────────────────────────────────────────
const uptime = (s: number) => {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const ServiceIcon: Record<string, React.ReactNode> = {
  MongoDB: <Database size={14} />,
  Redis: <Zap size={14} />,
  Cloudinary: <Cloud size={14} />,
  "Gmail SMTP": <Mail size={14} />,
  "Payment flow": <CreditCard size={14} />,
  "Ad data quality": <FileText size={14} />,
};

function StatusIcon({ s }: { s: CheckStatus }) {
  if (s === "ok")
    return <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />;
  if (s === "warning")
    return <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />;
  return <XCircle size={16} className="text-red-500 flex-shrink-0" />;
}

function StatusBadge({ s }: { s: CheckStatus }) {
  const map = {
    ok: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    error: "bg-red-100 text-red-600",
  };
  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${map[s]}`}
    >
      {s}
    </span>
  );
}

// Download helper
function downloadJSON(data: object, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadCSV(rows: object[], filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers.map((h) => JSON.stringify((r as any)[h] ?? "")).join(","),
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function AdminSystemPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [report, setReport] = useState<ReportData | null>(null);
  const [reportPeriod, setReportPeriod] = useState<"week" | "month">("week");
  const [reportLoading, setReportLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [errors, setErrors] = useState<ErrorEntry[]>([]);
  const [errorSummary, setErrorSummary] = useState<any>(null);
  const [errLoading, setErrLoading] = useState(false);
  const [expandedErr, setExpandedErr] = useState<string | null>(null);
  const [errFilter, setErrFilter] = useState<string>("all");

  const checkHealth = useCallback(async () => {
    setHealthLoading(true);
    try {
      const res = await axiosInstance.get("/admin/system/health");
      setHealth(res.data);
      setLastChecked(new Date());
    } catch {
    } finally {
      setHealthLoading(false);
    }
  }, []);

  const fetchErrors = useCallback(async () => {
    setErrLoading(true);
    try {
      const params = errFilter !== "all" ? `?source=${errFilter}` : "";
      const res = await axiosInstance.get(`/admin/system/errors${params}`);
      setErrors(res.data.errors ?? []);
      setErrorSummary(res.data.summary ?? null);
    } catch {
    } finally {
      setErrLoading(false);
    }
  }, [errFilter]);

  const clearAllErrors = async () => {
    if (!confirm("Clear all error logs?")) return;
    await axiosInstance.delete("/admin/system/errors");
    setErrors([]);
    setErrorSummary(null);
  };

  const fetchReport = useCallback(async () => {
    setReportLoading(true);
    try {
      const res = await axiosInstance.get(
        `/admin/system/report?period=${reportPeriod}`,
      );
      setReport(res.data);
    } catch {
    } finally {
      setReportLoading(false);
    }
  }, [reportPeriod]);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);
  useEffect(() => {
    fetchReport();
  }, [fetchReport]);
  useEffect(() => {
    fetchErrors();
  }, [fetchErrors]);

  // Auto-refresh error log every 30s while page is open
  useEffect(() => {
    const t = setInterval(fetchErrors, 30_000);
    return () => clearInterval(t);
  }, [fetchErrors]);

  const overall = health?.overall;
  const overallColor =
    overall === "healthy"
      ? "bg-green-500"
      : overall === "warning"
        ? "bg-amber-400"
        : "bg-red-500";
  const overallText =
    overall === "healthy"
      ? "All systems operational"
      : overall === "warning"
        ? "Some systems need attention"
        : "System issues detected";

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">System</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Health monitoring · diagnostics · reports
          </p>
        </div>
        <button
          onClick={checkHealth}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100
            hover:bg-gray-200 rounded-xl text-xs font-semibold text-gray-600 transition"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Overall status banner */}
      {!healthLoading && health && (
        <div
          className={`rounded-2xl p-4 flex items-center gap-3
          ${
            overall === "healthy"
              ? "bg-green-50 border border-green-200"
              : overall === "warning"
                ? "bg-amber-50 border border-amber-200"
                : "bg-red-50 border border-red-200"
          }`}
        >
          <span
            className={`w-3 h-3 rounded-full flex-shrink-0 ${overallColor}`}
          />
          <div className="flex-1">
            <p
              className={`font-bold text-sm
              ${
                overall === "healthy"
                  ? "text-green-800"
                  : overall === "warning"
                    ? "text-amber-800"
                    : "text-red-800"
              }`}
            >
              {overallText}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Uptime: {uptime(health.uptime)} · Checked:{" "}
              {lastChecked?.toLocaleTimeString("en-GH") ?? "…"}
            </p>
          </div>
          <div className="flex gap-2">
            {health.checks.filter((c) => c.status !== "ok").length > 0 && (
              <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-lg">
                {health.checks.filter((c) => c.status !== "ok").length} issue
                {health.checks.filter((c) => c.status !== "ok").length !== 1
                  ? "s"
                  : ""}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Service checks */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
          <Server size={15} className="text-[#ffc105]" />
          <h3 className="font-bold text-sm text-gray-900">Service checks</h3>
          {healthLoading && (
            <Loader2 size={13} className="animate-spin ml-auto text-gray-400" />
          )}
        </div>
        <div className="divide-y divide-gray-50">
          {healthLoading
            ? [...Array(6)].map((_, i) => (
                <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-100 rounded-full animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-32 animate-pulse" />
                  <div className="ml-auto h-3 bg-gray-100 rounded w-16 animate-pulse" />
                </div>
              ))
            : health?.checks.map((c) => (
                <div
                  key={c.service}
                  className="px-5 py-3.5 flex items-center gap-3"
                >
                  <StatusIcon s={c.status} />
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {ServiceIcon[c.service] ?? <Server size={14} />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {c.service}
                    </p>
                    {c.note && (
                      <p className="text-xs text-gray-400 truncate">{c.note}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {c.ms !== undefined && (
                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                        <Clock size={9} /> {c.ms}ms
                      </span>
                    )}
                    <StatusBadge s={c.status} />
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Report section */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
          <FileText size={15} className="text-[#ffc105]" />
          <h3 className="font-bold text-sm text-gray-900">Report generation</h3>
          <div className="ml-auto flex items-center gap-2">
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value as any)}
              className="text-xs border border-gray-200 rounded-xl px-2.5 py-1.5 focus:outline-none
                focus:ring-2 focus:ring-[#ffc105]"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
            </select>
            {reportLoading ? (
              <Loader2 size={14} className="animate-spin text-gray-400" />
            ) : null}
          </div>
        </div>

        {report && (
          <div className="p-5 space-y-5">
            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "New users", value: report.summary.newUsers },
                { label: "New vendors", value: report.summary.newVendors },
                { label: "New marketers", value: report.summary.newMarketers },
                { label: "New listings", value: report.summary.newAds },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-gray-50 rounded-xl p-3 text-center"
                >
                  <p className="text-xs text-gray-400">{s.label}</p>
                  <p className="text-xl font-black text-gray-900">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Revenue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(report.summary.revenue).map(([cur, r]) => (
                <div
                  key={cur}
                  className="bg-[#ffc105]/10 border border-[#ffc105]/30 rounded-xl p-4"
                >
                  <p className="text-xs text-gray-500">Revenue ({cur})</p>
                  <p className="text-2xl font-black text-gray-900">
                    {cur === "NGN" ? "₦" : "₵"}
                    {r.total.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {r.count} transactions
                  </p>
                </div>
              ))}
            </div>

            {/* Payment health */}
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
              <div>
                <p className="text-xs text-gray-400">Payment success rate</p>
                <p className="text-2xl font-black text-gray-900">
                  {report.summary.paymentSuccessRate}%
                </p>
              </div>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700
                    ${
                      report.summary.paymentSuccessRate >= 90
                        ? "bg-green-500"
                        : report.summary.paymentSuccessRate >= 70
                          ? "bg-amber-400"
                          : "bg-red-500"
                    }`}
                  style={{ width: `${report.summary.paymentSuccessRate}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 text-right">
                <p>{report.summary.successPayments} successful</p>
                <p className="text-red-400">
                  {report.summary.failedPayments} failed
                </p>
              </div>
            </div>

            {/* Top ads + pages side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Top ads by views
                </p>
                <div className="space-y-1.5">
                  {report.topAds.slice(0, 5).map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2"
                    >
                      <span className="text-[10px] font-black text-gray-300 w-4">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">
                          {a.title}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          by {a.vendor ?? "—"} · {a.country ?? "—"}
                        </p>
                      </div>
                      <div className="text-right text-xs flex-shrink-0">
                        <p className="font-bold text-gray-700">
                          {a.views} views
                        </p>
                        <p className="text-[10px] text-green-600">
                          {a.conversion}% CTR
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Top pages
                </p>
                <div className="space-y-1.5">
                  {report.topPages.slice(0, 5).map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2"
                    >
                      <span className="text-[10px] font-black text-gray-300 w-4">
                        {i + 1}
                      </span>
                      <span className="text-xs text-gray-700 flex-1 truncate min-w-0">
                        {p.path}
                      </span>
                      <span className="text-xs font-bold text-gray-500 flex-shrink-0">
                        {p.views}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Download buttons */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() =>
                  downloadJSON(
                    report,
                    `smilebaba-report-${reportPeriod}-${new Date().toISOString().split("T")[0]}.json`,
                  )
                }
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2
                  bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition"
              >
                <Download size={12} /> Download JSON
              </button>
              <button
                onClick={() =>
                  downloadCSV(
                    report.topAds,
                    `smilebaba-top-ads-${reportPeriod}.csv`,
                  )
                }
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2
                  bg-[#ffc105] text-black rounded-xl hover:bg-amber-400 transition"
              >
                <Download size={12} /> Export top ads CSV
              </button>
              <button
                onClick={() =>
                  downloadCSV(
                    report.topPages,
                    `smilebaba-top-pages-${reportPeriod}.csv`,
                  )
                }
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2
                  border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition"
              >
                <Download size={12} /> Export pages CSV
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2
                  border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition"
              >
                <FileText size={12} /> Print report
              </button>
            </div>
          </div>
        )}
      </div>
      {/* ── Live error log ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex flex-wrap items-center gap-2">
          <AlertOctagon size={15} className="text-red-400" />
          <h3 className="font-bold text-sm text-gray-900">Error log</h3>
          {errorSummary && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-1
              ${
                errorSummary.total > 0
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {errorSummary.total} in last 60 min
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            {/* Source filter */}
            {errorSummary &&
              Object.keys(errorSummary.bySource ?? {}).length > 0 && (
                <select
                  value={errFilter}
                  onChange={(e) => setErrFilter(e.target.value)}
                  className="text-xs border border-gray-200 rounded-xl px-2.5 py-1.5
                  focus:outline-none focus:ring-2 focus:ring-[#ffc105]"
                >
                  <option value="all">All sources</option>
                  {Object.keys(errorSummary.bySource).map((s) => (
                    <option key={s} value={s}>
                      {s} ({errorSummary.bySource[s]})
                    </option>
                  ))}
                </select>
              )}
            <button
              onClick={fetchErrors}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition"
            >
              <RefreshCw size={12} className="text-gray-400" />
            </button>
            {errors.length > 0 && (
              <button
                onClick={clearAllErrors}
                className="flex items-center gap-1 text-[10px] font-semibold text-red-400
                  hover:text-red-600 px-2 py-1 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 size={11} /> Clear
              </button>
            )}
          </div>
        </div>

        {errLoading ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 size={20} className="animate-spin text-gray-300" />
          </div>
        ) : errors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <CheckCircle2 size={28} className="text-green-400" />
            <p className="text-sm text-gray-400">No errors recorded</p>
            <p className="text-xs text-gray-300">
              The last 200 errors will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
            {errors.map((e) => {
              const isOpen = expandedErr === e.id;
              const tsShort = new Date(e.ts).toLocaleTimeString("en-GH", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });
              const dateShort = new Date(e.ts).toLocaleDateString("en-GH", {
                month: "short",
                day: "numeric",
              });
              return (
                <div key={e.id} className="group">
                  <button
                    onClick={() => setExpandedErr(isOpen ? null : e.id)}
                    className="w-full px-5 py-3 flex items-start gap-3 text-left
                      hover:bg-red-50/30 transition"
                  >
                    <XCircle
                      size={14}
                      className="text-red-400 flex-shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-[10px] font-bold text-red-500 bg-red-50
                          px-1.5 py-0.5 rounded"
                        >
                          {e.source}
                        </span>
                        <span className="text-xs text-gray-700 font-medium truncate flex-1">
                          {e.message}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-400">
                          {dateShort} · {tsShort}
                        </span>
                        {Object.keys(e.context ?? {}).length > 0 && (
                          <span className="text-[10px] text-gray-400">
                            ·{" "}
                            {Object.entries(e.context)
                              .map(
                                ([k, v]) => `${k}: ${String(v).slice(0, 30)}`,
                              )
                              .join(" · ")}
                          </span>
                        )}
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronDown
                        size={13}
                        className="text-gray-400 flex-shrink-0 mt-1"
                      />
                    ) : (
                      <ChevronRight
                        size={13}
                        className="text-gray-400 flex-shrink-0 mt-1"
                      />
                    )}
                  </button>

                  {/* Stack trace expandable */}
                  {isOpen && e.stack && (
                    <div className="mx-5 mb-3 bg-gray-950 rounded-xl overflow-hidden">
                      <div className="px-3 py-1.5 bg-gray-900 flex items-center gap-2">
                        <span className="text-[10px] font-mono text-gray-400">
                          Stack trace
                        </span>
                      </div>
                      <pre
                        className="px-4 py-3 text-[10px] font-mono text-red-300
                        overflow-x-auto leading-relaxed whitespace-pre-wrap"
                      >
                        {e.stack}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
