// client/app/contact/page.tsx
//
// Contact.
//
// Routed by topic rather than one generic form, because a stuck payment
// and a press enquiry need different people and different urgency. The
// order and transfer reference fields appear only where they're relevant
// — asking a job applicant for an order number is how forms get
// abandoned.
//
// Route: /contact

"use client";

import { useState } from "react";
import Link from "next/link";

const NAVY = "#0B2A63";
const YELLOW = "#FFC105";

interface Topic {
  id: string;
  label: string;
  hint: string;
  /** Show the order/transfer reference field */
  needsReference?: boolean;
  /** Reply expectation shown once selected */
  sla: string;
}

const TOPICS: Topic[] = [
  {
    id: "order",
    label: "An order or delivery",
    hint: "Something you bought that hasn't arrived or isn't right",
    needsReference: true,
    sla: "Within 24 hours",
  },
  {
    id: "money",
    label: "A money transfer",
    hint: "A transfer that's delayed, failed, or went to the wrong place",
    needsReference: true,
    sla: "Within 12 hours — transfers are treated as urgent",
  },
  {
    id: "booking",
    label: "A stay or booking",
    hint: "Check-in problems, cancellations, or a host who isn't responding",
    needsReference: true,
    sla: "Within 24 hours",
  },
  {
    id: "account",
    label: "My account",
    hint: "Sign-in problems, verification, or changing your details",
    sla: "Within 24 hours",
  },
  {
    id: "vendor",
    label: "Selling on SmileBabaHub",
    hint: "Listings, payouts, subscriptions, or your store",
    sla: "Within 24 hours",
  },
  {
    id: "report",
    label: "Reporting something",
    hint: "A scam, a fake listing, or someone behaving badly",
    sla: "Within 12 hours — reports are prioritised",
  },
  {
    id: "business",
    label: "Business or press",
    hint: "Partnerships, advertising, or media enquiries",
    sla: "Within 3 business days",
  },
];

