import { FastifyInstance } from "fastify";
import { z } from "zod";
import { validateIdea } from "../agents/validation";
import { processResearchForIdea, getResearchStatus } from "../agents/research";
import { generatePlanForIdea } from "../agents/planGeneration";
import { scaffoldGitHubRepo } from "../agents/githubAppScaffolder";
import { handleTelegramWebhook } from "../agents/telegramAgent";
import { getDbPool, memoryDb, isDbConnected } from "../db/db";

export async function apiRoutes(fastify: FastifyInstance) {
  // 1. POST /api/idea -> Validation Agent
  fastify.post("/api/idea", async (request, reply) => {
    try {
      const bodySchema = z.object({
        text: z.string().min(3, "Idea text must be at least 3 characters"),
        userId: z.string().optional(),
      });
      const parsed = bodySchema.parse(request.body);
      const result = await validateIdea(parsed.text, parsed.userId);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || "Invalid request body" });
    }
  });

  // 2. POST /api/idea/:id/research -> Research Agent (trigger job)
  fastify.post("/api/idea/:id/research", async (request, reply) => {
    try {
      const paramsSchema = z.object({ id: z.string().uuid().or(z.string().min(1)) });
      const { id } = paramsSchema.parse(request.params);
      const result = await processResearchForIdea(id);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || "Failed to launch research" });
    }
  });

  // 3. GET /api/idea/:id/research/status -> Research Agent (polling status)
  fastify.get("/api/idea/:id/research/status", async (request, reply) => {
    try {
      const paramsSchema = z.object({ id: z.string() });
      const { id } = paramsSchema.parse(request.params);
      const result = await getResearchStatus(id);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || "Failed to fetch research status" });
    }
  });

  // 4. POST /api/idea/:id/plan -> Plan Generation Agent
  fastify.post("/api/idea/:id/plan", async (request, reply) => {
    try {
      const paramsSchema = z.object({ id: z.string() });
      const { id } = paramsSchema.parse(request.params);
      const plan = await generatePlanForIdea(id);
      return reply.send(plan);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || "Failed to generate project plan" });
    }
  });

  // 5. POST /api/plan/:id/github-scaffold -> GitHub App Agent
  fastify.post("/api/plan/:id/github-scaffold", async (request, reply) => {
    try {
      const paramsSchema = z.object({ id: z.string() });
      const { id } = paramsSchema.parse(request.params);
      const result = await scaffoldGitHubRepo(id);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || "Failed to scaffold GitHub repository" });
    }
  });

  // 6. GET /api/dashboard -> Aggregate View
  fastify.get("/api/dashboard", async (request, reply) => {
    const pool = getDbPool();
    let ideas: any[] = [];
    let plans: any[] = [];
    let githubLinks: any[] = [];
    let interactions: any[] = [];

    if (isDbConnected() && pool) {
      const ideasRes = await pool.query("SELECT * FROM ideas ORDER BY created_at DESC");
      const plansRes = await pool.query("SELECT * FROM project_plans ORDER BY created_at DESC");
      const linksRes = await pool.query("SELECT * FROM github_links ORDER BY installed_at DESC");
      const interRes = await pool.query("SELECT * FROM agent_interactions ORDER BY created_at DESC LIMIT 10");

      ideas = ideasRes.rows;
      plans = plansRes.rows;
      githubLinks = linksRes.rows;
      interactions = interRes.rows;
    } else {
      ideas = memoryDb.ideas;
      plans = memoryDb.project_plans;
      githubLinks = memoryDb.github_links;
      interactions = memoryDb.agent_interactions;
    }

    return reply.send({
      ideasCount: ideas.length,
      plansCount: plans.length,
      githubReposCount: githubLinks.length,
      ideas,
      plans,
      githubLinks,
      interactions,
    });
  });

  // 7. POST /api/agent/webhook -> Telegram Webhook Handler
  fastify.post("/api/agent/webhook", async (request, reply) => {
    try {
      const result = await handleTelegramWebhook(request.body);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  });
}
