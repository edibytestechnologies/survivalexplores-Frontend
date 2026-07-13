"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { adminApi } from "@/lib/admin-api";
import { Card, Field, Input, Textarea, Select, Toggle, StringList } from "@/components/admin/ui";
import { ImageUpload, VideoUpload, MediaUpload, type MediaItem } from "@/components/admin/uploader";

interface Inclusion {
  text: string;
  included: boolean;
}
interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface DestinationFormValues {
  title: string;
  country: string;
  city: string;
  card_image: string;
  hero_image: string;
  video: string;
  short_description: string;
  description: string;
  price: number | string;
  discount: number | string;
  currency: string;
  duration_days: number | string;
  duration_nights: number | string;
  rating: number | string;
  reviews_count: number | string;
  group_size: number | string;
  tour_type: string;
  best_time: string;
  activity_level: string;
  category: string;
  status: string;
  trip_status: string;
  is_featured: boolean;
  highlights: string[];
  gallery: MediaItem[];
  inclusions: Inclusion[];
  itinerary: ItineraryDay[];
}

export const EMPTY_DESTINATION: DestinationFormValues = {
  title: "", country: "", city: "", card_image: "", hero_image: "", video: "",
  short_description: "", description: "", price: 0, discount: 0, currency: "Cedis",
  duration_days: 1, duration_nights: 0, rating: 4.5, reviews_count: 0, group_size: 5,
  tour_type: "Group Tour", best_time: "", activity_level: "easy_moderate", category: "Beach & Island",
  status: "published", trip_status: "upcoming", is_featured: false,
  highlights: [], gallery: [], inclusions: [], itinerary: [],
};

