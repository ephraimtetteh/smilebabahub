"use client";

// src/app/error.tsx
//
// Catches client-side exceptions below the root layout. The default
// production screen says "a client-side exception has occurred" and
// nothing else, which helps nobody.

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error.message, error.digest, error.stack);
  }, [error]);

  const showDetail =
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_SHOW_ERRORS !== "false";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <AlertTriangle size={26} className="text-amber-600" />
        </div>

        <h1 className="mt-5 text-xl font-bold text-gray-900">
          Something went wrong on this page
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
          Your work was not lost. If you just posted a listing, it went through.
          This is only the page that failed to load.
        </p>

        {showDetail && (
          <pre className="mt-5 whitespace-pre-wrap break-words rounded-xl border border-gray-100 bg-gray-50 p-3.5 text-left text-xs leading-relaxed text-red-800">
            {error.message}
            {error.digest ? `\n\nDigest: ${error.digest}` : ""}
          </pre>
        )}

        <div className="mt-6 flex flex-wrap gap-2.5">
          <button
            onClick={reset}
            className="h-12 flex-1 rounded-xl bg-amber-400 text-[15px] font-bold text-gray-900 transition hover:bg-amber-300"
          >
            Try again
          </button>
          <Link
            href="/"
            className="flex h-12 flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white text-[15px] font-semibold text-gray-700 transition hover:border-gray-300"
          >
            Go home
          </Link>
        </div>

        <p className="mt-5 text-[13px] text-gray-400">
          Still stuck?{" "}
          <Link href="/contact" className="font-semibold text-blue-900">
            Tell us what happened
          </Link>
        </p>
      </div>
    </main>
  );
}
