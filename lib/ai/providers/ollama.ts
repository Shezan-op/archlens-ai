// ============================================================================
// Ollama Cloud Native Provider
// Implements strict compliance with Ollama Cloud API
// ============================================================================

import { ollamaConfig } from "@/config/ollama";
import type { OllamaChatRequest, OllamaChatResponse } from "@/types/provider";
import { logger } from "@/lib/utils/logger";

/**
 * Sends a native Ollama chat completion request.
 */
export async function sendOllamaRequest(
  request: OllamaChatRequest,
  apiKey: string,
  retryCount = 0
): Promise<string> {
  const url = `${ollamaConfig.baseUrl}${ollamaConfig.chatEndpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ollamaConfig.timeoutMs);

  try {
    const startTime = Date.now();
    logger.debug("Starting Ollama Cloud request", { model: request.model });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "Could not read error body");
      const status = response.status;
      
      logger.error("Ollama HTTP error", { status, latencyMs, errorType: "HTTP_ERROR" });

      // Do not retry 401, 403, 400
      if (status === 401 || status === 403 || status === 400) {
        throw new Error(`Authentication or bad request error (${status}): ${errorBody}`);
      }

      // Retry logic for 5xx or temporary errors
      if (retryCount < ollamaConfig.maxRetries) {
        logger.warn(`Retrying request... (${retryCount + 1}/${ollamaConfig.maxRetries})`);
        return sendOllamaRequest(request, apiKey, retryCount + 1);
      }

      throw new Error(`Ollama API error (${status}): ${errorBody}`);
    }

    const data: OllamaChatResponse = await response.json();
    logger.info("Ollama request successful", { 
      latencyMs, 
      status: response.status,
      model: data.model,
      duration: data.total_duration 
    });

    const content = data.message?.content;
    if (!content) {
      throw new Error("Empty response from Ollama");
    }

    return content;
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      logger.error("Request timed out", { errorType: "TIMEOUT" });
      
      if (retryCount < ollamaConfig.maxRetries) {
        logger.warn(`Retrying request after timeout... (${retryCount + 1}/${ollamaConfig.maxRetries})`);
        return sendOllamaRequest(request, apiKey, retryCount + 1);
      }
      
      throw new Error(`Request timed out after ${ollamaConfig.timeoutMs / 1000} seconds`);
    }
    
    // If it's a fetch/network error (e.g. connection refused), retry
    if ((error as Error).message.includes("fetch failed") && retryCount < ollamaConfig.maxRetries) {
       logger.warn(`Retrying request after network failure... (${retryCount + 1}/${ollamaConfig.maxRetries})`);
       return sendOllamaRequest(request, apiKey, retryCount + 1);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
