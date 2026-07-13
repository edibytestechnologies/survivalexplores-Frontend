"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, Search, MapPin, X } from "lucide-react";
import { DestinationCard } from "@/components/destination-card";
import { API_URL } from "@/lib/api";
import type { DestinationCard as TCard, Paginated, TripStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 4; // small so infinite scroll is visible with the seeded data

const STATUS_FILTERS: { label: string; value: TripStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Completed", value: "completed" },
  { label: "Sold Out", value: "sold_out" },
];

async function fetchCountries(): Promise<string[]> {
  const res = await fetch(`${API_URL}/destinations/countries/`);
  if (!res.ok) throw new Error("countries");
  return res.json();
}

async function fetchPage(params: {
  page: number;
  country: string;
  status: string;
  search: string;
}): Promise<Paginated<TCard>> {
  const q = new URLSearchParams({ page: String(params.page), page_size: String(PAGE_SIZE) });
  if (params.country) q.set("country", params.country);
  if (params.status) q.set("trip_status", params.status);
  if (params.search) q.set("search", params.search);
  const res = await fetch(`${API_URL}/destinations/?${q.toString()}`);
  if (!res.ok) throw new Error("destinations");
  return res.json();
}

export function TripsExplorer({ initialSearch = "" }: { initialSearch?: string }) {
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState<TripStatus | "">("");
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [search, setSearch] = useState(initialSearch);

  // debounce the search input
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data: countries = [] } = useQuery({ queryKey: ["countries"], queryFn: fetchCountries });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ["destinations", country, status, search],
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        fetchPage({ page: pageParam as number, country, status, search }),
      getNextPageParam: (last, pages) => (last.next ? pages.length + 1 : undefined),
    });

  const items = data?.pages.flatMap((p) => p.results) ?? [];

  // Infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(onIntersect, { rootMargin: "400px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [onIntersect]);

  return (
    <div>
      {/* Modern filter bar — search + country + status pills (no labels/count) */}
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search destinations…"
              className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-9 text-sm text-navy shadow-sm focus:border-gold focus:outline-none sm:w-64"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-navy"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Country */}
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full appearance-none rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-8 text-sm text-navy shadow-sm focus:border-gold focus:outline-none sm:w-52"
            >
              <option value="">All Countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status pills — horizontally scrollable on mobile */}
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.value || "all"}
              onClick={() => setStatus(s.value)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all",
                status === s.value
                  ? "bg-navy text-white shadow-md"
                  : "bg-white text-muted shadow-sm hover:text-navy"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-card">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-2/3 rounded bg-gray-200" />
                <div className="h-3 w-1/3 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : isError || items.length === 0 ? (
        <p className="py-16 text-center text-muted">
          No trips match your filters. Try a different country, status or search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((d, i) => (
            <DestinationCard key={`${d.id}-${country}-${status}-${search}`} d={d} index={i} />
          ))}
        </div>
      )}

      {/* Sentinel + loader */}
      <div ref={sentinelRef} className="h-10" />
      {isFetchingNextPage && (
        <div className="flex flex-col items-center gap-2 py-8 text-gold">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-xs text-muted">Loading more trips…</span>
        </div>
      )}
      {!hasNextPage && items.length > 0 && !isLoading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-8 text-center text-sm text-muted"
        >
          You&apos;ve seen all our journeys ✦
        </motion.p>
      )}
    </div>
  );
}
