
"use client";



import React, { useState, useRef, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaHeart,
} from "react-icons/fa";

const Radio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [listeners, setListeners] = useState(1280);
  const [track, setTrack] = useState("Live Marketplace Vibes");

  const streamUrl = "https://video2.getstreamhosting.com:2020/stream/8244";

  // 🎧 Persist play state
  useEffect(() => {
    const saved = localStorage.getItem("radio-playing");
    if (saved === "true") {
      setPlaying(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("radio-playing", String(playing));
  }, [playing]);

  // 👥 Fake live listeners animation
  useEffect(() => {
    const interval = setInterval(() => {
      setListeners((prev) => prev + Math.floor(Math.random() * 5 - 2));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 🔊 Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      setLoading(true);

      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        await audioRef.current.play();
        setPlaying(true);
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

  return (
    <div className="px-3">
      <div
        className="flex items-center gap-4 p-4 rounded-2xl 
        bg-[#1A1A1A] text-white shadow-xl transition-all duration-300"
      >
        {/* LEFT INFO */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="live-dot"></span>
            <span className="text-[10px] font-semibold uppercase text-[#FFD700]">
              Live
            </span>
          </div>

          <p className="text-sm font-bold truncate">SmileBaba Radio</p>

          <p className="text-xs text-[#A0A0A0] truncate">🎵 {track}</p>

          <p className="text-[11px] text-[#A0A0A0]">
            👥 {listeners.toLocaleString()} listening
          </p>
        </div>

        {/* PLAY BUTTON */}
        <button
          onClick={togglePlay}
          className="w-12 h-12 bg-[#FFD700] text-black 
          rounded-full flex items-center justify-center
          hover:scale-110 active:scale-95 transition"
        >
          {playing ? <FaPause size={18} /> : <FaPlay size={18} />}
        </button>

        {/* CONTROLS */}
        <div className="flex flex-col items-center gap-2">
          {/* Volume */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-[#333333] hover:bg-[#444] transition"
            >
              {muted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 accent-[#FFD700]"
            />
          </div>

          {/* Favorite */}
          <button className="hidden md:block hover:scale-110 transition">
            <FaHeart className="text-red-500" />
          </button>
        </div>
      </div>

      {/* STATUS */}
      {loading && (
        <p className="text-[#FFD700] text-xs mt-2 animate-pulse">
          Connecting to live stream...
        </p>
      )}

      {error && (
        <p className="text-[#FF4D4D] text-xs mt-2">
          Unable to load radio stream.
        </p>
      )}

      {/* AUDIO */}
      <audio ref={audioRef} preload="none" onError={() => setError(true)}>
        <source src={streamUrl} type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default Radio;
