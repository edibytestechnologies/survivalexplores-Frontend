"use client";

import { useEffect, useRef } from "react";

/** Autoplaying, muted, looping hero video. A client component so we can
 *  force the muted property + call play() — the reliable way to get
 *  browsers to allow autoplay. */
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const attempt = () => v.play().catch(() => {});
    attempt();
    v.addEventListener("canplay", attempt, { once: true });
    return () => v.removeEventListener("canplay", attempt);
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
