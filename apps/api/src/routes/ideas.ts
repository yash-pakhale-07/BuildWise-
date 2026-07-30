import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getDbPool, isDbConnected, memoryDb } from "../db/db";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth";
import crypto from "crypto";

const ideaSchema = z.object({
  raw_text: z.string().trim().min(3, "Idea text must be at least 3 characters"),
});

export async function ideasRoutes(fastify: FastifyInstance) {
  // POST /api/ideas
  fastify.post(
    "/api/ideas",
    { preHandler: [authMiddleware] },
    async (request: AuthenticatedRequest, reply) => {
      try {
        if (!request.user) {
          return reply.status(401).send({ error: "Unauthorized" });
        }

        const { id: userId } = request.user;
        const parsed = ideaSchema.parse(request.body);
        const { raw_text } = parsed;

        const pool = getDbPool();
        let idea: any = null;

        if (isDbConnected() && pool) {
          const insertRes = await pool.query(
            `INSERT INTO ideas (user_id, raw_text, status)
             VALUES ($1, $2, 'validating')
             RETURNING id, user_id, raw_text, novelty_score, feasibility_notes, status, created_at`,
            [userId, raw_text]
          );
          idea = insertRes.rows[0];
        } else {
          // Memory fallback
          idea = {
            id: crypto.randomUUID(),
            user_id: userId,
            raw_text,
            novelty_score: null,
            feasibility_notes: null,
            status: "validating",
            created_at: new Date().toISOString(),
          };
          memoryDb.ideas.push(idea);
        }

        return reply.status(201).send(idea);
      } catch (err: any) {
        if (err instanceof z.ZodError) {
          return reply.status(400).send({ error: "Validation failed", details: err.errors });
        }
        fastify.log.error(err);
        return reply.status(500).send({ error: "Failed to create idea" });
      }
    }
  );

  // GET /api/ideas
  fastify.get(
    "/api/ideas",
    { preHandler: [authMiddleware] },
    async (request: AuthenticatedRequest, reply) => {
      try {
        if (!request.user) {
          return reply.status(401).send({ error: "Unauthorized" });
        }

        const { id: userId } = request.user;
        const pool = getDbPool();
        let ideas: any[] = [];

        if (isDbConnected() && pool) {
          const res = await pool.query(
            "SELECT * FROM ideas WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
          );
          ideas = res.rows;
        } else {
          // Memory fallback
          ideas = memoryDb.ideas
            .filter((i) => i.user_id === userId)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }

        return reply.send(ideas);
      } catch (err: any) {
        fastify.log.error(err);
        return reply.status(500).send({ error: "Failed to retrieve ideas" });
      }
    }
  );

  // GET /api/ideas/:id
  fastify.get(
    "/api/ideas/:id",
    { preHandler: [authMiddleware] },
    async (request: AuthenticatedRequest, reply) => {
      try {
        if (!request.user) {
          return reply.status(401).send({ error: "Unauthorized" });
        }

        const paramsSchema = z.object({ id: z.string().uuid().or(z.string().min(1)) });
        const { id: ideaId } = paramsSchema.parse(request.params);
        const { id: userId } = request.user;

        const pool = getDbPool();
        let idea: any = null;

        if (isDbConnected() && pool) {
          const res = await pool.query(
            "SELECT * FROM ideas WHERE id = $1 AND user_id = $2",
            [ideaId, userId]
          );
          if (res.rowCount === 0) {
            return reply.status(404).send({ error: "Idea not found" });
          }
          idea = res.rows[0];
        } else {
          // Memory fallback
          idea = memoryDb.ideas.find((i) => i.id === ideaId && i.user_id === userId);
          if (!idea) {
            return reply.status(404).send({ error: "Idea not found" });
          }
        }

        return reply.send(idea);
      } catch (err: any) {
        if (err instanceof z.ZodError) {
          return reply.status(400).send({ error: "Invalid idea ID format", details: err.errors });
        }
        fastify.log.error(err);
        return reply.status(500).send({ error: "Failed to retrieve idea" });
      }
    }
  );
}
