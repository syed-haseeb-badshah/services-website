# Aster Digital — local full-stack application

The existing React / TypeScript / Vite website now has an Express API, PostgreSQL database, admin dashboard, working form endpoints, manual revenue tracking and consent-gated analytics integrations. Existing public routes and visual styling are retained. All changes are local; nothing has been pushed or deployed.

## Start locally

Use Node.js 24. In this folder, open a terminal:

```powershell
npm ci
npm run db:generate
npm run db:local
```

Keep the database terminal running. In a second terminal:

```powershell
npm run db:migrate
npm run db:seed
npx tsx scripts/local-admin.ts
npm run dev
```

Open [the website](http://localhost:5173) or [admin](http://localhost:5173/admin). Generated local login details are in `.local/admin-access.txt`. The password is random and unique to this installation. Do not copy this development account into production. Change it in Admin → Settings.

The local database binds to `127.0.0.1:54329` and persists under `.local/postgres`. Its generated credentials stay in ignored `.local/database.json`. First startup creates `apps/api/.env` if missing. Vite proxies `/api` to the backend on port 4000. Do not open `index.html` directly. Restart the database and application commands to resume work; existing data is preserved.

## Features and configuration

- Contact submissions persist and appear in admin, with queued notification and acknowledgement emails.
- Newsletter subscriptions persist as pending until confirmed by email. Confirmation links expire in 24 hours; unsubscribe is supported.
- Public services and package names load from PostgreSQL. Service editing, publishing and ordering are available in admin and reflected when public pages load.
- Admin supports lead filters/status/notes, services, revenue CRUD, currency-separated totals/monthly charts, subscribers, CSV exports, contact/pixel settings, password changes and audit history.
- Server-side protection includes strict Zod validation, bcrypt passwords, httpOnly cookies, short-lived access tokens, rotating hashed refresh tokens, CSRF checks, rate limits and account lockout.
- Optional Meta, GA4 and Google Ads tracking is consent-gated. A persistent worker relays Meta/GA4 events and retries failed email deliveries.

Local defaults contain no real email, Turnstile, analytics or Sentry credentials. A clearly marked spam bypass is enabled only for local development and forbidden in production. No notification or newsletter confirmation email arrives until Resend is configured. Queued jobs remain pending. Live provider checks, hosting, domain/HTTPS and managed backup schedules require your external configuration.

## Verify and build

```powershell
npm run typecheck
npm test
npm run test:integration
npm run format:check
npm run seo:generate
npm run build
npm run db:backup
npm run db:restore-test
```

Integration tests use a separate `aster_test` database, or a `TEST_DATABASE_URL` ending in `_test`; they do not reset development data. Generate SEO files while the API runs, before building the frontend. Set `SITE_URL` to the final domain before release; current generated URLs use localhost. Backup commands use PostgreSQL client utilities from `PG_BIN`, or the locally downloaded `.local/pg-tools/pgsql/bin` directory on this machine. The minimal embedded server does not include backup utilities.

The patched `deepmerge-ts` override fixes a Prisma tooling dependency advisory. Re-test generation/migrations when upgrading Prisma. `.env`, credentials, database files, backups, dependency caches and build output are git-ignored. `.env.example` files contain placeholders only.

## Source layout

- `src/main.tsx`, `src/routes.tsx`, `src/Layout.tsx`: entry, routing and public layout.
- `src/pages`, `src/components`: extracted pages, footer, forms, consent and shared UI.
- `src/admin`: lazy-loaded admin dashboard.
- `src/content.ts`: static editorial content and hydrated catalogue interface.
- `src/style.css`, `src/theme.css`: base CSS and consolidated theme overrides in original order.
- `apps/api/src`: API, authentication, validators, configuration and integration worker.
- `apps/api/prisma`: schema, initial SQL migration and original service/package seeds.
- `deploy`: deployment templates only; no live deployment.

See [Admin guide](docs/ADMIN-GUIDE.md), [operations and release requirements](docs/OPERATIONS.md), and [asset attribution](docs/ASSETS.md). Privacy and terms remain drafts for business review. Online payments are not implemented; revenue is manual. The existing client-preview route remains illustrative.
