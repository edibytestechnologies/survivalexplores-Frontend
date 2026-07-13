"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Star } from "lucide-react";
import { adminApi, adminList } from "@/lib/admin-api";
import { AdminHeader, AddButton, Card, Badge, EmptyState } from "@/components/admin/ui";
import { formatPrice } from "@/lib/utils";
import type { DestinationCard } from "@/lib/types";

const STATUS_COLOR: Record<string, "green" | "gold" | "navy" | "red"> = {
  upcoming: "green",
  ongoing: "gold",
  completed: "navy",
  sold_out: "red",
};

export default function AdminDestinationsPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-destinations"],
    queryFn: () => adminList<DestinationCard>("/admin/destinations/"),
  });

  const del = useMutation({
    mutationFn: (slug: string) => adminApi.delete(`/admin/destinations/${slug}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-destinations"] }),
  });

  return (
    <>
      <AdminHeader
        title="Destinations"
        subtitle="Create and manage Popular Destinations & Curated Journeys."
        action={<AddButton href="/admin/destinations/new" label="Add Destination" />}
      />

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-white shadow-card" />
      ) : data.length === 0 ? (
        <EmptyState text="No destinations yet. Add your first one." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-4">Destination</th>
                <th className="px-5 py-4">Country</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Featured</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((d) => (
                <tr key={d.id} className="hover:bg-cream/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {d.card_image && (
                          <Image src={d.card_image} alt={d.title} fill sizes="56px" className="object-cover" />
                        )}
                      </div>
                      <span className="font-medium text-navy">{d.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted">{d.country}</td>
                  <td className="px-5 py-3 text-muted">{formatPrice(d.final_price)} {d.currency}</td>
                  <td className="px-5 py-3">
                    <Badge color={STATUS_COLOR[d.trip_status] ?? "gray"}>{d.trip_status}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    {d.is_featured ? <Star className="h-4 w-4 fill-gold text-gold" /> : <span className="text-muted">—</span>}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/destinations/${d.slug}`}
                        className="rounded-lg border border-gray-200 p-2 text-navy hover:border-gold hover:text-gold"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${d.title}"? This cannot be undone.`)) del.mutate(d.slug);
                        }}
                        className="rounded-lg border border-gray-200 p-2 text-navy hover:border-red-300 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
