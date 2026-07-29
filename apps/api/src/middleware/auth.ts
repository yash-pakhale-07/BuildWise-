import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: string;
    email: string;
  };
}

export async function authMiddleware(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply.status(401).send({ error: "Missing or invalid authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // It's a server error if secret is missing, not a client auth error, but let's log it and fail.
      console.error("JWT_SECRET is missing from environment variables.");
      return reply.status(500).send({ error: "Internal server error" });
    }

    const decoded = jwt.verify(token, secret) as { id: string; email: string };
    request.user = decoded;
  } catch (err: any) {
    return reply.status(401).send({ error: "Invalid or expired token" });
  }
}
