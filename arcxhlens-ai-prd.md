# ArchLens AI

## Product Requirement Document

### 1) Product Summary

ArchLens AI is a premium, minimal, screenshot-driven AI product that analyzes a UI screenshot and produces two things in one flow:

1. A **design audit** of the visual interface.
2. A **probable system design** behind that interface.

The product is not a chatbot. It is a structured analysis tool. The user uploads a screenshot, selects a goal, and gets a clean, polished report that explains how the UI looks, what product patterns it uses, and what backend architecture is likely required to support it.

The core value is simple: **turn one screenshot into design intelligence and architecture intelligence**.

---

### 2) Product Goal

Build a project that feels like a real developer tool, not a demo wrapper.

The app must:

* Look premium from the first screen.
* Explain itself clearly in one presentation.
* Use vision AI meaningfully.
* Output structured analysis that can be exported.
* Stay minimal, clean, and polished.
* Be deployable on Vercel.
* Use Ollama cloud models and OpenRouter through OpenAI-compatible APIs.

---

### 3) Core Positioning

**ArchLens AI** is an AI-assisted product analysis workspace.

It helps users understand:

* how a product UI is built,
* what design system it likely uses,
* what features are visible,
* what backend components are probably needed,
* and how the product could be recreated or improved.

The app should be positioned as:

> “Upload a screenshot. Get a design audit, system architecture guess, and implementation notes.”

Do not position it as a generic chatbot.

---

### 4) Target Users

Primary users:

* Software engineering interns
* Frontend developers
* Product builders
* UI/UX students
* Founders who want to analyze competitors
* Interviewers or reviewers who want to judge project maturity

Secondary users:

* Agency designers
* Product managers
* No-code builders
* AI tool explorers

---

### 5) Main Use Case

User uploads a screenshot of any app or website UI.
The app analyzes the image and returns:

* visual breakdown,
* layout hierarchy,
* component inventory,
* probable design system,
* UX strengths and weaknesses,
* system architecture inference,
* implementation complexity estimate,
* exportable markdown.

The output should feel like a professional report.

---

### 6) MVP Scope

The first version must support only these flows:

#### A. Screenshot Upload Flow

* Drag and drop screenshot upload.
* Paste image support.
* File picker support.
* Preview before analysis.
* Remove / replace image.

#### B. Analysis Flow

* Send screenshot to a vision model.
* Receive structured JSON analysis.
* Render a premium report.
* Generate design audit and system architecture sections.

#### C. Export Flow

* Export report as Markdown.
* Copy report to clipboard.
* Download report as `.md`.

#### D. Model Selection Flow

* Choose provider: Ollama Cloud or OpenRouter.
* Choose model from a supported model list.
* Use OpenAI-compatible request format.

---

### 7) Non-Goals

Do not build these in MVP:

* user accounts
* authentication
* payments
* team collaboration
* database sync across devices
* public sharing links
* multi-page website crawling
* Figma export
* code generation
* live browser-based reverse engineering
* long-term memory
* chat history as the core product

This is important. The project must stay tight.

---

### 8) Product Promise

Every screenshot analysis must answer these questions:

#### Design Layer

* What is the overall visual style?
* What colors dominate the interface?
* What font style seems likely?
* What layout pattern is being used?
* What are the main UI components?
* What is visually strong?
* What is visually weak?
* What should be improved?

#### System Layer

* What kind of product is this likely?
* What backend services are probably needed?
* What data is likely being stored?
* Does the product need auth?
* Does it need caching?
* Does it need file storage?
* Does it need realtime updates?
* Does it need search?
* Does it need queues or workers?
* What architecture style fits best?

#### Implementation Layer

* What stack would likely recreate this fastest?
* What is the estimated complexity?
* What are the key modules needed?
* What are the likely bottlenecks?

---

### 9) Core UX Principles

The UX must be extremely simple.

#### UX rules

* One primary action per screen.
* No clutter.
* No noisy gradients.
* No distracting animations.
* No feature overload.
* No unnecessary onboarding.
* No long forms.
* No fake product jargon.
* Every screen must answer a purpose.

#### UX feel

* Calm
* Fast
* Premium
* Focused
* Technical
* Confident
* Clean

The user should feel that the app is serious the moment it loads.

---

### 10) Visual Design Direction

The UI must feel like a premium developer product.

#### Style

* Minimal
* High contrast
* Clean spacing
* Soft shadows only where needed
* Subtle borders
* Glassy or blurred surfaces only if they stay restrained
* Dark-first interface
* Elegant and restrained motion

#### Color Direction

Use a dark premium system with one accent color.
Recommended base palette:

* Background: near-black / charcoal
* Surface: slightly lighter charcoal
* Border: muted slate
* Text: off-white
* Accent: electric blue or cyan

Keep color usage disciplined.
Do not overdecorate.

#### Typography Direction

Use a modern, premium font pairing.
Recommended direction:

