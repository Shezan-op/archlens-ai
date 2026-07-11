// ============================================================================
// Ollama Configuration
// Centralized configuration for the Ollama Cloud integration
// ============================================================================

export const ollamaConfig = {
  /** The base URL for the Ollama API as per spec */
  baseUrl: "https://ollama.com/api",
  
  /** The specific endpoint for chat completions */
  chatEndpoint: "/chat",
  
  /** The primary model to use */
  primaryModel: "gemma3:12b-cloud",
  
  /** Fallback models in order of preference if the primary model fails */
  fallbackModels: [
    "gemma3:27b-cloud",
    "gemma3:4b-cloud"
  ],
  
  /** Request timeout in milliseconds */
  timeoutMs: 120000,
  
  /** Number of times to retry on transient failures */
  maxRetries: 2,
  
  /** Maximum allowed upload size in MB */
  maxUploadSizeMB: 5,
};
