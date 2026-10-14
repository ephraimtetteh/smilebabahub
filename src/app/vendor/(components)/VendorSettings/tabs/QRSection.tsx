"use client";
// src/app/vendor/settings/(tabs)/QRSection.tsx
// QR code generator for a vendor's store page.
// Uses the browser's native Canvas API — no external QR library needed.
// Generates a QR code that links to smilebabahub.com/store/{slug}
// and lets the vendor download or share it.

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Download,
  Share2,
  Copy,
  Check,
  QrCode,
  ExternalLink,
} from "lucide-react";

const BASE_URL = "https://smilebabahub.com";

// ── Tiny QR encoder using qrcode.js-like algorithm via CDN script ──────────
// We load qrcode-generator via CDN into a script tag at runtime — no npm dep.
// All logic runs client-side.

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    qrcode: any;
  }
}

interface QRSectionProps {
  storeSlug: string;
  storeName: string;
}

type ShareItem = {
  id: string;
  label: string;
  color: string;
  icon: string;
  href: ((url: string, name: string) => string) | undefined;
};

const SOCIAL_SHARE: ShareItem[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    color: "#25D366",
    icon: "💬",
    href: (url, name) =>
      `https://wa.me/?text=${encodeURIComponent(`Shop at ${name} on SmileBaba: ${url}`)}`,
  },
  {
    id: "instagram",
    label: "Copy for IG",
    color: "#E1306C",
    icon: "📸",
    href: undefined, // Instagram doesn't support URL sharing — copy to clipboard
  },
  {
    id: "twitter",
    label: "X / Twitter",
    color: "#000000",
    icon: "🐦",
    href: (url, name) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Shop ${name} on SmileBaba 🛒`)}&url=${encodeURIComponent(url)}`,
  },
  {
    id: "facebook",
    label: "Facebook",
    color: "#1877F2",
    icon: "👍",
    href: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "tiktok",
    label: "Copy for TikTok",
    color: "#010101",
    icon: "🎵",
    href: undefined,
  },
];

