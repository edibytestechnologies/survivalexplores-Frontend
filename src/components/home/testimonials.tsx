import Image from "next/image";
import Link from "next/link";
import { Quote, PenLine } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { StarRating } from "@/components/ui/star-rating";
import { getTestimonials } from "@/lib/api";

export async function Testimonials() {
  const testimonials = await getTestimonials();

  return (
    <section className="bg-cream py-20">
      <div className="container-x">
        <SectionHeading eyebrow="Testimonials" title="What Our Travelers Say" />
        <div className="mt-6 text-center">
          <Link href="/testimonials/share" className="btn-gold">
            <PenLine className="h-4 w-4" /> Share Your Experience
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => (
            <Reveal key={t.id} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-2xl bg-white p-8 shadow-card">
                <Quote className="h-8 w-8 text-gold/40" />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">“{t.review}”</p>
                <div className="mt-6 flex items-center gap-4 border-t border-gray-100 pt-5">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-gold/30">
                    {t.photo ? (
                      <Image
                        src={t.photo}
                        alt={t.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-gold/15 font-serif text-lg font-bold text-gold">
                        {t.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-navy">{t.name}</p>
                    <p className="text-xs text-muted">{t.country}</p>
                  </div>
                  <StarRating rating={t.rating} showValue={false} className="ml-auto" size={13} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
