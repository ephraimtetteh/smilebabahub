/* ─── client/app/account/delete/confirm/page.tsx ──────────────────────

The page the confirmation email links to. It calls the backend directly
on mount and shows the outcome.
──────────────────────────────────────────────────────────────────────── */

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const API =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://smilebababackend-vvok.onrender.com/smilebaba";

export default function ConfirmDeletionPage() {
  const params = useSearchParams();
  const [state, setState] = useState<"working" | "done" | "invalid">("working");
  const [scheduledFor, setScheduledFor] = useState<string | null>(null);

  useEffect(() => {
    const token = params.get("token");
    const id = params.get("id");
    if (!token || !id) {
      setState("invalid");
      return;
    }

    fetch(
      `${API}/support/deletion-request/confirm?token=${encodeURIComponent(token)}&id=${encodeURIComponent(id)}`,
    )
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setState("invalid");
          return;
        }
        setScheduledFor(data.scheduledFor ?? null);
        setState("done");
      })
      .catch(() => setState("invalid"));
  }, [params]);

  return (
    <main
      style={{
        background: "#F9FAFB",
        minHeight: "100vh",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          background: "white",
          borderRadius: 20,
          padding: 34,
          border: "1px solid #F0F1F3",
          textAlign: "center",
        }}
      >
        {state === "working" && (
          <p style={{ color: "#6B7280", fontSize: 15 }}>Confirming…</p>
        )}

        {state === "invalid" && (
          <>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#111827",
                margin: 0,
              }}
            >
              This link has expired
            </h1>
            <p
              style={{
                fontSize: 15,
                color: "#4B5563",
                lineHeight: 1.6,
                marginTop: 12,
              }}
            >
              Confirmation links last 48 hours and can only be used once. You
              can start a new request if you still want to delete your account.
            </p>
            <Link
              href="/account/delete"
              style={{
                display: "inline-block",
                marginTop: 24,
                background: "#0B2A63",
                color: "white",
                padding: "13px 26px",
                borderRadius: 14,
                fontSize: 14.5,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Start a new request
            </Link>
          </>
        )}

        {state === "done" && (
          <>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 999,
                background: "#FEE2E2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: 30,
                color: "#DC2626",
              }}
            >
              ✓
            </div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#111827",
                margin: 0,
              }}
            >
              Deletion confirmed
            </h1>
            <p
              style={{
                fontSize: 15,
                color: "#4B5563",
                lineHeight: 1.6,
                marginTop: 12,
              }}
            >
              Your account will be deleted
              {scheduledFor
                ? ` on ${new Date(scheduledFor).toLocaleDateString(undefined, { dateStyle: "long" })}`
                : " in 30 days"}
              .
            </p>
            <div
              style={{
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                borderRadius: 14,
                padding: 16,
                marginTop: 22,
                textAlign: "left",
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#166534",
                  margin: 0,
                }}
              >
                Changed your mind?
              </p>
              <p
                style={{
                  fontSize: 13.5,
                  color: "#15803D",
                  lineHeight: 1.6,
                  margin: "6px 0 0",
                }}
              >
                Sign in before then and the request cancels automatically.
              </p>
            </div>
            <Link
              href="/"
              style={{
                display: "block",
                marginTop: 22,
                padding: "13px 0",
                border: "1px solid #E5E7EB",
                borderRadius: 14,
                fontSize: 14.5,
                fontWeight: 600,
                color: "#374151",
                textDecoration: "none",
              }}
            >
              Back to SmileBabaHub
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
