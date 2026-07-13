import { Hero } from "@/components/home/hero";
import { WhyTravel } from "@/components/home/why-travel";
import { CtaStats } from "@/components/home/cta-stats";
import { Testimonials } from "@/components/home/testimonials";
import { Newsletter } from "@/components/home/newsletter";
import { SectionHeading } from "@/components/ui/section-heading";
import { TripsExplorer } from "@/components/trips/trips-explorer";
import { getSiteSettings } from "@/lib/api";

export default async function HomePage() {
  const s = await getSiteSettings();

  return (
    <>
      <Hero
        hero={{
          image: s.hero_image,
          media: s.hero_media ?? [],
          line1: s.hero_title_line1,
          line2: s.hero_title_line2,
          subtitle: s.hero_subtitle,
          ctaPrimaryLabel: s.hero_cta_primary_label,
          ctaPrimaryLink: s.hero_cta_primary_link,
          ctaSecondaryLabel: s.hero_cta_secondary_label,
          ctaSecondaryLink: s.hero_cta_secondary_link,
        }}
      />
      <WhyTravel />
      <section className="bg-white py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Featured Trips"
            title="Popular Destinations"
            subtitle="Filter by country or status, search, and keep scrolling — new journeys load as you go."
          />
          <div className="mt-14">
            <TripsExplorer />
          </div>
        </div>
      </section>
      <CtaStats />
      <Testimonials />
      <Newsletter />
    </>
  );
}
