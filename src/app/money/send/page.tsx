"use client";

// client/app/money/send/page.tsx
//
// SmileBaba Money — send.
//
// ─── THE GATE ────────────────────────────────────────────────────────
//
// Three things have to be true before the widget opens:
//
//   1. Signed in. An anonymous money transfer is a support problem
//      waiting to happen — when something goes wrong, and it will,
//      there has to be an account to talk to.
//
//   2. We know who they are. Full name, phone, country. Not KYC — these
//      are the details any remittance service asks for, and what a
//      support agent needs to trace a transfer.
//
//   3. They've picked a destination.
//
// Nothing here is vendor onboarding. Someone who only wants to send
// money never sees a business-name field.
//
// Clozar is the regulated party and runs its own identity checks inside
// the widget where a corridor requires them. This is our side of it, not
// a substitute — which is why the modal says so rather than implying we
// verified anyone.
//
// ─── WHY THE WIDGET LOADS HERE ───────────────────────────────────────
//
// The browser can run Clozar's script in place, so this page is both the
// destination picker and the handoff. /money/clozar stays as it is —
// the mobile app still opens that one in a browser session because it
// needs the deep-link return.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Send,
  Globe,
  Zap,
  ShieldCheck,
  BadgeCheck,
  Search,
  X,
  Lock,
  UserCheck,
  ChevronRight,
  Loader2,
  Check,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { setUser } from "@/src/lib/features/auth/authSlice";
