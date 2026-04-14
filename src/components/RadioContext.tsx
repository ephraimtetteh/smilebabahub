"use client";

// src/components/RadioContext.tsx
// Provides radio state to the Radio component.
// Listener count is dynamic:
//   - Base count seeded from today's date (changes every day)
//   - ±15 random fluctuation every 8 seconds while playing
//   - Consistent across all users on the same day (same seed)

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";

const STREAM_URL = "https://video2.getstreamhosting.com:2020/stream/8244";

// ── Deterministic daily seed ─────────────────────────────────────────────────
// Returns the same base count for every user on the same calendar day.
// Changes at midnight. Range: 1 200 – 4 800.
function getDailyListenerBase(): number {
  const now = new Date();
  // Seed = YYYYMMDD as an integer
  const seed =
    now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();

  // Simple deterministic hash → 0..1 float
  let h = seed;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = (h >> 16) ^ h;
  const t = Math.abs(h) / 2147483647; // 0..1

  return Math.round(1200 + t * 3600); // 1200 – 4800
}

interface RadioContextValue {
  playing: boolean;
  muted: boolean;
  volume: number;
  loading: boolean;
  error: string | null;
  listeners: number;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (v: number) => void;
}

const RadioContext = createContext<RadioContextValue | null>(null);

export function RadioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listeners, setListeners] = useState(getDailyListenerBase);

  // ── Sync daily base at midnight ──────────────────────────────────────────
  useEffect(() => {
    const msUntilMidnight = () => {
      const n = new Date();
      const m = new Date(n);
      m.setHours(24, 0, 0, 0);
      return m.getTime() - n.getTime();
    };

    const scheduleReset = () => {
      const t = setTimeout(() => {
        setListeners(getDailyListenerBase());
        scheduleReset(); // reschedule for next midnight
      }, msUntilMidnight());
      return t;
    };

    const timer = scheduleReset();
    return () => clearTimeout(timer);
  }, []);

  // ── Fluctuate ±15 every 8s while playing ─────────────────────────────────
  useEffect(() => {
    if (playing) {
      tickRef.current = setInterval(() => {
        setListeners((prev) => {
          const delta = Math.floor(Math.random() * 31) - 15; // -15 to +15
          // Keep within ±120 of today's base so it never drifts too far
          const base = getDailyListenerBase();
          return Math.max(base - 120, Math.min(base + 120, prev + delta));
        });
      }, 8000);
    } else {
      if (tickRef.current) clearInterval(tickRef.current);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [playing]);

  // ── Audio element ─────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio();
    audio.src = STREAM_URL;
    audio.volume = volume;
    audio.muted = muted;
    audio.preload = "none";
    audioRef.current = audio;

    audio.addEventListener("waiting", () => setLoading(true));
    audio.addEventListener("playing", () => {
      setLoading(false);
      setError(null);
    });
    audio.addEventListener("error", () => {
      setLoading(false);
      setError("Unable to load stream.");
      setPlaying(false);
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      setLoading(true);
      audio.play().catch(() => setError("Could not start stream."));
      setPlaying(true);
    }
  }, [playing]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  }, [muted]);

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current;
    if (audio) audio.volume = v;
    setVolumeState(v);
  }, []);

  return (
    <RadioContext.Provider
      value={{
        playing,
        muted,
        volume,
        loading,
        error,
        listeners,
        togglePlay,
        toggleMute,
        setVolume,
      }}
    >
      {children}
    </RadioContext.Provider>
  );
}

export function useRadio(): RadioContextValue {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error("useRadio must be used inside <RadioProvider>");
  return ctx;
}


