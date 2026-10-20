import { defineConfig } from "drizzle-kit";

// drizzle-kit doesn't read Next's env files, so pull in .env.local when it exists
try {
  process.loadEnvFile(".env.local");
} catch {}

export default defineConfig({
  schema: "./src/lib/track/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
