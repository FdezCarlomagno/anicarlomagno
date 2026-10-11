# Product overview — anicarlomagno.vercel.app

Context for humans and agents. Facts were taken from the code (October 2026 snapshot); items marked
**(confirm)** are inferences the owner should verify.

## What it is

Personal website and storefront of **Analía "Ani" Carlomagno**, a visual artist and teacher from
Tandil, Argentina. She paints women with large eyes ("mujeres de ojos grandes") in saturated, high-contrast,
textured, poetic style, and also sells agendas/notebooks printed with her art, art prints and two books.
Her work evolved from a **naif** style to a **neoexpressionist** one; that arc is part of her story and is shown on the site (see `docs/artist-story.md`).
There is no checkout, cart or payments: **every sale is closed in a WhatsApp conversation**.

Locale: Spanish (es-AR), voseo ("Elegí", "Consultá"). Currency: ARS. Ships to all of Argentina.

## Audience and jobs-to-be-done

| Visitor | Arrives from | Wants to |
|---|---|---|
| Buyer of a gift / personal item (likely women and teachers **(confirm)**) | Instagram, WhatsApp, word of mouth | Pick a personalized agenda/notebook and order it fast |
| Art collector / decorator | Instagram, search | Browse original paintings, see size/availability, ask the price |
| Fan / student / local | Instagram, Tandil events | Know the artist, see her path, contact her |

Traffic is assumed to be mostly mobile (the project is mobile-first by design) **(confirm with analytics)**.

## Catalog and prices

| Product | Route | Notes |
|---|---|---|
| Original paintings ("Obras en stock") | `/obras-en-stock` | Filter all / available / sold; some "40% OFF"; **no price shown**, CTA "Consultar" opens WhatsApp |
| Custom painting | `/obra-personalizada` | Form: name, surname, width × height, description, optional reference photo → WhatsApp |
| Agendas & notebooks | `/agendas`, `/agenda-personalizada` | Types and ARS prices below; cover design chosen from gallery, paper white/cream 80 g, optional name (color + position) and quote |
| Art prints ("Láminas") | `/laminas` | A4 (21 × 29.7 cm) photographic paper; pick one → WhatsApp; promos when buying more than one product |
| Books | `/mi-libro` | "Miradas que narran" (stories) and "Colores que cuentan historias" (coloring book), ARS 25 900 each |
| About | `/sobre-mi` | Stats (+1000 works sold, +20 years creating, +15 teaching), style, timeline, story |
| Contact | `/contacto` | EmailJS form + Google Map + social links |

Prices live in `src/components/config/AgendaPrices.js` and `LibrosPrice.js` (single source of truth —
never duplicate prices in copy or components):

- Agenda perpetua 25 900 · Agenda docente 25 900 · Agenda semanal 23 900
- Cuaderno 16 900 · Cuaderno A4 35 900
- **La frase personalizada no tiene costo adicional** (decisión de negocio, 2026-10-11). Corregido el 2026-10-11 (DL-003): se eliminó `ADICION_DE_FRASE` y el total no cambia al tildar la frase; la frase solo viaja en el mensaje si la casilla está tildada.
- Libros: 25 900 each

## Core flows (what must never break)

1. **Custom agenda order** — `AgendaForm.jsx` (largest component): choose type → paper → cover → optional
   name/quote/notes → validation → computes price → opens `api.whatsapp.com/send?phone=542494245966&text=…`
   with a structured message → toast + reset.
2. **Consult a painting** — `Cuadro.jsx`: prefilled WhatsApp message with the painting name.
3. **Custom painting order** — `customPainting.jsx`: same WhatsApp handoff.
4. **Contact form** — `ContactForm.jsx` → EmailJS (`@emailjs/browser`) → toasts.
5. **Floating WhatsApp button** on every page — `WhatsappIcon.jsx`.
6. **Print consult** — `Laminas.jsx`: prefilled message with the print name.

## Information architecture

```
/                    Home: slider → "Quién soy" → "Mis pasiones" → Agendas strip → Instagram highlights → paintings → CTA block
/elegir              Fork: Obra personalizada | Obras en stock
/obras-en-stock      Catalog (filters)          /obra-personalizada   Form
/agendas             Gallery + CTA              /agenda-personalizada Form (AgendaForm)
/mi-libro            Two books                  /laminas              Prints
/sobre-mi            Bio                        /contacto             Form + map
Global: NavBar (sticky, hamburger on mobile), floating WhatsApp, scroll-to-top, "Envíos a todo el país" strip, FooterNavbar, footer
```

Navigation labels: Inicio · Obras · Agendas y cuadernos · Libros · Láminas · Sobre mí · Contacto.

## Tech facts

- React 18 + Vite 5 (SWC), `react-router-dom` 7 (BrowserRouter; one prerendered HTML per public route + real 404, see `docs/seo-notes.md`), `framer-motion` for animation,
  `@unpic/react` `<Image>`, `react-hot-toast`, `lucide-react`, `react-intersection-observer`, `@emailjs/browser`.
- **Plain CSS**, no Tailwind/CSS-in-JS: global `src/LandingPage.css`, per-page `src/pages/pagesStyles/*.css`,
  `src/components/contact/styles/*.css`. Design tokens in `src/styles/tokens.css` (imported first in `src/main.jsx`),
  documented in `DESIGN.md`; they reproduce the current look 1:1 (Phase 4, DL-011). Font sizes are not tokenized yet (DL-007).
- Content is data in code: `src/objects/*.jsx` (paintings, agendas, books); images are imported from `src/**/imgs`
  (bundled by Vite, many are large JPEGs).
- No tests, no TypeScript, ESLint only (`npm run lint`). Deploy: Vercel.
- Fonts today: Raleway (body) and Dancing Script (logo/headings), self-hosted in `public/fonts/` (`src/styles/fonts.css`).
  No Google Fonts. Only stray font: Arial on the painting size in `/obras-en-stock` (DL-007).
- Current visual identity: white / aliceblue backgrounds, `blueviolet` accent, script logo "anicarlomagno — artista plástica".

## Known UX/UI problems driving the rework

- Visual inconsistency: three font declarations, scattered colors, per-page CSS with duplicated rules.
- Heavy motion everywhere (scale/slide on scroll and hover) without reduced-motion support.
- `user-scalable=no` blocks zoom; several `h1` per page; clickable `div`s; mojibake in `index.html` meta.
- Paintings show no price and the only CTA is "Consultar" — fine for the business, but needs clearer
  information scent (size, technique **(confirm)**, availability, how buying works, shipping).
- Mobile nav is a ☰ glyph button with an animated height list; floating buttons may overlap content.
- Large unoptimized images; no per-route SEO/OG tags; OG image URLs in `index.html` may not exist **(confirm)**.

## Business constraints

- Owner is a solo artist: the site must stay maintainable with data files, not a CMS or backend.
- Conversion = a WhatsApp message with enough detail for Ani to quote and produce. Don't add steps
  that reduce that rate; do add clarity that reduces back-and-forth.
- Artwork imagery is the brand. Never crop, recolor, overlay heavy text on, or AI-alter artwork.
- Personal data: contact form collects name, surname, email, message (sent via EmailJS). Don't add trackers without asking.

## Out of scope unless asked

Payments/cart, user accounts, CMS/backend, i18n beyond es-AR, changing prices or business rules.
