"use client";

// src/components/Video.tsx

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Link from "next/link";
import {
  Play,
  Radio,
  CheckCircle2,
  Zap,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
} from "lucide-react";

const PERKS = [
  {
    icon: <Users size={15} className="text-yellow-600" />,
    text: "Reach thousands of buyers daily",
  },
  {
    icon: <TrendingUp size={15} className="text-blue-600" />,
    text: "Boost your product visibility",
  },
  {
    icon: <Radio size={15} className="text-purple-600" />,
    text: "Featured on radio, TV & social",
  },
  {
    icon: <CheckCircle2 size={15} className="text-green-600" />,
    text: "Verified seller badge included",
  },
  {
    icon: <Star size={15} className="text-orange-500" />,
    text: "Priority placement in search",
  },
  {
    icon: <Zap size={15} className="text-pink-500" />,
    text: "Instant exposure across the platform",
  },
];

export default function Video() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  const STREAM_URL =
    "https://media2.streambrothers.com:1936/8056/8056/playlist.m3u8";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: false });
      hls.loadSource(STREAM_URL);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => setReady(true));
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = STREAM_URL;
      video.addEventListener("loadedmetadata", () => setReady(true));
    }
  }, []);

  const handlePlayToggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-2">
      <div
        className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden
        shadow-xl border border-gray-100"
      >
        {/* ── Left: Video ── */}
        <div className="relative bg-black group">
          {/* Live badge */}
          <div
            className="absolute top-4 left-4 z-10 flex items-center gap-1.5
            bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LIVE
          </div>

          {/* Single video element */}
          <video
            ref={videoRef}
            controls
            loop
            muted
            playsInline
            onClick={handlePlayToggle}
            className="w-full object-cover aspect-video lg:aspect-auto
              lg:min-h-[360px]"
          />

          {/* Play overlay — only when not yet interacted */}
          {!playing && (
            <button
              onClick={handlePlayToggle}
              className="absolute inset-0 flex items-center justify-center
                bg-black/40 hover:bg-black/30 transition-colors"
              aria-label="Play"
            >
              <div
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm
                border-2 border-white/60 flex items-center justify-center
                hover:scale-110 transition-transform"
              >
                <Play size={26} className="text-white fill-white ml-1" />
              </div>
            </button>
          )}

          {/* Stream label */}
          <div className="absolute bottom-12 left-4 pointer-events-none">
            <span
              className="text-xs text-white/80 font-medium bg-black/40
              backdrop-blur-sm px-2.5 py-1 rounded-full"
            >
              SmileBaba TV — Live Stream
            </span>
          </div>
        </div>

        {/* ── Right: CTA ── */}
        <div
          className="bg-white px-7 py-8 flex flex-col justify-between
          lg:min-h-[360px]"
        >
          {/* Header */}
          <div>
            <div
              className="inline-flex items-center gap-1.5 bg-yellow-50
              border border-yellow-200 text-yellow-700 text-xs font-bold
              px-3 py-1 rounded-full mb-4"
            >
              <Zap size={11} />
              Promote your business
            </div>

            <h2
              className="text-2xl sm:text-3xl font-black text-gray-900
              leading-tight mb-3"
            >
              Get your brand in front of{" "}
              <span className="text-[#ffc105]">thousands</span>
            </h2>

            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Upload your promo video and get featured across the SmileBaba
              platform, radio, TV, and social media — all in one plan.
            </p>

            {/* Perks */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 mb-6">
              {PERKS.map((p, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-lg bg-gray-50
                    flex items-center justify-center"
                  >
                    {p.icon}
                  </span>
                  {p.text}
                </li>
              ))}
            </ul>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/sell"
              className="flex-1 flex items-center justify-center gap-2
                bg-[#ffc105] hover:bg-amber-400 text-black font-bold
                px-5 py-3 rounded-2xl text-sm transition active:scale-95"
            >
              <Zap size={15} />
              Promote now
            </Link>
            <Link
              href="/subscription"
              className="flex-1 flex items-center justify-center gap-2
                border-2 border-gray-200 hover:border-[#ffc105] text-gray-700
                hover:text-[#ffc105] font-semibold px-5 py-3 rounded-2xl
                text-sm transition"
            >
              View plans
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Social proof */}
          <div
            className="mt-4 pt-4 border-t border-gray-100 flex items-center
            gap-3 text-xs text-gray-400"
          >
            <div className="flex -space-x-1.5">
              {[
                "bg-yellow-400",
                "bg-blue-400",
                "bg-green-400",
                "bg-pink-400",
              ].map((c, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full border-2 border-white ${c}`}
                />
              ))}
            </div>
            <span>
              <strong className="text-gray-600">2,400+</strong> businesses
              already promoting
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <video ref={videoRef} controls className="lg:w-full lg:h-[65vh] max-w-full rounded-xl" /> */
}
{/* <source src="https://media2.streambrothers.com:1936/8056/8056/playlist.m3u8" />; */}
