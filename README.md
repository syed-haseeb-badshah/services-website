# Aster Digital — local agency frontend

Complete React + TypeScript + Vite prototype, saved in `C:\Users\HP\Desktop\Client-Agency-Website`. The Windows Desktop location was detected through `Environment.GetFolderPath('Desktop')` and matched the current folder.

## Run locally

Requires Node.js 20.19+ or 22.12+ (built with Node 24).

```powershell
npm ci
npm run dev
```

Open the Local URL printed by Vite, normally http://127.0.0.1:5173. Keep the terminal running. This is a web application: do not double-click `index.html`.

```powershell
npm run build
npm run preview
```

The production website is in `dist`. Preview normally uses http://127.0.0.1:4173. TypeScript compilation is part of the production build.

## Editing

- `src/content.ts`: business identity, logo paths, primary palette, contact destinations, service catalogue, package names, concept projects, industries, FAQs, and full sample articles.
- `src/main.tsx`: reusable layout, route templates, form, filters, page copy, and package comparison structure.
- `src/style.css`: design tokens, responsive styles, typography, and interaction states. Core palette values are applied from `brand.colors`; secondary surface tones are CSS tokens/styles.
- `public/logo.svg` and `public/wordmark.svg`: original placeholder monogram and wordmark. Replace these along with the configured business name.
- `public/assets`: downloaded, locally served stock photography. See `docs/ASSETS.md`.

The main templates are shared by 21 service detail pages, 16 industry pages, three case studies, and three full sample articles. Supporting routes include pricing, contact, audit demo, FAQs, process, careers, client preview, sitemap, draft legal pages, and a 404 view.

## Preview boundaries

No backend, database, authentication, analytics, payment processing, or email delivery is included. Enquiry and newsletter forms only validate in-browser and show explicitly labeled preview feedback. Input is neither transmitted nor persisted. The audit is a fixed sample, not a live scan. The client area is a clearly labeled static demonstration with no real records or account actions.

Blank contact destinations display honest unavailable states. Configure real destinations before enabling them. There are no competitor contact links in the website.

## Static-host routing

Nothing has been published. If hosting later, serve `dist` and rewrite unknown non-asset paths to `/index.html` so direct links and refreshes work with BrowserRouter. Keep actual asset 404 responses intact. The Vite dev/preview servers provide SPA fallback locally. A static host without a rewrite needs equivalent route handling. Do not publish unreviewed draft legal pages or provisional claims.

## Before publication

1. Replace placeholder business name, wordmark, monogram, region, contact details, social destinations, and metadata.
2. Confirm the actual service offering, specialist capability, commercial packages, timelines, and support terms.
3. Replace team placeholders and concept projects with approved biographies and real commissioned work where available.
4. Add only verified testimonials, recognition, and results, with permission.
5. Review privacy/terms against the actual business and eventual integrations.
6. Commission production form delivery separately; this deliverable intentionally remains frontend-only.

## Handoff

`Client-Agency-Website.zip` contains source, assets, documentation, lockfile, and the production build. It excludes `node_modules`, generated TypeScript build metadata, and temporary files.

See `docs/REFERENCE-AUDIT.md` for research scope and feature mapping, and `docs/VERIFICATION.md` for checks actually run and limitations.
