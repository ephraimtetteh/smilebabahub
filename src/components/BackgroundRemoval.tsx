"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

declare global {
  interface Window {
    SelfieSegmentation: any;
  }
}

export default function LiveBackgroundRemover({
  streamUrl,
}: {
  streamUrl: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadScript = (src: string) =>
      new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });

    const init = async () => {
      // Load MediaPipe
      await loadScript(
        "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js"
      );

      const video = videoRef.current!;
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      // Attach LIVE stream
      if (Hls.isSupported()) {
        const hls = new Hls({ lowLatencyMode: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }

      // Create segmenter
      const segmenter = new (window as any).SelfieSegmentation({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
      });

      segmenter.setOptions({
        modelSelection: 1,
      });

      segmenter.onResults((results: any) => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw person
        ctx.drawImage(results.image, 0, 0);

        // Remove background
        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(results.segmentationMask, 0, 0);
        ctx.globalCompositeOperation = "source-over";
      });

      const loop = async () => {
        if (video.readyState >= 2) {
          await segmenter.send({ image: video });
        }
        requestAnimationFrame(loop);
      };

      loop();
    };

    init();
  }, [streamUrl]);

  return (
    <div className="relative w-full">
      <video ref={videoRef} autoPlay muted playsInline className="hidden" />
      <canvas ref={canvasRef} className="w-full h-auto" />
    </div>
  );
}
