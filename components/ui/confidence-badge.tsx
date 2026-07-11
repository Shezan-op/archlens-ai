"use client";

import type { ConfidenceLevel } from "@/types/analysis";
import { cn } from "@/lib/utils/cn";

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  label?: string;
  size?: "sm" | "md";
}

const styles: Record<ConfidenceLevel, { bg: string; text: string; label: string }> = {
  high: {
    bg: "var(--success-muted)",
    text: "var(--success)",
    label: "High",
  },
  medium: {
    bg: "var(--warning-muted)",
    text: "var(--warning)",
    label: "Medium",
  },
  low: {
    bg: "var(--error-muted)",
    text: "var(--error)",
    label: "Low",
  },
};

export function ConfidenceBadge({ level, label, size = "sm" }: ConfidenceBadgeProps) {
  const style = styles[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
      style={{
        backgroundColor: style.bg,
        color: style.text,
      }}
    >
      <span
        className={cn(
          "rounded-full",
          size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2"
        )}
        style={{ backgroundColor: style.text }}
      />
      {label || style.label}
    </span>
  );
}
