"use client";

// src/components/home/LiveTvCard.tsx
// Live TV card with dark theme. HLS stream from Smile Time Africa TV.

import { useEffect, useRef } from "react";
import Link from "next/link";
import Hls from "hls.js";
import { Tv2 } from "lucide-react";

const STREAM_URL =
  "https://media2.streambrothers.com:1936/8056/8056/playlist.m3u8";

const UPCOMING = [
  { time: "4:00 PM", title: "African News Update" },
  { time: "5:00 PM", title: "Diaspora Connect" },
  { time: "6:00 PM", title: "The DJ Nii Wayne Show" },
];

export default function LiveTvCard() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(STREAM_URL);
      hls.attachMedia(v);
      return () => hls.destroy();
    }
    if (v.canPlayType("application/vnd.apple.mpegurl")) {
      v.src = STREAM_URL;
    }
  }, []);

  return (
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
        flex flex-col min-h-[560px] relative"
      >
        {/* Subtle blue accent */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent pointer-events-none" />

        {/* Logo strip */}
        <div className="relative z-10 px-4 pt-4 pb-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-xl font-black text-yellow-400">Smile</span>
            <span className="text-xl">😊</span>
          </div>
          <p className="text-base font-bold text-white -mt-0.5 tracking-wide">
            TIME AFRICA TV
          </p>
        </div>

        {/* Live stream */}
        <div className="relative h-44 mx-3 mb-3 rounded-xl overflow-hidden bg-black z-10">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
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
        </div>

        <div className="flex-1 px-4 pb-3 overflow-y-auto relative z-10">
          {/* Current show */}
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

          {/* Upcoming */}
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

        <Link
          href="/tv"
          className="bg-yellow-400 hover:bg-yellow-300 active:scale-[0.99]
            text-black font-black text-sm py-3.5 m-3 rounded-xl
            flex items-center justify-center gap-2 transition relative z-10"
        >
          <Tv2 size={16} /> Watch Live TV
        </Link>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .bg-gradient-radial {
          background-image: radial-gradient(ellipse at center, var(--tw-gradient-stops));
        }
      `,
        }}
      />
    </div>
  );
}
