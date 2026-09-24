import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app, csv } from "../apps/api/src/app.js";
import { db } from "../apps/api/src/db.js";
import { hash, passwordHash, randomToken } from "../apps/api/src/auth.js";
import { deliverOutbox } from "../apps/api/src/integrations.js";
const origin = "http://localhost:5173";
test("database-backed API: auth, CSRF, lead, services, revenue, newsletter, rotation and revocation", async () => {
  assert.match(process.env.DATABASE_URL || "", /_test$/);
  await db.outbox.deleteMany();
  await db.trackingEvent.deleteMany();
  await db.revenueEntry.deleteMany();
  await db.lead.deleteMany();
  await db.newsletterSubscriber.deleteMany();
  await db.refreshToken.deleteMany();
  await db.admin.deleteMany();
  await db.loginAttempt.deleteMany();
  await db.auditLog.deleteMany();
  await db.service.deleteMany();
  await db.siteSetting.deleteMany();
  const password = randomToken();
  await db.admin.create({
    data: {
      email: "owner@example.com",
      passwordHash: await passwordHash(password),
    },
  });
  await request(app).get("/api/health").expect(200);
  await request(app).get("/api/admin/leads").expect(401);
  await request(app)
    .post("/api/admin/login")
    .set("Origin", "https://evil.example")
    .send({ email: "owner@example.com", password })
    .expect(403);
  const agent = request.agent(app);
  const login = await agent
    .post("/api/admin/login")
    .set("Origin", origin)
    .send({ email: "owner@example.com", password })
    .expect(200);
  let csrf = login.body.csrfToken;
  assert.match(String(login.headers["set-cookie"]), /HttpOnly/);
  assert.match(String(login.headers["set-cookie"]), /SameSite=Strict/);
  await agent.get("/api/admin/me").expect(200);
  await agent
    .put("/api/admin/settings")
    .set("Origin", origin)
    .send({ "contact.email": "hello@example.com" })
    .expect(403);
  await agent
    .put("/api/admin/settings")
    .set("Origin", origin)
    .set("X-CSRF-Token", csrf)
    .send({ "contact.email": "hello@example.com" })
    .expect(200);
  const pub = await request(app).get("/api/settings/public").expect(200);
  assert.equal(pub.body["contact.email"], "hello@example.com");
  assert.equal(pub.body.JWT_ACCESS_SECRET, undefined);
  const eventId = crypto.randomUUID();
  const leadData = {
    name: "Test client",
    email: "client@example.com",
    description: "Build a site",
    eventId,
  };
  await request(app)
    .post("/api/contact")
    .set("Origin", origin)
    .send({ ...leadData, role: "admin" })
    .expect(400);
  await request(app)
    .post("/api/contact")
    .set("Origin", origin)
    .send({ ...leadData, website_url: "spam" })
    .expect(422);
  await request(app)
    .post("/api/contact")
    .set("Origin", origin)
    .send(leadData)
    .expect(202);
  await request(app)
    .post("/api/contact")
    .set("Origin", origin)
    .send(leadData)
    .expect(202);
  assert.equal(await db.lead.count(), 1);
  assert.equal(await db.outbox.count(), 2);
  const leads = await agent.get("/api/admin/leads?status=new").expect(200);
  const leadId = leads.body.items[0].id;
  await agent
    .patch(`/api/admin/leads/${leadId}`)
    .set("Origin", origin)
    .set("X-CSRF-Token", csrf)
    .send({ status: "won", notes: "Agreed scope" })
    .expect(200);
  await agent
    .get("/api/admin/leads/export")
    .expect(200)
    .expect("Content-Type", /csv/);
  assert.match(csv([{ value: "=cmd()" }], ["value"]), /'=cmd/);
  const serviceData = {
    name: "New service",
    slug: "new-service",
    group: "Technology",
    summary: "A new service",
    deliverables: ["Planning"],
    isPublished: true,
    sortOrder: 0,
  };
  const created = await agent
    .post("/api/admin/services")
    .set("Origin", origin)
    .set("X-CSRF-Token", csrf)
    .send(serviceData)
    .expect(201);
  await request(app).get("/api/services/new-service").expect(200);
  await agent
    .patch("/api/admin/services/reorder")
    .set("Origin", origin)
    .set("X-CSRF-Token", csrf)
    .send({ ids: [created.body.id] })
    .expect(200);
  await agent
    .put(`/api/admin/services/${created.body.id}`)
    .set("Origin", origin)
    .set("X-CSRF-Token", csrf)
    .send({ ...serviceData, summary: "Updated" })
    .expect(200);
  await agent
    .delete(`/api/admin/services/${created.body.id}`)
    .set("Origin", origin)
    .set("X-CSRF-Token", csrf)
    .send({})
    .expect(200);
  await request(app).get("/api/services/new-service").expect(404);
  const entry = {
    clientName: "Test",
    leadId,
    amount: "250.25",
    currency: "GBP",
    status: "paid",
    invoicedAt: new Date().toISOString(),
    paidAt: new Date().toISOString(),
  };
  const revenue = await agent
    .post("/api/admin/revenue")
    .set("Origin", origin)
    .set("X-CSRF-Token", csrf)
    .send(entry)
    .expect(201);
  const summary = await agent.get("/api/admin/dashboard/summary").expect(200);
  assert.equal(summary.body.totals[0]._sum.amount, "250.25");
  await agent
    .put(`/api/admin/revenue/${revenue.body.id}`)
    .set("Origin", origin)
    .set("X-CSRF-Token", csrf)
    .send({ ...entry, amount: "300.00" })
    .expect(200);
  await request(app)
    .post("/api/newsletter")
    .set("Origin", origin)
    .send({ email: "subscriber@example.com" })
    .expect(202);
  const job = await db.outbox.findFirst({
    where: {
      kind: "email",
      payload: { path: ["to"], equals: "subscriber@example.com" },
    },
  });
  const text = (job!.payload as { text: string }).text;
  const confirm = text.match(/confirm#([a-f0-9]+)/)![1],
    unsubscribe = text.match(/unsubscribe#([a-f0-9]+)/)![1];
  await request(app)
    .post("/api/newsletter/confirm")
    .set("Origin", origin)
    .send({ token: confirm })
    .expect(200);
  assert.equal(
    (await db.newsletterSubscriber.findUnique({
      where: { email: "subscriber@example.com" },
    }))!.isConfirmed,
    true,
  );
  await request(app)
    .post("/api/newsletter/unsubscribe")
    .set("Origin", origin)
    .send({ token: unsubscribe })
    .expect(200);
  await request(app)
    .post("/api/newsletter/confirm")
    .set("Origin", origin)
    .send({ token: confirm })
    .expect(400);
  await request(app)
    .post("/api/track/event")
    .set("Origin", origin)
    .send({
      eventId,
      eventName: "Lead",
      consent: false,
      clientId: "1.2",
      path: "/contact",
    })
    .expect(400);
  await request(app)
    .post("/api/track/event")
    .set("Origin", origin)
    .send({
      eventId,
      eventName: "Lead",
      consent: true,
      clientId: "1.2",
      path: "/contact",
    })
    .expect(202);
  await request(app)
    .post("/api/track/event")
    .set("Origin", origin)
    .send({
      eventId,
      eventName: "Lead",
      consent: true,
      clientId: "1.2",
      path: "/contact",
    })
    .expect(202);
  assert.equal(await db.trackingEvent.count(), 0);
  const refreshed = await agent
    .post("/api/admin/refresh")
    .set("Origin", origin)
    .set("X-CSRF-Token", csrf)
    .send({})
    .expect(200);
  csrf = refreshed.body.csrfToken;
  await agent
    .delete(`/api/admin/leads/${leadId}`)
    .set("Origin", origin)
    .set("X-CSRF-Token", csrf)
    .send({})
    .expect(200);
  assert.ok((await db.lead.findUnique({ where: { id: leadId } }))?.deletedAt);
  await agent
    .post("/api/admin/logout")
    .set("Origin", origin)
    .set("X-CSRF-Token", csrf)
    .send({})
    .expect(200);
  await agent.get("/api/admin/me").expect(401);
  assert.ok((await db.auditLog.count()) >= 8);
  // Persistent account lockout survives separate HTTP clients.
  for (let i = 0; i < 5; i++)
    await request(app)
      .post("/api/admin/login")
      .set("Origin", origin)
      .send({ email: "owner@example.com", password: "wrong" })
      .expect(401);
  await request(app)
    .post("/api/admin/login")
    .set("Origin", origin)
    .send({ email: "owner@example.com", password })
    .expect(429);
  await db.$disconnect();
});
test("refresh replay revokes the family and password changes revoke all sessions", async () => {
  const password = randomToken();
  await db.admin.create({
    data: {
      email: "rotation@example.com",
      passwordHash: await passwordHash(password),
    },
  });
  const agent = request.agent(app);
  const login = await agent
    .post("/api/admin/login")
    .set("Origin", origin)
    .send({ email: "rotation@example.com", password })
    .expect(200);
  const oldCookies = login.headers["set-cookie"] as unknown as string[];
  const refreshed = await agent
    .post("/api/admin/refresh")
    .set("Origin", origin)
    .set("X-CSRF-Token", login.body.csrfToken)
    .send({})
    .expect(200);
  await request(app)
    .post("/api/admin/refresh")
    .set("Origin", origin)
    .set(
      "Cookie",
      oldCookies.map((value) => value.split(";")[0]),
    )
    .set("X-CSRF-Token", login.body.csrfToken)
    .send({})
    .expect(401);
  await agent.get("/api/admin/me").expect(401);
  const again = await agent
    .post("/api/admin/login")
    .set("Origin", origin)
    .send({ email: "rotation@example.com", password })
    .expect(200);
  await agent
    .post("/api/admin/password")
    .set("Origin", origin)
    .set("X-CSRF-Token", again.body.csrfToken)
    .send({ currentPassword: password, password: randomToken() })
    .expect(200);
  await agent.get("/api/admin/me").expect(401);
  assert.ok(refreshed.body.csrfToken);
  await db.$disconnect();
});
test("outbox excludes contact PII from both providers and clears delivered payloads", async () => {
  process.env.RESEND_API_KEY = "test-only";
  process.env.EMAIL_FROM = "test@example.com";
  process.env.META_PIXEL_ID = "123456";
  process.env.META_CONVERSIONS_API_ACCESS_TOKEN = "test-only";
  process.env.GA4_MEASUREMENT_ID = "G-TEST";
  process.env.GA4_API_SECRET = "test-only";
  const event = {
    eventId: crypto.randomUUID(),
    eventName: "Lead",
    clientId: "123.456",
    path: "/contact",
    analytics: true,
    marketing: true,
    email: "person@example.com",
    phone: "+44 7700 900123",
  };
  await db.outbox.create({ data: { kind: "meta", payload: event } });
  await db.outbox.create({ data: { kind: "ga4", payload: event } });
  const calls: { url: string; body: Record<string, any> }[] = [];
  const original = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), body: JSON.parse(String(init?.body)) });
    return new Response("{}", { status: 200 });
  };
  try {
    await deliverOutbox();
    const meta = calls.find((call) => call.url.includes("graph.facebook.com"))!;
    assert.equal(meta.body.data[0].user_data.em, undefined);
    assert.equal(meta.body.data[0].user_data.ph, undefined);
    assert.equal(meta.body.data[0].user_data.external_id[0], hash("123.456"));
    const google = calls.find((call) =>
      call.url.includes("google-analytics.com"),
    )!;
    assert.ok(!JSON.stringify(google.body).includes("person@example.com"));
    assert.equal(google.body.events[0].name, "generate_lead");
    assert.equal(await db.outbox.count({ where: { deliveredAt: null } }), 0);
    assert.ok(
      (await db.outbox.findMany()).every(
        (job) => JSON.stringify(job.payload) === "{}",
      ),
    );
  } finally {
    globalThis.fetch = original;
    await db.$disconnect();
  }
});

