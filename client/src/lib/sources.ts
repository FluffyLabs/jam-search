import { Source, stringToSource } from "@shared/sources";

export const SOURCE_OPTIONS = [
  { label: "Matrix channels", value: Source.Matrix },
  { label: "Graypaper.pdf", value: Source.Graypaper },
  { label: "docs.jamcha.in", value: Source.Jamchain },
  {
    label: "github.com/w3f/jamtestvectors",
    value: Source.GithubW3fJamtestvectors,
  },
  { label: "JAM DAO Discord", value: Source.JamDaoDiscord },
  {
    label: "github.com/w3f/jam-milestone-delivery",
    value: Source.GithubW3fJamMilestoneDelivery,
  },
  {
    label: "github.com/davxy/jam-conformance",
    value: Source.GithubDavxyJamConformance,
  },
  {
    label: "github.com/davxy/jam-test-vectors",
    value: Source.GithubDavxyJamTestVectors,
  },
  {
    label: "jam.web3.foundation",
    value: Source.JamWeb3Foundation,
  },
];

export const initialSources = [
  Source.Matrix,
  Source.Graypaper,
  Source.Jamchain,
  Source.GithubDavxyJamConformance,
  Source.GithubDavxyJamTestVectors,
  Source.GithubW3fJamtestvectors,
  Source.JamDaoDiscord,
  Source.GithubW3fJamMilestoneDelivery,
  Source.JamWeb3Foundation,
];

// localStorage key for user's selected sources
const SOURCES_STORAGE_KEY = "jam-search-selected-sources";

/**
 * Get the user's selected sources from localStorage, fallback to initialSources
 */
export function getStoredSources(): Source[] {
  try {
    const stored = localStorage.getItem(SOURCES_STORAGE_KEY);
    if (stored) {
      const parsedSources = JSON.parse(stored);
      // Validate that all stored sources are valid
      const validSources = parsedSources
        .map((source: string) => stringToSource(source))
        .filter(
          (source: Source | undefined): source is Source => source !== undefined
        );

      // If we have valid sources, return them, otherwise fallback to initial
      if (validSources.length > 0) {
        return validSources;
      }
    }
  } catch (error) {
    console.warn("Failed to load sources from localStorage:", error);
  }

  return initialSources;
}

/**
 * Store the user's selected sources to localStorage
 */
export function setStoredSources(sources: Source[]): void {
  try {
    localStorage.setItem(SOURCES_STORAGE_KEY, JSON.stringify(sources));
  } catch (error) {
    console.warn("Failed to save sources to localStorage:", error);
  }
}
