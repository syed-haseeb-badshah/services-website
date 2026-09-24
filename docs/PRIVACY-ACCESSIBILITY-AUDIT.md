# Privacy, trust, consent and accessibility audit

Completed locally: 24 September 2026. The owner subsequently authorized committing and pushing these changes to GitHub. No deployment was performed as part of the audit.

This is an implementation audit, not a legal opinion or certification. The supplied repository describes Aster Digital as a working agency concept, while its content targets UK businesses. It does not establish the legal operator’s identity or country of establishment. Local configuration is not evidence of the production hosting configuration.

## A. Issues found

- Unsupported claims: 400 clients and 50+ websites, repeated on home/service pages; no substantiation supplied.
- Privacy and terms were short prototype notices. Cookie, cancellation/refund and accessibility pages were absent.
- Analytics and marketing were bundled into one choice. The banner appeared even without configured optional providers; granular choices were unavailable.
- Frontend Sentry could initialize before consent. Google consent flags granted advertising alongside analytics. Server relays accepted a single blanket consent flag.
- Meta conversion jobs could include enquiry email and phone, hashed at transmission. Hashing is not anonymisation; these values were unnecessary for answering an enquiry.
- The application created an indefinite localStorage analytics identifier even when no relay was configured. Legacy queued tracking jobs lacked purpose-specific consent.
- Withdrawal unloaded browser tags but could leave queued server events. The revised flow requests cancellation of referenced undelivered jobs.
- Form copy claimed enquiries were saved “securely” without explaining actual processing. Newsletter lacked a nearby privacy link. Form length limits did not mirror backend constraints.
- Low-contrast service links on both light and dark backgrounds, faint service-stat notes and desktop comparison label, heading-order issues, a nested main landmark on newsletter actions, and a non-keyboard-focusable pricing table.
- Carousel reduced-motion state did not respond to preference changes after initial load.
- Legal identity, address, privacy email, retention rules, processor locations, contract/refund terms, and actual business establishment remain unverified. Fixed opening hours were unsupported.
- Lead deletion is soft deletion. No verified scheduled erasure for leads, invoices, active/unsubscribed newsletter records, audit logs, failed email payloads or backups.

Existing protections retained: Zod server validation, parameterised Prisma queries, honeypot/Turnstile support, request limits, Origin restrictions, admin CSRF checks, authentication/session rotation, password hashing, CSV formula-injection protection, generic public server errors and production HTTPS configuration checks.

## B. Fixes implemented

1. Added `/privacy-policy`, `/terms-and-conditions`, `/cookie-policy`, `/refund-policy`, `/accessibility`. Old `/privacy` and `/terms` routes remain available and use canonical URLs for the new paths.
2. Notices describe the implemented forms, database, queue, optional integrations, administration cookies and known retention gaps. Unverified business facts and contract terms are marked OWNER REVIEW rather than fabricated.
3. Added footer policy links and Cookie Settings. The banner only appears when an optional provider is configured and a valid current choice is absent.
4. Implemented equally available Accept All / Reject Non-Essential / Manage Preferences controls, unchecked purpose choices, saved preferences, 180-day choice validity, provider-configuration invalidation, cross-tab refresh and expiry checks. No scrolling or closing is treated as consent.
5. Separated Analytics from Marketing throughout browser tags and server relays. Blocked browser Sentry until Analytics choice; minimised diagnostic event content. No replay or new tracking provider added.
6. Removed enquiry email/phone enrichment from Meta events. Server worker discards legacy tracking payloads without explicit purpose consent. No measurement record is created when no configured, consented server relay exists.
7. Removed the persistent application analytics ID. Optional server relays use a per-event identifier and session references for requesting queue cancellation. Restricted token-bearing newsletter/admin routes from tracking.
8. Added an Origin-checked endpoint that cancels only referenced undelivered tracking jobs. Email jobs are unaffected. Already transmitted/in-flight data cannot be recalled; offline cancellation is best effort and retried on a denied return visit.
9. Added form privacy text, optional field labels and length limits, preserved separate double-confirmed newsletter subscription, and removed the unverified security assurance.
10. Fixed measured accessibility findings and preserved the design palette, local fonts/images, routing, backend schema, forms and integrations. No dependency upgrades were made.
11. Added legal-page sitemap entries, canonical handling and regression tests. Local sitemap uses localhost deliberately; regenerate with the genuine production SITE_URL before publishing.

