"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import type { LoadingStage } from "@/types/analysis";

interface AnalysisLoadingProps {
  stages: LoadingStage[];
  currentStageIndex: number;
}

/**
 * Multi-stage loading display — PRD Section 11, Screen 3
 * Shows meaningful progress labels. No fake percentages.
 */
export function AnalysisLoading({
  stages,
  currentStageIndex,
}: AnalysisLoadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-md rounded-xl border p-8"
      style={{
        borderColor: "var(--border-default)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      <div className="mb-6 text-center">
        <motion.div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--accent-muted)" }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Loader2
            size={24}
            style={{ color: "var(--accent)" }}
            className="animate-spin"
          />
        </motion.div>
        <h3
          className="font-heading text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Analyzing Screenshot
        </h3>
        <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
          This typically takes 15-30 seconds
        </p>
      </div>

      <div className="space-y-3">
        {stages.map((stage, index) => {
          const isActive = index === currentStageIndex;
          const isComplete = index < currentStageIndex;
          const isPending = index > currentStageIndex;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              {/* Status icon */}
              <div className="flex h-6 w-6 items-center justify-center">
                {isComplete ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ backgroundColor: "var(--success)" }}
                  >
                    <Check size={12} color="white" strokeWidth={3} />
                  </motion.div>
                ) : isActive ? (
                  <motion.div
                    className="h-5 w-5 rounded-full border-2"
                    style={{ borderColor: "var(--accent)" }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                  >
                    <div
                      className="h-full w-full rounded-full"
                      style={{ backgroundColor: "var(--accent-muted)" }}
                    />
                  </motion.div>
                ) : (
                  <div
                    className="h-5 w-5 rounded-full border"
                    style={{ borderColor: "var(--border-default)" }}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className="text-sm"
                style={{
                  color: isComplete
                    ? "var(--text-secondary)"
                    : isActive
                      ? "var(--text-primary)"
                      : "var(--text-tertiary)",
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {stage.label}
                {isActive && (
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    ...
                  </motion.span>
                )}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/** Default loading stages per PRD */
export const defaultLoadingStages: LoadingStage[] = [
  { id: "read", label: "Reading interface", completed: false },
  { id: "detect", label: "Detecting components", completed: false },
  { id: "infer", label: "Inferring architecture", completed: false },
  { id: "generate", label: "Generating report", completed: false },
  { id: "finalize", label: "Finalizing analysis", completed: false },
];
