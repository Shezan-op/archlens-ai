// ============================================================================
// Provider Configuration — Endpoints and auth from documentation
// Ollama: https://ollama.com/v1 (no API key needed)
// OpenRouter: https://openrouter.ai/api/v1 (requires API key)
// ============================================================================

import { type ProviderConfig, type ProviderID } from "@/types/provider";

export const providers: Record<ProviderID, ProviderConfig> = {
  ollama: {
    id: "ollama",
    name: "Ollama Cloud",
    baseUrl: process.env.OLLAMA_BASE_URL || "https://ollama.com/v1",
    requiresApiKey: true,
  },
  openrouter: {
    id: "openrouter",
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    requiresApiKey: true,
  },
};

/** Get provider config by ID */
export function getProvider(id: ProviderID): ProviderConfig {
  return providers[id];
}
