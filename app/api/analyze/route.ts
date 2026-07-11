// ============================================================================
// Analysis API Route — POST /api/analyze
// Receives image + API key, returns validated AnalysisResult
// Strictly tied to Ollama Cloud
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { analyzeScreenshot } from "@/lib/ai/client";
import { logger } from "@/lib/utils/logger";

/** Request body shape */
interface AnalyzeRequestBody {
  image: string; // Base64 data URI
  apiKey?: string; // Optional: client-provided API key
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequestBody = await request.json();
    
    // Estimate image size in MB for logging
    const imageSizeMB = body.image ? (body.image.length * 0.75) / (1024 * 1024) : 0;
    
    logger.info("Analysis request started", { 
      imageSizeMB: imageSizeMB.toFixed(2)
    });

    // Validate required fields
    if (!body.image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    if (!body.apiKey) {
      return NextResponse.json(
        { error: "Ollama API Key is required." },
        { status: 401 }
      );
    }

    // Run the analysis through the unified AI client
    const result = await analyzeScreenshot({
      imageBase64: body.image,
      apiKey: body.apiKey,
    });

    logger.info("Analysis completed successfully");

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";

    logger.error("Analysis request failed", { error: message });

    // Determine appropriate status code
    const status = message.includes("API key") || message.includes("401") || message.includes("403") ? 401 : 
                   message.includes("timeout") ? 504 : 500;

    return NextResponse.json(
      { success: false, error: message },
      { status }
    );
  }
}
