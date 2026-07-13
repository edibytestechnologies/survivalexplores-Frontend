"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatPrice } from "@/lib/utils";
import type { DestinationCard as TCard } from "@/lib/types";

export function DestinationCard({ d, index = 0 }: { d: TCard; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 8) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-card transition-shadow duration-300 hover:shadow-card-hover"
    >
      <Link href={`/trips/${d.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={d.card_image}
            alt={`${d.title}, ${d.country}`}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
          />
          {/* darken on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />

          {d.trip_status && <StatusBadge status={d.trip_status} className="absolute left-3 top-3" />}

          {/* Pulsing tap/click hint — always visible (mobile-first), the ring pulses to invite a tap */}
          <div className="absolute right-3 top-3">
            <span className="relative flex h-9 w-9 items-center justify-center">
              <motion.span
                className="absolute inset-0 rounded-full bg-gold/60"
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gold text-white shadow-lg">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </span>
          </div>

          {/* "View Trip" bar — always shown on mobile, slides up on hover for desktop */}
          <div className="absolute inset-x-0 bottom-0 translate-y-0 p-3 sm:translate-y-full sm:transition-transform sm:duration-300 sm:group-hover:translate-y-0">
            <span className="flex items-center justify-between rounded-xl bg-white/95 px-4 py-2.5 text-sm font-semibold text-navy shadow-lg backdrop-blur">
              Click to view trip
              <ArrowUpRight className="h-4 w-4 text-gold" />
            </span>
          </div>
        </div>

        <div className="p-5">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gold">
            <MapPin className="h-3.5 w-3.5" />
            {d.title}, {d.country}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <Clock className="h-3.5 w-3.5" /> {d.duration_days} Days Trip
          </p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted">
              From{" "}
              <span className="font-semibold text-ink">
                {formatPrice(d.final_price)} {d.currency}
              </span>
            </p>
            <StarRating rating={d.rating} size={13} />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
