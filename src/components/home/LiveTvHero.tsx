"use client";

// src/components/home/LiveTvHero.tsx
//
// The TV hero.
//
// The right rail used to list channels nobody was clicking. It now
// carries promoted listings — the ones vendors have paid to feature. A
// spot beside a live video stream is worth more than a spot in a row
// halfway down the page, and it makes promotion something you can sell
// properly.
//
// Beneath it, a rotating strip that says what SmileBaba actually is.
// Someone landing on the homepage for the first time sees a TV player
// and has no idea there is a marketplace behind it.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Play,
  Volume2,
  VolumeX,
  Maximize2,
  ChevronRight,
  ShoppingBag,
  UtensilsCrossed,
  BedDouble,
  Send,
  Radio,
} from "lucide-react";

const TV_STREAM =
  "https://media2.streambrothers.com:1936/8056/8056/playlist.m3u8";

const API =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://smilebababackend-vvok.onrender.com/smilebaba";

// ─── The rotating strip ──────────────────────────────────────────────
const PITCHES = [
  {
    icon: ShoppingBag,
    text: "Shop trusted brands with warranty and fast delivery",
    href: "/ads?category=phones,fashion,home-office",
    colour: "text-emerald-400",
  },
  {
    icon: UtensilsCrossed,
    text: "Order food from restaurants near you",
    href: "/ads?category=food",
    colour: "text-red-400",
  },
  {
    icon: BedDouble,
    text: "Book apartments and short stays across Ghana",
    href: "/ads?category=apartments",
    colour: "text-teal-400",
  },
  {
    icon: Send,
    text: "Send money to 120+ countries in seconds",
    href: "/money/send",
    colour: "text-amber-400",
  },
  {
    icon: Radio,
    text: "Listen to SmileBaba Radio, live all day",
    href: "/radio",
    colour: "text-violet-400",
  },
];

export default function LiveTvHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  const [promos, setPromos] = useState<any[]>([]);
  const [pitch, setPitch] = useState(0);

  // ─── Stream ───────────────────────────────────────────────────────
  // HLS needs a polyfill outside Safari. Loaded lazily so it stays out
  // of the bundle for anyone who never reaches the video.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: any;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
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
          // No HLS and no polyfill. The Watch Live link still works,
          // which is enough.
        });
    }

    return () => hls?.destroy();
  }, []);

  // ─── Promotions ───────────────────────────────────────────────────
  const loadPromos = useCallback(async () => {
    try {
      const res = await fetch(`${API}/promote/active?limit=6`);
      if (!res.ok) return;
      const data = await res.json();
      setPromos(data?.promotions ?? data?.items ?? []);
    } catch {
      // The rail hides itself if this fails
    }
  }, []);

  useEffect(() => {
    loadPromos();
  }, [loadPromos]);

  // ─── Rotate the pitch ─────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(
      () => setPitch((p) => (p + 1) % PITCHES.length),
      4500,
    );
    return () => clearInterval(t);
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const Pitch = PITCHES[pitch];
  const PitchIcon = Pitch.icon;

  return (
    <div className="overflow-hidden rounded-2xl bg-neutral-950">
      <div className="lg:flex">
        {/* ═══ Video ═══ */}
        <div className="relative flex-1 lg:min-h-[340px]">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            loop
            className="aspect-video h-full w-full object-cover lg:aspect-auto"
          />

          {/* Bottom-weighted, because that is where the copy sits now */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent"
            aria-hidden
          />

          {/* Live */}
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded bg-red-600 px-2 py-1 sm:left-6 sm:top-6">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            <span className="text-[10px] font-bold tracking-wide text-white">
              LIVE
            </span>
          </div>

          {/* Controls, out of the way of the copy */}
          <div className="absolute right-4 top-4 flex gap-2 sm:right-6 sm:top-6">
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
            >
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <button
              onClick={() =>
                videoRef.current?.requestFullscreen?.().catch(() => {})
              }
              aria-label="Fullscreen"
              className="hidden h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60 sm:flex"
            >
              <Maximize2 size={13} />
            </button>
          </div>

          {/* Bottom left */}
          <div className="absolute bottom-0 left-0 p-5 sm:p-7">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              SmileBaba <span className="text-amber-400">TV</span>
            </h1>
            <p className="mt-1 text-sm font-medium text-white/80 sm:text-base">
              Live TV, anytime, anywhere
            </p>

            <Link
              href="/tv"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-[13px] font-bold text-gray-900 transition hover:bg-amber-300"
            >
              <Play size={14} className="fill-gray-900" />
              Watch Live
            </Link>
          </div>

          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-amber-400" />
            </div>
          )}
        </div>

        {/* ═══ Promotions ═══ */}
        {promos.length > 0 && (
          <aside className="border-t border-white/10 lg:w-[260px] lg:shrink-0 lg:border-l lg:border-t-0">
            <div className="flex items-center justify-between px-4 pt-4">
              <p className="text-[10px] font-bold tracking-widest text-white/40">
                PROMOTED
              </p>
              <Link
                href="/promote"
                className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-400"
              >
                All
                <ChevronRight size={11} />
              </Link>
            </div>

            <div className="flex gap-2.5 overflow-x-auto p-3 lg:max-h-[368px] lg:flex-col lg:overflow-y-auto">
              {promos.slice(0, 5).map((p) => (
                <PromoTile key={p._id} promo={p} />
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* ═══ Rotating pitch ═══ */}
      <Link
        href={Pitch.href}
        className="flex items-center gap-3 border-t border-white/10 px-5 py-3.5 transition hover:bg-white/5"
      >
        <PitchIcon
          size={17}
          className={`shrink-0 ${Pitch.colour}`}
          strokeWidth={2}
        />
        <span
          key={pitch}
          className="flex-1 animate-[fadeIn_.4s_ease] text-[13px] text-white/85 sm:text-sm"
        >
          {Pitch.text}
        </span>

        {/* Which of five you are looking at */}
        <span className="hidden items-center gap-1 sm:flex" aria-hidden>
          {PITCHES.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === pitch ? "w-4 bg-amber-400" : "w-1 bg-white/25"
              }`}
            />
          ))}
        </span>

        <ChevronRight size={15} className="shrink-0 text-white/40" />
      </Link>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(3px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

// ─── Promoted tile ───────────────────────────────────────────────────
function PromoTile({ promo }: { promo: any }) {
  // Promotions carry a video; the poster is a Cloudinary frame grab
  const thumb =
    promo.thumbnail ??
    promo.coverImage ??
    (promo.videoUrl
      ? promo.videoUrl
          .replace(
            "/video/upload/",
            "/video/upload/w_200,h_200,c_fill,q_auto,so_2/",
          )
          .replace(/\.(mp4|mov|webm)$/, ".jpg")
      : undefined);

  return (
    <Link
      href={`/promote/${promo._id}`}
      className="flex w-[200px] shrink-0 items-center gap-2.5 rounded-xl p-2 transition hover:bg-white/10 lg:w-full"
    >
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white/10">
        {thumb ? (
          <img
            src={thumb}
            alt={promo.title ?? "Promotion"}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-[12px] font-semibold text-white">
          {promo.title ?? promo.businessName ?? "Featured"}
        </p>
        <p className="line-clamp-1 text-[10.5px] text-white/50">
          {promo.businessName ?? promo.category ?? "Promoted"}
        </p>
      </div>
    </Link>
  );
}
