"use client";

// src/components/home/LiveRadioCard.tsx
// Live radio card with dark theme matching the supplied design.
// Driven by the existing useRadio context — same stream as the global radio bar.

import Link from "next/link";
import {
  PlayCircle,
  PauseCircle,
  Radio as RadioIcon,
  Users,
} from "lucide-react";
import { useRadio } from "@/src/components/RadioContext";

export default function LiveRadioCard() {
  const { playing, listeners, togglePlay, loading } = useRadio();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-[11px] font-black text-gray-900 tracking-wider">
            LIVE RADIO
          </h3>
          <span
            className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full
            flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />{" "}
            ON AIR
          </span>
        </div>
        <Link
          href="/radio"
          className="text-[11px] text-gray-500 hover:text-yellow-600 font-bold"
        >
          View all →
        </Link>
      </div>

      <div
        className="bg-[#0a0a0a] rounded-2xl overflow-hidden border border-gray-900
        flex flex-col lg:min-h-[560px] relative"
      >
        {/* Subtle radial gradient accent */}
        <div className="absolute inset-0 bg-gradient-radial from-yellow-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex-1 flex items-center justify-center p-6 relative z-10">
          <div className="text-center w-full">
            {/* Logo */}
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-2xl font-black text-yellow-400">SmileBaba</span>
              {/* <span className="text-2xl">Baba</span> */}
            </div>
            <p className="text-lg font-bold text-white -mt-1 tracking-wide">
              RADIO
            </p>
            <p className="text-[10px] text-gray-500 italic mt-1">
              …Bringing Africa Together
            </p>

            {/* Animated waveform */}
            <div className="flex items-end justify-center gap-1 my-6 h-12">
              {[15, 25, 40, 55, 70, 55, 40, 25, 15, 25, 40, 55, 40, 25, 15].map(
                (h, i) => (
                  <div
                    key={i}
                    style={{
                      height: `${h}px`,
                      animationDelay: `${i * 80}ms`,
                    }}
                    className={`w-1 bg-yellow-400 rounded-full
                    ${playing ? "animate-wave" : "opacity-40"}`}
                  />
                ),
              )}
            </div>

            {/* Play / Pause button */}
            <button
              onClick={togglePlay}
              disabled={loading}
              className="w-14 h-14 mx-auto rounded-full bg-yellow-400
                hover:bg-yellow-300 hover:scale-105 active:scale-95
                shadow-xl shadow-yellow-500/20 flex items-center justify-center
                transition disabled:opacity-50"
            >
              {playing ? (
                <PauseCircle
                  size={32}
                  className="text-black"
                  fill="black"
                  strokeWidth={1.5}
                />
              ) : (
                <PlayCircle
                  size={32}
                  className="text-black"
                  fill="black"
                  strokeWidth={1.5}
                />
              )}
            </button>

            {/* Now playing */}
            <div className="mt-6">
              <p className="text-[10px] text-gray-500 font-bold tracking-wider">
                NOW PLAYING
              </p>
              <p className="text-sm font-bold text-white mt-0.5">
                The Best of African Hits
              </p>
              <p className="text-xs text-gray-400">DJ Nii Wayne</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="bg-white/5 border border-white/10 rounded-xl py-2">
                <div className="flex items-center justify-center gap-1">
                  <Users size={11} className="text-gray-400" />
                  <p className="text-lg font-black text-white">
                    {listeners.toLocaleString()}
                  </p>
                </div>
                <p className="text-[10px] text-gray-500 font-medium">
                  Listeners
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl py-2">
                <p className="text-lg font-black text-yellow-400">24/7</p>
                <p className="text-[10px] text-gray-500 font-medium">
                  Live Radio
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={togglePlay}
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-300 active:scale-[0.99]
            text-black font-black text-sm py-3.5 m-3 rounded-xl
            flex items-center justify-center gap-2 transition disabled:opacity-50 relative z-10"
        >
          <RadioIcon size={16} />
          {loading ? "Connecting…" : playing ? "Pause Stream" : "Listen Live"}
        </button>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes wave {
          0%, 100% { transform: scaleY(0.4); }
          50%      { transform: scaleY(1);   }
        }
        .animate-wave {
          animation: wave 1.2s ease-in-out infinite;
          transform-origin: bottom;
        }
        .bg-gradient-radial {
          background-image: radial-gradient(ellipse at center, var(--tw-gradient-stops));
        }
      `,
        }}
      />
    </div>
  );
}
