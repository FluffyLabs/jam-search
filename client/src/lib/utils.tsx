import { type ClassValue, clsx } from "clsx";
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
  let query = richQuery;

  for (;;) {
    const match = regex.exec(richQuery);
    if (match === null) {
      break;
    }
    filters.push({ key: match[1], value: match[2] });
  }

  // Filter out the filter patterns from the raw query
  for (const option of filterOptions) {
    const filterPattern = new RegExp(`${option}:[^\\s]+`, "g");
    query = query.replace(filterPattern, "");
  }

  // Clean up extra spaces
  query = query.replace(/\s+/g, " ").trim();

  return { query, filters };
};

/** Truncate and display just the relevant text. */
export const getTextToDisplay = (
  text: string,
  query: string,
  maxContext = 100
) => {
  // Get the first word from the query
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 1);

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
  let startIndex = Math.max(0, matchedWordResult.index - maxContext / 2);
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
    ...highlightText(text.slice(startIndex, endIndex), queryWords),
    endIndex < text.length ? "..." : "",
  ];

  return result;
};

export const highlightText = (text: string, words: string[]) => {
  const escapeRegExp = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regex = new RegExp(
    `(${words.map((word) => escapeRegExp(word)).join("|")})`,
    "gi"
  );

  const result = [];

  let match = regex.exec(text);
  let lastIndex = 0;
  let matchIndex = 0;

  while (match) {
    const before = text.slice(lastIndex, match.index);
    result.push(before);
    result.push(
      <span
        key={`${matchIndex}-${match.index}`}
        className="bg-brand-light dark:bg-transparent text-brand-dark dark:text-brand font-bold rounded-sm"
      >
        {match[0]}
      </span>
    );
    matchIndex++;
    lastIndex = match.index + match[0].length;
    match = regex.exec(text);
  }

  const after = text.slice(lastIndex);
  result.push(after);

  return result;
};
