# Plan de rediseño incremental — anicarlomagno.vercel.app

Estado: **propuesta para aprobar** · Fecha: 2026-10-11 · Responsable de decisiones: Valentín / Ani
Contexto de producto: [product-overview.md](product-overview.md) · Reglas: [governance/README.md](governance/README.md)

> Los datos de este plan salen del código actual. Lo que es suposición está marcado **(confirmar)**.
> Los textos legales son borradores técnicos, **no asesoramiento legal**: deben revisarlos un abogado/contador.

---

## 1. Principio rector: mejorar sin cambiar quién es Ani

No es un rediseño de marca. Es una **mejora de la experiencia, la accesibilidad, la performance y el SEO** conservando la identidad.

### ADN que se conserva (no se toca sin aprobación explícita)

| Elemento | Qué se mantiene |
|---|---|
| Nombre/logo | "anicarlomagno" en **Dancing Script** + "artista plástica" |
| Tipografías | **Dancing Script** (identidad) y **Raleway** (lectura). Se eliminan solo las que no se usan (Inter en `:root` queda tapada por `* { font-family: Raleway }`; Cedarville Cursive se carga y no se usa **(confirmar con grep en la fase 4)**) |
| Color | Familia **violeta** (`blueviolet`) como único acento + fondos claros suaves (`aliceblue`). Se afina el tono solo si falla contraste, y se documenta |
| Imágenes | Las obras: saturadas, alto contraste, mujeres de ojos grandes. Nunca se recortan de forma destructiva, recolorean ni se les pone texto encima |
| Voz | Cálida, cercana, voseo es-AR ("Elegí", "Consultá", "Seguime") |
| Modelo de venta | Cierre por **WhatsApp**, sin carrito ni pagos |
| Secciones y nombres | Agendas y cuadernos, Obras, Libros, Láminas, Sobre mí, Contacto; las URLs actuales no cambian |

### Qué sí cambia

Estructura y jerarquía, espacios y ritmo vertical, escala tipográfica, consistencia de componentes, movimiento (menos y con propósito),
accesibilidad, peso de imágenes, SEO técnico, páginas legales, claridad de la información de compra.

### Cómo se usa "Apple" aquí

Como **vara de calidad estructural** (la obra es la protagonista, el UI se retira, un solo acento, mucho aire, tipografía ajustada),
no como estética a copiar. Ver skill `apple-design`. Orden de autoridad: `DESIGN.md` > `apple-design` > `frontend-design` > gusto.

---

## 2. Cómo funciona el plan incremental

- **12 fases (0–11)**, cada una es **un PR chico**, desplegable por sí solo y reversible (`git revert`).
- Ninguna fase depende de las posteriores para que el sitio quede mejor que antes.
- Las primeras fases son **invisibles o casi invisibles** (seguridad de red): accesibilidad básica, legal, SEO, tokens que replican el look actual.
  Los cambios visibles llegan después, ya con tokens, imágenes livianas y una línea base para comparar.
- Cada fase termina con la [Definition of Done](governance/definition-of-done.md) y una entrada en el [decision-log](governance/decision-log.md).
- **Ciclo por fase:** `design-lead` (spec) → `ui-implementer` (implementa) → `ux-a11y-reviewer` (veredicto) → Valentín mira en el celular y aprueba.
- **Nivel de cambio visual** por fase: ⚪ ninguno · 🟡 leve · 🟠 medio. **Esfuerzo:** S (≤½ día) · M (1–2 días) · L (3+ días).

### Mapa de skills y agentes

