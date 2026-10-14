// client/app/money/clozar/page.tsx
//
// Hosts the Clozar Send Money widget, branded as SmileBaba.
//
// The widget accepts three data attributes on the script tag:
//   data-key    — publishable key (safe client-side, that's what pk_ means)
//   data-color  — accent colour used inside their UI
//   data-logo   — logo shown on their checkout
//
// A note on data-color: if Clozar paints it as a button background with
// white text, yellow (#FFC105) fails contrast — it needs black text.
// Navy is the safer default and already matches the Money banner and the
// send screen in the app. Flip CLOZAR_COLOR once you've seen one render.
//
// Two callers:
//   1. Web users on smilebabahub.com — normal page, no ?return
//   2. The mobile app — passes ?return=<deep link>. On success we redirect
//      there with the result, which closes the browser session and hands
//      control back to the app.

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";

// ─── Brand ───────────────────────────────────────────────────────────
const NAVY = "#0B2A63";
const YELLOW = "#FFC105";

const CLOZAR_SCRIPT =
  process.env.NEXT_PUBLIC_CLOZAR_SCRIPT ??
  "https://clozarbusiness.com/account/api/clozar-api/checkout/clozar-sendmoney.js?v=1788004997";

const CLOZAR_KEY = process.env.NEXT_PUBLIC_CLOZAR_KEY ?? "";

// Accent Clozar uses inside their own UI
const CLOZAR_COLOR = process.env.NEXT_PUBLIC_CLOZAR_COLOR ?? NAVY;

// Must be a publicly reachable image. If Clozar only accepts assets from
// their own media store, upload the SmileBaba mark in their dashboard and
// put that URL here instead.
const CLOZAR_LOGO =
  process.env.NEXT_PUBLIC_CLOZAR_LOGO ??
  "https://www.smilebabahub.com/logo.png";

/** Only ever redirect to our own app. Blocks an open redirect via ?return. */
const ALLOWED_RETURN_PREFIXES = [
  "smilebabahub://",
  "exp://", // Expo Go / dev client
  "https://www.smilebabahub.com",
  "https://smilebabahub.com",
];

function isAllowedReturn(url: string) {
  return ALLOWED_RETURN_PREFIXES.some((p) => url.startsWith(p));
}

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

