# Fase 4b: evaluación de las tres direcciones

Prototipos: `a-galeria.html`, `b-editorial.html`, `c-inmersiva.html` (índice en `index.html`). Los tres tienen el mismo
contenido, así que lo que cambia es solo la presentación. Lo marcado como Provisorio lo completa Ani.

**Nadie los vio todavía.** No se sacaron capturas, ni siquiera de los prototipos. Todo lo de abajo sale de mediciones del
DOM, de estilos calculados y de contraste numérico. La revisión visual la hacen Valentín y Ani en el celular, y la elección
es de ellos.

## Cómo se verificó

Con `npm run dev` corriendo (Vite en `http://localhost:5173`), Chrome headless por CDP (`design/tools/cdp.mjs`):

| Comando | Qué mide | Anchos |
|---|---|---|
| `node design/art-direction/tools/check.mjs` | Overflow, h1, texto < 16 px, objetivos < 44 px, contraste WCAG de cada texto contra su fondo compuesto real, imágenes (alt, width/height, proporción renderizada contra natural, `object-fit`, texto encima), botón flotante tapando contenido, movimiento, menú abierto (foco, Esc, `inert`), `prefers-reduced-motion` emulado y `#menu` | 360, 390, 768, 1280 |
| `node design/tools/dom-facts.mjs "<prototipo>?ruta=" …` | La herramienta del proyecto, con la base apuntando al prototipo (se usan las filas `home`) | 390, 1280 |
| `node design/tools/contrast.mjs` | Pares de referencia del sitio actual | — |

Resultados crudos en `verificacion/raw/` (`check-*.json`, `dom-facts-*.json`, `contrast-base.md`).

## Resultado contra `design-principles.md`

Las tres pasan lo medible en los cuatro anchos:

| Criterio | A | B | C |
|---|---|---|---|
| Overflow horizontal | no | no | no |
| Un solo h1 | sí | sí | sí |
| Texto < 16 px | 0 | 0 | 0 |
| Objetivos < 44 px (menú incluido) | 0 | 0 | 0 |
| Contraste mínimo de texto (AA) | 5.23 | 5.23 | 5.23 |
| Fallas de contraste | 0 | 0 | 0 |
| Texto sobre obra | 0 | 0 | 0 |
| Obra deformada o recortada (diferencia de proporción) | 0 % | 0 % | 0 % |
| Botón de WhatsApp tapa algo al final de la página | no | no | no |
| Menú: foco a "Cerrar", fondo `inert`, Esc devuelve el foco a "Menú" | sí | sí | sí |
| Elementos animados con `prefers-reduced-motion: reduce` | 0 | 0 | 0 |
| Pesos de Raleway | 400 / 600 / 700 | 400 / 600 / 700 | 400 / 600 / 700 |

El 5.23 es el mismo en las tres: es el enlace violeta de la barra gris del prototipo, que no forma parte del diseño. Sin
esa barra, el mínimo es 5.74 en A (gris 600 sobre blanco), 5.35 en B (gris 600 sobre aliceblue) y 5.55 en C (acento
sobre aliceblue).

**Ancho de la obra en un celular de 390 px** (lo que mide el principio 1):

| | Hero | Serie | Tarjeta | Recorrido |
|---|---|---|---|---|
| A | 390 px, a sangre | 390 px | 390 px | 191 px (dos columnas) |
| B | 328 px (corrida a la derecha) | 273 a 328 px | 350 px | 156 px |
| C | 390 px sobre fondo oscuro | 390 px sobre fondo oscuro | 350 px sobre paspartú oscuro | 183 px |

### Pares de contraste por dirección (de `check-*.json`, 390 px)

- **A:** tinta sobre blanco 15.52 · gris 700 sobre blanco 9.74 · gris 600 sobre blanco 5.74 (cartelas) · acento sobre blanco 5.96 · tinta sobre aliceblue 14.47 · blanco sobre acento 5.96 (botones).
- **B:** lo mismo, más tinta sobre aliceblue 14.47 en la serie, gris 600 sobre aliceblue 5.35 y acento sobre aliceblue 5.55.
- **C:** blanco sobre tinta 15.52 (hero, serie, menú, pie) · gris 300 sobre tinta 9.67 (cartelas en oscuro) · tinta sobre blanco 15.52 · tinta sobre aliceblue 14.47 · acento sobre aliceblue 5.55. El acento sobre tinta da **2.61**, por eso C nunca lo usa en las zonas oscuras y ahí los anillos de foco son blancos (15.52).
- **Botón flotante de WhatsApp (las tres):** glifo tinta sobre el verde, **7.83**. El sitio actual tiene el glifo blanco sobre ese verde: **1.98**, que no llega al 3:1 que se pide a un ícono que identifica un control. El borde del botón (verde sobre blanco, 1.98) no es lo que lo identifica, el glifo sí.

