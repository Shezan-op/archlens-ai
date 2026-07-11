"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface ErrorCardProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorCard({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border p-6 text-center"
      style={{
        borderColor: "var(--border-default)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      <div
        className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: "var(--error-muted)" }}
      >
        <AlertCircle size={24} style={{ color: "var(--error)" }} />
      </div>
      <h3
        className="font-heading text-base font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>
      <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          style={{
            backgroundColor: "var(--bg-elevated)",
            color: "var(--text-primary)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--bg-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")
          }
        >
          <RefreshCw size={14} />
          Try again
        </button>
      )}
    </motion.div>
  );
}