| Skill / agente | Dónde brilla en este plan |
|---|---|
| `landing-ux-audit` | Fase 0 (línea base), y como "antes/después" en cada fase |
| `web-design-guidelines` + `design:accessibility-review` | Fases 1, 6–10 (revisión) y 11 (cierre) |
| `design-md` | Fase 4 (autoría, lint y export de tokens) |
| `apple-design` | Fases 4, 6, 7, 8: calidad de tipografía, espacios, componentes |
| `frontend-design` | Fase 7 (Home) y 10 (Sobre mí): momentos de carácter sin caer en plantilla |
| `design-system-rework` | Guía transversal; este plan lo **detalla y reemplaza en orden** |
| `design:ux-copy` | Fases 2, 8, 9 (textos legales amigables, CTAs, errores de formulario) |
| `design-lead` / `ui-implementer` / `ux-a11y-reviewer` | Ciclo de cada fase |

---

## 3. Resumen de fases

| # | Fase | Objetivo en una línea | Visual | Esf. |
|---|---|---|---|---|
| 0 | Línea base y red de seguridad | Medir y capturar el estado actual | ⚪ | S |
| 1 | Accesibilidad y higiene "invisible" | Arreglar lo que daña sin cambiar el look | ⚪ | S |
| 2 | Legales y transparencia | Privacidad, cookies, términos, datos de contacto | 🟡 | M |
| 3 | SEO técnico | Que Google y las redes vean cada página | ⚪ | M |
| 4 | Tokens (sin cambio visual) | `DESIGN.md` + `tokens.css` que reproducen el look actual | ⚪ | M |
| 5 | Imágenes y rendimiento | Pasar de ~43 MB de originales a imágenes responsivas | ⚪ | M–L |
| 6 | Shell: navegación, flotantes, footer | Mejor navegación mobile y fin de solapamientos | 🟠 | M |
| 7 | Home | Jerarquía clara, obra protagonista, un CTA | 🟠 | L |
| 8 | Catálogo (obras, láminas, libros, agendas) | Información de compra clara y tarjetas consistentes | 🟠 | L |
| 9 | Flujos de conversión (formularios) | Pedir una agenda/obra más fácil y sin errores | 🟠 | L |
| 10 | Sobre mí y Contacto | Contar la historia mejor y contactar sin fricción | 🟡 | M |
| 11 | Cierre y hardening | Lighthouse, a11y final, limpieza de CSS, medición | ⚪ | M |

---

## 4. Las fases en detalle

### Fase 0 — Línea base y red de seguridad
**Objetivo:** saber exactamente de dónde partimos para poder demostrar mejora y detectar regresiones.
**Hacer**
- `npm run build` y `npm run lint`; anotar errores existentes (no se arreglan acá).
- Capturas de cada ruta a 390 y 1280 px en `design/baseline/`. Rutas: `/`, `/elegir`, `/obras-en-stock`, `/obra-personalizada`, `/agendas`, `/agenda-personalizada`, `/mi-libro`, `/laminas`, `/sobre-mi`, `/contacto`.
- Auditoría con `landing-ux-audit` por ruta → `design/audits/2026-10-baseline.md`.
- Lighthouse mobile por ruta principal (Perf/A11y/Best Practices/SEO) y Core Web Vitals (LCP, CLS, INP).
- Escaneo de cookies/requests de terceros (DevTools → Application/Network) → insumo de la fase 2.
- Inventario de pesos de imágenes (hoy: ~13 MB en `components/imgs`, ~30 MB en `paintingsImgs`).
- Checklist de flujos críticos (lista de "no romper"): pedido de agenda → WhatsApp con mensaje correcto y total; "Consultar" obra; obra personalizada; contacto EmailJS; botón flotante; lámina.
**Skills/agentes:** `landing-ux-audit`, `ux-a11y-reviewer`.
**Listo cuando:** existen baseline, auditoría y métricas guardadas; el equipo acuerda el top 10 de problemas.
**Riesgo:** ninguno (no toca código).

