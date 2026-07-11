// ============================================================================
// Model Registry — Built from Ollama Cloud & OpenRouter documentation
// Vision-capable models for screenshot analysis
// ============================================================================

import { type ModelConfig } from "@/types/provider";

/**
 * Ollama Cloud models — sourced from ollama-cloud-models.md
 * Vision models: gemma4:31b-cloud, gemini-3-flash-preview:cloud, qwen3.5:cloud
 */
export const ollamaModels: ModelConfig[] = [
  {
    id: "llama3.2-vision",
    name: "Llama 3.2 Vision",
    provider: "ollama",
    capabilities: ["vision", "text", "structured-json", "high-quality"],
    supportsVision: true,
    supportsJSON: true,
    description: "Meta's Llama 3.2 Vision — excellent for UI analysis",
  },
  {
    id: "llava",
    name: "LLaVA",
    provider: "ollama",
    capabilities: ["vision", "text"],
    supportsVision: true,
    supportsJSON: true,
    description: "Standard LLaVA vision model",
  },
  {
    id: "qwen2.5-vl",
    name: "Qwen 2.5 VL",
    provider: "ollama",
    capabilities: ["vision", "text", "fast"],
    supportsVision: true,
    supportsJSON: true,
    description: "Qwen Vision-Language model",
  },
  {
    id: "gemma4:31b-cloud",
    name: "Gemma 4 31B Cloud",
    provider: "ollama",
    capabilities: ["vision", "text", "structured-json", "high-quality"],
    supportsVision: true,
    supportsJSON: true,
    description: "Gemma 4 Cloud — excellent for UI analysis",
  },
  {
    id: "gemini-3-flash-preview:cloud",
    name: "Gemini 3 Flash Preview Cloud",
    provider: "ollama",
    capabilities: ["vision", "text", "fast"],
    supportsVision: true,
    supportsJSON: true,
    description: "Gemini 3 Flash Preview — fast vision model",
  },
  {
    id: "qwen3.5:cloud",
    name: "Qwen 3.5 Cloud",
    provider: "ollama",
    capabilities: ["vision", "text", "structured-json", "high-quality"],
    supportsVision: true,
    supportsJSON: true,
    description: "Qwen 3.5 Cloud — strong vision and chat model",
  },
  {
    id: "llama3.1",
    name: "Llama 3.1",
    provider: "ollama",
    capabilities: ["text", "structured-json", "high-quality"],
    supportsVision: false,
    supportsJSON: true,
    description: "Standard text model",
  },
];

/**
 * OpenRouter free models — sourced from openrouter-freemodels-list.md
 * Vision models: gemma-3-27b-it, qwen-2.5-vl-72b, qwen-2.5-vl-32b
 */
export const openRouterModels: ModelConfig[] = [
  {
    id: "openrouter/free",
    name: "Free Models Router",
    provider: "openrouter",
    capabilities: ["vision", "text", "structured-json"],
    supportsVision: true,
    supportsJSON: true,
    description: "Automatically routes to the best free model available",
  },
  {
    id: "google/gemma-3-27b-it:free",
    name: "Gemma 3 27B IT",
    provider: "openrouter",
    capabilities: ["vision", "text", "structured-json", "high-quality"],
    supportsVision: true,
    supportsJSON: true,
    description: "Google's Gemma 3 — best free vision model on OpenRouter",
  },
  {
    id: "qwen/qwen-2.5-vl-72b-instruct:free",
    name: "Qwen 2.5 VL 72B",
    provider: "openrouter",
    capabilities: ["vision", "text", "structured-json", "high-quality"],
    supportsVision: true,
    supportsJSON: true,
    description: "Qwen Vision-Language 72B — excellent for UI analysis",
  },
  {
    id: "qwen/qwen-2.5-vl-32b-instruct:free",
    name: "Qwen 2.5 VL 32B",
    provider: "openrouter",
    capabilities: ["vision", "text", "fast"],
    supportsVision: true,
    supportsJSON: true,
    description: "Qwen Vision-Language 32B — faster alternative",
  },
  {
    id: "qwen/qwen-2.5-vl-7b-instruct:free",
    name: "Qwen 2.5 VL 7B",
    provider: "openrouter",
    capabilities: ["vision", "text", "fast", "budget"],
    supportsVision: true,
    supportsJSON: true,
    description: "Lightweight vision model for quick analysis",
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "Llama 3.3 70B",
    provider: "openrouter",
    capabilities: ["text", "structured-json", "high-quality"],
    supportsVision: false,
    supportsJSON: true,
    description: "Meta's Llama 3.3 — strong text model",
  },
  {
    id: "deepseek/deepseek-r1:free",
    name: "DeepSeek R1",
    provider: "openrouter",
    capabilities: ["text", "structured-json", "high-quality"],
    supportsVision: false,
    supportsJSON: true,
    description: "DeepSeek reasoning model",
  },
];

/** All models indexed by provider */
export const modelRegistry = {
  ollama: ollamaModels,
  openrouter: openRouterModels,
} as const;

/** Get vision-capable models for a provider */
export function getVisionModels(provider: "ollama" | "openrouter"): ModelConfig[] {
  return modelRegistry[provider].filter((m) => m.supportsVision);
}

/** Get a specific model by ID */
export function getModelById(modelId: string): ModelConfig | undefined {
  return [...ollamaModels, ...openRouterModels].find((m) => m.id === modelId);
}

/** Default vision model per provider */
export const defaultVisionModel = {
  ollama: "llama3.2-vision",
  openrouter: "openrouter/free",
} as const;

/** Default fallback vision model per provider (used if primary fails or times out) */
export const defaultFallbackModel = {
  ollama: "llava", // Reliable fallback
  openrouter: "google/gemma-3-27b-it:free", // Reliable free alternative
} as const;
