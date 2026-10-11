# Auditoría UX de línea base — Fase 0 (2026-10-11)

Auditoría `landing-ux-audit` (6 lentes) combinada con las reglas de `web-design-guidelines`, sobre `develop` (código de `11a9655`;
`3b74af2` y `bf0bcd3` no tocan `src/`). Solo lectura: no se modificó código de la app.

> **Línea base visual incompleta.** Solo hay 3 capturas en `design/baseline/`: `home-390.png` (página completa),
> `menu-abierto-390.png` (viewport) y `elegir-390.png` (página completa). Faltan 8 rutas a 390 px y las 10 a 1280 px. Los hallazgos
> visuales de las demás rutas salen de hechos del DOM (tamaños, posiciones, estilos calculados), no de capturas. Queda pendiente
> decidir si se completa antes de la Fase 4 (que exige "diff de capturas ≈ 0").

**Evidencia.** Cada hallazgo cita una fuente:
- `código` = archivo:línea leído en el repo.
- `DOM` = `raw/dom-facts.json` (Chrome 154, 390 y 1280 px, dev server; 20/20 mediciones OK, ninguna ruta falló).
- `LH` = Lighthouse 13.5 móvil (`raw/lighthouse/`).
- `flujo` = `raw/critical-flows*.json`.
- `red` = `raw/third-parties.json`, `raw/weight-home.json`.
- `captura` = las 3 PNG.
- **[inferido]** marca lo que no se observó directamente.

**Severidad.** P0 = rompe la compra/consulta, cobra mal, o deja afuera a usuarios (bloqueo de accesibilidad o rendimiento grave en
celular). P1 = problema importante de accesibilidad, conversión, SEO o rendimiento. P2 = pulido o consistencia.

## Problemas ya conocidos: estado

| Problema conocido | Estado | Evidencia |
|---|---|---|
| Zoom deshabilitado | **Confirmado** | `index.html:5` `user-scalable=no`; DOM en las 10 rutas; LH `meta-viewport` falla en las 10 |
| Varios `h1` por página | **Confirmado** | DOM: Home 2, `/obras-en-stock` **24**, `/obra-personalizada` 3, `/agendas` 3, `/agenda-personalizada` 3, `/sobre-mi` 3, `/elegir`/`/mi-libro`/`/laminas` 2; `/contacto` 1 (el del logo, sin `h1` propio) |
| Mojibake en `index.html` | **No reproducido** | Los bytes del archivo son UTF-8 correcto (`í` = `C3 AD`) y el `<title>` renderizado en Chrome es "Analía Carlomagno \| Artista Plástica Argentina" (í = U+00ED). El "AnalÃ­a" aparece solo al leer el archivo con PowerShell 5.1 (artefacto de consola). **No se verificó producción.** |
| Imágenes OG inexistentes | **Confirmado (local)** | `index.html:29,36,55` apuntan a `/images/og-image.jpg` y `/images/twitter-image.jpg`; `public/` solo tiene `favicon.svg`, `faviconOjo.jpeg`, `vite.svg`. En `vite preview` esas URLs devuelven **200 con el HTML** de la app (fallback de SPA), no una imagen |
| `div` clickeables (icono de WhatsApp) | **Confirmado y más amplio** | `WhatsappIcon.jsx:13`, `DropDownImgs.jsx:18`, flechas y puntos de `paintingsSlider.jsx`, `AboutMe.jsx:195,231`; DOM: 13 en `/agendas`, 13 en `/agenda-personalizada`, 9 en `/mi-libro`, 2 en `/sobre-mi` |

Métrica del plan "fallas de accesibilidad críticas": **2** (zoom deshabilitado y elección de obra imposible con teclado; ver P0).

## Top 10 propuesto (para acordar antes de la Fase 1)

