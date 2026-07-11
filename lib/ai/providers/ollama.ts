// ============================================================================
// Ollama Cloud Provider — OpenAI-compatible adapter
// Endpoint: https://ollama.com/v1/chat/completions
// API Key: "ollama" (required but ignored by server)
// Vision: base64 image_url content type
// JSON mode: response_format { type: "json_object" }
// ============================================================================

import type { ChatCompletionRequest } from "@/types/provider";
import { type ProviderAdapter, fetchChatCompletion } from "./base";

export class OllamaProvider implements ProviderAdapter {
  readonly id = "ollama" as const;
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.OLLAMA_BASE_URL || "https://ollama.com/v1";
  }

  async sendRequest(
    request: ChatCompletionRequest,
    apiKey?: string,
    baseUrl?: string
  ): Promise<string> {
    const key = apiKey || process.env.OLLAMA_API_KEY || "ollama";
    let endpoint = baseUrl || this.baseUrl;

    // Local Ollama requires /v1 for OpenAI compatibility
    if (endpoint === "http://localhost:11434" || endpoint === "http://127.0.0.1:11434") {
      endpoint += "/v1";
    }

    if (!key) {
      throw new Error(
        "Ollama Cloud API key is required. Set OLLAMA_API_KEY or provide it in settings."
      );
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${key}`,
    };

    return fetchChatCompletion(endpoint + "/chat/completions", request, headers);
  }
}
