import type {
  BlogPost,
  DestinationCard,
  DestinationDetail,
  Paginated,
  Service,
  SiteSettings,
  Testimonial,
} from "./types";
import {
  FALLBACK_BLOG,
  FALLBACK_DESTINATIONS,
  FALLBACK_DETAILS,
  FALLBACK_SERVICES,
  FALLBACK_SETTINGS,
  FALLBACK_TESTIMONIALS,
} from "./fallback-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

/** Server-side fetch with a short revalidate window and a safe fallback. */
async function get<T>(path: string, fallback: T, revalidate = 30): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export async function getDestinations(query = ""): Promise<DestinationCard[]> {
  const data = await get<Paginated<DestinationCard>>(`/destinations/${query}`, {
    count: FALLBACK_DESTINATIONS.length,
    next: null,
    previous: null,
    results: FALLBACK_DESTINATIONS,
  });
  return data.results;
}

export async function getFeaturedDestinations(): Promise<DestinationCard[]> {
  return get<DestinationCard[]>("/destinations/featured/", FALLBACK_DESTINATIONS);
}

export async function getDestination(slug: string): Promise<DestinationDetail | null> {
  const fallback = FALLBACK_DETAILS.find((d) => d.slug === slug) ?? null;
  if (!fallback) {
    // still attempt the network in case it's a real slug not in fallback
    try {
      const res = await fetch(`${API_URL}/destinations/${slug}/`, {
        next: { revalidate: 5 },
      });
      if (!res.ok) return null;
      return (await res.json()) as DestinationDetail;
    } catch {
      return null;
    }
  }
  // short revalidate so admin edits (new gallery images/videos) appear quickly
  return get<DestinationDetail>(`/destinations/${slug}/`, fallback, 5);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await get<Paginated<Testimonial>>("/testimonials/", {
    count: FALLBACK_TESTIMONIALS.length,
    next: null,
    previous: null,
    results: FALLBACK_TESTIMONIALS,
  });
  return data.results;
}

export async function getServices(): Promise<Service[]> {
  const data = await get<Paginated<Service>>("/services/", {
    count: FALLBACK_SERVICES.length,
    next: null,
    previous: null,
    results: FALLBACK_SERVICES,
  });
  return data.results;
}

export async function getCountries(): Promise<string[]> {
  const fallback = Array.from(new Set(FALLBACK_DESTINATIONS.map((d) => d.country))).sort();
  return get<string[]>("/destinations/countries/", fallback);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const data = await get<Paginated<BlogPost>>("/blog/", {
    count: FALLBACK_BLOG.length,
    next: null,
    previous: null,
    results: FALLBACK_BLOG,
  });
  return data.results;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const fallback = FALLBACK_BLOG.find((b) => b.slug === slug) ?? null;
  // short revalidate so newly uploaded blog media appears quickly
  return get<BlogPost | null>(`/blog/${slug}/`, fallback, 5);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  // short revalidate so branding/hero/banner edits appear quickly across the site
  return get<SiteSettings>("/settings/", FALLBACK_SETTINGS, 5);
}

export { API_URL };