### Fase 1 — Accesibilidad e higiene invisible
**Objetivo:** corregir fallas objetivas sin alterar el diseño.
**Hacer (cada ítem es pequeño)**
- `index.html`: quitar `user-scalable=no` (bloquea zoom); arreglar codificación (`AnalÃ­a` → `Analía`) guardando el archivo en UTF-8; `theme-color`.
- Links externos: `target='blank'` (nombre de ventana, no `_blank`) → `target="_blank" rel="noopener noreferrer"` en `SocialMedia`, Instagram de Home, etc.
- Un solo `h1` por ruta; en `Cuadro.jsx` el título de tarjeta pasa de `h1` a `h3`/`h2` conservando el estilo con una clase.
- `WhatsappIcon`: `div` clickeable → `<a>`/`button` con `aria-label="Escribile a Ani por WhatsApp"` (mismo mensaje, mismo número).
- `alt` descriptivos para obras y vacíos (`alt=""`) para decorativas; los SVG de menú ("Home svg") pasan a decorativos.
- Botón ☰ del NavBar: `aria-label`, `aria-expanded`, `aria-controls`.
- `:focus-visible` global con el acento; skip-link "Saltar al contenido".
- `prefers-reduced-motion`: desactivar animaciones de framer-motion (`MotionConfig reducedMotion="user"` en `LandingPage.jsx`) y las CSS.
- `lang="es-AR"`; `role="main"` sobre `#root` en `index.html` se reemplaza por `<main>` real por página.
**Skills/agentes:** `web-design-guidelines`, `design:accessibility-review`, `ui-implementer`, `ux-a11y-reviewer`.
**Listo cuando:** mismo aspecto (diff de capturas sin cambios apreciables), Lighthouse A11y ≥ 95 en las rutas auditadas, navegación completa solo con teclado.
**Riesgo:** bajo. Cuidado con estilos que dependan de `h1` en `Cuadro` (revisar `paintings.css`).

### Fase 2 — Legales y transparencia
**Objetivo:** cumplir lo razonable para un sitio argentino que recoge datos y vende a distancia.
**Situación actual (a verificar en Fase 0)**
- Datos personales: formulario de contacto (nombre, apellido, email, mensaje) vía **EmailJS**; datos que el usuario manda por **WhatsApp**.
- Terceros: Google Fonts (carga desde servidores de Google), **Google Maps embebido**, EmailJS, WhatsApp, Instagram/TikTok/Facebook (enlaces).
- No hay analytics ni trackers propios **(confirmar con el escaneo)**.
**Hacer**
1. **Política de privacidad** (`/privacidad`): responsable (nombre de Ani, contacto), qué datos, para qué, con quién se comparten (EmailJS, WhatsApp, Google), plazos de conservación, derechos de acceso/rectificación/supresión y cómo ejercerlos, y la leyenda del órgano de control (AAIP) de la **Ley 25.326**. Consultar si corresponde inscribir la base de datos (RNBD) **(confirmar con abogado)**.
2. **Cookies**: la estrategia más simple y respetuosa es **no necesitar banner**:
   - Autoalojar Google Fonts (de paso mejora performance y evita enviar la IP a Google).
   - Mapa de Google en modo "click para cargar" (placeholder con botón "Ver mapa") — hoy el iframe carga cookies de Google al entrar a `/contacto`.
   - Sin analytics, o uno sin cookies (ver Fase 11).
   - Sección "Cookies" dentro de la política de privacidad (qué usamos: solo almacenamiento técnico) y `/cookies` breve si se prefiere.
   - **Si más adelante se agrega algo que usa cookies no esenciales** (GA, Meta Pixel, etc.): banner con consentimiento previo, "Rechazar" tan visible como "Aceptar", y carga condicionada.
   - Argentina no obliga hoy a un banner como la UE; si hay audiencia europea o se agregan trackers, aplicar GDPR/ePrivacy. **(confirmar con abogado)**
