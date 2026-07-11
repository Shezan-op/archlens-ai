"use client";

import { useCallback, useState } from "react";
import { Upload, ImagePlus, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { validateImageFile, compressImageToBase64, formatFileSize } from "@/lib/utils/image";

interface UploadZoneProps {
  onImageReady: (data: {
    base64: string;
    fileName: string;
    fileSize: number;
    width: number;
    height: number;
  }) => void;
  disabled?: boolean;
}

export function UploadZone({ onImageReady, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      const validationError = validateImageFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setIsProcessing(true);
      try {
        const result = await compressImageToBase64(file);
        onImageReady({
          base64: result.base64,
          fileName: file.name,
          fileSize: file.size,
          width: result.width,
          height: result.height,
        });
      } catch {
        setError("Failed to process image. Please try a different file.");
      } finally {
        setIsProcessing(false);
      }
    },
    [onImageReady]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) processFile(file);
          return;
        }
      }
    },
    [processFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      e.target.value = "";
    },
    [processFile]
  );

  return (
    <div onPaste={handlePaste}>
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className="relative cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all"
        style={{
          borderColor: isDragging ? "var(--accent)" : "var(--border-default)",
          backgroundColor: isDragging
            ? "var(--accent-muted)"
            : "var(--bg-surface)",
        }}
        whileHover={{ scale: disabled ? 1 : 1.005 }}
        whileTap={{ scale: disabled ? 1 : 0.995 }}
        onClick={() => {
          if (!disabled) document.getElementById("file-input")?.click();
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload screenshot for analysis"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            document.getElementById("file-input")?.click();
          }
        }}
      >
        <input
          id="file-input"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleFileInput}
          disabled={disabled}
        />

        <div className="flex flex-col items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl"
            style={{
              backgroundColor: isDragging
                ? "var(--accent)"
                : "var(--bg-elevated)",
            }}
          >
            {isProcessing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Upload
                  size={24}
                  style={{
                    color: isDragging
                      ? "var(--text-inverse)"
                      : "var(--text-secondary)",
                  }}
                />
              </motion.div>
            ) : (
              <ImagePlus
                size={24}
                style={{
                  color: isDragging
                    ? "var(--text-inverse)"
                    : "var(--text-secondary)",
                }}
              />
            )}
          </div>

          <div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {isProcessing
                ? "Processing image..."
                : "Drop a screenshot here, paste, or click to browse"}
            </p>
            <p
              className="mt-1 text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              PNG, JPEG, WebP • Max 10MB
            </p>
          </div>
        </div>
      </motion.div>

      {/* Error display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
            style={{
              backgroundColor: "var(--error-muted)",
              color: "var(--error)",
            }}
          >
            <AlertCircle size={14} />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto"
              aria-label="Dismiss error"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
