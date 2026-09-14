import "../src/config.js";
import fs from "node:fs";
import { db } from "../src/db.js";
import { passwordHash } from "../src/auth.js";
import { email, service } from "../src/validators.js";
try {
  const rows = JSON.parse(
    fs.readFileSync("apps/api/prisma/seed-services.json", "utf8"),
  );
  for (const raw of rows) {
    const data = service.parse(raw);
    await db.service.upsert({
      where: { slug: data.slug },
      create: data,
      update: {},
    });
  }
  const packages: string[] = JSON.parse(
    fs.readFileSync("apps/api/prisma/seed-packages.json", "utf8"),
  );
  for (const [sortOrder, name] of packages.entries())
    await db.package.upsert({
      where: { name },
      create: { name, sortOrder },
      update: {},
    });
  if (process.env.INITIAL_ADMIN_EMAIL && process.env.INITIAL_ADMIN_PASSWORD) {
    if (
      process.env.INITIAL_ADMIN_PASSWORD.length < 12 ||
      Buffer.byteLength(process.env.INITIAL_ADMIN_PASSWORD, "utf8") > 72
    )
      throw new Error(
        "Admin password must be at least 12 characters and at most 72 UTF-8 bytes",
      );
    const address = email.parse(process.env.INITIAL_ADMIN_EMAIL);
    if (!(await db.admin.findUnique({ where: { email: address } })))
      await db.admin.create({
        data: {
          email: address,
          passwordHash: await passwordHash(process.env.INITIAL_ADMIN_PASSWORD),
        },
      });
    console.log(
      "Admin bootstrap complete. Remove INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD from the environment.",
    );
  }
  console.log("Content seed complete; existing records were preserved.");
} finally {
  await db.$disconnect();
}
