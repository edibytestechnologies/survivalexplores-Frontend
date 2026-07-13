"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, RotateCw } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { AdminHeader, Card } from "@/components/admin/ui";
import {
  DestinationForm,
  EMPTY_DESTINATION,
  type DestinationFormValues,
} from "@/components/admin/destination-form";

async function fetchDestination(slug: string): Promise<DestinationFormValues> {
  const { data } = await adminApi.get(`/admin/destinations/${slug}/`);
  return {
    ...EMPTY_DESTINATION,
    ...data,
    highlights: data.highlights ?? [],
    gallery: data.gallery ?? [],
    inclusions: data.inclusions ?? [],
    itinerary: data.itinerary ?? [],
  };
}

export default function EditDestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-destination", slug],
    queryFn: () => fetchDestination(slug),
    retry: 1,
  });

  return (
    <>
      <AdminHeader title="Edit Destination" subtitle="Update this trip's details." />

      {isError ? (
        <Card className="flex flex-col items-center gap-4 py-14 text-center">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <div>
            <p className="font-semibold text-navy">Couldn&apos;t load this destination</p>
            <p className="mt-1 text-sm text-muted">
              {(error as { message?: string })?.message ||
                "The backend may be unreachable. Make sure the API is running."}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => refetch()} className="btn-gold px-6">
              <RotateCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Retry
            </button>
            <Link href="/admin/destinations" className="btn-ghost-navy">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          </div>
        </Card>
      ) : isLoading || !data ? (
        <div className="h-96 animate-pulse rounded-2xl bg-white shadow-card" />
      ) : (
        <DestinationForm initial={data} slug={slug} />
      )}
    </>
  );
}
