"use client";

// src/components/Radio.tsx
// Live radio player bar — fully Lucide icons, no react-icons.
// Listener count is dynamic (see RadioContext).

import React from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Music2,
  Radio as RadioIcon,
  Users,
} from "lucide-react";
import { useRadio } from "./RadioContext";

// ── Dynamic listing count (changes every day) ─────────────────────────────
// Seeded from today's date — same value for all users on the same day.
// Range: 800 – 6 400 active listings.
function getDailyListingCount(): number {
  const now = new Date();
  const seed =
    now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();

  let h = seed ^ 0xdeadbeef;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = h ^ (h >>> 16);
  const t = Math.abs(h) / 2147483647;

  return Math.round(800 + t * 5600); // 800 – 6 400
}

export default function Radio() {
  const {
    playing,
    muted,
    volume,
    loading,
    error,
    listeners,
    togglePlay,
    toggleMute,
    setVolume,
  } = useRadio();

  const listingCount = getDailyListingCount();

  return (
    <div className="px-3 mb-2">
      <div
        className="flex items-center gap-3 sm:gap-4 px-4 py-3 rounded-2xl
        bg-[#1A1A1A] text-white shadow-xl transition-all duration-300"
      >
        {/* ── Station icon ── */}
        <div
          className="hidden sm:flex w-10 h-10 rounded-xl bg-[#FFD700]/10
          border border-[#FFD700]/20 items-center justify-center flex-shrink-0"
        >
          <RadioIcon size={18} className="text-[#FFD700]" />
        </div>

        {/* ── Info ── */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-red-500
              animate-pulse flex-shrink-0"
            />
            <span
              className="text-[10px] font-bold uppercase tracking-widest
              text-[#FFD700]"
            >
              Live
            </span>
          </div>

          <p className="text-sm font-bold truncate leading-tight">
            SmileBaba Radio
          </p>

          <div className="flex items-center gap-1 text-[#A0A0A0] mt-0.5">
            <Music2 size={10} className="flex-shrink-0" />
            <p className="text-[11px] truncate">Live Marketplace Vibes</p>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-[11px] text-[#A0A0A0]">
              <Users size={10} />
              {listeners.toLocaleString()} listening
            </span>
            <span className="text-[#333]">·</span>
            <span className="flex items-center gap-1 text-[11px] text-[#A0A0A0]">
              {listingCount.toLocaleString()} listings today
            </span>
          </div>
        </div>

        {/* ── Play / Pause ── */}
        <button
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="w-11 h-11 flex-shrink-0 bg-[#FFD700] text-black
            rounded-full flex items-center justify-center
            hover:bg-amber-400 hover:scale-110 active:scale-95
            transition-all duration-150 shadow-lg shadow-yellow-900/30"
        >
          {playing ? (
            <Pause size={17} className="fill-black" />
          ) : (
            <Play size={17} className="fill-black ml-0.5" />
          )}
        </button>

        {/* ── Volume controls (desktop) ── */}
        <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="w-8 h-8 flex items-center justify-center rounded-full
              bg-[#2A2A2A] hover:bg-[#3A3A3A] transition"
          >
            {muted ? (
              <VolumeX size={14} className="text-[#A0A0A0]" />
            ) : (
              <Volume2 size={14} className="text-white" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 accent-[#FFD700] cursor-pointer"
            aria-label="Volume"
          />

          <button
            aria-label="Like"
            className="hover:scale-125 active:scale-95 transition-transform"
          >
            <Heart size={15} className="text-red-400 fill-red-400" />
          </button>
        </div>
      </div>

      {/* ── Status messages ── */}
      {loading && (
        <p
          className="flex items-center gap-1.5 text-[#FFD700] text-xs mt-1.5
          px-1 animate-pulse"
        >
          <span className="w-1 h-1 rounded-full bg-[#FFD700]" />
          Connecting to live stream…
        </p>
      )}
      {error && !loading && (
        <p className="text-[#FF4D4D] text-xs mt-1.5 px-1">{error}</p>
      )}
    </div>
  );
}
