import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';

export function VideoPlayer({ src, poster, aspectRatio }) {
  const videoRef = useRef(null);

  useEffect(() => {
  if (Hls.isSupported() && videoRef.current) {
    const hls = new Hls();
    hls.loadSource(src);
    hls.attachMedia(videoRef.current);
    return () => hls.destroy();
  }
  }, [src]);

  return (
  <video
    ref={videoRef}
    controls
    playsInline
    poster={poster}
    className="w-full rounded-lg"
    style={{ aspectRatio }}
  >
    <source src={src} type="application/x-mpegURL" />
  </video>
  );
}