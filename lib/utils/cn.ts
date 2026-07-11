import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx for conditional class application.
 * Prevents class conflicts (e.g., `p-4 p-2` resolves to `p-2`).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
