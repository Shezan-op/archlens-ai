"use client";

import { Cloud, Globe } from "lucide-react";
import type { ProviderID } from "@/types/provider";
import { cn } from "@/lib/utils/cn";

interface ProviderSelectorProps {
  value: ProviderID;
  onChange: (provider: ProviderID) => void;
}

const providerOptions: {
  id: ProviderID;
  label: string;
  icon: typeof Cloud;
  description: string;
}[] = [
  {
    id: "ollama",
    label: "Ollama Cloud",
    icon: Cloud,
    description: "Free cloud models",
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    icon: Globe,
    description: "API key required",
  },
];

export function ProviderSelector({ value, onChange }: ProviderSelectorProps) {
  return (
    <div className="flex gap-2">
      {providerOptions.map((option) => {
        const isSelected = value === option.id;
        const Icon = option.icon;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex flex-1 items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all",
              isSelected
                ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                : "border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--text-tertiary)]"
            )}
            aria-pressed={isSelected}
          >
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md",
                isSelected
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-elevated)] text-[var(--text-tertiary)]"
              )}
            >
              <Icon size={16} />
            </div>
            <div>
              <p
                className="text-sm font-medium"
                style={{
                  color: isSelected
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                }}
              >
                {option.label}
              </p>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {option.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
