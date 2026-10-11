# Inventario de tokens — Fase 4 (2026-10-11)

Valores reales del CSS en `fase-3-seo`, cuántas veces aparece cada uno y a qué token quedó mapeado.
Archivos: `src/index.css`, `src/styles/fonts.css`, `src/LandingPage.css`, `src/pages/pagesStyles/*.css`,
`src/components/contact/styles/*.css`. Fuente de verdad de los tokens: [`DESIGN.md`](../../DESIGN.md) → `src/styles/tokens.css`.

Cómo se midió: `node design/tools/css-inventory.mjs` (cuenta literales en declaraciones; lo escrito con `var(--…)`
no se cuenta, así que el mismo script corrido hoy muestra lo que **quedó sin tokenizar**). Los conteos de
`agendas.css` suman, aparte, los usos de sus variables locales (`var(--primary-color)` ×26, etc.), que se eliminaron
y se reemplazaron por tokens globales.

Regla aplicada: se tokeniza todo valor que se repite y todo valor de una familia con sentido (error/éxito, WhatsApp,
lienzo y texto base). Un valor de **un solo uso** sin familia queda literal y se anota abajo.

## Resumen

| Categoría | Antes (distintos / usos) | Tokens | Quedan literales |
|---|---|---|---|
| Colores | 96 / 275 (+78 vía variables locales) | 52 `--color-*` | 46 de un solo uso (ver abajo) |
| Familias tipográficas | 9 / 21 | 3 `--font-*` | `Arial, Helvetica, sans-serif` (1) y las `@font-face` |
| Radios | 21 / 70 (+18 vía variables) | 9 `--radius-*` | 2px, 20px, 50px, 1rem (1 c/u) |
| Espaciado (margin/padding/gap) | 43 / 325 | 8 `--space-*` (rem) + 19 `--space-legacy-*` (px) | %, negativos y 12 valores de un uso |
| Sombras | 35 / 38 | 3 `--shadow-*` | geometría de 26 sombras de un uso (sus colores sí usan tokens) |
| Duraciones | 14 / 55 | 7 `--duration-*` | 2s, 20s, 250ms (1 c/u) y `0.01ms` de `prefers-reduced-motion` |
| Curvas | 3 / 49 | 2 `--ease-*` | `linear` (2, giros infinitos) |
| Tamaños, pesos, interlineado | 36 / 124 · 8 / 63 · 8 / 16 | — | todos (ver "Tipografía") |

## Colores