3. **Términos y condiciones de compra** (`/terminos`): cómo se compra (consulta por WhatsApp), productos personalizados, plazos de producción y envío, medios de pago, cambios y devoluciones, **derecho de arrepentimiento** y su alcance en productos hechos a medida (Ley 24.240 art. 34 y normativa sobre "botón de arrepentimiento") **(confirmar con abogado/contador)**.
4. **Datos del proveedor y Defensa del Consumidor** en el footer: nombre/razón social, CUIT, domicilio, contacto y la leyenda de defensa del consumidor vigente **(confirmar con contador qué corresponde según su situación fiscal)**.
5. **Aviso en el formulario**: "Al enviar aceptás la Política de privacidad" con enlace, y checkbox solo si el abogado lo pide.
6. Footer: enlaces a Privacidad, Cookies, Términos.
**Skills/agentes:** `design:ux-copy` (redactar claro y cálido, no jerga), `ui-implementer` (páginas simples con el estilo actual), `ux-a11y-reviewer`.
**Para decidir (Valentín/Ani):** datos reales a publicar (CUIT, domicilio), si Ani está inscripta, plazos de producción/envío, política de cambios.
**Listo cuando:** páginas publicadas y enlazadas en footer y formularios; mapa y fuentes sin cookies de terceros al cargar (verificado en DevTools); texto revisado por un profesional.
**Riesgo:** medio *legal* (por eso la revisión), bajo técnico.

### Fase 3 — SEO técnico
**Objetivo:** que cada página tenga identidad propia en buscadores y al compartir en redes.
**Problemas actuales**
- SPA con `BrowserRouter` y rewrite total a `/` (`vercel.json`): todas las rutas devuelven el mismo HTML vacío y mismo `<title>`/meta.
- `og:image`/`twitter:image` apuntan a `/images/og-image.jpg` y `/images/twitter-image.jpg`: **no existen en `public/`** (hoy solo hay `favicon.svg`, `faviconOjo.jpeg`, `vite.svg`).
- No hay `robots.txt`, `sitemap.xml` ni 404 real (`path="*"` muestra Home con status 200).
- JSON-LD declara redes (`instagram.com/anicarlomagno`, Twitter) que no coinciden con las del sitio (`anicarlomagno_painting`) **(confirmar cuáles son las reales)**.
- `meta keywords` no aporta; título/description no mencionan Tandil ni agendas.
**Hacer**
- Crear `public/og-image.jpg` (1200×630, una obra bien recortada **sin texto encima**) y referenciarla con URL absoluta.
- `robots.txt` y `sitemap.xml` (rutas públicas), canonical por ruta.
- **Metadatos por ruta** con `react-helmet-async` (o equivalente liviano): title (≤60), description (≤155), canonical, OG/Twitter. **Decisión de dependencia → pedir aprobación.**
- **Prerender en build** de las rutas públicas (p. ej. `vite-react-ssg` u otra opción) para que crawlers y redes vean el contenido sin ejecutar JS. Evaluar costo/beneficio en un spike antes de comprometerse; alternativa mínima: solo Helmet (Google ejecuta JS, pero WhatsApp/Facebook/Instagram no).
- Página **404 real** con enlace a Obras/Agendas; rewrites de Vercel que respeten archivos estáticos.
- **Datos estructurados:** `Person`/`Artist` (Ani, Tandil, redes reales), `Product` + `Offer` para agendas/cuadernos usando los precios de `config/AgendaPrices.js` (nunca duplicar números), `BreadcrumbList`. Para obras originales, `VisualArtwork`/`Product` sin precio (se consulta).
- Títulos de ejemplo: Home "Analía Carlomagno · Artista plástica en Tandil | Obras, agendas y láminas"; Agendas "Agendas y cuadernos personalizados | Ani Carlomagno".
- Copy con palabras que la gente busca (agenda personalizada, cuadros, láminas, artista plástica Tandil) **sin keyword stuffing**; encabezados reales en vez de texto en imagen.
- Fuera del código: dar de alta **Google Search Console** y **Google Business Profile** (Tandil), y alinear nombre/usuario de redes. Ani lo hace con nuestra guía.
**Skills/agentes:** `landing-ux-audit` (lente 6), `web-design-guidelines`, `design:ux-copy` (titles/descriptions), `ui-implementer`.
**Listo cuando:** cada ruta tiene title/description/canonical/OG únicos (verificado viendo el HTML servido, no el DOM), `sitemap.xml` y `robots.txt` accesibles, imagen OG visible en un debugger de WhatsApp/Facebook, SEO Lighthouse ≥ 95.
**Riesgo:** medio (prerender/routing). Mantener las URLs actuales; si se renombra alguna, redirección 301.

