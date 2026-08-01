/**
 * GeminiNoveltyClient – Gemini-backed implementation of novelty validation
 * for BuildWise Stage 1 (Novelty Validation only).
 *
 * Only getRealTimeSignal() is implemented here. All other InsightsLayer2Client
 * methods are intentionally NOT wired to Gemini and should remain with xAI for
 * Deep Research and downstream stages.
 */

import { z } from "zod";
import { TrendSignal } from "@buildwise/shared";
import { generateGeminiResponse, GeminiProviderError } from "./gemini";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractJson(text: string): unknown {
  // Strip markdown fences if present (```json ... ``` or ``` ... ```)
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)?.[1];
  const candidate = (fenced ?? text).trim();

  try {
    return JSON.parse(candidate);
  } catch {
    throw new GeminiProviderError(
      "Gemini returned text that did not match the requested JSON format."
    );
  }
}

// Accepts both integer and percentage-string inputs for scores
const scorePreprocess = (value: unknown) =>
  typeof value === "string" ? Number(value.replace(/%/g, "").trim()) : value;

const noveltySignalSchema = z.object({
  noveltyScore: z.preprocess(
    scorePreprocess,
    z.number().int().finite().min(0).max(100)
  ),
  demandScore: z.preprocess(
    scorePreprocess,
    z.number().int().finite().min(0).max(100)
  ),
  notes: z.string().min(1),
});

// ---------------------------------------------------------------------------
// Exported function
// ---------------------------------------------------------------------------

/**
 * Calls Gemini to evaluate the novelty / demand signal for a research idea.
 * Returns { noveltyScore, demandScore, notes } compatible with TrendSignal.
 *
 * Throws GeminiProviderError on any failure so the caller can surface a safe
 * message to the frontend.
 */
export async function getGeminiNoveltySignal(topic: string): Promise<TrendSignal> {
  const prompt = `You are a research analyst for BuildWise, an academic research validation platform.

Evaluate the following research idea and return ONLY a JSON object with these exact fields:
- noveltyScore: integer 0-100 (how novel/original this research direction is)
- demandScore: integer 0-100 (how much demand/interest exists in academia and industry)
- notes: a concise 2-3 sentence summary covering novelty, demand relevance, and feasibility

Research idea: ${JSON.stringify(topic)}

IMPORTANT:
- Return ONLY the raw JSON object, no markdown, no explanation.
- Both noveltyScore and demandScore MUST be integers between 0 and 100.
- Do NOT use percentage symbols in score values.
- Do NOT invent citations or references.

Example format:
{"noveltyScore": 72, "demandScore": 85, "notes": "This idea addresses a genuine gap in..."}`;

  const text = await generateGeminiResponse(prompt);
  const parsed = noveltySignalSchema.safeParse(extractJson(text));

  if (!parsed.success) {
    console.error("[Gemini] Novelty signal response did not match expected schema", {
      provider: "gemini",
      issues: parsed.error.issues.map((i) => i.message),
    });
    throw new GeminiProviderError(
      "Gemini returned novelty data that did not match the expected BuildWise format."
    );
  }

  return parsed.data as TrendSignal;
}
