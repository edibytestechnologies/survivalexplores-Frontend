"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Mail, Phone, MessageCircle, MapPin, Eye, Calendar, User } from "lucide-react";
import { adminApi, adminList } from "@/lib/admin-api";
import { AdminHeader, Card, EmptyState, Badge, Select, Modal } from "@/components/admin/ui";

interface Booking {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  destination: number | null;
  destination_title: string;
  status: string;
  created_at: string;
}

function fmt(d: string) {
  return new Date(d).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const STATUSES = ["new", "contacted", "confirmed", "cancelled"];
const COLOR: Record<string, "gold" | "green" | "navy" | "red" | "gray"> = {
  new: "gold",
  contacted: "navy",
  confirmed: "green",
  cancelled: "red",
};

export default function AdminBookingsPage() {
  const qc = useQueryClient();
  const [viewing, setViewing] = useState<Booking | null>(null);
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => adminList<Booking>("/admin/bookings/"),
  });

  const update = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminApi.patch(`/admin/bookings/${id}/`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-bookings"] }),
  });
  const del = useMutation({
    mutationFn: (id: number) => adminApi.delete(`/admin/bookings/${id}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-bookings"] }),
  });

  const pending = data.filter((b) => b.status === "new").length;

  return (
    <>
      <AdminHeader
        title="Bookings"
        subtitle={pending > 0 ? `${pending} new request${pending > 1 ? "s" : ""} awaiting contact.` : "Trip booking requests from the website."}
      />

      {isLoading ? (
        <div className="h-48 animate-pulse rounded-2xl bg-white shadow-card" />
      ) : data.length === 0 ? (
        <EmptyState text="No booking requests yet." />
      ) : (
        <div className="space-y-3">
          {data.map((b) => (
            <Card key={b.id} className={`p-5 ${b.status === "new" ? "ring-2 ring-gold/40" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-navy">{b.full_name}</p>
                    <Badge color={COLOR[b.status] ?? "gray"}>{b.status}</Badge>
                  </div>
                  {b.destination_title && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                      <MapPin className="h-3.5 w-3.5 text-gold" /> {b.destination_title}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                    <a href={`mailto:${b.email}`} className="flex items-center gap-1.5 text-gold hover:underline">
                      <Mail className="h-3.5 w-3.5" /> {b.email}
                    </a>
                    <a href={`tel:${b.phone}`} className="flex items-center gap-1.5 text-gold hover:underline">
                      <Phone className="h-3.5 w-3.5" /> {b.phone}
                    </a>
                    {b.whatsapp && (
                      <a href={`https://wa.me/${b.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-emerald-600 hover:underline">
                        <MessageCircle className="h-3.5 w-3.5" /> {b.whatsapp}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setViewing(b)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-navy hover:border-gold hover:text-gold">
                    <Eye className="h-4 w-4" /> View
                  </button>
                  <Select value={b.status} onChange={(e) => update.mutate({ id: b.id, status: e.target.value })} className="w-36">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </Select>
                  <button onClick={() => confirm(`Delete booking from ${b.full_name}?`) && del.mutate(b.id)} className="rounded-lg border border-gray-200 p-2 text-navy hover:border-red-300 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Booking Details">
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge color={COLOR[viewing.status] ?? "gray"}>{viewing.status}</Badge>
              <span className="text-xs text-muted">#{viewing.id}</span>
            </div>

            <div className="rounded-xl bg-cream p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold">Trip Booked</p>
              <p className="mt-1 flex items-center gap-2 font-serif text-lg font-semibold text-navy">
                <MapPin className="h-4 w-4 text-gold" />
                {viewing.destination_title || "General enquiry (no specific trip)"}
              </p>
            </div>

            <dl className="space-y-3 text-sm">
              <Row icon={<User className="h-4 w-4 text-gold" />} label="Full name" value={viewing.full_name} />
              <Row icon={<Mail className="h-4 w-4 text-gold" />} label="Email" value={<a href={`mailto:${viewing.email}`} className="text-gold hover:underline">{viewing.email}</a>} />
              <Row icon={<Phone className="h-4 w-4 text-gold" />} label="Phone" value={<a href={`tel:${viewing.phone}`} className="text-gold hover:underline">{viewing.phone}</a>} />
              <Row icon={<MessageCircle className="h-4 w-4 text-gold" />} label="WhatsApp" value={viewing.whatsapp ? <a href={`https://wa.me/${viewing.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">{viewing.whatsapp}</a> : "—"} />
              <Row icon={<Calendar className="h-4 w-4 text-gold" />} label="Submitted" value={fmt(viewing.created_at)} />
            </dl>

            <div className="flex gap-2 pt-2">
              <a href={`mailto:${viewing.email}`} className="btn-gold flex-1 py-2.5 text-sm">Email customer</a>
              {viewing.whatsapp && (
                <a href={`https://wa.me/${viewing.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="btn-ghost-navy flex-1 py-2.5 text-sm">WhatsApp</a>
              )}
            </div>
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
      <dd className="text-right font-medium text-navy">{value}</dd>
    </div>
  );
}
