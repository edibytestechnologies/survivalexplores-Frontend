"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { BookNowButton } from "@/components/booking/book-now";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Trips", href: "/trips" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Navbar({ logoSrc }: { logoSrc?: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "bg-navy/95 shadow-lg backdrop-blur" : "bg-gradient-to-b from-navy/70 to-transparent"
      )}
    >
      <div className="container-x flex h-20 items-center justify-between">
        <Logo src={logoSrc} />

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-gold",
                  active ? "text-gold" : "text-white/90"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <BookNowButton className="hidden btn-gold px-5 py-2.5 text-sm sm:inline-flex" label="Register Now" />
          <button
            aria-label="Toggle menu"
            className="text-white lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-white/10 bg-navy/98 px-5 pb-6 pt-2 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block border-b border-white/5 py-3 text-white/90 hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
          <BookNowButton className="btn-gold mt-4 w-full" label="Register Now" />
        </nav>
      )}
    </header>
  );
}