## C. Cookies / tracking inventory

“Configured” below means the inspected local instance. Production needs its own network/storage verification.

| Technology | Provider | Purpose | Category | Loaded before consent? | Action taken |
|---|---|---|---|---|---|
| `aster-consent-v2` localStorage | Website | Remember purposes, choice time and provider configuration | Necessary preference | Only after user saves | Replaces bundled v1; honoured 180 days; old value can remain on disk until replaced/cleared |
| `aster-consent-v1`, `aster-client-id` | Website | Old bundled choice / persistent visitor identifier | Obsolete | Previously application-managed | Removed by current consent code; no new visitor ID written to localStorage |
| `aster-pending-events` sessionStorage | Website | Up to 100 random event references for cancelling queued relays | Optional, follows consented relay purpose | No | Created only for enabled, consented server relays; no form values; cleared on cancellation or tab-session end |
| `access` | Website | Staff authentication | Necessary | On staff login, independent of visitor consent | Retained; HttpOnly; production Secure; SameSite Strict; 15 minutes; `/api/admin` path |
| `refresh`, `csrf` | Website | Staff session renewal / request protection | Necessary | On staff login | Retained; same protections; 30 days; first-party |
| Google Analytics / gtag / Measurement Protocol | Google | Visits and conversion events | Analytics | No | Unconfigured locally; gated independently; no raw enquiry PII; ad flags denied without Marketing |
| Google Ads | Google | Advertising conversions | Marketing | No | Unconfigured locally; only configured after Marketing choice |
| Meta Pixel / Conversions API | Meta | Advertising measurement | Marketing | No | Unconfigured locally; gated independently; removed email/phone enrichment and disabled automatic browser event configuration |
| Browser Sentry | Sentry | Generic error diagnostics | Analytics | Previously possible; now no | Unconfigured locally; gated and minimised |
| Server Sentry | Sentry | Generic operational errors | Operational diagnostics | Independent of browser choice, if enabled | Unconfigured locally; exception content/request/user/breadcrumb data excluded from outgoing error event |
| Turnstile | Cloudflare | Form abuse protection | Security; deployment exemption needs verification | May load on forms when configured | Local development bypass enabled; retained production protection and disclosed provider |

No GA/Meta/Ads cookies were observed locally because these providers are unconfigured. The policy conditionally names only implemented configured integrations; actual vendor cookie lifetimes/settings must be checked before enabling them. Google tag loading through googletagmanager.com is gtag, not evidence of a separate GTM container. No Hotjar, Clarity, TikTok, LinkedIn Insight, fingerprinting library, payment SDK, chat widget, map, YouTube/Vimeo or social embed was found.

## D. Personal data collected

| Data | Source | Purpose | Storage | Third party | Necessary? |
|---|---|---|---|---|---|
| Name, email, message | Contact form | Answer enquiry | PostgreSQL Lead; email queue; recipient inbox when delivered | Resend if enabled; hosting/database operators | Required for current enquiry workflow |
| Phone, company, service, budget, timeline, package, industry | Contact form | Optional project context / callback | Lead and relevant notification text | Email provider where included | Optional; no sensitive fields requested |
| Email, confirmation/unsubscribe dates and token hashes | Newsletter | Requested subscription and opt-out | NewsletterSubscriber; confirmation email queue | Resend if enabled | Necessary for voluntary subscription; separate from enquiries |
| IP, challenge token, browser signals | Requests / Turnstile | Deliver requests and resist abuse | Transient rate limits; infrastructure logs depend on deployment | Cloudflare when enabled | Security purpose; owner must verify settings/retention |
| Event ID, random identifier, page path, event type, purposes | Consented measurement | Optional visit/conversion measurement | Queue, event deduplication rows, vendor systems | Enabled Google/Meta | Not necessary to use the site; off by default |
| Privacy choice and pending random event references | Browser controls | Remember choice / request cancellation | localStorage / sessionStorage | Preference itself stays local; referenced IDs sent to local cancellation API | Minimized as described above |
| Staff email, password hash, token hashes, login attempts, audit activity | Administration | Access control and accountability | PostgreSQL; necessary cookies | Infrastructure operators | Necessary for administration |
| Client name, amounts, invoice/payment dates, notes | Staff entry | Manual financial administration | RevenueEntry | Infrastructure operators | Owner must confirm legal basis and retention; no card collection |
| Request method/path/status/duration/random request ID | API | Operational logging | Runtime/infrastructure logs | Hosting, and generic Sentry error reports if enabled | Keep only justified operational records |

