"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Eye, Loader2 } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { AdminHeader, Card } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

type Period = "today" | "yesterday" | "this_week" | "last_week" | "this_month";

const PERIODS: { label: string; value: Period }[] = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "this_week" },
  { label: "Last Week", value: "last_week" },
  { label: "This Month", value: "this_month" },
];

interface DayRow {
  date: string;
  visits: number;
  unique_visitors: number;
}

interface VisitorStats {
  period: Period;
  start: string;
  end: string;
  total_visits: number;
  unique_visitors: number;
  daily: DayRow[];
}

async function fetchVisitorStats(period: Period): Promise<VisitorStats> {
  const { data } = await adminApi.get("/admin/visitor-stats/", { params: { period } });
  return data;
}

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function AdminVisitorsPage() {
  const [period, setPeriod] = useState<Period>("today");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-visitor-stats", period],
    queryFn: () => fetchVisitorStats(period),
  });

  return (
    <>
      <AdminHeader title="Visitors" subtitle="Traffic to your public site, tracked per day." />

      <div className="mb-6 flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              period === p.value
                ? "bg-navy text-white shadow-md"
                : "bg-white text-muted shadow-sm hover:text-navy"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gold" />
        </div>
      ) : isError || !data ? (
        <Card>
          <p className="text-center text-sm text-muted">Couldn&apos;t load visitor stats.</p>
        </Card>
      ) : (
        <>
          <div className="mb-6 grid gap-5 sm:grid-cols-2">
            <Card className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-navy">{data.unique_visitors}</p>
                <p className="text-sm text-muted">Unique visitors</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-navy">{data.total_visits}</p>
                <p className="text-sm text-muted">Total page visits</p>
              </div>
            </Card>
          </div>

          <Card className="overflow-x-auto p-0">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Unique Visitors</th>
                  <th className="px-5 py-4">Total Visits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.daily.map((row) => (
                  <tr key={row.date}>
                    <td className="px-5 py-3 font-medium text-navy">{fmtDate(row.date)}</td>
                    <td className="px-5 py-3 text-muted">{row.unique_visitors}</td>
                    <td className="px-5 py-3 text-muted">{row.visits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </>
  );
}