* Headings: **Sora** or **Space Grotesk**
* Body: **Inter**
* Code / technical snippets: **JetBrains Mono**

Typography should feel crisp and modern.

#### Layout Direction

* Left sidebar or top compact nav.
* Large central upload zone.
* Analysis report in cards or stacked sections.
* Clear visual hierarchy.
* One-page dashboard feel.
* No crowded tables.
* No tiny unreadable text blocks.

---

### 11) Core Screens

#### Screen 1. Landing / Workspace Home

Purpose: introduce the app and start analysis quickly.

Must include:

* App name
* Short positioning line
* Upload area
* Provider selector
* Model selector
* Optional goal selector
* Primary CTA: “Analyze Screenshot”

#### Screen 2. Upload State

Purpose: prepare image before analysis.

Must include:

* image preview
* filename
* file size
* replace/remove option
* quality note if image is too small

#### Screen 3. Analysis Loading State

Purpose: make the AI process feel intentional.

Must include:

* progress indicator
* staged steps such as:

  * reading UI structure
  * detecting components
  * inferring architecture
  * compiling report
* estimated stage animation
* no fake time countdown

#### Screen 4. Results Screen

Purpose: show the final report.

Must include these sections:

* Overall summary
* Design analysis
* UI components detected
* Layout hierarchy
* Color and typography inference
* UX critique
* System design inference
* Architecture diagram
* Implementation notes
* Confidence notes
* Export controls

#### Screen 5. Settings Panel

Purpose: configure provider/model behavior.

Must include:

* provider toggle
* model dropdown
* response style toggle
* output format selector
* optional advanced settings

---

### 12) Report Structure

The output report must always follow the same format so the product feels dependable.

#### Report Header

* Project name inferred from screenshot or user goal
* Analysis date
* Provider used
* Model used
* Confidence level

#### Section A. Executive Summary

A short 3–5 line summary of what the screenshot likely represents and what matters most.

#### Section B. Design Audit

Subsections:

* visual style
* color system
* typography
* spacing
* component inventory
* layout system
* UI polish score
* accessibility notes
* design risks
* quick wins

#### Section C. System Design Inference

Subsections:

* product type guess
* frontend stack guess
* backend stack guess
* storage needs
* auth needs
* realtime needs
* caching needs
* file storage needs
* search needs
* worker needs
* scaling notes

#### Section D. Architecture Diagram

Render a simple architecture diagram using Mermaid.

#### Section E. Build Plan

A short, practical implementation plan for recreating the product.

#### Section F. Confidence and Limits

Clearly explain that the architecture is inferred, not verified.

---

### 13) Output Schema

The AI should not return freeform text only.
It must return structured JSON first, then the UI renders it.

Required top-level JSON fields:

* `summary`
* `designAudit`
* `systemInference`
* `architectureDiagram`
* `implementationNotes`
* `confidence`
* `warnings`
* `exportMarkdown`

#### `designAudit` fields

* `style`
* `palette`
* `typography`
* `spacing`
* `components`
* `layout`
* `uxScore`
* `accessibilityScore`
* `quickWins`
* `issues`

#### `systemInference` fields

* `productType`
* `frontend`
* `backend`
* `database`
* `auth`
* `storage`
* `cache`
* `realtime`
* `queues`
* `search`
* `apis`
* `scalingNotes`

#### `implementationNotes` fields

* `buildOrder`
* `majorModules`
* `estimatedComplexity`
* `risks`
* `recommendedStack`

The app should validate this output before rendering.

---

### 14) Vision and AI Provider Strategy

The app must support both:

* **Ollama cloud models**
* **OpenRouter models**

Both should be accessed through OpenAI-compatible APIs.
This means the codebase must be written around one unified provider interface.

#### Provider Rules

* Do not hardcode provider-specific logic inside UI components.
* Do not mix request-building code across screens.
* Use one AI adapter layer.
* Use environment variables for keys and endpoints.
* Keep provider behavior swappable.

#### Required behavior

* The app must inspect the local directory that contains the Ollama model list and Ollama documentation before wiring the provider layer.
* The app must also inspect the OpenRouter documentation available in the project directory.
* Prefer the actual supported models listed in those files when building the dropdown.
* Keep the model list editable through a config file, not hardcoded in random components.

#### Compatibility note

Because Ollama and OpenRouter support OpenAI-compatible APIs, the implementation should use a shared request shape and only swap endpoint, key, and model values.

---

### 15) Provider Capability Rules

The product should understand that not every model is equal.

Define model capability tags:

* `vision`
* `text`
* `structured-json`
* `fast`
* `high-quality`
* `budget`

#### Default routing logic

* Use a vision-capable model for image analysis.
* Use a strong text model for report polishing.
* Use structured JSON output mode whenever supported.
* Fall back to a safer text-only summary if vision fails.

#### Recommended behavior

* If the selected model fails, show a clean error and allow retry.
* If JSON parsing fails, ask the model to repair the format once.
* If the provider is unavailable, allow switch to the other provider.

---

### 16) App Architecture

