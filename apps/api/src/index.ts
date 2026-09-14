import { config } from "./config.js";
import * as Sentry from "@sentry/node";
import { app } from "./app.js";
import { db } from "./db.js";
import { deliverOutbox } from "./integrations.js";
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  sendDefaultPii: false,
  beforeSend(event) {
    delete event.request;
    delete event.user;
    return event;
  },
});
await db.$connect();
const server = app.listen(config.PORT, () =>
  console.log(JSON.stringify({ event: "listening", port: config.PORT })),
);
const worker = setInterval(() => {
  void deliverOutbox().catch((error) => Sentry.captureException(error));
}, 15000);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => {
    clearInterval(worker);
    server.close(() => {
      void db.$disconnect().then(() => process.exit(0));
    });
  });
