// ============================================================================
// Base Provider — Abstract interface that all providers implement
// Ensures ONE unified request shape; only endpoint, key, and model swap
// ============================================================================

import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  ProviderID,
} from "@/types/provider";
import { logger } from "@/lib/utils/logger";

/**
 * Abstract provider adapter interface.
 * Both Ollama and OpenRouter implement this same contract.
 */
export interface ProviderAdapter {
  /** Provider identifier */
  readonly id: ProviderID;

  /**
   * Send an OpenAI-compatible chat completion request.
   * Returns the raw response text content from the model.
   */
  sendRequest(
    request: ChatCompletionRequest,
    apiKey?: string,
    baseUrl?: string
  ): Promise<string>;
}

/**
 * Shared fetch helper for OpenAI-compatible endpoints.
 * Both providers use the same request/response shape.
 */
export async function fetchChatCompletion(
  baseUrl: string,
  request: ChatCompletionRequest,
  headers: Record<string, string>,
  timeoutMs: number = 45000 // 45 seconds default timeout
): Promise<string> {
  const url = baseUrl; // baseUrl here is the full endpoint passed by the provider

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const startTime = Date.now();
  
    logger.debug("Starting fetch request", { url });
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    const latencyMs = Date.now() - startTime;
  
    if (!response.ok) {
      const errorBody = await response.text().catch(() => "Could not read error body");
      logger.error("Provider HTTP error", { url, status: response.status, latencyMs, errorBody });
      throw new Error(`Provider error (${response.status}): ${errorBody}`);
    }

    const data: ChatCompletionResponse = await response.json();
  
    logger.debug("Fetch request successful", { url, latencyMs, status: response.status });

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from model");
    }

    return content;
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs / 1000} seconds`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
