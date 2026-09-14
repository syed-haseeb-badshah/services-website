import "../apps/api/src/config.js";
import { db } from "../apps/api/src/db.js";
const daysAgo = (days: number) => new Date(Date.now() - days * 86400000);
try {
  const result = await db.$transaction(async (tx) => ({
    tracking: await tx.trackingEvent.deleteMany({
      where: { createdAt: { lt: daysAgo(30) } },
    }),
    delivered: await tx.outbox.deleteMany({
      where: { deliveredAt: { lt: daysAgo(30) } },
    }),
    sessions: await tx.refreshToken.deleteMany({
      where: { expiresAt: { lt: daysAgo(30) } },
    }),
    loginAttempts: await tx.loginAttempt.deleteMany({
      where: { updatedAt: { lt: daysAgo(30) } },
    }),
    pendingSubscribers: await tx.newsletterSubscriber.deleteMany({
      where: {
        isConfirmed: false,
        unsubscribedAt: null,
        createdAt: { lt: daysAgo(30) },
      },
    }),
  }));
  console.log(JSON.stringify(result));
} finally {
  await db.$disconnect();
}
