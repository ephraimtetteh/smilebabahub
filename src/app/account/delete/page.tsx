// client/app/account/delete/page.tsx
//
// Account deletion request — required by Google Play.
//
// Play's rule is specific: the URL must be publicly reachable without
// signing in, must be linked from the store listing, and must state what
// gets deleted, what is retained, and for how long. So this page works
// signed out, and the retention section is on the page rather than
// buried in the policy.
//
// Route: /account/delete
// Put that exact URL in Play Console → App content → Data safety →
// Account deletion.

"use client";

import { useState } from "react";
import Link from "next/link";

const NAVY = "#0B2A63";
const YELLOW = "#FFC105";

const REASONS = [
  "I no longer use SmileBabaHub",
  "I have privacy concerns",
  "I created a duplicate account",
  "I'm unhappy with the service",
  "Something else",
];

export default function DeleteAccountPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const canSubmit =
    /\S+@\S+\.\S+/.test(email.trim()) && confirmed && !submitting;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/account/deletion-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          phone: phone.trim() || undefined,
          reason: reason || undefined,
          notes: notes.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Request failed");
      }
      setSent(true);
    } catch (err: any) {
      setError(
        err?.message ??
          "We couldn't submit that. Please email privacy@smilebabahub.com instead.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Submitted ────────────────────────────────────────────────────
  if (sent) {
    return (
      <Shell>
        <div style={card}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              background: "#DCFCE7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: 30,
            }}
          >
            ✓
          </div>

          <h1 style={{ ...h1, textAlign: "center", fontSize: 22 }}>
            Request received
          </h1>
          <p style={{ ...body, textAlign: "center", marginTop: 10 }}>
            We've sent a confirmation to <strong>{email}</strong>. Open that
            email and confirm the request — we won't delete anything until you
            do, so nobody else can close your account.
          </p>

          <div style={{ ...infoBox, marginTop: 24 }}>
            <p style={{ ...body, margin: 0 }}>
              Once confirmed, deletion completes within <strong>30 days</strong>
              . You'll get a final email when it's done. If you change your mind
              before then, just sign in again — that cancels the request.
            </p>
          </div>

          <Link href="/" style={{ ...btnGhost, marginTop: 24 }}>
            Back to SmileBabaHub
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      {/* ─── Heading ─── */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={h1}>Delete your SmileBabaHub account</h1>
        <p style={{ ...body, marginTop: 10 }}>
          You can request deletion here, or from the app under{" "}
          <strong>You → Settings → Delete account</strong>. Both do the same
          thing.
        </p>
      </div>

      {/* ─── What happens ─── */}
      <section style={card}>
        <h2 style={h2}>What gets deleted</h2>
        <ul style={ul}>
          <li>Your profile, name, email, phone number and photo</li>
          <li>Your listings and any drafts</li>
          <li>Saved items, cart and search history</li>
          <li>Messages you've sent and received</li>
          <li>Notification and marketing preferences</li>
          <li>Device tokens used for push notifications</li>
        </ul>

        <h2 style={{ ...h2, marginTop: 28 }}>What we have to keep</h2>
        <p style={{ ...body, marginBottom: 12 }}>
          Some records can't be deleted on request because we're legally
          required to hold them. These are kept in isolation, aren't used for
          any other purpose, and are removed once the retention period ends.
        </p>

        <div style={retentionTable}>
          <RetentionRow
            what="Order, booking and payment records"
            howLong="Up to 7 years"
            why="Tax and accounting law in Ghana and Nigeria"
          />
          <RetentionRow
            what="Money transfer records"
            howLong="Up to 7 years"
            why="Anti-money-laundering regulations"
          />
          <RetentionRow
            what="Identity verification (KYC) documents"
            howLong="Up to 5 years"
            why="Financial regulation, where you completed verification"
          />
          <RetentionRow
            what="Fraud and abuse records"
            howLong="Up to 2 years"
            why="Protecting other users from repeat accounts"
          />
          <RetentionRow
            what="Open disputes or refunds"
            howLong="Until resolved"
            why="So the other party isn't left without recourse"
            last
          />
        </div>

        <div style={{ ...infoBox, marginTop: 20 }}>
          <p style={{ ...body, margin: 0, fontSize: 14 }}>
            Anything held for these reasons is stripped of everything not
            required — a retained order record keeps the amount, date and
            reference, not your profile.
          </p>
        </div>
      </section>

      {/* ─── Before you go ─── */}
      <section style={{ ...card, marginTop: 20 }}>
        <h2 style={h2}>Before you request deletion</h2>
        <ul style={ul}>
          <li>
            <strong>Finish any open orders or bookings.</strong> Deleting won't
            cancel them, and you'll lose the ability to track or dispute them.
          </li>
          <li>
            <strong>Withdraw your vendor balance.</strong> Any money still held
            after deletion has to be claimed through support, which is slower.
          </li>
          <li>
            <strong>This can't be undone.</strong> A new account starts from
            scratch — same email is fine, but nothing carries over.
          </li>
        </ul>
      </section>

      {/* ─── Form ─── */}
      <section style={{ ...card, marginTop: 20 }}>
        <h2 style={h2}>Request deletion</h2>
        <p style={{ ...body, marginTop: 6, marginBottom: 20 }}>
          Use the email address on your SmileBabaHub account. We'll send a
          confirmation link there before anything is deleted.
        </p>

        <form onSubmit={submit}>
          <Field
            label="Email address on your account"
            required
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
          />

          <Field
            label="Phone number"
            optional
            type="tel"
            value={phone}
            onChange={setPhone}
            placeholder="024 123 4567"
            hint="Helps us find your account faster if you signed up by phone."
          />

          <div style={{ marginTop: 18 }}>
            <label style={labelStyle}>
              Reason{" "}
              <span style={{ color: "#9CA3AF", fontWeight: 500 }}>
                optional
              </span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{ ...input, appearance: "none", cursor: "pointer" }}
            >
              <option value="">Prefer not to say</option>
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: 18 }}>
            <label style={labelStyle}>
              Anything else{" "}
              <span style={{ color: "#9CA3AF", fontWeight: 500 }}>
                optional
              </span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Tell us what went wrong, if you'd like."
              style={{
                ...input,
                minHeight: 90,
                resize: "vertical",
                paddingTop: 12,
              }}
            />
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 11,
              marginTop: 22,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              style={{ width: 18, height: 18, marginTop: 2, accentColor: NAVY }}
            />
            <span style={{ ...body, fontSize: 14 }}>
              I understand this permanently deletes my account and that it can't
              be reversed.
            </span>
          </label>

          {error && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 12,
                padding: 13,
                marginTop: 18,
                fontSize: 14,
                color: "#991B1B",
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              ...btnPrimary,
              marginTop: 22,
              background: canSubmit ? "#DC2626" : "#F3F4F6",
              color: canSubmit ? "white" : "#9CA3AF",
              cursor: canSubmit ? "pointer" : "not-allowed",
            }}
          >
            {submitting ? "Sending…" : "Request account deletion"}
          </button>
        </form>

        <p
          style={{ ...body, fontSize: 13, textAlign: "center", marginTop: 16 }}
        >
          Rather talk to someone first?{" "}
          <Link href="/contact" style={link}>
            Contact support
          </Link>
        </p>
      </section>

      <p
        style={{
          ...body,
          fontSize: 13,
          textAlign: "center",
          marginTop: 26,
          color: "#9CA3AF",
        }}
      >
        Read our{" "}
        <Link href="/legal/privacy" style={link}>
          Privacy Policy
        </Link>{" "}
        for the full detail on how we handle your information.
      </p>
    </Shell>
  );
}

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
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
            color: NAVY,
            textDecoration: "none",
            marginBottom: 28,
          }}
        >
          ← SmileBabaHub
        </Link>
        {children}
      </div>
    </main>
  );
}

