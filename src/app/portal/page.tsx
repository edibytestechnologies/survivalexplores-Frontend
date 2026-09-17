"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Clock, CheckCircle2, XCircle, CalendarClock, Loader2, Eye } from "lucide-react";
import { customerApi } from "@/lib/customer-api";
import { AdminHeader, Card, Badge, EmptyState, Modal } from "@/components/admin/ui";

interface Trip {
  id: number; destination_title: string; slug: string | null; status: string;
  hero_image: string; duration: string;
  inclusions: { text: string; included: boolean }[];
  itinerary: { day: number; title: string; description: string }[];
  registered_at: string;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { dateStyle: "medium" });
}

export default function MyTripsPage() {
  const [viewing, setViewing] = useState<Trip | null>(null);
  const { data = [], isLoading } = useQuery<Trip[]>({
    queryKey: ["my-trips"],
    queryFn: async () => (await customerApi.get("/me/trips/")).data,
  });

  return (
    <>
      <AdminHeader title="My Trips" subtitle="The trips you've registered for." />
      {isLoading ? (
        <div className="p-10 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-gold" /></div>
      ) : data.length === 0 ? (
        <EmptyState text="You haven't registered for any trips yet." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-4">Destination</th>
                <th className="px-5 py-4">Duration</th>
                <th className="px-5 py-4">Registered</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Insight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((t) => (
                <tr key={t.id} className="hover:bg-cream/50">
                  <td className="px-5 py-3 font-medium text-navy">{t.destination_title}</td>
                  <td className="px-5 py-3 text-muted">{t.duration || "—"}</td>
                  <td className="px-5 py-3 text-muted">{fmtDate(t.registered_at)}</td>
                  <td className="px-5 py-3">
                    <Badge color={t.status === "confirmed" ? "green" : t.status === "cancelled" ? "red" : "gold"}>{t.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setViewing(t)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-navy hover:border-gold hover:text-gold"
                    >
                      <Eye className="h-4 w-4" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.destination_title || "Trip"}>
        {viewing && (
          <div className="space-y-5">
            {viewing.hero_image && (
              <div className="relative h-40 overflow-hidden rounded-xl bg-navy">
                <img src={viewing.hero_image} alt={viewing.destination_title} className="h-full w-full object-cover opacity-90" />
              </div>
            )}
            <div className="flex items-center justify-between">
              {viewing.duration && (
                <p className="flex items-center gap-1.5 text-sm text-muted"><Clock className="h-4 w-4 text-gold" /> {viewing.duration}</p>
              )}
              <Badge color={viewing.status === "confirmed" ? "green" : viewing.status === "cancelled" ? "red" : "gold"}>{viewing.status}</Badge>
            </div>
            {viewing.inclusions.length > 0 && (
              <div>
                <h4 className="mb-3 flex items-center gap-2 font-semibold text-navy"><MapPin className="h-4 w-4 text-gold" /> What&apos;s included</h4>
                <ul className="space-y-1.5 text-sm">
                  {viewing.inclusions.map((i, k) => (
                    <li key={k} className="flex items-center gap-2 text-muted">
                      {i.included ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-400" />}
                      {i.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {viewing.itinerary.length > 0 && (
              <div>
                <h4 className="mb-3 flex items-center gap-2 font-semibold text-navy"><CalendarClock className="h-4 w-4 text-gold" /> Itinerary</h4>
                <ol className="space-y-2">
                  {viewing.itinerary.map((d) => (
                    <li key={d.day} className="flex gap-3 text-sm">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-semibold text-gold">{d.day}</span>
                      <div>
                        <p className="font-medium text-navy">{d.title}</p>
                        <p className="text-xs text-muted">{d.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {viewing.slug && (
              <a href={`/trips/${viewing.slug}`} target="_blank" rel="noreferrer" className="btn-gold w-full">
                View full trip page
              </a>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
