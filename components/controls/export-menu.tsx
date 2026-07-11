"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Copy, Check, ChevronDown, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ExportMenuProps {
  markdownContent: string;
  fileName?: string;
}

export function ExportMenu({
  markdownContent,
  fileName = "archlens-report",
}: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setIsOpen(false);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-9 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors"
        style={{
          borderColor: "var(--border-default)",
          backgroundColor: "var(--bg-surface)",
          color: "var(--text-secondary)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = "var(--text-tertiary)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = "var(--border-default)")
        }
      >
        <Download size={14} />
        Export
        <ChevronDown size={12} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-lg border shadow-lg"
            style={{
              borderColor: "var(--border-default)",
              backgroundColor: "var(--bg-surface)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <button
              onClick={handleCopy}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy to clipboard"}
            </button>
            <button
              onClick={handleDownload}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <FileText size={14} />
              Download .md
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
