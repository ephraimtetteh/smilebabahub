
"use client";

// src/app/tv/page.tsx
//
// SmileBaba TV.
//
// The channel grid became a category grid. Channels were a promise we
// couldn't keep — every one pointed at the same feed. Categories send
// people somewhere real, and someone watching a stream on a marketplace
// is exactly who should be one tap from the marketplace.
//
// Route: /tv

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Radio,
  ChevronRight,
  Tv,
  Loader2,
  Smartphone,
  Shirt,
  Sofa,
  Building2,
  UtensilsCrossed,
  Briefcase,
  Pill,
  Truck,
  Ticket,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

const TV_STREAM =
  "https://media2.streambrothers.com:1936/8056/8056/playlist.m3u8";
const RADIO_STREAM = "https://video2.getstreamhosting.com:2020/stream/8238";

const API =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://smilebababackend-vvok.onrender.com/smilebaba";

// ─── Categories ──────────────────────────────────────────────────────
// Every one is a real category.main value, so nothing lands empty.
interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
  colour: string;
  tint: string;
  href: string;
}

const CATEGORIES: Category[] = [
  {
    id: "phones",
    label: "Phones",
    icon: Smartphone,
    colour: "text-blue-600",
    tint: "bg-blue-50",
    href: "/ads?category=phones",
  },
  {
    id: "fashion",
    label: "Fashion",
    icon: Shirt,
    colour: "text-amber-600",
    tint: "bg-amber-50",
    href: "/ads?category=fashion",
  },
  {
    id: "home",
    label: "Home",
    icon: Sofa,
    colour: "text-emerald-600",
    tint: "bg-emerald-50",
    href: "/ads?category=home-office",
  },
  {
    id: "stays",
    label: "Stays",
    icon: Building2,
    colour: "text-teal-600",
    tint: "bg-teal-50",
    href: "/ads?category=apartments",
  },
  {
    id: "food",
    label: "Food",
    icon: UtensilsCrossed,
    colour: "text-red-600",
    tint: "bg-red-50",
    href: "/ads?category=food",
  },
  {
    id: "jobs",
    label: "Jobs",
    icon: Briefcase,
    colour: "text-indigo-600",
    tint: "bg-indigo-50",
    href: "/ads?category=jobs",
  },
  {
    id: "health",
    label: "Health",
    icon: Pill,
    colour: "text-pink-600",
    tint: "bg-pink-50",
    href: "/ads?category=pharmacy",
  },
  {
    id: "delivery",
    label: "Delivery",
    icon: Truck,
    colour: "text-orange-600",
    tint: "bg-orange-50",
    href: "/ads?category=delivery",
  },
  {
    id: "events",
    label: "Events",
    icon: Ticket,
    colour: "text-fuchsia-600",
    tint: "bg-fuchsia-50",
    href: "/ads?category=events",
  },
  {
    id: "market",
    label: "Everything",
    icon: ShoppingBag,
    colour: "text-gray-600",
    tint: "bg-gray-50",
    href: "/ads",
  },
];

