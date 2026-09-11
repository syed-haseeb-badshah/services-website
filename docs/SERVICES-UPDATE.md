# Services frontend update

Updated files: src/main.tsx, src/content.ts, src/style.css.
New components in src/service-components.tsx: SiteNavigation and ServiceShowcase.

## Editing content

Edit serviceRows in src/content.ts for service introductions and capabilities. Existing slugs are retained; serviceNames changes display names without breaking old links. The six fully visible web services in the supplied screenshot are represented, alongside the existing platform service. Existing marketing service URLs remain under Brand & Content.

Category navigation, filters, and homepage links all derive from serviceCategories.

The three existing fictional projects remain labeled as concepts. Add three ShowcaseProject entries to serviceProjectOverrides['service-slug'] to replace them for a specific service. Each entry accepts id, title, description, label, mediaType ('image' or 'video'), media, alt, optional poster, and optional link. Local assets belong in public/assets and use /assets/ URLs. Videos use controls, muted, playsInline, and preload="none"; no autoplay. Images use native lazy loading and consistent aspect ratios.

## Verification

- npm run build: passed (TypeScript and Vite).
- Browser: all 26 service URLs rendered the expected heading and exactly three showcase cards.
- Browser: Home, About, Work, Contact, Packages, Journal, and Sitemap rendered successfully.
- Services filtering returned the correct five photography/video services and changed the category URL without a full reload.
- Mobile navigation and Services expansion opened successfully; Escape closed the disclosure.
- Desktop ArrowDown opened the mega menu and focused its first category link; navigation was centered within the header.
- Services listing had no horizontal document overflow at actual CSS widths 1920, 1440, 1280, 1024, 768, 430, and 390. Browser scaling required compensating viewport inputs and was verified using innerWidth.
- No browser console errors or warnings in the verified routes.
- Real video playback awaits supplied video files; video rendering attributes are implemented but no final video was supplied.

Backend and form handlers were not modified. Build output in dist was refreshed. The existing ZIP archive was not regenerated.
