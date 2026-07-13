"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Mail, Phone } from "lucide-react";
import { adminApi, adminList } from "@/lib/admin-api";
import { AdminHeader, Card, EmptyState, Badge, Select } from "@/components/admin/ui";

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const STATUSES = ["new", "read", "replied", "archived"];

export default function AdminMessagesPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => adminList<Message>("/admin/messages/"),
  });

  const update = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminApi.patch(`/admin/messages/${id}/`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
  });
  const del = useMutation({
    mutationFn: (id: number) => adminApi.delete(`/admin/messages/${id}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
  });

  return (
    <>
      <AdminHeader title="Contact Messages" subtitle="Inquiries submitted through the Contact page." />

      {isLoading ? (
        <div className="h-48 animate-pulse rounded-2xl bg-white shadow-card" />
      ) : data.length === 0 ? (
        <EmptyState text="No messages yet." />
      ) : (
        <div className="space-y-3">
          {data.map((m) => (
            <Card key={m.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-navy">{m.name}</p>
                    <Badge color={m.status === "new" ? "gold" : "gray"}>{m.status}</Badge>
                  </div>
                  <a href={`mailto:${m.email}`} className="flex items-center gap-1.5 text-sm text-gold hover:underline">
                    <Mail className="h-3.5 w-3.5" /> {m.email}
                  </a>
                  {m.phone && (
                    <a href={`tel:${m.phone}`} className="flex items-center gap-1.5 text-sm text-gold hover:underline">
                      <Phone className="h-3.5 w-3.5" /> {m.phone}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={m.status}
                    onChange={(e) => update.mutate({ id: m.id, status: e.target.value })}
                    className="w-32"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </Select>
                  <button onClick={() => confirm("Delete this message?") && del.mutate(m.id)} className="rounded-lg border border-gray-200 p-2 text-navy hover:border-red-300 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {m.subject && <p className="mt-3 text-sm font-medium text-navy">{m.subject}</p>}
              <p className="mt-1 text-sm text-muted">{m.message}</p>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
