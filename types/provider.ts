// ============================================================================
// Ollama Types
// ============================================================================

/** Ollama Native Chat Message */
export interface OllamaChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
  images?: string[]; // Base64 encoded images
}

/** Ollama Native Request Schema for /api/chat */
export interface OllamaChatRequest {
  model: string;
  messages: OllamaChatMessage[];
  format?: "json" | object;
  stream?: boolean;
}

/** Ollama Native Response Schema for /api/chat */
export interface OllamaChatResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
  total_duration?: number;
  prompt_eval_duration?: number;
  eval_duration?: number;
}
