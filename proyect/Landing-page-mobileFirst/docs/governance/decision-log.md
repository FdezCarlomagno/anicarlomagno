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

## DL-009 - Rediseno de /contacto (2026-10-12)
Status: accepted; implemented
Context: Formulario con etiquetas con dos puntos, sin validacion visible, toasts y reseteo del formulario incluso si el envio fallaba.
Decision: Encabezado + tarjeta con validacion en linea, estados enviando/exito/error (los datos se conservan si falla), y lateral con WhatsApp, Instagram y mapa. La llamada a EmailJS (service, template, parametros y clave publica) no se toco.
Consequences: Se eliminan los CSS de contact/styles. WhatsApp usa el mismo telefono del sitio con un mensaje de consulta nuevo.

## DL-010 - Performance, SEO y accesibilidad globales (2026-10-12)
Status: accepted; implemented
Context: Lighthouse movil de base en la home: performance 68, accesibilidad 89, SEO 85 (viewport con user-scalable=no, sin robots.txt, og:image inexistente, sin h1 en la home, WhatsApp flotante no operable con teclado).
Decision: index.html limpio (zoom permitido, es-AR, fuentes recortadas y sin bloquear el render, preload del hero, JSON-LD verificado, sin redes no confirmadas); RouteMeta con title/description/canonical/OG por ruta y noindex en rutas desconocidas; robots.txt y sitemap.xml; rutas con React.lazy; skip link, h1 real en la home, logo del navbar sin h1/h2, WhatsApp y volver arriba como controles accesibles, anuncio de cambio de ruta; video del hero solo en pantallas >= 768 px y despues del load; Envio y Footer dentro del Suspense (CLS). Imagenes: copias web en src/optimized generadas con scripts/optimize-images.py (los originales no se tocan) y un plugin de Vite que redirige los imports.
Consequences: Se elimina codigo muerto (PaintingInfo, spinner, Toaster del navbar). Si se agregan imagenes grandes, volver a correr el script.


## DL-011 - Objetos de autor (/objetos-de-autor) y Libros fuera del navbar (2026-10-24)
Status: accepted; implemented behind FEATURES.objetos (apagado hasta que Ani apruebe)
Context: Nuevos productos con la obra de Ani: remera pintada a mano ($54.900, solo blanca, se elige la paleta), remera estampada DTF "Hecha en Argentina" ($34.900; blanca, gris, negra) y una taza con el mismo diseno ($19.900, unico diseno, no personalizable). Talles S-XL, otros a consultar.
Decision: Pagina nueva con la remera pintada primero (anclaje premium), la coleccion "Hecha en Argentina" como un solo producto con selector de color que cambia el par "Asi es / Asi queda puesta", y la taza dentro de la coleccion ("Diseno 01" + "Avisame cuando salgan nuevos") en vez de una seccion propia. Libros queda como seccion secundaria que lleva a /mi-libro (ruta sin cambios). En el navbar, "Objetos de autor" (con etiqueta "Nuevo") reemplaza a "Libros"; el footer conserva ambos. Accesos desde la home: aviso chico en el hero y una seccion despues de Agendas. Pedidos por WhatsApp con mensajes nuevos (mismo telefono); sin talle no se bloquea el boton, se avisa y se enfoca el grupo. Precios en ObjetosPrices.js.
Consequences: El menu de escritorio pasa de 768 px a 1100 px (debajo se usa el menu hamburguesa): con 6 links la fila ya se encimaba entre 768 y ~930 px. /mi-libro ahora baja al libro del #ancla al llegar desde otra pagina. PaintingSlider usa alt/width/height de cada foto si vienen en los datos. Las fotos puestas se encuadran con object-fit: cover en el carrusel y en el par (son fotos de producto; la foto completa se ve en el visor). Al encender el flag: agregar /objetos-de-autor a public/sitemap.xml.

