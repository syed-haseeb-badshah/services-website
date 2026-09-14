# Professional enhancement audit

Baseline: c2a53bd. React 19 + TypeScript + Vite. Frontend only; all work stays local.

## Architecture reviewed before edits

- `main.tsx`: BrowserRouter, metadata effect, route templates, project grid, FAQ, process and footer.
- `home.tsx`: hero, animated statistics, four-discipline carousel, all services, process, partner copy and FAQ.
- `content.ts`: 26 services, four categories, three explicitly fictional concepts, 16 industries, three articles, FAQs and package outlines.
- `service-components.tsx`: responsive navigation and legacy showcase.
- `project-showcase.tsx` and `service-work.tsx`: shared ten-second looping carousel and hover-only video code.
- `service-detail-page.tsx`: shared detail template, comparison and closing panels. Keep inner-service FAQs removed.
- `contact-page.tsx`: UK form, validation and local review; no submission backend.
- `about-page.tsx`, `pre-footer-cta.tsx`, `animated-stats.tsx`: existing components to extend.
- CSS cascade reviewed: style, refined, charcoal-theme and visual-refresh. Preserve charcoal, white, apricot, teal and category colours.

Baseline browser checks: 1345px desktop, 789px tablet, 397px mobile. No page overflow. Mobile navigation opens. Existing images total about 1.08 MB. There are no approved videos, booking URL, testimonials or certifications. User-confirmed figures are 400 clients and 50+ websites, both studio-wide.

## Phases

1. Audit architecture, routes, design and responsiveness; create source snapshot.
2. Clearer hero, consistent consultation actions, call-request navigation and honest contact context.
3. Extend existing process, statistics/trust, cards, case studies and FAQs. Add one concise Who we help section.
4. Extract reusable video handling from existing video markup. Support poster fallback, lazy loading, hover preview, muted autoplay and controlled playback. No filler media.
5. Check desktop, tablet and mobile. Fix concrete accessibility or layout issues without redesigning.
6. Build and check every listed route, images, headings, metadata, navigation, filters and form. Record results below.

Recovery checkpoints are in `.recovery/professional-enhancement/`. No dependencies, third-party integrations or GitHub push are part of this request.
