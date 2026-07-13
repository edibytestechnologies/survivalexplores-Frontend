"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Loader2, Star, Check } from "lucide-react";
import { adminApi, adminList } from "@/lib/admin-api";
import { AdminHeader, Card, EmptyState, Modal, Field, Input, Textarea, Select, Toggle, Badge } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/uploader";
import type { Testimonial } from "@/lib/types";

const EMPTY: Partial<Testimonial> = { name: "", country: "", photo: "", rating: 5, review: "", is_featured: true, approved: true };

export default function AdminTestimonialsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [saving, setSaving] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: () => adminList<Testimonial>("/admin/testimonials/"),
  });

  const del = useMutation({
    mutationFn: (id: number) => adminApi.delete(`/admin/testimonials/${id}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-testimonials"] }),
  });

  const approve = useMutation({
    mutationFn: (id: number) => adminApi.patch(`/admin/testimonials/${id}/`, { approved: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-testimonials"] }),
  });

  const pending = data.filter((t) => !t.approved).length;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) await adminApi.patch(`/admin/testimonials/${editing.id}/`, editing);
      else await adminApi.post("/admin/testimonials/", editing);
      qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
      setEditing(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminHeader
        title="Testimonials"
        subtitle={pending > 0 ? `${pending} pending approval · manage the 'What Our Travelers Say' section.` : "Manage the 'What Our Travelers Say' section."}
        action={<button onClick={() => setEditing({ ...EMPTY })} className="btn-gold px-5 py-2.5 text-sm">Add Testimonial</button>}
      />

      {isLoading ? (
        <div className="h-48 animate-pulse rounded-2xl bg-white shadow-card" />
      ) : data.length === 0 ? (
        <EmptyState text="No testimonials yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((t) => (
            <Card key={t.id} className={`flex flex-col ${!t.approved ? "ring-2 ring-gold/40" : ""}`}>
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gold/15">
                  {t.photo ? (
                    <Image src={t.photo} alt={t.name} fill sizes="48px" className="object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center font-serif font-bold text-gold">{t.name.charAt(0)}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy">{t.name}</p>
                  <p className="text-xs text-muted">{t.country}</p>
                </div>
                <span className="flex items-center gap-0.5 text-sm text-gold">
                  <Star className="h-3.5 w-3.5 fill-gold" /> {t.rating}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {t.approved ? <Badge color="green">Approved</Badge> : <Badge color="gold">Pending</Badge>}
                {t.is_featured && <Badge color="navy">Featured</Badge>}
              </div>
              <p className="mt-3 flex-1 text-sm text-muted">“{t.review}”</p>
              <div className="mt-4 flex items-center justify-between gap-1.5">
                {!t.approved ? (
                  <button onClick={() => approve.mutate(t.id!)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600">
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                ) : <span />}
                <div className="flex gap-1.5">
                  <button onClick={() => setEditing(t)} className="rounded-lg border border-gray-200 p-1.5 text-navy hover:border-gold hover:text-gold"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => confirm(`Delete testimonial by ${t.name}?`) && del.mutate(t.id!)} className="rounded-lg border border-gray-200 p-1.5 text-navy hover:border-red-300 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit Testimonial" : "Add Testimonial"}>
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name"><Input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
              <Field label="Country"><Input value={editing.country} onChange={(e) => setEditing({ ...editing, country: e.target.value })} /></Field>
            </div>
            <ImageUpload label="Photo" value={editing.photo || ""} onChange={(url) => setEditing({ ...editing, photo: url })} aspect="aspect-square" />
            <Field label="Rating">
              <Select value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
              </Select>
            </Field>
            <Field label="Review"><Textarea rows={4} required value={editing.review} onChange={(e) => setEditing({ ...editing, review: e.target.value })} /></Field>
            <div className="flex flex-wrap gap-6">
              <Toggle checked={!!editing.approved} onChange={(b) => setEditing({ ...editing, approved: b })} label="Approved (visible on site)" />
              <Toggle checked={!!editing.is_featured} onChange={(b) => setEditing({ ...editing, is_featured: b })} label="Featured on home page" />
            </div>
            <button type="submit" disabled={saving} className="btn-gold w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}
