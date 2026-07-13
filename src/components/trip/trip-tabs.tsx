"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import type { DestinationDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "Overview" | "Itinerary" | "Inclusions" | "Exclusions" | "Gallery" | "Reviews";

export function TripTabs({ d }: { d: DestinationDetail }) {
  const inclusions = d.inclusions.filter((i) => i.included);
  const exclusions = d.inclusions.filter((i) => !i.included);

  // Only show a tab if it actually has content
  const TABS = (
    [
      ["Overview", true],
      ["Itinerary", d.itinerary.length > 0],
      ["Inclusions", inclusions.length > 0],
      ["Exclusions", exclusions.length > 0],
      ["Gallery", d.gallery.length > 0],
      ["Reviews", d.reviews_count > 0],
    ] as [Tab, boolean][]
  )
    .filter(([, show]) => show)
    .map(([t]) => t);

  const [tab, setTab] = useState<Tab>("Overview");

  return (
    <div>
      <div className="flex flex-wrap gap-x-8 gap-y-2 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "relative pb-3 text-sm font-medium transition-colors",
              tab === t ? "text-navy" : "text-muted hover:text-navy"
            )}
          >
            {t}
            {tab === t && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded bg-gold" />
            )}
          </button>
        ))}
      </div>

      <div className="pt-8">
        {tab === "Overview" && (
          <div>
            <h3 className="font-serif text-2xl font-semibold text-navy">Trip Overview</h3>
            <p className="mt-4 leading-relaxed text-muted">{d.description}</p>
            {d.highlights.length > 0 && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {d.highlights.map((h) => (
                  <div key={h.id} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <span className="text-sm text-ink">{h.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "Itinerary" && (
          <div className="space-y-6">
            {d.itinerary.length === 0 && <p className="text-muted">Itinerary coming soon.</p>}
            {d.itinerary.map((day) => (
              <div key={day.id} className="flex gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold font-semibold text-white">
                  {day.day}
                </div>
                <div className="border-l border-dashed border-gray-200 pb-2 pl-5">
                  <h4 className="font-semibold text-navy">{day.title}</h4>
                  <p className="mt-1 text-sm text-muted">{day.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Inclusions" && (
          <ItemList items={inclusions.map((i) => i.text)} included />
        )}
        {tab === "Exclusions" && (
          <ItemList items={exclusions.map((i) => i.text)} included={false} />
        )}

        {tab === "Gallery" && (
          <>
            {d.gallery.length === 0 && <p className="text-muted">No media yet.</p>}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {d.gallery.map((g) => (
                <div
                  key={g.id}
                  className={
                    "group relative overflow-hidden rounded-xl bg-black " +
                    (g.media_type === "video" ? "col-span-2 aspect-video md:col-span-2" : "aspect-[4/3]")
                  }
                >
                  {g.media_type === "video" ? (
                    <video
                      src={g.image}
                      controls
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={g.image}
                      alt={g.caption || d.title}
                      fill
                      sizes="33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  {g.media_type === "video" && (
                    <span className="pointer-events-none absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Video
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "Reviews" && (
          <div className="flex items-center gap-6 rounded-2xl bg-cream p-8">
            <div className="text-center">
              <p className="font-serif text-5xl font-bold text-navy">{d.rating}</p>
              <StarRating rating={d.rating} showValue={false} className="mt-2 justify-center" />
              <p className="mt-2 text-sm text-muted">{d.reviews_count} reviews</p>
            </div>
            <p className="text-muted">
              Travelers rate this trip {d.rating}/5 for its exceptional service, comfort and
              unforgettable experiences.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ItemList({ items, included }: { items: string[]; included: boolean }) {
  if (items.length === 0)
    return <p className="text-muted">No {included ? "inclusions" : "exclusions"} listed.</p>;
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((text) => (
        <li key={text} className="flex items-start gap-3">
          {included ? (
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          ) : (
            <X className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          )}
          <span className="text-sm text-ink">{text}</span>
        </li>
      ))}
    </ul>
  );
}