export default function TvPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);
  const [radioOn, setRadioOn] = useState(false);
  const [promos, setPromos] = useState<any[]>([]);

  // ─── Stream ───────────────────────────────────────────────────────
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
        .catch(() => {});
    }

    return () => hls?.destroy();
  }, []);

  // Two live streams talking over each other is how you lose a tab
  useEffect(() => {
    if (radioOn) videoRef.current?.pause();
  }, [radioOn]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // ─── Promotions ───────────────────────────────────────────────────
  const loadPromos = useCallback(async () => {
    try {
      const res = await fetch(`${API}/promote/active?limit=8`);
      if (!res.ok) return;
      const data = await res.json();
      setPromos(data?.promotions ?? data?.items ?? []);
    } catch {
      // The rail hides itself
    }
  }, []);

  useEffect(() => {
    loadPromos();
  }, [loadPromos]);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const toggleRadio = async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(RADIO_STREAM);
      audioRef.current.preload = "none";
    }

    if (radioOn) {
      audioRef.current.pause();
      setRadioOn(false);
      return;
    }

    try {
      await audioRef.current.play();
      setRadioOn(true);
    } catch {
      setRadioOn(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-20">
      <div className="mx-auto max-w-[1340px] px-3 sm:px-4">
        <nav className="pt-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-600">
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-gray-600">TV &amp; Radio</span>
        </nav>

        <div className="mt-3 lg:flex lg:gap-4">
          {/* ═══ Player ═══ */}
          <div className="lg:flex-1">
            <div className="relative overflow-hidden rounded-2xl bg-neutral-950">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="aspect-video w-full object-cover"
              />

              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent"
                aria-hidden
              />

              <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded bg-red-600 px-2 py-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                <span className="text-[10px] font-bold tracking-wide text-white">
                  LIVE
                </span>
              </div>

              <div className="absolute right-4 top-4 flex gap-2">
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
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
                >
                  <Maximize2 size={13} />
                </button>
              </div>

              {!ready && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/60">
                  <Loader2 size={26} className="animate-spin text-amber-400" />
                </div>
              )}
            </div>

            {/* Now playing */}
            <div className="mt-4 flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-[11px] font-bold text-gray-900">
                SB
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-lg font-bold tracking-tight text-gray-900">
                  SmileBaba TV
                </h1>
                <p className="text-[13px] text-gray-500">
                  News, entertainment, sports and music. Free, all day.
                </p>
              </div>
            </div>

            {/* ═══ Categories ═══ */}
            <section className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[15px] font-bold tracking-tight text-gray-900">
                  While you watch
                </h2>
                <Link
                  href="/ads"
                  className="text-xs font-semibold text-gray-500 transition hover:text-gray-900"
                >
                  Browse all
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
                {CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  return (
                    <Link
                      key={c.id}
                      href={c.href}
                      className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-3 transition hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-sm"
                    >
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.tint}`}
                      >
                        <Icon
                          size={19}
                          className={c.colour}
                          strokeWidth={1.9}
                        />
                      </span>
                      <span className="mt-2 line-clamp-1 text-[11px] font-medium text-gray-600">
                        {c.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>

          {/* ═══ Side ═══ */}
          <aside className="mt-8 lg:mt-0 lg:w-[320px] lg:shrink-0">
            {/* Radio */}
            <div className="overflow-hidden rounded-2xl border-2 border-amber-400 bg-neutral-950 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400 bg-gray-900">
                  <span className="text-sm font-bold text-amber-400">SB</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-white">
                    SmileBaba <span className="text-amber-400">RADIO</span>
                  </p>
                  <p className="truncate text-[11px] text-white/55">
                    Good Vibes, Great Music
                  </p>
                </div>
                <button
                  onClick={toggleRadio}
                  aria-label={radioOn ? "Pause radio" : "Play radio"}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-amber-400 transition hover:bg-amber-400/10"
                >
                  {radioOn ? (
                    <Pause
                      size={14}
                      className="fill-amber-400 text-amber-400"
                    />
                  ) : (
                    <Play
                      size={14}
                      className="ml-0.5 fill-amber-400 text-amber-400"
                    />
                  )}
                </button>
              </div>

              {radioOn && (
                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-white/50">
                  <Radio size={11} className="text-amber-400" />
                  Playing now. The video is paused while radio plays.
                </p>
              )}
            </div>

            {/* Promotions */}
            {promos.length > 0 && (
              <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[14px] font-bold tracking-tight text-gray-900">
                    Featured
                  </h2>
                  <Link
                    href="/promote"
                    className="flex items-center gap-0.5 text-[11px] font-semibold text-amber-600"
                  >
                    All
                    <ChevronRight size={11} />
                  </Link>
                </div>

                <div className="flex flex-col gap-2">
                  {promos.slice(0, 6).map((p) => (
                    <PromoRow key={p._id} promo={p} />
                  ))}
                </div>
              </section>
            )}

            {/* Advertise */}
            <Link
              href="/promote"
              className="mt-4 block overflow-hidden rounded-2xl bg-gray-900 p-5 transition hover:bg-black"
            >
              <Tv size={20} className="text-amber-400" />
              <h3 className="mt-3 text-[15px] font-bold leading-tight text-white">
                Advertise on SmileBaba TV
              </h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/60">
                Put your business in front of everyone watching. Video
                promotions start from GHS 99.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3.5 py-2 text-[12px] font-bold text-gray-900">
                Promote your business
                <ChevronRight size={12} />
              </span>
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

// ─── Promoted row ────────────────────────────────────────────────────
function PromoRow({ promo }: { promo: any }) {
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
      className="flex items-center gap-2.5 rounded-xl p-2 transition hover:bg-gray-50"
    >
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-gray-100">
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
        <p className="line-clamp-1 text-[12.5px] font-semibold text-gray-900">
          {promo.title ?? promo.businessName ?? "Featured"}
        </p>
        <p className="line-clamp-1 text-[11px] text-gray-400">
          {promo.businessName ?? promo.category ?? "Promoted"}
        </p>
      </div>
    </Link>
  );
}