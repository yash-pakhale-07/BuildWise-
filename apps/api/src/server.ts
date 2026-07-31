import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { getDbPool, initDb, isDbConnected } from "./db/db";
import { apiRoutes } from "./routes/api";
import { authRoutes } from "./routes/auth";
import { ideasRoutes } from "./routes/ideas";

dotenv.config();

const server = Fastify({
  logger: true,
});

async function startServer() {
  await server.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  });

  await initDb();

  if (isDbConnected()) {
    console.log("Database mode: PostgreSQL");
    const pool = getDbPool();
    if (pool) {
      try {
        const dbRes = await pool.query("SELECT current_database();");
        const countRes = await pool.query("SELECT COUNT(*) FROM users;");
        console.log(`Database connected: ${dbRes.rows[0].current_database}`);
        console.log(`Users in database: ${countRes.rows[0].count}`);
      } catch (e) {
        // ignore
      }
    }
  } else {
    console.log("Database mode: In-memory fallback");
  }

  await server.register(apiRoutes);
  await server.register(authRoutes);
  await server.register(ideasRoutes);

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
  
  try {
    await server.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`🚀 BuildWise API running on http://localhost:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

startServer();
