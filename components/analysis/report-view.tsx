"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  FileText,
  Palette,
  Server,
  GitBranch,
  Wrench,
  Shield,
  AlertTriangle,
  Sparkles,
  Layout,
  Type,
  Layers,
  Zap,
  Eye,
  Database,
  Globe,
  Lock,
  HardDrive,
  Radio,
  Search,
  Cloud,
} from "lucide-react";
import mermaid from "mermaid";
import type { AnalysisResult, ReportMetadata } from "@/types/analysis";
import { SectionCard } from "./section-card";
import { SectionHeader } from "@/components/ui/section-header";
import { ConfidenceBadge } from "@/components/ui/confidence-badge";
import { MetricChip } from "@/components/ui/metric-chip";
import { ExportMenu } from "@/components/controls/export-menu";
import { generateMarkdownReport } from "@/lib/export/markdown-generator";

interface ReportViewProps {
  result: AnalysisResult;
  metadata: ReportMetadata;
}

export function ReportView({ result, metadata }: ReportViewProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const markdownContent = generateMarkdownReport(result, metadata);

  // Initialize and render Mermaid diagram
  const renderMermaid = useCallback(async () => {
    if (!mermaidRef.current || !result.architectureDiagram) return;
    
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      themeVariables: {
        primaryColor: "#27272a",
        primaryTextColor: "#fafafa",
        primaryBorderColor: "#3f3f46",
        lineColor: "#71717a",
        secondaryColor: "#18181b",
        tertiaryColor: "#09090b",
      },
    });

    try {
      const { svg } = await mermaid.render(
        "arch-diagram",
        result.architectureDiagram
      );
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = svg;
      }
    } catch (err) {
      console.warn("Mermaid render failed:", err);
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = `<pre style="color: var(--text-tertiary); font-size: 0.75rem; white-space: pre-wrap;">${result.architectureDiagram}</pre>`;
      }
    }
  }, [result.architectureDiagram]);

  useEffect(() => {
    renderMermaid();
  }, [renderMermaid]);

  const { designAudit: da, systemInference: si, implementationNotes: impl } = result;

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
              <ConfidenceBadge level={result.confidence.overall} size="md" />
            </div>
            <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
              {metadata.analysisDate} • {metadata.provider} • {metadata.model}
            </p>
          </div>
          <ExportMenu markdownContent={markdownContent} fileName={metadata.projectName.toLowerCase().replace(/\s+/g, "-")} />
        </div>
      </SectionCard>

      {/* Executive Summary */}
      <SectionCard delay={0.05}>
        <SectionHeader
          title="Executive Summary"
          icon={<FileText size={14} style={{ color: "var(--accent)" }} />}
        />
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {result.summary}
        </p>
      </SectionCard>

      {/* Design Audit */}
      <SectionCard delay={0.1}>
        <SectionHeader
          title="Design Audit"
          description="Visual style, components, and UX assessment"
          icon={<Palette size={14} style={{ color: "var(--accent)" }} />}
          action={<ConfidenceBadge level={result.confidence.design} />}
        />

        {/* Style */}
        <div className="mb-4">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            <span className="font-medium" style={{ color: "var(--text-primary)" }}>
              Visual Style:
            </span>{" "}
            {da.style}
          </p>
        </div>

        {/* Scores */}
        <div className="mb-5 flex flex-wrap gap-2">
          <MetricChip label="UX Score" value={da.uxScore} suffix="/10" />
          <MetricChip label="Accessibility" value={da.accessibilityScore} suffix="/10" />
        </div>

        {/* Color System */}
        <div className="mb-5">
          <div className="mb-2 flex items-center gap-2">
            <Palette size={12} style={{ color: "var(--text-tertiary)" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
              Color System
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(da.palette)
              .filter(([key]) => key !== "additionalColors")
              .map(([role, value]) => (
                <div
                  key={role}
                  className="flex items-center gap-2 rounded-md border px-3 py-1.5"
                  style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-primary)" }}
                >
                  <div
                    className="h-3 w-3 rounded-sm border"
                    style={{
                      backgroundColor: String(value).startsWith("#") ? String(value) : "var(--bg-elevated)",
                      borderColor: "var(--border-default)",
                    }}
                  />
                  <span className="text-xs capitalize" style={{ color: "var(--text-secondary)" }}>
                    {role}: {String(value)}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Typography */}
        <div className="mb-5">
          <div className="mb-2 flex items-center gap-2">
            <Type size={12} style={{ color: "var(--text-tertiary)" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
              Typography
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(da.typography).map(([key, value]) => (
              <div key={key} className="rounded-md px-3 py-2" style={{ backgroundColor: "var(--bg-primary)" }}>
                <span className="text-xs capitalize" style={{ color: "var(--text-tertiary)" }}>
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <p className="mt-0.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Layout & Spacing */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-md px-3 py-2" style={{ backgroundColor: "var(--bg-primary)" }}>
            <div className="mb-1 flex items-center gap-1.5">
              <Layout size={12} style={{ color: "var(--text-tertiary)" }} />
              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Layout</span>
            </div>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{da.layout}</p>
          </div>
          <div className="rounded-md px-3 py-2" style={{ backgroundColor: "var(--bg-primary)" }}>
            <div className="mb-1 flex items-center gap-1.5">
              <Layers size={12} style={{ color: "var(--text-tertiary)" }} />
              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Spacing</span>
            </div>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{da.spacing}</p>
          </div>
        </div>

        {/* Components */}
        {da.components.length > 0 && (
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-2">
              <Layers size={12} style={{ color: "var(--text-tertiary)" }} />
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                Components Detected
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {da.components.map((comp, i) => (
                <span
                  key={i}
                  className="rounded-md border px-2.5 py-1 text-xs"
                  style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}
                  title={comp.description}
                >
                  {comp.name}
                  {comp.count && comp.count > 1 && (
                    <span style={{ color: "var(--text-tertiary)" }}> ×{comp.count}</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quick Wins */}
        {da.quickWins.length > 0 && (
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={12} style={{ color: "var(--success)" }} />
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                Quick Wins
              </span>
            </div>
            <ul className="space-y-1">
              {da.quickWins.map((win, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <Zap size={10} className="mt-0.5 shrink-0" style={{ color: "var(--success)" }} />
                  {win}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Issues */}
        {da.issues.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle size={12} style={{ color: "var(--warning)" }} />
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                Issues
              </span>
            </div>
            <ul className="space-y-1">
              {da.issues.map((issue, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <AlertTriangle size={10} className="mt-0.5 shrink-0" style={{ color: "var(--warning)" }} />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}
      </SectionCard>

      {/* System Design Inference */}
      <SectionCard delay={0.15}>
        <SectionHeader
          title="System Design Inference"
          description="Probable backend architecture and services"
          icon={<Server size={14} style={{ color: "var(--accent)" }} />}
          action={<ConfidenceBadge level={result.confidence.system} />}
        />

        <div className="mb-4">
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
            Product Type
          </span>
          <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {si.productType}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Globe, label: "Frontend", value: si.frontend },
            { icon: Server, label: "Backend", value: si.backend },
            { icon: Database, label: "Database", value: si.database },
            { icon: Lock, label: "Auth", value: si.auth },
            { icon: HardDrive, label: "Storage", value: si.storage },
            { icon: Zap, label: "Cache", value: si.cache },
            { icon: Radio, label: "Realtime", value: si.realtime },
            { icon: Cloud, label: "Queues", value: si.queues },
            { icon: Search, label: "Search", value: si.search },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-md px-3 py-2"
              style={{ backgroundColor: "var(--bg-primary)" }}
            >
              <div className="mb-1 flex items-center gap-1.5">
                <Icon size={11} style={{ color: "var(--text-tertiary)" }} />
                <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {label}
                </span>
              </div>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {si.apis.length > 0 && (
          <div className="mt-4">
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
              APIs
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {si.apis.map((api, i) => (
                <span
                  key={i}
                  className="rounded-md border px-2 py-1 text-xs"
                  style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}
                >
                  {api}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="mt-3 text-xs" style={{ color: "var(--text-tertiary)" }}>
          <Eye size={10} className="mr-1 inline" />
          {si.scalingNotes}
        </p>
      </SectionCard>

      {/* Architecture Diagram */}
      <SectionCard delay={0.2}>
        <SectionHeader
          title="Architecture Diagram"
          description="Inferred system architecture"
          icon={<GitBranch size={14} style={{ color: "var(--accent)" }} />}
          action={<ConfidenceBadge level={result.confidence.architecture} />}
        />
        <div
          ref={mermaidRef}
          className="flex items-center justify-center overflow-x-auto rounded-lg p-4"
          style={{ backgroundColor: "var(--bg-primary)", minHeight: "200px" }}
        />
      </SectionCard>

      {/* Implementation Notes */}
      <SectionCard delay={0.25}>
        <SectionHeader
          title="Build Plan"
          description="Practical implementation guide"
          icon={<Wrench size={14} style={{ color: "var(--accent)" }} />}
        />

        <div className="mb-4 flex flex-wrap gap-2">
          <MetricChip label="Complexity" value={impl.estimatedComplexity} />
        </div>

        <p className="mb-4 text-sm" style={{ color: "var(--text-secondary)" }}>
          <span className="font-medium" style={{ color: "var(--text-primary)" }}>
            Recommended Stack:
          </span>{" "}
          {impl.recommendedStack}
        </p>

        {/* Build Order */}
        <div className="mb-4">
          <span className="mb-2 block text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
            Build Order
          </span>
          <ol className="space-y-1.5">
            {impl.buildOrder.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium"
                  style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-tertiary)" }}
                >
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Major Modules */}
        <div className="mb-4">
          <span className="mb-2 block text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
            Major Modules
          </span>
          <div className="flex flex-wrap gap-1.5">
            {impl.majorModules.map((mod, i) => (
              <span
                key={i}
                className="rounded-md border px-2.5 py-1 text-xs"
                style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}
              >
                {mod}
              </span>
            ))}
          </div>
        </div>

        {/* Risks */}
        {impl.risks.length > 0 && (
          <div>
            <span className="mb-2 block text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
              Risks
            </span>
            <ul className="space-y-1">
              {impl.risks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <AlertTriangle size={10} className="mt-0.5 shrink-0" style={{ color: "var(--warning)" }} />
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        )}
      </SectionCard>

      {/* Confidence & Limitations */}
      <SectionCard delay={0.3}>
        <SectionHeader
          title="Confidence & Limitations"
          description="Analysis is inferred, not verified"
          icon={<Shield size={14} style={{ color: "var(--accent)" }} />}
        />

        <div className="mb-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Design:</span>
            <ConfidenceBadge level={result.confidence.design} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>System:</span>
            <ConfidenceBadge level={result.confidence.system} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Architecture:</span>
            <ConfidenceBadge level={result.confidence.architecture} />
          </div>
        </div>

        {result.confidence.notes.length > 0 && (
          <div className="space-y-1.5">
            {result.confidence.notes.map((note, i) => (
              <p key={i} className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                • {note}
              </p>
            ))}
          </div>
        )}

        {result.warnings.length > 0 && (
          <div
            className="mt-4 rounded-lg p-3"
            style={{ backgroundColor: "var(--warning-muted)" }}
          >
            <div className="mb-1.5 flex items-center gap-1.5">
              <AlertTriangle size={12} style={{ color: "var(--warning)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--warning)" }}>
                Warnings
              </span>
            </div>
            <ul className="space-y-1">
              {result.warnings.map((warning, i) => (
                <li key={i} className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