## DL-012 - Hero: lo nuevo en el lugar del eyebrow, texto anclado abajo (2026-10-24)
Status: accepted; implemented
Context: El aviso "Nuevo" arriba del eyebrow sumaba altura y en mobile empujaba el texto sobre la zona clara del video (contraste ~1,6:1, revision a11y). Debajo de los botones se leia como un tercer boton. En desktop el H1 centrado tapaba la cara de la obra del video.
Decision: Con FEATURES.objetos, la pastilla "Nuevo · Objetos de autor" (fondo oscuro translucido) reemplaza al eyebrow "Artista plastica · Tandil" (el logo ya dice "artista plastica"); en >= 480 px suma "remeras, tazas y libros". Sin el flag vuelve el eyebrow, mas legible (13 px, lila mas claro, sombra). El subtitulo pasa de h2 a p. Desktop: texto anclado abajo a la izquierda, H1 clamp(40px, 4.2vw, 58px), degradé mas oscuro abajo. H1, subtitulo y botones sin cambios de texto ni destino.
Consequences: Objetos de autor: fotos 20% mas chicas en desktop y un par de 2 fotos por color (la negra usa la de Florencia como "Asi queda puesta"). Al apagar el flag, quitar el aviso no requiere tocar el hero.

## DL-013 - Numeros en Inter (2026-10-24)
Status: accepted; implemented (pedido explicito de Valentin)
Context: Raleway trae numeros de estilo antiguo (alturas desparejas, el 9 cuelga) que se leen mal en precios y talles.
Decision: Se carga Inter desde Google Fonts solo con los digitos (`text=0123456789`, pesos 400-800, asincrono como el resto) y se pone primera en las pilas de fuentes ("Inter", "Raleway", sans-serif): los digitos salen en Inter y todo lo demas sigue en Raleway. El precio de las obras en stock, que usaba Arial, pasa a la misma pila.
Consequences: Peticion extra a Google Fonts de unos pocos KB. Si alguien tiene Inter instalada en su equipo, mientras carga la hoja podria ver el texto en Inter por un instante.

## DL-014 - Remera pintada a mano: precio a $49.900 (2026-11-12)
Status: accepted; implemented (pedido explicito de Valentin)
Context: DL-011 fijo la remera pintada a mano en $54.900.
Decision: El precio pasa a $49.900 (REMERA_PINTADA en src/components/config/ObjetosPrices.js). Reemplaza el valor de DL-011; el resto de esa decision no cambia.
Consequences: Los mensajes de WhatsApp y la pagina toman el valor de la constante, sin otros cambios.

## DL-015 - Remera pintada a mano: diseno Frida y pestanas de diseno (2026-11-15)
Status: accepted; implemented (pedido explicito de Valentin)
Context: Se suma un segundo diseno de remera pintada a mano, "Frida" (retrato con turbante en trazo azul entre franjas turquesa y lavanda, "1978"), con dos fotos: puesta en el mar y extendida sobre madera. Valentin propuso pestanas que pasen solas a la siguiente despues de 15-30 s.
Decision: La remera pintada pasa a tener disenos (`DISENOS` en src/objects/objetosDeAutor.jsx), cada uno con sus fotos y sus paletas. El primero se llama "Pan de oro" (nombre de trabajo, por la banda dorada sobre los ojos); Frida lleva la etiqueta "Nuevo" y la paleta "Turquesa y lavanda" + "Otra, la charlamos". Arriba del carrusel hay un control segmentado con el patron ARIA de pestanas (flechas, Inicio, Fin). Auto-avance: con la seccion al menos 50% a la vista y sin interaccion, a los 15 s pasa UNA sola vez a la pestana siguiente (no hace loop); una barrita bajo la pestana siguiente se va llenando para avisar. Cualquier clic, tecla, foco o swipe dentro de la seccion lo cancela para siempre, y con prefers-reduced-motion no existe. El mensaje de WhatsApp suma "Diseno: <nombre>" y el boton dice "Pedi tu remera <nombre>". Mismo precio (REMERA_PINTADA). Fotos en src/components/imgs/objetos/pintada-frida-*.jpg; la extendida pasa por scripts/optimize-images.py (327 KB -> 175 KB); la puesta (135 KB, 900 px) no bajaba al recomprimir y queda como esta.
Consequences: Un solo cambio automatico por visita evita que el producto cambie mientras alguien elige talle. Para WCAG 2.2.2 el mecanismo de pausa es la propia interaccion: tocar o enfocar la seccion frena el auto-avance. Un usuario de lector de pantalla que lea sin mover el foco puede ver el cambio de pestana sin haberlo pedido; es un solo cambio y el panel queda etiquetado con el diseno. Para sumar un tercer diseno alcanza con otra entrada en `DISENOS`. Si "Pan de oro" no es el nombre que Ani quiere, se cambia solo el `label`.

