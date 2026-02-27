'use client'

import React, { useEffect, useRef } from 'react'
import Hls from "hls.js";

import Card from './Card';

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
    <div className="lg:flex lg:flex-row flex-1 gap-4 lg:w-full items-start justify-center">
      <video
        className="w-full max-w-full rounded-base rounded-xl"
        controls
        loop
        muted
      >
        <source
          src="https://media2.streambrothers.com:1936/8056/8056/playlist.m3u8"
          type=""
        />
      </video>
      {/* <video ref={videoRef} controls className="lg:w-full lg:h-[65vh] max-w-full rounded-xl" /> */}
    </div>
  );
}

export default Video
