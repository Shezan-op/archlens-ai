"use client";

import {
  FileText,
  AlertTriangle,
  Layers,
  Type,
  Zap,
} from "lucide-react";
import type { AnalysisResult, ReportMetadata } from "@/types/analysis";
import { SectionCard } from "./section-card";
import { SectionHeader } from "@/components/ui/section-header";
import { ExportMenu } from "@/components/controls/export-menu";
import { generateMarkdownReport } from "@/lib/export/markdown-generator";

interface ReportViewProps {
  result: AnalysisResult;
  metadata: ReportMetadata;
}

export function ReportView({ result, metadata }: ReportViewProps) {
  const markdownContent = generateMarkdownReport(result, metadata);

  // Helper to format confidence
  const formatConfidence = (val: number) => {
    return `${(val * 100).toFixed(0)}%`;
  };

  return (
    <div className="space-y-4">
      {/* Report Header */}
      <SectionCard delay={0}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2
                className="font-heading text-xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {metadata.projectName}
              </h2>
              <div 
                className="rounded-full px-2 py-0.5 text-xs font-semibold"
                style={{ backgroundColor: "var(--accent-muted)", color: "var(--accent)" }}
              >
                {formatConfidence(metadata.confidenceLevel)} Confidence
              </div>
            </div>
            <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
              {metadata.analysisDate} • {metadata.provider} • {metadata.model}
            </p>
          </div>
          <ExportMenu markdownContent={markdownContent} fileName={metadata.projectName.toLowerCase().replace(/\s+/g, "-")} />
        </div>
      </SectionCard>

      {/* Summary */}
      <SectionCard delay={0.05}>
        <SectionHeader
          title="Summary"
          icon={<FileText size={14} style={{ color: "var(--accent)" }} />}
        />
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {result.summary}
        </p>
      </SectionCard>

      {/* Important UI Elements */}
      {result.importantUIElements?.length > 0 && (
        <SectionCard delay={0.1}>
          <SectionHeader
            title="Important UI Elements"
            icon={<Layers size={14} style={{ color: "var(--accent)" }} />}
          />
          <div className="flex flex-wrap gap-2">
            {result.importantUIElements.map((el, i) => (
              <span
                key={i}
                className="rounded-md border px-2.5 py-1 text-xs"
                style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)", backgroundColor: "var(--bg-primary)" }}
              >
                {el}
              </span>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Detected Text */}
      {result.detectedText?.length > 0 && (
        <SectionCard delay={0.15}>
          <SectionHeader
            title="Detected Text"
            icon={<Type size={14} style={{ color: "var(--accent)" }} />}
          />
          <ul className="space-y-1.5">
            {result.detectedText.map((text, i) => (
              <li key={i} className="text-sm" style={{ color: "var(--text-secondary)" }}>
                "{text}"
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Problems Found */}
      {result.problemsFound?.length > 0 && (
        <SectionCard delay={0.2}>
          <SectionHeader
            title="Problems Found"
            icon={<AlertTriangle size={14} style={{ color: "var(--warning)" }} />}
          />
          <ul className="space-y-1.5">
            {result.problemsFound.map((problem, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <AlertTriangle size={14} className="mt-0.5 shrink-0" style={{ color: "var(--warning)" }} />
                {problem}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Recommended Action */}
      {result.recommendedUserAction && (
        <SectionCard delay={0.25}>
          <SectionHeader
            title="Recommended Next Action"
            icon={<Zap size={14} style={{ color: "var(--success)" }} />}
          />
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {result.recommendedUserAction}
          </p>
        </SectionCard>
      )}
    </div>
  );
}
