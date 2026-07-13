import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: string | number): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}
