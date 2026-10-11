---
name: landing-ux-audit
description: Audit a page or component of this landing/shop for UX, conversion, mobile-first, accessibility and performance, and return prioritized fixes. Use before and after any redesign, when asked to review/critique UI, or to check a page against the definition of done.
---

# Landing UX audit (project-specific)

Output: a table `Severity | Where (file:line or route) | Problem | Fix`, sorted P0 → P2, then a short
"keep" list of what already works. Do not edit code during an audit unless asked.

Run these lenses in order. Combine with `web-design-guidelines` for the generic rule set and, if
available, the Claude `design:accessibility-review`, `design:design-critique` and `design:ux-copy` skills.

## 1. Purpose and conversion (this product)
- The primary action per page is obvious in 5 seconds: consult on WhatsApp, or finish a custom order
  (agenda / painting). Compare with the funnels in `docs/product-overview.md`.
- The WhatsApp handoff opens with the right prefilled message and never loses form data on failure.
- Price, size, availability (sold / offer) and shipping ("envíos a todo el país") are visible where the decision happens.
- No dead ends: every page has a next step and a way back.

## 2. Mobile-first (most traffic is phones via Instagram/WhatsApp)
- Test at 360, 390, 768, 1280 px. No horizontal scroll, no clipped text.
- Touch targets ≥ 44×44 px; primary CTA reachable with the thumb; sticky UI doesn't cover content
  (navbar, floating WhatsApp button, scroll-to-top, footer nav).
- Zoom must not be disabled: `user-scalable=no` in `index.html` is an a11y failure — flag it.

## 3. Visual system
- Only tokens from `DESIGN.md`; one accent; max 2 font families; consistent radius/spacing.
- Artwork at the right aspect ratio, with meaningful `alt`, lazy-loaded below the fold.
- Hierarchy: one `h1` per route, headings in order (the code currently has several `h1` per page
  and uses `h1` for card titles).

## 4. Accessibility (WCAG 2.2 AA)
- Contrast ≥ 4.5:1 body / 3:1 large text and UI; visible focus; keyboard path through nav, forms, overlays.
- Interactive elements are real `button`/`a` (not clickable `div`, e.g. the WhatsApp icon).
- Form labels, error text tied via `aria-describedby`, errors not conveyed by color alone.
- `prefers-reduced-motion` honored for framer-motion animations.

## 5. Performance
- Large JPEG/PNG sources in `src/` are bundled as-is; check sizes, formats (WebP/AVIF), `width/height`, lazy loading.
- LCP on `/` is the slider image: prioritize it and avoid layout shift.
- Fonts: preconnect + `display=swap` exist; limit weights.

## 6. Content and SEO
- Spanish (es-AR) copy with voseo ("Elegí", "Consultá"), consistent tone. `index.html` has mojibake
  in `<title>`/meta (`AnalÃ­a`) — flag encoding issues.
- Each route needs its own title/description (SPA with rewrite-all in `vercel.json`).
