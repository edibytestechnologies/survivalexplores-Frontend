"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { adminApi, adminList } from "@/lib/admin-api";
import { AdminHeader, Card, EmptyState, Modal, Field, Input, Textarea, Select, Toggle, Badge } from "@/components/admin/ui";
import { ImageUpload, MediaUpload, type MediaItem } from "@/components/admin/uploader";

interface BlogAdmin {
  id: number;
  title: string;
  slug: string;
  category: string;
  author: string;
  featured_image: string;
  excerpt: string;
  content: string;
  status: string;
  is_featured: boolean;
  media: MediaItem[];
}

const EMPTY: Partial<BlogAdmin> = {
  title: "", category: "Travel Tips", author: "Survival Explore", featured_image: "",
  excerpt: "", content: "", status: "published", is_featured: false, media: [],
};

export default function AdminBlogPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<BlogAdmin> | null>(null);
  const [saving, setSaving] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: () => adminList<BlogAdmin>("/admin/blog/"),
  });

  const del = useMutation({
    mutationFn: (slug: string) => adminApi.delete(`/admin/blog/${slug}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-blog"] }),
  });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.slug) await adminApi.patch(`/admin/blog/${editing.slug}/`, editing);
      else await adminApi.post("/admin/blog/", editing);
      qc.invalidateQueries({ queryKey: ["admin-blog"] });
      setEditing(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminHeader
        title="Blog"
        subtitle="Create and publish travel articles."
        action={<button onClick={() => setEditing({ ...EMPTY })} className="btn-gold px-5 py-2.5 text-sm">Write Post</button>}
      />

      {isLoading ? (
        <div className="h-48 animate-pulse rounded-2xl bg-white shadow-card" />
      ) : data.length === 0 ? (
        <EmptyState text="No blog posts yet." />
      ) : (
        <div className="space-y-3">
          {data.map((p) => (
            <Card key={p.id} className="flex items-center gap-4 p-4">
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {p.featured_image && <Image src={p.featured_image} alt={p.title} fill sizes="96px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge>{p.category || "Travel"}</Badge>
                  <Badge color={p.status === "published" ? "green" : "gray"}>{p.status}</Badge>
                  {p.is_featured && <Badge color="gold">Featured</Badge>}
                </div>
                <h3 className="mt-1.5 truncate font-semibold text-navy">{p.title}</h3>
                <p className="truncate text-sm text-muted">{p.excerpt}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button onClick={() => setEditing(p)} className="rounded-lg border border-gray-200 p-2 text-navy hover:border-gold hover:text-gold"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => confirm(`Delete "${p.title}"?`) && del.mutate(p.slug)} className="rounded-lg border border-gray-200 p-2 text-navy hover:border-red-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.slug ? "Edit Post" : "Write Post"}>
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <Field label="Title"><Input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category"><Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></Field>
              <Field label="Author"><Input value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} /></Field>
            </div>
            <ImageUpload label="Featured image" value={editing.featured_image || ""} onChange={(url) => setEditing({ ...editing, featured_image: url })} aspect="aspect-[16/9]" />
            <Field label="Excerpt"><Textarea rows={2} value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} /></Field>
            <Field label="Content"><Textarea rows={6} value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} placeholder="Separate paragraphs with a blank line." /></Field>
            <Field label="Images & videos in this post">
              <MediaUpload items={editing.media || []} onChange={(m) => setEditing({ ...editing, media: m })} />
            </Field>
            <div className="flex items-center justify-between">
              <Field label="Status">
                <Select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </Select>
              </Field>
              <Toggle checked={!!editing.is_featured} onChange={(b) => setEditing({ ...editing, is_featured: b })} label="Featured" />
            </div>
            <button type="submit" disabled={saving} className="btn-gold w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Post"}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}
