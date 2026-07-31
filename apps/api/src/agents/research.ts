import { getInsightsLayer2Client } from "../clients/insightsLayer2";
import { getIEEEXploreClient } from "../clients/ieeeXplore";
import { getDbPool, memoryDb, isDbConnected } from "../db/db";
import { Cluster, SearchResult } from "@buildwise/shared";
import { randomUUID } from "crypto";

export async function processResearchForIdea(ideaId: string, userId: string) {
  const pool = getDbPool();
  let rawText = "";

  // Fetch idea text
  if (isDbConnected() && pool) {
    const res = await pool.query("SELECT raw_text FROM ideas WHERE id = $1 AND user_id = $2", [ideaId, userId]);
    if (res.rows.length > 0) rawText = res.rows[0].raw_text;
  } else {
    const found = memoryDb.ideas.find((i) => i.id === ideaId && (i.userId || i.user_id) === userId);
    if (found) rawText = found.rawText;
  }

  if (!rawText) throw new Error("Idea not found");

  const insightsClient = getInsightsLayer2Client();
  const ieeeClient = getIEEEXploreClient();

  // Perform multi-source deep search
  const [layer2Results, ieeePapers] = await Promise.all([
    insightsClient.deepSearch(rawText, ["web", "github"]),
    ieeeClient.searchPapers(rawText, 3),
  ]);

  const convertedIEEE: SearchResult[] = ieeePapers.map((p) => ({
    title: `IEEE: ${p.title}`,
    url: p.url,
    snippet: p.abstract,
    sourceType: "ieee_xplore",
    meta: {
      doi: p.doi,
      venue: p.venue,
      year: p.year,
      authors: p.authors,
    },
    __mocked: p.__mocked,
  }));

  const combinedResults = [...layer2Results, ...convertedIEEE];
  const clusters = await insightsClient.clusterKnowledge(combinedResults);

  // Save clusters to DB or Memory
  if (isDbConnected() && pool) {
    for (const cluster of clusters) {
      const clusterId = randomUUID();
      await pool.query(
        `INSERT INTO research_clusters (id, idea_id, cluster_type, summary, sources)
         VALUES ($1, $2, $3, $4, $5)`,
        [clusterId, ideaId, cluster.type, cluster.summary, JSON.stringify(cluster.sources)]
      );
    }
    await pool.query("UPDATE ideas SET status = 'researching' WHERE id = $1", [ideaId]);
  } else {
    for (const cluster of clusters) {
      const clusterId = randomUUID();
      memoryDb.research_clusters.push({
        id: clusterId,
        ideaId,
        type: cluster.type,
        summary: cluster.summary,
        sources: cluster.sources,
        createdAt: new Date(),
      });
    }
    const found = memoryDb.ideas.find((i) => i.id === ideaId);
    if (found) found.status = "researching";
  }

  return {
    ideaId,
    status: "completed",
    clusters,
  };
}

export async function getResearchStatus(ideaId: string, userId: string) {
  const pool = getDbPool();
  let clusters: Cluster[] = [];

  if (isDbConnected() && pool) {
    const res = await pool.query(
      `SELECT rc.* FROM research_clusters rc
       JOIN ideas i ON i.id = rc.idea_id
       WHERE rc.idea_id = $1 AND i.user_id = $2`,
      [ideaId, userId]
    );
    clusters = res.rows.map((row: Record<string, any>) => ({
      id: row.id,
      ideaId: row.idea_id,
      type: row.cluster_type,
      summary: row.summary,
      sources: typeof row.sources === "string" ? JSON.parse(row.sources) : row.sources,
    }));
  } else {
    clusters = memoryDb.research_clusters
      .filter((c) => c.ideaId === ideaId && (memoryDb.ideas.find((i) => i.id === ideaId)?.userId || memoryDb.ideas.find((i) => i.id === ideaId)?.user_id) === userId)
      .map((c) => ({
        id: c.id,
        ideaId: c.ideaId,
        type: c.type,
        summary: c.summary,
        sources: c.sources,
      }));
  }

  return {
    ideaId,
    status: clusters.length > 0 ? "completed" : "in_progress",
    clusters,
  };
}