| # | Sev. | Problema | Fase sugerida |
|---|---|---|---|
| 1 | P0 | **[RESUELTO 2026-10-11, DL-003]** Se cobra $3000 por la frase y la regla de negocio es que la frase es gratis** (decisión del 2026-10-11): `AgendaPrices.js:8`, `AgendaForm.jsx:127-129`. El total mostrado y enviado por WhatsApp queda inflado | 9, o antes si se aprueba (cambia precio y mensaje) |
| 2 | P0 | Elegir la obra (agenda y lámina) es imposible con teclado o lector de pantalla (`DropDownImgs.jsx:18`) | 1 |
| 3 | P0 | Home pesa 14,1 MB al entrar en celular: video de 7,7 MB + imágenes sin lazy | 5 (y póster del video antes, si se aprueba) |
| 4 | P0 | Zoom deshabilitado en todo el sitio (`index.html:5`), junto con inputs de 14 px | 1 |
| 5 | P1 | Botón flotante de WhatsApp y "volver arriba" sin nombre; el de WhatsApp no se alcanza con teclado y tapa texto | 1 (semántica) / 6 (posición) |
| 6 | P1 | "¡Pedido enviado!" + reset aunque WhatsApp no se abra; el contacto borra el mensaje si EmailJS falla | 9 |
| 7 | P1 | Sin `prefers-reduced-motion`; video en loop sin pausa; imagen LCP animada desde opacidad 0 | 1 / 5 / 7 |
| 8 | P1 | Encabezados: `h1` del logo en todas las rutas, 24 `h1` en obras, `/contacto` sin `h1` propio | 1 |
| 9 | P1 | Nombres accesibles: redes, ☰, ▼, flechas del slider, 8 fotos sin `alt` en `/agendas`, listas inválidas | 1 |
| 10 | P1 | SEO: mismo title/description y canonical a la Home en todas las rutas, OG inexistentes, robots/sitemap/404 devuelven la app | 3 |

Quedan fuera del top 10, pero listos para el backlog: Google Maps al cargar `/contacto` (Fase 2/10), contrastes de error/éxito y de
`/obras-en-stock`/`/sobre-mi` (Fase 1/4), precio de lámina fuera de config (Fase 8).

---

## 1. Transversal (shell: aparece en todas las rutas)