The implementation should be easy to explain and easy to extend.

#### Recommended structure

* `app/` for routes and pages
* `components/` for UI
* `lib/ai/` for provider adapters
* `lib/prompts/` for prompt templates
* `lib/schemas/` for JSON validation
* `lib/diagram/` for Mermaid generation
* `lib/export/` for markdown generation
* `lib/utils/` for shared helpers
* `config/models/` for model definitions pulled from the Ollama/OpenRouter docs

#### Clean boundaries

* UI never talks directly to providers.
* Providers never render UI.
* JSON validation happens before display.
* Markdown export is generated from validated data.

---

### 17) Prompting Strategy

The app should use layered prompting.

#### Prompt Layer 1. Vision Prompt

Purpose: extract only what is visible.

Must ask for:

* layout
* components
* color cues
* typography cues
* hierarchy
* density
* interactions visible in the screenshot

#### Prompt Layer 2. System Inference Prompt

Purpose: infer the backend behind the UI.

Must ask for:

* likely architecture
* probable services
* probable data model
* scaling needs
* technical constraints
* confidence levels

#### Prompt Layer 3. Report Compiler Prompt

Purpose: turn structured output into a polished human-readable report.

Must ask for:

* concise language
* technical honesty
* clear section headings
* no filler
* no repeating the same point three times

#### Prompt rules

* Never hallucinate certainty.
* Mark inferred items as inferred.
* Separate observation from assumption.
* Keep the tone technical and calm.

---

### 18) Confidence System

The app must show confidence, not pretend certainty.

#### Confidence levels

* High
* Medium
* Low

#### Confidence inputs

* image clarity
* screenshot size
* screen complexity
* model quality
* JSON completeness
* visual confidence versus system confidence

#### Display rule

The report must show confidence for:

* design inference
* system inference
* architecture recommendation

This makes the product feel honest and intelligent.

---

### 19) UX Edge Cases

Handle these cleanly:

* unsupported file type
* image too small
* corrupted image
* model timeout
* provider not configured
* JSON output malformed
* analysis cancelled mid-flight
* repeat upload of the same file
* empty screenshot area
* slow network

Every error should look designed, not broken.

---

### 20) Visual Components Needed

Build these reusable components:

* upload card
* preview card
* provider selector
* model selector
* confidence badge
* section card
* metric chip
* architecture diagram card
* code block card
* export dropdown
* error state card
* skeleton loader
* empty state panel

All components should match the same visual system.

---

### 21) Motion Rules

Motion should be subtle.

Use animation for:

* fade in
* slide up
* soft scale on hover
* loading shimmer
* section reveal
* button press feedback

Do not use flashy motion.
Do not use bouncy gimmicks.
The motion should support premium feel, not fight it.

---

### 22) Accessibility Rules

Must support:

* good contrast
* keyboard navigation
* visible focus states
* readable font sizes
* descriptive labels
* accessible error text
* reduced motion friendly behavior

Do not sacrifice clarity for style.

---

### 23) Export Requirements

The app must export:

* Markdown report
* copied text
* downloadable `.md` file

Optional future export:

* PDF
* PNG report cards
* Mermaid source file

For MVP, Markdown is enough.

---

### 24) Technical Constraints

The app must be realistic for Vercel hosting.

#### Constraints

* Keep the main flow fast.
* Avoid huge serverless payloads.
* Compress images before sending.
* Keep provider logic lightweight.
* Do not build a long-running backend process inside a serverless route.
* Keep the interaction mostly single-request or short streaming.

#### Practical note

If the provider response is too slow for a single serverless execution, the app should support a lightweight progress state and short retry behavior instead of overengineering a queue system for MVP.

---

### 25) MVP Success Criteria

The MVP is successful if:

* the app looks premium,
* the upload flow feels smooth,
* the report is readable and useful,
* the system design explanation sounds credible,
* provider switching works,
* the output can be exported,
* the app is easy to explain in an interview,
* and it does not look like a chatbot clone.

---

### 26) Interview Talking Points

Use these exact angles when presenting:

* This is a screenshot intelligence tool, not a chatbot.
* It combines visual understanding with system design reasoning.
* It helps developers reverse-engineer product structure faster.
* It uses OpenAI-compatible APIs through Ollama cloud and OpenRouter.
* It focuses on structured output, not random text generation.
* It is designed with premium UX because presentation matters.

---

### 27) What Makes This Project Strong

This project is strong because it shows:

* product thinking
* AI integration
* design sensibility
* structured output engineering
* prompt design
* clean UI implementation
* practical deployment thinking
* architecture reasoning

That is the real flex.

---

### 28) Final Build Instruction

Build ArchLens AI as a polished dark-mode app with a minimal premium interface, strong visual hierarchy, smooth but subtle motion, clear reports, provider flexibility, structured JSON output, and a unified OpenAI-compatible AI adapter layer for Ollama cloud and OpenRouter.

Do not waste time on extra features. Ship the sharp version.
