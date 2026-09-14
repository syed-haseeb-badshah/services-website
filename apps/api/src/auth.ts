import { randomBytes, createHash, timingSafeEqual } from "node:crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";
import { db } from "./db.js";
import { config, production } from "./config.js";
export const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export const randomToken = () => randomBytes(32).toString("hex");
export const cookieOptions = {
  httpOnly: true,
  secure: production,
  sameSite: "strict" as const,
  path: "/api/admin",
  ...(config.COOKIE_DOMAIN ? { domain: config.COOKIE_DOMAIN } : {}),
};
export function clearCookies(res: Response) {
  for (const name of ["access", "refresh", "csrf"])
    res.clearCookie(name, cookieOptions);
}
export async function issue(
  res: Response,
  adminId: string,
  family = randomToken(),
) {
  const refresh = randomToken();
  await db.refreshToken.create({
    data: {
      adminId,
      family,
      tokenHash: hash(refresh),
      expiresAt: new Date(Date.now() + 30 * 86400000),
    },
  });
  res.cookie(
    "access",
    jwt.sign({ sub: adminId, family }, config.JWT_ACCESS_SECRET, {
      algorithm: "HS256",
      expiresIn: "15m",
      issuer: "aster-api",
      audience: "aster-admin",
    }),
    { ...cookieOptions, maxAge: 15 * 60000 },
  );
  res.cookie("refresh", refresh, { ...cookieOptions, maxAge: 30 * 86400000 });
  const csrf = randomToken();
  res.cookie("csrf", csrf, { ...cookieOptions, maxAge: 30 * 86400000 });
  return csrf;
}
export function requireOrigin(req: Request, res: Response, next: NextFunction) {
  if (!config.CORS_ORIGIN.split(",").includes(req.get("origin") || "")) {
    res.status(403).json({ error: "Origin denied" });
    return;
  }
  next();
}
export function csrf(req: Request, res: Response, next: NextFunction) {
  const sent = req.get("x-csrf-token") || "";
  const saved = String(req.cookies.csrf || "");
  if (
    !/^[a-f0-9]{64}$/.test(sent) ||
    !/^[a-f0-9]{64}$/.test(saved) ||
    !timingSafeEqual(Buffer.from(sent), Buffer.from(saved))
  ) {
    res.status(403).json({ error: "Invalid CSRF token" });
    return;
  }
  next();
}
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload = jwt.verify(
      req.cookies.access || "",
      config.JWT_ACCESS_SECRET,
      { algorithms: ["HS256"], issuer: "aster-api", audience: "aster-admin" },
    ) as jwt.JwtPayload;
    const admin = await db.admin.findUnique({
      where: { id: String(payload.sub) },
    });
    const active = await db.refreshToken.findFirst({
      where: {
        family: String(payload.family),
        adminId: admin?.id || "",
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
    if (!admin?.isActive || !active) throw new Error("Unauthenticated");
    res.locals.admin = admin;
    res.locals.family = payload.family;
    next();
  } catch {
    res.status(401).json({ error: "Authentication required" });
  }
}
export const passwordHash = (password: string) => bcrypt.hash(password, 12);
export const verifyPassword = (password: string, value: string) =>
  bcrypt.compare(password, value);
