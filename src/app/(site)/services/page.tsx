export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import {
  Map,
  Users,
  Monitor,
  MessageCircle,
  FileText,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";
import { PageBanner } from "@/components/page-banner";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { getServices, getSiteSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Complete travel solutions under one roof — planning, tours, bookings, visas and more.",
  alternates: { canonical: "/services" },
};

const ICONS: Record<string, LucideIcon> = {
  map: Map,
  users: Users,
  monitor: Monitor,
  "message-circle": MessageCircle,
  "file-text": FileText,
  "check-circle": CheckCircle,
};

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSiteSettings()]);

  return (
    <>
      <PageBanner title="Our Services" crumbs={[{ label: "Services" }]} image={settings.services_banner} />
      <section className="bg-cream py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="What We Offer"
            title="Complete Travel Solutions Under One Roof"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => {
              const Icon = ICONS[s.icon] ?? Map;
              return (
                <Reveal key={s.id} delay={i * 0.06}>
                  <div className="group h-full rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/30 text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-white">
                      <Icon className="h-7 w-7" strokeWidth={1.6} />
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-navy">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{s.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
