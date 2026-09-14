import dotenv from "dotenv";
import { spawnSync } from "node:child_process";
dotenv.config({ path: "apps/api/.env", quiet: true });
const result = spawnSync(
  process.execPath,
  [
    "node_modules/prisma/build/index.js",
    ...process.argv.slice(2),
    "--schema",
    "apps/api/prisma/schema.prisma",
  ],
  { stdio: "inherit", env: process.env },
);
process.exit(result.status ?? 1);
