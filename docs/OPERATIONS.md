# Operations and release handoff

This implementation is local only. No deployment, DNS change, GitHub push, real email, or advertising account setup has been performed.

## Application layout

The existing Vite application stays at the repository root to preserve local paths and edits. `apps/api` contains one Express API, Prisma schema, checked-in SQL migration, seed data, authentication and integration worker. There are no microservices. Both applications share the root lockfile and install.

## Production configuration still required

Choose a real domain and host; set `APP_URL`, `API_URL`, `CORS_ORIGIN` and the cookie configuration. Prefer serving `/api` under the same site through the supplied nginx proxy. Strict SameSite cookies require the frontend and API to share the same registrable domain if using subdomains. Set `TRUST_PROXY` to the actual trusted proxy hop count, not an arbitrary value. Terminate HTTPS at a managed load balancer/reverse proxy and redirect HTTP there; the sample nginx config is the internal HTTP listener behind that boundary.

Use a managed PostgreSQL database with TLS. Use a migration role for deployment and a separate application role limited to SELECT/INSERT/UPDATE/DELETE on application tables; do not give the application database creation or superuser privileges. The embedded local database is for development only.

Set a unique access-token secret, verified Resend sender and notification recipient. Configure Turnstile site and secret keys for the real hostname and disable the local spam bypass. Production startup rejects missing core provider configuration. Access cookies last 15 minutes; refresh tokens are opaque random values, hashed in PostgreSQL, rotate on use, and expire after 30 days. No refresh JWT secret is needed because refresh tokens are opaque.

Use `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD` for the first seed, then remove both values. Seeds preserve existing services and never reset an existing admin password. Do not migrate the local test admin to production. In-process rate limiting assumes one API instance; add a shared gateway rate limiter before scaling horizontally. Account-level login lockout is database-backed.

The Dockerfiles and nginx config are deployment templates, not a tested hosted release. Build the API and frontend separately. Run `npm run db:migrate` from a release environment with dev dependencies and the migration database role before starting the API container. The runtime container drops dev dependencies and runs as the `node` user. The frontend proxy expects the backend service to resolve as `api` on its private network. Re-generate SEO metadata for the final domain before a frontend build. No automated deployment job is included.

## Email and analytics

Resend email requests use persistent outbox IDs as idempotency keys. Successful deliveries clear the payload from the database. The single worker runs every 15 seconds and uses atomic claims. After 12 attempts a job needs operator review; inspect the job's kind/attempts, fix configuration, then reset `attempts` and `nextAttemptAt` for that specific job using Prisma Studio or a controlled maintenance script. Do not blindly retry old mail: provider idempotency windows are finite. Alert on failed delivery count and Sentry errors.

No external mail is sent in the local default configuration. Contact submissions queue notification and acknowledgement emails. Newsletter signups queue confirmation email; they remain pending without a configured email provider. Confirmation and unsubscribe tokens are hashed in the subscriber table and passed in URL fragments to avoid access logs/referrers.

Tracking is opt-in. Consent lasts 180 days and can be changed from the persistent preferences button. Tracking URLs exclude query parameters. Meta uses a shared browser/server event ID, normalized SHA-256 contact hashes for consented lead events, and a hashed pseudonymous identifier for other events. GA4 uses either the browser transport or Measurement Protocol, never both for the same logical event: GA4 does not guarantee general event-ID deduplication. Google Ads conversion tags can be configured; standalone Google Ads Enhanced Conversions with Ads API credentials is not implemented. GA4 key events can be imported into Ads after account setup. The Meta Graph version is configurable.

Before release, verify: no tracking network requests before consent; accepted events in Meta Test Events and GA4 DebugView; withdrawal stops future events; correct IDs and event counts; Turnstile rejection and hostname/action checks; Resend delivery and SPF/DKIM; session expiry, CSV export and password change. External provider tests cannot be completed without your accounts and keys. See [GA4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4) and [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys).

## Backup and restore

`npm run db:backup` creates a PostgreSQL custom-format backup in ignored `.local/backups`. `npm run db:restore-test` restores it into a newly created, uniquely named scratch database, verifies the service table and drops only that scratch database. It does not overwrite the live database. Set `PG_BIN` to your PostgreSQL client utilities directory if necessary. Credentials are passed through child environment variables, not command-line arguments.

Configure the chosen managed provider for daily encrypted backups and point-in-time recovery, with at least 30 days of backup retention. That schedule is not configured locally. Test restoration in an isolated environment monthly and before risky migrations; compare record counts and run the integration smoke tests before promoting a restored database. Keep backup access restricted and storage separate from the API host. Record the provider's retention and restore results at release.

## Incident response and data handling

1. Check `/api/health` and structured request logs. Request IDs connect failed requests to responses. Do not log request bodies, cookies, email addresses or secret URLs.
2. Check database availability and migration state; use `prisma migrate status`. Do not run destructive schema resets against production.
3. Check pending/failed outbox counts, provider dashboards and configured environment values. Never copy secrets into a ticket.
4. On suspected account compromise, revoke all refresh-token families, rotate credentials and review the audit log. Access-token requests check active token families, so logout/revocation takes effect immediately.
5. Roll back application code only after checking migration compatibility; restore to a new database if data recovery is required.

Proposed retention for owner review: enquiry data 24 months after the last update, rejected/pending newsletter signups 30 days, tracking receipts 30 days, delivered outbox metadata 30 days, failed payloads 7 days after resolution, revoked/expired sessions 30 days, audit history 12 months. Revenue retention must follow the business's applicable accounting requirements. These are operational defaults to review, not a legal policy. Use the maintenance script for approved retention windows. Confirm the controller identity, real contact channel, processors and deletion process in the draft privacy page before release.

For a deletion request, verify the requester, locate their leads/subscriptions, erase or anonymize personal fields and related queued payloads, and handle revenue records under the required accounting retention rules. Soft-delete alone is not erasure. Remove local CSV copies as well. Document backup expiry and processor deletion steps.

Sentry DSNs are optional. Both client and API strip request/user data before sending events; browser replay is not enabled. Configure error-rate alerts and an external health monitor in the chosen accounts before release. Local files alone do not configure those hosted services.