| Valor | Usos | Token |
|---|---|---|
| `blueviolet` (#8a2be2) | 39 + 26 (`--primary-color`) | `--color-accent` |
| `white` · `#fff` | 34 · 1 | `--color-white` |
| `aliceblue` · `rgb(240, 248, 255)` | 20 + 4 (`--background-light`) · 1 | `--color-surface` |
| `#333` | 18 + 7 (`--text-dark`) | `--color-gray-800` |
| `#666` | 11 + 5 (`--text-gray`) | `--color-gray-600` |
| `black` | 10 | `--color-black` |
| `#764ba2` | 7 | `--color-plum` |
| `#a518cf` | 6 | `--color-orchid` |
| `#667eea` | 6 | `--color-periwinkle` |
| `rgba(0, 0, 0, 0.08)` | 5 | `--color-black-a08` |
| `#e74c3c` | 4 + 4 (`--error-color`) | `--color-error` |
| `#ccc` | 4 | `--color-gray-300` |
| `rgba(0, 0, 0, 0.1)` | 4 | `--color-black-a10` |
| `rgba(0, 0, 0, 0.3)` | 3 | `--color-black-a30` |
| `gray` | 3 + 1 (`--text-light-gray`) | `--color-gray-550` |
| `rgba(137, 43, 226, 0.274)` | 3 | `--color-accent-a27` |
| `rgba(137, 43, 226, 0.05)` | 3 | `--color-accent-a05` |
| `rgba(137, 43, 226, 0.795)` | 2 | `--color-accent-a80` |
| `rgba(137, 43, 226, 0.85)` | 1 + 3 (`--primary-hover`) | `--color-accent-a85` |
| `rgba(137, 43, 226, 0.3)` · `0.1` · `0.2` | 2 · 2 · 2 | `--color-accent-a30` · `-a10` · `-a20` |
| `rgba(156, 82, 224, 0.699)` | 2 | `--color-accent-muted` |
| `rgba(0, 0, 0, 0.12)` · `0.15` | 2 · 2 | `--color-black-a12` · `-a15` |
| `#444` | 2 | `--color-gray-700` |
| `#888` · `rgb(136, 136, 136)` | 1 · 1 | `--color-gray-500` |
| `#ddd` | 2 + 7 (`--border-color`) | `--color-gray-200` |
| `#f0f0f0` | 2 | `--color-gray-100` |
| `#f8f9fa` | 2 | `--color-gray-50` |
| `#27ae60` | 2 + 3 (`--success-color`) | `--color-success` |
| `#35f59b` · `#5aeebd` | 2 · 2 | `--color-mint` · `--color-mint-light` |
| `#242424` | 1 (color base de `:root`, lo hereda todo) | `--color-ink` |
| `rgba(255, 255, 255, 0.87)` | 1 (fondo de `:root`) | `--color-canvas` |
| `#c0392b` · `rgba(231, 76, 60, 0.1)` | 1 · 1 | `--color-error-hover` · `--color-error-a10` |
| `rgba(39, 174, 96, 0.1)` | 1 | `--color-success-a10` |
| `#d4edda` · `#155724` · `#c3e6cb` | 1 c/u (alerta de éxito de contacto) | `--color-success-surface` · `-text` · `-border` |
| `#f8d7da` · `#721c24` · `#f5c6cb` | 1 c/u (alerta de error de contacto) | `--color-error-surface` · `-text` · `-border` |
| `rgba(37, 211, 102, 1)` · `rgb(17, 179, 76)` | 1 · 1 (botón flotante) | `--color-whatsapp` · `--color-whatsapp-hover` |

Nota: los tintes del acento están escritos como `rgb(137, 43, 226)`, una unidad por debajo de `blueviolet` (138).
Se conservaron así para no cambiar ni un píxel; al rediseñar conviene derivarlos del acento exacto.

### Colores que quedan literales (un solo uso)

| Valor | Dónde | Qué es |
|---|---|---|
| `rgba(240, 248, 255, 0.836)` | LandingPage.css (nav) | fondo translúcido de la barra |
| `rgba(240, 248, 255, 0.685)` | LandingPage.css (footer p) | texto del footer (**falla contraste**, ver abajo) |
| `rgb(132, 63, 251)`, `rgba(132, 63, 251, 1)`, `rgba(250, 70, 252, 1)` | LandingPage.css (footer) | degradé radial violeta → fucsia |
| `rgb(202, 152, 248)` | LandingPage.css (`.nameLogo h2`) | "artista plástica" lavanda sobre el video |
| `rgba(137, 43, 226, 0.596)`, `rgb(182, 129, 233)`, `rgb(186, 112, 255)` | LandingPage.css | hovers/active de links y tarjetas |
| `rgb(174, 126, 219)`, `rgb(163, 74, 247)`, `rgb(154, 77, 226)` | paintings.css | hovers de puntos y botones de "Elegir" |
| `rgba(137, 43, 226, 0.03 / 0.15 / 0.4)` | agendas.css | tintes de acento sueltos |
| `rgba(138, 43, 226, 0.1 / 0.3 / 0.4)`, `#9b4dca` | customPainting.css | foco y botón "Enviar" (estos sí usan 138) |
| `rgba(7, 94, 84, 0.829)` | LandingPage.css | sombra del botón de WhatsApp |
| `rgba(0, 0, 0, 0.637 / 0.25 / 0.486 / 0.7 / 0.4 / 0.6 / 0.11 / 0.2)` | LandingPage.css, aboutMe.css | separadores, overlays del video y del slider, botón "subir" |
| `rgba(102, 126, 234, 0.4 / 0.15 / 0.2)`, `#f0f4ff` | aboutMe.css | sombras y hover de la línea de tiempo |
| `#1be44d`, `#018f24`, `rgba(119, 255, 107, 0.3)`, `rgba(255, 107, 107, 0.05 / 0.1 / 0.4)` | agendas.css | opción "NUEVO" y banner del cuaderno A4 |
| `rgba(128, 128, 128, 0.3)`, `#e9ecef`, `#dee2e6`, `#999` | customPainting.css | separador, caja de foto, botón deshabilitado |
| `yellow` sobre `rgb(138, 0, 0)` | paintings.css | cartel "40% OFF / VENDIDO" |
| `rgb(255, 255, 83)` sobre `rgba(184, 29, 29, 0.842)` | personalBook.css | precio sobre la tapa del libro |

Fuera de alcance (JS, no se tocó): colores inline en `AgendaForm.jsx` (`#000000` ×3) y `paintingsSlider.jsx`
(`#fff` ×2, `blueviolet`, `#888` en los puntos del slider). Pasarlos a tokens es trabajo de las fases 7 y 9.

## Tipografía

| Valor | Usos | Token |
|---|---|---|
| `"Raleway", sans-serif` | 3 (incluye `* { … }`, que pinta todo el sitio) | `--font-body` |
| `"Dancing Script", cursive` · `'Dancing Script', cursive` | 3 · 2 | `--font-script` |
| `"Dancing Script"` · `'Dancing Script'` · `"Dancing script"` | 3 · 1 · 1 | `--font-script-bare` (sin respaldo genérico, como hoy) |
| `Arial, Helvetica, sans-serif` | 1 (`.btnPriceContainer h3`: la medida de cada obra en `/obras-en-stock`) | literal; ver DL-007 |
| `Inter, system-ui, Avenir, Helvetica, Arial, sans-serif` | 1 (`:root` en `index.css`) | **eliminada**: `* { font-family: Raleway }` la tapaba en todos los elementos |

Fuentes cargadas: solo Raleway (variable 100–900, normal e itálica) y Dancing Script (variable 400–700), autoalojadas
en `src/styles/fonts.css` desde la Fase 2. No queda ninguna referencia a Google Fonts en CSS ni HTML.

**Tamaños, pesos e interlineados no se tokenizaron.** Hay 36 tamaños distintos en 124 usos, mezclando px y rem sin
escala (2rem ×12, 16px ×9, 24px ×9, 0.9rem ×9, 1.5rem ×8, 0.95rem ×7, 1rem ×6, 12/14/15/20/40px ×5, 1.2rem ×5, …).
Ponerles nombre ahora inventaría una escala que no existe; la escala se decide en DL-007 y se aplica cuando cada
componente se rediseñe. Pesos: `bold` ×27, `600` ×18, `700` ×8, `500` ×2. Interlineado: 1.5 (base, ×5), 1.8 ×3, 2 ×2, 1.6 ×2.

## Radios

| Valor | Usos | Token |
|---|---|---|
| `16px` | 10 | `--radius-2xl` |
| `8px` | 9 + 6 (`--border-radius`) | `--radius-md` |
| `12px` | 9 | `--radius-xl` |
| `5px` | 8 (incluye `0 0 5px 5px`) | `--radius-xs` |
| `4px` | 7 | `--radius-2xs` |
| `50%` | 6 | `--radius-round` |
| `6px` | 4 + 12 (`--border-radius-small`) + 3 en compuestos | `--radius-sm` |
| `25px` | 4 | `--radius-pill` |
| `10px` | 1 + 4 en compuestos (`0 0 10px 10px`, etc.) | `--radius-lg` |
| `2px`, `20px`, `50px`, `1rem` | 1 c/u | literales |

## Espaciado

Escala rem (sigue el tamaño de letra que elige la persona):

| Valor | Usos | Token |
|---|---|---|
| `1rem` | 52 | `--space-4` |
| `2rem` | 26 | `--space-8` |
| `0.5rem` | 16 | `--space-2` |
| `1.5rem` | 15 | `--space-6` |
| `0.75rem` | 15 | `--space-3` |
| `3rem` | 7 | `--space-12` |
| `0.25rem` · `1.25rem` | 2 · 2 | `--space-1` · `--space-5` |

Px heredados (`--space-legacy-N` = N px). Se separaron de la escala rem a propósito: `16px` y `1rem` solo coinciden
con el tamaño de letra por defecto, y unificarlos cambiaría el resultado para quien agranda la letra del navegador.

| Valor | Usos | Valor | Usos | Valor | Usos |
|---|---|---|---|---|---|
| 20px | 32 | 24px | 10 | 25px · 50px · 14px · 32px | 3 c/u |
| 12px | 18 | 40px | 9 | 5px · 2px | 2 c/u |
| 10px | 18 | 15px · 8px · 4px | 8 c/u | 3px | 4 |
| 30px | 13 | 60px | 6 | 16px | 5 |
| 6px | 11 | | | | |

Quedan literales: porcentajes (`10%` ×6, `3%`, `4%`, `5%` ×2: dependen del ancho, no son espaciado de sistema),
negativos (`-20px`, `-2px`, `-0.25rem`) y valores de un uso (`4rem`, `5rem`, `7px`, `28px`, `38px`, `70px`, `0.6rem`,
`0.8rem`, `1.2rem`). Anchos de borde (`2px`, `3px`, `4px`) y breakpoints (`768px`, `1024px`; `var()` no funciona en
`@media`) también quedan literales.

## Sombras

| Valor | Usos | Token |
|---|---|---|
| `0 4px 20px rgba(0, 0, 0, 0.08)` | 3 (tarjetas de Sobre mí) | `--shadow-card` |
| `0 2px 8px rgba(0, 0, 0, 0.1)` | 2 | `--shadow-sm` |
| `1px 22px 34px 0px rgba(163, 6, 240, 0.75)` | 3 (misma sombra del menú con prefijos `-webkit-`/`-moz-`) | `--shadow-menu` |

Las otras 32 sombras son de un uso (26 geometrías distintas); su color ya usa tokens (`--color-accent`,
`--color-black-a*`, `--color-accent-a*`). La sombra violeta desplazada de las fotos de la Home
(`21px 22px 0 -4px` y `-23px -21px 0 -4px`) es un rasgo de identidad: se documenta en `DESIGN.md`.

## Movimiento

| Valor | Usos | Token |
|---|---|---|
| `200ms` · `0.2s` | 16 · 2 | `--duration-200` |
| `0.3s` · `300ms` | 15 · 2 | `--duration-300` |
| `100ms` | 3 | `--duration-100` |
| `400ms` | 3 | `--duration-400` |
| `500ms` · `0.5s` | 3 · 2 | `--duration-500` |
| `1s` | 2 (spinner, botón "subir") | `--duration-1000` |
| `3s` | 2 (espera del toast antes de irse) | `--duration-toast` |
| `ease` | 36 | `--ease-default` |
| `ease-in-out` | 11 | `--ease-in-out` |
| `linear`, `2s`, `20s`, `250ms` | 2 · 1 · 1 · 1 | literales |
| `0.01ms !important` | 2 | literal: es el apagado de `prefers-reduced-motion` |

## Contraste (WCAG 2.2, calculado)

`node design/tools/contrast.mjs`. Los colores translúcidos se componen sobre la superficie real. Texto normal 4.5:1,
texto grande (≥ 24 px, o ≥ 18.66 px bold) 3:1, bordes y foco 3:1.

| Texto | Fondo | Dónde | Ratio | Mínimo | Resultado |
|---|---|---|---|---|---|
| `blueviolet` | `white` | Acento sobre blanco (links legales, precios, destacados) | 5.96:1 | 4.5:1 | pasa |
| `blueviolet` | `aliceblue` | Acento sobre aliceblue (menú abierto, precios en formularios) | 5.55:1 | 4.5:1 | pasa |
| `blueviolet` | `rgba(240, 248, 255, 0.836)` | Acento sobre la barra de navegación | 5.62:1 | 4.5:1 | pasa |
| `white` | `blueviolet` | Blanco sobre acento (botones principales) | 5.96:1 | 4.5:1 | pasa |
| `aliceblue` | `blueviolet` | Aliceblue sobre acento (skip link, "Mis obras") | 5.55:1 | 4.5:1 | pasa |
| `blueviolet` | tinte 5 % sobre `aliceblue` | Opción elegida en formularios | 5.15:1 | 4.5:1 | pasa |
| `#242424` | lienzo / `aliceblue` | Texto base | 15.52 / 14.47:1 | 4.5:1 | pasa |
| `#333` | `white` / `aliceblue` | Títulos, labels | 12.63 / 11.78:1 | 4.5:1 | pasa |
| `#444` | `white` | Cita y relatos de Sobre mí | 9.74:1 | 4.5:1 | pasa |
| `#666` | `white` / `aliceblue` / `#f8f9fa` | Subtítulos y ayudas | 5.74 / 5.35 / 5.45:1 | 4.5:1 | pasa |
| `black` | tinte 27 % / `rgb(186, 112, 255)` | Tarjetas de agenda, botón Instagram (y su hover) | 13.45 / 6.85:1 | 4.5:1 | pasa |
| `white` | `#a518cf` / `#764ba2` | Degradés de Sobre mí | 5.78 / 6.37:1 | 4.5:1 | pasa |
| `white` | `#9b4dca` | Fin del degradé de "Enviar" (obra personalizada) | 4.87:1 | 4.5:1 | pasa |
| `white` | `#c0392b` | Hover de "Eliminar" agenda | 5.44:1 | 4.5:1 | pasa |
| `white` | tinte 85 % | Hover de botones de agendas | 4.63:1 | 4.5:1 | pasa |
| `#155724` / `#721c24` | `#d4edda` / `#f8d7da` | Alertas de contacto | 6.99 / 8.25:1 | 4.5:1 | pasa |
| `yellow` | `rgb(138, 0, 0)` | Cartel "40% OFF" | 9.40:1 | 4.5:1 | pasa |
| `rgb(255, 255, 83)` | rojo 84 % (peor caso: sobre blanco) | Precio del libro | 4.74:1 | 4.5:1 | pasa |
| `aliceblue` | `rgb(132, 63, 251)` | Links legales del footer, centro del degradé | 4.79:1 | 4.5:1 | pasa |
| `#667eea` | `white` | Títulos de relatos (24 px bold, texto grande) | 3.66:1 | 3:1 | pasa |
| `white` | `rgb(163, 74, 247)` | Hover de "Elegir" (24 px bold) | 4.30:1 | 3:1 | pasa |
| `blueviolet` | `white` / `aliceblue` | Anillo de foco | 5.96 / 5.55:1 | 3:1 | pasa |
| `gray` | `white` | Placeholder del formulario de agendas | 3.95:1 | 4.5:1 | **no pasa** |
| `#888` | `aliceblue` | Descripción de cada obra (`.paintingInfoContainer p`) | 3.30:1 | 4.5:1 | **no pasa** |
| `#667eea` | `white` | Títulos de "Mi estilo" (20.8 px semibold) | 3.66:1 | 4.5:1 | **no pasa** |
| `white` | `#667eea` | Inicio del degradé del toast | 3.66:1 | 4.5:1 | **no pasa** |
| `#e74c3c` | `white` / `aliceblue` | Asterisco y mensajes de error | 3.82 / 3.56:1 | 4.5:1 | **no pasa** |
| `white` | `#e74c3c` | Botón "Eliminar" agenda | 3.82:1 | 4.5:1 | **no pasa** |
| `#27ae60` | su tinte 10 % | "Obra seleccionada" | 2.60:1 | 4.5:1 | **no pasa** |
| `white` | `#35f59b` / `#5aeebd` | Badges "NUEVO" (11.2 px bold) | 1.43 / 1.46:1 | 4.5:1 | **no pasa** |
| `rgba(240, 248, 255, 0.685)` | `rgb(132, 63, 251)` / `rgb(250, 70, 252)` | Texto del footer (13 px) | 3.03 / 1.88:1 | 4.5:1 | **no pasa** |
| `aliceblue` | `rgb(250, 70, 252)` | Links legales del footer, borde del degradé | 2.66:1 | 4.5:1 | **no pasa** |
| `white` | tinte 80 % | Hover de "Consultar" (desktop) | 4.18:1 | 4.5:1 | **no pasa** |
| `white` | `rgba(156, 82, 224, 0.699)` | Hover de "Enviar" (contacto) y "Cargar mapa" | 2.74:1 | 4.5:1 | **no pasa** |
| `#ddd` / `#ccc` | `white` | Bordes de inputs (no texto) | 1.36 / 1.61:1 | 3:1 | **no pasa** |

No calculables (texto sobre foto o video): logo y "artista plástica" del hero, título de páginas sobre `BG2.jpg`,
links del footer de navegación sobre `BG2.jpg` y su hover violeta 60 %. Hay que revisarlos a ojo o con un muestreo
de píxeles del fondo real.

**El acento no necesita variante de texto**: `blueviolet` da 5.96:1 sobre blanco y 5.55:1 sobre aliceblue, ambos
por encima de 4.5:1. No se definió `--color-accent-text`. Las fallas de arriba no se tocaron (cambian lo que se ve):
están propuestas en DL-010.

## Verificación de que nada cambió

1. **Estática** — `node design/tools/token-check.mjs fase-3-seo <archivos>`: resuelve cada `var()` contra
   `tokens.css`, normaliza colores/comillas/duraciones y compara declaración por declaración (con su selector y su
   `@media`, así que cubre `:hover`, `:focus` y desktop). Resultado: todas equivalentes salvo las 12 variables locales
   borradas de `agendas.css` (ya sin usos) y `"Dancing script"` → `"Dancing Script"` en `.firstSection h3`.
2. **Estilos calculados** — `node design/tools/dom-facts.mjs --styles` antes (en `fase-3-seo`) y después, 13 rutas
   × 390/1280 px (2.202 nodos por ancho), 70 propiedades por nodo más `::before`/`::after`/`::placeholder`. Dos corridas de la línea base
   dieron 0 diferencias entre sí (sin ruido). Después: 30 diferencias, todas explicadas:
   - `html` (26, una por ruta y ancho): `font-family` pasa de la pila Inter a `Raleway, sans-serif` al quitar la
     declaración muerta de `index.css`. `html` no dibuja texto propio; todos los elementos ya usaban Raleway.
   - Los dos `h3` de "Quién soy"/"Mis pasiones" en la Home (4): `"Dancing script"` → `"Dancing Script"`. Los nombres de
     familia se comparan sin distinguir mayúsculas, así que es la misma fuente.
