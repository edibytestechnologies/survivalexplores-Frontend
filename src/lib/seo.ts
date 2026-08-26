export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://tournature-bio.com"
).replace(/\/$/, "");

export const SITE_NAME = "TourNature-Bio";
export const SITE_TAGLINE = "Explore More. Live More.";
export const SITE_DESCRIPTION =
  "TourNature-Bio is a premium travel and tour company offering unforgettable journeys, guided tours, flight & hotel bookings, visa assistance and authentic experiences across Africa and the world. Explore Zanzibar, Dubai, Bali, Mauritius, Maldives and more.";

export const SITE_KEYWORDS = [
  "TourNature-Bio",
  "travel agency Ghana",
  "tour company",
  "guided tours",
  "African safari",
  "Zanzibar tours",
  "Dubai tour packages",
  "Bali holidays",
  "Mauritius travel",
  "Maldives holidays",
  "luxury travel",
  "visa assistance",
  "flight and hotel booking",
  "travel packages",
];

// A wide, on-brand default social-share image.
export const DEFAULT_OG_IMAGE =
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&h=630&q=80";

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
