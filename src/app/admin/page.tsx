"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  MapPinned,
  Globe2,
  Newspaper,
  Star,
  Mail,
  Users,
  DollarSign,
  CalendarCheck,
  Wallet,
} from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { AdminHeader, Card, Badge } from "@/components/admin/ui";

interface Stats {
  totals: Record<string, number>;
  trip_status: Record<string, number>;
  recent_messages: { id: number; name: string; subject: string; status: string; created_at: string }[];
  recent_destinations: { title: string; country: string; slug: string; price: number; trip_status: string }[];
}

async function fetchStats(): Promise<Stats> {
  const { data } = await adminApi.get("/admin/stats/");
  return data;
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: fetchStats });

  const t = data?.totals ?? {};
  const cards = [
    { label: "Revenue collected", value: `₵${(t.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, color: "text-emerald-600" },
    { label: "Outstanding", value: `₵${(t.outstanding || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: Wallet, color: "text-gold" },
    { label: "Bookings", value: t.bookings, icon: CalendarCheck, color: "text-gold" },
    { label: "Destinations", value: t.destinations, icon: MapPinned, color: "text-gold" },
    { label: "Countries", value: t.countries, icon: Globe2, color: "text-emerald-500" },
    { label: "Blog Posts", value: t.blog_posts, icon: Newspaper, color: "text-blue-500" },
    { label: "Testimonials", value: t.testimonials, icon: Star, color: "text-gold" },
    { label: "Messages", value: t.messages, icon: Mail, color: "text-rose-500" },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" subtitle="Overview of your travel platform." />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white shadow-card" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {cards.map((c) => (
            <Card key={c.label} className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cream">
                <c.icon className={`h-6 w-6 ${c.color}`} />
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-navy">{c.value ?? 0}</p>
                <p className="text-xs text-muted">{c.label}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-navy">Recent Destinations</h2>
            <Link href="/admin/destinations" className="text-sm font-medium text-gold hover:underline">
              Manage
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {(data?.recent_destinations ?? []).map((d) => (
              <li key={d.slug} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-navy">{d.title}</p>
                  <p className="text-xs text-muted">{d.country}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted">{Math.round(d.price).toLocaleString()}</span>
                  <Badge color={d.trip_status === "completed" ? "navy" : d.trip_status === "ongoing" ? "gold" : "green"}>
                    {d.trip_status}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-navy">Recent Messages</h2>
            <Link href="/admin/messages" className="text-sm font-medium text-gold hover:underline">
              View all
            </Link>
          </div>
          {(data?.recent_messages ?? []).length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {(data?.recent_messages ?? []).map((m) => (
                <li key={m.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-navy">{m.name}</p>
                    <p className="text-xs text-muted">{m.subject || "No subject"}</p>
                  </div>
                  <Badge color={m.status === "new" ? "gold" : "gray"}>{m.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
