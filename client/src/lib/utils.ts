import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Define SearchFilter type
export interface SearchFilter {
  key: string;
  value: string;
}

// Helper function to parse search query
export const parseSearchQuery = (
  richQuery: string
): { query: string; filters: SearchFilter[] } => {
  const filters: SearchFilter[] = [];
  const filterOptions = ["from", "since_gp", "before", "after"];
  const regex = new RegExp(`(${filterOptions.join("|")}):([^\\s]+)`, "g");
  let match;
  let query = richQuery;

  while ((match = regex.exec(richQuery)) !== null) {
    filters.push({ key: match[1], value: match[2] });
  }

  // Filter out the filter patterns from the raw query
  filterOptions.forEach((option) => {
    const filterPattern = new RegExp(`${option}:[^\\s]+`, "g");
    query = query.replace(filterPattern, "");
  });

  // Clean up extra spaces
  query = query.replace(/\s+/g, " ").trim();

  return { query, filters };
};
