---
version: alpha
name: anicarlomagno
description: Sitio y tienda por WhatsApp de Ani Carlomagno, artista plástica de Tandil. La obra (mujeres de ojos grandes, saturadas y de alto contraste) es la protagonista; el sitio la enmarca con fondos claros (blanco y aliceblue), un único acento violeta, la firma en Dancing Script y Raleway para leer. Fase 4 — estos tokens reproducen exactamente el sitio actual; los cambios de diseño se registran en docs/governance/decision-log.md.

colors:
  accent: "blueviolet"
  accent-a05: "rgba(137, 43, 226, 0.05)"
  accent-a10: "rgba(137, 43, 226, 0.1)"
  accent-a20: "rgba(137, 43, 226, 0.2)"
  accent-a27: "rgba(137, 43, 226, 0.274)"
  accent-a30: "rgba(137, 43, 226, 0.3)"
  accent-a80: "rgba(137, 43, 226, 0.795)"
  accent-a85: "rgba(137, 43, 226, 0.85)"
  accent-muted: "rgba(156, 82, 224, 0.699)"
  orchid: "#a518cf"
  plum: "#764ba2"
  periwinkle: "#667eea"
  canvas: "rgba(255, 255, 255, 0.87)"
  surface: "aliceblue"
  white: "white"
  black: "black"
  ink: "#242424"
  gray-800: "#333"
  gray-700: "#444"
  gray-600: "#666"
  gray-550: "gray"
  gray-500: "#888"
  gray-300: "#ccc"
  gray-200: "#ddd"
  gray-100: "#f0f0f0"
  gray-50: "#f8f9fa"
  black-a08: "rgba(0, 0, 0, 0.08)"
  black-a10: "rgba(0, 0, 0, 0.1)"
  black-a12: "rgba(0, 0, 0, 0.12)"
  black-a15: "rgba(0, 0, 0, 0.15)"
  black-a30: "rgba(0, 0, 0, 0.3)"
  error: "#e74c3c"
  error-hover: "#c0392b"
  error-a10: "rgba(231, 76, 60, 0.1)"
  error-surface: "#f8d7da"
  error-text: "#721c24"
  error-border: "#f5c6cb"
  success: "#27ae60"
  success-a10: "rgba(39, 174, 96, 0.1)"
  success-surface: "#d4edda"
  success-text: "#155724"
  success-border: "#c3e6cb"
  mint: "#35f59b"
  mint-light: "#5aeebd"
  whatsapp: "rgba(37, 211, 102, 1)"
  whatsapp-hover: "rgb(17, 179, 76)"

typography:
  logo-hero:
    fontFamily: Dancing Script
    fontSize: 50px
    fontWeight: 700
  logo-hero-subtitle:
    fontFamily: Dancing Script
    fontSize: 30px
    fontWeight: 400
  logo-nav:
    fontFamily: Dancing Script
    fontSize: 16px
    fontWeight: 700
  logo-nav-subtitle:
    fontFamily: Dancing Script
    fontSize: 12px
    fontWeight: 700
  title-script:
    fontFamily: Dancing Script
    fontSize: 2rem
    fontWeight: 700
  title-page:
    fontFamily: Raleway
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: Raleway
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-relaxed:
    fontFamily: Raleway
    fontSize: 16px
    fontWeight: 400
    lineHeight: 2
  label:
    fontFamily: Raleway
    fontSize: 0.95rem
    fontWeight: 600
  caption:
    fontFamily: Raleway
    fontSize: 0.9rem
    fontWeight: 400
  button:
    fontFamily: Raleway
    fontSize: 1rem
    fontWeight: 600

rounded:
  2xs: 4px
  xs: 5px
  sm: 6px
  md: 8px
  lg: 10px
  xl: 12px
  2xl: 16px
  pill: 25px

spacing:
  "1": 0.25rem
  "2": 0.5rem
  "3": 0.75rem
  "4": 1rem
  "5": 1.25rem
  "6": 1.5rem
  "8": 2rem
  "12": 3rem
  legacy-2: 2px
  legacy-3: 3px
  legacy-4: 4px
  legacy-5: 5px
  legacy-6: 6px
  legacy-8: 8px
  legacy-10: 10px
  legacy-12: 12px
  legacy-14: 14px
  legacy-15: 15px
  legacy-16: 16px
  legacy-20: 20px
  legacy-24: 24px
  legacy-25: 25px
  legacy-30: 30px
  legacy-32: 32px
  legacy-40: 40px
  legacy-50: 50px
  legacy-60: 60px

