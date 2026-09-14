import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import dotenv from "dotenv";
dotenv.config({ path: "apps/api/.env", quiet: true });
const mode = process.argv[2];
const url = new URL(process.env.DATABASE_URL || "");
const bin =
  process.env.PG_BIN ||
  (process.platform === "win32"
    ? path.resolve(".local/pg-tools/pgsql/bin")
    : "");
const executable = (name) =>
  bin
    ? path.join(bin, name + (process.platform === "win32" ? ".exe" : ""))
    : name;
const env = {
  ...process.env,
  PGHOST: url.hostname,
  PGPORT: url.port || "5432",
  PGUSER: decodeURIComponent(url.username),
  PGPASSWORD: decodeURIComponent(url.password),
};
function run(name, args) {
  const result = spawnSync(executable(name), args, {
    env,
    stdio: "inherit",
    windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${name} failed`);
}
fs.mkdirSync(".local/backups", { recursive: true });
if (mode === "backup") {
  const file = path.resolve(
    `.local/backups/aster-${new Date().toISOString().replace(/[:.]/g, "-")}.dump`,
  );
  run("pg_dump", [
    "--format=custom",
    "--no-owner",
    "--file",
    file,
    "--dbname",
    url.pathname.slice(1),
  ]);
  fs.writeFileSync(".local/backups/latest.txt", file);
  console.log("Backup saved locally.");
} else if (mode === "restore-test") {
  const file = fs.readFileSync(".local/backups/latest.txt", "utf8");
  const name = `aster_restore_test_${Date.now()}`;
  run("createdb", [name]);
  try {
    run("pg_restore", [
      "--no-owner",
      "--exit-on-error",
      "--dbname",
      name,
      file,
    ]);
    run("psql", [
      "--dbname",
      name,
      "--command",
      'SELECT count(*) AS restored_services FROM "Service";',
    ]);
    console.log("Restore into a new isolated database passed.");
  } finally {
    run("dropdb", [name]);
  }
} else throw new Error("Use backup or restore-test");
