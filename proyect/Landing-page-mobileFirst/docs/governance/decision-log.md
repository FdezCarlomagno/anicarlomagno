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
- [x] Accent color (keep violet family vs. new neutral+one accent) → DL-006 (blueviolet; púrpuras secundarios propuestos)
- [ ] Type pairing (Dancing Script for logo only? body: Inter vs. system stack) → Raleway + Dancing Script (Fase 2); escala en DL-007
- [ ] Radius and elevation scale → DL-008 (propuesto)
- [ ] Motion language and reduced-motion policy → DL-009 (propuesto)
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

## DL-006 — Acento: `blueviolet` (#8a2be2), sin variante de texto (2026-10-11)
Status: accepted (Fase 4) para el valor; proposed para la limpieza de púrpuras
Context: La Fase 4 tokeniza el CSS sin cambio visual. El acento aparece como `blueviolet` (literal y `--primary-color` de agendas) y en tintes escritos como `rgba(137, 43, 226, …)`, una unidad de rojo por debajo de #8a2be2 = rgb(138, 43, 226). Conviven otros púrpuras: `#a518cf`, `#764ba2`, `#667eea`, `#9b4dca`, `rgba(156, 82, 224, 0.699)`, la sombra del menú `rgba(163, 6, 240, 0.75)` y el degradé del footer.
Decision: El acento exacto es `blueviolet` (#8a2be2) → `--color-accent`. Contraste medido: 5.96:1 sobre blanco y 5.55:1 sobre aliceblue, ambos ≥ 4.5:1, así que **no se crea `--color-accent-text`**. Los tintes se conservan con 137 (`--color-accent-a05…a85`) para no mover ningún valor calculado.
Alternatives: Normalizar los tintes a 138 (diferencia imperceptible, pero no es "diferencia cero"; queda propuesto para cuando se rediseñen). Elegir un violeta nuevo (rechazado: el violeta es parte de la marca).
Consequences: Propuesto, **no aplicado**: (a) tintes a 138; (b) absorber `orchid`, `plum`, `periwinkle`, `#9b4dca` y `accent-muted` en el acento y sus tintes, dejando un solo violeta (cambia los degradés de "Sobre mí", el toast y los hovers); (c) decidir el degradé del footer en la Fase 4b. Ver DL-010 para los pares que hoy no pasan.

## DL-007 — Escala tipográfica base: 16 px mínimo en mobile (2026-10-11)
Status: proposed (no aplicado)
Context: Hay 36 tamaños distintos en 124 usos, mezclando px y rem sin escala (`design/audits/tokens-inventory.md`). La base es 16 px (la del navegador; `body` no fija tamaño) con Raleway e interlineado 1.5. Los inputs de agendas usan 0.95rem = 15.2 px, y iOS hace zoom al enfocar campos de menos de 16 px. Algunos textos corridos bajan a 0.9rem, 14 px o 13 px (footer). La medida de cada obra en `/obras-en-stock` (`.btnPriceContainer h3`) está en Arial, la única fuente fuera de la identidad. Los títulos manuscritos alternan entre `"Dancing Script", cursive` y `"Dancing Script"` sin respaldo genérico.
Decision (propuesta): Escala en rem, base 16 px:
`--text-xs` 0.75rem (12 px, solo metadatos y legales) · `--text-sm` 0.875rem (14 px, captions, ayudas) · `--text-base` 1rem (16 px: cuerpo, inputs y botones, mínimo en mobile) · `--text-lg` 1.125rem (18 px, bajadas) · `--text-xl` 1.25rem (20 px) · `--text-2xl` 1.5rem (24 px, títulos de tarjeta) · `--text-3xl` 2rem (32 px, títulos de página) · `--text-4xl` 2.5rem (40 px, títulos manuscritos) · logo del hero `clamp(3.125rem, 8vw, 5rem)` (50→80 px, como hoy). Interlineado 1.5 en cuerpo y 1.2 en títulos. Pesos: Raleway 400/600/700; Dancing Script 400/700 (`bold` ×27 y `700` ×8 son el mismo peso).
Alternatives: Tokenizar los 36 tamaños actuales (rechazado: le pone nombre a una escala que no existe). Escala modular estricta 1.25 (rechazada: da valores no enteros en px que no ayudan en mobile).
Consequences: Cambia lo que se ve, por eso no se aplica en la Fase 4. Al aplicarla: inputs de agendas a 1rem; medida de la obra en Raleway; toda declaración de Dancing Script pasa a `--font-script` (con `cursive`); `DESIGN.md` reemplaza los niveles descriptivos por los de la escala.

## DL-008 — Radios: de 9 valores a 4 (2026-10-11)
Status: proposed (no aplicado)
Context: Hoy hay 9 radios tokenizados (4, 5, 6, 8, 10, 12, 16, 25 px y 50%) y 4 literales de un uso (2 px, 20 px, 50 px, 1rem). Los chicos (4/5/6/8 px) se usan para lo mismo (inputs, botones, alertas) en archivos distintos. Los principios piden un radio consistente (`design-principles.md` #5).
Decision (propuesta): `--radius-sm` 6px (inputs, chips, alertas) · `--radius-md` 12px (tarjetas, formularios) · `--radius-lg` 16px (tarjetas grandes, modales) · `--radius-pill` 9999px (botones redondeados; hoy 25px y 50px) · `--radius-round` 50% (círculos). La obra no lleva radio, o como máximo 4 px, para no recortar esquinas del cuadro.
Alternatives: Mantener los 9 (rechazado: es deuda, no una escala). Radio cero en todo, estilo galería (queda para evaluar en los prototipos de la Fase 4b).
Consequences: Cambia esquinas en casi todos los componentes; se aplica componente por componente en las fases 6 a 10. Hasta entonces los 9 tokens actuales reproducen el sitio.

## DL-009 — Movimiento: curva y duraciones (2026-10-11)
Status: proposed (no aplicado)
Context: Hoy se usan `ease` (×36) y `ease-in-out` (×11) con 100, 200, 300, 400 y 500 ms (200 y 300 ms son las más comunes), 1 s en el spinner y el botón "subir", y 3 s de espera del toast. Framer Motion anima desde JSX con 0.8 s en el hero. `prefers-reduced-motion` ya está respetado en `LandingPage.css`. El principio #7 pide 150–300 ms, ease-out, solo transform/opacity.
Decision (propuesta): `--ease-out: cubic-bezier(0.2, 0, 0, 1)` como curva única de entrada y respuesta; `--ease-in-out` solo para movimientos que van y vuelven. Duraciones dentro del rango del principio #7: `--duration-fast` 150ms (hover, color, foco) · `--duration-base` 200ms (aparición de elementos chicos, filtros) · `--duration-slow` 300ms (máximo: menú, galería, visor). Las animaciones de Framer Motion usan los mismos valores (hoy 0.8 s en el hero). `--duration-toast` (3 s de lectura) y el spinner (1 s) no son transiciones y se mantienen. Animar solo `transform` y `opacity` (hoy hay `transition: all`).
Alternatives: Mantener `ease` (rechazado: arranca lento; se siente menos inmediato al tocar). Duraciones por componente sin escala (rechazado: es lo que hay hoy).
Consequences: Cambia la sensación de todas las transiciones; se aplica en la Fase 10c (pulido de interacción). Los tokens actuales `--duration-100…500` reproducen el sitio hasta entonces.

## DL-010 — Contraste: pares que hoy no pasan AA (2026-10-11)
Status: proposed (no aplicado)
Context: Cálculo numérico WCAG 2.2 de cada par texto/fondo (`node design/tools/contrast.mjs`, tabla completa en `design/audits/tokens-inventory.md`). El acento pasa (DL-006). Fallan 13 pares; no se corrigieron porque cambian lo que se ve.
Decision (propuesta, ratio con el cambio entre paréntesis):
- Placeholder de agendas `gray` 3.95 → `#767676` (4.54).
- Descripción de obra `#888` sobre aliceblue 3.30 → `--color-gray-600` (5.35).
- Títulos de "Mi estilo" `#667eea` 3.66 → `--color-plum` (6.37) o el acento (5.96); el toast arranca en el acento en vez de `#667eea` (5.96).
- Error como texto `#e74c3c` 3.82 / 3.56 → `--color-error-hover` #c0392b (5.44 sobre blanco, 5.07 sobre aliceblue); botón "Eliminar" con fondo #c0392b (5.44).
- "Obra seleccionada" `#27ae60` sobre su tinte 2.60 → texto `--color-success-text` (7.86).
- Badges "NUEVO": blanco sobre menta 1.43 → texto `--color-ink` (10.86).
- Hover de "Consultar" (tinte 80 %, 4.18) y de "Enviar"/"Cargar mapa" (`accent-muted`, 2.74) → `--color-accent-a85` (4.63) o el acento sólido (5.96).
- Bordes de inputs `#ddd`/`#ccc` 1.36/1.61 → `#767676` (4.54) o `gray` (3.95); mínimo 3:1.
- Footer: texto `rgba(240, 248, 255, 0.685)` llega a 1.88 sobre el extremo rosa; incluso blanco sólido da 2.86 ahí. Requiere cambiar el degradé (o poner el texto sobre una banda más oscura): se decide en la Fase 4b.
Alternatives: Corregirlos ahora (rechazado por la regla de la Fase 4: diferencia visual cero).
Consequences: Texto sobre fotos o video (logo del hero, títulos sobre `BG2.jpg`, links del footer de navegación) no se puede calcular; se revisa a ojo o con muestreo de píxeles. Al aplicar, agregar los pares corregidos a `components` de `DESIGN.md` para que el lint los vigile.

## DL-011 — Tokens: nombres y alcance de la Fase 4 (2026-10-11)
Status: accepted (Fase 4)
Context: Había que crear `src/styles/tokens.css` en correspondencia 1:1 con el CSS actual, sin inventar un sistema que todavía no está decidido.
Decision: Prefijos `--color-*`, `--font-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--duration-*`, `--ease-*`; en `DESIGN.md` se escriben sin prefijo (`colors.accent` ↔ `--color-accent`). Espaciado en dos familias: escala rem `--space-1…12` (múltiplos de 0.25rem) para trabajo nuevo y `--space-legacy-N` (N px) solo para que el CSS heredado use tokens sin moverse; px y rem no se unifican porque solo coinciden con el tamaño de letra por defecto. Tamaños, pesos e interlineados no se tokenizan hasta DL-007. Los valores de un solo uso quedan literales y anotados en el inventario. Se borraron las variables locales de `agendas.css` (reemplazadas por los tokens) y la pila Inter de `index.css` (estaba tapada por `* { font-family: Raleway }`).
Alternatives: Unificar px y rem (rechazado: cambia el resultado con letra agrandada). Tokenizar todo literal (rechazado: nombres sin significado).
Consequences: Diferencia de estilos calculados antes/después: 30, todas explicadas (`html` sin pila Inter y `"Dancing script"` → `"Dancing Script"`). Los tokens `legacy-*` desaparecen a medida que se rediseña cada componente.

## DL-012 — La evolución de naif a neoexpresionismo es parte de la identidad (2026-10-11)
Status: accepted (contexto de la Fase 4b en adelante)
Context: Ani pasó de un estilo naif a uno neoexpresionista. El sitio hoy no lo cuenta y el plan hablaba solo de "obra naif" al buscar referencias.
Decision: El recorrido se documenta en `docs/artist-story.md` y se muestra en el sitio como relato breve, con obra de ambas etapas intacta: "Mi recorrido" en Sobre mí (Fase 10), una versión corta en la Home (Fase 7), las etapas como marco de la Trayectoria (Fase 10b) y una etiqueta opcional de época en el catálogo (Fase 8). La dirección de arte (Fase 4b) habla con el estilo actual sin renegar del anterior. Ninguna fecha, motivo ni nombre de etapa se publica sin que Ani lo confirme con sus palabras.
Alternatives: Presentar solo el estilo actual (rechazado: se pierde la trayectoria, que es un diferencial). Contarlo en un texto largo sin obras (rechazado: la obra hace el trabajo).
Consequences: Se pide a Ani obras clave de cada etapa, el motivo del cambio y cómo nombra ella cada época. La decisión de dirección de arte pasa a ser DL-013. Etiquetar obras por época requiere que Ani las clasifique.

## DL-013 — Dirección de arte: C, Inmersiva (2026-10-11)
Status: accepted (dirección); detalles marcados "a confirmar" quedan para la Fase 4c
Context: La Fase 4b prototipó tres direcciones (`design/art-direction/`: A galería silenciosa, B editorial, C inmersiva). El agente recomendó A por estructura y mantenimiento; Valentín eligió C tras ver los prototipos. Falta el visto bueno de Ani.
Decision: El sitio sigue la dirección **C, Inmersiva** (`c-inmersiva.html`): la obra ocupa la primera pantalla entera y el relato avanza escena por escena.
- **Fondo oscuro solo detrás de la obra** (`--color-ink`): hero, serie, paspartú de la tarjeta, menú y pie. El texto de lectura vive en lienzos claros (blanco y aliceblue).
- **Acento violeta solo en zonas claras** (botones, enlaces). En oscuro: blanco y `gray-300`, y foco blanco, porque el acento sobre tinta da 2.61:1.
- **Tipografía:** firma Dancing Script en el hero (44 px en mobile, 64 px en desktop) y en el pie; Raleway para todo lo demás. Escala 16 / 18 / 20 / 24 / 28 / 32 px, de acuerdo con DL-007 salvo la cita de 28 px.
- **Imágenes:** la obra siempre entera, sin radio, sin texto encima. En el hero se limita a `100svh − 16rem` de alto para que entre con la firma; en la serie, `80svh`. Tarjeta de obra sobre paspartú oscuro.
- **Movimiento:** fundido de 300 ms de la obra del hero; las obras de la serie entran con opacidad (30 % → 100 %) y desplazamiento de 2 rem atados al scroll (`animation-timeline: view()`), solo con `prefers-reduced-motion: no-preference` y donde el navegador lo soporta. El contenido nunca queda oculto. **A confirmar en la 4c:** si esa animación atada al scroll se acepta como excepción al rango de 150–300 ms de DL-009 o se reemplaza.
- **Estructura de la Home:** hero con obra y firma → frase → serie → tarjeta de obra disponible → "Mi recorrido" (naif y neoexpresionismo, ver DL-012) → pedido por WhatsApp → pie.
- **Pie oscuro** con texto blanco y `gray-300` (15.52 y 9.67): reemplaza el degradé del footer y resuelve ese punto de DL-010.
- **Botón de WhatsApp:** glifo tinta sobre el verde (7.83:1) en lugar de blanco (1.98:1), como en los prototipos (DL-010).
Alternatives: A, galería silenciosa (recomendada por el agente: más obra en el celular, más simple de mantener, sin rol nuevo de color; queda como plan B si C no funciona en el celular). B, editorial (rechazada: achica la obra en el celular y gasta la firma en seis lugares).
Consequences: La tinta pasa a ser un rol de fondo de pleno derecho en `DESIGN.md`, con estados propios (foco blanco, enlaces blancos, botón claro sobre oscuro) en cada componente que caiga en zona oscura: más trabajo en las fases 6 a 10. La página queda más larga (6839 px contra 5956 px de A en 390). Riesgos a mirar en el celular: que la obra más clara (etapa naif) se vea menos favorecida sobre oscuro, y el peso de las imágenes a pantalla completa (Fase 5). Los hallazgos de contraste del pie y del botón de WhatsApp quedan resueltos por esta dirección. Siguen pendientes DL-007 a DL-010 (se aplican junto con las fases de implementación). La Fase 4c prueba dos variantes (`c1-oscura` y `c2-clara`) para ajustar cuánta oscuridad lleva.

## DL-014 — Pipeline de imágenes: AVIF + JPEG con `sharp`, salida generada y no versionada (2026-10-11)
Status: accepted (Fase 5, lote Home)
Context: La Home transfería 13,5 MB en 390 px; 5,8 MB eran 36 imágenes sin redimensionar (las obras llegan a 2000–3900 px de ancho).
Decision: `scripts/optimize-images.mjs` (`npm run images`, también en `predev` y `prebuild`) genera desde los originales AVIF a 480/800/1200 px y un JPEG de respaldo a 800 px en `public/img/` (ignorado por git). Los originales no se tocan. El manifiesto `src/content/image-manifest.json` sí se versiona. El componente `ArtworkImage` arma `<picture>` con `srcset`/`sizes`, `width`/`height`, `loading="lazy"` y `decoding="async"`; si una imagen no está en el manifiesto, muestra el original como `<img>` común. Se convierte por lotes (hoy: catálogo de la Home y agendas de la Home). Se descartó WebP: sumaba 60 MB a la salida sin aportar en navegadores actuales.
Alternatives: `vite-imagetools` (otra dependencia y build más lento), versionar `public/img/` (31 MB de binarios en el repo).
Consequences: `sharp` es devDependency; el build corre el script (la primera vez tarda, después solo procesa lo nuevo). Cada lote nuevo se agrega a `LOTES`. Navegadores sin AVIF reciben el JPEG de 800 px. Falta la comparación lado a lado con Ani.

Nota (Fase 5): el video del hero (7,9 MB) queda para la Fase 7. Valentín propone sacarlo y reemplazarlo por una obra (coincide con DL-013). Hasta entonces la Home no cumple el presupuesto de 1,5 MB.

## DL-015 — Shell: menú, flotantes y pie (2026-10-11)
Status: accepted (Fase 6)
Context: La barra de navegación animaba la altura del menú, tenía objetivos de 20 px, no marcaba la ruta activa ni cerraba con Esc; los flotantes (WhatsApp, volver arriba) y el pie (con foto de fondo de 169 KB, un bloque de redes, otro de navegación, otro de envíos y otro de legales) eran cuatro piezas sueltas.
Decision: `src/components/shell.css` reemplaza el CSS heredado de nav, flotantes y pie. Menú móvil como panel con botón "Menú"/"Cerrar" (texto, no ☰), `aria-expanded`, foco al primer enlace, Esc devuelve el foco al botón, clic afuera cierra, y lo que queda detrás (`data-inert-con-menu`: contenido, pie, flotantes, skip-link) pasa a `inert`. Desde 768 px los enlaces van en fila. Ruta activa con `NavLink` (`aria-current`, color y subrayado). Sin íconos en los enlaces ni animación de entrada del logo. WhatsApp: 48 px, glifo `--color-ink` sobre el verde (7.83:1, DL-010/DL-013) a la izquierda; volver arriba: 48 px, tinta, a la derecha, solo tras media pantalla de scroll; el pie deja espacio para que ninguno tape texto. Pie único sobre `--color-ink` (DL-013): firma, envíos, Navegá, Seguime, legales, contacto y copyright. Tokens nuevos en `spacing`: `target` 2.75rem, `nav` 3.5rem, `float` 3rem. Se eliminaron `FooterNavbar`, `Envio` y `SocialMedia`.
Alternatives: `<dialog>` con `showModal()` (descartado por ahora: en escritorio los mismos enlaces van en línea); mantener el pie con foto (descartado: texto sobre imagen, 169 KB).
Consequences: La barra pasa de 50 a 56 px. El pie reemplaza el degradé que fallaba contraste (DL-010). La variante C1/C2 no cambia el pie. Pendiente: revisión visual de Valentín en el celular y de Ani.

