// client/app/money/[id]/page.tsx
//
// Transfer receipt.
//
// The page someone lands on after sending, and the one they come back to
// when a recipient says the money hasn't arrived — so it's built to be
// printed and forwarded, not just glanced at.
//
// Route: /money/[id]

"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const NAVY = "#0B2A63";
const YELLOW = "#FFC105";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://smilebababackend-vvok.onrender.com/smilebaba";

interface Transfer {
  _id: string;
  reference: string;
  status: "completed" | "pending" | "failed";
  provider?: string;
  sendAmount?: number;
  sendCurrency?: string;
  receiveAmount?: number;
  receiveCurrency?: string;
  rate?: number;
  fee?: number;
  display?: {
    sendAmount?: string;
    receiveAmount?: string;
    fee?: string;
    rate?: string;
  };
  recipient?: { name?: string; phone?: string };
  createdAt?: string;
}

export default function TransferReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!id) return;
    try {
      // Swap this for your axiosInstance if it already attaches the token
      const token =
        typeof window !== "undefined"
          ? (localStorage.getItem("token") ??
            localStorage.getItem("smilebaba_token"))
          : null;

      const res = await fetch(`${API_BASE}/transfers/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.status === 401) {
        setError("Sign in to view this transfer.");
        return;
      }
      if (res.status === 404) {
        setError("We couldn't find that transfer.");
        return;
      }
      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setTransfer(data.transfer ?? data);
    } catch {
      setError("Something went wrong loading this transfer.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // ─── Loading ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <Shell>
        <div style={{ ...card, textAlign: "center", padding: 60 }}>
          <p style={{ ...body, color: "#9CA3AF" }}>Loading your transfer…</p>
        </div>
      </Shell>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────
  if (error || !transfer) {
    return (
      <Shell>
        <div style={{ ...card, textAlign: "center" }}>
          <h1 style={{ ...h1, fontSize: 22 }}>
            {error || "Transfer not found"}
          </h1>
          <p style={{ ...body, marginTop: 10 }}>
            If you have a reference number, our team can look it up for you.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <Link
              href="/money/send"
              style={{
                ...btnPrimary,
                flex: 1,
                textAlign: "center",
                lineHeight: "52px",
                textDecoration: "none",
              }}
            >
              Send money
            </Link>
            <Link href="/contact" style={{ ...btnGhost, flex: 1 }}>
              Contact support
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  const s = STATUS[transfer.status] ?? STATUS.pending;

  return (
    <Shell>
      {/* ═══ Status ═══ */}
      <div style={{ ...card, textAlign: "center" }}>
        <div style={{ ...statusCircle, background: s.bg, color: s.fg }}>
          {s.icon}
        </div>

        <h1 style={{ ...h1, fontSize: 26, marginTop: 20, color: s.fg }}>
          {s.title}
        </h1>
        <p
          style={{
            ...body,
            marginTop: 10,
            maxWidth: 420,
            marginInline: "auto",
          }}
        >
          {s.body(transfer)}
        </p>

        {transfer.display?.receiveAmount && (
          <p
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-1px",
              margin: "24px 0 0",
            }}
          >
            {transfer.display.receiveAmount}
          </p>
        )}
        {transfer.recipient?.name && (
          <p style={{ ...body, fontSize: 14, marginTop: 6 }}>
            to <strong>{transfer.recipient.name}</strong>
          </p>
        )}
      </div>

      {/* ═══ Details ═══ */}
      <div style={{ ...card, marginTop: 20 }}>
        <h2 style={h2}>Receipt</h2>

        <div style={{ ...detailTable, marginTop: 16 }}>
          <Row label="Reference" value={transfer.reference} mono />
          {transfer.display?.sendAmount && (
            <Row label="You sent" value={transfer.display.sendAmount} />
          )}
          {transfer.display?.receiveAmount && (
            <Row
              label="Recipient gets"
              value={transfer.display.receiveAmount}
            />
          )}
          {transfer.display?.rate && (
            <Row label="Exchange rate" value={transfer.display.rate} />
          )}
          {transfer.display?.fee && (
            <Row label="Transfer fee" value={transfer.display.fee} />
          )}
          {transfer.recipient?.phone && (
            <Row label="Recipient" value={transfer.recipient.phone} />
          )}
          {transfer.createdAt && (
            <Row label="Date" value={formatFull(transfer.createdAt)} last />
          )}
        </div>

        {/* ═══ Actions ═══ */}
        <div
          style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}
        >
          <button
            onClick={() => window.print()}
            style={{ ...btnGhost, flex: 1, minWidth: 150 }}
          >
            Print receipt
          </button>
          <button
            onClick={() => {
              navigator.clipboard
                ?.writeText(transfer.reference)
                .catch(() => {});
            }}
            style={{ ...btnGhost, flex: 1, minWidth: 150 }}
          >
            Copy reference
          </button>
        </div>
      </div>

      {/* ═══ Next ═══ */}
      <div
        style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}
      >
        <Link
          href="/money/send"
          style={{
            ...btnPrimary,
            flex: 1,
            minWidth: 180,
            textAlign: "center",
            lineHeight: "52px",
            textDecoration: "none",
          }}
        >
          Send another
        </Link>
        <Link href="/" style={{ ...btnGhost, flex: 1, minWidth: 180 }}>
          Back to SmileBabaHub
        </Link>
      </div>

      {transfer.status !== "completed" && (
        <p
          style={{
            ...body,
            fontSize: 13.5,
            textAlign: "center",
            marginTop: 22,
            color: "#9CA3AF",
          }}
        >
          Money not arrived?{" "}
          <Link href="/contact" style={link}>
            Contact support
          </Link>{" "}
          with reference <strong>{transfer.reference}</strong>.
        </p>
      )}
    </Shell>
  );
}

// ─── Status copy ─────────────────────────────────────────────────────
const STATUS: Record<
  string,
  {
    icon: string;
    fg: string;
    bg: string;
    title: string;
    body: (t: Transfer) => string;
  }
> = {
  completed: {
    icon: "✓",
    fg: "#16A34A",
    bg: "#DCFCE7",
    title: "Transfer sent",
    body: (t) =>
      `${t.recipient?.name ?? "Your recipient"} has been paid. Keep the reference below in case you need it.`,
  },
  pending: {
    icon: "⏳",
    fg: "#B45309",
    bg: "#FEF3C7",
    title: "Transfer processing",
    body: () =>
      "This usually takes a few seconds. Refresh in a moment, or check back shortly.",
  },
  failed: {
    icon: "!",
    fg: "#DC2626",
    bg: "#FEE2E2",
    title: "Transfer didn't go through",
    body: () =>
      "You haven't been charged. If money left your account, contact support with the reference below.",
  },
};

// ─── Bits ────────────────────────────────────────────────────────────
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main
      style={{
        background: "#F9FAFB",
        minHeight: "100vh",
        padding: "40px 20px 64px",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <Link href="/money/send" style={backLink}>
          ← Send Money
        </Link>
        {children}
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  mono,
  last,
}: {
  label: string;
  value?: string;
  mono?: boolean;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 16,
        padding: "13px 16px",
        borderBottom: last ? "none" : "1px solid #F0F1F3",
      }}
    >
      <span style={{ fontSize: 14, color: "#6B7280" }}>{label}</span>
      <span
        style={{
          fontSize: 14.5,
          fontWeight: 600,
          color: "#111827",
          textAlign: "right",
          fontFamily: mono ? "ui-monospace, monospace" : "inherit",
        }}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

function formatFull(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Styles ──────────────────────────────────────────────────────────
const h1: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  color: "#111827",
  letterSpacing: "-0.7px",
  margin: 0,
  lineHeight: 1.2,
};
const h2: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 700,
  color: "#111827",
  letterSpacing: "-0.3px",
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
  padding: 28,
  border: "1px solid #F0F1F3",
};
const statusCircle: React.CSSProperties = {
  width: 76,
  height: 76,
  borderRadius: 999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
  fontSize: 34,
  fontWeight: 700,
};
const detailTable: React.CSSProperties = {
  border: "1px solid #F0F1F3",
  borderRadius: 14,
  overflow: "hidden",
};
const btnPrimary: React.CSSProperties = {
  height: 52,
  border: "none",
  borderRadius: 15,
  background: YELLOW,
  color: "#111827",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
};
const btnGhost: React.CSSProperties = {
  display: "block",
  textAlign: "center",
  padding: "15px 0",
  border: "1px solid #E5E7EB",
  borderRadius: 15,
  fontSize: 14.5,
  fontWeight: 600,
  color: "#374151",
  textDecoration: "none",
  background: "white",
  cursor: "pointer",
  fontFamily: "inherit",
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
const link: React.CSSProperties = {
  color: NAVY,
  fontWeight: 600,
  textDecoration: "underline",
};
