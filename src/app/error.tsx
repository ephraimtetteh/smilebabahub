// client/app/error.tsx
//
// Catches client-side exceptions in any route below the root layout.
//
// The default Next.js production screen says "a client-side exception has
// occurred" and nothing else, which is unusable for both the person
// hitting it and whoever has to fix it. This shows the message, offers a
// way out, and logs enough to find the cause.

"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest is what ties this to a server-side log entry in Vercel
    console.error("[app error]", error.message, error.digest, error.stack);
  }, [error]);

  // Show the message in preview and development, hide it in production
  // once you're past debugging — set NEXT_PUBLIC_SHOW_ERRORS=false then.
  const showDetail =
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_SHOW_ERRORS !== "false";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F9FAFB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          background: "white",
          borderRadius: 20,
          padding: 32,
          border: "1px solid #F0F1F3",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 999,
            background: "#FEF3C7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: 28,
          }}
        >
          ⚠️
        </div>

        <h1
          style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}
        >
          Something went wrong on this page
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "#4B5563",
            lineHeight: 1.6,
            marginTop: 12,
          }}
        >
          Your work wasn't lost — if you just posted a listing, it went through.
          This is only the page that failed to load.
        </p>

        {showDetail && (
          <pre
            style={{
              background: "#F9FAFB",
              border: "1px solid #F0F1F3",
              borderRadius: 12,
              padding: 14,
              marginTop: 20,
              fontSize: 12.5,
              color: "#991B1B",
              textAlign: "left",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: 1.5,
            }}
          >
            {error.message}
            {error.digest ? `\n\nDigest: ${error.digest}` : ""}
          </pre>
        )}

        <div
          style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}
        >
          <button onClick={reset} style={btnPrimary}>
            Try again
          </button>
          <Link href="/" style={btnGhost}>
            Go home
          </Link>
        </div>

        <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 20 }}>
          Still stuck?{" "}
          <Link href="/contact" style={{ color: "#0B2A63", fontWeight: 600 }}>
            Tell us what happened
          </Link>
        </p>
      </div>
    </main>
  );
}

const btnPrimary: React.CSSProperties = {
  flex: 1,
  minWidth: 140,
  height: 48,
  border: "none",
  borderRadius: 14,
  background: "#FFC105",
  color: "#111827",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
};

const btnGhost: React.CSSProperties = {
  flex: 1,
  minWidth: 140,
  height: 48,
  lineHeight: "48px",
  border: "1px solid #E5E7EB",
  borderRadius: 14,
  fontSize: 15,
  fontWeight: 600,
  color: "#374151",
  textDecoration: "none",
  background: "white",
};
