import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageBanner({
  title,
  image = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80",
  crumbs = [],
}: {
  title: string;
  image?: string;
  crumbs?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative flex h-[42vh] min-h-[320px] items-center overflow-hidden">
      <Image src={image} alt={title} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/50" />
      <div className="container-x relative pt-16">
        <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl">{title}</h1>
        <nav className="mt-4 flex items-center gap-2 text-sm text-white/70">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4" />
              {c.href ? (
                <Link href={c.href} className="hover:text-gold">
                  {c.label}
                </Link>
              ) : (
                <span className="text-gold">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
