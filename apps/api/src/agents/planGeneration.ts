import { getInsightsLayer2Client } from "../clients/insightsLayer2";
import { getResearchStatus } from "./research";
import { getDbPool, memoryDb, isDbConnected } from "../db/db";
import { ProjectPlan } from "@buildwise/shared";
import { randomUUID } from "crypto";

export async function generatePlanForIdea(ideaId: string, userId: string): Promise<ProjectPlan> {
  const pool = getDbPool();
  let rawText = "Satellite AI Data Compression";

  if (isDbConnected() && pool) {
    const res = await pool.query("SELECT raw_text FROM ideas WHERE id = $1 AND user_id = $2", [ideaId, userId]);
    if (res.rows.length > 0) rawText = res.rows[0].raw_text;
  } else {
    const found = memoryDb.ideas.find((i) => i.id === ideaId && (i.userId || i.user_id) === userId);
    if (found) rawText = found.rawText;
  }

  if (!rawText) throw new Error("Idea not found");

  const { clusters } = await getResearchStatus(ideaId, userId);
  const insightsClient = getInsightsLayer2Client();
  const planData = await insightsClient.generateProjectPlan(rawText, clusters);

  const planId = randomUUID();
  planData.id = planId;
  planData.ideaId = ideaId;

  // Persist project plan and explode milestones
  if (isDbConnected() && pool) {
    await pool.query(
      `INSERT INTO project_plans (id, idea_id, architecture, tech_stack, milestones, datasets, repos, generated_doc)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        planId,
        ideaId,
        JSON.stringify(planData.architecture),
        JSON.stringify(planData.techStack),
        JSON.stringify(planData.milestones),
        JSON.stringify(planData.datasets),
        JSON.stringify(planData.repos),
        planData.generatedDoc,
      ]
    );

    for (const m of planData.milestones) {
      const milestoneId = randomUUID();
      m.id = milestoneId;
      m.planId = planId;
      const dueDate = new Date(Date.now() + (m.dueInDays || 7) * 86400000).toISOString().split("T")[0];
      await pool.query(
        `INSERT INTO milestones (id, plan_id, title, due_date, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [milestoneId, planId, m.title, dueDate, m.status || "pending"]
      );
    }

    await pool.query("UPDATE ideas SET status = 'planned' WHERE id = $1", [ideaId]);
  } else {
    memoryDb.project_plans.push({
      id: planId,
      ideaId,
      architecture: planData.architecture,
      techStack: planData.techStack,
      milestones: planData.milestones,
      datasets: planData.datasets,
      repos: planData.repos,
      generatedDoc: planData.generatedDoc,
      createdAt: new Date(),
    });

    for (const m of planData.milestones) {
      const milestoneId = randomUUID();
      m.id = milestoneId;
      m.planId = planId;
      memoryDb.milestones.push({
        id: milestoneId,
        planId,
        title: m.title,
        dueDate: new Date(Date.now() + (m.dueInDays || 7) * 86400000).toISOString().split("T")[0],
        status: m.status || "pending",
        reminderSent: false,
      });
    }

    const found = memoryDb.ideas.find((i) => i.id === ideaId);
    if (found) found.status = "planned";
  }

  return planData;
}
