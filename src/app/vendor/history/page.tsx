"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useResumeAction } from "@/src/hooks/useResumeAction";

type Purchase = {
  _id: string;
  title: string;
  planId: string;
  billingCycle: string;
  amount: number;
  currency: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  txRef: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysLeft(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resume any pending action after subscription
  useResumeAction();

  useEffect(() => {
    axios
      .get("/api/payments/history", { withCredentials: true })
      .then((res) => setPurchases(res.data.purchases))
      .catch(() => setError("Failed to load purchase history."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Purchase History</h1>
          <p className="text-sm text-gray-500 mt-1">
            All your Smilebaba subscription payments
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && purchases.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
            <p className="text-4xl mb-3">🧾</p>
            <p className="text-gray-600 font-medium">No purchases yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Subscribe to a plan to start selling on Smilebaba
            </p>
            <a
              href="/subscription"
              className="inline-block mt-5 px-6 py-2.5 bg-[#ffc105] text-black font-bold
                rounded-xl hover:bg-amber-400 transition text-sm"
            >
              View plans
            </a>
          </div>
        )}

        {/* Purchase list */}
        {!loading && purchases.length > 0 && (
          <div className="space-y-3">
            {purchases.map((p) => {
              const remaining = daysLeft(p.periodEnd);
              const isActive = remaining > 0;

              return (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5
                    flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  {/* Left */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100
                      flex items-center justify-center text-xl flex-shrink-0"
                    >
                      🧾
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {p.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 capitalize">
                        {p.billingCycle} billing
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(p.periodStart)} → {formatDate(p.periodEnd)}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1 flex-shrink-0">
                    <p className="text-sm font-bold text-gray-800">
                      {p.currency} {Number(p.amount).toFixed(2)}
                    </p>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full
                        ${
                          isActive
                            ? remaining <= 3
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                    >
                      {isActive
                        ? remaining === 1
                          ? "Expires tomorrow"
                          : `${remaining} days left`
                        : "Expired"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Renew CTA */}
        {!loading && purchases.length > 0 && (
          <div className="mt-6 text-center">
            <a
              href="/subscription"
              className="inline-block px-6 py-2.5 bg-[#ffc105] text-black font-bold
                rounded-xl hover:bg-amber-400 transition text-sm"
            >
              Upgrade or renew plan
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