export default function QRSection({ storeSlug, storeName }: QRSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);
  const [error, setError] = useState(false);

  const storeUrl = storeSlug ? `${BASE_URL}/store/${storeSlug}` : null;

  // ── Load qrcode-generator via CDN once ─────────────────────────────────
  useEffect(() => {
    if (window.qrcode) {
      setQrLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    script.onload = () => setQrLoaded(true);
    script.onerror = () => setError(true);
    document.head.appendChild(script);
  }, []);

  // ── Draw QR once library is ready and we have a slug ───────────────────
  const drawQR = useCallback(() => {
    if (!qrLoaded || !storeUrl || !canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      const size = 220;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;

      // Use qrcodejs to generate the QR matrix, draw on canvas manually
      // qrcodejs can render directly into a div, so we use a temp div
      const tempDiv = document.createElement("div");
      tempDiv.style.visibility = "hidden";
      tempDiv.style.position = "absolute";
      document.body.appendChild(tempDiv);

      // eslint-disable-next-line no-new
      new window.qrcode(tempDiv, {
        text: storeUrl,
        width: size,
        height: size,
        colorDark: "#1a1a1a",
        colorLight: "#ffffff",
        correctLevel: window.qrcode.CorrectLevel?.M ?? 1,
      });

      // qrcodejs renders an <img> or <canvas> into the div
      const img = tempDiv.querySelector("img") as HTMLImageElement | null;
      const qrCanvas = tempDiv.querySelector(
        "canvas",
      ) as HTMLCanvasElement | null;

      if (img) {
        img.onload = () => {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, size, size);
          ctx.drawImage(img, 0, 0, size, size);
          document.body.removeChild(tempDiv);
          // Add SmileBaba logo watermark
          addWatermark(ctx, size);
          setReady(true);
        };
      } else if (qrCanvas) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(qrCanvas, 0, 0, size, size);
        document.body.removeChild(tempDiv);
        addWatermark(ctx, size);
        setReady(true);
      } else {
        document.body.removeChild(tempDiv);
        setError(true);
      }
    } catch (err) {
      console.error("QR draw error:", err);
      setError(true);
    }
  }, [qrLoaded, storeUrl]);

  function addWatermark(ctx: CanvasRenderingContext2D, size: number) {
    // Small brand label at bottom
    const labelH = 22;
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, size - labelH, size, labelH);
    ctx.fillStyle = "#ffc105";
    ctx.font = "bold 10px Arial";
    ctx.textAlign = "center";
    ctx.fillText("SmileBaba Hub", size / 2, size - 7);
  }

  useEffect(() => {
    drawQR();
  }, [drawQR]);

  // ── Download QR as PNG ──────────────────────────────────────────────────
  const download = () => {
    if (!canvasRef.current || !ready) return;
    const link = document.createElement("a");
    link.download = `${storeSlug || "store"}-qr.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  // ── Copy URL to clipboard ───────────────────────────────────────────────
  const copyUrl = async () => {
    if (!storeUrl) return;
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = storeUrl ?? "";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!storeSlug) {
    return (
      <div className="mt-6 pt-5 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <QrCode size={16} className="text-gray-400" />
          <p className="text-sm font-bold text-gray-700">Store QR Code</p>
        </div>
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-5 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            Set a store slug above to generate your QR code.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-5 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <QrCode size={16} className="text-gray-700" />
        <p className="text-sm font-bold text-gray-900">Store QR Code</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-5">
        {/* QR canvas */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0">
          <div
            className="w-[220px] h-[220px] bg-white border border-gray-200
            rounded-2xl overflow-hidden shadow-sm flex items-center justify-center"
          >
            {error ? (
              <p className="text-xs text-gray-400 text-center px-4">
                Could not generate QR.
                <br />
                Check your internet connection.
              </p>
            ) : (
              <>
                <canvas
                  ref={canvasRef}
                  className={`${ready ? "block" : "hidden"}`}
                  style={{ imageRendering: "pixelated" }}
                />
                {!ready && (
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-8 h-8 border-2 border-yellow-400 border-t-transparent
                      rounded-full animate-spin"
                    />
                    <p className="text-[10px] text-gray-400">Generating…</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Store URL */}
          <div
            className="w-[220px] flex items-center gap-1.5 bg-gray-50 border
            border-gray-200 rounded-xl px-3 py-2"
          >
            <p className="text-[10px] text-gray-500 truncate flex-1 font-mono">
              {storeUrl}
            </p>
            <a
              href={storeUrl ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
            >
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-1 flex flex-col gap-3">
          <p className="text-xs text-gray-600 leading-relaxed">
            Share this QR code on your packaging, receipts, posters, or socials.
            Anyone who scans it will land on your SmileBaba store.
          </p>

          {/* Download + Copy */}
          <div className="flex gap-2">
            <button
              onClick={download}
              disabled={!ready}
              className="flex-1 flex items-center justify-center gap-2 py-2.5
                bg-gray-900 text-white text-xs font-bold rounded-xl
                hover:bg-gray-700 active:scale-95 transition-all
                disabled:opacity-40"
            >
              <Download size={13} /> Download PNG
            </button>
            <button
              onClick={copyUrl}
              className="flex-1 flex items-center justify-center gap-2 py-2.5
                bg-white border border-gray-200 text-gray-700 text-xs font-bold
                rounded-xl hover:bg-gray-50 active:scale-95 transition-all"
            >
              {copied ? (
                <Check size={13} className="text-green-500" />
              ) : (
                <Copy size={13} />
              )}
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>

          {/* Share via socials */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Share on socials
            </p>
            <div className="flex flex-wrap gap-2">
              {SOCIAL_SHARE.map((s) => {
                const url = storeUrl!;
                const name = storeName || "our store";

                // Clipboard-only share (Instagram, TikTok)
                if (!s.href) {
                  return (
                    <button
                      key={s.id}
                      onClick={async () => {
                        await navigator.clipboard.writeText(
                          `${name} on SmileBaba 🛒 ${url}`,
                        );
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl
                        text-white text-xs font-semibold
                        active:scale-95 transition-all"
                      style={{ backgroundColor: s.color }}
                    >
                      <span>{s.icon}</span> {s.label}
                    </button>
                  );
                }

                const hrefFn = s.href;
                return (
                  <a
                    key={s.id}
                    href={hrefFn(url, name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl
                      text-white text-xs font-semibold
                      active:scale-95 transition-all hover:opacity-90"
                    style={{ backgroundColor: s.color }}
                  >
                    <span>{s.icon}</span> {s.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Native share API on mobile */}
          {typeof window !== "undefined" && "share" in navigator && (
            <button
              onClick={() =>
                navigator.share({
                  title: `${storeName || "Our Store"} on SmileBaba`,
                  text: `Shop at ${storeName || "our store"} on SmileBaba Hub`,
                  url: storeUrl!,
                })
              }
              className="flex items-center justify-center gap-2 py-2.5 w-full
                bg-yellow-400 text-black text-xs font-black rounded-xl
                hover:bg-yellow-300 active:scale-95 transition-all"
            >
              <Share2 size={13} /> Share via your apps
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
