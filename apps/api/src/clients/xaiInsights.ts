import { Cluster, ProjectPlan, SearchResult, TrendSignal } from "@buildwise/shared";
import { z } from "zod";
import type { InsightsLayer2Client } from "./insightsLayer2";
import { generateAIResponse, XAIProviderError } from "./xai";

const sourceTypeSchema = z.enum(["web", "github", "ieee_xplore", "arxiv", "forum"]);
const searchResultSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  snippet: z.string().min(1),
  sourceType: sourceTypeSchema,
  meta: z.object({
    doi: z.string().optional(),
    venue: z.string().optional(),
    year: z.number().int().optional(),
    stars: z.number().int().nonnegative().optional(),
    authors: z.array(z.string()).optional(),
  }).optional(),
});

const clusterDraftSchema = z.object({
  type: z.enum(["existing_solutions", "academic", "oss", "gaps"]),
  summary: z.string().min(1),
  sourceIndexes: z.array(z.number().int().nonnegative()),
});

const projectPlanSchema = z.object({
  architecture: z.object({
    frontend: z.string().optional(),
    backend: z.string().optional(),
    database: z.string().optional(),
    aiServices: z.array(z.string()).optional(),
    dataFlow: z.string().optional(),
    diagramNodes: z.array(z.object({ id: z.string(), label: z.string(), type: z.string() })).optional(),
  }),
  techStack: z.array(z.object({ layer: z.string(), choice: z.string(), why: z.string() })),
  milestones: z.array(z.object({
    title: z.string(),
    dueInDays: z.number().int().positive().optional(),
    status: z.enum(["pending", "in_progress", "done"]).optional(),
  })),
  datasets: z.array(z.object({ name: z.string(), url: z.string().url(), description: z.string().optional() })),
  repos: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
    stars: z.number().int().nonnegative().optional(),
    description: z.string().optional(),
  })),
  generatedDoc: z.string().min(1),
});

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)?.[1];
  const candidate = (fenced ?? text).trim();

  try {
    return JSON.parse(candidate);
  } catch {
    throw new XAIProviderError("xAI returned text that did not match the requested JSON format.");
  }
}

async function generateJson<T>(prompt: string, schema: z.ZodType<T>, useWebSearch = false): Promise<T> {
  const text = await generateAIResponse(prompt, { useWebSearch });
  const parsed = schema.safeParse(extractJson(text));

  if (!parsed.success) {
    throw new XAIProviderError("xAI returned JSON that did not match the expected BuildWise response format.");
  }

  return parsed.data;
}

export class XAIInsightsClient implements InsightsLayer2Client {
  async getRealTimeSignal(topic: string): Promise<TrendSignal> {
    return generateJson(
      `Assess the research potential of this BuildWise idea: ${JSON.stringify(topic)}. Return only JSON with numeric demandScore and numeric noveltyScore as integers from 0 to 100, plus a concise notes string. Do not use alternate score field names or percentage symbols. Do not invent citations.`,
      z.object({
        demandScore: z.preprocess((value) => typeof value === "string" ? Number(value.replace(/%/g, "").trim()) : value, z.number().int().finite().min(0).max(100)),
        noveltyScore: z.preprocess((value) => typeof value === "string" ? Number(value.replace(/%/g, "").trim()) : value, z.number().int().finite().min(0).max(100)),
        notes: z.string().min(1),
      }) as z.ZodType<TrendSignal>
    );
  }

  async deepSearch(query: string, sources: string[] = ["web", "github", "ieee_xplore"]): Promise<SearchResult[]> {
    return generateJson(
      `Research this BuildWise project idea using web search: ${JSON.stringify(query)}. Prioritize these source categories when available: ${JSON.stringify(sources)}. Return only a JSON array of 3 to 5 verified results. Each item must contain title, url, snippet, sourceType (one of web, github, ieee_xplore, arxiv, forum), and optional meta with doi, venue, year, stars, and authors. Use only URLs found during research; return [] if no results can be verified.`,
      z.array(searchResultSchema),
      true
    );
  }

  async clusterKnowledge(results: SearchResult[]): Promise<Cluster[]> {
    const clusters = await generateJson(
      `Organize these BuildWise research results into concise thematic clusters: ${JSON.stringify(results)}. Return only a JSON array. Each item must have type (existing_solutions, academic, oss, or gaps), summary, and sourceIndexes containing zero-based indexes from the supplied array only. Do not add sources or facts not present in the input.`,
      z.array(clusterDraftSchema)
    );

    return clusters.map((cluster) => ({
      type: cluster.type,
      summary: cluster.summary,
      sources: [...new Set(cluster.sourceIndexes)]
        .map((index) => results[index])
        .filter((result): result is SearchResult => Boolean(result)),
    }));
  }

  async generateProjectPlan(idea: string, clusters: Cluster[]): Promise<ProjectPlan> {
    return generateJson(
      `Create a practical BuildWise implementation plan for this idea: ${JSON.stringify(idea)}. Ground it only in these research clusters: ${JSON.stringify(clusters)}. Return only JSON with architecture, techStack, milestones, datasets, repos, and generatedDoc. Architecture may include frontend, backend, database, aiServices, dataFlow, and diagramNodes (id, label, type). Milestones need title, optional dueInDays, and optional status (pending, in_progress, done). Use valid URLs only when they are present in the supplied research clusters; otherwise return empty datasets or repos arrays.`,
      projectPlanSchema
    );
  }

  async translate(content: object, targetLang: string): Promise<object> {
    return generateJson(
      `Translate all human-readable strings in this JSON object to ${JSON.stringify(targetLang)} while preserving the exact JSON structure and non-string values. Return only JSON. Input: ${JSON.stringify(content)}`,
      z.record(z.unknown())
    );
  }
}
