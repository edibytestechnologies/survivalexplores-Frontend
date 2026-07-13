import { Compass, BadgeDollarSign, ShieldCheck, Headphones, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

const FEATURES = [
  {
    icon: Compass,
    title: "Expert Guides",
    text: "Local knowledge, unforgettable experiences.",
  },
  {
    icon: BadgeDollarSign,
    title: "Best Price Guarantee",
    text: "Competitive pricing with no hidden fees.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    text: "Your safety is our top priority.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    text: "We're here for you anytime, anywhere.",
  },
  {
    icon: Sparkles,
    title: "Custom Trips",
    text: "Tailored experiences just for you.",
  },
];

export function WhyTravel() {
  return (
    <section className="bg-cream py-20">
      <div className="container-x">
        <SectionHeading eyebrow="Why Travel With Us?" title="Your Journey, Our Passion" />
        <div className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/30 bg-white text-gold shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:border-gold">
                <f.icon className="h-7 w-7" strokeWidth={1.6} />
              </div>
              <h3 className="mt-5 text-base font-semibold text-navy">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
