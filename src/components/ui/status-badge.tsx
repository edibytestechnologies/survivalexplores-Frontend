import { cn } from "@/lib/utils";
import type { TripStatus } from "@/lib/types";

const CONFIG: Record<TripStatus, { label: string; className: string }> = {
  upcoming: { label: "Upcoming", className: "bg-emerald-500/90 text-white" },
  ongoing: { label: "Ongoing", className: "bg-gold text-white" },
  completed: { label: "Completed", className: "bg-navy/80 text-white" },
  sold_out: { label: "Sold Out", className: "bg-red-500/90 text-white" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: TripStatus;
  className?: string;
}) {
  const cfg = CONFIG[status] ?? CONFIG.upcoming;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-sm backdrop-blur",
        cfg.className,
        className
      )}
    >
      {cfg.label}
    </span>
  );
}
