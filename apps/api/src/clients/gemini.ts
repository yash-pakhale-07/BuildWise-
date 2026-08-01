/**
 * Gemini provider client for BuildWise.
 *
 * Mirrors the xai.ts architecture – the API key is read exclusively from the
 * backend process environment and is NEVER included in error messages, logs,
 * or responses sent to the frontend.
 *
 * Supported env vars:
 *   GEMINI_API_KEY   – required at runtime
 *   GEMINI_MODEL     – optional; defaults to gemini-1.5-flash
 */

const GEMINI_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_GEMINI_MODEL = "gemini-1.5-flash";

export class GeminiProviderError extends Error {
  public readonly statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "GeminiProviderError";
    this.statusCode = statusCode;
  }
}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export function getGeminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

/**
 * Generates text via Google's Gemini generateContent REST endpoint.
 * The API key is only ever passed as a query-param on the server side.
 */
export async function generateGeminiResponse(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = getGeminiModel();

  if (!apiKey) {
    throw new GeminiProviderError(
      "Gemini is not configured. Set GEMINI_API_KEY on the API server."
    );
  }

  const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          maxOutputTokens: 1024,
        },
      }),
    });
  } catch (networkError) {
    const msg =
      networkError instanceof Error
        ? networkError.message
        : "Unknown network error";
    console.error("[Gemini] Network request failed", { model, error: msg });
    throw new GeminiProviderError("Unable to reach the Gemini API.");
  }

  if (!response.ok) {
    const statusCode = response.status;
    let safeMessage: string;

    if (statusCode === 401) {
      safeMessage = "Gemini API key is invalid or missing (HTTP 401).";
    } else if (statusCode === 403) {
      safeMessage = "Access to the Gemini API was denied (HTTP 403).";
    } else if (statusCode === 429) {
      safeMessage =
        "Gemini API quota exhausted. Please try again later (HTTP 429).";
    } else {
      safeMessage = `Gemini API request failed (HTTP ${statusCode}).`;
    }

    console.error("[Gemini] API returned an error", {
      provider: "gemini",
      model,
      status: statusCode,
    });
    throw new GeminiProviderError(safeMessage, statusCode);
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    console.error("[Gemini] API returned invalid JSON", { provider: "gemini", model });
    throw new GeminiProviderError("Gemini API returned a malformed response.");
  }

  const text = extractGeminiText(body);
  if (!text) {
    console.error("[Gemini] API returned no generated text", {
      provider: "gemini",
      model,
    });
    throw new GeminiProviderError("Gemini API returned no generated text.");
  }

  return text;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

interface GeminiPart {
  text?: unknown;
}

interface GeminiContent {
  parts?: GeminiPart[];
}

interface GeminiCandidate {
  content?: GeminiContent;
}

interface GeminiResponseBody {
  candidates?: GeminiCandidate[];
}

function extractGeminiText(body: unknown): string | null {
  const b = body as GeminiResponseBody;
  const text = b?.candidates?.[0]?.content?.parts
    ?.filter((p) => typeof p.text === "string")
    .map((p) => p.text as string)
    .join("\n")
    .trim();

  return text || null;
}
