// ============================================================================
// Zod Analysis Schema — Validates AI JSON output before rendering
// Matches PRD Section 13 output schema exactly
// ============================================================================

import { z } from "zod";

const confidenceLevelSchema = z.enum(["high", "medium", "low"]);

const colorInfoSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  background: z.string(),
  text: z.string(),
  additionalColors: z.array(z.string()).optional().default([]),
});

const typographyInfoSchema = z.object({
  headingStyle: z.string(),
  bodyStyle: z.string(),
  hierarchy: z.string(),
  readability: z.string(),
});

const detectedComponentSchema = z.object({
  name: z.string(),
  count: z.number().optional(),
  description: z.string(),
});

const designAuditSchema = z.object({
  style: z.string(),
  palette: colorInfoSchema,
  typography: typographyInfoSchema,
  spacing: z.string(),
  components: z.array(detectedComponentSchema),
  layout: z.string(),
  uxScore: z.number().min(0).max(10),
  accessibilityScore: z.number().min(0).max(10),
  quickWins: z.array(z.string()),
  issues: z.array(z.string()),
});

const systemInferenceSchema = z.object({
  productType: z.string(),
  frontend: z.string(),
  backend: z.string(),
  database: z.string(),
  auth: z.string(),
  storage: z.string(),
  cache: z.string(),
  realtime: z.string(),
  queues: z.string(),
  search: z.string(),
  apis: z.array(z.string()),
  scalingNotes: z.string(),
});

const implementationNotesSchema = z.object({
  buildOrder: z.array(z.string()),
  majorModules: z.array(z.string()),
  estimatedComplexity: z.enum(["low", "medium", "high", "very-high"]),
  risks: z.array(z.string()),
  recommendedStack: z.string(),
});

const confidenceInfoSchema = z.object({
  design: confidenceLevelSchema,
  system: confidenceLevelSchema,
  architecture: confidenceLevelSchema,
  overall: confidenceLevelSchema,
  notes: z.array(z.string()),
});

/** Complete analysis result Zod schema */
export const analysisResultSchema = z.object({
  summary: z.string(),
  designAudit: designAuditSchema,
  systemInference: systemInferenceSchema,
  architectureDiagram: z.string(),
  implementationNotes: implementationNotesSchema,
  confidence: confidenceInfoSchema,
  warnings: z.array(z.string()),
});

/** Type inferred from Zod schema (should match AnalysisResult type) */
export type ValidatedAnalysisResult = z.infer<typeof analysisResultSchema>;

/**
 * Validate AI response JSON against the schema.
 * Returns the validated result or null if validation fails.
 */
export function validateAnalysisResult(data: unknown): {
  success: boolean;
  data?: ValidatedAnalysisResult;
  errors?: z.ZodError;
} {
  const result = analysisResultSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}
