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

## DL-004 - Rediseno de /agendas y nombre del sitio en Google (2026-10-12)
Status: accepted; implemented
Context: /agendas era un carrusel suelto, un boton gigante al final y una grilla de tapas sin contexto. Google mostraba "Vercel" como nombre del sitio.
Decision: Hero de 2 columnas en desktop (texto + carrusel), CTA arriba y repetido, beneficios, lista de precios leida de `AgendaPrices.js` (sin cambiar valores), tapas con `object-fit: contain` enlazadas a /agenda-personalizada y cierre con CTA. Titulo de pestana por pagina. Nombre del sitio: JSON-LD `WebSite` (name "Ani Carlomagno") + `og:site_name`.
Consequences: Google tarda dias/semanas en recrawlear; se acelera pidiendo reindexar en Search Console. `og:image`/`twitter:image` apuntan a /images/*.jpg que no existen en `public/` (pendiente).

## DL-005 - /agenda-personalizada como stepper de 4 pasos con vista previa (2026-10-12)
Status: accepted; implemented
Context: El formulario era una pagina larga con todos los campos juntos, toasts, sonido y reseteo automatico.
Decision: Pasos Producto > Tapa > Detalles > Revision, vista previa en vivo (sticky en desktop, compacta en mobile), barra inferior con total y boton principal, borrador en localStorage, estado de exito. Se reemplazan AgendaForm, AgendaPreview y SavedAgenda; se elimina el CSS legacy de agendas.css que quedo sin uso. El mensaje de WhatsApp, el telefono y los precios (AgendaPrices.js) no cambian; la frase sigue sin costo (DL-003).
Consequences: La ubicacion del nombre ahora tiene valor por defecto (abajo a la derecha) en vez de obligar a elegir. La vista previa muestra la obra completa (contain), no recortada.

## DL-006 - La frase personalizada vuelve a tener costo: +$2000 (2026-10-12)
Status: accepted; implemented
Context: DL-003 habia definido la frase como gratis.
Decision: Regla de negocio actualizada por Valentin/Ani: la frase suma $2000 (`ADICION_DE_FRASE` en `AgendaPrices.js`) solo si la casilla esta tildada. Reemplaza DL-003.
Consequences: El total (barra, resumen y mensaje de WhatsApp) incluye el adicional; el texto de la casilla lo avisa.

## DL-007 - Rediseno de /mi-libro (Libros) y /laminas; retiro de agendas.css (2026-10-12)
Status: accepted; implemented
Context: Libros usaba dos bloques repetidos con precio superpuesto en rojo y un boton COMPRAR dentro de un h2. agendas.css solo quedaba para estas paginas y aportaba el reset global `box-sizing`.
Decision: Libros pasa a dos secciones editoriales alternadas (carrusel + texto + precio + CTA a WhatsApp) con chips de salto. Se eliminan agendas.css y personalBook.css; el reset `box-sizing: border-box` se mueve a LandingPage.css. Mensajes de WhatsApp, telefono y precios (LibrosPrice.js) sin cambios.
Consequences: Copy en voseo ("Coloreá y convertite"). La ruta sigue siendo /mi-libro.

## DL-008 - Rediseno editorial de /sobre-mi (2026-10-12)
Status: accepted; implemented
Context: La pagina usaba iconos tipo emoji, tarjetas con degradado repetidas (numeros, estilo, trayectoria) y un "Leer mas" que ocultaba la historia.
Decision: Apertura asimetrica (nombre en script + cita + retrato), numeros como tipografia entre filetes, "Mi estilo" y "Mi trayectoria" como listas con titulo a la izquierda, historia siempre visible alternando foto y texto, cierre con CTA a obras en stock y obra personalizada. Se eliminan los SVG-icono de las estadisticas y aboutMe.css. El padding de .titleBg que aboutMe.css pisaba globalmente (afectaba a /obras-en-stock) pasa a LandingPage.css para no cambiar esa pagina.
Consequences: Textos sin cambios (salvo tildes/puntuacion); alts reescritos tras ver las fotos.
