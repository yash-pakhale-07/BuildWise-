import { SearchResult, Cluster, ProjectPlan, TrendSignal } from "@buildwise/shared";
import { XAIInsightsClient } from "./xaiInsights";
import { isXAIConfigured } from "./xai";

export interface InsightsLayer2Client {
  deepSearch(query: string, sources?: string[]): Promise<SearchResult[]>;
  clusterKnowledge(results: SearchResult[]): Promise<Cluster[]>;
  generateProjectPlan(idea: string, clusters: Cluster[]): Promise<ProjectPlan>;
  getRealTimeSignal(topic: string): Promise<TrendSignal>;
  translate(content: object, targetLang: string): Promise<object>;
}

export function getInsightsLayer2Client(): InsightsLayer2Client {
  if (isXAIConfigured()) {
    return new XAIInsightsClient();
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("XAI_API_KEY must be configured in production to use BuildWise AI features.");
  }

  const { mockInsightsLayer2Client } = require("../mocks/insightsLayer2.mock");
  return mockInsightsLayer2Client;
}
