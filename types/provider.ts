// ============================================================================
// Provider Types — Defines the unified provider abstraction layer
// ============================================================================

/** Supported AI providers */
export type ProviderID = "ollama" | "openrouter";

/** Model capability tags from PRD Section 15 */
export type ModelCapability =
  | "vision"
  | "text"
  | "structured-json"
  | "fast"
  | "high-quality"
  | "budget";

/** Single model configuration */
export interface ModelConfig {
  /** Unique model identifier (e.g., "gemma4:31b-cloud") */
  id: string;
  /** Human-readable display name */
  name: string;
  /** Which provider this model belongs to */
  provider: ProviderID;
  /** Model capabilities */
  capabilities: ModelCapability[];
  /** Whether this model supports vision/image input */
  supportsVision: boolean;
  /** Whether this model supports structured JSON output */
  supportsJSON: boolean;
  /** Optional description */
  description?: string;
}

/** Provider configuration */
export interface ProviderConfig {
  /** Provider identifier */
  id: ProviderID;
  /** Human-readable name */
  name: string;
  /** Base URL for the API */
  baseUrl: string;
  /** Whether an API key is required */
  requiresApiKey: boolean;
  /** Default API key placeholder (e.g., "ollama" for Ollama) */
  defaultApiKey?: string;
}

/** OpenAI-compatible chat message */
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string | ChatMessageContent[];
}

/** Multi-part message content (for vision) */
export type ChatMessageContent =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

/** OpenAI-compatible chat completion request */
export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: "json_object" };
  stream?: boolean;
}

/** OpenAI-compatible chat completion response */
export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/** AI request options passed from the application layer */
export interface AIRequestOptions {
  provider: ProviderID;
  model: string;
  apiKey?: string;
}

/** Unified error from any provider */
export interface AIError {
  code: number;
  message: string;
  provider: ProviderID;
  retryable: boolean;
}
