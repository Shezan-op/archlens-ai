"use client";

interface MetricChipProps {
  label: string;
  value: string | number;
  suffix?: string;
}

export function MetricChip({ label, value, suffix }: MetricChipProps) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-lg border px-3 py-2"
      style={{
        borderColor: "var(--border-default)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </span>
      <span
        className="font-heading text-sm font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        {value}
        {suffix && (
          <span style={{ color: "var(--text-tertiary)" }}>{suffix}</span>
        )}
      </span>
    </div>
  );
}
