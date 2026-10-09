import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPriceInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMonthPrice(value: number) {
  return `${formatPriceInr(value)}/month`;
}

export function getAvailabilityTone(status: string) {
  switch (status) {
    case "available":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "sold":
      return "bg-red-50 text-red-700 ring-red-200";
    case "rented":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
