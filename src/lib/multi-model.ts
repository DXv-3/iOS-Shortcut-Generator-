// Multi-model AI provider config
// Supports: OpenAI (gpt-4o, gpt-4o-mini), Anthropic (claude-3-5-sonnet), Google (gemini-2.0-flash)
// Uses @ai-sdk/* adapters — same generateObject interface regardless of provider

export type ModelProvider = "openai" | "anthropic" | "google";

export interface ModelOption {
  id: string;
  name: string;
  provider: ModelProvider;
  model: string;
  description: string;
  contextWindow: string;
  speed: "fast" | "medium" | "slow";
  quality: "standard" | "high" | "best";
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    model: "gpt-4o",
    description: "Best overall — fast, smart, great at structured output",
    contextWindow: "128k",
    speed: "fast",
    quality: "best",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    model: "gpt-4o-mini",
    description: "Fastest and cheapest. Great for simple shortcuts.",
    contextWindow: "128k",
    speed: "fast",
    quality: "standard",
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    model: "claude-3-5-sonnet-20241022",
    description: "Exceptional reasoning and instruction following",
    contextWindow: "200k",
    speed: "medium",
    quality: "best",
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "anthropic",
    model: "claude-3-haiku-20240307",
    description: "Ultra-fast Anthropic model, great for quick generations",
    contextWindow: "200k",
    speed: "fast",
    quality: "standard",
  },
  {
    id: "gemini-2-flash",
    name: "Gemini 2.0 Flash",
    provider: "google",
    model: "gemini-2.0-flash",
    description: "Google's fastest multimodal model",
    contextWindow: "1M",
    speed: "fast",
    quality: "high",
  },
  {
    id: "gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    provider: "google",
    model: "gemini-1.5-pro",
    description: "Google's most capable model with 1M context",
    contextWindow: "1M",
    speed: "slow",
    quality: "best",
  },
];

export function getModelsByProvider(provider: ModelProvider): ModelOption[] {
  return MODEL_OPTIONS.filter(m => m.provider === provider);
}

export const PROVIDER_LABELS: Record<ModelProvider, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
};

export const PROVIDER_COLORS: Record<ModelProvider, string> = {
  openai: "#10a37f",
  anthropic: "#d4a27f",
  google: "#4285f4",
};