### Fase 4 — Tokens (sin cambio visual)
**Objetivo:** crear la base del sistema de diseño **reproduciendo lo que ya existe**, para poder cambiar después con seguridad.
**Hacer**
- Inventariar valores reales del CSS: colores (violeta, aliceblue, grises, errores/éxito de `agendas.css`), fuentes, radios (8/6 px), espacios.
- Escribir `DESIGN.md` (skill `design-md`) con esos valores como tokens + explicación de la identidad ("conservar la esencia"); semilla estructural: `apple-design/references/apple.DESIGN.md`.
- `src/styles/tokens.css` con variables `--color-*`, `--font-*`, `--space-*`, `--radius-*` en correspondencia 1:1.
- Reemplazar en el CSS los valores sueltos por `var(--…)` ruta por ruta **sin modificar el resultado**. Eliminar fuentes no usadas del `<link>` de Google Fonts.
- Verificar contraste de cada par de colores numéricamente; si el violeta sobre aliceblue no llega a 4.5:1 en texto, definir una variante `--color-accent-text` apenas más oscura y registrar la decisión.
- Lint del `DESIGN.md` con `npx @google/design.md lint DESIGN.md` (puede requerir que lo corra Valentín).
**Decisiones a cerrar (decision-log):** acento exacto, escala tipográfica base (mobile 16 px mínimo), radios, curva y duración de movimiento.
**Skills/agentes:** `design-md`, `apple-design`, `design-lead`.
**Listo cuando:** diff de capturas vs. baseline ≈ 0; no quedan hex/px de diseño nuevos fuera de tokens; lint sin errores.
**Riesgo:** bajo si se hace archivo por archivo.

### Fase 5 — Imágenes y rendimiento
**Objetivo:** que el sitio cargue rápido en celular con datos móviles, sin que la obra pierda calidad.
**Hacer**
- Pipeline de optimización: generar **AVIF/WebP + JPEG fallback** en varios anchos (p. ej. 480/800/1200/1600) desde los originales (que se conservan fuera del bundle o en una carpeta `originals/`). Herramienta a elegir (p. ej. script con `sharp`, o `vite-imagetools`) → **dependencia: pedir aprobación**.
- Componente único `ArtworkImage` con `srcset/sizes`, `width/height` (evita saltos de layout), `loading="lazy"` y `decoding="async"`; la imagen principal de Home con `fetchpriority="high"` y `preload`.
- Slider de Home: solo la primera imagen eager.
- Revisar el `.mp4` (`wspVideo-header.mp4`) y el `.zip` dentro de `imgs/cuadernoA4/` (no deberían estar en el bundle) **(confirmar si se usan)**.
- Presupuesto: imagen de tarjeta ≤ 150 KB, hero ≤ 250 KB, página de Home ≤ ~1.5 MB transferidos en móvil.
**Skills/agentes:** `landing-ux-audit` (lente 5), `ui-implementer`, `ux-a11y-reviewer`.
**Listo cuando:** LCP móvil < 2.5 s (4G simulado), CLS < 0.1, peso total transferido de Home < 1.5 MB, y la calidad percibida de las obras igual (comparación lado a lado aprobada por Ani).
**Riesgo:** medio (muchas importaciones de imágenes; hacerlo por lotes: Home → catálogo → resto).

