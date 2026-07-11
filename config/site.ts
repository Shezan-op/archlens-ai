// ============================================================================
// Site Configuration — Branding, metadata, and constants
// ============================================================================

export const siteConfig = {
  name: "ArchLens AI",
  tagline: "Upload a screenshot. Get a design audit, system architecture guess, and implementation notes.",
  description:
    "AI-powered screenshot analysis tool that produces design audits, system architecture inference, and exportable implementation reports.",
  url: "https://archlens-ai.vercel.app",
  github: "https://github.com/Shezan-op/archlens-ai",

  /** Maximum image file size in bytes (10MB) */
  maxImageSize: 10 * 1024 * 1024,

  /** Supported image MIME types */
  supportedImageTypes: [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
  ] as const,

  /** Minimum image dimensions for quality analysis */
  minImageDimension: 200,

  /** Image compression quality (0-1) for client-side compression */
  compressionQuality: 0.85,

  /** Maximum compressed image width */
  maxCompressedWidth: 2048,
} as const;