| Severidad | Dónde | Problema | Fix |
|---|---|---|---|
| P0 | `index.html:5` | Zoom deshabilitado (`user-scalable=no`) en las 10 rutas (DOM, LH). Falla WCAG 1.4.4 y además la regla del proyecto | Quitar `user-scalable=no` (Fase 1) |
| P0 | Todas; Home en particular | **Peso**: Home transfiere **13,49 MiB (14,1 MB)** al cargar en móvil, sin scroll (red): video 7,69 MiB + 36 imágenes 5,57 MiB. Ninguna imagen tiene `loading="lazy"` ni `width`/`height` (DOM, 10 rutas). `/obras-en-stock` 11,7 MB (LH). Presupuesto del plan: < 1,5 MB | Fase 5: imágenes responsivas WebP/AVIF, lazy debajo del pliegue, `width`/`height`, póster y estrategia para el video |
| P1 | `WhatsappIcon.jsx:13-15`, `LandingPage.css:273-285` | Botón flotante de WhatsApp = `<div onClick>` sin rol ni nombre, imagen sin `alt`, `tabIndex` −1: **no se alcanza con teclado** (flujo: 60 Tabs) y un lector de pantalla no lo anuncia. Tapa texto a 390 px: en `menu-abierto-390.png` (captura de viewport) cubre "visibilidad … que me han marcado" en Home. En las capturas de página completa la posición de un elemento `fixed` puede ser un artefacto | `<a href="https://api.whatsapp.com/send?...">` o `<button>` con `aria-label="Escribime por WhatsApp"`; reservar espacio inferior (Fase 1 semántica, Fase 6 posición) |
| P1 | `ScrollToTopButton.jsx:40-44` | Botón "volver arriba" solo con un SVG: sin `aria-label` ni texto (código). Lighthouse no lo detecta porque aparece recién al hacer scroll | `aria-label="Volver arriba"`, SVG con `aria-hidden` |
| P1 | `NavBar.jsx:45` | Botón del menú "☰": sin `aria-label`, `aria-expanded` ni `aria-controls` (DOM); mide **22×32 px**, por debajo incluso del mínimo AA de 24 px | `aria-label="Abrir menú"`, `aria-expanded`, `aria-controls`; área ≥ 44×44 |
| P2 | `NavBar.jsx:18-24,45-66` | Menú móvil: no se cierra con Escape ni tocando afuera, no mueve ni devuelve el foco y "☰" no cambia de estado (código; no hay trampa de foco porque el menú cerrado usa `display:none`, `LandingPage.css:84-86`) | Escape, clic afuera, foco de vuelta al botón, ícono de cerrar (Fase 6) |
| P1 | `NavBar.jsx:32-36` | El logo "anicarlomagno" es un `h1` en todas las rutas → todas tienen ≥ 2 `h1` y el título real de la página no es el primero (DOM) | Logo como texto/enlace no encabezado; un `h1` por página con su título |
| P1 | `NavBar.jsx:52-64`, `SocialMedia.jsx:13-16`, `FooterNavbar.jsx:17-24` | Listas inválidas: `<ul><a><li>` en el menú y en redes; `<nav><a><li>` sin lista en el footer (LH `list`/`listitem` fallan en las 10 rutas) | `<ul><li><Link>…</Link></li></ul>` |
| P1 | `SocialMedia.jsx:14-16` | Los 3 enlaces a redes no tienen nombre accesible (imagen con `alt=""` y sin texto) (LH `link-name`, 10 rutas). `target='blank'` en vez de `_blank` | `aria-label="Instagram"` etc., `target="_blank" rel="noopener"` |
| P1 | `src/` (grep) | Sin soporte de `prefers-reduced-motion`: 0 apariciones de `MotionConfig`, `useReducedMotion` o la media query. Con reducción emulada el título de `/elegir` igual anima (flujo) | `<MotionConfig reducedMotion="user">` en la raíz + media query en CSS (Fase 1) |
| P1 | `index.html:15`, LH | Google Fonts bloquea el render: ahorro estimado 0,7–1,7 s según la ruta (LH render-blocking). Además pide **Cedarville Cursive**, que no se usa en `src/` (grep), y Raleway 100–900 con itálicas | Autoalojar las 2 familias con los pesos usados, o al menos recortar la URL (Fase 5) |
| P1 | `index.html:18-19,43`, `vercel.json` | Mismo `title`, `description` y **`canonical` hacia la Home** en las 10 rutas (DOM): le dice a Google que todas las páginas son la Home | `title`/`description`/`canonical` por ruta (Fase 3) |
| P1 | `index.html:29,36,55` | Imágenes OG/Twitter inexistentes (ver tabla de conocidos): al compartir en WhatsApp/Instagram no hay vista previa con imagen [inferido de que la URL devuelve HTML] | Crear `public/images/og-image.jpg` 1200×630 (Fase 3) |
| P1 | `LandingPage.jsx:42`, `public/` | Cualquier URL inexistente muestra la Home con 200 (soft 404); `/robots.txt` y `/sitemap.xml` devuelven el HTML de la app (LH `robots-txt` falla en las 10) | Página 404 real (**cambia rutas → requiere aprobación**, CLAUDE.md); `robots.txt` y `sitemap.xml` en `public/` (Fase 3) |
| P1 | Enlaces y botones de toda la app | Objetivos táctiles chicos (DOM, 390 px): links del menú móvil 270×**24**, footer ~**23** px de alto, "Ver en instagram" 135×24, "Mis obras"/"Saber más" 32 px de alto; a 1280 los links del nav miden **20** px de alto | Mínimo 44×44 en móvil (padding), 24×24 en desktop (Fase 6) |
| P2 | `index.html:19-20,28,35,53` | La descripción y el JSON-LD hablan de "esculturas y exposiciones internacionales", que no aparecen en el sitio | Ajustar el texto con Ani (Fase 3) |
| P2 | `index.html:56-60` vs `SocialMedia.jsx:14` | JSON-LD `sameAs` apunta a `instagram.com/anicarlomagno` y `twitter.com/anicarlomagno`; el sitio enlaza `anicarlomagno_painting` | Confirmar las redes oficiales (pregunta abierta de la Fase 3) |
| P2 | `index.html:2,6,30,67` | `lang="es"` (no `es-AR`), `og:locale es_ES`, `translate="no"` + `notranslate` en todo el documento, `role="main"` en `#root` además de los `<main>` internos (DOM: 2 landmarks `main`; `/mi-libro` 3) | `es-AR`, quitar `role="main"` del root, un solo `<main>` por ruta; evaluar si bloquear la traducción es intencional |
| P2 | `ScrollToTopButton.jsx:41`, `Slider.jsx:25` | Propiedades DOM inválidas en JSX (`class`, `stroke-width`…) → warnings en consola en todas las rutas (DOM, consola del dev server) | `className`, `strokeWidth`, etc. (Fase 1) |
| P2 | `NavBar.jsx:58-64`, `FooterNavbar.jsx` | `alt` decorativos con texto ("Home svg", "Diamond svg"; Contacto también usa "Diamond svg") → el lector repite "Home svg Inicio" | `alt=""` en iconos que acompañan texto |
| P2 | `FooterNavbar.jsx:18-23` | El footer no tiene "Contacto" y dice "SOBRE MI" sin tilde | Agregar Contacto; "Sobre mí" |
| P2 | `LandingPage.css` (285, 531, 792, 895, 930) y otras hojas | `transition: all` en muchos selectores (también `paintings.css`, `agendas.css`, `aboutMe.css`, `ContactForm.css`, `customPainting.css`) | Transicionar solo `transform`/`opacity`/colores (Fase 4/10c) |
| P2 | `index.css:2` vs `LandingPage.css:35-37` | Se declara Inter y después `* { font-family: Raleway }` la pisa | Una sola declaración desde tokens (Fase 4) |
| P2 | Toda la app | Más de un acento: blueviolet (#8A2BE2), #667eea en `/sobre-mi` (LH), #CA98F8 en el hero | Un acento desde `DESIGN.md` (Fase 4) |

---

## 2. Por ruta

### `/` Home — LH 83/73/100/85, LCP 3,3 s, 12.844 KiB
| Severidad | Dónde | Problema | Fix |
|---|---|---|---|
| P0 | `Slider.jsx:10,26-39` | Video de **7,7 MB** con `autoPlay loop muted`, `preload="none"` pero igual se descarga entero al cargar (red), sin `poster` (DOM) | Póster liviano + video comprimido o diferido, o reemplazar por obra destacada (Fase 5/7) |
| P1 | `Slider.jsx:26-39` | Video en loop sin control de pausa (WCAG 2.2.2) y sin desactivar con movimiento reducido | Botón de pausa; no autoplay con `prefers-reduced-motion` |
| P1 | `FirstSection.jsx:23-28`, `Slider.jsx:44-47` | El elemento LCP según Lighthouse (`img.imgAniSection1`) entra con `opacity: 0, scale: 0.8` y 1 s de animación, y el `h1` del hero también arranca invisible (código) → retrasa el LCP [inferido] | Sin animación de entrada en la imagen LCP (Fase 5/7) |
| P1 | `Home.jsx:28` | `<button><a target='blank'>` "Ver en instagram": interactivo anidado, imagen sin `alt`, objetivo 135×24 (LH `target-size`) | Un solo `<a>` con estilo de botón |
| P1 | `FirstSection.jsx:56-63,101-109`, `Slider` | `Link > button` en "Mis obras" y "Saber más": 2 paradas de Tab por CTA (flujo: Tab recorre `a` y `button` con el mismo texto) | Un solo elemento (`Link` con estilo) |
| P2 | `Home.jsx:17` | `<main>` dentro del `role="main"` del root | Ver transversal |
| P2 | `FirstSection.jsx:29,77` | `alt` genéricos en inglés ("Artistic representation", "Artistic passion") | `alt` en español que describa la foto |
| P2 | `AgendaSection.jsx:35-37` | 3 agendas distintas con el mismo nombre "Diseño 1" (son links: el lector anuncia 3 "Diseño 1") | Nombres distintos |
| P2 | `paintingImgsSection.jsx:19-25` | Un único `Link` envuelve las 12 imágenes de obras | Un link por obra o un CTA "Ver obras" |

### `/elegir` — LH 89/74/100/85
| Severidad | Dónde | Problema | Fix |
|---|---|---|---|
| P1 | `Choose.jsx:24-35` | `Link > button` en las dos opciones (DOM: 2 anidados; cada opción tiene un objetivo de 19 px y otro de 36 px de alto) | Un `Link` con estilo de tarjeta ≥ 44 px |
| P1 | captura `elegir-390.png` (página completa) | El botón flotante aparece sobre texto; al ser captura de página completa puede ser un artefacto [inferido] (medido en viewport en Home, ver transversal) | Ver transversal |
| P2 | `Choose.jsx:16` | "Elegí que te gustaría" → falta tilde: "Elegí **qué** te gustaría" | Corregir copy (Fase 1/8) |
| P2 | `footerPaintingText.jsx:7` | `<p>` dentro de `<p>` (warning `validateDOMNesting` en consola, también en `/obra-personalizada`) | `<div>` o un solo `<p>` |
| P2 | LH `heading-order` | Salta de `h1` a `h3` | Orden de encabezados |

### `/obras-en-stock` — LH 80/70/100/85, 11.683 KiB, ahorro estimado de imágenes 9.841 KiB
| Severidad | Dónde | Problema | Fix |
|---|---|---|---|
| P1 | `Cuadro.jsx:26`, `Paintings.jsx:57` | **24 `h1`**: cada tarjeta usa `h1` para el nombre de la obra (DOM; LH `heading-order`) | `h2`/`h3` en tarjetas |
| P1 | todo el listado | 22 obras cargadas completas al entrar (sin lazy); primera obra = LCP 4,3 s (LH) | Fase 5 |
| P1 | LH `color-contrast` | Texto #888 sobre aliceblue = **3,3:1** (descripción de las tarjetas) | ≥ 4,5:1 |
| P1 | `Paintings.jsx:64-76` | Filtros sin `aria-pressed` (flujo) | `aria-pressed` o radiogroup |
| P2 | `Cuadro.jsx:31-36` | 22 botones con el mismo nombre accesible "Consultar", sin decir de qué obra (código, flujo) | `aria-label="Consultar por {obra}"` **sin tocar el mensaje** |
| P2 | `Cuadro.jsx:16-18,33` | Las 16 obras vendidas siguen mostrando "Consultar" (flujo) | Confirmar con Ani (Fase 8) |
| P2 | `Cuadro.jsx:30`, `objects/paintings.jsx` | Medida sin unidad ("50x70"); "Pricesa Azul" (`paintings.jsx:61`, falta la "n") | "50 × 70 cm"; corregir nombre |
| P2 | `Cuadro.jsx:7` | El mensaje de WhatsApp dice "me gustaria" sin tilde | Copy a validar; **no cambiar sin aprobación** |
| P2 | botón "Consultar" | 83×34 px (DOM) | ≥ 44 px de alto |

### `/obra-personalizada` — LH 81/76/100/85
| Severidad | Dónde | Problema | Fix |
|---|---|---|---|
| P1 | `src/components/customPainting.jsx` (errores en línea) | Errores ("Mínimo 10cm") sin `aria-invalid`/`aria-describedby` ni anuncio (flujo); texto de error #e74c3c a 12 px = **3,82:1** (`customPainting.css:103-105`) | Vincular errores con ARIA; color de error ≥ 4,5:1 |
| P1 | `src/components/customPainting.jsx:148,163` | 3 `h1` (logo + 2 en la página) | Un `h1` |
| P1 | inputs `name`, `surname`, `size1`, `size2`, `description` (`customPainting.css:82`) | `font-size` **14 px** (DOM) → iOS hace zoom al enfocar [inferido]. Se vuelve visible al quitar `user-scalable=no` (P0) | ≥ 16 px **en la misma PR que el fix de zoom** (Fase 1) |
| P2 | `src/components/customPainting.jsx:134` | Con la casilla de foto destildada el mensaje sale con doble punto: "…tonos cálidos. . Muchas gracias!" (flujo, segundo envío) | Plantilla de WhatsApp: **no cambiar sin aprobación** |
| P2 | `customPainting.css:87-92` | Foco de inputs: `outline: none` reemplazado por borde + sombra al 10 % de opacidad (contraste del indicador no medido) | Anillo de foco visible ≥ 3:1 |
| P2 | `customPainting.jsx:59` | Declaración léxica dentro de `case` (lint `no-case-declarations`) | Bloque `{}` |
| P2 | flujo | Después de "Pedir presupuesto" no hay confirmación visible | Mensaje "Te abrimos WhatsApp…" (Fase 9) |

### `/agendas` — LH 68/77/100/85, LCP **7,9 s**
| Severidad | Dónde | Problema | Fix |
|---|---|---|---|
| P1 | `Agendas.jsx:93-100` | 8 fotos de agendas sin `alt` (DOM, LH `image-alt`) | `alt` descriptivo |
| P1 | `paintingsSlider.jsx:80-81,93-101` | Flechas y puntos del slider son `<div onClick>` (DOM: 13 clickeables no semánticos) → sin teclado; `alt` "Painting N" | `<button aria-label="Siguiente">`, `alt` real |
| P2 | `paintingsSlider.jsx:26-44,97` | El punto activo se distingue solo por color (blueviolet vs #888); flechas son glifos blancos sin fondo sobre la foto (código) | `aria-current` + forma distinta; flechas con fondo |
| P1 | `Agendas.jsx:51-60` | `<Link><motion.h1><motion.button>`: CTA dentro de un `h1` dentro de un link (3 `h1` en la página; LH `link-name` en ese link) | Un `Link` con estilo de botón fuera del encabezado |
| P1 | LCP 7,9 s (LH) | Imagen del slider (`intAgenda9`) sin prioridad y con todas las demás compitiendo | Fase 5 |

### `/agenda-personalizada` — LH 79/77/100/85, 4.242 KiB
| Severidad | Dónde | Problema | Fix |
|---|---|---|---|
| P0 | `AgendaPrices.js:8`, `AgendaForm.jsx:127-129` | **[RESUELTO 2026-10-11]** **Cobro de la frase contra la regla de negocio**: la frase no tiene costo adicional, pero tildar "Agregar frase personalizada" suma +$3000 al total (y no hay ningún texto que lo explique en la UI) (flujo, combinaciones 2 y 3) | Poner `ADICION_DE_FRASE` en 0 y quitar la suma; **cambia precio → requiere aprobación** (Fase 9 o antes). Secundario (P2): al destildar la casilla el texto de la frase igual se envía; incluirla solo si `formData.checkbox` |
| P0 | `DropDownImgs.jsx:18-19` | Elegir la obra de fondo (obligatoria, `AgendaForm.jsx:73-76`) solo con mouse/toque: `<div onClick>` sin foco, rol ni estado seleccionado; `alt` "Cuadro N" (DOM: 13 clickeables no semánticos) → **un usuario de teclado o lector de pantalla no puede completar el pedido**. Además el componente recibe `selectedImage` (`AgendaForm.jsx:422`) pero lo ignora: la obra elegida no se marca en la grilla (`.selected` existe en `agendas.css:858` sin uso) | Radiogroup de imágenes (`<input type="radio">` + `<label>`) con el nombre de la obra y estado seleccionado visible |
| P1 | `AgendaForm.jsx:250-278` | Tras `window.open` muestra "✅ ¡Pedido enviado!" y **resetea todo** aunque WhatsApp no se haya abierto (flujo: `window.open` devolvió `null` y el reset ocurrió igual). El pedido no está "enviado" hasta que la persona lo manda en WhatsApp | Revisar el resultado de `window.open`, ofrecer enlace de respaldo y no resetear hasta confirmar (Fase 9) |
| P1 | `AgendaForm.jsx` (toast propio), `agendas.css:25-30` | El aviso no tiene `role="status"`/`aria-live` (flujo); texto blanco sobre degradado que arranca en #667eea (≈ 3,66:1 en ese extremo) | Usar `react-hot-toast` (ya instalado) o `aria-live`; fondo ≥ 4,5:1 |
| P2 | `agendas.css:471-478` | La confirmación "obra seleccionada" usa #27ae60 sobre verde al 10 % (< 2,9:1, cálculo sobre blanco) y es la única señal de la selección | Color ≥ 4,5:1 y estado visible en la grilla |
| P1 | errores en línea, `agendas.css:12,260-262` | Errores sin `aria-invalid`/`aria-describedby` (flujo); color #e74c3c 3,82:1; color de éxito #27ae60 **2,87:1** | Vincular errores; colores ≥ 4,5:1 |
| P1 | radios de tipo y papel | 20×20 y 18×18 px (DOM); el `label` amplía el área, pero el tamaño del objetivo visual no está medido | Filas de opción ≥ 44 px |
| P2 | `AgendaPreview.jsx:26,30` | `alt` = ruta del archivo de la obra; `h2` vacío en la vista previa | `alt` con el nombre de la obra; no renderizar `h2` vacío |
| P2 | `AgendaForm.jsx:614-618` | Miniaturas del cuaderno A4 son `<div onClick>` | `<button>` |
| P2 | `AgendaForm.jsx:584` | Total visible "$25900" sin separador de miles | `Intl.NumberFormat('es-AR')` en el total visible. El total del mensaje (`AgendaForm.jsx:212`) **no se toca sin aprobación**: la checklist exige que coincida carácter por carácter |
| P2 | `AgendaForm.jsx:307-308` | Copy en tuteo ("Personaliza", "Completa") en un sitio con voseo | "Personalizá", "Completá" |
| P2 | `customAgenda.jsx:18-35` | Plantilla de WhatsApp para varios pedidos que nunca se ejecuta (`AgendaForm` no recibe `onSave`) | Decidir si se borra (no tocar sin aprobación) |

### `/mi-libro` — LH 81/75/100/85
| Severidad | Dónde | Problema | Fix |
|---|---|---|---|
| P1 | `personalBook.jsx:69-84` | "COMPRAR" = `<button>` dentro de un `<h2 onClick>` (DOM: 2 anidados); los 2 botones tienen el mismo nombre "COMPRAR" sin decir qué libro | Un `<button>` fuera del encabezado, con nombre que incluya el libro |
| P1 | slider (`paintingsSlider.jsx`) | Mismo problema de flechas/puntos `div` (DOM: 9 clickeables no semánticos); LCP = imagen del slider con `alt` "Painting 1" | Ver `/agendas` |
| P2 | `personalBook.jsx:57,117` | Dos `<main>` (DOM: 3 landmarks con el del root) | Un `<main>` |
| P2 | `personalBook.jsx:60,120` | Precio como `h4` (LH `heading-order`) | Texto con estilo, no encabezado |

### `/laminas` — LH 82/76/100/85
| Severidad | Dónde | Problema | Fix |
|---|---|---|---|
| P0 | `Laminas.jsx:92` → `DropDownImgs.jsx:18` | Mismo bloqueo de teclado: el botón "Comprar lámina" solo aparece después de elegir una obra con un `<div onClick>` | Ver `/agenda-personalizada` |
| P1 | `Laminas.jsx:84-90` | Botón "▼" sin nombre accesible ni `aria-expanded`; 30×33 px (DOM, flujo) | `aria-label="Elegir lámina"`, `aria-expanded`, ≥ 44 px |
| P1 | `Laminas.jsx:11` | Precio **$6900 escrito a mano** en el componente, fuera de `src/components/config/` (regla del proyecto: precios solo en config) | Mover a config sin cambiar el valor (Fase 8, con aprobación) |
| P2 | `Laminas.jsx:70-94` | `<label>` que envuelve un `h2` y el desplegable; "Seleccione" (usted) | Estructura simple; "Elegí una lámina" |

### `/sobre-mi` — LH 77/70/100/85
| Severidad | Dónde | Problema | Fix |
|---|---|---|---|
| P1 | LH `color-contrast` | Títulos `.style-card-title` en #667eea sobre blanco = **3,66:1** (y es otro violeta distinto del acento) | Acento del sistema con ≥ 4,5:1 |
| P1 | `AboutMe.jsx:81-89,106` | 3 `h1` ("Sobre mi" + "Analia Carlomagno" + logo); "Sobre mi" y "Analia" sin tilde | Un `h1`; "Sobre mí", "Analía" |
| P2 | `AboutMe.jsx:195-196,231-232` | Tarjetas de historia = `<div onClick>` (DOM: 2); el "Leer más" interno es un botón sin handler propio (el clic burbujea) | `<button aria-expanded>` |
| P2 | LH `heading-order` | `h3.stat-number` para cifras | Texto con estilo |

### `/contacto` — LH 67/79/100/85, LCP 6,7 s
| Severidad | Dónde | Problema | Fix |
|---|---|---|---|
| P1 | `ContactForm.jsx:52-59` | **Si EmailJS falla, el formulario se vacía igual** (reset en `finally`): la persona pierde su mensaje (flujo, error simulado) | Resetear solo en éxito (Fase 9; no toca la configuración de EmailJS) |
| P1 | `GoogleMap.jsx` | El iframe de Maps se carga al entrar, sin scroll: 26 peticiones a Google (red) y probablemente parte del LCP de 6,7 s / Perf 67 [inferido] | Mapa estático o "clic para cargar el mapa" (Fase 2/10) |
| P1 | página | Sin `h1` propio (el único es el logo) (DOM) | `h1` "Contacto" |
| P2 | `ContactForm.jsx` | Sin `autocomplete` (`given-name`, `family-name`, `email`) (flujo); etiquetas con ":" | Agregar `autocomplete` |
| P2 | `ContactForm.jsx:51` | "Inténtalo de nuevo" (tuteo) | "Intentá de nuevo" |
| P2 | `ContactForm.jsx:17` | Clave pública de EmailJS en el código (es pública por diseño en EmailJS; **no se toca** sin preguntar, según CLAUDE.md) | Solo documentar |

---

## 3. Lo que ya funciona (mantener)

- **Precios de agendas y libros salen de config** (`AgendaPrices.js`, `LibrosPrice.js`) y los totales de las 3 combinaciones probadas
  coinciden exactamente (flujo).
- **Los 10 mensajes de WhatsApp** usan el mismo teléfono (`542494245966`), `encodeURIComponent` y pestaña nueva (flujo).
- **Obra personalizada conserva los datos** después de abrir WhatsApp y explica por qué el botón está deshabilitado
  ("Completá los campos requeridos") (flujo).
- **Formulario de agenda**: `fieldset`/`legend` para las opciones, `label` asociados, total en vivo y vista previa (código, flujo).
- **Contacto**: etiquetas asociadas, validación nativa, estado "Enviando..." deshabilitado, toasts de react-hot-toast con `role="status"` (flujo).
- **Cero cookies, cero storage, cero trackers** en todas las rutas (red).
- **Sin scroll horizontal** a 390 ni a 1280 px en las 10 rutas (DOM).
- **CLS = 0** y **Best Practices 100** en las 10 rutas (LH).
- **El violeta de marca pasa AA**: blueviolet sobre blanco 5,96:1, sobre aliceblue 5,55:1, texto blanco sobre violeta 5,96:1.
- **El foco por defecto del navegador es visible** en links y botones (flujo: `outline: auto 1px` en las paradas de Tab); solo se
  quita en inputs de 2 formularios, y ahí se reemplaza por un borde.
- Fuentes con `preconnect` y `display=swap` (`index.html:11-15`); el filtro de obras funciona (6 disponibles / 16 vendidas).
- Build OK con Vite 8 y React Router 7; todas las rutas renderizan (ver `2026-10-metrics.md`).

## 4. No verificado en esta auditoría

- **Capturas** de 17 de las 20 combinaciones de ruta y ancho (ver aviso al inicio); la revisión visual de jerarquía, ritmo y
  solapamientos fuera de Home/menú/`/elegir` se infiere del DOM.
- Anchos **360 y 768 px** (la skill pide 360/390/768/1280; se midió 390 y 1280).
- **Lector de pantalla real** (VoiceOver/TalkBack): los hallazgos de ARIA salen del DOM y de Lighthouse.
- **Producción**, dispositivos reales y navegador in-app de Instagram.
- Contraste del texto sobre el video del hero (#CA98F8 "artista plástica"): depende del cuadro del video, no se puede calcular.
- Lentes de copy y tono en profundidad (`design:ux-copy`): solo se marcaron errores concretos (tildes, tuteo/usted).

## 5. Revisión `ux-a11y-reviewer`

Revisión independiente de solo lectura (sin navegador: no renderizada), con más de 25 citas contrastadas contra `src/` y `raw/`.
**Veredicto: Approve with follow-ups**, sin bloqueantes. Seguimientos incorporados en este documento:

- Se corrigió la cita del total visible (`AgendaForm.jsx:584`, no `:212`, que es el mensaje de WhatsApp).
- Se agregó el top 10 (lo pide el "Listo cuando" de la Fase 0).
- Se agregaron hallazgos que faltaban: "volver arriba" sin nombre, imagen LCP animada desde opacidad 0, menú sin Escape ni manejo
  de foco, selección de obra sin estado visible, contraste del toast y de "obra seleccionada", punto del slider solo por color,
  botones "Consultar"/"COMPRAR" con el mismo nombre.
- Los inputs de 14 px suben a P1, para corregirlos junto con el zoom.
- La página 404 se marca como "requiere aprobación".
- Los pesos se rotulan en MiB.
- El solapamiento del botón flotante se apoya en la captura de viewport.
- En `2026-10-critical-flows.md` se agregó el caso "foto destildada" (medido) y se corrigió el dato de prueba.
