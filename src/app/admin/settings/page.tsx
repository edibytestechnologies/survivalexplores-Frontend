"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Check } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { AdminHeader, Card, Field, Input, Textarea } from "@/components/admin/ui";
import { ImageUpload, MediaUpload } from "@/components/admin/uploader";
import type { SiteSettings } from "@/lib/types";

async function fetchSettings(): Promise<SiteSettings> {
  const { data } = await adminApi.get("/admin/settings/");
  return data;
}

export default function AdminSettingsPage() {
  const { data } = useQuery({ queryKey: ["admin-settings"], queryFn: fetchSettings });
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((p) => (p ? { ...p, [key]: value } : p));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setSaved(false);
    try {
      await adminApi.put("/admin/settings/", form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  if (!form) return <div className="h-96 animate-pulse rounded-2xl bg-white shadow-card" />;

  return (
    <>
      <AdminHeader title="Site & Pages" subtitle="Branding, home hero, page banners, contact details and About content — all live on the site." />

      <form onSubmit={save} className="space-y-6 pb-10">
        <Card className="space-y-4">
          <h2 className="font-serif text-lg font-semibold text-navy">Branding</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company name"><Input value={form.company_name} onChange={(e) => set("company_name", e.target.value)} /></Field>
            <Field label="Tagline"><Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} /></Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <ImageUpload label="Logo (shown in the navbar & footer)" value={form.logo} onChange={(url) => set("logo", url)} aspect="aspect-[3/1]" />
            <ImageUpload label="Favicon" value={form.favicon} onChange={(url) => set("favicon", url)} aspect="aspect-square" />
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="font-serif text-lg font-semibold text-navy">Home Hero</h2>

          <Field label="Hero slideshow — upload multiple images & videos (a video auto-advances to the next when it finishes; images rotate on a timer)">
            <MediaUpload items={form.hero_media || []} onChange={(m) => set("hero_media", m)} />
          </Field>

          <ImageUpload label="Fallback background image (used if no slideshow media is set, and as video poster)" value={form.hero_image} onChange={(url) => set("hero_image", url)} aspect="aspect-[21/9]" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Heading line 1"><Input value={form.hero_title_line1} onChange={(e) => set("hero_title_line1", e.target.value)} /></Field>
            <Field label="Heading line 2 (gold)"><Input value={form.hero_title_line2} onChange={(e) => set("hero_title_line2", e.target.value)} /></Field>
          </div>
          <Field label="Subtitle"><Textarea rows={2} value={form.hero_subtitle} onChange={(e) => set("hero_subtitle", e.target.value)} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Primary button label"><Input value={form.hero_cta_primary_label} onChange={(e) => set("hero_cta_primary_label", e.target.value)} /></Field>
            <Field label="Primary button link"><Input value={form.hero_cta_primary_link} onChange={(e) => set("hero_cta_primary_link", e.target.value)} /></Field>
            <Field label="Secondary button label"><Input value={form.hero_cta_secondary_label} onChange={(e) => set("hero_cta_secondary_label", e.target.value)} /></Field>
            <Field label="Secondary button link"><Input value={form.hero_cta_secondary_link} onChange={(e) => set("hero_cta_secondary_link", e.target.value)} /></Field>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="font-serif text-lg font-semibold text-navy">Page Banner Images</h2>
          <p className="text-sm text-muted">The header image at the top of each inner page.</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ImageUpload label="Trips page" value={form.trips_banner} onChange={(url) => set("trips_banner", url)} aspect="aspect-[16/9]" />
            <ImageUpload label="Services page" value={form.services_banner} onChange={(url) => set("services_banner", url)} aspect="aspect-[16/9]" />
            <ImageUpload label="About page" value={form.about_banner} onChange={(url) => set("about_banner", url)} aspect="aspect-[16/9]" />
            <ImageUpload label="Contact page" value={form.contact_banner} onChange={(url) => set("contact_banner", url)} aspect="aspect-[16/9]" />
            <ImageUpload label="Blog page" value={form.blog_banner} onChange={(url) => set("blog_banner", url)} aspect="aspect-[16/9]" />
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="font-serif text-lg font-semibold text-navy">Contact Us (real values)</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone"><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
            <Field label="Email"><Input value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
            <Field label="Address"><Input value={form.address} onChange={(e) => set("address", e.target.value)} /></Field>
            <Field label="Business hours"><Input value={form.business_hours} onChange={(e) => set("business_hours", e.target.value)} /></Field>
          </div>
          <Field label="Google Maps embed URL"><Input value={form.map_embed_url} onChange={(e) => set("map_embed_url", e.target.value)} /></Field>
        </Card>

        <Card className="space-y-4">
          <h2 className="font-serif text-lg font-semibold text-navy">Footer & Social Links</h2>
          <p className="text-sm text-muted">Only the social links you fill in will show as icons on the site.</p>
          <Field label="Footer description"><Textarea rows={2} value={form.footer_description} onChange={(e) => set("footer_description", e.target.value)} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Facebook URL"><Input value={form.facebook} onChange={(e) => set("facebook", e.target.value)} placeholder="https://facebook.com/…" /></Field>
            <Field label="Instagram URL"><Input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="https://instagram.com/…" /></Field>
            <Field label="X (Twitter) URL"><Input value={form.twitter} onChange={(e) => set("twitter", e.target.value)} placeholder="https://x.com/…" /></Field>
            <Field label="YouTube URL"><Input value={form.youtube} onChange={(e) => set("youtube", e.target.value)} placeholder="https://youtube.com/…" /></Field>
            <Field label="WhatsApp link"><Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="https://wa.me/233…" /></Field>
            <Field label="TikTok URL"><Input value={form.tiktok} onChange={(e) => set("tiktok", e.target.value)} placeholder="https://tiktok.com/@…" /></Field>
            <Field label="LinkedIn URL"><Input value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} placeholder="https://linkedin.com/…" /></Field>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="font-serif text-lg font-semibold text-navy">About Us</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Eyebrow"><Input value={form.about_eyebrow} onChange={(e) => set("about_eyebrow", e.target.value)} /></Field>
            <Field label="About image URL"><Input value={form.about_image} onChange={(e) => set("about_image", e.target.value)} /></Field>
          </div>
          <Field label="Title"><Input value={form.about_title} onChange={(e) => set("about_title", e.target.value)} /></Field>
          <Field label="Body"><Textarea rows={5} value={form.about_body} onChange={(e) => set("about_body", e.target.value)} /></Field>
        </Card>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="btn-gold px-8">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Settings"}
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              <Check className="h-4 w-4" /> Saved — live on the site
            </span>
          )}
        </div>
      </form>
    </>
  );
}
