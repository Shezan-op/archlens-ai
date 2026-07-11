// ============================================================================
// Image Utilities — Compression, validation, and base64 conversion
// PRD: "Compress images before upload" for Vercel serverless payload limits
// ============================================================================

import { siteConfig } from "@/config/site";

/**
 * Validate an image file before processing.
 * Returns an error message or null if valid.
 */
export function validateImageFile(file: File): string | null {
  if (!file) return "No file selected";

  if (!siteConfig.supportedImageTypes.includes(file.type as typeof siteConfig.supportedImageTypes[number])) {
    return `Unsupported file type: ${file.type}. Please use PNG, JPEG, WebP, or GIF.`;
  }

  if (file.size > siteConfig.maxImageSize) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return `File too large (${sizeMB}MB). Maximum size is ${siteConfig.maxImageSize / (1024 * 1024)}MB.`;
  }

  return null;
}

/**
 * Compress and convert an image file to a base64 data URI.
 * Resizes large images to stay within Vercel payload limits.
 */
export async function compressImageToBase64(file: File): Promise<{
  base64: string;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Scale down if too large
        if (width > siteConfig.maxCompressedWidth) {
          const ratio = siteConfig.maxCompressedWidth / width;
          width = siteConfig.maxCompressedWidth;
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL("image/jpeg", siteConfig.compressionQuality);

        // Estimate compressed size from base64 length
        const compressedSize = Math.round((base64.length * 3) / 4);

        resolve({
          base64,
          width,
          height,
          originalSize: file.size,
          compressedSize,
        });
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Format file size for display.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
