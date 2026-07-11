"use client";

import { siteConfig } from "@/config/site";
import { Hexagon, Settings, Code } from "lucide-react";
import { motion } from "framer-motion";

interface HeaderProps {
  onSettingsClick?: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 border-b"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: "rgba(9, 9, 11, 0.8)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo + Name */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: "var(--accent-muted)" }}
          >
            <Hexagon
              size={18}
              style={{ color: "var(--accent)" }}
              strokeWidth={2.5}
            />
          </div>
          <span
            className="font-heading text-base font-semibold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {siteConfig.name}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors"
            style={{ color: "var(--text-tertiary)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-tertiary)")
            }
            aria-label="View on GitHub"
          >
            <Code size={16} />
          </a>
          <button
            onClick={onSettingsClick}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors"
            style={{ color: "var(--text-tertiary)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-tertiary)")
            }
            aria-label="Open settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