Forms do not write contact details into localStorage/sessionStorage or tracking payloads. Unsubscribe tokens use URL fragments and POST bodies. Search/filter input is local UI state; no external search service. No public account creation or checkout is implemented.

## E. Third parties

Implemented optional services: Google Analytics, Google Ads, Meta Pixel/CAPI, browser/server Sentry. Implemented form/email services: Cloudflare Turnstile, Resend. WhatsApp is an outbound link only when a number is configured, not an embed. PostgreSQL is a database dependency, not identification of a hosting supplier. Hosting, email inboxes, backups, domains and production reverse-proxy providers remain owner-supplied facts.

Images and SVGs are local assets; typography uses system fonts. Platform logos illustrate service technologies, not documented certifications or partnerships. No automatic external font/media loading was observed in the inspected local instance. Asset licensing still needs owner confirmation against `docs/ASSETS.md`.

## F. Accessibility improvements

- Preserved existing skip link, semantic navigation, labelled fields, meaningful image alternatives and visible focus controls.
- Added route-change focus to main content; corrected newsletter’s nested main, footer heading levels, project/process heading order and decorative preview text semantics.
- Made pricing comparison horizontally scrollable by keyboard.
- Adjusted service link colours for light/dark surfaces and improved service-note contrast.
- Added readable responsive legal pages, keyboard-accessible cookie choices and focus return to the settings trigger.
- Added live reduced-motion handling for carousel and global reduced-motion overrides.
- Verified required-field error association/focus and keyboard opening/closing of the mobile menu with Escape returning focus.

## G. Claims removed / rewritten

| Previous content | Replacement |
|---|---|
| “400 Total clients” / “400 Studio clients” | Removed; retained verifiable counts of services, categories, deliverables, packages, process steps and concept projects |
| “50+ websites created” and service-page variants | “Explore our services and process” / “Explore the services, deliverables and process for your project” |
| “Your enquiry will be saved securely” | Purpose-specific explanation: used to respond; no automatic marketing subscription; avoid sensitive information |
| Contact “Location: United Kingdom” | “Serving UK businesses” (target market, not an assertion of establishment) |
| “Mon–Fri, 09:00–18:00” | “Availability: By arrangement” |

No fabricated testimonials, star ratings, review counts, awards or client endorsements were found to remove. Existing portfolio concepts remain clearly identified as illustrative, not client commissions. Owner should approve service availability, “free consultation” offers and UK-hours collaboration copy before commercial publication.

## H. Required business information to provide

- Legal business/controller name; trading name and business form; establishment country.
- Genuine service/postal address; registered office, registration jurisdiction and company number if incorporated; VAT number if applicable.
- Working business and privacy-contact email; genuine phone/WhatsApp details only if intended for publication.
- Actual countries served and whether customers are businesses only or also consumers.
- Hosting/database/email/backup suppliers, processing locations, contracts, transfer safeguards and subprocessors.
- Approved deposits, milestones, recurring charges, cancellation/refund process and response timetable.
- **OWNER DECISION REQUIRED — DATA RETENTION PERIOD:** leads, subscribers, invoices, logs, audit records, failed deliveries and backups; erasure responsibilities and maintenance schedule.
- Rights/complaints handling process, responsible staff member, any ICO registration/fee obligation and actual service/offer availability.

Do not remove OWNER REVIEW markers merely to make the site appear finished. No fake address, registration or retention period has been substituted.

