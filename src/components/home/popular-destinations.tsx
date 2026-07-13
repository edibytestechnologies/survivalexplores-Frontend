import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { DestinationCard } from "@/components/destination-card";
import { getFeaturedDestinations } from "@/lib/api";

export async function PopularDestinations() {
  const destinations = await getFeaturedDestinations();

  return (
    <section className="bg-white py-20">
      <div className="container-x">
        <SectionHeading eyebrow="Featured Trips" title="Popular Destinations" />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.slice(0, 4).map((d, i) => (
            <DestinationCard key={d.id} d={d} index={i} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/trips" className="btn-gold">
            View All Trips
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
