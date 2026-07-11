// ============================================================================
// Repair Prompt — Asks the model to fix malformed JSON
// Used when initial response fails JSON parsing or Zod validation
// PRD Section 15: "If JSON parsing fails, ask the model to repair once"
// ============================================================================

import type { ChatMessage } from "@/types/provider";

/**
 * Build a repair prompt to fix malformed JSON output.
 * Optionally includes specific validation errors from Zod.
 */
export function buildRepairPrompt(
  malformedOutput: string,
  validationErrors?: string[]
): ChatMessage[] {
  const errorContext = validationErrors
    ? `\n\nSpecific validation errors:\n${validationErrors.map((e) => `- ${e}`).join("\n")}`
    : "";

  return [
    {
      role: "system",
      content: `You are a JSON repair assistant. Your job is to fix malformed JSON output.
Return ONLY valid JSON — no markdown, no explanations, no code fences.
Preserve all data from the original output.
Fix any syntax errors, missing fields, or type mismatches.${errorContext}`,
    },
    {
      role: "user",
      content: `Fix this malformed JSON and return valid JSON matching the required schema. Ensure all required fields are present with correct types:

${malformedOutput.substring(0, 6000)}`,
    },
  ];
}
