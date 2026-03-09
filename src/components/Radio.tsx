
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
    <div className="px-4 md:px-16 lg:px-14 xl:px-12">
      <div className="bg-amber-950 border-2 border-[#d8a304] rounded-2xl flex flex-col p-4 text-white mt-4">
        <IoRadioOutline size={30} className="text-[#ffc105] mx-auto mb-2" />

        <div className="text-center">
          <h3 className="text-2xl font-semibold">
            SmileBaba <span className="text-[#ffc105]">Radio</span>
          </h3>

          <p className="text-white text-sm mb-3 capitalize">🔴 Your smile our Pride</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-2">
          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            className="bg-[#ffc105] text-black p-3 rounded-full"
          >
            {playing ? <FaPause size={16} /> : <FaPlay size={16} />}
          </button>

          {/* Mute */}
          <button onClick={toggleMute} className="bg-gray-800 p-3 rounded-full">
            {muted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>

          {/* Favorite */}
          <button className="text-red-500">
            <FaHeart size={18} />
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-yellow-400 text-center mt-3">
            Connecting to live stream...
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-400 text-center mt-3">
            Unable to load radio stream.
          </p>
        )}

        {/* Hidden Audio */}
        <audio ref={audioRef} preload="none" onError={() => setError(true)}>
          <source src={streamUrl} type="audio/mpeg" />
        </audio>
      </div>
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