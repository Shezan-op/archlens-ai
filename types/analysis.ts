// ============================================================================
// Analysis Types — Structured output schema from PRD Section 13
// ============================================================================

/** Confidence level for inferred analysis */
export type ConfidenceLevel = "high" | "medium" | "low";

/** Color information detected in the UI */
export interface ColorInfo {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  additionalColors?: string[];
}

/** Typography information */
export interface TypographyInfo {
  headingStyle: string;
  bodyStyle: string;
  hierarchy: string;
  readability: string;
}

/** Single UI component detected */
export interface DetectedComponent {
  name: string;
  count?: number;
  description: string;
}

/** Design audit section — PRD Section 12B */
export interface DesignAudit {
  style: string;
  palette: ColorInfo;
  typography: TypographyInfo;
  spacing: string;
  components: DetectedComponent[];
  layout: string;
  uxScore: number;
  accessibilityScore: number;
  quickWins: string[];
  issues: string[];
}

/** System architecture inference — PRD Section 12C */
export interface SystemInference {
  productType: string;
  frontend: string;
  backend: string;
  database: string;
  auth: string;
  storage: string;
  cache: string;
  realtime: string;
  queues: string;
  search: string;
  apis: string[];
  scalingNotes: string;
}

/** Implementation notes — PRD Section 12E */
export interface ImplementationNotes {
  buildOrder: string[];
  majorModules: string[];
  estimatedComplexity: "low" | "medium" | "high" | "very-high";
  risks: string[];
  recommendedStack: string;
}

/** Per-section confidence levels — PRD Section 18 */
export interface ConfidenceInfo {
  design: ConfidenceLevel;
  system: ConfidenceLevel;
  architecture: ConfidenceLevel;
  overall: ConfidenceLevel;
  notes: string[];
}

/** Complete analysis result — PRD Section 13 top-level schema */
export interface AnalysisResult {
  summary: string;
  designAudit: DesignAudit;
  systemInference: SystemInference;
  architectureDiagram: string;
  implementationNotes: ImplementationNotes;
  confidence: ConfidenceInfo;
  warnings: string[];
}

/** Report metadata attached to the final output */
export interface ReportMetadata {
  projectName: string;
  analysisDate: string;
  provider: string;
  model: string;
  confidenceLevel: ConfidenceLevel;
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
