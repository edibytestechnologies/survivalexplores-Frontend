export interface DestinationCard {
  id: number;
  title: string;
  country: string;
  city: string;
  slug: string;
  card_image: string;
  hero_image: string;
  short_description: string;
  price: string;
  discount: string;
  final_price: string;
  currency: string;
  duration_days: number;
  duration_nights: number;
  rating: string;
  reviews_count: number;
  category: string | null;
  trip_status: TripStatus;
  is_featured: boolean;
}

export type TripStatus = "upcoming" | "ongoing" | "completed" | "sold_out";

export interface GalleryImage {
  id: number;
  image: string;
  media_type: "image" | "video";
  caption: string;
  order: number;
}

export interface Highlight {
  id: number;
  text: string;
  order: number;
}

export interface Inclusion {
  id: number;
  text: string;
  included: boolean;
  order: number;
}

export interface ItineraryDay {
  id: number;
  day: number;
  title: string;
  description: string;
}

export interface AvailableDate {
  id: number;
  start_date: string;
  end_date: string;
  slots_available: number;
}

export interface DestinationDetail extends Omit<DestinationCard, "category"> {
  description: string;
  group_size: number;
  tour_type: string;
  best_time: string;
  activity_level: string;
  map_embed_url: string;
  seo_title: string;
  seo_description: string;
  hero_video: string | null;
  category: { id: number; name: string; slug: string } | null;
  gallery: GalleryImage[];
  highlights: Highlight[];
  inclusions: Inclusion[];
  itinerary: ItineraryDay[];
  available_dates: AvailableDate[];
}

export interface Testimonial {
  id: number;
  name: string;
  country: string;
  photo: string;
  rating: number;
  review: string;
  is_featured: boolean;
  approved?: boolean;
  created_at?: string;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  icon: string;
  description: string;
  order: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  category: string | { id: number; name: string; slug: string } | null;
  author: string;
  featured_image: string;
  excerpt: string;
  content?: string;
  seo_title?: string;
  seo_description?: string;
  published_at: string | null;
  media_count?: number;
  video_count?: number;
  media?: { kind: "image" | "video"; url: string; caption?: string }[];
}

export interface SiteSettings {
  company_name: string;
  tagline: string;
  logo: string;
  favicon: string;
  hero_image: string;
  hero_media: { kind: "image" | "video"; url: string }[];
  hero_title_line1: string;
  hero_title_line2: string;
  hero_subtitle: string;
  hero_cta_primary_label: string;
  hero_cta_primary_link: string;
  hero_cta_secondary_label: string;
  hero_cta_secondary_link: string;
  trips_banner: string;
  services_banner: string;
  about_banner: string;
  contact_banner: string;
  blog_banner: string;
  phone: string;
  email: string;
  address: string;
  business_hours: string;
  map_embed_url: string;
  footer_description: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  whatsapp: string;
  tiktok: string;
  linkedin: string;
  about_eyebrow: string;
  about_title: string;
  about_body: string;
  about_image: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
