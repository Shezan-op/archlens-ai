"use client";

import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function SectionHeader({
  title,
  description,
  icon,
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-start justify-between">
      <div className="flex items-start gap-3">
        {icon && (
          <div
            className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md"
            style={{ backgroundColor: "var(--bg-elevated)" }}
          >
            {icon}
          </div>
        )}
        <div>
          <h3
            className="font-heading text-base font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h3>
          {description && (
            <p
              className="mt-0.5 text-sm"
              style={{ color: "var(--text-tertiary)" }}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
