export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { PageBanner } from "@/components/page-banner";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { getSiteSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with TourNature-Bio. We'd love to help plan your next journey.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const s = await getSiteSettings();

  const INFO = [
    { icon: Phone, label: "Phone", value: s.phone },
    { icon: Mail, label: "Email", value: s.email },
    { icon: MapPin, label: "Office", value: s.address },
    { icon: Clock, label: "Business Hours", value: s.business_hours },
  ];

  return (
    <>
      <PageBanner title="Contact Us" crumbs={[{ label: "Contact Us" }]} image={s.contact_banner} />

      <section className="bg-cream py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <h2 className="font-serif text-3xl font-bold text-navy">Get in Touch</h2>
            <p className="mt-3 text-muted">
              We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as
              possible.
            </p>
            <ul className="mt-8 space-y-6">
              {INFO.map((it) => (
                <li key={it.label} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                    <it.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">{it.label}</p>
                    <p className="text-sm text-muted">{it.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.12}>
            <ContactForm />
          </Reveal>
        </div>

        <div className="container-x mt-14">
          <div className="overflow-hidden rounded-2xl shadow-card">
            <iframe
              title="TourNature-Bio office location"
              src={s.map_embed_url}
              className="h-[360px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
