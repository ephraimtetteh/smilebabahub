// client/app/money/send/page.tsx
//
// Send Money — the web version.
//
// Unlike mobile, the browser can load Clozar's widget directly, so this
// page is both the destination picker and the handoff. No redirect, no
// second page.
//
// /money/clozar stays as-is — the mobile app still opens that one in a
// browser session because it needs the deep-link return.
//
// Route: /money/send

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import Link from "next/link";

const NAVY = "#0B2A63";
const NAVY_MID = "#123A80";
const YELLOW = "#FFC105";

const CLOZAR_SCRIPT =
  process.env.NEXT_PUBLIC_CLOZAR_SCRIPT ??
  "https://clozarbusiness.com/account/api/clozar-api/checkout/clozar-sendmoney.js?v=1788004997";
const CLOZAR_KEY = process.env.NEXT_PUBLIC_CLOZAR_KEY ?? "";
const CLOZAR_COLOR = process.env.NEXT_PUBLIC_CLOZAR_COLOR ?? NAVY;
const CLOZAR_LOGO =
  process.env.NEXT_PUBLIC_CLOZAR_LOGO ??
  "https://www.smilebabahub.com/logo.png";

declare global {
  interface Window {
    ClozarSendMoney?: {
      open: (opts: {
        send_currency?: string;
        receive_currency?: string;
        amount?: number;
        onSuccess?: (r: any) => void;
        onClose?: () => void;
        onError?: (e: any) => void;
      }) => void;
    };
  }
}

// ─── Destinations ────────────────────────────────────────────────────
type Region =
  | "Africa"
  | "North America"
  | "Europe"
  | "Asia"
  | "Oceania"
  | "South America";

interface Country {
  code: string;
  name: string;
  currency: string;
  flag: string;
  region: Region;
  popular?: boolean;
}

const COUNTRIES: Country[] = [
  {
    code: "GH",
    name: "Ghana",
    currency: "GHS",
    flag: "🇬🇭",
    region: "Africa",
    popular: true,
  },
  {
    code: "NG",
    name: "Nigeria",
    currency: "NGN",
    flag: "🇳🇬",
    region: "Africa",
    popular: true,
  },
  {
    code: "SL",
    name: "Sierra Leone",
    currency: "SLE",
    flag: "🇸🇱",
    region: "Africa",
    popular: true,
  },
  {
    code: "ZA",
    name: "South Africa",
    currency: "ZAR",
    flag: "🇿🇦",
    region: "Africa",
    popular: true,
  },
  { code: "KE", name: "Kenya", currency: "KES", flag: "🇰🇪", region: "Africa" },
  {
    code: "CI",
    name: "Côte d'Ivoire",
    currency: "XOF",
    flag: "🇨🇮",
    region: "Africa",
  },
  {
    code: "SN",
    name: "Senegal",
    currency: "XOF",
    flag: "🇸🇳",
    region: "Africa",
  },
  {
    code: "TZ",
    name: "Tanzania",
    currency: "TZS",
    flag: "🇹🇿",
    region: "Africa",
  },
  { code: "UG", name: "Uganda", currency: "UGX", flag: "🇺🇬", region: "Africa" },
  { code: "EG", name: "Egypt", currency: "EGP", flag: "🇪🇬", region: "Africa" },

  {
    code: "US",
    name: "United States",
    currency: "USD",
    flag: "🇺🇸",
    region: "North America",
    popular: true,
  },
  {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    flag: "🇨🇦",
    region: "North America",
    popular: true,
  },
  {
    code: "MX",
    name: "Mexico",
    currency: "MXN",
    flag: "🇲🇽",
    region: "North America",
  },

  {
    code: "GB",
    name: "United Kingdom",
    currency: "GBP",
    flag: "🇬🇧",
    region: "Europe",
    popular: true,
  },
  {
    code: "DE",
    name: "Germany",
    currency: "EUR",
    flag: "🇩🇪",
    region: "Europe",
    popular: true,
  },
  {
    code: "FR",
    name: "France",
    currency: "EUR",
    flag: "🇫🇷",
    region: "Europe",
    popular: true,
  },
  { code: "IT", name: "Italy", currency: "EUR", flag: "🇮🇹", region: "Europe" },
  { code: "ES", name: "Spain", currency: "EUR", flag: "🇪🇸", region: "Europe" },
  {
    code: "NL",
    name: "Netherlands",
    currency: "EUR",
    flag: "🇳🇱",
    region: "Europe",
  },
  {
    code: "IE",
    name: "Ireland",
    currency: "EUR",
    flag: "🇮🇪",
    region: "Europe",
  },

  {
    code: "CN",
    name: "China",
    currency: "CNY",
    flag: "🇨🇳",
    region: "Asia",
    popular: true,
  },
  {
    code: "IN",
    name: "India",
    currency: "INR",
    flag: "🇮🇳",
    region: "Asia",
    popular: true,
  },
  {
    code: "AE",
    name: "UAE",
    currency: "AED",
    flag: "🇦🇪",
    region: "Asia",
    popular: true,
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    currency: "SAR",
    flag: "🇸🇦",
    region: "Asia",
  },
  { code: "TR", name: "Türkiye", currency: "TRY", flag: "🇹🇷", region: "Asia" },
  { code: "JP", name: "Japan", currency: "JPY", flag: "🇯🇵", region: "Asia" },

  {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    flag: "🇦🇺",
    region: "Oceania",
    popular: true,
  },
  {
    code: "NZ",
    name: "New Zealand",
    currency: "NZD",
    flag: "🇳🇿",
    region: "Oceania",
  },

  {
    code: "BR",
    name: "Brazil",
    currency: "BRL",
    flag: "🇧🇷",
    region: "South America",
    popular: true,
  },
  {
    code: "AR",
    name: "Argentina",
    currency: "ARS",
    flag: "🇦🇷",
    region: "South America",
  },
];

