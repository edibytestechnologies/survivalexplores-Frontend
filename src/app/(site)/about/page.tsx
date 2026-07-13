import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Target, Eye, Heart, Award } from "lucide-react";
import { PageBanner } from "@/components/page-banner";
import { Reveal } from "@/components/ui/reveal";
import { getSiteSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Survival Explore is a travel and tour company committed to exceptional experiences and reliable service.",
};

const VALUES = [
  { icon: Target, title: "Mission", text: "To deliver unforgettable travel experiences with integrity and excellence." },
  { icon: Eye, title: "Vision", text: "To be the most trusted travel partner known for quality and reliability." },
  { icon: Heart, title: "Values", text: "Customer Satisfaction, Integrity, Safety, Passion and Excellence." },
  { icon: Award, title: "Promise", text: "We promise to make your journey seamless, memorable and worthwhile." },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageBanner title="About Us" crumbs={[{ label: "About Us" }]} image={settings.about_banner} />

      <section className="bg-cream py-20">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{settings.about_eyebrow}</p>
            <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-navy">
              {settings.about_title}
            </h2>
            <p className="mt-5 leading-relaxed text-muted">{settings.about_body}</p>
            <Link href="/services" className="btn-gold mt-8">
              Learn More About Us
            </Link>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
              <Image
                src={settings.about_image}
                alt={settings.about_title}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-navy py-16">
        <div className="container-x grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.1} className="text-center">
              <v.icon className="mx-auto h-9 w-9 text-gold" strokeWidth={1.5} />
              <h3 className="mt-4 text-lg font-semibold text-white">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{v.text}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
