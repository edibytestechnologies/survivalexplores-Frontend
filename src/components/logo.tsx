import Link from "next/link";
import { Palmtree } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  light = true,
  src,
}: {
  className?: string;
  light?: boolean;
  src?: string;
}) {
  if (src) {
    return (
      <Link href="/" className={cn("inline-flex items-center", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="Survival Explore" className="h-11 w-auto object-contain" />
      </Link>
    );
  }

  return (
    <Link href="/" className={cn("group inline-flex flex-col leading-none", className)}>
      <span className="flex items-center gap-1.5">
        <Palmtree className="h-6 w-6 text-gold" strokeWidth={1.75} />
        <span
          className={cn(
            "font-serif text-2xl font-bold tracking-tight",
            light ? "text-white" : "text-navy"
          )}
        >
          SURVIVAL
        </span>
      </span>
      <span
        className={cn(
          "ml-8 -mt-0.5 text-[9px] font-semibold uppercase tracking-[0.35em]",
          light ? "text-gold/90" : "text-gold"
        )}
      >
        Explore More · Live More
      </span>
    </Link>
  );
}