export default function ClozarSendPage() {
  const params = useSearchParams();

  const sendCurrency = params.get("from") ?? "GHS";
  const receiveCurrency = params.get("to") ?? "NGN";
  const amountParam = params.get("amount");
  const autoOpen = params.get("auto") === "1";
  const returnRaw = params.get("return") ?? "";
  const returnUrl = isAllowedReturn(returnRaw) ? returnRaw : "";

  const [ready, setReady] = useState(false);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<any>(null);
  const opened = useRef(false);

  /** Hand control back to the app. */
  const returnToApp = useCallback(
    (result: Record<string, string | number | undefined>) => {
      if (!returnUrl) return false;
      const qs = new URLSearchParams();
      Object.entries(result).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
      });
      const sep = returnUrl.includes("?") ? "&" : "?";
      window.location.href = `${returnUrl}${sep}${qs.toString()}`;
      return true;
    },
    [returnUrl],
  );

  const openWidget = useCallback(() => {
    if (!window.ClozarSendMoney) {
      setError(
        "Send Money isn't available right now. Please try again shortly.",
      );
      return;
    }

    setOpening(true);
    setError("");

    window.ClozarSendMoney.open({
      send_currency: sendCurrency,
      receive_currency: receiveCurrency,
      ...(amountParam ? { amount: Number(amountParam) } : {}),

      onSuccess: (r: any) => {
        setOpening(false);
        setDone(r);

        // Record against SmileBaba history. Fire-and-forget — never block
        // the user's success path on our own API.
        fetch("/api/money/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payoutRef: r?.payout_ref,
            sendAmount: r?.send_amount,
            receiveAmount: r?.receive_amount,
            sendCurrency: r?.send_currency ?? sendCurrency,
            receiveCurrency: r?.receive_currency ?? receiveCurrency,
            rate: r?.rate,
            fee: r?.fee,
            recipientName: r?.recipient_name,
            recipientPhone: r?.recipient_phone,
            raw: r,
          }),
        }).catch(() => {});

        returnToApp({
          status: "success",
          payout_ref: r?.payout_ref,
          send_amount: r?.send_amount,
          receive_amount: r?.receive_amount,
          send_currency: r?.send_currency ?? sendCurrency,
          receive_currency: r?.receive_currency ?? receiveCurrency,
          rate: r?.rate,
          fee: r?.fee,
          recipient_name: r?.recipient_name,
        });
      },

      onClose: () => {
        setOpening(false);
        // Auto-opened with nothing completed → bounce straight back so the
        // user isn't left on a dead page inside the browser session.
        if (autoOpen) returnToApp({ status: "cancelled" });
      },

      onError: (e: any) => {
        setOpening(false);
        const message = e?.message ?? "Something went wrong. Please try again.";
        setError(message);
        if (autoOpen) returnToApp({ status: "error", message });
      },
    });
  }, [sendCurrency, receiveCurrency, amountParam, autoOpen, returnToApp]);

  useEffect(() => {
    if (ready && autoOpen && !opened.current) {
      opened.current = true;
      openWidget();
    }
  }, [ready, autoOpen, openWidget]);

  return (
    <>
      <Script
        src={CLOZAR_SCRIPT}
        data-key={CLOZAR_KEY}
        data-color={CLOZAR_COLOR}
        data-logo={CLOZAR_LOGO}
        strategy="afterInteractive"
        onReady={() => setReady(true)}
        onError={() => {
          const message = "Couldn't load Send Money. Check your connection.";
          setError(message);
          if (autoOpen) returnToApp({ status: "error", message });
        }}
      />

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          background: "#fff",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* ─── Brand ─── */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: NAVY,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke={YELLOW}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </div>

            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#111827",
                letterSpacing: "-0.4px",
                margin: 0,
              }}
            >
              SmileBaba Money
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "#6B7280",
                marginTop: 6,
                lineHeight: 1.5,
              }}
            >
              Send money across Africa in seconds.
            </p>
          </div>

          {done ? (
            <div
              style={{
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                borderRadius: 18,
                padding: 22,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 34, marginBottom: 10 }}>✅</div>
              <h2
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#166534",
                  margin: 0,
                }}
              >
                Transfer sent
              </h2>
              {done?.receive_amount && (
                <p
                  style={{
                    fontSize: 21,
                    fontWeight: 700,
                    color: "#111827",
                    margin: "12px 0 4px",
                  }}
                >
                  {done.receive_amount}
                </p>
              )}
              {done?.payout_ref && (
                <p style={{ fontSize: 11, color: "#6B7280", marginTop: 8 }}>
                  Reference: <strong>{done.payout_ref}</strong>
                </p>
              )}
              {!returnUrl && (
                <button
                  onClick={() => {
                    setDone(null);
                    openWidget();
                  }}
                  style={{ ...btnPrimary, marginTop: 20 }}
                >
                  Send another
                </button>
              )}
            </div>
          ) : (
            <>
              <div
                style={{
                  background: "#F9FAFB",
                  borderRadius: 18,
                  padding: 18,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Corridor label="From" code={sendCurrency} />
                  <span style={{ fontSize: 18, color: "#9CA3AF" }}>→</span>
                  <Corridor label="To" code={receiveCurrency} align="right" />
                </div>
              </div>

              {error && (
                <div
                  style={{
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 16,
                    fontSize: 12.5,
                    color: "#991B1B",
                    lineHeight: 1.5,
                  }}
                >
                  {error}
                </div>
              )}

              <button
                id="clz-send"
                onClick={openWidget}
                disabled={!ready || opening}
                style={{
                  ...btnPrimary,
                  opacity: !ready || opening ? 0.6 : 1,
                  cursor: !ready || opening ? "not-allowed" : "pointer",
                }}
              >
                {!ready ? "Loading…" : opening ? "Opening…" : "Send money"}
              </button>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 18,
                  marginTop: 20,
                }}
              >
                <Trust label="Instant" />
                <Trust label="Secure" />
                <Trust label="Reliable" />
              </div>

              <p
                style={{
                  fontSize: 10.5,
                  color: "#9CA3AF",
                  textAlign: "center",
                  marginTop: 20,
                  lineHeight: 1.6,
                }}
              >
                Rates and fees are shown before you confirm.
              </p>
            </>
          )}
        </div>
      </main>
    </>
  );
}

// ─── Bits ────────────────────────────────────────────────────────────
const FLAGS: Record<string, string> = {
  GHS: "🇬🇭",
  NGN: "🇳🇬",
  USD: "🇺🇸",
  GBP: "🇬🇧",
  EUR: "🇪🇺",
  SLE: "🇸🇱",
};

function Corridor({
  label,
  code,
  align = "left",
}: {
  label: string;
  code: string;
  align?: "left" | "right";
}) {
  return (
    <div style={{ textAlign: align }}>
      <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0 }}>{label}</p>
      <p
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#111827",
          margin: "3px 0 0",
          display: "flex",
          alignItems: "center",
          gap: 6,
          justifyContent: align === "right" ? "flex-end" : "flex-start",
        }}
      >
        <span style={{ fontSize: 17 }}>{FLAGS[code] ?? "🌍"}</span>
        {code}
      </p>
    </div>
  );
}

function Trust({ label }: { label: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        color: "#6B7280",
        display: "flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      <span style={{ color: "#16A34A" }}>✓</span>
      {label}
    </span>
  );
}

const btnPrimary: React.CSSProperties = {
  width: "100%",
  height: 52,
  border: "none",
  borderRadius: 16,
  background: YELLOW,
  color: "#111827",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
};
