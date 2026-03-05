import React, { useState, useEffect, useRef } from "react";
import { IoRadioOutline } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import ReactHowler from 'react-howler';
import Script from "next/script";



const Radios = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setPlaying(!playing);
  };

  return (
    <div className="p-6 bg-amber-950 rounded-xl text-white">
      <h2 className="text-xl mb-4">
        SmileBaba <span className="text-yellow-400">Radio</span>
      </h2>

      <button
        onClick={togglePlay}
        className="bg-yellow-500 text-black px-4 py-2 rounded-lg"
      >
        {playing ? "Stop Listening" : "Start Listening"}
      </button>

      <audio ref={audioRef} preload="none">
        <source
          src="https://video2.getstreamhosting.com:2020/stream/8244"
          type="audio/mpeg"
        />
      </audio>
    </div>
  );
};

const Radio = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="px-4 md:px-16 lg:px-14 xl:px-12">
      <div className="bg-amber-950 border-3 border-[#d8a304] rounded-2xl flex flex-col flex-1 p-2 text-white mt-2">
        <IoRadioOutline
          size={28}
          fill="#ffc105"
          className="text-[#ffc105] items-center text-center mx-auto"
        />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center ">
            <h3 className="lg:text-2xl font-semibold py-2">
              SmileBaba <br />
              <span className="text-[#ffc105]">Radio</span>
            </h3>
            <p className="hidden lg:block text-[16px] text-red-500 pb-2">
              Live MarketPlace Vibes
            </p>
          </div>
        </div>
        <div>
          {isLoading && <p>Loading stream…</p>}
          {hasError && <p>Error loading stream. Try again later.</p>}
          <ReactHowler
            src="https://video2.getstreamhosting.com:2020/stream/8244"
            format={["mp3"]}
            playing={true}
            html5={true}
            onLoad={() => setIsLoading(false)}
            onLoadError={() => setHasError(true)}
          />
        </div>
        <Radios />
      </div>
    </div>
  );
}

export default Radio