import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { SectionHeading } from "@/components/ui/section-heading";
import { ShareForm } from "@/components/testimonials/share-form";

export const metadata: Metadata = {
  title: "Share Your Experience",
  description:
    "Rate your trip, leave a review and share a photo of your journey with TourNature-Bio.",
};

export default function ShareExperiencePage() {
  return (
    <>
      <PageBanner
        title="Share Your Experience"
        crumbs={[{ label: "Reviews", href: "/testimonials/share" }, { label: "Share" }]}
        image="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80"
      />
      <section className="bg-cream py-20">
        <div className="container-x max-w-2xl">
          <SectionHeading
            eyebrow="We'd Love Your Feedback"
            title="Rate Your Journey"
            subtitle="Tell fellow travelers about your adventure — leave a rating, a few words, and a photo."
          />
          <div className="mt-12">
            <ShareForm />
          </div>
        </div>
      </section>
    </>
  );
}
