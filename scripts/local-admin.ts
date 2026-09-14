import fs from "node:fs";
import { randomBytes } from "node:crypto";
import { config } from "../apps/api/src/config.js";
import { db } from "../apps/api/src/db.js";
import { passwordHash } from "../apps/api/src/auth.js";
if (
  config.NODE_ENV !== "development" ||
  !["localhost", "127.0.0.1"].includes(new URL(config.DATABASE_URL).hostname)
)
  throw new Error(
    "Local admin creation is restricted to the development database on loopback",
  );
try {
  if (!(await db.admin.count())) {
    const password = randomBytes(24).toString("base64url");
    const email = "owner@aster.local";
    await db.admin.create({
      data: { email, passwordHash: await passwordHash(password) },
    });
    fs.mkdirSync(".local", { recursive: true });
    fs.writeFileSync(
      ".local/admin-access.txt",
      `Local development only\nURL: http://localhost:5173/admin\nEmail: ${email}\nPassword: ${password}\n\nGenerated uniquely for this local installation. Do not copy this account to production. Change your password in Admin > Settings.\n`,
    );
    console.log(
      "Created a unique local admin account. Access details: .local/admin-access.txt",
    );
  } else
    console.log("An admin already exists; no account or password was changed.");
} finally {
  await db.$disconnect();
}
