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

/** Truncate and display just the relevant text. */
export const getTextToDisplay = (
  text: string,
  query: string,
  searchMode: SearchMode,
  maxContext: number = 100,
) => {
  if (!text || !query) return `${text.slice(0, maxContext)}...`;

  // Get the first word from the query
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2);

  if (queryWords.length === 0)
    return text.length > maxContext ? `${text.slice(0, maxContext)}...` : text;

  const normalizedText = text.toLowerCase();

  // Find the first occurrence of any query word
  const matchedWordResult = queryWords.reduce(
    (result, word) => {
      if (result.index !== -1) return result;

      const index = normalizedText.indexOf(word);
      if (index !== -1) {
        return {
          index,
          word,
        };
      }
      return result;
    },
    {
      index: -1,
      word: "",
    }
  );

  if (matchedWordResult.index === -1) {
    return text.length > maxContext ? `${text.slice(0, maxContext)}...` : text;
  }

  // Calculate initial start and end indices for the context window
  let startIndex = Math.max(0, matchedWordResult.index - maxContext/2);
  let endIndex = Math.min(
    text.length,
    matchedWordResult.index + matchedWordResult.word.length + maxContext / 2
  );

  // Adjust startIndex to include full words
  if (startIndex > 0) {
    // Find the beginning of the first word
    const beforeText = text.slice(0, startIndex);
    const lastSpaceBeforeStart = beforeText.lastIndexOf(" ");
    if (lastSpaceBeforeStart !== -1) {
      startIndex = lastSpaceBeforeStart + 1;
    }
  }

  // Adjust endIndex to include full words
  if (endIndex < text.length) {
    // Find the end of the last word
    const nextSpaceAfterEnd = text.indexOf(" ", endIndex);
    if (nextSpaceAfterEnd !== -1) {
      endIndex = nextSpaceAfterEnd;
    } else {
      // If no more spaces, include the rest of the text
      endIndex = text.length;
    }
  }

  const result = [
    startIndex > 0 ? "..." : "",
    ...highlightText(text.slice(startIndex, endIndex), queryWords, searchMode),
    endIndex < text.length ? "..." : "",
  ];

  return result;
};

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