export function DestinationForm({
  initial,
  slug,
}: {
  initial: DestinationFormValues;
  slug?: string; // present => edit mode
}) {
  const router = useRouter();
  const [v, setV] = useState<DestinationFormValues>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof DestinationFormValues>(key: K, value: DestinationFormValues[K]) {
    setV((p) => ({ ...p, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...v,
      price: Number(v.price),
      discount: Number(v.discount),
      duration_days: Number(v.duration_days),
      duration_nights: Number(v.duration_nights),
      rating: Number(v.rating),
      reviews_count: Number(v.reviews_count),
      group_size: Number(v.group_size),
    };
    try {
      if (slug) await adminApi.patch(`/admin/destinations/${slug}/`, payload);
      else await adminApi.post("/admin/destinations/", payload);
      router.push("/admin/destinations");
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: unknown } })?.response?.data;
      setError(detail ? JSON.stringify(detail) : "Failed to save. Check the fields and try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6 pb-10">
      <Link href="/admin/destinations" className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Destinations
      </Link>

      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      <Card className="space-y-4">
        <h2 className="font-serif text-lg font-semibold text-navy">Basic Info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title *"><Input required value={v.title} onChange={(e) => set("title", e.target.value)} /></Field>
          <Field label="Country *"><Input required value={v.country} onChange={(e) => set("country", e.target.value)} /></Field>
          <Field label="City"><Input value={v.city} onChange={(e) => set("city", e.target.value)} /></Field>
          <Field label="Category"><Input value={v.category} onChange={(e) => set("category", e.target.value)} /></Field>
        </div>
        <Field label="Short description (card)"><Input value={v.short_description} onChange={(e) => set("short_description", e.target.value)} /></Field>
        <Field label="Full description"><Textarea rows={4} value={v.description} onChange={(e) => set("description", e.target.value)} /></Field>
      </Card>

      <Card className="space-y-5">
        <h2 className="font-serif text-lg font-semibold text-navy">Images</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <ImageUpload label="Card image (shown on trip cards)" value={v.card_image} onChange={(url) => set("card_image", url)} />
          <ImageUpload label="Hero image (shown on the detail page)" value={v.hero_image} onChange={(url) => set("hero_image", url)} aspect="aspect-[16/9]" />
        </div>
        <VideoUpload
          label="Destination video (optional) — autoplays as the hero on the detail page"
          value={v.video}
          onChange={(url) => set("video", url)}
        />
        <Field label="Gallery — upload images and videos (they all appear in the Gallery tab)">
          <MediaUpload items={v.gallery} onChange={(g) => set("gallery", g)} />
        </Field>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-serif text-lg font-semibold text-navy">Pricing & Details</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Price"><Input type="number" value={v.price} onChange={(e) => set("price", e.target.value)} /></Field>
          <Field label="Discount"><Input type="number" value={v.discount} onChange={(e) => set("discount", e.target.value)} /></Field>
          <Field label="Currency"><Input value={v.currency} onChange={(e) => set("currency", e.target.value)} /></Field>
          <Field label="Duration (days)"><Input type="number" value={v.duration_days} onChange={(e) => set("duration_days", e.target.value)} /></Field>
          <Field label="Duration (nights)"><Input type="number" value={v.duration_nights} onChange={(e) => set("duration_nights", e.target.value)} /></Field>
          <Field label="Group size"><Input type="number" value={v.group_size} onChange={(e) => set("group_size", e.target.value)} /></Field>
          <Field label="Rating"><Input type="number" step="0.1" value={v.rating} onChange={(e) => set("rating", e.target.value)} /></Field>
          <Field label="Reviews count"><Input type="number" value={v.reviews_count} onChange={(e) => set("reviews_count", e.target.value)} /></Field>
          <Field label="Best time"><Input value={v.best_time} onChange={(e) => set("best_time", e.target.value)} placeholder="June to October" /></Field>
          <Field label="Tour type"><Input value={v.tour_type} onChange={(e) => set("tour_type", e.target.value)} /></Field>
          <Field label="Activity level">
            <Select value={v.activity_level} onChange={(e) => set("activity_level", e.target.value)}>
              <option value="easy">Easy</option>
              <option value="easy_moderate">Easy to Moderate</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
            </Select>
          </Field>
          <Field label="Trip status">
            <Select value={v.trip_status} onChange={(e) => set("trip_status", e.target.value)}>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="sold_out">Sold Out</option>
            </Select>
          </Field>
          <Field label="Publish status">
            <Select value={v.status} onChange={(e) => set("status", e.target.value)}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </Select>
          </Field>
        </div>
        <Toggle checked={v.is_featured} onChange={(b) => set("is_featured", b)} label="Featured (show on home page)" />
      </Card>

      <Card className="space-y-4">
        <h2 className="font-serif text-lg font-semibold text-navy">Highlights</h2>
        <StringList items={v.highlights} onChange={(h) => set("highlights", h)} placeholder="e.g. Return Flight + Insurance" />
      </Card>

      <Card className="space-y-4">
        <h2 className="font-serif text-lg font-semibold text-navy">Inclusions & Exclusions</h2>
        <div className="space-y-2">
          {v.inclusions.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={item.text}
                placeholder="e.g. Airport transfers"
                onChange={(e) => {
                  const next = [...v.inclusions];
                  next[i] = { ...next[i], text: e.target.value };
                  set("inclusions", next);
                }}
              />
              <Select
                value={item.included ? "in" : "ex"}
                onChange={(e) => {
                  const next = [...v.inclusions];
                  next[i] = { ...next[i], included: e.target.value === "in" };
                  set("inclusions", next);
                }}
                className="w-36"
              >
                <option value="in">Included</option>
                <option value="ex">Excluded</option>
              </Select>
              <button type="button" onClick={() => set("inclusions", v.inclusions.filter((_, j) => j !== i))} className="shrink-0 rounded-lg border border-gray-200 px-3 py-2.5 text-muted hover:border-red-300 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => set("inclusions", [...v.inclusions, { text: "", included: true }])} className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:underline">
            <Plus className="h-4 w-4" /> Add inclusion / exclusion
          </button>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-serif text-lg font-semibold text-navy">Itinerary</h2>
        <div className="space-y-3">
          {v.itinerary.map((day, i) => (
            <div key={i} className="rounded-xl border border-gray-100 p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-semibold text-white">{i + 1}</span>
                <Input
                  value={day.title}
                  placeholder="Day title"
                  onChange={(e) => {
                    const next = [...v.itinerary];
                    next[i] = { ...next[i], title: e.target.value, day: i + 1 };
                    set("itinerary", next);
                  }}
                />
                <button type="button" onClick={() => set("itinerary", v.itinerary.filter((_, j) => j !== i))} className="shrink-0 rounded-lg border border-gray-200 px-3 py-2.5 text-muted hover:border-red-300 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <Textarea
                rows={2}
                value={day.description}
                placeholder="What happens on this day"
                className="mt-2"
                onChange={(e) => {
                  const next = [...v.itinerary];
                  next[i] = { ...next[i], description: e.target.value };
                  set("itinerary", next);
                }}
              />
            </div>
          ))}
          <button type="button" onClick={() => set("itinerary", [...v.itinerary, { day: v.itinerary.length + 1, title: "", description: "" }])} className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:underline">
            <Plus className="h-4 w-4" /> Add day
          </button>
        </div>
      </Card>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-gold px-8">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : slug ? "Save Changes" : "Create Destination"}
        </button>
        <Link href="/admin/destinations" className="btn-ghost-navy">Cancel</Link>
      </div>
    </form>
  );
}
