export interface ModelOption {
  id: string; // OpenRouter model id
  label: string;
}

/**
 * Curated list of OpenRouter models known to support tool use well.
 * Add or remove as needed; the first entry is the default.
 */
export const MODELS: ModelOption[] = [
  { id: "anthropic/claude-sonnet-4.5", label: "Claude Sonnet 4.5" },
  { id: "anthropic/claude-opus-4.5", label: "Claude Opus 4.5" },
  { id: "openai/gpt-5", label: "GPT-5" },
  { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
];

export const DEFAULT_MODEL = MODELS[0].id;
