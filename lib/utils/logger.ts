// ============================================================================
// Structured Logger
// Provides formatted JSON logging for production and readable text for local dev.
// ============================================================================

type LogLevel = "info" | "warn" | "error" | "debug";

function formatLog(level: LogLevel, message: string, data?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  
  // If running in development or running locally, use a more readable string format
  if (process.env.NODE_ENV === "development") {
    const dataString = data ? `\n  ${JSON.stringify(data, null, 2)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataString}`;
  }

  // Otherwise, output structured JSON for log aggregators
  return JSON.stringify({
    timestamp,
    level,
    message,
    ...data,
  });
}

export const logger = {
  info: (message: string, data?: Record<string, any>) => {
    console.log(formatLog("info", message, data));
  },
  warn: (message: string, data?: Record<string, any>) => {
    console.warn(formatLog("warn", message, data));
  },
  error: (message: string, data?: Record<string, any>) => {
    console.error(formatLog("error", message, data));
  },
  debug: (message: string, data?: Record<string, any>) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(formatLog("debug", message, data));
    }
  },
};