const REGIONS = [
  { id: "all", label: "All", icon: "🌐" },
  { id: "Africa", label: "Africa", icon: "🌍" },
  { id: "North America", label: "North America", icon: "🌎" },
  { id: "Europe", label: "Europe", icon: "🇪🇺" },
  { id: "Asia", label: "Asia", icon: "🌏" },
  { id: "Oceania", label: "Oceania", icon: "🏝️" },
  { id: "South America", label: "South America", icon: "🌎" },
];

// ═══════════════════════════════════════════════════════════════════════
export default function SendMoneyPage() {
  const [from, setFrom] = useState("GHS");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [selected, setSelected] = useState<Country | null>(null);
  const [showAll, setShowAll] = useState(false);

  const [ready, setReady] = useState(false);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<any>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  const fromCountry =
    COUNTRIES.find((c) => c.currency === from) ?? COUNTRIES[0];

  // ─── Filter ───────────────────────────────────────────────────────
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = COUNTRIES;

    if (region !== "all") list = list.filter((c) => c.region === region);
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.currency.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q),
      );
    }
    if (!q && region === "all" && !showAll) {
      list = list.filter((c) => c.popular);
    }
    return list;
  }, [query, region, showAll]);

  const searching = query.trim().length > 0 || region !== "all" || showAll;

  // ─── Open the widget ──────────────────────────────────────────────
  const openWidget = useCallback(() => {
    if (!selected) return;

    if (!window.ClozarSendMoney) {
      setError(
        "Send Money isn't available right now. Please try again shortly.",
      );
      return;
    }

    setOpening(true);
    setError("");

    window.ClozarSendMoney.open({
      send_currency: from,
      receive_currency: selected.currency,

      onSuccess: (r: any) => {
        setOpening(false);
        setDone(r);

        // Record against SmileBaba history. Fire-and-forget — never block
        // the success screen on our own API.
        fetch("/api/money/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payoutRef: r?.payout_ref,
            sendAmount: r?.send_amount,
            receiveAmount: r?.receive_amount,
            sendCurrency: r?.send_currency ?? from,
            receiveCurrency: r?.receive_currency ?? selected.currency,
            rate: r?.rate,
            fee: r?.fee,
            recipientName: r?.recipient_name,
            recipientPhone: r?.recipient_phone,
            raw: r,
          }),
        }).catch(() => {});
      },

      onClose: () => setOpening(false),

      onError: (e: any) => {
        setOpening(false);
        setError(e?.message ?? "Something went wrong. Please try again.");
      },
    });
  }, [selected, from]);

  // ─── Success ──────────────────────────────────────────────────────
  if (done) {
    return (
      <Shell>
        <div
          style={{
            ...card,
            textAlign: "center",
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          <div style={successCircle}>✓</div>
          <h1 style={{ ...h1, fontSize: 24, marginTop: 18 }}>Transfer sent</h1>
          {done?.receive_amount && (
            <p
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: "#111827",
                margin: "14px 0 4px",
              }}
            >
              {done.receive_amount}
            </p>
          )}
          {done?.payout_ref && (
            <p style={{ ...body, fontSize: 13, marginTop: 8 }}>
              Reference <strong>{done.payout_ref}</strong>
            </p>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 26 }}>
            <button
              onClick={() => {
                setDone(null);
                openWidget();
              }}
              style={{ ...btnPrimary, flex: 1 }}
            >
              Send another
            </button>
            <Link href="/money" style={{ ...btnGhost, flex: 1 }}>
              My transfers
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <>
      <Script
        src={CLOZAR_SCRIPT}
        data-key={CLOZAR_KEY}
        data-color={CLOZAR_COLOR}
        data-logo={CLOZAR_LOGO}
        strategy="afterInteractive"
        onReady={() => setReady(true)}
        onError={() =>
          setError("Couldn't load Send Money. Check your connection.")
        }
      />

      <Shell>
        {/* ═══ Hero ═══ */}
        <section style={hero}>
          <div style={heroGlow} />
          <div style={{ position: "relative" }}>
            <h1
              style={{
                fontSize: 38,
                fontWeight: 700,
                color: "white",
                letterSpacing: "-1px",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Send money
            </h1>
            <h1
              style={{
                fontSize: 38,
                fontWeight: 700,
                color: YELLOW,
                letterSpacing: "-1px",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              worldwide
            </h1>
            <p
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "rgba(255,255,255,0.92)",
                marginTop: 12,
              }}
            >
              Fast. Secure. Reliable.
            </p>
            <p
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.65)",
                marginTop: 6,
                maxWidth: 420,
                lineHeight: 1.6,
              }}
            >
              Send money to your loved ones across the globe in seconds.
            </p>

            <div
              style={{
                display: "flex",
                gap: 22,
                marginTop: 20,
                flexWrap: "wrap",
              }}
            >
              <Trust icon="⚡" label="Instant" />
              <Trust icon="🛡️" label="Secure" />
              <Trust icon="✅" label="Reliable" />
            </div>
          </div>
        </section>

        {/* ═══ USDT ═══ */}
        <section style={usdtBanner}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              flexWrap: "wrap",
            }}
          >
            <div style={usdtCoin}>₮</div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: "-0.5px",
                }}
              >
                <span style={{ color: "#0F766E" }}>Transfer </span>
                <span style={{ color: "#059669" }}>USDT</span>
              </h2>
              <p style={{ fontSize: 15, color: "#374151", margin: "4px 0 0" }}>
                to your Ghana and Nigerian account.
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#059669",
                  fontWeight: 600,
                  margin: "6px 0 0",
                }}
              >
                Fast · Secure · Low Fees
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 26,
              }}
            >
              <span>🇬🇭</span>
              <span style={{ color: "#059669", fontSize: 18 }}>→</span>
              <span>🇳🇬</span>
            </div>
          </div>
        </section>

        {/* ═══ Destination ═══ */}
        <section style={{ marginTop: 34 }}>
          <h2 style={{ ...h2, fontSize: 24 }}>Where are you sending to?</h2>
          <p style={{ ...body, fontSize: 14, marginTop: 6 }}>
            Sending from{" "}
            <span style={{ fontSize: 16 }}>{fromCountry.flag}</span>{" "}
            <strong>{fromCountry.name}</strong>{" "}
            <select
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setSelected(null);
              }}
              style={fromSelect}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.currency}>
                  {c.name} ({c.currency})
                </option>
              ))}
            </select>
          </p>

          {/* Search */}
          <div style={{ ...searchBox, marginTop: 16 }}>
            <span style={{ color: "#9CA3AF", fontSize: 17 }}>⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or region"
              style={searchInput}
            />
            {query && (
              <button onClick={() => setQuery("")} style={clearBtn}>
                ✕
              </button>
            )}
          </div>

          {/* Regions */}
          <div
            style={{ display: "flex", gap: 9, marginTop: 16, flexWrap: "wrap" }}
          >
            {REGIONS.map((r) => {
              const on = region === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRegion(r.id)}
                  style={{
                    ...chip,
                    background: on ? NAVY : "white",
                    color: on ? "white" : "#374151",
                    borderColor: on ? NAVY : "#E5E7EB",
                  }}
                >
                  <span style={{ fontSize: 15 }}>{r.icon}</span>
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Countries */}
          <h3 style={{ ...h2, fontSize: 19, marginTop: 30 }}>
            {searching
              ? `${results.length} destination${results.length === 1 ? "" : "s"}`
              : "Popular Countries"}
          </h3>

          {results.length === 0 ? (
            <p style={{ ...body, textAlign: "center", padding: "40px 20px" }}>
              No match for “{query.trim()}”. Try a country name or a currency
              code like GBP.
            </p>
          ) : (
            <div ref={gridRef} style={countryGrid}>
              {results.map((c) => {
                const isFrom = c.currency === from;
                const on = selected?.code === c.code;
                return (
                  <button
                    key={c.code}
                    onClick={() => !isFrom && setSelected(c)}
                    disabled={isFrom}
                    style={{
                      ...countryCard,
                      borderColor: on ? "#2563EB" : "#E5E7EB",
                      borderWidth: on ? 1.5 : 1,
                      background: on ? "#EFF6FF" : "white",
                      opacity: isFrom ? 0.45 : 1,
                      cursor: isFrom ? "not-allowed" : "pointer",
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{c.flag}</span>
                    <span style={{ flex: 1, textAlign: "left" }}>
                      <span
                        style={{
                          display: "block",
                          fontSize: 15,
                          fontWeight: 700,
                          color: on ? "#1D4ED8" : NAVY,
                        }}
                      >
                        {c.name}
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontSize: 12.5,
                          color: "#9CA3AF",
                          marginTop: 1,
                        }}
                      >
                        {isFrom ? "Sending from" : c.currency}
                      </span>
                    </span>
                    <span style={{ color: on ? "#2563EB" : "#D1D5DB" }}>›</span>
                  </button>
                );
              })}

              {!searching && (
                <button
                  onClick={() => setShowAll(true)}
                  style={{ ...countryCard, borderColor: "#E5E7EB" }}
                >
                  <span style={{ fontSize: 22 }}>🌍</span>
                  <span style={{ flex: 1, textAlign: "left" }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#2563EB",
                      }}
                    >
                      More Countries
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: 12.5,
                        color: "#9CA3AF",
                        marginTop: 1,
                      }}
                    >
                      View all
                    </span>
                  </span>
                  <span style={{ color: "#D1D5DB" }}>›</span>
                </button>
              )}
            </div>
          )}

          {showAll && (
            <button
              onClick={() => {
                setShowAll(false);
                setRegion("all");
                setQuery("");
              }}
              style={{
                ...btnGhost,
                marginTop: 20,
                maxWidth: 240,
                marginInline: "auto",
              }}
            >
              Show popular only
            </button>
          )}
        </section>

        {error && <div style={errorBox}>{error}</div>}

        {/* ═══ Continue ═══ */}
        <div style={stickyBar}>
          <button
            onClick={openWidget}
            disabled={!selected || !ready || opening}
            style={{
              ...btnPrimary,
              background: selected && ready ? YELLOW : "#F3F4F6",
              color: selected && ready ? "#111827" : "#9CA3AF",
              cursor: selected && ready ? "pointer" : "not-allowed",
            }}
          >
            {!ready ? "Loading…" : opening ? "Opening…" : "Continue →"}
          </button>
          <p
            style={{
              ...body,
              fontSize: 13,
              textAlign: "center",
              marginTop: 10,
              color: "#9CA3AF",
            }}
          >
            You'll be able to review the details before confirming.
          </p>
        </div>
      </Shell>
    </>
  );
}

