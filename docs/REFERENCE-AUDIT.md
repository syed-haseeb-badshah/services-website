# Reference audit and feature map

Research date: 9 September 2026. Appearance is based primarily on the supplied screenshot: warm ivory background, understated terracotta announcement strip, dark green identity, serif display type, spacious two-column hero, photographic editorial art direction, minimal borders, and quiet calls to action. Copy and project identities are original.

## What was actually inspected

| Reference | Evidence and useful pattern | Limitations |
|---|---|---|
| [Swismax](https://swismax.com/) | Browser homepage accessibility tree and screenshot; navigation, broad service taxonomy, rotating hero/project controls, embedded enquiry fields, FAQ content, client portal links, footer. Specialist discovery included drone/photo/video, tours, business email, domains, operational applications. The grouped catalogue makes a large offering discoverable. | Initial web fetch timed out; browser and indexed fallback succeeded. Slider and form controls were inventoried, not all operated. No submission or client-portal login. |
| [WebZorix services](https://www.webzorix.com/services) | Browser service directory tree; homepage indexed content; [custom development detail](https://www.webzorix.com/services/custom-website-development) indexed content with deliverables, process, tiers, integrations, and handover. The service-specific package path informed package-to-enquiry selection. | Directory visual screenshot was not captured; no exhaustive mobile/reference interaction sweep. |
| [SuperSITE about](https://www.supersite.pk/about/) | Browser tree and screenshot; team structure, values, comparison table, FAQ content, platform/industry/resource navigation. Opened the site search overlay and verified input/close controls. Broad platform inventory and sector navigation informed the service and industry directories. | Search submission was not performed. Linked industry/location and other detail pages were inventoried, not all visited. |
| [NexPrime](https://nexprimeagency.com/) | Browser homepage tree and screenshot; web text of full homepage sections, service families, case-study filters, pricing/resource hierarchy, proof and audit entrances. Separating portfolio categories and educational content helps visitors evaluate fit. | Portfolio filters were inventoried from public UI, not exercised on the competitor. No live audit or contact submission. |
| [Loop Origin](https://looporigin.com/) | Browser homepage tree and screenshot and full web text; focused service groups, application/VOIP/infrastructure taxonomy, work examples, geographic context, FAQs, contact paths. Specific deliverable descriptions are more helpful than vague service labels. | Pricing, portfolio, and service subpages were linked but not fully visually reviewed. |

Browser research initially experienced unusually long tool delays. This is a sampled audit, not a claim that every page and mobile interaction on all five references was inspected. Unvisited content and authenticated functionality remain unverified. All five requested websites were reached through browser or web/indexed evidence. No competitor text, photos, identities, contact destinations, or results were copied into the product.

## Deduplicated public feature inventory → implementation

| Feature | Location / treatment |
|---|---|
| Main navigation, mobile navigation, primary quote/call CTA | Shared header and `/contact`; expandable phone menu, active links |
| Broad grouped services and specialist detail content | `/services` filters and 21 `/services/:slug` routes |
| Websites, stores, WordPress, Shopify, WooCommerce, Wix/Webflow/Squarespace | Web & commerce family; platform development consolidates smaller platform offerings |
| Custom apps, integrations, themes/plugins, LMS, marketplaces, CRM/ERP, operational systems, AI experiences | Technology family; advertised capabilities only, not full apps |
| SEO, local search, AEO/GEO, Google Business Profile, PPC/Shopping, social/influencer marketing | Marketing family |
| Branding, corporate design, packaging, writing, photography/video/drone, virtual tours | Brand & content family |
| Hosting, domains, email, maintenance, backups, server support, VOIP/PBX/SIP | Technology family; specialist offerings marked provisional |
| Service benefits, deliverables, process, FAQs, relevant examples and enquiry | Shared individual-service template with unique service data |
| Work listing, categories, project detail and imagery | `/work` filters and three concept case studies; no false live-client destinations |
| Rotating/promoted content and project sliders | Consolidated into visible selected-work grid and category filters; auto-rotating hero omitted to retain the supplied quiet composition and motion preference |
| About, team, values, business history | `/about`; team roles and values included. Founding history omitted because none is supplied |
| Reviews, customer logos, awards, performance statistics | Explicit proof-ready placeholder on `/about`; fabricated proof is not displayed |
| Process / how we work | Homepage, service details and `/process` |
| Package categories, tiers, comparison, custom quote | `/pricing`; real prices unknown, so request-pricing labels; category/package carried to contact |
| Industries, local/remote service context, women entrepreneurs | `/industries` with 16 details; regional context consolidated in contact and footer without invented city offices |
| Blog, resources, category/search, article detail | `/resources`, three complete sample articles, results/empty/reset states |
| Site search | Search pattern consolidated into journal search plus a complete `/sitemap`; a separate global search modal is not implemented |
| Audit lead-generation / audit tool | `/audit`: expandable clearly labeled sample review and request path; no fabricated live measurement |
| Quote/consultation request | `/contact` with validation, optional fields, budget/timeline, and preview summary |
| Phone, WhatsApp, email, social and booking destinations | Editable contact config. Unknown destinations remain honest preview states; no competitor links |
| Newsletter | `/resources`; browser validation and explicit not-subscribed feedback |
| Careers | `/careers`; no invented job openings |
| Client portal: domains, hosting, billing, support, access | `/client-preview`, static illustrative overview. Authentication, real records, payment, tickets, credentials and account actions require a backend and are excluded |
| Legal, FAQ, sitemap, back-to-top, breadcrumbs | Shared footer, `/privacy`, `/terms`, `/faq`, `/sitemap`, service/work/article breadcrumbs |
| 404, direct routes, empty/disabled/loading/error states | Router fallback; form busy/validation/summary states; search empty state |

No database, payment processing, CMS backend, or authentication was added. The frontend demonstrates agency-site journeys while describing larger services rather than trying to implement those services themselves.
