import { Pool } from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

let pool: Pool | null = null;
let isConnected = false;

const isProduction = process.env.NODE_ENV === "production";

// Fallback in-memory DB for smooth offline execution when PostgreSQL is not active
export const memoryDb = {
  users: [] as any[],
  ideas: [] as any[],
  research_clusters: [] as any[],
  project_plans: [] as any[],
  milestones: [] as any[],
  github_links: [] as any[],
  agent_interactions: [] as any[],
};

export function getDbPool(): Pool | null {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    if (isProduction) {
      throw new Error("DATABASE_URL must be configured in production.");
    }
    console.warn("⚠️ DATABASE_URL not provided. Using in-memory fallback database.");
    return null;
  }

  try {
    pool = new Pool({
      connectionString,
      connectionTimeoutMillis: 3000,
    });
    return pool;
  } catch (err) {
    if (isProduction) {
      throw new Error("Unable to initialize the PostgreSQL pool in production.");
    }
    console.warn("⚠️ Failed to instantiate Postgres Pool. Using in-memory database.");
    return null;
  }
}

export async function initDb(): Promise<boolean> {
  const p = getDbPool();
  if (!p) return false;

  try {
    const client = await p.connect();
    const schemaPath = path.join(__dirname, "schema.sql");
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, "utf8");
      await client.query(sql);
      console.log("✅ PostgreSQL schema initialized successfully (7 tables).");
    }
    client.release();
    isConnected = true;
    return true;
  } catch (err: unknown) {
    if (isProduction) {
      throw new Error("Unable to connect to PostgreSQL in production.");
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    console.warn(`⚠️ PostgreSQL connection error (${message}). Defaulting to in-memory store.`);
    isConnected = false;
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected;
}
