import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { SectionHeading } from "@/components/ui/section-heading";
import { TripsExplorer } from "@/components/trips/trips-explorer";
import { getSiteSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "Trips & Destinations",
  description: "Browse all curated trips and destinations from TourNature-Bio.",
  alternates: { canonical: "/trips" },
};

export default async function TripsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const settings = await getSiteSettings();

  return (
    <>
      <PageBanner title="Trips & Destinations" crumbs={[{ label: "Trips" }]} image={settings.trips_banner} />
      <section className="bg-cream py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Explore The World"
            title={search ? `Results for “${search}”` : "All Curated Journeys"}
            subtitle="Filter by country or status and scroll to load more — new journeys appear as you go."
          />
          <div className="mt-14">
            <TripsExplorer initialSearch={search ?? ""} />
          </div>
        </div>
      </section>
    </>
  );
}
