// ============================================================================
// AI Client Orchestrator
// Coordinates fallback logic and parses responses
// ============================================================================

import { ollamaConfig } from "@/config/ollama";
import { sendOllamaRequest } from "./providers/ollama";
import type { OllamaChatRequest } from "@/types/provider";
import type { AnalysisResult } from "@/types/analysis";
import { getAnalysisPrompt } from "./prompts";
import { logger } from "@/lib/utils/logger";

interface AnalysisParams {
  imageBase64: string;
  apiKey: string;
}

/**
 * Strips markdown code fences from the JSON string.
 */
function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

/**
 * Analyzes the screenshot using Ollama Cloud.
 * Implements fallback logic strictly through the configured fallback models.
 */
export async function analyzeScreenshot(params: AnalysisParams): Promise<AnalysisResult> {
  const { imageBase64, apiKey } = params;

  if (!apiKey) {
    throw new Error("Ollama Cloud API Key is required.");
  }

  // Construct base request payload (Ollama native format)
  // Note: we remove the data:image/xxx;base64, prefix for Ollama
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
  
  const baseRequest: OllamaChatRequest = {
    model: "", // Set per attempt
    messages: [
      {
        role: "user",
        content: getAnalysisPrompt(),
        images: [base64Data]
      }
    ],
    format: "json",
    stream: false,
  };

  const attemptSequence = [ollamaConfig.primaryModel, ...ollamaConfig.fallbackModels];
  let lastError: Error | null = null;
  let rawResponse = "";

  // Attempt the sequence
  for (const modelId of attemptSequence) {
    try {
      logger.info(`Attempting analysis with model: ${modelId}`);
      
      const request = { ...baseRequest, model: modelId };
      rawResponse = await sendOllamaRequest(request, apiKey);
      
      // If we got here, it succeeded
      break;
    } catch (error) {
      lastError = error as Error;
      logger.warn(`Model ${modelId} failed.`, { error: lastError.message });
      
      // If it's auth/forbidden, do not fallback
      if (lastError.message.includes("401") || lastError.message.includes("403") || lastError.message.includes("400")) {
        throw new Error(`Fatal API error: ${lastError.message}`);
      }
    }
  }

  if (!rawResponse) {
    throw new Error(`AI provider error (All models failed): ${lastError?.message}`);
  }

  // Parse JSON
  try {
    const cleanedText = cleanJsonResponse(rawResponse);
    return JSON.parse(cleanedText) as AnalysisResult;
  } catch (err) {
    logger.error("JSON parsing failed, returning empty stub", { error: (err as Error).message });
    // In production, we could try to repair JSON using another prompt, but to keep it simple:
    throw new Error("AI response did not match expected schema. Please try again.");
  }
}
