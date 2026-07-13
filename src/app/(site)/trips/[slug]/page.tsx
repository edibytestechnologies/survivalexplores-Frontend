import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Clock, Users, Compass, CalendarClock, BadgeCheck } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import { TripTabs } from "@/components/trip/trip-tabs";
import { HeroVideo } from "@/components/trip/hero-video";
import { BookNowButton } from "@/components/booking/book-now";
import { getDestination, getDestinations } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDestination(slug);
  if (!d) return { title: "Trip not found" };
  return {
    title: d.seo_title || `${d.title}, ${d.country}`,
    description: d.seo_description || d.short_description,
  };
}

const ACTIVITY_LABELS: Record<string, string> = {
  easy: "Easy",
  easy_moderate: "Easy to Moderate",
  moderate: "Moderate",
  challenging: "Challenging",
};

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = await getDestination(slug);
  if (!d) notFound();

  const info = [
    { icon: CalendarClock, label: "Best Time to Go", value: d.best_time || "All year" },
    { icon: Users, label: "Group Size", value: `Just ${d.group_size} People` },
    { icon: Compass, label: "Tour Type", value: d.tour_type },
    { icon: BadgeCheck, label: "Activity Level", value: ACTIVITY_LABELS[d.activity_level] ?? "Easy" },
  ];

  return (
    <>
      {/* Hero — an uploaded video leads and autoplays; otherwise the hero image */}
      <section className="relative flex h-[52vh] min-h-[380px] items-end overflow-hidden">
        {d.hero_video ? (
          <HeroVideo src={d.hero_video} poster={d.hero_image} />
        ) : (
          <Image src={d.hero_image} alt={d.title} fill priority sizes="100vw" className="object-cover" />
        )}
        {d.hero_video && (
          <span className="absolute right-5 top-24 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> Now Playing
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/50 to-navy/40" />
        <div className="container-x relative pb-10">
          <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl">
            {d.title}, {d.country}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/85">
            <StarRating rating={d.rating} className="text-white" />
            <span>({d.reviews_count} Reviews)</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-white/80">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-gold" /> {d.city ? `${d.city}, ` : ""}
              {d.country}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-gold" /> {d.duration_days} Days / {d.duration_nights}{" "}
              Nights
            </span>
          </div>
        </div>
      </section>

      <section className="bg-cream py-14">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Main */}
          <div className="rounded-2xl bg-white p-6 shadow-card sm:p-9">
            <TripTabs d={d} />
          </div>

          {/* Booking sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-white p-7 shadow-widget">
              <div className="flex items-end gap-2">
                <span className="font-serif text-4xl font-bold text-navy">
                  {formatPrice(d.final_price)}
                </span>
                <span className="pb-1 text-sm text-muted">{d.currency}</span>
              </div>
              <p className="mt-1 text-sm text-muted">Per Person</p>

              <BookNowButton
                destinationId={d.id}
                destinationTitle={`${d.title}, ${d.country}`}
                className="btn-gold mt-6 w-full"
                label="Book Now"
              />
              <BookNowButton
                destinationId={d.id}
                destinationTitle={`${d.title}, ${d.country}`}
                className="btn-ghost-navy mt-3 w-full"
                label="Enquire Now"
              />

              <div className="mt-6 rounded-xl bg-cream p-4 text-center">
                <p className="flex items-center justify-center gap-2 text-xs text-muted">
                  <Clock className="h-4 w-4 text-gold" /> Limited Spots Available!
                </p>
                <p className="mt-1 font-serif text-lg font-bold text-navy">
                  Only {d.group_size} People
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Info strip */}
        <div className="container-x mt-8">
          <div className="grid gap-6 rounded-2xl bg-white p-8 shadow-card sm:grid-cols-2 lg:grid-cols-4">
            {info.map((it) => (
              <div key={it.label} className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/30 text-gold">
                  <it.icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {it.label}
                  </p>
                  <p className="text-sm font-medium text-navy">{it.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
