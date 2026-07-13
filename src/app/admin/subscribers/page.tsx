"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Mail } from "lucide-react";
import { adminApi, adminList } from "@/lib/admin-api";
import { AdminHeader, Card, EmptyState, Badge } from "@/components/admin/ui";

interface Subscriber {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminSubscribersPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-subscribers"],
    queryFn: () => adminList<Subscriber>("/admin/subscribers/"),
  });

  const del = useMutation({
    mutationFn: (id: number) => adminApi.delete(`/admin/subscribers/${id}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-subscribers"] }),
  });

  function exportCsv() {
    const rows = [["email", "active", "joined"], ...data.map((s) => [s.email, String(s.is_active), s.created_at])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <AdminHeader
        title="Newsletter Subscribers"
        subtitle={`${data.length} subscriber${data.length === 1 ? "" : "s"}.`}
        action={data.length > 0 ? <button onClick={exportCsv} className="btn-ghost-navy px-5 py-2.5 text-sm">Export CSV</button> : null}
      />

      {isLoading ? (
        <div className="h-48 animate-pulse rounded-2xl bg-white shadow-card" />
      ) : data.length === 0 ? (
        <EmptyState text="No subscribers yet." />
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-gray-100">
            {data.map((s) => (
              <li key={s.id} className="flex items-center justify-between px-5 py-3">
                <span className="flex items-center gap-2 text-sm text-navy">
                  <Mail className="h-4 w-4 text-gold" /> {s.email}
                </span>
                <div className="flex items-center gap-3">
                  <Badge color={s.is_active ? "green" : "gray"}>{s.is_active ? "active" : "inactive"}</Badge>
                  <button onClick={() => confirm(`Remove ${s.email}?`) && del.mutate(s.id)} className="rounded-lg border border-gray-200 p-2 text-navy hover:border-red-300 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
