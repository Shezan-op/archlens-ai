// ============================================================================
// Analysis API Route — POST /api/analyze
// Receives image + provider + model, returns validated AnalysisResult
// This is the ONLY server-side code that touches AI providers
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { analyzeScreenshot } from "@/lib/ai/client";
import type { ProviderID } from "@/types/provider";
import { logger } from "@/lib/utils/logger";

/** Request body shape */
interface AnalyzeRequestBody {
  image: string; // Base64 data URI
  provider: ProviderID;
  model: string;
  fallbackModel?: string;
  apiKey?: string; // Optional: client-provided API key
  baseUrl?: string; // Optional: custom Base URL for local models
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequestBody = await request.json();
    
    // Estimate image size in MB for logging
    const imageSizeMB = body.image ? (body.image.length * 0.75) / (1024 * 1024) : 0;
    
    logger.info("Analysis request started", { 
      provider: body.provider, 
      model: body.model,
      imageSizeMB: imageSizeMB.toFixed(2)
    });

    // Validate required fields
    if (!body.image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    if (!body.provider || !["ollama", "openrouter"].includes(body.provider)) {
      return NextResponse.json(
        { error: "Invalid provider. Must be 'ollama' or 'openrouter'." },
        { status: 400 }
      );
    }

    if (!body.model) {
      return NextResponse.json(
        { error: "No model selected" },
        { status: 400 }
      );
    }

    // Run the analysis through the unified AI client
    const result = await analyzeScreenshot({
      imageBase64: body.image,
      provider: body.provider,
      model: body.model,
      fallbackModel: body.fallbackModel,
      apiKey: body.apiKey,
      baseUrl: body.baseUrl,
    });

    logger.info("Analysis completed successfully", { 
      provider: body.provider, 
      model: body.model 
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";

    logger.error("Analysis request failed", { error: message });

    // Determine appropriate status code
    const status = message.includes("API key") ? 401 : 
                   message.includes("timeout") ? 504 : 500;

    return NextResponse.json(
      { success: false, error: message },
      { status }
    );
  }
}

