"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/** Autoplaying, looping hero video. Starts muted (browser autoplay rule), then
 *  unmutes on the first tap/click anywhere so it plays WITH sound. A button lets
 *  the viewer toggle sound too. */
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const attempt = () => v.play().catch(() => {});
    attempt();
    v.addEventListener("canplay", attempt, { once: true });

    // First user interaction anywhere → unmute and play with sound.
    const enableSound = () => {
      const el = ref.current;
      if (!el) return;
      el.muted = false;
      el.volume = 1;
      setMuted(false);
      el.play().catch(() => {});
      window.removeEventListener("pointerdown", enableSound);
    };
    window.addEventListener("pointerdown", enableSound, { once: true });

    return () => {
      v.removeEventListener("canplay", attempt);
      window.removeEventListener("pointerdown", enableSound);
    };
  }, [src]);

  function toggleSound(e: React.MouseEvent) {
    e.stopPropagation();
    const el = ref.current;
    if (!el) return;
    el.muted = !el.muted;
    if (!el.muted) el.play().catch(() => {});
    setMuted(el.muted);
  }

  return (
    <>
      <video
        ref={ref}
        src={src}
        poster={poster}
        autoPlay
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Sound toggle */}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Unmute video" : "Mute video"}
        className="absolute bottom-5 right-5 z-20 flex items-center gap-2 rounded-full bg-black/50 px-3.5 py-2 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-black/70"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-gold" />}
        {muted ? "Tap for sound" : "Sound on"}
      </button>
    </>
  );
}
