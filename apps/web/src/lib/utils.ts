import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toTitleCase(s: string) {
  return s
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/(^\w|\s\w)/g, m => m.toUpperCase());
}