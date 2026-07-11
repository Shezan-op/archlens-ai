"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, Key, X } from "lucide-react";
import { Header } from "@/components/layout/header";
import { UploadZone } from "@/components/upload/upload-zone";
import { ImagePreview } from "@/components/upload/image-preview";
import { ProviderSelector } from "@/components/controls/provider-selector";
import { ModelSelector } from "@/components/controls/model-selector";
import { AnalysisLoading, defaultLoadingStages } from "@/components/analysis/analysis-loading";
import { ReportView } from "@/components/analysis/report-view";
import { ErrorCard } from "@/components/ui/error-card";
import { getVisionModels, defaultVisionModel, defaultFallbackModel } from "@/config/models";
import { siteConfig } from "@/config/site";
import type { ProviderID } from "@/types/provider";
import type { AnalysisResult, AnalysisStatus, ReportMetadata } from "@/types/analysis";

/** Image data from the upload zone */
interface ImageData {
  base64: string;
  fileName: string;
  fileSize: number;
  width: number;
  height: number;
}

export default function HomePage() {
  // Core state
  const [image, setImage] = useState<ImageData | null>(null);
  const [provider, setProvider] = useState<ProviderID>("ollama");
  const [model, setModel] = useState<string>(defaultVisionModel.ollama);
  const [openRouterKey, setOpenRouterKey] = useState<string>("");
  const [ollamaKey, setOllamaKey] = useState<string>("");
  const [ollamaBaseUrl, setOllamaBaseUrl] = useState<string>("http://127.0.0.1:11434/v1");
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStageIndex, setLoadingStageIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const loadingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load saved API keys from localStorage
  useEffect(() => {
    const savedOr = localStorage.getItem("archlens-openrouter-key");
    if (savedOr) setOpenRouterKey(savedOr);
    const savedOl = localStorage.getItem("archlens-ollama-key");
    if (savedOl) setOllamaKey(savedOl);
    const savedUrl = localStorage.getItem("archlens-ollama-url");
    if (savedUrl) setOllamaBaseUrl(savedUrl);
  }, []);

  // When provider changes, reset model to default for that provider
  const handleProviderChange = useCallback((newProvider: ProviderID) => {
    setProvider(newProvider);
    setModel(defaultVisionModel[newProvider]);
    if (newProvider === "openrouter" && !openRouterKey) {
      setShowSettings(true);
    }
  }, [openRouterKey]);

  // Save API keys
  const handleOpenRouterKeyChange = useCallback((key: string) => {
    setOpenRouterKey(key);
    localStorage.setItem("archlens-openrouter-key", key);
  }, []);

  const handleOllamaKeyChange = useCallback((key: string) => {
    setOllamaKey(key);
    localStorage.setItem("archlens-ollama-key", key);
  }, []);

  const handleOllamaUrlChange = useCallback((url: string) => {
    setOllamaBaseUrl(url);
    localStorage.setItem("archlens-ollama-url", url);
  }, []);

  // Get vision models for current provider
  const visionModels = getVisionModels(provider);

  // Simulate loading stage progression
  const startLoadingStages = useCallback(() => {
    setLoadingStageIndex(0);
    const stages = defaultLoadingStages.length;
    let current = 0;

    loadingInterval.current = setInterval(() => {
      current++;
      if (current < stages) {
        setLoadingStageIndex(current);
      } else {
        if (loadingInterval.current) clearInterval(loadingInterval.current);
      }
    }, 4000); // Progress every ~4 seconds
  }, []);

  // Handle analysis
  const handleAnalyze = useCallback(async () => {
    if (!image) return;

    const providerName = provider === "openrouter" ? "OpenRouter" : "Ollama";
    const currentKey = provider === "openrouter" ? openRouterKey : (ollamaKey || "ollama");

    // Validate API key for OpenRouter
    if (provider === "openrouter" && !currentKey) {
      setError(`OpenRouter requires an API key. Add it in settings.`);
      setShowSettings(true);
      return;
    }

    setStatus("analyzing");
    setError(null);
    setResult(null);
    startLoadingStages();

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: image.base64,
          provider,
          model,
          fallbackModel: defaultFallbackModel[provider],
          apiKey: currentKey,
          baseUrl: provider === "ollama" ? ollamaBaseUrl : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data.data);
      setStatus("complete");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      setStatus("error");
    } finally {
      if (loadingInterval.current) clearInterval(loadingInterval.current);
    }
  }, [image, provider, model, openRouterKey, ollamaKey, ollamaBaseUrl, startLoadingStages]);

  // Reset to initial state
  const handleReset = useCallback(() => {
    setImage(null);
    setResult(null);
    setError(null);
    setStatus("idle");
    setLoadingStageIndex(0);
  }, []);

  // Build report metadata
  const metadata: ReportMetadata | null = result
    ? {
        projectName: "UI Analysis",
        analysisDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        provider: provider === "ollama" ? "Ollama Cloud" : "OpenRouter",
        model,
        confidenceLevel: result.confidence.overall,
      }
    : null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Header onSettingsClick={() => setShowSettings(!showSettings)} />

      <main className="mx-auto max-w-3xl px-6 py-8">
        {/* Settings Panel (slide-down) */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mb-6 overflow-hidden"
            >
              <div
                className="rounded-xl border p-5"
                style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3
                    className="font-heading text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Settings
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-md"
                    style={{ color: "var(--text-tertiary)" }}
                    aria-label="Close settings"
                  >
                    <X size={14} />
                  </button>
                </div>

                {provider === "openrouter" && (
                  <div>
                    <label
                      className="mb-1.5 block text-xs font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <Key size={12} className="mr-1 inline" />
                      OpenRouter API Key
                    </label>
                    <input
                      type="password"
                      value={openRouterKey}
                      onChange={(e) => handleOpenRouterKeyChange(e.target.value)}
                      placeholder="sk-or-..."
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors"
                      style={{
                        borderColor: "var(--border-default)",
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-primary)",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
                    />
                    <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                      Stored locally. Never sent to our servers.
                    </p>
                  </div>
                )}

                {provider === "ollama" && (
                  <div className="space-y-4">
                    <div>
                      <label
                        className="mb-1.5 block text-xs font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <Key size={12} className="mr-1 inline" />
                        Ollama API Key
                      </label>
                      <input
                        type="password"
                        value={ollamaKey}
                        onChange={(e) => handleOllamaKeyChange(e.target.value)}
                        placeholder="Optional for local Ollama"
                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors"
                        style={{
                          borderColor: "var(--border-default)",
                          backgroundColor: "var(--bg-primary)",
                          color: "var(--text-primary)",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
                      />
                      <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                        Stored locally. Never sent to our servers.
                      </p>
                    </div>
                    <div>
                      <label
                        className="mb-1.5 block text-xs font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Ollama Base URL
                      </label>
                      <input
                        type="url"
                        value={ollamaBaseUrl}
                        onChange={(e) => handleOllamaUrlChange(e.target.value)}
                        placeholder="http://127.0.0.1:11434/v1"
                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors"
                        style={{
                          borderColor: "var(--border-default)",
                          backgroundColor: "var(--bg-primary)",
                          color: "var(--text-primary)",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status: Idle — Upload + Configure */}
        {(status === "idle" || status === "uploading") && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Hero text */}
            <div className="text-center">
              <h1
                className="font-heading text-3xl font-bold tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {siteConfig.name}
              </h1>
              <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                {siteConfig.tagline}
              </p>
            </div>

            {/* Upload or Preview */}
            {!image ? (
              <UploadZone onImageReady={(data) => setImage(data)} />
            ) : (
              <ImagePreview
                base64={image.base64}
                fileName={image.fileName}
                fileSize={image.fileSize}
                width={image.width}
                height={image.height}
                onRemove={handleReset}
                onReplace={() => {
                  setImage(null);
                  setResult(null);
                  setError(null);
                }}
              />
            )}

            {/* Provider + Model Selection */}
            <div className="space-y-3">
              <label
                className="block text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                AI Provider
              </label>
              <ProviderSelector value={provider} onChange={handleProviderChange} />
            </div>

            <div>
              <label
                className="mb-1.5 block text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Vision Model
              </label>
              <ModelSelector
                models={visionModels}
                value={model}
                onChange={setModel}
              />
            </div>

            {/* Analyze CTA */}
            <motion.button
              onClick={handleAnalyze}
              disabled={!image}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                backgroundColor: image ? "var(--accent)" : "var(--bg-elevated)",
                color: image ? "white" : "var(--text-tertiary)",
              }}
              whileHover={image ? { scale: 1.01 } : {}}
              whileTap={image ? { scale: 0.99 } : {}}
            >
              <Scan size={16} />
              Analyze Screenshot
            </motion.button>
          </motion.div>
        )}

        {/* Status: Analyzing — Loading States */}
        {status === "analyzing" && (
          <AnalysisLoading
            stages={defaultLoadingStages}
            currentStageIndex={loadingStageIndex}
          />
        )}

        {/* Status: Complete — Report */}
        {status === "complete" && result && metadata && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setResult(null);
                  setError(null);
                  setStatus("idle");
                }}
                className="rounded-lg border px-4 py-2 text-xs font-medium transition-colors"
                style={{
                  borderColor: "var(--border-default)",
                  color: "var(--text-secondary)",
                  backgroundColor: "var(--bg-surface)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--text-tertiary)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
              >
                Back to Settings
              </button>
              <button
                onClick={handleReset}
                className="rounded-lg border px-4 py-2 text-xs font-medium transition-colors"
                style={{
                  borderColor: "var(--border-default)",
                  color: "var(--text-secondary)",
                  backgroundColor: "var(--bg-surface)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--text-tertiary)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
              >
                New Image
              </button>
            </div>

            <ReportView result={result} metadata={metadata} />
          </motion.div>
        )}

        {/* Status: Error */}
        {status === "error" && error && (
          <ErrorCard
            message={error}
            onRetry={handleAnalyze}
            onBack={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        className="mt-16 border-t px-6 py-6 text-center"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          Built with Next.js, TypeScript, and vision AI •{" "}
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
