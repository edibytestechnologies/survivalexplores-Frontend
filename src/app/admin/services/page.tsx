"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { adminApi, adminList } from "@/lib/admin-api";
import { AdminHeader, Card, EmptyState, Modal, Field, Input, Textarea } from "@/components/admin/ui";
import type { Service } from "@/lib/types";

const EMPTY: Partial<Service> = { title: "", icon: "map", description: "", order: 0 };

export default function AdminServicesPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [saving, setSaving] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: () => adminList<Service>("/admin/services/"),
  });

  const del = useMutation({
    mutationFn: (id: number) => adminApi.delete(`/admin/services/${id}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-services"] }),
  });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) await adminApi.patch(`/admin/services/${editing.id}/`, editing);
      else await adminApi.post("/admin/services/", editing);
      qc.invalidateQueries({ queryKey: ["admin-services"] });
      setEditing(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminHeader
        title="Services"
        subtitle="Complete Travel Solutions Under One Roof."
        action={
          <button onClick={() => setEditing({ ...EMPTY })} className="btn-gold px-5 py-2.5 text-sm">
            Add Service
          </button>
        }
      />

      {isLoading ? (
        <div className="h-48 animate-pulse rounded-2xl bg-white shadow-card" />
      ) : data.length === 0 ? (
        <EmptyState text="No services yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((s) => (
            <Card key={s.id} className="flex flex-col">
              <div className="flex items-start justify-between">
                <span className="rounded-lg bg-gold/15 px-2.5 py-1 text-xs font-medium text-gold">{s.icon}</span>
                <div className="flex gap-1.5">
                  <button onClick={() => setEditing(s)} className="rounded-lg border border-gray-200 p-1.5 text-navy hover:border-gold hover:text-gold">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => confirm(`Delete "${s.title}"?`) && del.mutate(s.id)} className="rounded-lg border border-gray-200 p-1.5 text-navy hover:border-red-300 hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="mt-3 font-semibold text-navy">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.description}</p>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit Service" : "Add Service"}>
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <Field label="Title"><Input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
            <Field label="Icon (lucide name)"><Input value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} placeholder="map, users, monitor..." /></Field>
            <Field label="Description"><Textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
            <Field label="Order"><Input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></Field>
            <button type="submit" disabled={saving} className="btn-gold w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}
