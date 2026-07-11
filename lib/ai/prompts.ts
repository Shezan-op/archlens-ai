// ============================================================================
// AI Prompts
// Structured prompts for the vision analysis models
// ============================================================================

export function getAnalysisPrompt(): string {
  return `Analyze this screenshot.

Identify:
- visible interface elements
- important text
- warnings
- errors
- buttons
- navigation
- user workflow
- possible next action

Return a structured JSON response matching this schema:
{
  "summary": "High level description of what this UI represents",
  "detectedText": ["text 1", "text 2"],
  "importantUIElements": ["button X", "menu Y"],
  "problemsFound": ["error message Z", "misaligned A"],
  "recommendedUserAction": "What the user should do next",
  "confidence": {
    "overall": 0.95
  }
}

Avoid long unstructured paragraphs whenever practical.`;
}
