"use client";

import { useQuery } from "@tanstack/react-query";
import { MapPin, Clock, CheckCircle2, XCircle, CalendarClock, Loader2 } from "lucide-react";
import { customerApi } from "@/lib/customer-api";
import { AdminHeader, Card, Badge, EmptyState } from "@/components/admin/ui";

interface Trip {
  id: number; destination_title: string; slug: string | null; status: string;
  hero_image: string; duration: string;
  inclusions: { text: string; included: boolean }[];
  itinerary: { day: number; title: string; description: string }[];
}

export default function MyTripsPage() {
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
        <div className="space-y-6">
          {data.map((t) => (
            <Card key={t.id} className="overflow-hidden p-0">
              <div className="relative h-40 bg-navy">
                {t.hero_image && <img src={t.hero_image} alt={t.destination_title} className="h-full w-full object-cover opacity-80" />}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white">{t.destination_title}</h3>
                    {t.duration && <p className="flex items-center gap-1.5 text-sm text-white/85"><Clock className="h-4 w-4 text-gold" /> {t.duration}</p>}
                  </div>
                  <Badge color={t.status === "confirmed" ? "green" : t.status === "cancelled" ? "red" : "gold"}>{t.status}</Badge>
                </div>
              </div>
              <div className="grid gap-6 p-6 md:grid-cols-2">
                {t.inclusions.length > 0 && (
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-navy"><MapPin className="h-4 w-4 text-gold" /> What's included</h4>
                    <ul className="space-y-1.5 text-sm">
                      {t.inclusions.map((i, k) => (
                        <li key={k} className="flex items-center gap-2 text-muted">
                          {i.included ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-400" />}
                          {i.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {t.itinerary.length > 0 && (
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-navy"><CalendarClock className="h-4 w-4 text-gold" /> Itinerary</h4>
                    <ol className="space-y-2">
                      {t.itinerary.map((d) => (
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
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
