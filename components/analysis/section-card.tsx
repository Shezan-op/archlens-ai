"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface SectionCardProps {
  children: ReactNode;
  delay?: number;
}

/**
 * Reusable section card wrapper for report sections.
 * Provides consistent styling and fade-in animation.
 */
export function SectionCard({ children, delay = 0 }: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="rounded-xl border p-6"
      style={{
        borderColor: "var(--border-default)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      {children}
    </motion.div>
  );
}
