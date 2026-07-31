const XAI_RESPONSES_URL = "https://api.x.ai/v1/responses";
const DEFAULT_XAI_MODEL = "grok-4.5";

interface XAIResponseContent {
  type?: string;
  text?: unknown;
}

interface XAIResponseOutput {
  type?: string;
  content?: XAIResponseContent[];
}

interface XAIResponseBody {
  output_text?: unknown;
  output?: XAIResponseOutput[];
}

export class XAIProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "XAIProviderError";
  }
}

export interface XAIResponseOptions {
  useWebSearch?: boolean;
}

export function isXAIConfigured(): boolean {
  return Boolean(process.env.XAI_API_KEY?.trim());
}

export function getXAIModel(): string {
  return process.env.XAI_MODEL?.trim() || DEFAULT_XAI_MODEL;
}

function extractOutputText(body: XAIResponseBody): string | null {
  if (typeof body.output_text === "string" && body.output_text.trim()) {
    return body.output_text.trim();
  }

  const text = body.output
    ?.filter((item) => item.type === "message")
    .flatMap((item) => item.content ?? [])
    .filter((content) => content.type === "output_text" && typeof content.text === "string")
    .map((content) => content.text as string)
    .join("\n")
    .trim();

  return text || null;
}

/**
 * Generates text through xAI's server-side Responses API. The API key is read
 * only from the backend process environment and is never included in errors.
 */
export async function generateAIResponse(prompt: string, options: XAIResponseOptions = {}): Promise<string> {
  const apiKey = process.env.XAI_API_KEY?.trim();
  const model = getXAIModel();

  if (!apiKey) {
    throw new XAIProviderError("xAI is not configured. Set XAI_API_KEY on the API server.");
  }

  try {
    const response = await fetch(XAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [{ role: "user", content: prompt }],
        ...(options.useWebSearch ? { tools: [{ type: "web_search" }], include: ["no_inline_citations"] } : {}),
      }),
    });

    if (!response.ok) {
      console.error("xAI Responses API returned an error", { model, status: response.status });
      throw new XAIProviderError(`xAI API request failed (HTTP ${response.status}).`);
    }

    let body: XAIResponseBody;
    try {
      body = (await response.json()) as XAIResponseBody;
    } catch {
      console.error("xAI Responses API returned invalid JSON", { model });
      throw new XAIProviderError("xAI API returned a malformed response.");
    }

    const text = extractOutputText(body);
    if (!text) {
      console.error("xAI Responses API returned no output text", { model });
      throw new XAIProviderError("xAI API returned no generated text.");
    }

    return text;
  } catch (error) {
    if (error instanceof XAIProviderError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Unknown network error";
    console.error("xAI Responses API request failed", { model, message });
    throw new XAIProviderError("Unable to reach the xAI API.");
  }
}
