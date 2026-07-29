import { SearchResult, Cluster, ProjectPlan, TrendSignal } from "@buildwise/shared";

export interface InsightsLayer2Client {
  deepSearch(query: string, sources?: string[]): Promise<SearchResult[]>;
  clusterKnowledge(results: SearchResult[]): Promise<Cluster[]>;
  generateProjectPlan(idea: string, clusters: Cluster[]): Promise<ProjectPlan>;
  getRealTimeSignal(topic: string): Promise<TrendSignal>;
  translate(content: object, targetLang: string): Promise<object>;
}

export function getInsightsLayer2Client(): InsightsLayer2Client {
  if (process.env.INSIGHTS_LAYER2_API_KEY) {
    // Fill in real client implementation when sponsor API docs land
    // return new RealInsightsLayer2Client();
  }
  const { mockInsightsLayer2Client } = require("../mocks/insightsLayer2.mock");
  return mockInsightsLayer2Client;
}
