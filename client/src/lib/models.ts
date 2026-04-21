export interface ModelOption {
  id: string; // OpenRouter model id
  label: string;
  /** Short hint shown next to the model name in the picker. */
  tier?: "auto" | "fast" | "balanced" | "heavy";
}

/**
 * Curated list of OpenRouter models known to support tool use well.
 * Add or remove as needed.
 *
 * Ordered: OpenRouter's auto-routing first (lets the provider pick the best
 * model for the query), then fast (cheap, low latency), then the balanced
 * default pick, then heavy flagship models for when depth matters most.
 */
export const MODELS: ModelOption[] = [
  {
    id: "openrouter/auto",
    label: "Auto (OpenRouter)",
    tier: "auto",
  },
  { id: "anthropic/claude-haiku-4.5", label: "Claude Haiku 4.5", tier: "fast" },
  { id: "openai/gpt-5-mini", label: "GPT-5 mini", tier: "fast" },
  { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash", tier: "fast" },
  {
    id: "anthropic/claude-sonnet-4.5",
    label: "Claude Sonnet 4.5",
    tier: "balanced",
  },
  { id: "openai/gpt-5", label: "GPT-5", tier: "balanced" },
  { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro", tier: "balanced" },
  {
    id: "anthropic/claude-opus-4.5",
    label: "Claude Opus 4.5",
    tier: "heavy",
  },
];

/** Default is a balanced Sonnet — good tool use without Opus latency/cost. */
export const DEFAULT_MODEL = "anthropic/claude-sonnet-4.5";
