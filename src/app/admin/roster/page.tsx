"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, CheckCircle2, Clock, Wallet, Loader2, Mail, Phone } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { AdminHeader, Card, Badge, EmptyState, Select } from "@/components/admin/ui";

interface Person {
  name: string; email: string; phone: string; has_account: boolean;
  total: string; paid: string; balance: string; payment_status: string;
}
interface Group {
  trip: string; registered: number; billed: number; paid: number; partial: number;
  total_billed: string; total_collected: string; people: Person[];
}

const STATUS: Record<string, { label: string; color: "green" | "gold" | "navy" | "gray" }> = {
  paid: { label: "Paid in full", color: "green" },
  partial: { label: "Part-paid", color: "gold" },
  pending: { label: "Billed · unpaid", color: "navy" },
  not_billed: { label: "Not billed", color: "gray" },
};

export default function RosterPage() {
  const [trip, setTrip] = useState("");
  const { data = [], isLoading } = useQuery<Group[]>({
    queryKey: ["trip-roster"],
    queryFn: async () => (await adminApi.get("/admin/trip-roster/")).data,
  });

  const groups = trip ? data.filter((g) => g.trip === trip) : data;

  return (
    <>
      <AdminHeader title="Trip Roster" subtitle="Who registered for each trip and their payment status." />

      <div className="mb-6 max-w-xs">
        <Select value={trip} onChange={(e) => setTrip(e.target.value)}>
          <option value="">All trips</option>
          {data.map((g) => <option key={g.trip} value={g.trip}>{g.trip} ({g.registered})</option>)}
        </Select>
      </div>

      {isLoading ? (
        <div className="p-10 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-gold" /></div>
      ) : groups.length === 0 ? (
        <EmptyState text="No registrations yet." />
      ) : (
        <div className="space-y-8">
          {groups.map((g) => (
            <div key={g.trip}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-serif text-xl font-semibold text-navy">{g.trip}</h2>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Stat icon={<Users className="h-3.5 w-3.5" />} label="Registered" value={g.registered} />
                  <Stat icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Paid" value={g.paid} tone="green" />
                  <Stat icon={<Clock className="h-3.5 w-3.5" />} label="Part-paid" value={g.partial} tone="gold" />
                  <Stat icon={<Wallet className="h-3.5 w-3.5" />} label="Collected" value={`GHS ${g.total_collected}`} />
                </div>
              </div>
              <Card className="overflow-x-auto p-0">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-muted">
                    <tr>
                      <th className="px-5 py-3">Traveler</th>
                      <th className="px-5 py-3">Contact</th>
                      <th className="px-5 py-3">Billed</th>
                      <th className="px-5 py-3">Paid</th>
                      <th className="px-5 py-3">Balance</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {g.people.map((p, i) => (
                      <tr key={i} className={p.payment_status === "paid" ? "bg-emerald-50/40" : ""}>
                        <td className="px-5 py-3">
                          <p className="font-medium text-navy">{p.name}</p>
                          {!p.has_account && <span className="text-[10px] text-red-400">no account</span>}
                        </td>
                        <td className="px-5 py-3">
                          <a href={`mailto:${p.email}`} className="flex items-center gap-1.5 text-gold hover:underline"><Mail className="h-3.5 w-3.5" /> {p.email}</a>
                          {p.phone && <span className="flex items-center gap-1.5 text-xs text-muted"><Phone className="h-3 w-3" /> {p.phone}</span>}
                        </td>
                        <td className="px-5 py-3 text-muted">{Number(p.total) > 0 ? `GHS ${p.total}` : "—"}</td>
                        <td className="px-5 py-3 text-emerald-600">{Number(p.paid) > 0 ? `GHS ${p.paid}` : "—"}</td>
                        <td className="px-5 py-3 text-muted">{Number(p.total) > 0 ? `GHS ${p.balance}` : "—"}</td>
                        <td className="px-5 py-3"><Badge color={STATUS[p.payment_status].color}>{STATUS[p.payment_status].label}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Stat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: React.ReactNode; tone?: "green" | "gold" }) {
  const c = tone === "green" ? "text-emerald-600" : tone === "gold" ? "text-gold" : "text-navy";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
      <span className={c}>{icon}</span>
      <span className="text-muted">{label}</span>
      <span className={`font-semibold ${c}`}>{value}</span>
    </span>
  );
}