## DL-016 - SEO: "anicarlomagno" (todo junto) con el mismo peso que "Ani Carlomagno" (2026-11-15)
Status: accepted; implemented (pedido explicito de Valentin)
Context: Buscando "Ani Carlomagno" el sitio sale primero; buscando "anicarlomagno" todo junto no aparece. El HTML estatico solo tenia "anicarlomagno" en el alternateName del WebSite; el logo y el footer que lo muestran se dibujan con JavaScript.
Decision: Las dos formas van juntas y al mismo nivel: meta keywords ("Ani Carlomagno, anicarlomagno, ..."), la descripcion de la home (index.html, og, twitter y RouteMeta "/") dice "Ani Carlomagno (anicarlomagno)", el Person suma "Ani Carlomagno" y "anicarlomagno" a alternateName, y su sameAs suma facebook.com/anicarlomagno. El title no cambia.
Consequences: Google ignora la meta keywords (Bing casi tambien): la mejora real viene de la descripcion y los datos estructurados, y tarda lo que Google tarde en volver a rastrear el sitio. Para acelerarlo: pedir indexacion de la home en Search Console. Si no alcanza, el siguiente paso es sumar "anicarlomagno" al title de la home.

## DL-017 - Pasada /unslop sobre el texto de la landing (2026-11-15)
Status: accepted; mergeado a main el 2026-11-15 por pedido de Valentin (falta el visto bueno de Ani sobre las frases nuevas)
Context: Valentin pidio pasar la skill /unslop (patrones de texto generado por IA) sobre toda la landing.
Decision: Se reescribio el texto de marketing y de interfaz donde habia marcas claras: vocabulario de IA y relleno ("vibrante poema visual", "pasion ardiente", "dos lenguajes magicos", "Drama visual que cautiva", "una invitacion a expresarte"), "No es X: es Y", dos puntos como conector, adverbios de relleno, comillas curvas y el guion largo del total vacio de la agenda (ahora "Sin elegir"). Se unifico "Consulta promos comprando mas de un producto" (el libro para colorear decia "Pregunta por descuentos en compras multiples"). Las tarjetas de estilo de Sobre mi ahora dicen hechos (espatula, foil dorado, hilo, lentejuelas). Las descripciones de las obras ganan tildes y pierden "realizado"; los filtros de tecnica, forma y diametro siguen andando (usan normalize()).
No se toco: mensajes de WhatsApp (plantillas), precios, nombres de obras, el relato en primera persona de Sobre mi (es la voz de Ani), titulares de marca ("El alma de la pintura, en tu ropa", "Obras con alma") ni la cita del hero.
Consequences: Algunas frases nuevas ponen palabras en boca de Ani (Mi manera de ver, Mis pasiones, Choose, libros); conviene que ella las lea antes de mergear. Los textos nuevos sobre el exterior ("casas de todo el pais y del exterior") salen del original "y mas alla"; confirmar.

