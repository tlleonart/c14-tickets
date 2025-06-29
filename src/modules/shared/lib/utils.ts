import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitDateHour(iso: string) {
  const dt = new Date(iso);
  return {
    date: dt.toLocaleDateString("es-ES"),
    hour: dt.getHours().toString().padStart(2, "0"),
  };
}
