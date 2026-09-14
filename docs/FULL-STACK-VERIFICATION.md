# Local full-stack verification — 14 September 2026

The work remains local. No GitHub push, hosted deployment, DNS change or real provider message was made.

## Passed

- Frontend and backend strict TypeScript checks.
- Production Vite frontend and TypeScript API builds.
- Five validation tests covering unknown fields, malformed contact input, monetary precision, secret injection, consent requirements, safe service slugs and newsletter normalization.
- Three PostgreSQL integration scenarios covering the complete enquiry/admin flow, refresh-token replay and password-change revocation, and mocked email/Meta/GA4 delivery.
- Authentication rejection without cookies, wrong-origin rejection, missing-CSRF rejection, account lockout, cookie flags, login/logout, refresh rotation, replay-family revocation and password-change session invalidation.
- Contact persistence, duplicate event-ID handling, honeypot rejection, inbox filters, lead notes/status, CSV export and soft deletion.
- Service create/update/reorder/unpublish and public API visibility.
- Revenue create/update and exact currency-separated aggregates.
- Newsletter confirmation and unsubscribe; consumed confirmation tokens cannot resubscribe someone.
- Server conversion validation, duplicate suppression, SHA-256 Meta email/phone hashes, exclusion of email from GA4 payloads, and removal of delivered outbox payloads. Providers were mocked; no external conversion was sent.
- Browser homepage rendering, local contact submission success, admin login and visibility of the submitted enquiry in the Leads inbox. No reported browser runtime errors in these checks.
- Rejected optional cookies left no Google/Meta tracking scripts in the browser.
- Initial SQL migration and seed applied to local PostgreSQL. All 26 original services and three package names are in the development database.
- Real `pg_dump` backup, restored with `pg_restore` into a new isolated PostgreSQL database. Restore completed and the service count matched 26. The scratch database was then dropped; development data was untouched.
- Local credentials, API `.env`, database files and backups verified as git-ignored.
- Dependency installation reported zero known vulnerabilities after the `deepmerge-ts` override.

## Still requires business accounts / release setup

- Real business contact information, domain and hosting choice.
- Resend credentials, verified sender DNS, notification recipient and real delivery checks.
- Turnstile production hostname/site/secret keys and a live challenge check. Local development uses an explicit bypass; production rejects it.
- GA4/Meta/Google Ads IDs and secrets, live Meta Events Manager and GA4 DebugView checks. Direct Google Ads Enhanced Conversions via the Ads API is not implemented; GA4 Measurement Protocol and the Google Ads browser conversion tag are provided.
- Sentry DSNs, hosted alert rules and an external uptime monitor.
- Hosted HTTPS, production smoke tests, least-privilege database roles, daily managed backups and provider restore drill.
- Approval of the draft privacy/terms text, retention policy and business claims.

Deployment templates and the operations runbook are prepared, but a production-ready hosted release is not claimed.
