"use client";

// src/components/home/LiveTvHero.tsx
//
// The TV hero, full width.
//
// Replaces LiveTvCard plus the Up Next column. That split was costing
// the video about a third of its width for a list nobody was choosing
// from — the channel rail does the same job in a strip.
//
// Desktop: video fills the card, channels sit in a rail down the right.
// Mobile: video keeps 16:9, channels become a horizontal scroll beneath.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play, Volume2, VolumeX, Maximize2, ChevronRight } from "lucide-react";

const TV_STREAM =
  "https://media2.streambrothers.com:1936/8056/8056/playlist.m3u8";

interface Channel {
  id: string;
  name: string;
  /** Short label when there's no logo image */
  short: string;
  colour: string;
  logo?: string;
}

// Swap `logo` in as you get the assets. The coloured tile is the
// fallback, and it holds up on its own.
const CHANNELS: Channel[] = [
  { id: "joy", name: "JoyNews", short: "JOY", colour: "#DC2626" },
  { id: "ghone", name: "GHOne TV", short: "GH1", colour: "#1D4ED8" },
  { id: "adom", name: "Adom TV", short: "ADOM", colour: "#CA8A04" },
  { id: "utv", name: "UTV Ghana", short: "UTV", colour: "#16A34A" },
  { id: "tv3", name: "TV3", short: "TV3", colour: "#7C3AED" },
];

export default function LiveTvHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [active, setActive] = useState("joy");
  const [ready, setReady] = useState(false);

  // HLS needs a polyfill outside Safari. Loaded lazily so it isn't in
  // the bundle for people who never scroll to the video.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: any;

    const canPlayNatively = video.canPlayType("application/vnd.apple.mpegurl");

    if (canPlayNatively) {
      video.src = TV_STREAM;
      setReady(true);
    } else {
      import("hls.js")
        .then(({ default: Hls }) => {
          if (!Hls.isSupported()) return;
          hls = new Hls({ lowLatencyMode: true });
          hls.loadSource(TV_STREAM);
          hls.attachMedia(video);
          setReady(true);
        })
        .catch(() => {
          // No HLS support and no polyfill. The poster and the Watch Live
          // link still work, which is enough.
        });
    }

    return () => hls?.destroy();
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const goFullscreen = () => {
    videoRef.current?.requestFullscreen?.().catch(() => {});
  };

  return (
    <section className="overflow-hidden rounded-2xl bg-neutral-950 lg:flex">
      {/* ─── Video ─── */}
      <div className="relative flex-1 lg:min-h-[420px]">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          loop
          className="aspect-video h-full w-full object-cover lg:aspect-auto"
        />

        {/* Legibility for the text over the picture */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent"
          aria-hidden
        />

        {/* Live */}
        <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded bg-red-600 px-2 py-1 sm:left-6 sm:top-6">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          <span className="text-[10px] font-bold tracking-wide text-white">
            LIVE
          </span>
        </div>

        {/* Copy */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:top-1/2 lg:max-w-md lg:-translate-y-1/2 lg:pb-0">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            SmileBaba <span className="text-amber-400">TV</span>
          </h1>
          <p className="mt-1 text-sm font-medium text-white/85 sm:text-lg">
            Live TV, anytime, anywhere
          </p>
          <p className="mt-1 hidden text-xs text-white/55 sm:block sm:text-sm">
            News, entertainment, sports, music and more
          </p>

          <div className="mt-4 flex items-center gap-2.5">
            <Link
              href="/tv"
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2.5 text-[13px] font-bold text-gray-900 transition hover:bg-amber-300 sm:px-5"
            >
              <Play size={14} className="fill-gray-900" />
              Watch Live
            </Link>

            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:bg-white/10"
            >
              {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            <button
              onClick={goFullscreen}
              aria-label="Fullscreen"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:bg-white/10 sm:flex"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>

        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-amber-400" />
          </div>
        )}
      </div>

      {/* ─── Channels ─── */}
      {/* Rail on desktop, strip underneath on mobile */}
      <div className="border-t border-white/10 lg:w-[168px] lg:shrink-0 lg:border-l lg:border-t-0">
        <p className="hidden px-4 pt-4 text-[10px] font-bold tracking-widest text-white/40 lg:block">
          CHANNELS
        </p>

        <div className="flex gap-2 overflow-x-auto p-3 lg:flex-col lg:gap-2 lg:overflow-visible lg:p-3">
          {CHANNELS.map((c) => {
            const on = active === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 transition lg:w-full ${
                  on ? "bg-white/15" : "hover:bg-white/8"
                }`}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold text-white"
                  style={{ background: c.colour }}
                >
                  {c.short}
                </span>
                <span
                  className={`whitespace-nowrap text-[11px] font-semibold lg:whitespace-normal ${
                    on ? "text-white" : "text-white/60"
                  }`}
                >
                  {c.name}
                </span>
              </button>
            );
          })}

          <Link
            href="/tv"
            className="flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2.5 text-[11px] font-semibold text-amber-400 transition hover:bg-white/8 lg:w-full"
          >
            All channels
            <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