export default function ContactPage() {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const canSubmit =
    !!topic &&
    name.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(email.trim()) &&
    message.trim().length > 9 &&
    !submitting;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic!.id,
          topicLabel: topic!.label,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || undefined,
          reference: reference.trim() || undefined,
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b?.message ?? "Request failed");
      }
      setSent(true);
    } catch (err: any) {
      setError(
        err?.message ??
          "We couldn't send that. Please email support@smilebabahub.com instead.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Sent ─────────────────────────────────────────────────────────
  if (sent) {
    return (
      <Shell>
        <div style={{ ...card, textAlign: "center" }}>
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
          <h1 style={{ ...h1, fontSize: 22 }}>Message sent</h1>
          <p style={{ ...body, marginTop: 10 }}>
            We've got it and sent a copy to <strong>{email}</strong>.{" "}
            {topic?.sla ?? "We'll reply within 24 hours."}
          </p>
          <Link href="/" style={{ ...btnGhost, marginTop: 24 }}>
            Back to SmileBabaHub
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div style={{ marginBottom: 28 }}>
        <h1 style={h1}>Get in touch</h1>
        <p style={{ ...body, marginTop: 10 }}>
          Tell us what it's about and we'll route it to the right person.
        </p>
      </div>

      {/* ─── Quick channels ─── */}
      <div style={quickGrid}>
        <QuickCard
          emoji="💬"
          title="WhatsApp"
          detail="Fastest for anything urgent"
          href="https://wa.me/233000000000"
        />
        <QuickCard
          emoji="✉️"
          title="support@smilebabahub.com"
          detail="General support"
          href="mailto:support@smilebabahub.com"
        />
        <QuickCard
          emoji="🔒"
          title="privacy@smilebabahub.com"
          detail="Privacy and data requests"
          href="mailto:privacy@smilebabahub.com"
        />
      </div>

      {/* ─── Form ─── */}
      <section style={{ ...card, marginTop: 20 }}>
        <form onSubmit={submit}>
          {/* Topic */}
          <label style={labelStyle}>What's it about?</label>
          <div style={{ display: "grid", gap: 9, marginTop: 9 }}>
            {TOPICS.map((t) => {
              const on = topic?.id === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTopic(t)}
                  style={{
                    ...topicButton,
                    borderColor: on ? NAVY : "#E5E7EB",
                    borderWidth: on ? 1.5 : 1,
                    background: on ? "#EFF6FF" : "white",
                  }}
                >
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: on ? NAVY : "#111827",
                    }}
                  >
                    {t.label}
                  </span>
                  <span
                    style={{ fontSize: 13.5, color: "#6B7280", marginTop: 3 }}
                  >
                    {t.hint}
                  </span>
                </button>
              );
            })}
          </div>

          {topic && (
            <div style={{ ...slaBox, marginTop: 14 }}>
              <span
                style={{ fontSize: 13.5, color: "#1E3A8A", fontWeight: 500 }}
              >
                Expected reply: {topic.sla}
              </span>
            </div>
          )}

          <Field
            label="Your name"
            required
            value={name}
            onChange={setName}
            placeholder="Kwame Mensah"
          />
          <Field
            label="Email"
            required
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            hint="We'll reply here."
          />
          <Field
            label="Phone"
            optional
            type="tel"
            value={phone}
            onChange={setPhone}
            placeholder="024 123 4567"
          />

          {/* Only where it means something */}
          {topic?.needsReference && (
            <Field
              label={
                topic.id === "money"
                  ? "Transfer reference"
                  : topic.id === "booking"
                    ? "Booking reference"
                    : "Order number"
              }
              optional
              value={reference}
              onChange={setReference}
              placeholder={topic.id === "money" ? "TXN-A1B2C3" : "A1B2C3"}
              hint="Find it in the app under your orders, bookings or transfers."
            />
          )}

          <div style={{ marginTop: 18 }}>
            <label style={labelStyle}>
              What's happened? <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              maxLength={2000}
              placeholder="Dates, amounts, what you expected and what happened instead — the more specific, the faster we can sort it."
              style={{
                ...input,
                minHeight: 130,
                resize: "vertical",
                paddingTop: 12,
              }}
            />
            <p
              style={{
                fontSize: 12.5,
                color: "#9CA3AF",
                margin: "6px 0 0",
                textAlign: "right",
              }}
            >
              {message.length} / 2000
            </p>
          </div>

          {error && <div style={errorBox}>{error}</div>}

          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              ...btnPrimary,
              marginTop: 20,
              background: canSubmit ? YELLOW : "#F3F4F6",
              color: canSubmit ? "#111827" : "#9CA3AF",
              cursor: canSubmit ? "pointer" : "not-allowed",
            }}
          >
            {submitting ? "Sending…" : "Send message"}
          </button>
        </form>
      </section>

      {/* ─── Address ─── */}
      <section style={{ ...card, marginTop: 20 }}>
        <h2 style={h2}>SmileBabaHub Ltd.</h2>
        <p style={{ ...body, marginTop: 10 }}>
          Accra, Ghana
          <br />
          Serving Ghana and Nigeria
        </p>
        <div
          style={{ display: "flex", gap: 20, marginTop: 16, flexWrap: "wrap" }}
        >
          <Link href="/legal/privacy" style={link}>
            Privacy Policy
          </Link>
          <Link href="/legal/terms" style={link}>
            Terms of Service
          </Link>
          <Link href="/account/delete" style={link}>
            Delete your account
          </Link>
        </div>
      </section>
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
        <Link href="/" style={backLink}>
          ← SmileBabaHub
        </Link>
        {children}
      </div>
    </main>
  );
}

function QuickCard({
  emoji,
  title,
  detail,
  href,
}: {
  emoji: string;
  title: string;
  detail: string;
  href: string;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" style={quickCard}>
      <span style={{ fontSize: 22 }}>{emoji}</span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#111827",
          marginTop: 8,
        }}
      >
        {title}
      </span>
      <span style={{ fontSize: 12.5, color: "#6B7280", marginTop: 3 }}>
        {detail}
      </span>
    </a>
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
  fontSize: 30,
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
  lineHeight: 1.65,
  margin: 0,
};

const card: React.CSSProperties = {
  background: "white",
  borderRadius: 18,
  padding: 26,
  border: "1px solid #F0F1F3",
};

const quickGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 12,
};

const quickCard: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  background: "white",
  borderRadius: 16,
  padding: 18,
  border: "1px solid #F0F1F3",
  textDecoration: "none",
};

const topicButton: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  textAlign: "left",
  padding: 15,
  borderRadius: 14,
  borderStyle: "solid",
  cursor: "pointer",
  fontFamily: "inherit",
};

const slaBox: React.CSSProperties = {
  background: "#EFF6FF",
  borderRadius: 11,
  padding: "11px 14px",
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

const errorBox: React.CSSProperties = {
  background: "#FEF2F2",
  border: "1px solid #FECACA",
  borderRadius: 12,
  padding: 13,
  marginTop: 18,
  fontSize: 14,
  color: "#991B1B",
  lineHeight: 1.5,
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

const backLink: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontSize: 14,
  fontWeight: 600,
  color: NAVY,
  textDecoration: "none",
  marginBottom: 28,
};

const link: React.CSSProperties = {
  color: NAVY,
  fontWeight: 600,
  textDecoration: "underline",
  fontSize: 14.5,
};