// ─── Bits ────────────────────────────────────────────────────────────
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main
      style={{
        background: "#F9FAFB",
        minHeight: "100vh",
        padding: "32px 20px 56px",
      }}
    >
      <div style={{ maxWidth: 940, margin: "0 auto" }}>
        <Link href="/" style={backLink}>
          ← SmileBabaHub
        </Link>
        {children}
      </div>
    </main>
  );
}

function Trust({ icon, label }: { icon: string; label: string }) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        fontSize: 15,
        fontWeight: 600,
        color: "white",
      }}
    >
      <span>{icon}</span>
      {label}
    </span>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────
const h1: React.CSSProperties = {
  fontSize: 30,
  fontWeight: 700,
  color: "#111827",
  letterSpacing: "-0.7px",
  margin: 0,
  lineHeight: 1.2,
};
const h2: React.CSSProperties = {
  fontWeight: 700,
  color: NAVY,
  letterSpacing: "-0.4px",
  margin: 0,
};
const body: React.CSSProperties = {
  fontSize: 15,
  color: "#4B5563",
  lineHeight: 1.6,
  margin: 0,
};
const card: React.CSSProperties = {
  background: "white",
  borderRadius: 20,
  padding: 30,
  border: "1px solid #F0F1F3",
};

const hero: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  background: NAVY,
  borderRadius: 22,
  padding: "34px 32px",
};
const heroGlow: React.CSSProperties = {
  position: "absolute",
  width: 420,
  height: 420,
  right: -140,
  top: -180,
  borderRadius: 999,
  background: NAVY_MID,
  opacity: 0.7,
};