components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: 50px
    padding: 12px 40px
  button-hero:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.xs}"
    padding: 8px
  button-filter-active:
    backgroundColor: "{colors.gray-800}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: 0.8rem 1.5rem
  text-link:
    backgroundColor: "{colors.white}"
    textColor: "{colors.accent}"
    typography: "{typography.body}"
  text-link-on-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.accent}"
    typography: "{typography.body}"
  form-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 1.5rem
  form-label:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.gray-800}"
    typography: "{typography.label}"
  form-text-muted:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.gray-600}"
    typography: "{typography.label}"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.gray-800}"
    rounded: "{rounded.sm}"
    padding: 12px
  alert-success:
    backgroundColor: "{colors.success-surface}"
    textColor: "{colors.success-text}"
    rounded: "{rounded.xs}"
    padding: 15px
  alert-error:
    backgroundColor: "{colors.error-surface}"
    textColor: "{colors.error-text}"
    rounded: "{rounded.xs}"
    padding: 15px
  stat-card:
    backgroundColor: "{colors.orchid}"
    textColor: "{colors.white}"
    rounded: "{rounded.2xl}"
    padding: 12px
---

# anicarlomagno — DESIGN.md

Fuente de verdad visual del sitio. Los tokens del YAML se reflejan 1:1 en `src/styles/tokens.css`
(`colors.X` → `--color-X`, `rounded.X` → `--radius-X`, `spacing.X` → `--space-X`); familias, sombras y movimiento
se listan abajo con su variable. Inventario de origen y conteos: `design/audits/tokens-inventory.md`.

**Estado (Fase 4):** los valores reproducen el sitio tal como está. No son todavía el diseño deseado: varias
decisiones están propuestas en el decision-log (DL-006 a DL-010) y no se aplican hasta que se aprueben.

## Overview

Es la casa de una artista, no una tienda genérica. Ani pinta mujeres de ojos grandes, con color saturado, alto
contraste y textura; cada venta se cierra en una conversación de WhatsApp. El sitio tiene que sentirse cálido,
cercano y cuidado, como entrar a su taller o a una galería chica, y nunca competir con la obra.

Lo que no se toca sin aprobación explícita:

- **La firma.** "anicarlomagno — artista plástica" en **Dancing Script**: es su logo y su voz manuscrita.
- **La lectura en Raleway.** Todo el texto corrido, los formularios y los botones.
- **Un solo acento: violeta** (`blueviolet`). Significa "esto es de Ani" o "esto se toca". No se agregan otros acentos.
- **Fondos claros y suaves:** blanco y aliceblue. La obra pone el color; la interfaz no.
- **La obra es intocable:** no se recorta de forma destructiva, no se recolorea, no se le pone texto ni overlays encima.
- **Voz:** español rioplatense con voseo ("Elegí", "Consultá"), cálida y directa.

## Colors