### Fase 6 — Shell: navegación, flotantes y footer
**Objetivo:** que moverse por el sitio sea fácil con el pulgar y que nada tape el contenido.
**Hacer**
- NavBar: logo "anicarlomagno" conservado; menú móvil como panel accesible (apertura sin animar la altura), enlaces con 44 px de alto, estado de ruta activa, cierre con Esc/click afuera/foco atrapado.
- Reorganizar etiquetas sin cambiar nombres: Inicio · Obras · Agendas y cuadernos · Libros · Láminas · Sobre mí · Contacto.
- Flotantes: WhatsApp único elemento fijo prioritario; "volver arriba" aparece solo tras scroll y nunca se superpone con él ni con el footer.
- Footer: un solo bloque (redes, navegación, envíos, legales); `Envio` ("Realizamos envíos a todo el país") integrado en el footer o en el pie de cada tarjeta de compra.
- Aplicar tokens ya definidos; eliminar CSS legado del nav/footer.
**Skills/agentes:** `apple-design` (nav/footer), `web-design-guidelines`, `design:design-critique`, `ux-a11y-reviewer`.
**Listo cuando:** DoD completo a 360/390/768/1280; ningún solapamiento entre flotantes; menú operable por teclado y lector de pantalla.
**Riesgo:** medio (afecta todas las páginas) → desplegar con la lista de "no romper" de la Fase 0.

### Fase 7 — Home
**Objetivo:** que en 5 segundos se entienda quién es Ani, qué vende y cuál es el siguiente paso.
**Hacer**
- Hero: la obra protagonista + una línea clara (propuesta: *"Arte pintado a mano en Tandil — obras, agendas y láminas con alma"* **(copy a validar con Ani)**) + CTA principal ("Ver agendas") y secundario ("Ver obras"). Evaluar si el slider se mantiene (autoplay pausable, con controles accesibles) o se reemplaza por una obra destacada.
- Secuencia: Hero → Agendas y cuadernos (qué se puede personalizar, desde qué precio usando `agendaPrices`) → Obras destacadas → "Quién soy" + "Mis pasiones" condensadas con la frase de los ojos grandes → Cómo comprar (3 pasos, solo porque es una secuencia real: elegís → me escribís por WhatsApp → lo recibís en todo el país) → Instagram.
- Ritmo vertical con lienzos alternos (claro/aliceblue) en lugar de cajas; animaciones solo de entrada suaves y desactivables.
- Un único CTA primario repetido de forma consistente.
**Skills/agentes:** `frontend-design` (momento de carácter: cómo presentar la obra), `apple-design`, `design:ux-copy`, `design:design-critique`.
**Listo cuando:** auditoría de Home sin P0/P1; LCP dentro de presupuesto; Ani aprueba que "sigue siendo ella".
**Riesgo:** medio-alto en percepción (es la página más vista) → mostrar capturas/prototipo a Ani antes de mergear.

### Fase 8 — Catálogo: obras, láminas, libros, agendas
**Objetivo:** tarjetas consistentes y la información de compra donde se decide.
**Hacer**
- Componente `ArtworkCard` único (Obras, Láminas, Libros): imagen con proporción estable, título, medida, estado (disponible / vendido / oferta), CTA "Consultar".
- Obras: filtros (todas/disponibles/vendidas) como control accesible con `aria-pressed`, estado vacío amable, paginación o "ver más" si hay muchas; ordenar para mostrar disponibles primero **(confirmar con Ani)**.
- Mensaje de cómo comprar y envíos visible en la tarjeta o encima del listado ("Consultame el precio por WhatsApp · Envíos a todo el país").
- Agendas: galería de diseños con tipos y precios desde `agendaPrices`, qué incluye cada tipo, papel, personalización, CTA a `/agenda-personalizada`.
- Libros: portada, sinopsis breve, precio desde `librosPrice`, CTA de compra.
- Lightbox/zoom accesible para ver la obra grande (foco, Esc, `alt`).
- Reemplazar `/elegir` por una elección más clara (dos tarjetas grandes: "Obras en stock" y "Obra personalizada") manteniendo la URL.
**Skills/agentes:** `apple-design`, `frontend-design`, `landing-ux-audit` (lente 1), `design:ux-copy`.
**Listo cuando:** los 4 listados usan los mismos componentes; precios solo vienen de `config`; mensajes de WhatsApp sin cambios (se compara el texto generado).
**Riesgo:** medio (datos en `objects/*.jsx`). Mejora opcional posterior: mover el contenido a JSON.

