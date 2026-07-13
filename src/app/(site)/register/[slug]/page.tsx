import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { SectionHeading } from "@/components/ui/section-heading";
import { RegistrationForm } from "@/components/registration/registration-form";
import { getDestination, getSiteSettings } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDestination(slug);
  return {
    title: d ? `Register — ${d.title}` : "Register",
    description: d ? `Register your details for the ${d.title} trip.` : "Register for a trip.",
  };
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [destination, settings] = await Promise.all([getDestination(slug), getSiteSettings()]);

  const title = destination ? `${destination.title}, ${destination.country}` : undefined;
  const banner = destination?.hero_image || settings.trips_banner;

  return (
    <>
      <PageBanner
        title="Trip Registration"
        crumbs={[{ label: "Register" }]}
        image={banner}
      />
      <section className="bg-cream py-20">
        <div className="container-x max-w-2xl">
          <SectionHeading
            eyebrow="Reserve Your Spot"
            title={destination ? `Register for ${destination.title}` : "Register Your Details"}
            subtitle="Fill in your details below and our team will get in touch to confirm your trip."
          />
          <div className="mt-12">
            <RegistrationForm destinationId={destination?.id} destinationTitle={title} />
          </div>
        </div>
      </section>
    </>
  );
}
