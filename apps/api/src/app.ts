import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import { z, ZodError } from "zod";
import { Prisma } from "@prisma/client";
import * as Sentry from "@sentry/node";
import { randomUUID } from "node:crypto";
import { config } from "./config.js";
import { db } from "./db.js";
import * as v from "./validators.js";
import {
  authenticate,
  clearCookies,
  csrf,
  hash,
  issue,
  randomToken,
  requireOrigin,
  passwordHash,
  verifyPassword,
} from "./auth.js";
import { checkSpam, mail, publicSettings } from "./integrations.js";

export const app = express();
app.disable("x-powered-by");
app.set("trust proxy", config.TRUST_PROXY);
app.use(helmet());
app.use((req, res, next) => {
  const requestId = randomUUID();
  res.setHeader("X-Request-ID", requestId);
  const start = Date.now();
  res.on("finish", () =>
    console.log(
      JSON.stringify({
        requestId,
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration: Date.now() - start,
      }),
    ),
  );
  next();
});
app.use(
  cors((req, done) =>
    done(null, {
      origin: config.CORS_ORIGIN.split(","),
      credentials: req.url.startsWith("/api/admin"),
      allowedHeaders: ["Content-Type", "X-CSRF-Token"],
    }),
  ),
);
app.use(express.json({ limit: "32kb" }), cookieParser());
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);
app.use("/api/admin", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});
const formLimit = rateLimit({
  windowMs: 15 * 60000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
const loginLimit = rateLimit({
  windowMs: 15 * 60000,
  limit: 15,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
const audit = (
  tx: Prisma.TransactionClient,
  adminId: string,
  action: string,
  entity: string,
  entityId?: string,
) => tx.auditLog.create({ data: { adminId, action, entity, entityId } });
const getId = (req: express.Request) => v.id.parse(req.params.id);
const emptyQuery = (req: express.Request) =>
  z.object({}).strict().parse(req.query);
export const csv = (rows: Record<string, unknown>[], columns: string[]) =>
  "\uFEFF" +
  [columns, ...rows.map((row) => columns.map((key) => row[key] ?? ""))]
    .map((row) =>
      row
        .map((value) => {
          let text =
            value instanceof Date ? value.toISOString() : String(value);
          if (/^[\s]*[=+\-@\t\r]/.test(text)) text = "'" + text;
          return '"' + text.replace(/"/g, '""') + '"';
        })
        .join(","),
    )
    .join("\r\n");
function sendCsv(
  res: express.Response,
  rows: Record<string, unknown>[],
  columns: string[],
  name: string,
) {
  res.attachment(`${name}.csv`).type("text/csv").send(csv(rows, columns));
}
function filters(req: express.Request) {
  const q = v.pagination.parse(req.query);
  return {
    q,
    skip: (q.page - 1) * q.limit,
    take: q.limit,
    where: {
      ...(q.status ? { status: q.status } : {}),
      ...(q.service ? { serviceName: q.service } : {}),
      ...(q.from || q.to
        ? {
            createdAt: {
              ...(q.from ? { gte: new Date(q.from) } : {}),
              ...(q.to
                ? { lt: new Date(new Date(q.to).getTime() + 86400000) }
                : {}),
            },
          }
        : {}),
    },
  };
}
app.get("/api/health", async (req, res) => {
  emptyQuery(req);
  await db.siteSetting.count();
  res.json({ status: "ok" });
});
app.get("/api/settings/public", async (req, res) => {
  emptyQuery(req);
  res.json(await publicSettings());
});
app.get("/api/packages", async (req, res) => {
  emptyQuery(req);
  res.json(
    (
      await db.package.findMany({ orderBy: { sortOrder: "asc" }, take: 100 })
    ).map((row) => row.name),
  );
});
app.get("/api/services", async (req, res) => {
  const q = v.pagination.parse(req.query);
  const where = { isPublished: true };
  const [items, total] = await Promise.all([
    db.service.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      skip: (q.page - 1) * q.limit,
      take: q.limit,
    }),
    db.service.count({ where }),
  ]);
  res.json({ items, total, page: q.page });
});
app.get("/api/services/:slug", async (req, res) => {
  emptyQuery(req);
  const slug = v.service.shape.slug.parse(req.params.slug);
  const service = await db.service.findFirst({
    where: { slug, isPublished: true },
  });
  if (!service) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json(service);
});
app.post("/api/contact", formLimit, requireOrigin, async (req, res) => {
  const body = v.contact.parse(req.body);
  if (!(await checkSpam(body, req.ip || "", "contact"))) {
    res
      .status(422)
      .json({ error: "Please complete the spam check and try again." });
    return;
  }
  const { website_url, turnstileToken, ...data } = body;
  await db.$transaction(async (tx) => {
    if (await tx.lead.findUnique({ where: { eventId: data.eventId } })) return;
    await tx.lead.create({ data });
    await tx.outbox.create({
      data: mail(
        process.env.LEAD_NOTIFICATION_TO || "",
        "New Aster Digital enquiry",
        `${data.name}\n${data.email}\n${data.phone || ""}\n${data.description}`,
      ),
    });
    await tx.outbox.create({
      data: mail(
        data.email,
        "We received your enquiry",
        "Thank you for contacting Aster Digital. Your enquiry has been received. We will be in touch to discuss the next step.",
      ),
    });
  });
  res.status(202).json({ accepted: true, eventId: data.eventId });
});
app.post("/api/newsletter", formLimit, requireOrigin, async (req, res) => {
  const body = v.newsletter.parse(req.body);
  if (!(await checkSpam(body, req.ip || "", "newsletter"))) {
    res
      .status(422)
      .json({ error: "Please complete the spam check and try again." });
    return;
  }
  await db.$transaction(async (tx) => {
    const existing = await tx.newsletterSubscriber.findUnique({
      where: { email: body.email },
    });
    if (existing?.isConfirmed && !existing.unsubscribedAt) return;
    if (
      existing?.tokenExpiresAt &&
      existing.tokenExpiresAt.getTime() > Date.now() + 23 * 3600000
    )
      return;
    const token = randomToken();
    const unsubscribe = randomToken();
    const data = {
      tokenHash: hash(token),
      tokenExpiresAt: new Date(Date.now() + 86400000),
      unsubscribeHash: hash(unsubscribe),
      isConfirmed: false,
      confirmedAt: null,
    };
    await tx.newsletterSubscriber.upsert({
      where: { email: body.email },
      create: { email: body.email, ...data },
      update: data,
    });
    await tx.outbox.create({
      data: mail(
        body.email,
        "Confirm your Aster Digital subscription",
        `Confirm your subscription within 24 hours:\n${config.APP_URL}/newsletter/confirm#${token}\n\nUnsubscribe at any time:\n${config.APP_URL}/newsletter/unsubscribe#${unsubscribe}`,
      ),
    });
  });
  res.status(202).json({
    message:
      "If confirmation is needed, check your email for a confirmation link.",
  });
});
for (const action of ["confirm", "unsubscribe"] as const)
  app.post(
    `/api/newsletter/${action}`,
    formLimit,
    requireOrigin,
    async (req, res) => {
      const { token } = z.object({ token: v.token }).strict().parse(req.body);
      const result = await db.newsletterSubscriber.updateMany({
        where:
          action === "confirm"
            ? { tokenHash: hash(token), tokenExpiresAt: { gt: new Date() } }
            : { unsubscribeHash: hash(token) },
        data:
          action === "confirm"
            ? {
                isConfirmed: true,
                confirmedAt: new Date(),
                unsubscribedAt: null,
                tokenHash: null,
                tokenExpiresAt: null,
              }
            : {
                isConfirmed: false,
                unsubscribedAt: new Date(),
                tokenHash: null,
                tokenExpiresAt: null,
              },
      });
      if (!result.count) {
        res.status(400).json({ error: "This link is invalid or expired." });
        return;
      }
      res.json({
        message:
          action === "confirm"
            ? "Subscription confirmed."
            : "You have been unsubscribed.",
      });
    },
  );
app.post("/api/track/event", requireOrigin, async (req, res) => {
  const data = v.tracking.parse(req.body);
  const settings = await publicSettings();
  await db.$transaction(async (tx) => {
    if (await tx.trackingEvent.findUnique({ where: { id: data.eventId } }))
      return;
    const lead =
      data.eventName === "Lead"
        ? await tx.lead.findFirst({
            where: { eventId: data.eventId, deletedAt: null },
          })
        : null;
    if (data.eventName === "Lead" && !lead)
      throw new Error("Unknown lead conversion");
    await tx.trackingEvent.create({
      data: { id: data.eventId, name: data.eventName },
    });
    if (
      settings["pixels.meta_pixel_id"] &&
      process.env.META_CONVERSIONS_API_ACCESS_TOKEN
    )
      await tx.outbox.create({
        data: {
          kind: "meta",
          payload: {
            ...data,
            ...(lead ? { email: lead.email, phone: lead.phone } : {}),
          },
        },
      });
    if (settings["pixels.ga4_measurement_id"] && process.env.GA4_API_SECRET)
      await tx.outbox.create({ data: { kind: "ga4", payload: data } });
  });
  res.status(202).json({ accepted: true });
});
app.post("/api/admin/login", loginLimit, requireOrigin, async (req, res) => {
  const body = v.login.parse(req.body);
  const key = hash(body.email);
  const attempt = await db.loginAttempt.findUnique({ where: { key } });
  if (attempt?.lockedUntil && attempt.lockedUntil > new Date()) {
    res
      .status(429)
      .json({ error: "Login temporarily locked. Try again later." });
    return;
  }
  const admin = await db.admin.findUnique({ where: { email: body.email } });
  const valid = await verifyPassword(
    body.password,
    admin?.passwordHash ||
      "$2b$12$C6UzMDM.H6dfI/f/IKcEe.5rDkWCpVgVsTmHKmcBMBQZnN9T5NqZ6",
  );
  if (!admin?.isActive || !valid) {
    const failure = await db.loginAttempt.upsert({
      where: { key },
      create: { key, failures: 1 },
      update: { failures: { increment: 1 } },
    });
    if (failure.failures >= 5)
      await db.loginAttempt.update({
        where: { key },
        data: {
          lockedUntil: new Date(
            Date.now() +
              Math.min(
                3600000,
                30000 * 2 ** Math.min(failure.failures - 5, 10),
              ),
          ),
        },
      });
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  await db.loginAttempt.deleteMany({ where: { key } });
  await db.admin.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });
  const csrfToken = await issue(res, admin.id);
  await audit(db, admin.id, "login", "Admin", admin.id);
  res.json({ csrfToken, email: admin.email });
});
app.get("/api/admin/csrf", (req, res) => {
  emptyQuery(req);
  res.json({ csrfToken: req.cookies.csrf || "" });
});
app.post("/api/admin/refresh", requireOrigin, csrf, async (req, res) => {
  z.object({}).strict().parse(req.body);
  const saved = await db.refreshToken.findUnique({
    where: { tokenHash: hash(String(req.cookies.refresh || "")) },
    include: { admin: true },
  });
  if (
    !saved ||
    saved.revokedAt ||
    saved.expiresAt < new Date() ||
    !saved.admin.isActive
  ) {
    if (saved)
      await db.refreshToken.updateMany({
        where: { family: saved.family },
        data: { revokedAt: new Date() },
      });
    clearCookies(res);
    res.status(401).json({ error: "Session expired" });
    return;
  }
  const claim = await db.refreshToken.updateMany({
    where: { id: saved.id, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  if (!claim.count) {
    await db.refreshToken.updateMany({
      where: { family: saved.family },
      data: { revokedAt: new Date() },
    });
    clearCookies(res);
    res.status(401).json({ error: "Session replay rejected" });
    return;
  }
  res.json({ csrfToken: await issue(res, saved.adminId, saved.family) });
});
app.use("/api/admin", authenticate, (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    next();
    return;
  }
  requireOrigin(req, res, () => csrf(req, res, next));
});
app.post("/api/admin/logout", async (req, res) => {
  z.object({}).strict().parse(req.body);
  await db.refreshToken.updateMany({
    where: { family: res.locals.family },
    data: { revokedAt: new Date() },
  });
  clearCookies(res);
  res.json({ ok: true });
});
app.get("/api/admin/me", (req, res) => {
  emptyQuery(req);
  res.json({
    id: res.locals.admin.id,
    email: res.locals.admin.email,
    role: res.locals.admin.role,
    csrfToken: req.cookies.csrf,
  });
});
app.post("/api/admin/password", async (req, res) => {
  const data = v.changePassword.parse(req.body);
  if (
    !(await verifyPassword(data.currentPassword, res.locals.admin.passwordHash))
  ) {
    res.status(400).json({ error: "Current password is incorrect" });
    return;
  }
  const encoded = await passwordHash(data.password);
  await db.$transaction(async (tx) => {
    await tx.admin.update({
      where: { id: res.locals.admin.id },
      data: { passwordHash: encoded },
    });
    await tx.refreshToken.updateMany({
      where: { adminId: res.locals.admin.id },
      data: { revokedAt: new Date() },
    });
    await audit(tx, res.locals.admin.id, "password_changed", "Admin");
  });
  clearCookies(res);
  res.json({ ok: true });
});
app.get("/api/admin/leads/export", async (req, res) => {
  const { where, skip, take } = filters(req);
  const items = await db.lead.findMany({
    where: { ...where, deletedAt: null },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });
  await audit(db, res.locals.admin.id, "export", "Lead");
  sendCsv(
    res,
    items,
    [
      "id",
      "name",
      "email",
      "phone",
      "company",
      "serviceName",
      "status",
      "description",
      "notes",
      "createdAt",
    ],
    "leads",
  );
});
app.get("/api/admin/leads", async (req, res) => {
  const { where, skip, take, q } = filters(req);
  const filter = { ...where, deletedAt: null };
  const [items, total] = await Promise.all([
    db.lead.findMany({
      where: filter,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    db.lead.count({ where: filter }),
  ]);
  res.json({ items, total, page: q.page });
});
app.get("/api/admin/leads/:id", async (req, res) => {
  emptyQuery(req);
  const item = await db.lead.findFirst({
    where: { id: getId(req), deletedAt: null },
  });
  if (!item) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }
  res.json(item);
});
app.patch("/api/admin/leads/:id", async (req, res) => {
  const id = getId(req),
    data = v.leadUpdate.parse(req.body);
  const item = await db.$transaction(async (tx) => {
    const result = await tx.lead.update({
      where: { id, deletedAt: null },
      data,
    });
    await audit(tx, res.locals.admin.id, "update", "Lead", id);
    return result;
  });
  res.json(item);
});
app.delete("/api/admin/leads/:id", async (req, res) => {
  const id = getId(req);
  z.object({}).strict().parse(req.body);
  await db.$transaction(async (tx) => {
    await tx.lead.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    await audit(tx, res.locals.admin.id, "soft_delete", "Lead", id);
  });
  res.json({ ok: true });
});
app.get("/api/admin/services", async (req, res) => {
  const q = v.pagination.parse(req.query);
  const [items, total] = await Promise.all([
    db.service.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      skip: (q.page - 1) * q.limit,
      take: q.limit,
    }),
    db.service.count(),
  ]);
  res.json({ items, total, page: q.page });
});
app.patch("/api/admin/services/reorder", async (req, res) => {
  const { ids } = z
    .object({
      ids: z
        .array(v.id)
        .min(1)
        .max(100)
        .refine((ids) => new Set(ids).size === ids.length),
    })
    .strict()
    .parse(req.body);
  await db.$transaction(async (tx) => {
    const rows = await tx.service.findMany({
      select: { id: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });
    const requested = new Set(ids);
    if (rows.filter((row) => requested.has(row.id)).length !== ids.length)
      throw new Prisma.PrismaClientKnownRequestError("Unknown service", {
        code: "P2025",
        clientVersion: Prisma.prismaVersion.client,
      });
    const insertion = rows.findIndex((row) => requested.has(row.id));
    const order = rows
      .filter((row) => !requested.has(row.id))
      .map((row) => row.id);
    order.splice(insertion, 0, ...ids);
    for (const [sortOrder, id] of order.entries())
      await tx.service.update({ where: { id }, data: { sortOrder } });
    await audit(tx, res.locals.admin.id, "reorder", "Service");
  });
  res.json({ ok: true });
});
app.post("/api/admin/services", async (req, res) => {
  const data = v.service.parse(req.body);
  const item = await db.$transaction(async (tx) => {
    const item = await tx.service.create({ data });
    await audit(tx, res.locals.admin.id, "create", "Service", item.id);
    return item;
  });
  res.status(201).json(item);
});
app.put("/api/admin/services/:id", async (req, res) => {
  const id = getId(req),
    data = v.service.parse(req.body);
  const item = await db.$transaction(async (tx) => {
    const item = await tx.service.update({ where: { id }, data });
    await audit(tx, res.locals.admin.id, "update", "Service", id);
    return item;
  });
  res.json(item);
});
app.delete("/api/admin/services/:id", async (req, res) => {
  const id = getId(req);
  z.object({}).strict().parse(req.body);
  await db.$transaction(async (tx) => {
    await tx.service.update({ where: { id }, data: { isPublished: false } });
    await audit(tx, res.locals.admin.id, "unpublish", "Service", id);
  });
  res.json({ ok: true });
});
const subscriberSelect = {
  id: true,
  email: true,
  isConfirmed: true,
  confirmedAt: true,
  unsubscribedAt: true,
  createdAt: true,
};
for (const exportCsv of [false, true])
  app.get(
    `/api/admin/newsletter${exportCsv ? "/export" : ""}`,
    async (req, res) => {
      const { skip, take, q } = filters(req);
      const [items, total] = await Promise.all([
        db.newsletterSubscriber.findMany({
          select: subscriberSelect,
          skip,
          take,
          orderBy: { createdAt: "desc" },
        }),
        db.newsletterSubscriber.count(),
      ]);
      if (exportCsv) {
        await audit(db, res.locals.admin.id, "export", "NewsletterSubscriber");
        sendCsv(res, items, Object.keys(subscriberSelect), "subscribers");
      } else res.json({ items, total, page: q.page });
    },
  );
app.patch("/api/admin/newsletter/:id", async (req, res) => {
  const id = getId(req);
  z.object({ unsubscribe: z.literal(true) })
    .strict()
    .parse(req.body);
  await db.$transaction(async (tx) => {
    await tx.newsletterSubscriber.update({
      where: { id },
      data: { isConfirmed: false, unsubscribedAt: new Date(), tokenHash: null },
    });
    await audit(
      tx,
      res.locals.admin.id,
      "unsubscribe",
      "NewsletterSubscriber",
      id,
    );
  });
  res.json({ ok: true });
});
for (const exportCsv of [false, true])
  app.get(
    `/api/admin/revenue${exportCsv ? "/export" : ""}`,
    async (req, res) => {
      const q = v.pagination.parse(req.query);
      const [items, total] = await Promise.all([
        db.revenueEntry.findMany({
          skip: (q.page - 1) * q.limit,
          take: q.limit,
          orderBy: { invoicedAt: "desc" },
        }),
        db.revenueEntry.count(),
      ]);
      if (exportCsv) {
        await audit(db, res.locals.admin.id, "export", "RevenueEntry");
        sendCsv(
          res,
          items,
          [
            "id",
            "clientName",
            "serviceName",
            "leadId",
            "amount",
            "currency",
            "status",
            "invoicedAt",
            "paidAt",
            "notes",
          ],
          "revenue",
        );
      } else res.json({ items, total, page: q.page });
    },
  );
app.post("/api/admin/revenue", async (req, res) => {
  const data = v.revenue.parse(req.body);
  const item = await db.$transaction(async (tx) => {
    const item = await tx.revenueEntry.create({ data });
    await audit(tx, res.locals.admin.id, "create", "RevenueEntry", item.id);
    return item;
  });
  res.status(201).json(item);
});
app.put("/api/admin/revenue/:id", async (req, res) => {
  const id = getId(req),
    data = v.revenue.parse(req.body);
  const item = await db.$transaction(async (tx) => {
    const item = await tx.revenueEntry.update({ where: { id }, data });
    await audit(tx, res.locals.admin.id, "update", "RevenueEntry", id);
    return item;
  });
  res.json(item);
});
app.delete("/api/admin/revenue/:id", async (req, res) => {
  const id = getId(req);
  z.object({}).strict().parse(req.body);
  await db.$transaction(async (tx) => {
    await tx.revenueEntry.delete({ where: { id } });
    await audit(tx, res.locals.admin.id, "delete", "RevenueEntry", id);
  });
  res.json({ ok: true });
});
app.get("/api/admin/dashboard/summary", async (req, res) => {
  emptyQuery(req);
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const [
    newLeads,
    services,
    subscribers,
    totals,
    pendingDeliveries,
    failedDeliveries,
    months,
  ] = await Promise.all([
    db.lead.count({
      where: {
        deletedAt: null,
        createdAt: { gte: new Date(Date.now() - 7 * 86400000) },
      },
    }),
    db.service.count({ where: { isPublished: true } }),
    db.newsletterSubscriber.count({
      where: { isConfirmed: true, unsubscribedAt: null },
    }),
    db.revenueEntry.groupBy({
      by: ["currency", "status"],
      _sum: { amount: true },
    }),
    db.outbox.count({ where: { deliveredAt: null } }),
    db.outbox.count({ where: { deliveredAt: null, attempts: { gte: 12 } } }),
    Promise.all(
      Array.from({ length: 12 }, (_, month) =>
        db.revenueEntry.groupBy({
          by: ["currency"],
          where: {
            status: "paid",
            paidAt: {
              gte: new Date(Date.UTC(start.getUTCFullYear(), month, 1)),
              lt: new Date(Date.UTC(start.getUTCFullYear(), month + 1, 1)),
            },
          },
          _sum: { amount: true },
        }),
      ),
    ),
  ]);
  res.json({
    newLeads,
    services,
    subscribers,
    totals,
    pendingDeliveries,
    failedDeliveries,
    months,
    year: now.getUTCFullYear(),
  });
});
app.get("/api/admin/settings", async (req, res) => {
  emptyQuery(req);
  res.json({
    settings: await publicSettings(),
    secrets: Object.fromEntries(
      [
        "RESEND_API_KEY",
        "TURNSTILE_SECRET_KEY",
        "META_CONVERSIONS_API_ACCESS_TOKEN",
        "GA4_API_SECRET",
        "SENTRY_DSN",
      ].map((key) => [key, Boolean(process.env[key])]),
    ),
  });
});
app.put("/api/admin/settings", async (req, res) => {
  const data = v.settings.parse(req.body);
  await db.$transaction(async (tx) => {
    for (const [key, value] of Object.entries(data))
      if (value !== undefined)
        await tx.siteSetting.upsert({
          where: { key },
          create: { key, value },
          update: { value },
        });
    await audit(tx, res.locals.admin.id, "update", "SiteSetting");
  });
  res.json({ ok: true });
});
app.get("/api/admin/audit-log", async (req, res) => {
  const q = v.pagination.parse(req.query);
  const [items, total] = await Promise.all([
    db.auditLog.findMany({
      skip: (q.page - 1) * q.limit,
      take: q.limit,
      orderBy: { createdAt: "desc" },
    }),
    db.auditLog.count(),
  ]);
  res.json({ items, total, page: q.page });
});
app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ error: "Invalid input", fields: error.flatten().fieldErrors });
      return;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res.status(409).json({ error: "This record already exists" });
        return;
      }
      if (["P2025", "P2003"].includes(error.code)) {
        res.status(404).json({ error: "Related record not found" });
        return;
      }
    }
    if (error instanceof SyntaxError) {
      res.status(400).json({ error: "Invalid JSON" });
      return;
    }
    Sentry.captureException(error);
    console.error(
      JSON.stringify({
        level: "error",
        event: "request_failed",
        requestId: res.getHeader("X-Request-ID"),
      }),
    );
    res
      .status(500)
      .json({ error: "Unable to complete the request. Please try again." });
  },
);
