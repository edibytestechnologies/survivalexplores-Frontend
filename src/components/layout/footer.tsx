import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/logo";
import { SocialIcons } from "@/components/social-icons";
import { getSiteSettings } from "@/lib/api";

const QUICK = [
  ["Home", "/"],
  ["Trips", "/trips"],
  ["Services", "/services"],
  ["About Us", "/about"],
  ["Blog", "/blog"],
  ["Contact Us", "/contact"],
];

const SERVICES = [
  ["Trip Planning", "/services"],
  ["Guided Tours", "/services"],
  ["Bookings", "/services"],
  ["Consultations", "/services"],
  ["Passport & Documents", "/services"],
  ["Visa Assistance", "/services"],
];

const SUPPORT = [
  ["FAQs", "/faq"],
  ["Terms & Conditions", "/terms"],
  ["Privacy Policy", "/privacy"],
  ["Refund Policy", "/terms"],
];

export async function Footer() {
  const s = await getSiteSettings();

  return (
    <footer className="bg-navy text-white/70">
      <div className="container-x grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo src={s.logo || undefined} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">{s.footer_description}</p>
          <div className="mt-6">
            <SocialIcons settings={s} />
          </div>
        </div>

        <div>
          <h4 className="mb-5 text-base font-semibold text-white">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            {QUICK.map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="transition-colors hover:text-gold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-base font-semibold text-white">Our Services</h4>
          <ul className="space-y-3 text-sm">
            {SERVICES.map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="transition-colors hover:text-gold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-base font-semibold text-white">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-gold" />
              <span>{s.phone}</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-gold" />
              <span>{s.email}</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-gold" />
              <span>{s.address}</span>
            </li>
          </ul>
          <ul className="mt-6 space-y-2 text-xs">
            {SUPPORT.map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="transition-colors hover:text-gold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} TourNature-Bio. All Rights Reserved.
      </div>
    </footer>
  );
}
