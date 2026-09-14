import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import dotenv from "dotenv";
dotenv.config({ path: "apps/api/.env", quiet: true });
const local = fs.existsSync(".local/database.json")
  ? JSON.parse(fs.readFileSync(".local/database.json", "utf8"))
  : null;
const databaseUrl =
  process.env.TEST_DATABASE_URL ||
  (local
    ? `postgresql://${local.user}:${local.password}@127.0.0.1:${local.port}/aster_test`
    : "");
if (!databaseUrl || !new URL(databaseUrl).pathname.endsWith("_test"))
  throw new Error(
    "Use a dedicated TEST_DATABASE_URL whose database name ends in _test",
  );
const env = {
  ...process.env,
  NODE_ENV: "test",
  DATABASE_URL: databaseUrl,
  APP_URL: "http://localhost:5173",
  API_URL: "http://localhost:4000",
  CORS_ORIGIN: "http://localhost:5173",
  JWT_ACCESS_SECRET: randomBytes(48).toString("hex"),
  DEV_SPAM_BYPASS: "true",
};
for (const args of [
  [
    "node_modules/prisma/build/index.js",
    "migrate",
    "deploy",
    "--schema",
    "apps/api/prisma/schema.prisma",
  ],
  ["--import", "tsx", "--test", "tests/api.integration.ts"],
]) {
  const result = spawnSync(process.execPath, args, { env, stdio: "inherit" });
  if (result.status) process.exit(result.status);
}
