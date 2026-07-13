"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { MapPin, Calendar, Users, Search, ChevronDown, Compass } from "lucide-react";
import { HeroSlides, type HeroSlide } from "./hero-slides";

export interface HeroProps {
  image: string;
  media: HeroSlide[];
  line1: string;
  line2: string;
  subtitle: string;
  ctaPrimaryLabel: string;
  ctaPrimaryLink: string;
  ctaSecondaryLabel: string;
  ctaSecondaryLink: string;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const wordUp: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: -60 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero({ hero }: { hero: HeroProps }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Parallax: content drifts up and fades as you scroll past the hero
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section ref={ref} className="relative min-h-[92vh] w-full overflow-hidden bg-navy">
      {/* Background — admin-managed slideshow of images & videos (scroll parallax) */}
      <motion.div style={{ y: imageY }} className="absolute inset-0">
        <HeroSlides slides={hero.media} fallbackImage={hero.image} />
      </motion.div>

      {/* Gradient + vignette overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-navy/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/40" />

      {/* Floating light orbs */}
      <motion.div
        animate={{ y: [0, -30, 0], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-10 top-1/3 h-72 w-72 rounded-full bg-gold/25 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 26, 0], opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="pointer-events-none absolute right-10 top-24 h-80 w-80 rounded-full bg-gold/15 blur-3xl"
      />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-x relative flex min-h-[92vh] flex-col justify-center pt-24"
      >
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl">
          <motion.span
            variants={fadeUp}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold backdrop-blur"
          >
            <Compass className="h-3.5 w-3.5" />
            Premium Travel Experiences
          </motion.span>

          <h1 className="font-serif text-5xl font-bold leading-[1.05] text-white [perspective:800px] sm:text-6xl lg:text-7xl">
            <span className="block overflow-hidden">
              {hero.line1.split(" ").map((word, i) => (
                <motion.span key={i} variants={wordUp} className="mr-[0.25em] inline-block">
                  {word}
                </motion.span>
              ))}
            </span>
            <motion.span
              variants={wordUp}
              className="mt-1 inline-block bg-[linear-gradient(110deg,#D8A63A,45%,#F5E6B8,55%,#D8A63A)] bg-[length:200%_100%] bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["150% 0", "-50% 0"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            >
              {hero.line2}
            </motion.span>
          </h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-lg text-lg leading-relaxed text-white/85">
            {hero.subtitle}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
            <Link href={hero.ctaPrimaryLink} className="btn-gold group">
              {hero.ctaPrimaryLabel}
              <motion.span
                aria-hidden
                className="inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </Link>
            <Link href={hero.ctaSecondaryLink} className="btn-outline">
              {hero.ctaSecondaryLabel}
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-28 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/60 lg:flex"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.3em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5 text-gold" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Search widget */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="container-x relative z-10 -mt-2 pb-16"
      >
        <SearchWidget />
      </motion.div>
    </section>
  );
}

function SearchWidget() {
  return (
    <form
      action="/trips"
      className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-5 shadow-widget sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:items-end lg:gap-3"
    >
      <Field icon={<MapPin className="h-4 w-4 text-gold" />} label="Where to?">
        <input
          name="search"
          placeholder="Search destinations"
          className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
        />
      </Field>
      <Field icon={<Calendar className="h-4 w-4 text-gold" />} label="Check In">
        <input type="date" className="w-full bg-transparent text-sm text-muted focus:outline-none" />
      </Field>
      <Field icon={<Calendar className="h-4 w-4 text-gold" />} label="Check Out">
        <input type="date" className="w-full bg-transparent text-sm text-muted focus:outline-none" />
      </Field>
      <Field icon={<Users className="h-4 w-4 text-gold" />} label="Travelers">
        <input
          placeholder="Add guests"
          className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
        />
      </Field>
      <button type="submit" className="btn-gold h-[52px] w-full lg:w-auto">
        <Search className="h-4 w-4" />
        Search Trips
      </button>
    </form>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-100 pb-2 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4 lg:last:border-r-0">
      <div className="mb-1 flex items-center gap-2">
        {icon}
        <span className="text-xs font-semibold text-navy">{label}</span>
      </div>
      {children}
    </div>
  );
}
