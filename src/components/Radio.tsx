"use client";

import React from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaHeart,
} from "react-icons/fa";
import { useRadio } from "./RadioContext";

const Radio = () => {
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

  const track = "Live Marketplace Vibes";

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
    </div>
  );
};

export default Radio;