## Crítica de diseño (por escrito, sin capturas)

Se evalúa estructura, jerarquía y coherencia con los principios a partir del HTML/CSS y de las medidas. No hay juicio
sobre cómo se ve, porque nadie la vio.

### A. Galería silenciosa

**Qué propone.** Fondo blanco, obra a lo ancho de la pantalla y una cartela de museo debajo de cada obra (título, técnica,
medida). Toda la tipografía es Raleway; Dancing Script queda solo en el logo del encabezado. El h1 es texto
("Ani Carlomagno, artista plástica en Tandil"), lo que además ayuda al SEO. Banda aliceblue para el pedido por
WhatsApp, pie claro.

- **Escala que usa (para DL-007):** 16 / 18 / 20 / 24 px y el logo en 28 px. Es la más corta de las tres y entra completa en la propuesta de DL-007.
- **Acento:** botones y enlaces. Excepción: "artista plástica" del logo en violeta, heredado del sitio actual, es decorativo y contradice el principio 5.
- **Proporciones:** la obra siempre entera, sin radio. En desktop, hero en grilla 7/5 y la serie en tres columnas.
- **Movimiento:** ninguno.
- **Pie:** claro, con lo que el degradé de 1.88:1 desaparece.

**Fuerte.** Es la que más literalmente cumple "la obra es la protagonista": tres de cuatro obras ocupan los 390 px y no
compiten con nada. La cartela pone medida y disponibilidad donde se decide la compra (principio 3). Es la más fácil de
extender al catálogo, las agendas y los formularios, y de mantener por una sola persona (principio 10).

**Débil.** Al sacar la firma del hero, la primera pantalla depende por completo de la obra y del h1 en Raleway: el
riesgo es que se sienta como una plantilla de galería y no como Ani. Hoy el sitio abre con el logo manuscrito grande, y
eso se pierde. La jerarquía es plana a propósito; si en el celular parece fría, el ajuste natural es traer el logo
manuscrito grande de B al hero, sin el resto de B.

### B. Editorial

**Qué propone.** El h1 es la firma "anicarlomagno" en Dancing Script a `clamp(3rem, 14vw, 7rem)` (55 px en 390, 112 px
en 1280), con "artista plástica" en violeta y la cita de Ani como bajada. Capítulos con título manuscrito, obras corridas
a un lado y al otro como en una revista, el recorrido sobre una línea de tiempo con puntos.

- **Escala que usa:** 16 / 18 / 22 / 24 / 32 / 48 px más la firma fluida. Suma dos tamaños fuera de DL-007 (22 px de bajada y 48 px manuscrito; DL-007 propone 40 px para títulos manuscritos).
- **Acento:** botones y enlaces, más "artista plástica" en violeta, decorativo, igual que en A.
- **Proporciones:** la obra entera, pero corrida con márgenes de 16 % y 30 %: en 390 px mide entre 273 y 328 px, y 156 px en el recorrido.
- **Movimiento:** ninguno.
- **Pie:** aliceblue, con firma manuscrita.

**Fuerte.** Es la que más mantiene la voz: la firma manuscrita es el título y aparece como hilo conductor. El ritmo
asimétrico da sensación de publicación cuidada sin agregar color ni sombras.

**Débil.** La asimetría se paga con tamaño de obra justo en el celular, que es donde más se va a ver (principio 1 contra
principio 6: gana el 1). Usa Dancing Script en seis lugares (h1, capítulos, título de cada obra de la serie, título de
la tarjeta, pie y menú): la firma
deja de ser firma y pasa a ser estilo de títulos, y los títulos manuscritos largos se leen peor que Raleway. Es la que más
decisiones nuevas le agrega a DL-007.

### C. Inmersiva

**Qué propone.** El hero es un bloque tinta de alto completo con Piscis centrada y la firma en blanco debajo. Después
alterna escenas: la cita grande sobre blanco, la serie sobre fondo oscuro, la tarjeta con la obra sobre un paspartú oscuro
y los datos sobre blanco, el recorrido sobre aliceblue, el pedido sobre blanco, el pie y el menú oscuros.

