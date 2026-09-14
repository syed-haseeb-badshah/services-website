import EmbeddedPostgres from "embedded-postgres";
import fs from "node:fs";
import { randomBytes } from "node:crypto";
fs.mkdirSync(".local", { recursive: true });
const credentialPath = ".local/database.json";
const credentials = fs.existsSync(credentialPath)
  ? JSON.parse(fs.readFileSync(credentialPath, "utf8"))
  : { user: "aster", password: randomBytes(24).toString("hex"), port: 54329 };
fs.writeFileSync(credentialPath, JSON.stringify(credentials));
const pg = new EmbeddedPostgres({
  ...credentials,
  databaseDir: ".local/postgres",
  persistent: true,
  authMethod: "scram-sha-256",
  postgresFlags: ["-h", "127.0.0.1"],
  onLog: () => {},
  onError: (message) => console.error(String(message)),
});
if (!fs.existsSync(".local/postgres/PG_VERSION")) await pg.initialise();
await pg.start();
const client = pg.getPgClient();
await client.connect();
for (const name of ["aster_digital", "aster_test"]) {
  const result = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [name],
  );
  if (!result.rowCount) await pg.createDatabase(name);
}
await client.end();
if (!fs.existsSync("apps/api/.env")) {
  fs.writeFileSync(
    "apps/api/.env",
    `NODE_ENV=development\nPORT=4000\nAPP_URL=http://localhost:5173\nAPI_URL=http://localhost:4000\nCORS_ORIGIN=http://localhost:5173\nDATABASE_URL=postgresql://${credentials.user}:${credentials.password}@127.0.0.1:${credentials.port}/aster_digital\nJWT_ACCESS_SECRET=${randomBytes(48).toString("hex")}\nDEV_SPAM_BYPASS=true\n`,
  );
}
console.log(
  "Local PostgreSQL ready on 127.0.0.1:54329. Credentials stay in ignored .local/database.json.",
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => {
    void pg.stop().then(() => process.exit(0));
  });
