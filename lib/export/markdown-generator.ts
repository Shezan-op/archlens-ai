// ============================================================================
// Markdown Generator — Compiles validated AnalysisResult into clean Markdown
// Generated AFTER Zod validation, never before (PRD JSON-First rule)
// ============================================================================

import type { AnalysisResult } from "@/types/analysis";
import type { ReportMetadata } from "@/types/analysis";

/**
 * Generate a complete Markdown report from validated analysis data.
 */
export function generateMarkdownReport(
  result: AnalysisResult,
  metadata: ReportMetadata
): string {
  const lines: string[] = [];

  // Header
  lines.push(`# ${metadata.projectName} — ArchLens AI Analysis`);
  lines.push("");
  lines.push(`**Date:** ${metadata.analysisDate}`);
  lines.push(`**Provider:** ${metadata.provider}`);
  lines.push(`**Model:** ${metadata.model}`);
  lines.push(`**Confidence:** ${metadata.confidenceLevel}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // Executive Summary
  lines.push("## Executive Summary");
  lines.push("");
  lines.push(result.summary);
  lines.push("");

  // Design Audit
  lines.push("## Design Audit");
  lines.push("");
  lines.push(`**Visual Style:** ${result.designAudit.style}`);
  lines.push("");

  lines.push("### Color System");
  lines.push("");
  const { palette } = result.designAudit;
  lines.push(`| Role | Value |`);
  lines.push(`|------|-------|`);
  lines.push(`| Primary | ${palette.primary} |`);
  lines.push(`| Secondary | ${palette.secondary} |`);
  lines.push(`| Accent | ${palette.accent} |`);
  lines.push(`| Background | ${palette.background} |`);
  lines.push(`| Text | ${palette.text} |`);
  lines.push("");

  lines.push("### Typography");
  lines.push("");
  const { typography } = result.designAudit;
  lines.push(`- **Headings:** ${typography.headingStyle}`);
  lines.push(`- **Body:** ${typography.bodyStyle}`);
  lines.push(`- **Hierarchy:** ${typography.hierarchy}`);
  lines.push(`- **Readability:** ${typography.readability}`);
  lines.push("");

  lines.push(`**Spacing:** ${result.designAudit.spacing}`);
  lines.push("");
  lines.push(`**Layout:** ${result.designAudit.layout}`);
  lines.push("");

  lines.push("### UI Components Detected");
  lines.push("");
  lines.push("| Component | Count | Description |");
  lines.push("|-----------|-------|-------------|");
  for (const comp of result.designAudit.components) {
    lines.push(`| ${comp.name} | ${comp.count ?? "—"} | ${comp.description} |`);
  }
  lines.push("");

  lines.push("### Scores");
  lines.push("");
  lines.push(`- **UX Score:** ${result.designAudit.uxScore}/10`);
  lines.push(`- **Accessibility Score:** ${result.designAudit.accessibilityScore}/10`);
  lines.push("");

  if (result.designAudit.quickWins.length > 0) {
    lines.push("### Quick Wins");
    lines.push("");
    for (const win of result.designAudit.quickWins) {
      lines.push(`- ${win}`);
    }
    lines.push("");
  }

  if (result.designAudit.issues.length > 0) {
    lines.push("### Issues");
    lines.push("");
    for (const issue of result.designAudit.issues) {
      lines.push(`- ${issue}`);
    }
    lines.push("");
  }

  // System Design Inference
  lines.push("## System Design Inference");
  lines.push("");
  const sys = result.systemInference;
  lines.push(`**Product Type:** ${sys.productType}`);
  lines.push("");
  lines.push("| Aspect | Inference |");
  lines.push("|--------|-----------|");
  lines.push(`| Frontend | ${sys.frontend} |`);
  lines.push(`| Backend | ${sys.backend} |`);
  lines.push(`| Database | ${sys.database} |`);
  lines.push(`| Auth | ${sys.auth} |`);
  lines.push(`| Storage | ${sys.storage} |`);
  lines.push(`| Cache | ${sys.cache} |`);
  lines.push(`| Realtime | ${sys.realtime} |`);
  lines.push(`| Queues | ${sys.queues} |`);
  lines.push(`| Search | ${sys.search} |`);
  lines.push("");

  if (sys.apis.length > 0) {
    lines.push("### APIs");
    lines.push("");
    for (const api of sys.apis) {
      lines.push(`- ${api}`);
    }
    lines.push("");
  }

  lines.push(`**Scaling Notes:** ${sys.scalingNotes}`);
  lines.push("");

  // Architecture Diagram
  lines.push("## Architecture Diagram");
  lines.push("");
  lines.push("```mermaid");
  lines.push(result.architectureDiagram);
  lines.push("```");
  lines.push("");

  // Implementation Notes
  lines.push("## Build Plan");
  lines.push("");
  const impl = result.implementationNotes;
  lines.push(`**Estimated Complexity:** ${impl.estimatedComplexity}`);
  lines.push(`**Recommended Stack:** ${impl.recommendedStack}`);
  lines.push("");

  lines.push("### Build Order");
  lines.push("");
  impl.buildOrder.forEach((step, i) => {
    lines.push(`${i + 1}. ${step}`);
  });
  lines.push("");

  lines.push("### Major Modules");
  lines.push("");
  for (const mod of impl.majorModules) {
    lines.push(`- ${mod}`);
  }
  lines.push("");

  if (impl.risks.length > 0) {
    lines.push("### Risks");
    lines.push("");
    for (const risk of impl.risks) {
      lines.push(`- ⚠️ ${risk}`);
    }
    lines.push("");
  }

  // Confidence
  lines.push("## Confidence & Limitations");
  lines.push("");
  const conf = result.confidence;
  lines.push("| Area | Confidence |");
  lines.push("|------|------------|");
  lines.push(`| Design Analysis | ${conf.design} |`);
  lines.push(`| System Inference | ${conf.system} |`);
  lines.push(`| Architecture | ${conf.architecture} |`);
  lines.push(`| Overall | ${conf.overall} |`);
  lines.push("");

  if (conf.notes.length > 0) {
    for (const note of conf.notes) {
      lines.push(`> ${note}`);
    }
    lines.push("");
  }

  // Warnings
  if (result.warnings.length > 0) {
    lines.push("## Warnings");
    lines.push("");
    for (const warning of result.warnings) {
      lines.push(`- ⚠️ ${warning}`);
    }
    lines.push("");
  }

  // Footer
  lines.push("---");
  lines.push("");
  lines.push("*Generated by [ArchLens AI](https://github.com/Shezan-op/archlens-ai) — Screenshot Intelligence Tool*");

  return lines.join("\n");
}