## DL-018 - Remera pintada: "Mujer argentina", "Elegí el diseño" y Frida a pedido (2026-11-15)
Status: accepted; implemented (pedido explicito de Valentin)
Context: El nombre de trabajo "Pan de oro" (DL-015) no era el de Ani. Las pestanas no tenian un rotulo visible. Frida lleva el ano 1978 pintado y franjas turquesa y lavanda, y hay clientes que van a querer otro ano u otros colores antes de que existan fotos de esas versiones.
Decision: El primer diseno se llama "Mujer argentina" (id `mujer-argentina`). Siguen las pestanas y el auto-avance de DL-015, ahora con el rotulo visible "Elegí el diseño", que tambien nombra al tablist. Frida suma la paleta "Fucsia y celeste" sin fotos. Si se elige una paleta distinta de la que muestran las fotos, aparece "Las fotos muestran turquesa y lavanda. La tuya la pinto en <paleta>." (con "Otra" dice que se arregla por WhatsApp). Frida suma un campo opcional "Tu año de nacimiento" que reemplaza al 1978: vacio vale; si tiene algo, son 4 cifras entre 1900 y el ano actual, y si no, el pedido se frena con un aviso y el foco va al campo. El mensaje de WhatsApp suma "Año: <ano>." solo si se completo.
Consequences: La primera paleta de cada diseno es la que se ve en las fotos (comentado en `DISENOS`). Cuando haya fotos de Frida en otros colores, cada paleta puede traer sus fotos y el carrusel cambiaria segun la paleta elegida. La rama landing-unslop (DL-017) tambien toca ObjetosDeAutor.jsx y este log: al mergearla puede haber un conflicto chico al final del archivo.

## DL-019 - "Frida en trazo": una foto por paleta (2026-11-15)
Status: accepted; implemented (pedido explicito de Valentin)
Context: Llegaron fotos de Frida en tres combinaciones nuevas de franjas: verde, amarillo y celeste; fucsia, rosa y turquesa; naranja, amarillo y rojo. Producto pidio que esas sean las versiones disponibles, que el ano y los colores se puedan cambiar, y que el estilo se llame "Frida en trazo".
Decision: La pestana "Frida" pasa a llamarse "Frida en trazo" (el id sigue siendo `frida`). Sus paletas son turquesa y lavanda (las dos fotos que ya estaban) mas las tres nuevas, y cada paleta trae sus `fotos`: el carrusel muestra las de la paleta elegida. Se saco "Fucsia y celeste" (sin fotos, DL-018) y la opcion "Otra" de este diseno, porque ahora las versiones disponibles son las que tienen foto. Las paletas de tres colores usan un swatch de tres franjas horizontales (`.oda-swatch.is-trio`). El ano opcional de DL-018 no cambia. "Mujer argentina" sigue igual, con sus fotos a nivel diseno.
Consequences: Para sumar otra combinacion alcanza con agregar una paleta con `fotos` en `DISENOS`. El mensaje de WhatsApp ahora dice "Diseño: Frida en trazo".

## DL-020 - Objetos de autor: nombre y precio primero, menos texto (2026-11-15)
Status: accepted; implemented, sin commitear (pedido de Valentin: pasada de QA y /unslop sobre /objetos-de-autor)
Context: En 390 px el nombre y el precio de la remera pintada aparecian recien a ~1.5 pantallas, despues de las pestanas y la foto. La seccion tenia un titular de marca, dos parrafos, tres vinietas y el precio antes de las opciones. La remera estampada repetia "Hecha en Argentina" tres veces y decia los colores dos veces. La taza ocupaba 855 px. La pagina media 5557 px.
Decision: Cada producto abre con un encabezado corto (nombre y precio) antes de las fotos; en desktop va a la derecha, arriba del pedido (grid-template-areas). La remera pintada se llama "Remera pintada a mano" con el rotulo "Pieza única"; se saco el titular "El alma de la pintura, en tu ropa" y el texto queda en una frase y dos vinietas. Se saco la vinieta "Vos elegis el diseno y la paleta" (lo dicen los controles) y la pista "diseno X" de Paleta. La estampada se llama "Remera estampada", con una sola vinieta; se saco el enlace "¿Querés una que sea solo tuya?". La taza es una tarjeta con la foto al costado y los botones abajo; se saco "Diseño 01". El rotulo "Nuevo" de la pestana de Frida queda solo para lectores de pantalla porque no entraba al lado del nombre (la pagina ya dice "Nuevo" arriba). La pagina pasa a 4634 px.
Consequences: Precios, mensajes de WhatsApp y rutas no cambiaron. El titular de marca que DL-017 habia conservado ya no esta; si Ani lo quiere, puede volver como subtitulo.

