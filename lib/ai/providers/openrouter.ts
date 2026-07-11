// ============================================================================
// OpenRouter Provider — OpenAI-compatible adapter
// Endpoint: https://openrouter.ai/api/v1/chat/completions
// Auth: Bearer token (OPENROUTER_API_KEY)
// Extra headers: HTTP-Referer, X-Title (recommended by docs)
// ============================================================================

import type { ChatCompletionRequest } from "@/types/provider";
import { type ProviderAdapter, fetchChatCompletion } from "./base";
import { siteConfig } from "@/config/site";

export class OpenRouterProvider implements ProviderAdapter {
  readonly id = "openrouter" as const;
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || "https://openrouter.ai/api/v1";
  }

  async sendRequest(
    request: ChatCompletionRequest,
    apiKey?: string,
    baseUrl?: string
  ): Promise<string> {
    const key = apiKey || process.env.OPENROUTER_API_KEY;

    if (!key) {
      throw new Error(
        "OpenRouter API key is required. Set OPENROUTER_API_KEY or provide it in settings."
      );
    }

    // OpenRouter recommends these headers for attribution
    const headers: Record<string, string> = {
      Authorization: `Bearer ${key}`,
      "HTTP-Referer": siteConfig.url,
      "X-Title": siteConfig.name,
    };

    const endpoint = baseUrl || this.baseUrl;
    return fetchChatCompletion(endpoint + "/chat/completions", request, headers);
  }
}