- **Acento (`accent`, blueviolet #8a2be2):** CTAs, links, precios, palabras destacadas, bordes de sección y foco
  (`--focus-ring`). Pasa AA como texto: 5.96:1 sobre blanco y 5.55:1 sobre aliceblue, así que no hace falta una
  variante de texto. Los tintes `accent-a05…a85` son fondos de selección, tarjetas de agenda y hovers; están
  escritos con rgb(137, 43, 226), una unidad por debajo del acento, tal como estaban.
- **Superficie (`surface`, aliceblue):** tarjetas, formularios, menú abierto, fichas de obra. Sobre blanco separa sin bordes.
- **Lienzo y texto base (`canvas`, `ink` #242424):** fondo de la página y color que hereda todo el texto.
- **Grises (`gray-800…gray-50`):** títulos y labels (#333), ayudas (#666), bordes de inputs (#ddd, #ccc), fondos sutiles.
- **Púrpuras secundarios (`orchid`, `plum`, `periwinkle`):** solo en los degradés de "Sobre mí" y el toast. Son una
  segunda paleta heredada; DL-006 propone absorberla en el acento.
- **Feedback:** `error`, `success` y sus superficies de alerta. **WhatsApp** usa el verde de la marca, solo en su botón.
- **Menta (`mint`):** únicamente los badges "NUEVO" de agendas.

Pares que hoy **no** pasan AA (no se cambiaron; propuesta en DL-010): error #e74c3c como texto (3.82:1), éxito sobre
su tinte (2.60:1), blanco sobre menta (1.43:1), periwinkle como texto chico (3.66:1), descripción de obra #888 sobre
aliceblue (3.30:1), placeholder `gray` (3.95:1), texto del footer sobre su degradé (1.88–3.03:1), bordes de inputs
(1.36–1.61:1) y tres hovers. Por eso esos pares no figuran en `components`. Tabla completa en el inventario.

## Typography

| Variable | Valor | Uso |
|---|---|---|
| `--font-body` | `"Raleway", sans-serif` | todo el sitio (`* { font-family }`) |
| `--font-script` | `"Dancing Script", cursive` | logo y títulos manuscritos |
| `--font-script-bare` | `"Dancing Script"` | los mismos títulos en reglas que hoy no tienen respaldo genérico |

Raleway (variable 100–900, con itálica) y Dancing Script (variable 400–700) están autoalojadas en `public/fonts/`
(`src/styles/fonts.css`). No se agregan fuentes sin aprobación.

Los niveles del YAML describen los roles que existen hoy (valores mobile; en ≥768 px el logo del hero pasa a 80/40 px,
el de la barra a 24/16 px y los títulos manuscritos a 2.5–3rem). **Los tamaños todavía no son variables CSS**: el CSS
heredado usa 36 tamaños distintos, en px y rem, sin escala. La escala base se decide en DL-007 y se aplica al rediseñar
cada componente. Mínimo para texto corrido e inputs en mobile: 16 px.

## Layout

Mobile first: el CSS base es para ~360–390 px y se amplía con `min-width: 768px` y `1024px`.

- **Escala de espaciado (`spacing.1…12` → `--space-1…--space-12`):** múltiplos de 0.25rem, sigue el tamaño de letra de
  la persona. Es la que se usa en todo trabajo nuevo.
- **`legacy-*` (px fijos):** reflejan los valores en px que ya existían (20px es el más común, con 32 usos). Solo
  existen para que el CSS heredado use tokens sin moverse un píxel; desaparecen cuando cada componente se rediseña
  sobre la escala rem. No usarlos en código nuevo.

## Elevation & Depth

La profundidad viene sobre todo del tono (aliceblue sobre blanco), no de sombras.

| Variable | Valor | Uso |
|---|---|---|
| `--shadow-sm` | `0 2px 8px rgba(0, 0, 0, 0.1)` | miniaturas, tarjetas chicas |
| `--shadow-card` | `0 4px 20px rgba(0, 0, 0, 0.08)` | tarjetas de "Sobre mí" |
| `--shadow-menu` | `1px 22px 34px 0px rgba(163, 6, 240, 0.75)` | menú mobile desplegado |

Rasgo propio: las fotos de Ani en la Home llevan una **sombra violeta sólida desplazada** (`21px 22px 0 -4px` y
`-23px -21px 0 -4px` en `--color-accent`), como un marco corrido. Las demás sombras son de un solo uso.

## Shapes

Radios en uso: `2xs` 4px, `xs` 5px, `sm` 6px, `md` 8px, `lg` 10px, `xl` 12px, `2xl` 16px, `pill` 25px, y
`--radius-round: 50%` para círculos (botón de WhatsApp, íconos sociales; va solo en CSS porque el formato de
DESIGN.md no admite porcentajes). Hay demasiados radios chicos parecidos (4/5/6/8 px); DL-008 propone reducirlos.

## Motion

| Variable | Valor | Usos hoy |
|---|---|---|
| `--duration-100` | 100ms | 3 |
| `--duration-200` | 200ms | 18 (la más común: hovers, inputs, botones) |
| `--duration-300` | 300ms | 17 |
| `--duration-400` | 400ms | 3 |
| `--duration-500` | 500ms | 5 |
| `--duration-1000` | 1s | 2 (spinner, botón "subir") |
| `--duration-toast` | 3s | 2 (espera del toast antes de irse) |
| `--ease-default` | `ease` | 36 |
| `--ease-in-out` | `ease-in-out` | 11 |

Con `prefers-reduced-motion: reduce` las animaciones y transiciones bajan a 0.01ms y se apagan las revelaciones
por scroll (`LandingPage.css`). Además, Framer Motion anima desde JSX (por ejemplo, la entrada del hero en 0.8s);
esos valores no pasan por los tokens CSS. DL-009 propone la curva y las duraciones de destino.

## Components

Los componentes del YAML son los que existen hoy y pasan contraste, con sus valores mobile:

- `button-primary`: `.btnAgenda`, `.buy-book-btn`, `.btn-submit` (agendas, libro, formularios).
- `button-hero`: "Mis obras" en el hero de la Home (`.btnMyPaintings`).
- `button-filter-active`: filtro elegido en Obras en stock.
- `text-link` / `text-link-on-surface`: links en violeta sobre blanco y sobre aliceblue.
- `form-card`, `form-label`, `form-text-muted`, `input`: formulario de agenda personalizada.
- `alert-success` / `alert-error`: mensajes del formulario de contacto.
- `stat-card`: estadísticas de "Sobre mí" (el valor es el inicio de su degradé orchid → plum).

Los componentes completos se redefinen en las fases 6 a 10.

## Do's and Don'ts

- Usá siempre `var(--…)`: nada de hex, rgb ni px nuevos en componentes.
- Usá el violeta solo para lo interactivo o lo que es firma de Ani; nunca como decoración de fondo grande.
- Dancing Script solo para el logo y títulos cortos; nunca para texto corrido, botones ni formularios.
- No pongas texto, degradés ni filtros sobre la obra. No la recortes de forma destructiva ni la recolorees.
- Mantené AA: 4.5:1 en texto normal, 3:1 en texto grande, bordes y foco. Calculalo con `design/tools/contrast.mjs`.
- No uses los tokens `legacy-*` ni los púrpuras secundarios en trabajo nuevo.
- Respetá `prefers-reduced-motion`; el movimiento explica, no decora.
