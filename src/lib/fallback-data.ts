import type {
  BlogPost,
  DestinationCard,
  DestinationDetail,
  Service,
  SiteSettings,
  Testimonial,
} from "./types";

const U = "https://images.unsplash.com/";
const Q = "?auto=format&fit=crop&w=1200&q=80";
const F = "?auto=format&fit=crop&w=200&h=200&q=80";
const img = (id: string) => `${U}${id}${Q}`;
const face = (id: string) => `${U}${id}${F}`;

export const FALLBACK_DESTINATIONS: DestinationCard[] = [
  {
    id: 1,
    title: "Zanzibar",
    country: "Tanzania",
    city: "Stone Town",
    slug: "zanzibar-tanzania",
    card_image: img("photo-1518002171953-a080ee817e1f"),
    hero_image: img("photo-1544551763-46a013bb70d5"),
    short_description:
      "Pristine beaches, rich culture, historic Stone Town and exciting water activities.",
    price: "19000.00",
    discount: "0.00",
    final_price: "19000.00",
    currency: "Cedis",
    duration_days: 8,
    duration_nights: 7,
    rating: "4.8",
    reviews_count: 139,
    category: "Beach & Island",
    trip_status: "upcoming",
    is_featured: true,
  },
  {
    id: 2,
    title: "Dubai",
    country: "UAE",
    city: "Dubai",
    slug: "dubai-uae",
    card_image: img("photo-1512453979798-5ea266f8880c"),
    hero_image: img("photo-1518684079-3c830dcef090"),
    short_description: "Iconic skylines, desert safaris and world-class luxury shopping.",
    price: "12500.00",
    discount: "0.00",
    final_price: "12500.00",
    currency: "Cedis",
    duration_days: 6,
    duration_nights: 5,
    rating: "4.7",
    reviews_count: 210,
    category: "Beach & Island",
    trip_status: "upcoming",
    is_featured: true,
  },
  {
    id: 3,
    title: "Bali",
    country: "Indonesia",
    city: "Ubud",
    slug: "bali-indonesia",
    card_image: img("photo-1537996194471-e657df975ab4"),
    hero_image: img("photo-1518548419970-58e3b4079ab2"),
    short_description: "Lush rice terraces, sacred temples and serene beaches.",
    price: "11000.00",
    discount: "0.00",
    final_price: "11000.00",
    currency: "Cedis",
    duration_days: 7,
    duration_nights: 6,
    rating: "4.9",
    reviews_count: 302,
    category: "Beach & Island",
    trip_status: "upcoming",
    is_featured: true,
  },
  {
    id: 4,
    title: "Mauritius",
    country: "Mauritius",
    city: "Port Louis",
    slug: "mauritius-mauritius",
    card_image: img("photo-1589979481223-deb893043163"),
    hero_image: img("photo-1544644181-1484b3fdfc62"),
    short_description: "Crystal lagoons, coral reefs and volcanic mountain scenery.",
    price: "13000.00",
    discount: "0.00",
    final_price: "13000.00",
    currency: "Cedis",
    duration_days: 6,
    duration_nights: 5,
    rating: "4.6",
    reviews_count: 176,
    category: "Beach & Island",
    trip_status: "upcoming",
    is_featured: true,
  },
];

const detailBase = (
  card: DestinationCard,
  extra: Partial<DestinationDetail>
): DestinationDetail => ({
  ...card,
  category: { id: 1, name: "Beach & Island", slug: "beach-island" },
  description: card.short_description,
  group_size: 5,
  tour_type: "Group Tour",
  best_time: "June to October",
  activity_level: "easy_moderate",
  map_embed_url: `https://www.google.com/maps?q=${card.title},${card.country}&output=embed`,
  seo_title: `${card.title}, ${card.country} Tour | Survival Explore`,
  seo_description: card.short_description,
  hero_video: null,
  gallery: [card.card_image, card.hero_image].map((image, i) => ({
    id: i,
    image,
    media_type: "image" as const,
    caption: "",
    order: i,
  })),
  highlights: [],
  inclusions: [],
  itinerary: [],
  available_dates: [],
  ...extra,
});

export const FALLBACK_DETAILS: DestinationDetail[] = [
  detailBase(FALLBACK_DESTINATIONS[0], {
    description:
      "Experience the beauty of Zanzibar with pristine beaches, rich culture, historic Stone Town, and exciting water activities. This 8-day trip promises relaxation, adventure and unforgettable memories.",
    best_time: "June to October",
    highlights: [
      "Return Flight + Insurance",
      "Comfortable Accommodation (7 Nights)",
      "Airport Pickup & Drop-off",
      "All Activities as per Itinerary",
      "Professional Photography Package",
    ].map((text, order) => ({ id: order, text, order })),
    inclusions: [
      ["Return international flights", true],
      ["7 nights beach resort accommodation", true],
      ["Daily breakfast and dinner", true],
      ["Airport transfers", true],
      ["Personal expenses & tips", false],
      ["Travel visa fees", false],
    ].map(([text, included], order) => ({
      id: order,
      text: text as string,
      included: included as boolean,
      order,
    })),
    itinerary: [
      ["Arrival & Stone Town", "Arrive in Zanzibar, transfer to your resort and enjoy a guided evening walk through Stone Town."],
      ["Spice Farm Tour", "Discover the island's famous spice plantations and local cuisine."],
      ["Beach & Snorkeling", "Relax on Nungwi beach and snorkel the turquoise reefs."],
      ["Departure", "Final breakfast and airport transfer for your return flight."],
    ].map(([title, description], i) => ({ id: i, day: i + 1, title, description })),
  }),
  detailBase(FALLBACK_DESTINATIONS[1], {
    description:
      "Discover the dazzling city of Dubai — from the towering Burj Khalifa to golden desert dunes. A 6-day journey blending modern luxury with Arabian adventure.",
    best_time: "November to March",
  }),
  detailBase(FALLBACK_DESTINATIONS[2], {
    description:
      "Immerse yourself in the island of the gods. Explore Bali's sacred temples, emerald rice terraces and vibrant culture over an unforgettable 7-day escape.",
    best_time: "April to October",
  }),
  detailBase(FALLBACK_DESTINATIONS[3], {
    description:
      "Unwind in paradise. Mauritius offers turquoise lagoons, coral reefs and dramatic volcanic peaks for the perfect 6-day tropical getaway.",
    best_time: "May to December",
  }),
];

