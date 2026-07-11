// ============================================================================
// Unified AI Client — Single entry point for all AI requests
// Routes to the correct provider adapter based on selection
// Handles retry logic and JSON repair per PRD Section 15
// ============================================================================

import type { ProviderID, ChatCompletionRequest, ChatMessage } from "@/types/provider";
import type { AnalysisResult } from "@/types/analysis";
import { type ProviderAdapter } from "./providers/base";
import { OllamaProvider } from "./providers/ollama";
import { OpenRouterProvider } from "./providers/openrouter";
import { validateAnalysisResult } from "@/lib/schemas/analysis-schema";
import { buildVisionPrompt } from "@/lib/prompts/vision-prompt";
import { buildRepairPrompt } from "@/lib/prompts/repair-prompt";
import { logger } from "@/lib/utils/logger";

/** Provider adapter instances (singleton per provider) */
const providerInstances: Record<ProviderID, ProviderAdapter> = {
  ollama: new OllamaProvider(),
  openrouter: new OpenRouterProvider(),
};

/**
 * Analyze a screenshot using the selected provider and model.
 *
 * Flow: Image → Vision Prompt → Provider → JSON → Zod Validate → Result
 * Retries once with a repair prompt if JSON parsing fails.
 */
export async function analyzeScreenshot(options: {
  imageBase64: string;
  provider: ProviderID;
  model: string;
  fallbackModel?: string;
  apiKey?: string;
  baseUrl?: string;
}): Promise<AnalysisResult> {
  const { imageBase64, provider, model, fallbackModel, apiKey, baseUrl } = options;
  const adapter = providerInstances[provider];

  if (!adapter) {
    throw new Error(`Unknown provider: ${provider}`);
  }

  // Build the vision analysis prompt with the image
  const messages: ChatMessage[] = buildVisionPrompt(imageBase64);

  const request: ChatCompletionRequest = {
    model,
    messages,
    temperature: 0.3,
    max_tokens: 8000,
    response_format: { type: "json_object" },
  };

  // First attempt
  let rawResponse: string;
  try {
    rawResponse = await adapter.sendRequest(request, apiKey, baseUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    
    // Attempt fallback if provided and different from primary model
    if (fallbackModel && fallbackModel !== model) {
      logger.warn(`Primary model failed. Falling back.`, { primary: model, fallback: fallbackModel, error: message });
      try {
        const fallbackRequest = { ...request, model: fallbackModel };
        rawResponse = await adapter.sendRequest(fallbackRequest, apiKey, baseUrl);
      } catch (fallbackError) {
        const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : "Unknown error";
        logger.error(`Fallback model also failed`, { fallback: fallbackModel, error: fallbackMessage });
        throw new Error(`AI provider error (Primary and Fallback failed): ${fallbackMessage}`);
      }
    } else {
      throw new Error(`AI provider error: ${message}`);
    }
  }

  // Parse JSON from response
  let parsed: unknown;
  try {
    parsed = extractJSON(rawResponse);
  } catch {
    // JSON parsing failed — attempt repair (PRD Section 15: ask model to repair once)
    logger.info("JSON parsing failed, attempting repair", { model });
    try {
      const repairMessages = buildRepairPrompt(rawResponse);
      const repairRequest: ChatCompletionRequest = {
        model,
        messages: repairMessages,
        temperature: 0.1,
        max_tokens: 8000,
        response_format: { type: "json_object" },
      };
      const repairedResponse = await adapter.sendRequest(repairRequest, apiKey, baseUrl);
      parsed = extractJSON(repairedResponse);
    } catch {
      throw new Error(
        "Failed to parse AI response as valid JSON after repair attempt. Please try again or switch models."
      );
    }
  }

  const validation = validateAnalysisResult(parsed);
  if (!validation.success) {
    logger.warn("Schema validation failed, attempting second repair", { errors: validation.errors?.issues });
    // Try repair one more time with the validation errors
    try {
      const repairMessages = buildRepairPrompt(
        JSON.stringify(parsed),
        validation.errors?.issues.map((i) => `${i.path.join(".")}: ${i.message}`)
      );
      const repairRequest: ChatCompletionRequest = {
        model,
        messages: repairMessages,
        temperature: 0.1,
        max_tokens: 8000,
        response_format: { type: "json_object" },
      };
      const repairedResponse = await adapter.sendRequest(repairRequest, apiKey, baseUrl);
      const repairedParsed = extractJSON(repairedResponse);
      const revalidation = validateAnalysisResult(repairedParsed);
      if (revalidation.success && revalidation.data) {
        return revalidation.data;
      }
    } catch {
      // Fall through to error
    }

    throw new Error(
      "AI response did not match expected schema. Please try again with a different model."
    );
  }

  return validation.data!;
}

/**
 * Extract JSON from a response string that may contain markdown code fences
 * or other wrapper text around the actual JSON.
 */
function extractJSON(text: string): unknown {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // Try extracting from markdown code fences
    const jsonMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (jsonMatch?.[1]) {
      return JSON.parse(jsonMatch[1].trim());
    }

    // Try finding JSON object boundaries
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(text.substring(firstBrace, lastBrace + 1));
    }

    throw new Error("No valid JSON found in response");
  }
}
