// ═══════════════════════════════════════════════════════════════════════
// client/app/global-error.tsx
//
// error.tsx can't catch a failure in the root layout itself — that needs
// its own boundary, which has to render its own <html> and <body>.
// ═══════════════════════════════════════════════════════════════════════

"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error.message, error.digest, error.stack);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#F9FAFB",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 460,
            background: "white",
            borderRadius: 20,
            padding: 32,
            border: "1px solid #F0F1F3",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>
            SmileBabaHub couldn't load
          </h1>
          <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.6, marginTop: 12 }}>
            Something broke before the page could start. Reloading usually fixes it.
          </p>
          <pre
            style={{
              background: "#F9FAFB",
              borderRadius: 12,
              padding: 14,
              marginTop: 18,
              fontSize: 12.5,
              color: "#991B1B",
              textAlign: "left",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {error.message}
          </pre>
          <button
            onClick={reset}
            style={{
              width: "100%",
              height: 48,
              marginTop: 20,
              border: "none",
              borderRadius: 14,
              background: "#FFC105",
              color: "#111827",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}

