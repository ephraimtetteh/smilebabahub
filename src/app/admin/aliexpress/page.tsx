"use client";
// src/app/admin/aliexpress/page.tsx
//
// SmileBaba Global (AliExpress affiliate): is it connected, how many people
// went to AliExpress from us, and what commission AliExpress reports.

import { useCallback, useEffect, useState } from "react";
import axiosInstance from "@/src/lib/api/axios";
import { Globe, CheckCircle2, XCircle, RefreshCw, Loader2, MousePointerClick, DollarSign, ExternalLink } from "lucide-react";

type Status = {
  configured: boolean;
  enabled: boolean;
  killSwitch: boolean;
  appKey: string | null;
  trackingId: string | null;
  test: { ok: boolean; sample?: number; code?: string; message?: string; requestId?: string };
};
type Report = {
  days: number;
  clicks: number;
  uniqueVisitors: number;
  byPlatform: Record<string, number>;
  topProducts: { productId: string; title: string; clicks: number }[];
  commission: null | {
    count: number;
    totalPaid: number;
    totalCommission: number;
    orders: { orderId: string; product: string; paid: number; commission: number; rate: string; paidAt: string; status: string; currency: string }[];
  };
  commissionError: string | null;
};

export default function AdminAliExpressPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, r] = await Promise.all([
        axiosInstance.get("/admin/aliexpress/status"),
        axiosInstance.get("/admin/aliexpress/report", { params: { days } }),
      ]);
      setStatus(s.data);
      setReport(r.data);
    } catch {
      /* shown as empty */
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black text-gray-900">
            <Globe size={20} /> SmileBaba Global
          </h1>
          <p className="mt-0.5 text-sm text-gray-400">AliExpress affiliate shop: connection, traffic and commission</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button onClick={load} className="rounded-xl border border-gray-200 bg-white p-2 hover:bg-gray-50" aria-label="Refresh">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          </button>
        </div>
      </div>

      {/* Connection */}
      {status && (
        <div className={`rounded-2xl border p-4 ${status.test.ok ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
          <div className="flex items-start gap-3">
            {status.test.ok ? <CheckCircle2 className="text-green-600" /> : <XCircle className="text-red-600" />}
            <div className="text-sm">
              <p className="font-bold text-gray-900">
                {status.test.ok
                  ? status.enabled
                    ? "Connected — the shop is live on the app and website"
                    : "Connected, but switched off (ALIEXPRESS_ENABLED=false)"
                  : "Not working yet"}
              </p>
              {!status.test.ok && (
                <p className="mt-1 text-red-700">
                  {status.test.message}
                  {status.test.code ? ` (${status.test.code})` : ""}
                  {status.test.requestId ? ` · request ${status.test.requestId}` : ""}
                </p>
              )}
              <p className="mt-1 text-gray-500">
                App key {status.appKey ?? "not set"} · Tracking ID {status.trackingId ?? "not set"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Numbers */}
      {report && (
        <div className="grid gap-3 sm:grid-cols-4">
          <Stat icon={<MousePointerClick size={16} />} label="Taps on Buy" value={report.clicks.toLocaleString()} />
          <Stat icon={<Globe size={16} />} label="Unique visitors" value={report.uniqueVisitors.toLocaleString()} />
          <Stat
            icon={<DollarSign size={16} />}
            label="Orders (AliExpress)"
            value={report.commission ? report.commission.count.toLocaleString() : "—"}
          />
          <Stat
            icon={<DollarSign size={16} />}
            label="Est. commission"
            value={report.commission ? `US$${report.commission.totalCommission.toFixed(2)}` : "—"}
            highlight
          />
        </div>
      )}
      {report?.commissionError && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          AliExpress didn&apos;t return commission data: {report.commissionError}. Taps are still counted. Check the
          figures in your AliExpress Portals dashboard.
        </p>
      )}
      {report && (
        <p className="text-[11px] text-gray-400">
          App {report.byPlatform.app ?? 0} · Website {report.byPlatform.web ?? 0}. AliExpress reports orders a few hours
          late, and commission is an estimate until AliExpress settles it.
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top products */}
        <div className="rounded-2xl border border-gray-100 bg-white">
          <p className="border-b border-gray-100 px-4 py-3 text-sm font-black text-gray-900">Most tapped products</p>
          {report?.topProducts.length ? (
            <ul className="divide-y divide-gray-50">
              {report.topProducts.map((p) => (
                <li key={p.productId} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <a
                    href={`/ecommerce/global/${p.productId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-w-0 items-center gap-1 truncate text-gray-800 hover:underline"
                  >
                    <span className="truncate">{p.title || p.productId}</span> <ExternalLink size={11} className="flex-shrink-0" />
                  </a>
                  <span className="flex-shrink-0 font-bold">{p.clicks}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-8 text-center text-sm text-gray-400">No taps yet.</p>
          )}
        </div>

        {/* Orders */}
        <div className="rounded-2xl border border-gray-100 bg-white">
          <p className="border-b border-gray-100 px-4 py-3 text-sm font-black text-gray-900">Recent commission orders</p>
          {report?.commission?.orders.length ? (
            <ul className="max-h-96 divide-y divide-gray-50 overflow-y-auto">
              {report.commission.orders.map((o) => (
                <li key={o.orderId} className="px-4 py-2.5 text-sm">
                  <p className="truncate text-gray-800">{o.product || `Order ${o.orderId}`}</p>
                  <p className="text-xs text-gray-400">
                    {o.paidAt} · paid {o.currency} {o.paid.toFixed(2)} · commission {o.currency} {o.commission.toFixed(2)}
                    {o.rate ? ` (${o.rate})` : ""}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-8 text-center text-sm text-gray-400">No orders reported for this period.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${highlight ? "border-[#FFC105] bg-[#FFC105]/10" : "border-gray-100 bg-white"}`}>
      <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
        {icon} {label}
      </p>
      <p className="mt-1 text-2xl font-black text-gray-900">{value}</p>
    </div>
  );
}
