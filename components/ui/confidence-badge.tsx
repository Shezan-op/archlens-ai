"use client";

import { cn } from "@/lib/utils/cn";

interface ConfidenceBadgeProps {
  level: number;
  label?: string;
  size?: "sm" | "md";
}

export function ConfidenceBadge({ level, label, size = "sm" }: ConfidenceBadgeProps) {
  let style = {
    bg: "var(--success-muted)",
    text: "var(--success)",
    label: "High",
  };

  if (level < 0.7) {
    style = {
      bg: "var(--error-muted)",
      text: "var(--error)",
      label: "Low",
    };
  } else if (level < 0.9) {
    style = {
      bg: "var(--warning-muted)",
      text: "var(--warning)",
      label: "Medium",
    };
  }

  const defaultLabel = `${(level * 100).toFixed(0)}%`;

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
      {label || defaultLabel}
    </span>
  );
}
