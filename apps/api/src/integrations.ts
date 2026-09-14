import type { Prisma } from "@prisma/client";
import { db } from "./db.js";
import { config } from "./config.js";
import { hash } from "./auth.js";
import * as Sentry from "@sentry/node";
export async function publicSettings(): Promise<
  Record<string, string | boolean> & {
    turnstileSiteKey: string;
    ga4ServerRelay: boolean;
    spamBypass: boolean;
  }
> {
  const defaults: Record<string, string> = {
    "contact.email": "",
    "contact.phone": "",
    "contact.whatsapp": "",
    "pixels.meta_pixel_id": process.env.META_PIXEL_ID || "",
    "pixels.ga4_measurement_id": process.env.GA4_MEASUREMENT_ID || "",
    "pixels.google_ads_conversion_id":
      process.env.GOOGLE_ADS_CONVERSION_ID || "",
    "pixels.google_ads_conversion_label":
      process.env.GOOGLE_ADS_CONVERSION_LABEL || "",
    "consent.copy":
      "We use optional analytics and advertising cookies to understand visits and enquiries. You can accept, decline, or change your choice at any time.",
  };
  for (const row of await db.siteSetting.findMany())
    if (row.key in defaults) defaults[row.key] = row.value;
  return {
    ...defaults,
    turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || "",
    ga4ServerRelay: Boolean(process.env.GA4_API_SECRET),
    spamBypass:
      config.NODE_ENV !== "production" && config.DEV_SPAM_BYPASS === "true",
  };
}
export async function checkSpam(
  body: { website_url: string; turnstileToken: string },
  ip: string,
  action: string,
) {
  if (body.website_url) return false;
  if (config.NODE_ENV !== "production" && config.DEV_SPAM_BYPASS === "true")
    return true;
  if (!process.env.TURNSTILE_SECRET_KEY || !body.turnstileToken) return false;
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: body.turnstileToken,
        remoteip: ip,
      }),
    },
  );
  const result = (await response.json()) as {
    success: boolean;
    hostname: string;
    action: string;
  };
  return (
    result.success &&
    result.hostname === new URL(config.APP_URL).hostname &&
    result.action === action
  );
}
export function mail(to: string, subject: string, text: string) {
  return {
    kind: "email",
    payload: { to, subject, text } as Prisma.InputJsonObject,
  };
}
async function sendJson(
  url: string,
  body: unknown,
  headers: Record<string, string> = {},
) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Provider response ${response.status}`);
}
let running = false;
export async function deliverOutbox() {
  if (running) return;
  running = true;
  try {
    const jobs = await db.outbox.findMany({
      where: {
        deliveredAt: null,
        nextAttemptAt: { lte: new Date() },
        attempts: { lt: 12 },
      },
      orderBy: { createdAt: "asc" },
      take: 20,
    });
    for (const job of jobs) {
      // Claim atomically: multiple API processes cannot deliver the same job concurrently.
      const claim = await db.outbox.updateMany({
        where: {
          id: job.id,
          attempts: job.attempts,
          nextAttemptAt: { lte: new Date() },
        },
        data: {
          attempts: { increment: 1 },
          nextAttemptAt: new Date(Date.now() + 60000),
        },
      });
      if (!claim.count) continue;
      try {
        const payload = job.payload as Record<string, unknown>;
        if (job.kind === "email") {
          if (!process.env.RESEND_API_KEY)
            throw new Error("Email provider is not configured");
          await sendJson(
            "https://api.resend.com/emails",
            { from: process.env.EMAIL_FROM, ...payload },
            {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              "Idempotency-Key": job.id,
            },
          );
        } else if (job.kind === "meta") {
          const settings = await publicSettings();
          if (
            !process.env.META_CONVERSIONS_API_ACCESS_TOKEN ||
            !settings["pixels.meta_pixel_id"]
          )
            throw new Error("Meta is not configured");
          const pii = payload.email
            ? {
                em: [hash(String(payload.email).trim().toLowerCase())],
                ...(payload.phone
                  ? { ph: [hash(String(payload.phone).replace(/\D/g, ""))] }
                  : {}),
              }
            : { external_id: [hash(String(payload.clientId))] };
          await sendJson(
            `https://graph.facebook.com/${process.env.META_GRAPH_VERSION || "v23.0"}/${settings["pixels.meta_pixel_id"]}/events`,
            {
              data: [
                {
                  event_name: payload.eventName,
                  event_time: Math.floor(job.createdAt.getTime() / 1000),
                  event_id: payload.eventId,
                  action_source: "website",
                  event_source_url: new URL(
                    String(payload.path),
                    config.APP_URL,
                  ).href,
                  user_data: pii,
                },
              ],
              ...(process.env.META_TEST_EVENT_CODE
                ? { test_event_code: process.env.META_TEST_EVENT_CODE }
                : {}),
            },
            {
              Authorization: `Bearer ${process.env.META_CONVERSIONS_API_ACCESS_TOKEN}`,
            },
          );
        } else if (job.kind === "ga4") {
          const settings = await publicSettings();
          if (
            !process.env.GA4_API_SECRET ||
            !settings["pixels.ga4_measurement_id"]
          )
            throw new Error("GA4 is not configured");
          const names: Record<string, string> = {
            PageView: "page_view",
            Lead: "generate_lead",
            Contact: "contact",
            Subscribe: "sign_up",
          };
          await sendJson(
            `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(String(settings["pixels.ga4_measurement_id"]))}&api_secret=${encodeURIComponent(process.env.GA4_API_SECRET)}`,
            {
              client_id: payload.clientId,
              timestamp_micros: job.createdAt.getTime() * 1000,
              consent: {
                ad_user_data: "GRANTED",
                ad_personalization: "GRANTED",
              },
              events: [
                {
                  name: names[String(payload.eventName)],
                  params: {
                    event_id: payload.eventId,
                    page_location: new URL(String(payload.path), config.APP_URL)
                      .href,
                    engagement_time_msec: 1,
                  },
                },
              ],
            },
          );
        } else throw new Error("Unknown outbox kind");
        await db.outbox.update({
          where: { id: job.id },
          data: { deliveredAt: new Date(), payload: {} },
        });
      } catch (error) {
        console.error(
          JSON.stringify({
            level: "error",
            event: "outbox_delivery_failed",
            jobId: job.id,
            kind: job.kind,
            attempt: job.attempts + 1,
          }),
        );
        Sentry.captureException(error);
        await db.outbox.update({
          where: { id: job.id },
          data: {
            nextAttemptAt: new Date(
              Date.now() + Math.min(3600000, 30000 * 2 ** job.attempts),
            ),
          },
        });
      }
    }
  } finally {
    running = false;
  }
}