function RetentionRow({
  what,
  howLong,
  why,
  last,
}: {
  what: string;
  howLong: string;
  why: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderBottom: last ? "none" : "1px solid #F0F1F3",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 14,
          alignItems: "baseline",
        }}
      >
        <span style={{ fontSize: 14.5, fontWeight: 600, color: "#111827" }}>
          {what}
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: NAVY,
            whiteSpace: "nowrap",
          }}
        >
          {howLong}
        </span>
      </div>
      <p
        style={{
          fontSize: 13,
          color: "#6B7280",
          margin: "4px 0 0",
          lineHeight: 1.5,
        }}
      >
        {why}
      </p>
    </div>
  );
}

function Field({
  label,
  optional,
  required,
  type = "text",
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  optional?: boolean;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div style={{ marginTop: 18 }}>
      <label style={labelStyle}>
        {label}
        {optional && (
          <span style={{ color: "#9CA3AF", fontWeight: 500 }}> optional</span>
        )}
        {required && <span style={{ color: "#DC2626" }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={input}
      />
      {hint && (
        <p style={{ fontSize: 12.5, color: "#9CA3AF", margin: "6px 0 0" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────
const h1: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  color: "#111827",
  letterSpacing: "-0.6px",
  margin: 0,
  lineHeight: 1.25,
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
  lineHeight: 1.65,
  margin: 0,
};

const card: React.CSSProperties = {
  background: "white",
  borderRadius: 18,
  padding: 26,
  border: "1px solid #F0F1F3",
};

const ul: React.CSSProperties = {
  ...body,
  paddingLeft: 20,
  marginTop: 12,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const retentionTable: React.CSSProperties = {
  border: "1px solid #F0F1F3",
  borderRadius: 14,
  overflow: "hidden",
  marginTop: 14,
};

const infoBox: React.CSSProperties = {
  background: "#F9FAFB",
  borderRadius: 12,
  padding: 14,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 14,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 7,
};

const input: React.CSSProperties = {
  width: "100%",
  height: 46,
  border: "1px solid #E5E7EB",
  borderRadius: 12,
  padding: "0 14px",
  fontSize: 15,
  color: "#111827",
  outline: "none",
  background: "white",
  fontFamily: "inherit",
};

const btnPrimary: React.CSSProperties = {
  width: "100%",
  height: 50,
  border: "none",
  borderRadius: 14,
  fontSize: 15,
  fontWeight: 700,
  fontFamily: "inherit",
};

const btnGhost: React.CSSProperties = {
  display: "block",
  textAlign: "center",
  padding: "13px 0",
  border: "1px solid #E5E7EB",
  borderRadius: 14,
  fontSize: 14.5,
  fontWeight: 600,
  color: "#374151",
  textDecoration: "none",
};

const link: React.CSSProperties = {
  color: NAVY,
  fontWeight: 600,
  textDecoration: "underline",
};
