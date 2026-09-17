"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Mail, Phone, MessageCircle, MapPin, Eye, Calendar, User, Link2, Copy, Check, Share2 } from "lucide-react";
import { adminApi, adminList } from "@/lib/admin-api";
import { AdminHeader, Card, EmptyState, Badge, Select, Modal } from "@/components/admin/ui";
import type { DestinationCard } from "@/lib/types";

interface Registration {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  destination: number | null;
  destination_title: string;
  status: string;
  created_at: string;
}

const STATUSES = ["new", "contacted", "confirmed", "cancelled"];
const COLOR: Record<string, "gold" | "green" | "navy" | "red" | "gray"> = {
  new: "gold", contacted: "navy", confirmed: "green", cancelled: "red",
};

function fmt(d: string) {
  return new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminRegistrationsPage() {
  const qc = useQueryClient();
  const [viewing, setViewing] = useState<Registration | null>(null);
  const [slug, setSlug] = useState("");
  const [copied, setCopied] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-registrations"],
    queryFn: () => adminList<Registration>("/admin/registrations/"),
  });
  const { data: destinations = [] } = useQuery({
    queryKey: ["admin-destinations-mini"],
    queryFn: () => adminList<DestinationCard>("/admin/destinations/"),
  });

  const update = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminApi.patch(`/admin/registrations/${id}/`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-registrations"] }),
  });
  const del = useMutation({
    mutationFn: (id: number) => adminApi.delete(`/admin/registrations/${id}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-registrations"] }),
  });

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = slug ? `${origin}/register/${slug}` : "";

  function copy() {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const pending = data.filter((r) => r.status === "new").length;

  return (
    <>
      <AdminHeader
        title="Registrations"
        subtitle={pending > 0 ? `${pending} new registration${pending > 1 ? "s" : ""}.` : "Traveler registrations from your destination forms."}
      />

      {/* Create / share a registration form */}
      <Card className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Share2 className="h-5 w-5 text-gold" />
          <h2 className="font-serif text-lg font-semibold text-navy">Share a Registration Form</h2>
        </div>
        <p className="mb-4 text-sm text-muted">
          Pick a destination, then copy the link and send it to travelers. They&apos;ll fill in their details
          (name, email, phone, WhatsApp, address) and get a &ldquo;registration successful&rdquo; confirmation.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Select value={slug} onChange={(e) => setSlug(e.target.value)} className="sm:max-w-xs">
            <option value="" disabled>Select a destination *</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.slug}>{d.title}, {d.country}</option>
            ))}
          </Select>
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-cream px-3">
            <Link2 className="h-4 w-4 shrink-0 text-gold" />
            <input readOnly value={link || `${origin}/register/<destination>`} className="w-full bg-transparent py-2.5 text-sm text-navy focus:outline-none" />
          </div>
          <button onClick={copy} disabled={!slug} className="btn-gold px-5 py-2.5 text-sm disabled:opacity-50">
            {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy Link</>}
          </button>
        </div>
        {!slug && <p className="mt-2 text-xs text-muted">A destination is required before you can copy the link.</p>}
      </Card>

      {isLoading ? (
        <div className="h-48 animate-pulse rounded-2xl bg-white shadow-card" />
      ) : data.length === 0 ? (
        <EmptyState text="No registrations yet. Share a form link to start collecting them." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Destination</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((r) => (
                <tr key={r.id} className={r.status === "new" ? "bg-gold/5" : ""}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-navy">{r.full_name}</p>
                    <p className="text-xs text-muted">{r.email}</p>
                  </td>
                  <td className="px-5 py-3 text-muted">{r.destination_title || "—"}</td>
                  <td className="px-5 py-3 text-muted">{r.phone}</td>
                  <td className="px-5 py-3"><Badge color={COLOR[r.status] ?? "gray"}>{r.status}</Badge></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setViewing(r)} className="rounded-lg border border-gray-200 p-2 text-navy hover:border-gold hover:text-gold"><Eye className="h-4 w-4" /></button>
                      <Select value={r.status} onChange={(e) => update.mutate({ id: r.id, status: e.target.value })} className="w-32">
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </Select>
                      <button onClick={() => confirm(`Delete registration from ${r.full_name}?`) && del.mutate(r.id)} className="rounded-lg border border-gray-200 p-2 text-navy hover:border-red-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Registration Details">
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge color={COLOR[viewing.status] ?? "gray"}>{viewing.status}</Badge>
              <span className="text-xs text-muted">#{viewing.id}</span>
            </div>
            <div className="rounded-xl bg-cream p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold">Destination</p>
              <p className="mt-1 flex items-center gap-2 font-serif text-lg font-semibold text-navy">
                <MapPin className="h-4 w-4 text-gold" />
                {viewing.destination_title || "General registration"}
              </p>
            </div>
            <dl className="space-y-3 text-sm">
              <Row icon={<User className="h-4 w-4 text-gold" />} label="Full name" value={viewing.full_name} />
              <Row icon={<Mail className="h-4 w-4 text-gold" />} label="Email" value={<a href={`mailto:${viewing.email}`} className="text-gold hover:underline">{viewing.email}</a>} />
              <Row icon={<Phone className="h-4 w-4 text-gold" />} label="Phone" value={<a href={`tel:${viewing.phone}`} className="text-gold hover:underline">{viewing.phone}</a>} />
              <Row icon={<MessageCircle className="h-4 w-4 text-gold" />} label="WhatsApp" value={viewing.whatsapp ? <a href={`https://wa.me/${viewing.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">{viewing.whatsapp}</a> : "—"} />
              <Row icon={<MapPin className="h-4 w-4 text-gold" />} label="Address" value={viewing.address || "—"} />
              <Row icon={<Calendar className="h-4 w-4 text-gold" />} label="Registered" value={fmt(viewing.created_at)} />
            </dl>
          </div>
        )}
      </Modal>
    </>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
      <dt className="flex items-center gap-2 text-muted">{icon} {label}</dt>
      <dd className="max-w-[60%] text-right font-medium text-navy">{value}</dd>
    </div>
  );
}
