'use client'

import React, { useEffect, useRef } from 'react'
import Hls from "hls.js";

import Card from './Card';
import Link from 'next/link';

const Video = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const videoSrc = "https://media2.streambrothers.com:2000/public/8056";

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSrc;
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="grid gap-6 lg:flex lg:flex-row items-start">
        {/* 🎥 VIDEO (comes first always) */}
        <div className="w-full lg:w-1/2">
          <video
            className="w-full rounded-xl shadow-lg object-cover"
            controls
            loop
            muted
          >
            <source src="https://media2.streambrothers.com:1936/8056/8056/playlist.m3u8" />
          </video>
        </div>

        {/* 📢 CTA CARD */}
        <div className="w-full lg:w-1/2 bg-white shadow-xl rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Promote Your Business on SmileBaba 🚀
            </h2>

            <p className="text-gray-600 mb-4">
              Upload your promotional video and get featured across the
              platform, radio, TV, and social media.
            </p>

            <ul className="space-y-2 text-sm mb-6">
              <li>Reach thousands of customers</li>
              <li>Boost your product visibility</li>
              <li>Get verified exposure</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={'/subscription'} className="bg-[#ffc105] text-black font-semibold px-4 py-3 rounded-lg w-full">
              Upload Video
            </Link>

            <button className="border border-[#ffc105] text-black px-4 py-3 rounded-lg w-full hover:bg-[#ffc105] hover:text-black transition">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Video

{/* <video ref={videoRef} controls className="lg:w-full lg:h-[65vh] max-w-full rounded-xl" /> */}