import axiosInstance from "@/src/lib/api/axios";

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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isAuthenticating } = useAppSelector(
    (s) => s.auth,
  );

  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [selected, setSelected] = useState<Country | null>(null);
  const [showAll, setShowAll] = useState(false);

  const [ready, setReady] = useState(false);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<any>(null);

  // Sender details
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [savingDetails, setSaving] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  // Set once the redux user arrives, so the modal opens prefilled
  useEffect(() => {
    setFullName(user?.username ?? "");
    setPhone(user?.phone ?? "");
  }, [user?._id]);

  const country = user?.country ?? "Ghana";
  const from = country === "Nigeria" ? "NGN" : "GHS";
  const fromFlag = country === "Nigeria" ? "🇳🇬" : "🇬🇭";

  /**
   * What we need before a transfer can start. Deliberately short — this
   * is the minimum any remittance service asks for and the minimum a
   * support agent needs to trace a transfer.
   */
  const detailsComplete =
    !!user &&
    (user.username ?? "").trim().length > 2 &&
    (user.phone ?? "").replace(/\D/g, "").length >= 7 &&
    !!user.country;

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
        axiosInstance
          .post("/transfers/record", {
            payoutRef: r?.payout_ref,
            sendAmount: r?.send_amount,
            receiveAmount: r?.receive_amount,
            sendCurrency: r?.send_currency ?? from,
            receiveCurrency: r?.receive_currency ?? selected.currency,
            rate: r?.rate,
            fee: r?.fee,
            recipientName: r?.recipient_name,
            recipientPhone: r?.recipient_phone,
          })
          .catch(() => {});
      },

      onClose: () => setOpening(false),

      onError: (e: any) => {
        setOpening(false);
        setError(e?.message ?? "Something went wrong. Please try again.");
      },
    });
  }, [selected, from]);

  // ─── Save sender details ──────────────────────────────────────────
  const saveDetails = async (e: React.FormEvent) => {
    e.preventDefault();

    if (fullName.trim().length < 3) {
      setDetailsError("Use the name on your ID or bank account.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 7) {
      setDetailsError("We need a number we can reach you on.");
      return;
    }

    setSaving(true);
    setDetailsError("");

    try {
      // The profile endpoint that already exists — no new backend
      const { data } = await axiosInstance.patch("/auth/profile", {
        username: fullName.trim(),
        phone: phone.trim(),
      });

      // Keep redux in step, otherwise detailsComplete stays false and
      // they'd be asked again on the very next click
      if (data?.user) dispatch(setUser(data.user));

      setDetailsOpen(false);
      // Carry straight on rather than making them press Continue again
      setTimeout(() => openWidget(), 200);
    } catch (err: any) {
      setDetailsError(
        err?.response?.data?.message ?? "Couldn't save that. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ─── The gate ─────────────────────────────────────────────────────
  const proceed = () => {
    if (!selected) return;

    if (selected.currency === from) {
      setError(
        `You're sending from ${country}. Choose somewhere else to send to.`,
      );
      return;
    }

    if (!isAuthenticated) {
      // Your login page reads this and returns them here afterwards
      localStorage.setItem("redirectAfterLogin", "/money/send");
      router.push("/auth/login?returnUrl=/money/send");
      return;
    }

    if (!detailsComplete) {
      setDetailsOpen(true);
      return;
    }

    openWidget();
  };

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
          <div style={successCircle}>
            <Check size={34} />
          </div>

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
          <div style={heroGlow} aria-hidden />
          <Globe
            size={220}
            strokeWidth={0.5}
            style={{
              position: "absolute",
              right: -30,
              top: 10,
              color: "#2C6FD1",
              opacity: 0.3,
            }}
            aria-hidden
          />

          <div style={{ position: "relative" }}>
            <div style={heroIcon}>
              <Send size={24} color={YELLOW} strokeWidth={2.1} />
            </div>

            <h1
              style={{
                fontSize: 38,
                fontWeight: 700,
                color: "white",
                letterSpacing: "-1px",
                margin: "18px 0 0",
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
                color: "rgba(255,255,255,0.6)",
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
              <Trust icon={Zap} label="Instant" colour={YELLOW} />
              <Trust icon={ShieldCheck} label="Secure" colour="#5B8DEF" />
              <Trust icon={BadgeCheck} label="Reliable" colour="#4ADE80" />
            </div>
          </div>
        </section>

        {/* ═══ Who's sending ═══ */}
        {isAuthenticated && (
          <button
            onClick={() => setDetailsOpen(true)}
            style={{
              ...senderCard,
              background: detailsComplete ? "white" : "#FEF9E7",
              borderColor: detailsComplete ? "#F0F1F3" : "#FDE68A",
            }}
          >
            <span
              style={{
                ...senderIcon,
                background: detailsComplete ? "#F9FAFB" : "#FEF3C7",
              }}
            >
              <UserCheck
                size={17}
                color={detailsComplete ? "#059669" : "#B45309"}
                strokeWidth={2}
              />
            </span>

            <span style={{ flex: 1, textAlign: "left" }}>
              <span
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {detailsComplete ? user?.username : "Add your details"}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: 12.5,
                  color: "#6B7280",
                  marginTop: 2,
                }}
              >
                {detailsComplete
                  ? `${user?.phone} · ${user?.country}`
                  : "We need your name and phone before you can send"}
              </span>
            </span>

            <ChevronRight size={16} color="#D1D5DB" />
          </button>
        )}

        {/* ═══ Destination ═══ */}
        <section style={{ marginTop: 30 }}>
          <h2 style={{ ...h2, fontSize: 24 }}>Where are you sending to?</h2>
          <p style={{ ...body, fontSize: 14, marginTop: 6 }}>
            Sending from <span style={{ fontSize: 16 }}>{fromFlag}</span>{" "}
            <strong>{country}</strong>
            {isAuthenticated && (
              <>
                {" · "}
                <Link href="/account/settings" style={linkStyle}>
                  Change
                </Link>
              </>
            )}
          </p>

          {/* Search */}
          <div style={{ ...searchBox, marginTop: 16 }}>
            <Search size={17} color="#9CA3AF" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or region"
              style={searchInput}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                style={clearBtn}
                aria-label="Clear"
              >
                <X size={15} />
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
            <div style={countryGrid}>
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
                    <ChevronRight
                      size={15}
                      color={on ? "#2563EB" : "#D1D5DB"}
                    />
                  </button>
                );
              })}

              {!searching && (
                <button
                  onClick={() => setShowAll(true)}
                  style={{ ...countryCard, borderColor: "#E5E7EB" }}
                >
                  <Globe size={22} color="#2563EB" />
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
                  <ChevronRight size={15} color="#D1D5DB" />
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
            onClick={proceed}
            disabled={!selected || opening || isAuthenticating}
            style={{
              ...btnPrimary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: selected ? YELLOW : "#F3F4F6",
              color: selected ? "#111827" : "#9CA3AF",
              cursor: selected ? "pointer" : "not-allowed",
            }}
          >
            {opening ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Opening…
              </>
            ) : !isAuthenticated ? (
              <>
                <Lock size={16} />
                Sign in to continue
              </>
            ) : !ready ? (
              "Loading…"
            ) : (
              "Continue →"
            )}
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
            {!isAuthenticated
              ? "Transfers need an account so we can help if anything goes wrong."
              : "You'll be able to review the details before confirming."}
          </p>
        </div>
      </Shell>

      {/* ═══ Sender details ═══ */}
      {detailsOpen && (
        <div
          style={overlay}
          onClick={() => !savingDetails && setDetailsOpen(false)}
        >
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ ...h1, fontSize: 21 }}>Your details</h2>
                <p style={{ ...body, fontSize: 14, marginTop: 6 }}>
                  Use the name on your ID or bank account. We ask once, and only
                  so we can help if a transfer goes wrong.
                </p>
              </div>

              <button
                onClick={() => !savingDetails && setDetailsOpen(false)}
                style={closeBtn}
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={saveDetails}>
              <div style={{ marginTop: 20 }}>
                <label style={fieldLabel}>Full name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Kwame Mensah"
                  style={fieldInput}
                  autoFocus
                />
              </div>

              <div style={{ marginTop: 16 }}>
                <label style={fieldLabel}>Phone number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={
                    country === "Nigeria" ? "0801 234 5678" : "024 123 4567"
                  }
                  style={fieldInput}
                />
              </div>

              {detailsError && (
                <p
                  style={{
                    fontSize: 13,
                    color: "#B91C1C",
                    marginTop: 12,
                    lineHeight: 1.5,
                  }}
                >
                  {detailsError}
                </p>
              )}

              {/* Said plainly, because implying we verified someone when
                  we didn't would be the wrong thing to claim */}
              <div style={noteBox}>
                <ShieldCheck
                  size={15}
                  color="#059669"
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <span
                  style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.55 }}
                >
                  Your details stay with SmileBaba. Depending on where you're
                  sending, our partner may ask for more before completing the
                  transfer.
                </span>
              </div>

              <button
                type="submit"
                disabled={savingDetails}
                style={{
                  ...btnPrimary,
                  marginTop: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  opacity: savingDetails ? 0.7 : 1,
                }}
              >
                {savingDetails ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save and continue"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
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

function Trust({
  icon: Icon,
  label,
  colour,
}: {
  icon: any;
  label: string;
  colour: string;
}) {
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
      <Icon size={16} color={colour} strokeWidth={2.4} />
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
const heroIcon: React.CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: 16,
  background: NAVY_MID,
  border: "1px solid rgba(255,255,255,0.18)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const senderCard: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  width: "100%",
  marginTop: 16,
  padding: 14,
  borderRadius: 16,
  borderWidth: 1,
  borderStyle: "solid",
  cursor: "pointer",
  fontFamily: "inherit",
};
const senderIcon: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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
  display: "flex",
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
  background: YELLOW,
  color: "#111827",
  fontSize: 17,
  fontWeight: 700,
  fontFamily: "inherit",
  cursor: "pointer",
};
const btnGhost: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
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
const linkStyle: React.CSSProperties = {
  color: "#2563EB",
  fontWeight: 600,
  textDecoration: "underline",
};

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 60,
  background: "rgba(17,24,39,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
};
const modal: React.CSSProperties = {
  background: "white",
  borderRadius: 22,
  padding: 26,
  width: "100%",
  maxWidth: 460,
};
const closeBtn: React.CSSProperties = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  color: "#9CA3AF",
  display: "flex",
  padding: 0,
};

const fieldLabel: React.CSSProperties = {
  display: "block",
  fontSize: 13.5,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 7,
};
const fieldInput: React.CSSProperties = {
  width: "100%",
  height: 48,
  border: "1px solid #E5E7EB",
  borderRadius: 14,
  padding: "0 14px",
  fontSize: 15,
  color: "#111827",
  outline: "none",
  fontFamily: "inherit",
};

const noteBox: React.CSSProperties = {
  display: "flex",
  gap: 10,
  background: "#F9FAFB",
  borderRadius: 12,
  padding: 13,
  marginTop: 18,
};