- **Escala que usa:** 16 / 18 / 20 / 24 / 28 / 32 px y la firma en 44 px (64 px en desktop). Coincide con DL-007 salvo el 28 px de la cita (36 px en desktop).
- **Acento:** solo en zonas claras (botones, enlaces). En oscuro todo es blanco o gris 300, porque el acento sobre tinta da 2.61.
- **Proporciones:** la obra entera; el hero la limita a `100svh − 16rem` de alto para que entre con la firma (515 px en 390).
- **Movimiento:** la obra del hero aparece con un fundido de 300 ms. Las obras de la serie pasan de 30 % a 100 % de opacidad y suben 2 rem mientras entran en pantalla (`animation-timeline: view()`), solo con `prefers-reduced-motion: no-preference` y donde el navegador lo soporta. El contenido nunca queda oculto: arranca en 30 % y sin soporte se ve normal.
- **Pie:** oscuro con texto blanco y gris 300 (15.52 y 9.67): resuelve el degradé sin otro color.

**Fuerte.** Los colores saturados y el alto contraste de la obra actual se suelen ver más intensos sobre fondo oscuro, como
en una sala con paredes oscuras. La alternancia claro y oscuro le da un ritmo que A no tiene, sin usar la tipografía
para eso.

**Débil.** Agrega un rol nuevo, la tinta como fondo, que no está en `DESIGN.md` y obliga a duplicar estados (foco blanco,
enlaces blancos, botón claro sobre oscuro) en cada componente que caiga en una zona oscura: más trabajo en las fases 6 a 10
y más para mantener. La animación por scroll no tiene duración, va atada al desplazamiento, así que queda fuera del rango
de 150 a 300 ms del principio 7 y habría que aceptarla explícitamente en DL-013 o sacarla. El hero oscuro de pantalla
completa hace la página más larga (6839 px contra 5956 px de A en 390). La obra naif más clara puede quedar menos
favorecida que la actual sobre fondo oscuro; eso solo se sabe mirándola.

## Hallazgos que valen para cualquier dirección

1. **Botón flotante.** No tapa nada al final de la página, pero mientras se scrollea pasa por encima de contenido
   (cartelas, obras, el enlace "Agendas y cuadernos" en 360 px). Es esperable en un botón flotante de 56 px; si molesta en el
   celular, se puede ocultar mientras se ve la banda de WhatsApp.
2. **Glifo del botón de WhatsApp.** En el sitio actual es blanco sobre verde (1.98). Los tres prototipos lo usan tinta
   (7.83). Conviene llevarlo a DL-010, elijan la dirección que elijan.
3. **"artista plástica" en violeta** en A y B es acento decorativo. Si eligen A o B, pasarlo a tinta o gris 600 (como en C,
   que usa gris 300 sobre oscuro).
4. **Peso de las imágenes.** Los prototipos usan los JPEG actuales (entre 0.3 y 1 MB cada uno). No se optimizaron: eso es
   la Fase 5.
5. **Radios.** Las tres usan obra sin radio, botones en píldora y el círculo del botón flotante. Coincide con DL-008.

## Revisión independiente (`ux-a11y-reviewer`)

_Pendiente: se completa con la tabla y el veredicto del revisor._

## Recomendación

**Recomiendo A, Galería silenciosa**, con una condición: que en el celular no se sienta genérica. Si se siente así,
el ajuste es traer la firma manuscrita grande de B al hero de A, y nada más de B.

Por qué A:

- Es la que más obra muestra en el celular (390 px en hero, serie y tarjeta) sin nada encima ni al lado, y el principio 1
  gana sobre los demás.
- Lo premium sale de la presentación (aire, cartela de museo, un solo acento) y no de un recurso nuevo: es justo lo que pide
  la Fase 4b.
- Es la que mejor escala al resto del sitio (catálogo, agendas, formularios) y la más simple de mantener por una persona.
- Encaja completa en DL-007 a DL-009 sin excepciones y resuelve el pie sin degradé.

Por qué no B: achica la obra en el celular para ganar ritmo, y gasta la firma manuscrita en seis lugares.

Por qué no C, aunque es la más distinta: el fondo oscuro probablemente favorece la obra actual, pero agrega un rol de
color y una animación fuera del principio 7, y duplica trabajo en cada fase siguiente. Si al verla en el celular la
diferencia con la obra es grande, es la alternativa a considerar, y lo que habría que decidir en DL-013 es dónde se
permite el fondo oscuro (por ejemplo, solo en el hero y en la serie).

Esta recomendación sale de la estructura y de los principios, no de cómo se ve. La elección es de Valentín y Ani.

## Qué falta para cerrar la Fase 4b

Cuando elijan: DL-013 en `docs/governance/decision-log.md` (escala tipográfica, uso del acento, proporciones de imagen,
movimiento permitido, qué no se hace), ajuste de `DESIGN.md`, y resolución de DL-007 a DL-010 y del degradé del pie.
Queda una ronda de feedback y una de ajustes.
