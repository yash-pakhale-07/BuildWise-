import { FastifyInstance } from "fastify";
import { z } from "zod";
import { validateIdea } from "../agents/validation";
import { processResearchForIdea, getResearchStatus } from "../agents/research";
import { generatePlanForIdea } from "../agents/planGeneration";
import { generateHackathonReportForIdea, regenerateReportSection } from "../agents/reportGeneration";
import { scaffoldGitHubRepo } from "../agents/githubAppScaffolder";
import { handleTelegramWebhook } from "../agents/telegramAgent";
import { getDbPool, memoryDb, isDbConnected } from "../db/db";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth";

export async function apiRoutes(fastify: FastifyInstance) {
  // 1. POST /api/idea -> Validation Agent
  fastify.post("/api/idea", { preHandler: [authMiddleware] }, async (request: AuthenticatedRequest, reply) => {
    try {
      const bodySchema = z.object({
        text: z.string().min(3, "Idea text must be at least 3 characters"),
      });
      const parsed = bodySchema.parse(request.body);
      const result = await validateIdea(parsed.text, request.user!.id);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || "Invalid request body" });
    }
  });

  // 2. POST /api/idea/:id/research -> Research Agent (trigger job)
  fastify.post("/api/idea/:id/research", { preHandler: [authMiddleware] }, async (request: AuthenticatedRequest, reply) => {
    try {
      const paramsSchema = z.object({ id: z.string().uuid().or(z.string().min(1)) });
      const { id } = paramsSchema.parse(request.params);
      const result = await processResearchForIdea(id, request.user!.id);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || "Failed to launch research" });
    }
  });

  // 3. GET /api/idea/:id/research/status -> Research Agent (polling status)
  fastify.get("/api/idea/:id/research/status", { preHandler: [authMiddleware] }, async (request: AuthenticatedRequest, reply) => {
    try {
      const paramsSchema = z.object({ id: z.string() });
      const { id } = paramsSchema.parse(request.params);
      const result = await getResearchStatus(id, request.user!.id);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || "Failed to fetch research status" });
    }
  });

  // 4. POST /api/idea/:id/plan -> Plan Generation Agent
  fastify.post("/api/idea/:id/plan", { preHandler: [authMiddleware] }, async (request: AuthenticatedRequest, reply) => {
    try {
      const paramsSchema = z.object({ id: z.string() });
      const { id } = paramsSchema.parse(request.params);
      const plan = await generatePlanForIdea(id, request.user!.id);
      return reply.send(plan);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || "Failed to generate project plan" });
    }
  });

  // 5. POST /api/idea/:id/report -> Hackathon Report Generator
  fastify.post("/api/idea/:id/report", { preHandler: [authMiddleware] }, async (request: AuthenticatedRequest, reply) => {
    try {
      const paramsSchema = z.object({ id: z.string() });
      const { id } = paramsSchema.parse(request.params);
      const report = await generateHackathonReportForIdea(id, request.user!.id);
      return reply.send(report);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || "Failed to generate hackathon report" });
    }
  });

  // 6. POST /api/idea/:id/report/regenerate-section -> Regenerate Single Section
  fastify.post("/api/idea/:id/report/regenerate-section", { preHandler: [authMiddleware] }, async (request: AuthenticatedRequest, reply) => {
    try {
      const paramsSchema = z.object({ id: z.string() });
      const bodySchema = z.object({
        sectionKey: z.string(),
        currentData: z.any().optional(),
      });
      const { id } = paramsSchema.parse(request.params);
      const { sectionKey, currentData } = bodySchema.parse(request.body);
      const updatedSection = await regenerateReportSection(id, request.user!.id, sectionKey, currentData);
      return reply.send({ sectionKey, data: updatedSection });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || "Failed to regenerate report section" });
    }
  });

  // 7. POST /api/plan/:id/github-scaffold -> GitHub App Agent
  fastify.post("/api/plan/:id/github-scaffold", { preHandler: [authMiddleware] }, async (request: AuthenticatedRequest, reply) => {
    try {
      const paramsSchema = z.object({ id: z.string() });
      const { id } = paramsSchema.parse(request.params);
      const result = await scaffoldGitHubRepo(id, request.user!.id);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || "Failed to scaffold GitHub repository" });
    }
  });

  // 6. GET /api/dashboard -> Aggregate View
  fastify.get("/api/dashboard", { preHandler: [authMiddleware] }, async (request: AuthenticatedRequest, reply) => {
    const pool = getDbPool();
    let ideas: any[] = [];
    let plans: any[] = [];
    let githubLinks: any[] = [];
    let interactions: any[] = [];

    if (isDbConnected() && pool) {
      const ideasRes = await pool.query(
        `SELECT id, user_id AS "userId", raw_text AS "rawText", novelty_score AS "noveltyScore",
                feasibility_notes AS "feasibilityNotes", status, created_at AS "createdAt"
         FROM ideas WHERE user_id = $1 ORDER BY created_at DESC`,
        [request.user!.id]
      );
      const plansRes = await pool.query("SELECT p.* FROM project_plans p JOIN ideas i ON i.id = p.idea_id WHERE i.user_id = $1 ORDER BY p.created_at DESC", [request.user!.id]);
      const linksRes = await pool.query("SELECT gl.* FROM github_links gl JOIN project_plans p ON p.id = gl.plan_id JOIN ideas i ON i.id = p.idea_id WHERE i.user_id = $1 ORDER BY gl.installed_at DESC", [request.user!.id]);
      const interRes = await pool.query("SELECT * FROM agent_interactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10", [request.user!.id]);

      ideas = ideasRes.rows;
      plans = plansRes.rows;
      githubLinks = linksRes.rows;
      interactions = interRes.rows;
    } else {
      ideas = memoryDb.ideas.filter((idea) => (idea.userId || idea.user_id) === request.user!.id);
      const ideaIds = new Set(ideas.map((idea) => idea.id));
      plans = memoryDb.project_plans.filter((plan) => ideaIds.has(plan.ideaId));
      const planIds = new Set(plans.map((plan) => plan.id));
      githubLinks = memoryDb.github_links.filter((link) => planIds.has(link.planId));
      interactions = memoryDb.agent_interactions.filter((interaction) => interaction.userId === request.user!.id);
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
