"use client";
// src/app/vendor/settings/page.tsx
// Main vendor settings shell — tab navigation + real user stats in sidebar.

import { useState } from "react";
import Link from "next/link";
import { Tab, TABS } from "./settings.types";
import { useAppSelector } from "@/src/app/redux";
import { useViewCountry } from "@/src/hooks/useViewCountry";

import ProfileTab from "./tabs/ProfileTab";
import StoreTab from "./tabs/StoreTab";
import PaymentsTab from "./tabs/PaymentsTab";
import ShippingTab from "./tabs/ShippingTab";
import PromotionTab from "./tabs/PromotionTab";
import KycTab from "./tabs/KycTab";
import SecurityTab from "./tabs/SecurityTab";
import NotificationsTab from "./tabs/NotificationTab";

function TabPanel({ tab }: { tab: Tab }) {
  switch (tab) {
    case "profile":
      return <ProfileTab />;
    case "store":
      return <StoreTab />;
    case "payments":
      return <PaymentsTab />;
    case "shipping":
      return <ShippingTab />;
    case "notifications":
      return <NotificationsTab />;
    case "promotion":
      return <PromotionTab />;
    case "kyc":
      return <KycTab />;
    case "security":
      return <SecurityTab />;
  }
}

export default function VendorSettings() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const user = useAppSelector((s) => s.auth.user);
  const { sym } = useViewCountry();
  const current = TABS.find((t) => t.id === activeTab)!;

  const kycPending = !user?.kycFrontUrl;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <header
        className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3.5
        flex items-center justify-between sticky top-0 z-30"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-lg bg-[#ffc105] flex items-center justify-center
            text-black text-sm font-black flex-shrink-0"
          >
            {user?.username?.[0]?.toUpperCase() ?? "V"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-gray-900 leading-tight truncate">
              {user?.storeName ?? user?.username ?? "Vendor"}
            </p>
            <p className="text-xs text-gray-400 leading-tight hidden sm:block">
              Settings
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="hidden sm:flex items-center gap-1.5 text-xs bg-green-50 text-green-600
            font-bold px-3 py-1.5 rounded-full border border-green-100"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Store active
          </span>
          <Link
            href="/vendor/dashboard"
            className="text-xs text-gray-500 hover:text-gray-700 font-medium"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* ── Mobile tabs ── */}
      <div className="md:hidden sticky top-[57px] z-20 bg-gray-50 border-b border-gray-100">
        <div className="flex gap-2 px-4 py-2.5 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl
                text-xs font-bold transition whitespace-nowrap active:scale-95
                ${
                  activeTab === tab.id
                    ? "bg-[#ffc105] text-black shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.id === "kyc" && kycPending && activeTab !== "kyc" && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex gap-5 items-start">
          {/* ── Desktop sidebar ── */}
          <aside className="hidden md:block w-52 flex-shrink-0 sticky top-24">
            <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
              {TABS.map((tab) => {
                const isKyc = tab.id === "kyc";
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                      text-sm font-medium transition mb-0.5 active:scale-[0.98]
                      ${
                        isActive
                          ? "bg-[#ffc105] text-black shadow-sm"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <span className="text-base flex-shrink-0">{tab.icon}</span>
                    <span className="truncate">{tab.label}</span>
                    {isKyc && kycPending && !isActive && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Real user stats */}
            <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">
                Your store
              </p>
              {[
                { label: "Plan", value: user?.subscription?.plan ?? "Free" },
                { label: "Country", value: user?.country ?? "—" },
                { label: "Currency", value: user?.currency ?? "—" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex justify-between items-center mb-2 last:mb-0"
                >
                  <p className="text-xs text-gray-400">{s.label}</p>
                  <p className="text-xs font-bold text-gray-800">{s.value}</p>
                </div>
              ))}
            </div>
          </aside>

          {/* ── Main content ── */}
          <main className="flex-1 min-w-0">
            <div className="mb-4">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <span>{current.icon}</span>
                {current.label}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {current.description}
              </p>
            </div>
            <TabPanel tab={activeTab} />
          </main>
        </div>
      </div>
    </div>
  );
}
