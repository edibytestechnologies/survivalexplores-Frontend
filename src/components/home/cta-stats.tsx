import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Heart, MapPin, Award, Users } from "lucide-react";

const STATS = [
  { icon: Heart, value: "500+", label: "Happy Travelers" },
  { icon: MapPin, value: "50+", label: "Destinations" },
  { icon: Award, value: "10+", label: "Years Experience" },
  { icon: Users, value: "98%", label: "Client Satisfaction" },
];

export function CtaStats() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2000&q=80"
        alt="Travelers celebrating a mountain view"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-navy/85" />
      <div className="container-x relative grid gap-12 py-20 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <h2 className="max-w-md font-serif text-4xl font-bold leading-tight text-white">
            Let&apos;s Make Your Dream Trip a Reality!
          </h2>
          <p className="mt-4 max-w-md text-white/80">
            From flights and hotels to guided tours and visas, we handle everything.
          </p>
          <Link href="/contact" className="btn-gold mt-8">
            Get a Free Consultation
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className="text-center">
              <s.icon className="mx-auto h-7 w-7 text-gold" strokeWidth={1.6} />
              <p className="mt-3 font-serif text-3xl font-bold text-white">{s.value}</p>
              <p className="mt-1 text-sm text-white/70">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
