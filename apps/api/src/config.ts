import dotenv from "dotenv";
import { z } from "zod";
dotenv.config({ path: "apps/api/.env", quiet: true });
const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  APP_URL: z.string().url(),
  API_URL: z.string().url(),
  CORS_ORIGIN: z.string().min(1),
  DATABASE_URL: z.string().startsWith("postgresql://"),
  JWT_ACCESS_SECRET: z.string().min(32),
  COOKIE_DOMAIN: z.string().default(""),
  TRUST_PROXY: z.coerce.number().int().min(0).max(3).default(0),
  DEV_SPAM_BYPASS: z.enum(["true", "false"]).default("false"),
});
export const config = schema.parse(process.env);
export const production = config.NODE_ENV === "production";
if (
  production &&
  (config.DEV_SPAM_BYPASS === "true" ||
    !config.APP_URL.startsWith("https://") ||
    !config.API_URL.startsWith("https://") ||
    config.JWT_ACCESS_SECRET.includes("replace") ||
    !process.env.TURNSTILE_SECRET_KEY ||
    !process.env.RESEND_API_KEY ||
    !process.env.LEAD_NOTIFICATION_TO)
) {
  throw new Error(
    "Production requires HTTPS, real auth secrets, Turnstile and email configuration.",
  );
}
