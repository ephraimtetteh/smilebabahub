"use client";

// src/components/home/LiveTvCard.tsx
// Live TV card with dark theme + click-to-expand fullscreen modal.
//
// Important: Hls.js needs the actual .m3u8 playlist URL, not the streaming
// server's API endpoint. The <source> tag inside <video> is intentionally
// REMOVED — Hls.js sets video.src programmatically and any conflicting
// <source> tag causes race conditions where the video either plays the wrong
// URL or fails silently.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Hls from "hls.js";
import { Tv2, Maximize2, X } from "lucide-react";

// The actual HLS playlist — Hls.js can parse this directly, and Safari/iOS
// can play it natively too via video.src.
const STREAM_URL =
  "https://media2.streambrothers.com:1936/8056/8056/playlist.m3u8";

const UPCOMING = [
  { time: "4:00 PM", title: "African News Update" },
  { time: "5:00 PM", title: "Diaspora Connect" },
  { time: "6:00 PM", title: "The DJ Nii Wayne Show" },
];

function useHls(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !enabled) return;

    let hls: Hls | null = null;

    // Native HLS support (Safari, iOS) — easiest path
    if (v.canPlayType("application/vnd.apple.mpegurl")) {
      v.src = STREAM_URL;
      v.play().catch(() => {
        /* autoplay may be blocked, that's fine */
      });
    }
    // Everywhere else, use Hls.js with MediaSource
    else if (Hls.isSupported()) {
      hls = new Hls({
        // Low latency tuning for live streams
        liveDurationInfinity: true,
        enableWorker: true,
      });
      hls.loadSource(STREAM_URL);
      hls.attachMedia(v);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        v.play().catch(() => {
          /* autoplay may be blocked */
        });
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          // Most transient errors are recoverable
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls?.recoverMediaError();
              break;
            default:
              hls?.destroy();
          }
        }
      });
    }

    return () => {
      hls?.destroy();
    };
  }, [videoRef, enabled]);
}

export default function LiveTvCard() {
  const inlineRef = useRef<HTMLVideoElement | null>(null);
  const fullRef = useRef<HTMLVideoElement | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Inline player runs always; fullscreen player attaches only when expanded
  useHls(inlineRef, true);
  useHls(fullRef, expanded);

  // Lock body scroll when fullscreen is open
  useEffect(() => {
    if (expanded) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [expanded]);

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-[11px] font-black text-gray-900 tracking-wider">
              LIVE TV
            </h3>
            <span
              className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full
              flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />{" "}
              LIVE
            </span>
          </div>
          <Link
            href="/tv"
            className="text-[11px] text-gray-500 hover:text-yellow-600 font-bold"
          >
            View all →
          </Link>
        </div>

        <div
          className="bg-[#0a0a0a] rounded-2xl overflow-hidden border border-gray-900
          flex flex-col min-h-[480px] sm:min-h-[560px]"
        >
          {/* Logo strip */}
          <div className="px-4 pt-4 pb-2 text-center">
            <div className="flex items-center justify-center gap-1">
              <span className="text-xl font-black text-yellow-400">Smilebaba</span>
            </div>
            <p className="text-base font-bold text-white -mt-0.5 tracking-wide">
              TV
            </p>
          </div>

          {/* Live stream — click to expand */}
          <button
            onClick={() => setExpanded(true)}
            aria-label="Expand TV to fullscreen"
            className="relative h-44 mx-3 mb-3 rounded-xl overflow-hidden bg-black
              group cursor-pointer active:scale-[0.99] transition"
          >
            {/*
              NOTE: no <source> child here — Hls.js attaches the stream directly via
              video.src. A nested <source> would conflict and cause silent playback failures.
            */}
            <video
              ref={inlineRef}
              className="w-full h-full object-cover pointer-events-none"
              autoPlay
              muted
              playsInline
              loop
              controls={false}
            />
            <div
              className="absolute top-2 left-2 bg-red-500 text-white text-[10px]
              font-black px-2 py-0.5 rounded-full flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />{" "}
              LIVE
            </div>
            <div
              className="absolute top-2 right-2 bg-black/60 backdrop-blur w-7 h-7
              rounded-full flex items-center justify-center
              group-hover:bg-black/80 transition"
            >
              <Maximize2 size={12} className="text-white" />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
          </button>

          <div className="flex-1 px-4 pb-3 overflow-y-auto">
            <div
              className="bg-white/5 border border-white/10 rounded-xl p-3
              flex items-center gap-3 mb-3"
            >
              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded">
                LIVE NOW
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-white truncate">
                  The State of Africa
                </p>
                <p className="text-[10px] text-gray-400">with Smile Baba</p>
              </div>
              <p className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                2:30 PM – 4:00 PM
              </p>
            </div>

            <p className="text-[10px] font-black text-gray-500 tracking-wider mb-2">
              UP NEXT
            </p>
            <div className="space-y-1.5">
              {UPCOMING.map((s) => (
                <div
                  key={s.time}
                  className="bg-white/5 border border-white/5 rounded-lg p-2.5
                  flex items-center gap-2 hover:bg-white/10 transition"
                >
                  <p className="text-[10px] text-yellow-400 font-bold w-14 flex-shrink-0">
                    {s.time}
                  </p>
                  <p className="text-xs text-gray-200 font-medium flex-1 truncate">
                    {s.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setExpanded(true)}
            className="bg-yellow-400 hover:bg-yellow-300 active:scale-[0.99]
              text-black font-black text-sm py-3.5 m-3 rounded-xl
              flex items-center justify-center gap-2 transition"
          >
            <Tv2 size={16} /> Watch Live TV
          </button>
        </div>
      </div>

      {/* ── Fullscreen modal ── */}
      {expanded && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <div className="flex items-center justify-between p-3 sm:p-4 bg-black/80 backdrop-blur">
            <div className="flex items-center gap-2">
              <span
                className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full
                flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />{" "}
                LIVE
              </span>
              <p className="text-sm font-bold text-white">
                Smile Time Africa TV
              </p>
            </div>
            <button
              onClick={() => setExpanded(false)}
              aria-label="Close fullscreen"
              className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full
                flex items-center justify-center transition"
            >
              <X size={16} className="text-white" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center bg-black">
            <video
              ref={fullRef}
              className="w-full h-full object-contain max-h-full"
              autoPlay
              playsInline
              controls
            />
          </div>

          <div className="bg-black/80 backdrop-blur p-3 sm:p-4">
            <p className="text-[10px] text-gray-400 font-bold tracking-wider mb-1">
              NOW SHOWING
            </p>
            <p className="text-sm sm:text-base font-black text-white">
              The State of Africa
            </p>
            <p className="text-xs text-gray-400">
              with Smile Baba · 2:30 PM – 4:00 PM
            </p>
          </div>
        </div>
      )}
    </>
  );
}
