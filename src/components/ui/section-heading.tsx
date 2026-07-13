import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={cn(center && "text-center", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="section-title">{title}</h2>
      <div className={cn("mt-3 h-0.5 w-14 rounded bg-gold", center && "mx-auto")} />
      {subtitle && (
        <p className={cn("mt-4 max-w-2xl text-muted", center && "mx-auto")}>{subtitle}</p>
      )}
    </Reveal>
  );
}
