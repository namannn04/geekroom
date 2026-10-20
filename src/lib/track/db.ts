import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
// The build imports this module to collect page data; only fail once something actually runs
if (!url && process.env.NEXT_PHASE !== "phase-production-build") throw new Error("DATABASE_URL is not set. Pull it with `vercel env pull` or see README.");

// Reuse one pool across hot reloads in dev and across requests on a warm function instance
const globalForDb = globalThis as unknown as { trackSql?: postgres.Sql };
const sql = globalForDb.trackSql ?? postgres(url ?? "", { max: 5, prepare: false });
if (process.env.NODE_ENV !== "production") globalForDb.trackSql = sql;

export const db = drizzle(sql, { schema });