### Fase 9 — Flujos de conversión (formularios)
**Objetivo:** pedir una agenda/obra o escribir a Ani debe ser fácil, claro y sin errores en el celular.
**Hacer**
- `FormField` compartido (label visible, ayuda, error con `aria-describedby`, `autocomplete`, `inputmode`, tipos correctos, 16 px mínimo para evitar zoom de iOS).
- `AgendaForm` (hoy ~30 KB, el componente más grande): dividir en pasos cortos (tipo → papel → diseño → personalización → resumen con **total visible** → enviar), barra de progreso accesible, resumen editable antes de abrir WhatsApp, estado de carga y confirmación.
- Mantener intacto: cálculo de precio y plantilla del mensaje (se testean con ejemplos antes/después).
- Obra personalizada y Contacto: mismo patrón; validación en blur y al enviar, mensajes de error en voseo.
- WhatsApp: evaluar pasar `window.open` a un enlace `<a>` real (mejor en navegadores in-app de Instagram y sin bloqueo de popups). **Cambia el mecanismo → requiere tu aprobación.**
- Confirmación del contacto sin perder datos si EmailJS falla (hoy el `finally` limpia el formulario aun con error).
- Aviso de privacidad bajo el botón (de la Fase 2).
**Skills/agentes:** `design:ux-copy`, `design:accessibility-review`, `ux-a11y-reviewer`, `landing-ux-audit`.
**Listo cuando:** pedido de ejemplo de cada tipo genera exactamente el mismo mensaje/total que antes; flujo completo operable con teclado; probado en iOS Safari y Android Chrome y dentro del navegador de Instagram **(confirmar con dispositivos reales)**.
**Riesgo:** **alto** (es el negocio). Un PR por formulario y prueba manual de punta a punta.

### Fase 10 — Sobre mí y Contacto
**Objetivo:** que la historia de Ani se lea bien y contactarla sea inmediato.
**Hacer**
- Sobre mí: retrato/obra de apertura, párrafos con largo de línea cómodo (≤ 70 caracteres), cifras (+1000 obras, +20 años, +15 enseñando) con contexto, línea de tiempo accesible (lista ordenada), citas/imágenes sin texto encima.
- Contacto: opciones claras (WhatsApp, formulario, Instagram), mapa con click para cargar (Fase 2), horarios/zona de envío **(confirmar con Ani)**.
- Tono: conservar sus textos; solo edición de claridad y puntuación con su visto bueno.
**Skills/agentes:** `frontend-design`, `apple-design`, `design:ux-copy`, `design:design-critique`.
**Listo cuando:** DoD completo; Ani confirma que los textos suenan a ella.
**Riesgo:** bajo.

### Fase 11 — Cierre y hardening
**Objetivo:** consolidar, medir y dejar el sistema mantenible por una persona.
**Hacer**
- Eliminar CSS legado (`LandingPage.css`, `pagesStyles/*.css`, `contact/styles/*.css`) y dependencias sin uso (`blendy`, `lucide-react` si no se usan **(confirmar)**).
- Auditoría final completa (`landing-ux-audit` + `web-design-guidelines` + `design:accessibility-review`) y comparación contra la línea base.
- Lighthouse móvil ≥ 90 en las 4 categorías; Web Vitals: LCP < 2.5 s, CLS < 0.1, INP < 200 ms.
- Medición opcional y respetuosa: analítica **sin cookies** (p. ej. Plausible/GoatCounter) con evento "clic en WhatsApp" para saber qué se consulta. **Agregar solo con tu aprobación** y reflejarlo en la política de privacidad.
- Guía corta para Ani: cómo agregar una obra/agenda (archivo de datos + imagen), qué tamaño y formato usar.
- Actualizar `product-overview.md`, `CLAUDE.md` y `decision-log.md`.
**Listo cuando:** todas las casillas del DoD en todas las rutas; informe "antes vs. después" archivado en `design/audits/`.