const usdtBanner: React.CSSProperties = {
  background: "linear-gradient(90deg, #ECFDF5 0%, #FEFCE8 100%)",
  border: "1px solid #D1FAE5",
  borderRadius: 20,
  padding: "22px 26px",
  marginTop: 16,
};
const usdtCoin: React.CSSProperties = {
  width: 62,
  height: 62,
  borderRadius: 999,
  background: "#10B981",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 32,
  fontWeight: 700,
  flexShrink: 0,
};

const searchBox: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 11,
  background: "#F3F4F6",
  borderRadius: 14,
  padding: "0 16px",
  height: 52,
};
const searchInput: React.CSSProperties = {
  flex: 1,
  border: "none",
  background: "transparent",
  fontSize: 15,
  color: "#111827",
  outline: "none",
  fontFamily: "inherit",
};
const clearBtn: React.CSSProperties = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  color: "#9CA3AF",
  fontSize: 14,
};

const fromSelect: React.CSSProperties = {
  border: "none",
  background: "transparent",
  color: "#2563EB",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
  fontFamily: "inherit",
  textDecoration: "underline",
};

const chip: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  padding: "10px 16px",
  borderRadius: 999,
  borderStyle: "solid",
  borderWidth: 1,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
};

const countryGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: 12,
  marginTop: 16,
};
const countryCard: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 13,
  padding: 15,
  borderRadius: 14,
  borderStyle: "solid",
  background: "white",
  fontFamily: "inherit",
};

