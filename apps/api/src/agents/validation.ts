import { getInsightsLayer2Client } from "../clients/insightsLayer2";
import { getDbPool, memoryDb, isDbConnected } from "../db/db";
import { randomUUID } from "crypto";

export async function validateIdea(rawText: string, userId?: string) {
  const insightsClient = getInsightsLayer2Client();
  
  // 1. Fetch signal and perform initial search
  const signal = await insightsClient.getRealTimeSignal(rawText);
  const searchResults = await insightsClient.deepSearch(rawText, ["web", "ieee_xplore"]);

  const noveltyScore = signal.noveltyScore;
  if (!Number.isInteger(noveltyScore) || noveltyScore < 0 || noveltyScore > 100) {
    throw new Error("AI validation returned an invalid novelty score");
  }
  const feasibilityNotes = signal.notes + ` Identified ${searchResults.length} related academic & web reference benchmarks.`;
  const ideaId = randomUUID();
  const status = "validated";

  // 2. Persist to DB or Memory Fallback
  const pool = getDbPool();
  if (isDbConnected() && pool) {
    try {
      await pool.query(
        `INSERT INTO ideas (id, user_id, raw_text, novelty_score, feasibility_notes, status)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [ideaId, userId || null, rawText, noveltyScore, feasibilityNotes, status]
      );
    } catch (err: any) {
      console.warn("DB insert error, falling back to memory store:", err.message);
      memoryDb.ideas.push({ id: ideaId, userId, rawText, noveltyScore, feasibilityNotes, status, createdAt: new Date() });
    }
  } else {
    memoryDb.ideas.push({ id: ideaId, userId, rawText, noveltyScore, feasibilityNotes, status, createdAt: new Date() });
  }

  return {
    idea: {
      id: ideaId,
      rawText,
      noveltyScore,
      feasibilityNotes,
      status,
    },
    validation: {
      noveltyScore,
      demandScore: signal.demandScore,
      notes: signal.notes,
    },
    // Retained for existing clients while they migrate to the canonical nested shape.
    ideaId,
    noveltyScore,
    feasibilityNotes,
    status,
    signal,
  };
}
