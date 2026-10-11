# Definition of Done (UI changes)

Tick every item or write why it doesn't apply.

**Build & code**
- [ ] `npm run build` passes; `npm run lint` passes for touched files.
- [ ] No raw hex / px values / font names outside tokens; no inline styles for design values.
- [ ] Legacy CSS replaced by this change is deleted; no dead imports.
- [ ] Prices, WhatsApp URLs/templates, EmailJS, routes unchanged (or change explicitly approved).

**Responsive & visual**
- [ ] DOM checks at 360/390, 768 and 1280 px with `design/tools/dom-facts.mjs` (no horizontal overflow, nothing clipped, no overlap between floating WhatsApp / scroll-to-top / nav by bounding boxes). **No screenshots.**
- [ ] Visual review by the user on a phone or the branch preview (the agent states it did not see it).
- [ ] Artwork unaltered, correct aspect ratio, `alt` present, width/height set, lazy-loaded below the fold.
- [ ] Hover, focus, active, disabled and loading states exist for every interactive element.

**Accessibility (WCAG 2.2 AA)**
- [ ] Contrast ≥ 4.5:1 text, ≥ 3:1 large text/UI; focus indicator visible.
- [ ] Fully keyboard-operable; real `button`/`a`; one `h1`, ordered headings; landmarks.
- [ ] Forms: labels, errors announced and not color-only.
- [ ] `prefers-reduced-motion` respected; zoom not disabled.

**UX & content**
- [ ] One clear primary action; no dead end.
- [ ] Copy in es-AR (voseo), no mojibake, no lorem.
- [ ] Per-route `<title>`/description considered.

**Performance**
- [ ] No new heavy images/libs; no layout shift on load; LCP image prioritized on `/`.

**Process**
- [ ] Reviewed by a separate pass (`ux-a11y-reviewer`).
- [ ] Decision-log entry added if a design decision was made.
- [ ] Hand-off states what was verified and what was not.
