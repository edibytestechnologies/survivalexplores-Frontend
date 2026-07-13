"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface HeroSlide {
  kind: "image" | "video";
  url: string;
}

const IMAGE_DURATION = 6500; // ms an image stays before advancing

/**
 * Full-bleed hero background slideshow.
 * - A video plays, and when it ends we advance to the next slide.
 * - An image shows for IMAGE_DURATION then advances.
 * - Slides crossfade and the sequence loops.
 * Falls back to a single still image when no slides are configured.
 */
export function HeroSlides({
  slides,
  fallbackImage,
}: {
  slides: HeroSlide[];
  fallbackImage: string;
}) {
  const list: HeroSlide[] =
    slides && slides.length > 0 ? slides : [{ kind: "image", url: fallbackImage }];

  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = list[index % list.length];
  const next = () => setIndex((i) => (i + 1) % list.length);

  // Image slides advance on a timer; videos advance on `onEnded`.
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (list.length > 1 && current.kind === "image") {
      timerRef.current = setTimeout(next, IMAGE_DURATION);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, current.kind, list.length]);

  // Ensure the current video is muted and plays (reliable autoplay).
  useEffect(() => {
    if (current.kind === "video" && videoRef.current) {
      const v = videoRef.current;
      v.muted = true;
      v.currentTime = 0;
      v.play().catch(() => {
        // if a video can't play, don't get stuck — move on
        if (list.length > 1) next();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-navy">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {current.kind === "video" ? (
            <video
              ref={videoRef}
              src={current.url}
              poster={fallbackImage}
              autoPlay
              muted
              playsInline
              onEnded={() => list.length > 1 && next()}
              className="h-full w-full object-cover"
            />
          ) : (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.12 }}
              transition={{ duration: IMAGE_DURATION / 1000 + 1.1, ease: "linear" }}
              className="absolute inset-0"
            >
              <Image
                src={current.url}
                alt="Survival Explore hero"
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Slide progress dots */}
      {list.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {list.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-7 bg-gold" : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
