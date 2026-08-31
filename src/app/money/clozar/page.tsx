// client/app/money/clozar/page.tsx
//
// Hosts the Clozar Send Money widget.
//
// Serves two callers:
//   1. Web users on smilebabahub.com — normal page
//   2. The mobile app — loaded in a WebView, results bridged back via
//      window.ReactNativeWebView.postMessage
//
// The Clozar key is publishable, so NEXT_PUBLIC_ is correct here. Do not
// put a secret key in this file — Clozar's widget doesn't use one.

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";

const CLOZAR_SCRIPT =
  "https://clozarbusiness.com/account/api/clozar-api/checkout/clozar-sendmoney.js?v=2";

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
    ReactNativeWebView?: { postMessage: (msg: string) => void };
  }
}

/** Send a message to the RN host if we're inside the app's WebView. */
function bridge(type: string, payload: unknown = {}) {
  if (typeof window !== "undefined" && window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
  }
}

export default function ClozarSendPage() {
  const params = useSearchParams();

  // Mobile passes these through so the widget opens pre-configured
  const sendCurrency = params.get("from") ?? "GHS";
  const receiveCurrency = params.get("to") ?? "NGN";
  const amountParam = params.get("amount");
  const isEmbedded = params.get("embed") === "1";
  const autoOpen = params.get("auto") === "1";

  const [ready, setReady] = useState(false);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<any>(null);
  const opened = useRef(false);

  const openWidget = useCallback(() => {
    if (!window.ClozarSendMoney) {
      setError(
        "Send Money isn't available right now. Please try again shortly.",
      );
      bridge("error", { message: "widget_not_loaded" });
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

        // Record it against the user's SmileBaba history.
        // Fire-and-forget — never block the success screen on our own API.
        fetch("/api/money/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payoutRef: r?.payout_ref,
            receiveAmount: r?.receive_amount,
            sendAmount: r?.send_amount,
            sendCurrency: r?.send_currency ?? sendCurrency,
            receiveCurrency: r?.receive_currency ?? receiveCurrency,
            rate: r?.rate,
            fee: r?.fee,
            recipientName: r?.recipient_name,
            recipientPhone: r?.recipient_phone,
            raw: r,
          }),
        }).catch(() => {});

        bridge("success", r);
      },

      onClose: () => {
        setOpening(false);
        bridge("close");
      },

      onError: (e: any) => {
        setOpening(false);
        setError(e?.message ?? "Something went wrong. Please try again.");
        bridge("error", e);
      },
    });
  }, [sendCurrency, receiveCurrency, amountParam]);

  // Auto-open once the script is live (mobile drops straight into the widget)
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
        data-key={process.env.NEXT_PUBLIC_CLOZAR_KEY}
        strategy="afterInteractive"
        onReady={() => {
          setReady(true);
          bridge("ready");
        }}
        onError={() => {
          setError(
            "Couldn't load Send Money. Check your connection and try again.",
          );
          bridge("error", { message: "script_failed" });
        }}
      />

      <main
        style={{
          minHeight: isEmbedded ? "100vh" : "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: isEmbedded ? "#fff" : undefined,
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* ─── Brand header ─── */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "#0B2A63",
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
                stroke="#FFC105"
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
              Send money across Africa in seconds. Powered by Clozar.
            </p>
          </div>

          {/* ─── Success ─── */}
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

              <button
                onClick={() => {
                  setDone(null);
                  openWidget();
                }}
                style={{ ...btnPrimary, marginTop: 20 }}
              >
                Send another
              </button>
            </div>
          ) : (
            <>
              {/* ─── Corridor summary ─── */}
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
                Transfers are processed by Clozar. Rates and fees are shown
                before you confirm.
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
  background: "#FFC105",
  color: "#111827",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
};
