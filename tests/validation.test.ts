import test from "node:test";
import assert from "node:assert/strict";
import {
  contact,
  newsletter,
  revenue,
  service,
  settings,
  tracking,
} from "../apps/api/src/validators.js";
test("contact rejects unknown fields, invalid email and empty descriptions", () => {
  const valid = {
    name: "Test",
    email: "test@example.com",
    description: "A project",
    eventId: crypto.randomUUID(),
  };
  assert.equal(contact.parse(valid).website_url, "");
  for (const bad of [
    { ...valid, role: "admin" },
    { ...valid, email: "bad" },
    { ...valid, description: " " },
  ])
    assert.equal(contact.safeParse(bad).success, false);
});
test("revenue uses exact decimal strings and requires paid date", () => {
  const valid = {
    clientName: "Test",
    amount: "1234.56",
    currency: "GBP",
    status: "invoiced",
    invoicedAt: new Date().toISOString(),
    paidAt: null,
  };
  assert.equal(revenue.safeParse(valid).success, true);
  for (const bad of [
    { ...valid, amount: -5 },
    { ...valid, amount: "12.345" },
    { ...valid, status: "paid" },
  ])
    assert.equal(revenue.safeParse(bad).success, false);
});
test("settings reject secret injection and invalid pixel IDs", () => {
  assert.equal(
    settings.safeParse({ "pixels.meta_pixel_id": "12345" }).success,
    true,
  );
  assert.equal(settings.safeParse({ RESEND_API_KEY: "secret" }).success, false);
  assert.equal(
    settings.safeParse({ "pixels.ga4_measurement_id": "<script>" }).success,
    false,
  );
});
test("tracking requires consent and disallows raw PII and query strings", () => {
  const data = {
    eventId: crypto.randomUUID(),
    eventName: "Lead",
    consent: true,
    clientId: "123.456",
    path: "/contact",
  };
  assert.equal(tracking.safeParse(data).success, true);
  for (const bad of [
    { ...data, consent: false },
    { ...data, email: "test@example.com" },
    { ...data, path: "/contact?email=private" },
  ])
    assert.equal(tracking.safeParse(bad).success, false);
});
test("newsletter normalizes email and service enforces safe slugs", () => {
  assert.equal(
    newsletter.parse({ email: " PERSON@example.com " }).email,
    "person@example.com",
  );
  assert.equal(
    service.safeParse({
      name: "Example",
      slug: "../admin",
      group: "Technology",
      summary: "Test",
      deliverables: ["Test"],
      isPublished: true,
      sortOrder: 0,
    }).success,
    false,
  );
});
