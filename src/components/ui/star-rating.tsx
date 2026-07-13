import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  showValue = true,
  size = 14,
  className,
}: {
  rating: number | string;
  showValue?: boolean;
  size?: number;
  className?: string;
}) {
  const value = typeof rating === "string" ? parseFloat(rating) : rating;
  const rounded = Math.round(value);
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            width={size}
            height={size}
            className={i < rounded ? "fill-gold text-gold" : "fill-gray-200 text-gray-200"}
          />
        ))}
      </span>
      {showValue && <span className="text-sm font-medium text-ink">{value.toFixed(1)}</span>}
    </span>
  );
}
