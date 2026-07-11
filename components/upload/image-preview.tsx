"use client";

import Image from "next/image";
import { X, Replace, FileImage, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { formatFileSize } from "@/lib/utils/image";
import { siteConfig } from "@/config/site";

interface ImagePreviewProps {
  base64: string;
  fileName: string;
  fileSize: number;
  width: number;
  height: number;
  onRemove: () => void;
  onReplace: () => void;
}

export function ImagePreview({
  base64,
  fileName,
  fileSize,
  width,
  height,
  onRemove,
  onReplace,
}: ImagePreviewProps) {
  const isSmall =
    width < siteConfig.minImageDimension ||
    height < siteConfig.minImageDimension;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-xl border"
      style={{
        borderColor: "var(--border-default)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      {/* Image */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: "var(--bg-primary)",
          maxHeight: "320px",
        }}
      >
        <Image
          src={base64}
          alt="Screenshot preview"
          width={width}
          height={height}
          className="object-contain"
          style={{ maxHeight: "320px", width: "auto" }}
          unoptimized
        />
      </div>

      {/* Info bar */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <div className="flex items-center gap-3">
          <FileImage size={16} style={{ color: "var(--text-tertiary)" }} />
          <div>
            <p
              className="max-w-[200px] truncate text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {fileName}
            </p>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {formatFileSize(fileSize)} • {width}×{height}
            </p>
          </div>

          {isSmall && (
            <div
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs"
              style={{
                backgroundColor: "var(--warning-muted)",
                color: "var(--warning)",
              }}
            >
              <AlertTriangle size={12} />
              <span>Low resolution</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onReplace}
            className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors"
            style={{
              color: "var(--text-secondary)",
              backgroundColor: "var(--bg-elevated)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--bg-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")
            }
            aria-label="Replace image"
          >
            <Replace size={12} />
            Replace
          </button>
          <button
            onClick={onRemove}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors"
            style={{
              color: "var(--text-tertiary)",
              backgroundColor: "var(--bg-elevated)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--error-muted)";
              e.currentTarget.style.color = "var(--error)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-elevated)";
              e.currentTarget.style.color = "var(--text-tertiary)";
            }}
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