## DL-021 - Agendas: precio arriba, menos texto y menos botones repetidos (2026-11-15)
Status: accepted; implemented, sin commitear (pedido de Valentin: misma pasada de QA y /unslop que DL-020, sobre /agendas)
Context: En 390 px el hero media 1167 px: tres lineas de bajada, dos botones apilados, la promo, el enlace a Instagram y recien despues las fotos. No se veia ningun precio hasta la tercera pantalla. "Páginas llenas de arte" estaba en la bajada y como titulo de seccion. La promo aparecia dos veces. Las tarjetas cerraban con una frase de relleno ("pequeña obra de arte que te acompaña"). La primera tarjeta se llamaba "Tapa y contratapa duras" pero hablaba del anillo. La pagina tenia cinco enlaces al armado y las ocho tapas ocupaban 1522 px en el telefono.
Decision: El hero queda en titulo, una linea de bajada ("Elegí la tapa, el papel y el nombre. Yo me ocupo del resto."), "Desde $16.900" (el minimo de los precios, calculado de la config) y los dos botones lado a lado; la foto entra en la primera pantalla. La promo queda solo en la lista de precios y el enlace a Instagram pasa debajo de las tapas. La seccion de tarjetas se llama "Qué trae cada una", las tarjetas son mas bajas, la ultima es solo titulo y la voz pasa a primera persona ("Frases y relatos míos"). Se saco la frase de cierre. En el telefono se ven 4 tapas (desde 640 px, las 8) y se saco el boton repetido del encabezado de tapas. Los botones dicen "Armar mi tapa"; el cierre dice "Armar mi pedido" para no partirse en dos lineas.
Consequences: La pagina pasa de 5468 a 4495 px en 390 px. Precios, rutas y el armador no cambiaron. Si cambia el precio mas barato, el "Desde" se actualiza solo.

## DL-022 - Inicio: las obras primero y sin scroll infinito (2026-11-15)
Status: accepted; implemented, sin commitear (pedido de Valentin: misma pasada de QA y /unslop que DL-020 y DL-021, sobre la home)
Context: Despues del hero la home seguia con dos bloques sobre Ani ("Quién soy" y "Mis pasiones", ~1250 px en 390 px), las agendas y Objetos de autor, y recien en la cuarta seccion aparecian las obras. La galeria tenia scroll infinito sobre 64 cuadros: cada vez que alguien llegaba al final se cargaban 8 mas, asi que "Soñadora compulsiva", la promo y el footer se alejaban (medido en 390 px: la pagina pasaba de ~5.750 a 13.046 px al bajar hasta el final). "Mis pasiones" era una frase y cuatro chips que la repetian. "Soñadora compulsiva" cerraba con una frase generica ("Trabajo todos los días para cumplir mis metas...").
Decision: Orden nuevo: hero, "Mis obras", Objetos de autor, Agendas, "Quién soy", "Soñadora compulsiva". La galeria muestra una muestra fija (8 en el telefono, 9 en tablet, 12 en desktop: filas completas) y termina con el boton "Ver todas las obras" a /obras-en-stock; se saco el scroll infinito y el enlace del encabezado. "Mis pasiones" se une a "Quién soy" en una frase ("Me apasionan la pintura, la docencia y la música.") y se saca su bloque (la foto aniSection7.jpg queda en el repo, sin usar). El rotulo "01 · Mi historia" pasa a "Mi historia". Se saco la frase generica de "Soñadora compulsiva". El teaser de Objetos de autor deja el "Mi obra, fuera del lienzo:" y su alt deja de decir "pan de oro". Se borro el CSS que quedo sin uso (chips, bloques invertidos y tenidos, sentinel, enlace de la galeria, `.father-paintingsSection`).
Consequences: La home queda fija en ~5.850 px en 390 px, con todas las imagenes cargadas, y el footer siempre a la misma distancia. Quien quiere ver mas obras va al catalogo, que tiene filtros. Rutas, precios y mensajes no cambiaron.