## I. Applicable / likely applicable / needs legal review

The following is a jurisdiction assessment from the evidence, not a determination of establishment. The task machine’s location is not evidence of the company’s jurisdiction.

| Rule / standard | Status | Assessment and source |
|---|---|---|
| UK GDPR and Data Protection Act 2018, as amended | Likely Applicable | UK-targeted agency enquiries include personal data. Confirm establishment, territorial scope, controller identity and actual lawful bases. [ICO lawful-basis guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/a-guide-to-lawful-basis/) |
| PECR; Data (Use and Access) Act 2025 amendments | Likely Applicable | Optional browser measurement and newsletter activity require purpose-specific assessment. April 2026 ICO guidance includes limited exceptions; this implementation does not assume Google/Meta qualifies for a statistical exception. [Current ICO storage/access guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/) |
| Electronic marketing rules | Likely Applicable | Voluntary newsletter is separate from enquiry; confirmation/unsubscribe preserved. Review every future campaign, consent evidence and sender identity. [ICO electronic mail marketing](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/electronic-and-telephone-marketing/electronic-mail-marketing/) |
| Consumer Rights Act 2015 | Needs Legal Review | Depends on consumer engagements. Agency service terms must preserve mandatory rights and fair remedies. [Government consumer-rights overview](https://www.gov.uk/consumer-protection-rights) |
| Consumer Contracts Regulations 2013 | Needs Legal Review | Absence of checkout does not exclude a distance contract later agreed by email/phone. Confirm consumer sales, pre-contract information, cancellation and early commencement. [Government distance-selling guidance](https://www.gov.uk/online-and-distance-selling-for-businesses) |
| Electronic Commerce Regulations 2002 | Likely Applicable / Needs Legal Review | Assess online service and disclosure requirements against actual entity and territories. [Government ecommerce guidance](https://www.gov.uk/guidance/the-ecommerce-directive-and-the-uk) |
| Company/trading disclosures | Needs Legal Review | If a UK limited company, website registration details and registered office are required; genuine details are missing. [GOV.UK company website disclosures](https://www.gov.uk/running-a-limited-company/signs-stationery-and-promotional-material) |
| CAP advertising rules | Likely Applicable | UK-targeted promotional website claims should be substantiated. Unsupported counts removed. [ASA substantiation guidance](https://www.asa.org.uk/advice-online/misleading-advertising.html) |
| DMCC Act 2024 unfair-commercial-practice provisions | Needs Legal Review | Relevant if consumer-facing practices; the current regime applies to practices from 6 April 2025. [CMA guidance](https://www.gov.uk/government/publications/unfair-commercial-practices-cma207/unfair-commercial-practices) |
| Equality Act 2010 service-provider duties | Likely Applicable / Needs Legal Review | Assess reasonable adjustments for the actual service and location; Northern Ireland has a separate framework. [Equality Act](https://www.legislation.gov.uk/ukpga/2010/15) |
| WCAG 2.2 AA | Applicable technical target, not a certification or standalone finding of legal compliance | Automated checks plus manual keyboard/mobile checks used. Assistive-technology/user assessment still needed. [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) |
| EU GDPR / national ePrivacy rules | Needs Legal Review | “UK & beyond” alone does not prove deliberate EU targeting; confirm EU establishment, offerings and monitoring. [EDPB territorial-scope guidance](https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-32018-territorial-scope-gdpr-article-3-version_en) |
| Other countries’ laws | Needs Legal Review | Actual establishment and target countries not supplied; no generic US template assumed. |

Before publication, a qualified reviewer must complete controller identity, retention/erasure procedures, lawful-basis assessments, processor contracts/transfers, rights/complaints process and consumer/commercial contract terms. Privacy transparency should state actual recipients and retention criteria. [ICO privacy-information guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-privacy-information-should-we-provide/)

Operational limits: no production configuration, live provider dashboards, delivered mail, vendor cookie defaults or production CSP/HTTPS was verified. Queue withdrawal is bounded to references available in a browser tab and cannot recall sent/in-flight data; verify operational behaviour before enabling relays. Soft deletion is not erasure. No claim of full legal or WCAG compliance is made.

## J. Files changed

- `apps/api/src/app.ts`
- `apps/api/src/index.ts`
- `apps/api/src/integrations.ts`
- `apps/api/src/validators.ts`
- `docs/PRIVACY-ACCESSIBILITY-AUDIT.md`
- `index.html`
- `public/sitemap.xml`
- `scripts/seo.ts`
- `src/Layout.tsx`
- `src/components/Consent.tsx`
- `src/components/Footer.tsx`
- `src/components/Newsletter.tsx`
- `src/components/application.css`
- `src/components/shared.tsx`
- `src/contact-page.tsx`
- `src/home.tsx`
- `src/lib/analytics.ts`
- `src/main.tsx`
- `src/pages/Legal.tsx`
- `src/pages/NewsletterAction.tsx`
- `src/pages/Pricing.tsx`
- `src/pages/Sitemap.tsx`
- `src/pages/Work.tsx`
- `src/project-showcase.tsx`
- `src/routes.tsx`
- `src/service-detail-page.css`
- `src/service-detail-page.tsx`
- `src/service-enquiry.tsx`
- `src/style.css`
- `src/theme.css`
- `tests/api.integration.ts`
- `tests/consent.test.ts`
- `tests/validation.test.ts`

No database schema change or major dependency upgrade. Existing unrelated `outputs/` and `report_work/` were left untouched. Temporary browser reports, downloaded axe checker and local logs are under ignored `.local/`.

## K. Testing results

| Check | Result |
|---|---|
| Frontend and API TypeScript | Passed |
| Production frontend/API compilation | Passed; no major dependency changes |
| Validator and consent regression tests | 15 passed |
| PostgreSQL integration suite | 4 passed, including auth/CSRF/session rotation, enquiry deduplication, newsletter confirmation/unsubscribe, service/revenue operations, separate relay purposes and queue cancellation |
| Public-route structure at 390px | 66 routes passed: one main / H1, no missing image alt attributes or unlabelled focusable form fields, no page overflow |
| Automated axe 4.13.0 at 390px | 66 routes, zero reported violations after fixes; some contrast/ARIA checks were marked incomplete by the tool and still require human judgement |
| Browser consent with mocked Google/Meta | No scripts before choice or after rejection; Analytics only / Marketing only / Accept All / refresh / return visit / withdrawal passed. External provider requests were intercepted, not delivered |
| Consent edge cases | Invalid, expired, future and legacy choices rejected; provider changes invalidate choice; blocked storage defaults to denial; no configured optional providers means no tracking |
| Real local enquiry flow | Browser → API → PostgreSQL → accessible confirmation passed. One clearly marked synthetic lead and its two email jobs were verified and removed |
| Form errors | Empty required fields show specific errors; focus moves to name field |
| Mobile keyboard menu | Enter opens; Escape closes and restores toggle focus |
| Privacy baseline | Inspected local instance has no configured optional tracking; observed no public cookies, no external asset/tracker requests and no stored contact details |
| Security source scan | No obvious secret-key patterns found in inspected application/source/config templates. This is not a historical repository/production secret audit |
| Live provider delivery | Not tested: local email, advertising and monitoring credentials are absent. Real Turnstile is bypassed in development; production challenge accessibility still needs verification |
| Formal accessibility / legal certification | Not performed or claimed |

The resumed integration run initially failed while PostgreSQL was stopped; it passed after the local database restarted. Local startup delays caused a temporary connection screen; the final browser check is recorded below. No external email or advertising event was sent during testing.

Additional final viewport/startup results: 66 public routes passed at 320px without page overflow or structural/label failures. Desktop axe at 1440px reported zero violations on all 66 routes after the comparison-label contrast fix. Final homepage rendered correctly, API health returned HTTP 200, no browser errors were reported, and no cookies or external requests were observed in the local baseline. Changed-code formatting and git diff checks passed.

The website is intended to remain running at **http://localhost:5173/** with its API at **http://localhost:4000/** and local PostgreSQL on port 54329. This development instance has spam verification bypassed and no configured email/advertising providers. Do not interpret local development settings as production readiness.
