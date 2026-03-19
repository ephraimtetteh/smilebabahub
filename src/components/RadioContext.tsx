"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface RadioContextType {
  playing: boolean;
  muted: boolean;
  volume: number;
  loading: boolean;
  error: boolean;
  listeners: number;
  togglePlay: () => Promise<void>;
  toggleMute: () => void;
  setVolume: (v: number) => void;
}

const RadioContext = createContext<RadioContextType | null>(null);

export const useRadio = () => {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error("useRadio must be used inside RadioProvider");
  return ctx;
};

const STREAM_URL = "https://video2.getstreamhosting.com:2020/stream/8244";

export const RadioProvider = ({ children }: { children: React.ReactNode }) => {
  // Single persistent audio element — never unmounted
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [listeners, setListeners] = useState(1280);

  // Create the audio element once, outside of React's render cycle
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(STREAM_URL);
      audio.preload = "none";
      audio.volume = 0.7;
      audio.onerror = () => setError(true);
      audioRef.current = audio;
    }

    // Restore play state from previous session
    const saved = localStorage.getItem("radio-playing");
    if (saved === "true") {
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }

    // Fake listeners animation
    const interval = setInterval(() => {
      setListeners((prev) => prev + Math.floor(Math.random() * 5 - 2));
    }, 5000);

    return () => {
      clearInterval(interval);
      // DO NOT destroy audio on unmount — it persists for the app lifetime
    };
  }, []);

  // Sync volume changes to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    try {
      setLoading(true);
      setError(false);
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
        localStorage.setItem("radio-playing", "false");
      } else {
        await audioRef.current.play();
        setPlaying(true);
        localStorage.setItem("radio-playing", "true");
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
  };

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
};
