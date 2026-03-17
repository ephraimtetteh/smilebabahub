
"use client";



import React, { useState, useEffect, useRef } from "react";
import { IoRadioOutline } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import ReactHowler from 'react-howler';
import Script from "next/script";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";

const Radio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  
  const streamUrl = "https://video2.getstreamhosting.com:2020/stream/8244";
  
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
        bg-[#1A1A1A] text-white shadow-lg"
      >
        {/* LEFT: LIVE + INFO */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2">
            {/* Live Dot */}
            <span className="live-dot"></span>

            <span className="text-[10px] font-semibold uppercase text-[#FFD700]">
              Live
            </span>
          </div>

          <p className="text-sm font-bold mt-1">SmileBaba Radio</p>

          <p className="text-xs text-[#A0A0A0]">
            🎧 Live Marketplace Vibes
          </p>
        </div>

        {/* CENTER: PLAY */}
        <button
          onClick={togglePlay}
          className="w-12 h-12 bg-[#FFD700] text-black 
          rounded-full flex items-center justify-center
          hover:scale-105 transition"
        >
          {playing ? <FaPause size={18} /> : <FaPlay size={18} />}
        </button>

        {/* RIGHT: CONTROLS */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-[#333333] hover:bg-[#444] transition"
          >
            {muted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>

          <button className="p-2 rounded-full hover:bg-[#333333] transition hidden md:block">
            <FaHeart className="text-red-500" />
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-[#FFD700] text-xs mt-2 animate-pulse">
          Connecting to live stream...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-[#FF4D4D] text-xs mt-2">
          Unable to load radio stream.
        </p>
      )}

      {/* Audio */}
      <audio ref={audioRef} preload="none" onError={() => setError(true)}>
        <source src={streamUrl} type="audio/mpeg" />
      </audio>
      </div>
  );
};

export default Radio;
































// const Radio = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasError, setHasError] = useState(false);

//   return (
//     <div className="px-4 md:px-16 lg:px-14 xl:px-12">
//       <div className="bg-amber-950 border-3 border-[#d8a304] rounded-2xl flex flex-col flex-1 p-2 text-white mt-2">
//         <IoRadioOutline
//           size={28}
//           fill="#ffc105"
//           className="text-[#ffc105] items-center text-center mx-auto"
//         />
//         <div className="flex flex-1 items-center justify-center">
//           <div className="text-center ">
//             <h3 className="lg:text-2xl font-semibold py-2">
//               SmileBaba <br />
//               <span className="text-[#ffc105]">Radio</span>
//             </h3>
//             <p className="hidden lg:block text-[16px] text-red-500 pb-2">
//               Live MarketPlace Vibes
//             </p>
//           </div>
//         </div>
//         <div>
//           {isLoading && <p>Loading stream…</p>}
//           {hasError && <p>Error loading stream. Try again later.</p>}
//           <ReactHowler
//             src="https://video2.getstreamhosting.com:2020/stream/8244"
//             format={["mp3"]}
//             playing={true}
//             html5={true}
//             onLoad={() => setIsLoading(false)}
//             onLoadError={() => setHasError(true)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }