# Decision log

Append-only. Newest at the bottom. Template:

```
## DL-000 — Title (YYYY-MM-DD)
Status: proposed | accepted | superseded by DL-xxx
Context: why this came up
Decision: what we chose
Alternatives: what we rejected and why
Consequences: tokens/files affected, follow-ups
```

## DL-001 — Adopt Google DESIGN.md + Apple reference as the design-system base (2026-10-11)
Status: accepted
Context: Complete rework of design system and UX/UI; legacy plain CSS with no tokens, three font declarations, one local color set.
Decision: Use Google's DESIGN.md format as the token source of truth, seeded from an Apple-style DESIGN.md
(`.claude/skills/apple-design/references/apple.DESIGN.md`) as a quality/structure reference, adapted to the artist's brand.
Alternatives: Tailwind migration (rejected for now — larger change, not needed); copying an Apple look literally (rejected — wrong brand).
Consequences: Project `DESIGN.md` + `src/styles/tokens.css` to be created in Phase 1; open decisions: accent color, type pairing, radius, motion.

## Open decisions (Phase 1)
- [ ] Accent color (keep violet family vs. new neutral+one accent)
- [ ] Type pairing (Dancing Script for logo only? body: Inter vs. system stack)
- [ ] Radius and elevation scale
- [ ] Motion language and reduced-motion policy
- [ ] Home hero concept (slider vs. single featured work)

## DL-002 — Ambición premium y dirección de arte previa (2026-10-11)
Status: accepted (direction itself pending, Phase 4b)
Context: The goal is not only a tidy landing but a premium, gallery-like mobile experience that makes Ani stand out, while keeping her brand essence.
Decision: Added phases 4b (art direction, 2–3 prototypes, one chosen before building), 10b (prestige and trust) and 10c (interaction polish); reinforced 7 (premium Home) and 8 (gallery viewer, series, artwork pages). Premium comes from presentation, not rebranding.
Consequences: Phases 7, 8, 10b are written against the Phase 4b prototype; Ani must supply content (series, exhibitions, press, testimonials, workshop photos).

## DL-003 — La frase personalizada de agendas no tiene costo adicional (2026-10-11)
Status: accepted; implemented 2026-10-11
Context: La Fase 0 detectó que `ADICION_DE_FRASE: 3000` se suma al total cuando se tilda "Agregar frase personalizada" (`AgendaForm.jsx:127-129`), y que al destildar la casilla el texto de la frase igual viaja en el mensaje.
Decision: Regla de negocio (Valentín/Ani): la frase es gratis. El comportamiento actual (cobrar $3000) es incorrecto.
Consequences: Corregido en `AgendaPrices.js` y `AgendaForm.jsx` (precio y mensaje), verificando antes/después con los 3 casos de `design/audits/2026-10-critical-flows.md`; incluir la frase en el mensaje solo si la casilla está tildada. Actualizar `product-overview.md` al aplicar el cambio.

## DL-004 — Sin banner de cookies; legales de alcance reducido (2026-10-11)
Status: accepted (Fase 2)
Context: El sitio no guarda cookies ni storage, pero enviaba datos a Google al cargar (Google Fonts en todas las rutas, Maps en `/contacto`).
Decision: No necesitar banner: fuentes autoalojadas (Raleway y Dancing Script variables, `public/fonts/`, se quitó Cedarville Cursive sin uso) y mapa con "clic para cargar". Privacidad y términos breves en `/privacidad` y `/terminos`; solo se publican nombre y contacto (WhatsApp y email).
Alternatives: Banner de consentimiento (rechazado: no hay cookies propias ni analítica). Publicar CUIT, domicilio, pagos, envíos, devoluciones, arrepentimiento y leyenda de Defensa del Consumidor (fuera de alcance por decisión del dueño; ver `docs/legal/legal-notes.md`).
Consequences: Si se agrega analítica o cualquier script con cookies no esenciales, hace falta banner con consentimiento previo. Email de contacto pendiente: no mergear a `main` con `[PENDIENTE]`.

## DL-005 — SEO técnico: HTML por ruta generado en el build, 404 real (2026-10-11)
Status: accepted (Fase 3)
Context: SPA con rewrite total a `/`: todas las URLs servían el mismo title/description/canonical (a la Home), imágenes OG inexistentes, sin robots/sitemap y soft 404. Las vistas previas de WhatsApp/Facebook/Instagram no ejecutan JS.
Decision: Opción C del spike. Un plugin propio de Vite (`scripts/seo-plugin.js`, sin dependencias) escribe `dist/<ruta>/index.html` con su `<head>` y JSON-LD a partir de `src/seo/routes.js`, más `sitemap.xml` y `404.html`; `RouteMeta` sincroniza el título al navegar. Se quitó el catch-all de `vercel.json` y `path="*"` muestra `NotFound`. Dominio: `anicarlomagno.vercel.app`. Redes: Instagram y TikTok `anicarlomagno_painting`, Facebook `anicarlomagno`; X no existe. Imagen OG: copia de `aniSection7.jpg`.
Alternatives: `react-helmet-async` (rechazada: no sirve para vistas previas); prerender con `vite-react-ssg` o modo framework de React Router (rechazada: reescribe el router, soporte de Vite 8 sin confirmar y framer-motion renderiza contenido invisible en el servidor).
Consequences: El `<body>` servido sigue vacío hasta que corre JS (Google lo renderiza). Toda ruta pública nueva debe sumarse a `src/seo/routes.js` o da 404 al entrar directo. Pendiente de verificar en el preview de Vercel: carpetas sin barra final, status 404 y vistas previas reales.
