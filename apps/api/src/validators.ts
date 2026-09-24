import { z } from "zod";
export const email = z.string().trim().toLowerCase().email().max(254);
const short = z.string().trim().max(200);
export const id = z.string().cuid();
export const token = z.string().regex(/^[a-f0-9]{64}$/);
export const status = z.enum(["new", "contacted", "qualified", "won", "lost"]);
const spam = {
  website_url: z.string().max(200).default(""),
  turnstileToken: z.string().max(2048).default(""),
};
export const contact = z
  .object({
    name: short.min(1),
    email,
    phone: short.optional(),
    company: short.optional(),
    description: z.string().trim().min(1).max(10000),
    intent: short.optional(),
    serviceName: short.optional(),
    packageName: short.optional(),
    source: z.string().max(1000).optional(),
    eventId: z.string().uuid(),
    ...spam,
  })
  .strict();
export const newsletter = z.object({ email, ...spam }).strict();
export const login = z
  .object({ email, password: z.string().min(1).max(128) })
  .strict();
export const changePassword = z
  .object({
    currentPassword: z.string().min(1).max(128),
    password: z
      .string()
      .min(12)
      .max(72)
      .refine(
        (value) => Buffer.byteLength(value, "utf8") <= 72,
        "Password must not exceed 72 UTF-8 bytes",
      ),
  })
  .strict();
export const service = z
  .object({
    name: short.min(1),
    slug: z
      .string()
      .min(1)
      .max(120)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    group: z.enum([
      "Web Design & Development",
      "Videography & Photography",
      "Brand & Content",
      "Technology",
    ]),
    summary: z.string().trim().min(1).max(3000),
    deliverables: z.array(short.min(1)).min(1).max(30),
    isPublished: z.boolean(),
    sortOrder: z.number().int().min(0).max(10000),
  })
  .strict();
export const leadUpdate = z
  .object({
    status: status.optional(),
    notes: z.string().max(10000).optional(),
  })
  .strict()
  .refine((x) => Object.keys(x).length > 0);
export const revenue = z
  .object({
    leadId: id.nullable().optional(),
    clientName: short.min(1),
    serviceName: short.optional(),
    amount: z.string().regex(/^\d{1,12}(\.\d{1,2})?$/),
    currency: z.enum(["GBP", "USD", "EUR"]),
    status: z.enum(["invoiced", "paid", "overdue", "refunded"]),
    invoicedAt: z.string().datetime(),
    paidAt: z.string().datetime().nullable(),
    notes: z.string().max(10000).optional(),
  })
  .strict()
  .refine(
    (x) => x.status !== "paid" || x.paidAt !== null,
    "Paid date is required",
  );
export const pagination = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(25),
    status: status.optional(),
    service: short.optional(),
    from: z.string().date().optional(),
    to: z.string().date().optional(),
  })
  .strict()
  .refine((x) => !x.from || !x.to || x.from <= x.to, "Invalid date range");
export const settings = z
  .object({
    "contact.email": z.union([email, z.literal("")]).optional(),
    "contact.phone": short.optional(),
    "contact.whatsapp": z
      .string()
      .regex(/^[+\d\s-]*$/)
      .max(40)
      .optional(),
    "pixels.meta_pixel_id": z.string().regex(/^\d*$/).max(30).optional(),
    "pixels.ga4_measurement_id": z
      .string()
      .regex(/^(G-[A-Z0-9]+)?$/)
      .optional(),
    "pixels.google_ads_conversion_id": z
      .string()
      .regex(/^(AW-\d+)?$/)
      .optional(),
    "pixels.google_ads_conversion_label": z
      .string()
      .regex(/^[\w-]*$/)
      .max(100)
      .optional(),
    "consent.copy": z.string().trim().min(1).max(1000).optional(),
  })
  .strict();
export const tracking = z
  .object({
    eventId: z.string().uuid(),
    eventName: z.enum(["PageView", "Lead", "Contact", "Subscribe"]),
    consent: z.literal(true),
    analytics: z.boolean().default(false),
    marketing: z.boolean().default(false),
    clientId: z
      .string()
      .regex(/^\d+\.\d+$/)
      .max(80),
    path: z
      .string()
      .regex(/^\/[a-zA-Z0-9/_-]*$/)
      .max(250)
      .refine(
        (path) => !/^\/(admin|newsletter)(\/|$)/.test(path),
        "Private routes cannot be tracked",
      ),
  })
  .strict();
