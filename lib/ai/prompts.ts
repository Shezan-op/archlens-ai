// ============================================================================
// AI Prompts
// Structured prompts for the vision analysis models
// ============================================================================

export function getAnalysisPrompt(): string {
  return `Analyze this screenshot to infer the design and underlying system architecture.

Return a structured JSON response exactly matching this schema:
{
  "summary": "Short 3-5 line summary of what this UI represents",
  "designAudit": {
    "style": "Visual style description (e.g. Minimal, flat, brutalist)",
    "palette": {
      "primary": "Hex code or description",
      "secondary": "Hex code or description",
      "accent": "Hex code or description",
      "background": "Hex code or description",
      "text": "Hex code or description",
      "additionalColors": []
    },
    "typography": {
      "headingStyle": "Guess at font family or style for headings",
      "bodyStyle": "Guess at font family or style for body",
      "hierarchy": "Notes on typographic hierarchy",
      "readability": "Notes on readability"
    },
    "spacing": "Notes on spacing and padding",
    "components": [
      {
        "name": "Component Name",
        "count": 1,
        "description": "What it does"
      }
    ],
    "layout": "Layout pattern description",
    "uxScore": 8,
    "accessibilityScore": 8,
    "quickWins": ["quick win 1", "quick win 2"],
    "issues": ["issue 1", "issue 2"]
  },
  "systemInference": {
    "productType": "e.g. SaaS Dashboard, E-commerce",
    "frontend": "Likely frontend framework",
    "backend": "Likely backend stack",
    "database": "Likely database",
    "auth": "Auth requirements",
    "storage": "Storage requirements",
    "cache": "Caching needs",
    "realtime": "Realtime needs",
    "queues": "Background queue needs",
    "search": "Search needs",
    "apis": ["API 1", "API 2"],
    "scalingNotes": "Notes on how to scale this"
  },
  "architectureDiagram": "graph TD\\n  A[Frontend] --> B[API]\\n  B --> C[(Database)]",
  "implementationNotes": {
    "buildOrder": ["step 1", "step 2"],
    "majorModules": ["module 1", "module 2"],
    "estimatedComplexity": "low | medium | high | very-high",
    "risks": ["risk 1", "risk 2"],
    "recommendedStack": "Summary of recommended stack"
  },
  "confidence": {
    "design": "high | medium | low",
    "system": "high | medium | low",
    "architecture": "high | medium | low",
    "overall": "high | medium | low",
    "notes": ["confidence note 1", "confidence note 2"]
  },
  "warnings": ["warning 1", "warning 2"]
}

Rules:
- Output ONLY valid JSON. No markdown wrappers.
- Use a calm, technical tone.
- Mark inferred items as inferred.
- architectureDiagram MUST be a valid Mermaid string (e.g. graph TD ...).`;
}
