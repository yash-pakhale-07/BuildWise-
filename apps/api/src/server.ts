import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { initDb } from "./db/db";
import { apiRoutes } from "./routes/api";

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
  await server.register(apiRoutes);

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