---

## 5. Prompt de arranque por fase (para pegar en una sesión nueva)

> Seguí `docs/redesign-plan.md`, **Fase N**. Leé `CLAUDE.md`, `docs/product-overview.md` y la fase completa.
> Usá las skills y agentes que indica. Cambios mínimos y solo de esa fase; no toques precios, plantillas de WhatsApp, EmailJS ni rutas.
> Terminá con `npm run build` y `npm run lint`, revisá en 390 y 1280 px, pasalo por `ux-a11y-reviewer`, y decime qué verificaste y qué no.
> Si necesitás una dependencia, una fuente o un cambio de comportamiento, frená y preguntame.

## 6. Decisiones que necesitamos de vos (antes de cada fase)

| Antes de | Decisión |
|---|---|
| 2 | Datos legales a publicar (nombre/razón social, CUIT, domicilio), condición fiscal, plazos de producción y envío, política de cambios; contratar revisión legal |
| 3 | ¿Aprobás agregar `react-helmet-async` y evaluar prerender? ¿Cuáles son las redes oficiales (`anicarlomagno` vs `anicarlomagno_painting`)? |
| 4 | Acento exacto y fuentes finales (propuesta: conservar violeta, Dancing Script + Raleway) |
| 5 | Herramienta de optimización de imágenes (nueva dependencia) y ubicación de los originales |
| 7 | Hero: ¿slider o una obra destacada? Frase principal |
| 8 | Orden del catálogo y si se muestran obras vendidas |
| 9 | ¿Pasamos de `window.open` a enlace `wa.me`/`api.whatsapp.com`? |
| 11 | ¿Analítica sin cookies, sí o no? |

## 7. Riesgos y cómo se controlan

| Riesgo | Control |
|---|---|
| Romper el pedido por WhatsApp (pérdida de ventas) | Lista de "no romper" desde la Fase 0; comparar mensaje/total antes y después; fase 9 en PRs separados |
| Perder la esencia | Sección 1 como contrato; capturas a Ani antes de mergear Home/Catálogo; tokens que parten del look actual |
| Fases grandes que se alargan | Si una fase supera 3 días, se parte en dos PRs |
| Regresiones visuales | Capturas baseline por ruta y viewport; comparación en cada PR |
| Dependencias nuevas | Siempre con aprobación explícita (README de gobernanza, regla 2) |
| Legal | Revisión profesional; el plan solo prepara el borrador y la implementación |
| Skills de terceros | `web-design-guidelines` baja reglas remotas: es asesor, no autoridad ([third-party-skills.md](governance/third-party-skills.md)) |

## 8. Métricas de éxito

| Métrica | Hoy | Meta |
|---|---|---|
| Lighthouse móvil (Perf / A11y / BP / SEO) | medir en Fase 0 | ≥ 90 / ≥ 95 / ≥ 90 / ≥ 95 |
| LCP / CLS / INP (móvil) | medir en Fase 0 | < 2.5 s / < 0.1 / < 200 ms |
| Peso de Home transferido | medir en Fase 0 | < 1.5 MB |
| Páginas con title/description/canonical propios | 1 de 10 | 10 de 10 |
| Fallas de accesibilidad críticas | medir en Fase 0 | 0 |
| Consultas por WhatsApp desde el sitio | sin medición | línea base tras Fase 11 (si se aprueba analítica) |