test("server relay honours independent purposes and rejects unconsented legacy jobs", async () => {
  process.env.META_PIXEL_ID = "123456";
  process.env.META_CONVERSIONS_API_ACCESS_TOKEN = "test-only";
  process.env.GA4_MEASUREMENT_ID = "G-TEST";
  process.env.GA4_API_SECRET = "test-only";
  await db.outbox.deleteMany();
  const base = {
    eventName: "PageView",
    consent: true,
    clientId: "123.456",
    path: "/",
  };
  const analyticsId = crypto.randomUUID();
  await request(app)
    .post("/api/track/event")
    .set("Origin", "http://localhost:5173")
    .send({ ...base, eventId: analyticsId, analytics: true, marketing: false })
    .expect(202);
  assert.equal(await db.outbox.count({ where: { kind: "meta" } }), 0);
  assert.equal(await db.outbox.count({ where: { kind: "ga4" } }), 1);
  await request(app)
    .post("/api/track/event")
    .set("Origin", "http://localhost:5173")
    .send({ ...base, eventId: analyticsId, analytics: true, marketing: false })
    .expect(202);
  assert.equal(await db.outbox.count(), 1);
  await request(app)
    .post("/api/track/event")
    .set("Origin", "http://localhost:5173")
    .send({
      ...base,
      eventId: crypto.randomUUID(),
      analytics: false,
      marketing: true,
    })
    .expect(202);
  assert.equal(await db.outbox.count({ where: { kind: "meta" } }), 1);
  await request(app)
    .post("/api/track/revoke")
    .set("Origin", "https://other.invalid")
    .send({ eventIds: [analyticsId] })
    .expect(403);
  await request(app)
    .post("/api/track/revoke")
    .set("Origin", "http://localhost:5173")
    .send({ eventIds: [analyticsId] })
    .expect(200);
  assert.equal(await db.outbox.count({ where: { kind: "ga4" } }), 0);
  assert.equal(await db.outbox.count({ where: { kind: "meta" } }), 1);
  await db.outbox.deleteMany();
  await db.outbox.create({
    data: {
      kind: "meta",
      payload: { email: "old@example.com", consent: true },
    },
  });
  await db.outbox.create({ data: { kind: "ga4", payload: { consent: true } } });
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return new Response("{}");
  };
  try {
    await deliverOutbox();
    assert.equal(calls, 0);
    assert.ok(
      (await db.outbox.findMany()).every(
        (job) => JSON.stringify(job.payload) === "{}",
      ),
    );
  } finally {
    globalThis.fetch = original;
    await db.$disconnect();
  }
});
