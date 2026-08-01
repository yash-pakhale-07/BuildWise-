/**
 * InsightsLayer2 abstraction – resolves the appropriate AI client.
 *
 * Stage 1 (Novelty Validation):
 *   getRealTimeSignal() → GeminiNoveltyClient (Gemini provider, active)
 *
 * All other stages (Deep Research, Clustering, Plan, etc.):
 *   → XAIInsightsClient (Grok/xAI, preserved for future use)
 *
 * Provider resolution order:
 *   1. If GEMINI_API_KEY is set → use GeminiNoveltyClient for Stage 1
 *   2. If XAI_API_KEY is set    → use XAIInsightsClient (full suite)
 *   3. In development only      → fall back to mock client
 */

import { SearchResult, Cluster, ProjectPlan, TrendSignal } from "@buildwise/shared";
import { XAIInsightsClient } from "./xaiInsights";
import { isXAIConfigured } from "./xai";
import { isGeminiConfigured } from "./gemini";
import { getGeminiNoveltySignal } from "./geminiNovelty";

export interface InsightsLayer2Client {
  deepSearch(query: string, sources?: string[]): Promise<SearchResult[]>;
  clusterKnowledge(results: SearchResult[]): Promise<Cluster[]>;
  generateProjectPlan(idea: string, clusters: Cluster[]): Promise<ProjectPlan>;
  getRealTimeSignal(topic: string): Promise<TrendSignal>;
  translate(content: object, targetLang: string): Promise<object>;
}

// ---------------------------------------------------------------------------
// GeminiNoveltyClient – wraps Gemini for Stage 1 only.
// All other methods delegate to XAIInsightsClient when xAI is available,
// otherwise throw a clear error so callers know which provider is missing.
// ---------------------------------------------------------------------------
class GeminiNoveltyClient implements InsightsLayer2Client {
  private readonly xaiDelegate: XAIInsightsClient | null;

  constructor() {
    this.xaiDelegate = isXAIConfigured() ? new XAIInsightsClient() : null;
  }

  /** Stage 1 – powered by Gemini. */
  async getRealTimeSignal(topic: string): Promise<TrendSignal> {
    return getGeminiNoveltySignal(topic);
  }

  /**
   * deepSearch is used during Stage 1 to enrich feasibility notes.
   * When xAI is not configured, return empty results so Gemini-only
   * novelty validation can complete without blocking.
   */
  async deepSearch(query: string, sources?: string[]): Promise<SearchResult[]> {
    if (!this.xaiDelegate) {
      console.warn("[InsightsLayer2] XAI_API_KEY not set; skipping deepSearch for Stage 1.");
      return [];
    }
    return this.xaiDelegate.deepSearch(query, sources);
  }

  async clusterKnowledge(results: SearchResult[]): Promise<Cluster[]> {
    return this.requireXai().clusterKnowledge(results);
  }

  async generateProjectPlan(idea: string, clusters: Cluster[]): Promise<ProjectPlan> {
    return this.requireXai().generateProjectPlan(idea, clusters);
  }

  async translate(content: object, targetLang: string): Promise<object> {
    return this.requireXai().translate(content, targetLang);
  }

  private requireXai(): XAIInsightsClient {
    if (!this.xaiDelegate) {
      throw new Error(
        "Deep Research and downstream stages require XAI_API_KEY to be configured."
      );
    }
    return this.xaiDelegate;
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------
export function getInsightsLayer2Client(): InsightsLayer2Client {
  // Prefer Gemini for Stage 1 novelty validation
  if (isGeminiConfigured()) {
    return new GeminiNoveltyClient();
  }

  // Fall back to pure xAI client (Grok) when Gemini is not configured
  if (isXAIConfigured()) {
    return new XAIInsightsClient();
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "GEMINI_API_KEY (or XAI_API_KEY) must be configured in production to use BuildWise AI features."
    );
  }

  // Development-only mock fallback
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { mockInsightsLayer2Client } = require("../mocks/insightsLayer2.mock");
  return mockInsightsLayer2Client;
}
