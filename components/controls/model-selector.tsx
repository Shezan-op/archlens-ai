"use client";

import { ChevronDown, Cpu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ModelConfig } from "@/types/provider";

interface ModelSelectorProps {
  models: ModelConfig[];
  value: string;
  onChange: (modelId: string) => void;
}

export function ModelSelector({ models, value, onChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedModel = models.find((m) => m.id === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-left transition-colors"
        style={{
          borderColor: isOpen ? "var(--accent)" : "var(--border-default)",
          backgroundColor: "var(--bg-surface)",
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-2.5">
          <Cpu size={14} style={{ color: "var(--text-tertiary)" }} />
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {selectedModel?.name || "Select model"}
            </p>
            {selectedModel?.description && (
              <p
                className="text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                {selectedModel.description}
              </p>
            )}
          </div>
        </div>
        <ChevronDown
          size={14}
          style={{
            color: "var(--text-tertiary)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms",
          }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border shadow-lg"
            style={{
              borderColor: "var(--border-default)",
              backgroundColor: "var(--bg-surface)",
              boxShadow: "var(--shadow-lg)",
            }}
            role="listbox"
          >
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onChange(model.id);
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors"
                style={{
                  backgroundColor:
                    value === model.id
                      ? "var(--accent-muted)"
                      : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (value !== model.id) {
                    e.currentTarget.style.backgroundColor =
                      "var(--bg-elevated)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (value !== model.id) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
                role="option"
                aria-selected={value === model.id}
              >
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {model.name}
                  </p>
                  {model.description && (
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {model.description}
                    </p>
                  )}
                </div>
                {model.supportsVision && (
                  <span
                    className="ml-auto whitespace-nowrap rounded-full px-2 py-0.5 text-xs"
                    style={{
                      backgroundColor: "var(--accent-muted)",
                      color: "var(--accent)",
                    }}
                  >
                    vision
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