## DL-023 - Obras: disponibles primero, dos columnas y las vendidas llevan al encargo (2026-11-15)
Status: accepted; implemented, sin commitear (pedido de Valentin: misma pasada de QA y /unslop, sobre /obras-en-stock)
Context: 22 de las 29 obras estan vendidas y en "Destacadas" aparecian en el orden de la lista, asi que la primera tarjeta decia "Vendida". En 390 px habia una tarjeta por fila de ~640 px y la pagina media 21.716 px. El boton "Consultar" de una obra vendida mandaba a WhatsApp a preguntar el precio de algo que no se puede comprar. La descripcion repetia en casi todas las tarjetas "Cuadro en acrílico sobre bastidor de madera.", que ya dice la linea de tecnica. El titulo usaba el banner violeta viejo (`.titleBg`), distinto del resto de las paginas, y "Encargar a medida" aparecia tres veces.
Decision: "Destacadas" ordena primero las disponibles y despues las vendidas, cada grupo en el orden de la lista (los otros ordenes no cambian). En el telefono la grilla pasa a dos columnas con tarjetas compactas (nombre arriba, medida debajo); desde 640 px vuelve el tamano anterior. La tarjeta muestra solo lo propio de cada obra (`details`, derivado en `enrich`: se saca la primera frase de material y el diametro, que ya estan en la tarjeta); la busqueda sigue usando la descripcion completa. Se saco el "Ver más" porque ningun detalle pasa de 70 caracteres. Las vendidas cambian "Consultar" por "Pedí una parecida", un enlace a /obra-personalizada; las disponibles siguen con el mismo mensaje de WhatsApp. El encabezado sigue el patron de Agendas, Láminas y Libros: "Pintadas a mano", "Obras" y una linea ("Consultá por WhatsApp la que te guste. Si ya está vendida, te pinto una a tu medida."). Se saco el enlace "Encargar a medida" de la barra de filtros (quedan la bajada y la tarjeta del final). Se borraron `pagesStyles/paintings.css` (clases sin uso y una regla global `h1 { text-align: center }` que se filtraba a otras paginas despues de visitar esta) y `.titleBg`.
Consequences: La pagina pasa a 7.983 px en 390 px. Rutas, precios y el mensaje de WhatsApp no cambiaron; el mensaje tiene errores ("interesado", "gustaria", la coma despues de "Hola!") que conviene corregir aparte, con el visto bueno de Ani.

## DL-024 - Sobre mí: cambios minimos, sin tocar la voz de Ani (2026-11-15)
Status: accepted; implemented, sin commitear (pedido de Valentin: misma pasada de QA y /unslop, sobre /sobre-mi)
Context: La pagina ya tenia buena estructura (hero con nombre, numeros, estilo, trayectoria, historia en dos relatos con "Leer más" y cierre con dos botones) y media 5.422 px en 390 px. Los relatos son la voz de Ani y DL-017 decidio no reescribirlos. Dos problemas concretos: el "Leer más" de "Familia" repetia casi palabra por palabra el deseo de "Deseos" ("que mis mujeres y relatos traspasen fronteras antes de que mi piel se arrugue demasiado"), que ademas ya esta en la cita del hero; y en el telefono cada foto vertical de los relatos (9:16) media ~620 px, casi una pantalla, antes del titulo del relato.
Decision: Se saco ese parrafo repetido de "Familia" (el deseo queda en la cita del hero y en "Deseos"). En el telefono las fotos de los relatos se muestran en 4:5 con `object-fit: cover`, encuadradas en Ani (no son obras; desde 960 px se ven enteras, como antes). El boton del cierre pasa de "Ver obras en stock" a "Ver obras", como el titulo nuevo de esa pagina (DL-023). El resto del texto no se toco.
Consequences: La pagina pasa a 5.110 px en 390 px. Conviene que Ani confirme el parrafo sacado.

