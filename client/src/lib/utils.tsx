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

export type SearchMode = "strict" | "fuzzy" | "semantic";

export const highlightText = (
  text: string,
  words: string[],
  mode: "strict" | "fuzzy" | "semantic"
) => {
  const escapeRegExp = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // TODO: this is not secure solution as words comes from user input
  let regex;

  if (mode === "strict") {
    // In strict mode, match words as substrings anywhere in text (like SQL ILIKE %query%)
    regex = new RegExp(
      `(${words.map((word) => escapeRegExp(word)).join(" ")})`,
      "gi"
    );
  } else {
    // Default behavior - match whole words
    regex = new RegExp(`\\b(${words.map(escapeRegExp).join("|")})\\b`, "gi");
  }

  const result = [];

  let match = regex.exec(text);
  let lastIndex = 0;

  while (match) {
    const before = text.slice(lastIndex, match.index);
    result.push(before);
    result.push(<span className="text-brand font-bold">{match[0]}</span>);
    lastIndex = match.index + match[0].length;
    match = regex.exec(text);
  }

  const after = text.slice(lastIndex);
  result.push(after);

  return result;
};