export const FALLBACK_SERVICES: Service[] = [
  ["Trip Planning", "map", "We plan tailor-made trips that match your budget, preferences and dreams."],
  ["Guided Tours", "users", "Explore with our expert local guides and enjoy authentic experiences."],
  ["Bookings", "monitor", "Flight, hotel, tour and activity bookings — we take care of it all."],
  ["Consultations", "message-circle", "Need travel advice? We provide expert consultations for stress-free travel."],
  ["Passport & Documents", "file-text", "We assist in processing passports and other official travel documents."],
  ["Visa Assistance", "check-circle", "We guide you through the visa application process with ease."],
].map(([title, icon, description], id) => ({
  id,
  title,
  slug: title.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, ""),
  icon,
  description,
  order: id,
}));

export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  ["Ama Mensah", "Ghana", 5, "The Zanzibar trip was flawless from start to finish. Survival Explore handled every detail — we just enjoyed the memories!", "photo-1544005313-94ddf0286df2"],
  ["David Osei", "Ghana", 5, "Best travel agency I've used. The Dubai desert safari was the highlight of our year.", "photo-1507003211169-0a1dd7228f2d"],
  ["Grace Boateng", "Ghana", 4, "Professional, warm and reliable. Bali exceeded all expectations. Highly recommended.", "photo-1438761681033-6461ffad8d80"],
  ["Kwame Adjei", "Ghana", 5, "The Maldives overwater villa was a dream. Seamless booking and incredible support throughout.", "photo-1500648767791-00dcc994a43e"],
].map(([name, country, rating, review, pid], id) => ({
  id,
  name: name as string,
  country: country as string,
  photo: face(pid as string),
  rating: rating as number,
  review: review as string,
  is_featured: true,
}));

export const FALLBACK_BLOG: BlogPost[] = [
  ["10 Things to Do in Zanzibar Beyond the Beaches", "Destination Guide", "photo-1547471080-7cc2caa01a7e", "From Stone Town's spice markets to swimming with dolphins, discover the island's hidden gems."],
  ["A First-Timer's Guide to the Dubai Desert Safari", "Travel Tips", "photo-1546412414-e1885259563a", "Dune bashing, camel rides and stargazing — everything you need to know before you go."],
  ["Why Bali Should Be Your Next Wellness Retreat", "Inspiration", "photo-1518548419970-58e3b4079ab2", "Sacred temples, yoga sanctuaries and healing spas make Bali the perfect place to reset."],
  ["The Great Migration: When and Where to See It", "Destination Guide", "photo-1547970810-dc1eac37d174", "Time your Maasai Mara safari perfectly to witness one of nature's greatest spectacles."],
].map(([title, category, pid, excerpt], id) => ({
  id,
  title: title as string,
  slug: (title as string).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  category: category as string,
  author: "Survival Explore",
  featured_image: img(pid as string),
  excerpt: excerpt as string,
  content: excerpt as string,
  published_at: null,
}));

export const FALLBACK_SETTINGS: SiteSettings = {
  company_name: "Survival Explore",
  tagline: "Explore More · Live More",
  logo: "",
  favicon: "",
  hero_image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=2000&q=80",
  hero_media: [],
  hero_title_line1: "Explore More.",
  hero_title_line2: "Live More.",
  hero_subtitle: "Unforgettable journeys, Authentic experiences. Memories that last forever.",
  hero_cta_primary_label: "Explore Trips",
  hero_cta_primary_link: "/trips",
  hero_cta_secondary_label: "Our Services",
  hero_cta_secondary_link: "/services",
  trips_banner: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=2000&q=80",
  services_banner: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=2000&q=80",
  about_banner: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=2000&q=80",
  contact_banner: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=2000&q=80",
  blog_banner: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80",
  phone: "+233 55 123 4567",
  email: "info@survivalexplore.com",
  address: "Accra, Ghana",
  business_hours: "Mon–Fri: 9AM–6PM · Sat: 10AM–2PM",
  map_embed_url: "https://www.google.com/maps?q=Accra,Ghana&output=embed",
  footer_description:
    "We create unforgettable travel experiences and provide reliable travel services you can trust.",
  facebook: "",
  instagram: "",
  twitter: "",
  youtube: "",
  whatsapp: "",
  tiktok: "",
  linkedin: "",
  about_eyebrow: "Our Story",
  about_title: "Travel is More Than a Destination, It's a Way of Life.",
  about_body:
    "At Survival Explore, we believe that travel opens minds, creates connections, and builds memories that last a lifetime. We are a travel and tour company committed to providing exceptional travel experiences and reliable travel services tailored to your needs.",
  about_image: img("photo-1505881502353-a1986add3762"),
};
