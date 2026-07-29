import { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDbPool, isDbConnected, memoryDb } from "../db/db";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth";
import crypto from "crypto"; // For generating memory UUID

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").transform((val) => val.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address").transform((val) => val.toLowerCase()),
  password: z.string(),
});

export async function authRoutes(fastify: FastifyInstance) {
  // POST /api/auth/register
  fastify.post("/api/auth/register", async (request, reply) => {
    try {
      const parsed = registerSchema.parse(request.body);
      const { name, email, password } = parsed;

      const pool = getDbPool();
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      let user: any = null;

      if (isDbConnected() && pool) {
        // Check if user exists
        const existingUserRes = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
        if (existingUserRes.rowCount && existingUserRes.rowCount > 0) {
          return reply.status(409).send({ error: "User with this email already exists" });
        }

        // Insert new user
        const insertRes = await pool.query(
          "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, preferred_language, created_at",
          [name, email, passwordHash]
        );
        user = insertRes.rows[0];
      } else {
        // Memory fallback
        const existingUser = memoryDb.users.find((u) => u.email === email);
        if (existingUser) {
          return reply.status(409).send({ error: "User with this email already exists" });
        }

        user = {
          id: crypto.randomUUID(),
          name,
          email,
          password_hash: passwordHash,
          preferred_language: "en",
          created_at: new Date().toISOString()
        };
        memoryDb.users.push(user);
        
        // Don't return password_hash
        const { password_hash, ...userWithoutHash } = user;
        user = userWithoutHash;
      }

      return reply.status(201).send({ message: "User registered successfully", user });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({ error: "Validation failed", details: err.errors });
      }
      fastify.log.error(err);
      return reply.status(500).send({ error: "Failed to register user" });
    }
  });

  // POST /api/auth/login
  fastify.post("/api/auth/login", async (request, reply) => {
    try {
      const parsed = loginSchema.parse(request.body);
      const { email, password } = parsed;

      const pool = getDbPool();
      let user: any = null;

      if (isDbConnected() && pool) {
        const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (!userRes.rowCount || userRes.rowCount === 0) {
          return reply.status(401).send({ error: "Invalid credentials" });
        }
        user = userRes.rows[0];
      } else {
        // Memory fallback
        const memUser = memoryDb.users.find((u) => u.email === email);
        if (!memUser) {
          return reply.status(401).send({ error: "Invalid credentials" });
        }
        user = memUser;
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return reply.status(401).send({ error: "Invalid credentials" });
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        fastify.log.error("JWT_SECRET is missing");
        return reply.status(500).send({ error: "Internal server error" });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        secret,
        { expiresIn: "7d" } // Reasonable expiration
      );

      // Don't return password_hash
      const { password_hash, ...userWithoutHash } = user;

      return reply.send({ token, user: userWithoutHash });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({ error: "Validation failed", details: err.errors });
      }
      fastify.log.error(err);
      return reply.status(500).send({ error: "Failed to log in" });
    }
  });

  // GET /api/auth/me
  fastify.get("/api/auth/me", { preHandler: [authMiddleware] }, async (request: AuthenticatedRequest, reply) => {
    try {
      if (!request.user) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const { id } = request.user;
      const pool = getDbPool();
      let user: any = null;

      if (isDbConnected() && pool) {
        const userRes = await pool.query(
          "SELECT id, name, email, preferred_language, created_at FROM users WHERE id = $1",
          [id]
        );
        if (!userRes.rowCount || userRes.rowCount === 0) {
          return reply.status(404).send({ error: "User not found" });
        }
        user = userRes.rows[0];
      } else {
        // Memory fallback
        const memUser = memoryDb.users.find((u) => u.id === id);
        if (!memUser) {
          return reply.status(404).send({ error: "User not found" });
        }
        const { password_hash, ...userWithoutHash } = memUser;
        user = userWithoutHash;
      }

      return reply.send(user);
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: "Failed to fetch user data" });
    }
  });
}
