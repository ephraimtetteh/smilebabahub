"use client";

// src/components/home/StickyRadioBar.tsx
//
// The dark radio bar pinned to the bottom.
//
// Plays in place — clicking the button starts audio without navigating,
// because sending someone to a player page to hear a stream they just
// asked for is a wasted step.
//
// Dismissible, and it stays dismissed for the session. A bar you cannot
// close is an advert, and this one covers content.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play, Pause, X, Radio } from "lucide-react";

const STREAM = "https://video2.getstreamhosting.com:2020/stream/8238";
const BARS = [10, 16, 8, 18, 12, 20, 9];

export default function StickyRadioBar() {
  const [playing, setPlaying] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("sb_radio_hidden") === "1") setHidden(true);
  }, []);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(STREAM);
      audioRef.current.preload = "none";
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }

    setLoading(true);
    try {
      await audioRef.current.play();
      setPlaying(true);
    } catch {
      // Autoplay policy, or the stream is down. Either way, do not leave
      // the button looking stuck.
      setPlaying(false);
    } finally {
      setLoading(false);
    }
  };

  const dismiss = () => {
    audioRef.current?.pause();
    sessionStorage.setItem("sb_radio_hidden", "1");
    setHidden(true);
  };

  if (hidden) return null;

  return (
    <div className="fixed inset-x-0 lg:bottom-0 bottom-20 z-40 px-3 pb-3 lg:px-6 lg:pb-4">
      <div className="mx-auto flex max-w-[1340px] items-center gap-3 rounded-2xl border-2 border-amber-400 bg-neutral-950 px-3 py-2.5 shadow-lg sm:gap-4 sm:px-4">
        {/* Mark */}
        <div className="relative shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400 bg-gray-900 sm:h-11 sm:w-11">
            <span className="text-sm font-bold text-amber-400">SB</span>
          </div>
          <span className="absolute -left-1 -top-1.5 flex items-center gap-1 rounded bg-red-500 px-1 py-px text-[7px] font-bold text-white">
            <span className="h-1 w-1 rounded-full bg-white" />
            LIVE
          </span>
        </div>

        {/* Title */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-bold text-white">
            SmileBaba <span className="text-amber-400">RADIO</span>
          </p>
          <p className="truncate text-[10px] text-white/60">
            Good Vibes, Great Music
          </p>
        </div>

        {/* Waveform */}
        <div className="hidden items-end gap-[3px] sm:flex" aria-hidden>
          {BARS.map((h, i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-amber-400 transition-all duration-300"
              style={{
                height: playing ? h : 5,
                opacity: playing ? 1 : 0.4,
              }}
            />
          ))}
        </div>

        {/* Play */}
        <button
          onClick={toggle}
          disabled={loading}
          aria-label={
            playing ? "Pause SmileBaba Radio" : "Play SmileBaba Radio"
          }
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-amber-400 transition hover:bg-amber-400/10 disabled:opacity-50 sm:h-10 sm:w-10"
        >
          {playing ? (
            <Pause size={14} className="fill-amber-400 text-amber-400" />
          ) : (
            <Play size={14} className="ml-0.5 fill-amber-400 text-amber-400" />
          )}
        </button>

        {/* Listeners */}
        <div className="hidden text-center lg:block">
          <p className="text-sm font-bold text-amber-400">2,486</p>
          <p className="-mt-0.5 text-[9px] text-white/50">Listeners</p>
        </div>

        <button
          onClick={toggle}
          className="hidden items-center gap-1.5 rounded-full bg-red-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-600 lg:flex"
        >
          {playing ? "Playing" : "Listen Live"}
          <Radio size={12} />
        </button>

        <Link
          href="/radio"
          className="hidden text-[10px] font-medium text-white/40 hover:text-white/70 lg:block"
        >
          Open
        </Link>

        <button
          onClick={dismiss}
          aria-label="Hide radio bar"
          className="shrink-0 p-1 text-white/40 transition hover:text-white"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
