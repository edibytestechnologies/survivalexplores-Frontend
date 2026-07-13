"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight, Images } from "lucide-react";

export interface Media {
  kind: "image" | "video";
  url: string;
  caption?: string;
}

export function BlogGallery({ media, title }: { media: Media[]; title: string }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + media.length) % media.length),
    [media.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go]);

  if (!media || media.length === 0) return null;

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  const current = media[index];

  return (
    <div className="mt-12">
      <div className="mb-5 flex items-center gap-2">
        <Images className="h-5 w-5 text-gold" />
        <h2 className="font-serif text-2xl font-semibold text-navy">Gallery</h2>
        <span className="text-sm text-muted">({media.length})</span>
      </div>

      {/* Thumbnail grid — first item spans wide for impact */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {media.map((m, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => openAt(i)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={
              "group relative overflow-hidden rounded-xl bg-navy " +
              (i === 0 ? "col-span-2 aspect-[16/9] sm:col-span-2 sm:row-span-2" : "aspect-square")
            }
          >
            {m.kind === "video" ? (
              <>
                <video src={m.url} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-navy/30 transition-colors group-hover:bg-navy/50">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/90 text-white shadow-lg">
                    <Play className="ml-0.5 h-6 w-6 fill-white" />
                  </span>
                </div>
                <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  Video
                </span>
              </>
            ) : (
              <Image
                src={m.url}
                alt={m.caption || title}
                fill
                sizes="(max-width:640px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur"
            onClick={() => setOpen(false)}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between p-4 text-white/80">
              <span className="text-sm">
                {index + 1} / {media.length}
              </span>
              <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-white/10" aria-label="Close">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Stage */}
            <div className="relative flex flex-1 items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
              {media.length > 1 && (
                <button
                  onClick={() => go(-1)}
                  className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="flex max-h-[75vh] max-w-5xl items-center justify-center"
                >
                  {current.kind === "video" ? (
                    <video
                      src={current.url}
                      controls
                      autoPlay
                      playsInline
                      className="max-h-[75vh] w-auto rounded-lg"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={current.url}
                      alt={current.caption || title}
                      className="max-h-[75vh] w-auto rounded-lg object-contain"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {media.length > 1 && (
                <button
                  onClick={() => go(1)}
                  className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
                  aria-label="Next"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Thumbnail strip */}
            <div className="flex justify-center gap-2 overflow-x-auto p-4" onClick={(e) => e.stopPropagation()}>
              {media.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={
                    "relative h-14 w-20 shrink-0 overflow-hidden rounded-md transition-all " +
                    (i === index ? "ring-2 ring-gold" : "opacity-50 hover:opacity-100")
                  }
                >
                  {m.kind === "video" ? (
                    <>
                      <video src={m.url} muted className="h-full w-full object-cover" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="h-4 w-4 fill-white text-white" />
                      </span>
                    </>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt="" className="h-full w-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
