// ============================================================================
// Analysis Types — Structured output schema matching Ollama Spec
// ============================================================================

export interface AnalysisConfidence {
  overall: number;
}

/** Complete analysis result */
export interface AnalysisResult {
  summary: string;
  detectedText: string[];
  importantUIElements: string[];
  problemsFound: string[];
  recommendedUserAction: string;
  confidence: AnalysisConfidence;
}

/** Report metadata attached to the final output */
export interface ReportMetadata {
  projectName: string;
  analysisDate: string;
  provider: string;
  model: string;
  confidenceLevel: number;
}

/** Application-level analysis state */
export type AnalysisStatus =
  | "idle"
  | "uploading"
  | "analyzing"
  | "complete"
  | "error";

/** Loading stage shown during analysis */
export interface LoadingStage {
  id: string;
  label: string;
  completed: boolean;
}
