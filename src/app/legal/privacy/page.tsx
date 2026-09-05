// client/app/legal/privacy/page.tsx
//
// Privacy policy. Renders from lib/legal/privacyPolicy.ts so the web and
// app versions can't drift — which matters because Apple and Google both
// check that the policy linked from the store listing matches the one in
// the app.
//
// Route: /legal/privacy
// This exact URL goes in both store listings.

import Link from "next/link";
import type { Metadata } from "next";
import { PolicyBlock, PRIVACY_CONTACT_EMAIL, PRIVACY_INTRO, PRIVACY_LAST_UPDATED, PRIVACY_SECTIONS } from "@/src/lib/legal/privacyPolicy";



const NAVY = "#0B2A63";

export const metadata: Metadata = {
  title: "Privacy Policy · SmileBabaHub",
  description:
    "How SmileBabaHub collects, uses, stores, protects and deletes your personal information across our marketplace, food, stays and money services.",
};

export default function PrivacyPolicyPage() {
  return (
    <main
      style={{
        background: "#F9FAFB",
        minHeight: "100vh",
        padding: "40px 20px 72px",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <Link href="/" style={backLink}>
          ← SmileBabaHub
        </Link>

        {/* ─── Header ─── */}
        <header style={{ marginBottom: 30 }}>
          <h1 style={h1}>Privacy Policy</h1>
          <p style={{ ...meta, marginTop: 10 }}>
            Last updated {PRIVACY_LAST_UPDATED} · Applies to SmileBabaHub web,
            iOS and Android
          </p>
        </header>

        {/* ─── Intro ─── */}
        <section style={card}>
          {PRIVACY_INTRO.map((b, i) => (
            <Block key={i} block={b} />
          ))}
        </section>

        {/* ─── Contents ─── */}
        <nav style={{ ...card, marginTop: 20 }}>
          <h2 style={{ ...h2, marginBottom: 14 }}>Contents</h2>
          <ol style={tocList}>
            {PRIVACY_SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} style={tocLink}>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ─── Sections ─── */}
        {PRIVACY_SECTIONS.map((section) => (
          <section
            key={section.id}
            id={section.id}
            style={{ ...card, marginTop: 20, scrollMarginTop: 24 }}
          >
            <h2 style={h2}>{section.title}</h2>
            {section.blocks.map((b, i) => (
              <Block key={i} block={b} />
            ))}

            {/* The deletion section is the one people arrive looking for */}
            {section.id === "account-deletion" && (
              <Link
                href="/account/delete"
                style={{ ...btnPrimary, marginTop: 20 }}
              >
                Request account deletion
              </Link>
            )}
          </section>
        ))}

        {/* ─── Footer ─── */}
        <footer style={{ ...card, marginTop: 20, textAlign: "center" }}>
          <p style={{ ...body, margin: 0 }}>
            Questions about any of this?{" "}
            <a href={`mailto:${PRIVACY_CONTACT_EMAIL}`} style={link}>
              {PRIVACY_CONTACT_EMAIL}
            </a>
          </p>
          <div
            style={{
              display: "flex",
              gap: 20,
              justifyContent: "center",
              marginTop: 16,
              flexWrap: "wrap",
            }}
          >
            <Link href="/legal/terms" style={link}>
              Terms of Service
            </Link>
            <Link href="/account/delete" style={link}>
              Delete your account
            </Link>
            <Link href="/contact" style={link}>
              Contact us
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

// ─── Block renderer ──────────────────────────────────────────────────
function Block({ block }: { block: PolicyBlock }) {
  if (block.callout) {
    return (
      <div style={callout}>
        <p style={{ ...body, margin: 0, color: "#1E3A8A", fontWeight: 500 }}>
          {block.callout}
        </p>
      </div>
    );
  }

  if (block.h3) {
    return <h3 style={h3}>{block.h3}</h3>;
  }

  if (block.list) {
    return (
      <ul style={ul}>
        {block.list.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.ordered) {
    return (
      <ol style={ul}>
        {block.ordered.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ol>
    );
  }

  return <p style={{ ...body, marginTop: 14 }}>{block.p}</p>;
}

// ─── Styles ──────────────────────────────────────────────────────────
const h1: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 700,
  color: "#111827",
  letterSpacing: "-0.8px",
  margin: 0,
  lineHeight: 1.2,
};

const h2: React.CSSProperties = {
  fontSize: 19,
  fontWeight: 700,
  color: "#111827",
  letterSpacing: "-0.3px",
  margin: 0,
  lineHeight: 1.35,
};

const h3: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: "#374151",
  margin: "22px 0 0",
};

const body: React.CSSProperties = {
  fontSize: 15,
  color: "#4B5563",
  lineHeight: 1.7,
  margin: 0,
};

const meta: React.CSSProperties = {
  fontSize: 14,
  color: "#9CA3AF",
  margin: 0,
};

const card: React.CSSProperties = {
  background: "white",
  borderRadius: 18,
  padding: "26px 28px",
  border: "1px solid #F0F1F3",
};

const ul: React.CSSProperties = {
  ...body,
  paddingLeft: 22,
  marginTop: 14,
  display: "flex",
  flexDirection: "column",
  gap: 7,
};

const callout: React.CSSProperties = {
  background: "#EFF6FF",
  borderLeft: `3px solid ${NAVY}`,
  borderRadius: 10,
  padding: "14px 16px",
  marginTop: 16,
};

const tocList: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 9,
};

const tocLink: React.CSSProperties = {
  fontSize: 14,
  color: "#4B5563",
  textDecoration: "none",
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
  marginBottom: 28,
};

const link: React.CSSProperties = {
  color: NAVY,
  fontWeight: 600,
  textDecoration: "underline",
  fontSize: 14.5,
};

const btnPrimary: React.CSSProperties = {
  display: "inline-block",
  background: NAVY,
  color: "white",
  padding: "13px 24px",
  borderRadius: 14,
  fontSize: 14.5,
  fontWeight: 700,
  textDecoration: "none",
};
