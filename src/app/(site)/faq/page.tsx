import type { Metadata } from "next";
import { PageBanner } from "@/components/page-banner";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about booking, payments and travel with Survival Explore.",
};

const FAQS = [
  ["How do I book a trip?", "Browse our trips, open a destination and click Book Now or Enquire Now. Our team will confirm availability and guide you through payment."],
  ["What is included in the price?", "Each trip lists exactly what's included and excluded under the Inclusions and Exclusions tabs — typically flights, accommodation and selected activities."],
  ["Can I customise a trip?", "Absolutely. We specialise in tailor-made journeys. Contact us with your preferences and we'll design a bespoke itinerary."],
  ["What is your cancellation policy?", "Cancellations are handled per trip. Reach out to our support team and we'll walk you through refund eligibility and any applicable fees."],
  ["Do you assist with visas and passports?", "Yes — visa assistance and passport processing are part of our services. We guide you through the entire documentation process."],
];

export default function FaqPage() {
  return (
    <>
      <PageBanner title="FAQ" crumbs={[{ label: "FAQ" }]} />
      <section className="bg-cream py-20">
        <div className="container-x max-w-3xl">
          <SectionHeading eyebrow="Need Help?" title="Frequently Asked Questions" />
          <div className="mt-12 space-y-4">
            {FAQS.map(([q, a], i) => (
              <Reveal key={q} delay={i * 0.05}>
                <details className="group rounded-xl bg-white p-6 shadow-card">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-navy">
                    {q}
                    <span className="ml-4 text-gold transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