const stickyBar: React.CSSProperties = {
  position: "sticky",
  bottom: 0,
  background: "#F9FAFB",
  paddingTop: 20,
  paddingBottom: 8,
  marginTop: 30,
};

const btnPrimary: React.CSSProperties = {
  width: "100%",
  height: 56,
  border: "none",
  borderRadius: 16,
  fontSize: 17,
  fontWeight: 700,
  fontFamily: "inherit",
  cursor: "pointer",
};
const btnGhost: React.CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "center",
  padding: "15px 0",
  border: "1px solid #E5E7EB",
  borderRadius: 16,
  fontSize: 15,
  fontWeight: 600,
  color: "#374151",
  textDecoration: "none",
  background: "white",
  cursor: "pointer",
  fontFamily: "inherit",
};

const successCircle: React.CSSProperties = {
  width: 72,
  height: 72,
  borderRadius: 999,
  background: "#DCFCE7",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
  fontSize: 34,
  color: "#16A34A",
};

const errorBox: React.CSSProperties = {
  background: "#FEF2F2",
  border: "1px solid #FECACA",
  borderRadius: 14,
  padding: 15,
  marginTop: 20,
  fontSize: 14.5,
  color: "#991B1B",
  lineHeight: 1.5,
};

const backLink: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontSize: 14,
  fontWeight: 600,
  color: NAVY,
  textDecoration: "none",
  marginBottom: 24,
};
