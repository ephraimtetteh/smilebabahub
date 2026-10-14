"use client";

import { useState } from "react";
import { Tab, TABS } from "./types";

import ProfileTab from "./tabs/ProfileTab";
import StoreTab from "./tabs/StoreTab";
import PaymentsTab from "./tabs/PaymentsTab";
import ShippingTab from "./tabs/ShippingTab";
import NotificationsTab from "./tabs/NotificationsTab";
import PromotionTab from "./tabs/PromotionTab";
import KycTab from "./tabs/KycTab";
import SecurityTab from "./tabs/SecurityTab";

// ── Tab panel renderer ─────────────────────────────────────────────────────
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

// ── Page ───────────────────────────────────────────────────────────────────
export default function VendorSettings() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const current = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top header ── */}
      <header
        className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4
        flex items-center justify-between sticky top-0 z-30"
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center
            text-white text-sm font-bold flex-shrink-0"
          >
            S
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-800 leading-tight">
              Vendor Settings
            </p>
            <p className="text-xs text-gray-400 leading-tight hidden sm:block">
              Smilebaba Hub
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className="hidden sm:flex items-center gap-1.5 text-xs bg-green-50 text-green-600
            font-medium px-3 py-1.5 rounded-full border border-green-100"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Store active
          </span>
          <button
            type="button"
            className="text-xs text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      {/* ── Mobile scrollable tab bar ── */}
      <div className="md:hidden sticky top-[57px] z-20 bg-gray-50 border-b border-gray-100">
        <div className="flex gap-2 px-4 py-2.5 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl
                text-xs font-medium transition whitespace-nowrap active:scale-95
                ${
                  activeTab === tab.id
                    ? "bg-yellow-500 text-white shadow-sm shadow-orange-200"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.id === "promotion" && activeTab !== "promotion" && (
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        <div className="flex gap-5 sm:gap-6 items-start">
          {/* ── Desktop sidebar ── */}
          <aside className="hidden md:block w-52 flex-shrink-0 sticky top-24">
            <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
              {TABS.map((tab) => {
                const isPromo = tab.id === "promotion";
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
                          ? "bg-yellow-500 text-black shadow-sm shadow-orange-200"
                          : isPromo
                            ? "bg-orange-50 text-yellow-600 border border-orange-100 hover:bg-orange-100"
                            : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <span className="text-base flex-shrink-0">{tab.icon}</span>
                    <span className="truncate">{tab.label}</span>
                    {isPromo && !isActive && (
                      <span
                        className="ml-auto text-[10px] bg-yellow-500 text-black font-bold
                        px-1.5 py-0.5 rounded-full flex-shrink-0"
                      >
                        NEW
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick stats card */}
            <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                Your store
              </p>
              {[
                { label: "Listings", value: "24" },
                { label: "Orders", value: "138" },
                { label: "Rating", value: "4.8 ⭐" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex justify-between items-center mb-2 last:mb-0"
                >
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className="text-xs font-bold text-gray-800">{s.value}</p>
                </div>
              ))}
            </div>
          </aside>

          {/* ── Main content ── */}
          <main className="flex-1 min-w-0">
            <div className="mb-4 sm:mb-5">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                <span>{current.icon}</span>
                {current.label}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
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
