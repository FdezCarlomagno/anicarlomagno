# Fase 4c: recomendación entre C1 (oscura) y C2 (clara)

**No vimos los prototipos.** No se sacaron capturas. Todo lo de abajo sale de mediciones del DOM, de estilos calculados,
de contraste numérico y de la revisión de código del `ux-a11y-reviewer`. La elección es de Valentín y Ani, mirándolos
en el celular.

## Cómo verlos

- Preview de Vercel de la rama `fase-4c-inmersiva` (cuando se pushee): `/prototipos/4c/index.html`.
- En local: `npm run dev -- --host` y `http://localhost:5173/prototipos/4c/index.html` (o con la IP de la red en el celular).
- `public/prototipos/` es público, lleva `noindex` y **no se mergea a `main`**.

## Qué prueban

Las dos páginas son idénticas en contenido, estructura y escala. **Solo cambia el "muro"**, el fondo que va detrás de cada obra:

- **C1, oscura:** muro de tinta (`--color-ink`). El resto de la página, claro.
- **C2, clara:** muro aliceblue (`--color-surface`). Sin sumar la tinta como color de fondo.

A diferencia de lo que se evaluó en la 4b, aquí el texto **nunca** va sobre el muro ni sobre la obra: título, cartela y
botones viven en lienzos claros. Por eso el contraste y el foco no dependen de qué muro se elija.

## Resultados medidos (iguales en las dos)

| Criterio | C1 | C2 |
|---|---|---|
| Overflow horizontal en 360, 390, 430, 768 y 1280 px | no | no |
| Un solo h1 | sí | sí |
| Texto < 16 px / objetivos < 44 px | 0 / 0 | 0 / 0 |
| Contraste mínimo de texto (AA) | 5,23 (piso de la barra del prototipo) | 5,23 |
| Fallas de contraste / texto sobre el muro | 0 / 0 | 0 / 0 |
| Obras deformadas o con texto encima | 0 | 0 |
| Obra visible entera en el hero (360 a 1280 px) | 100 % | 100 % |
| h1 y botón en la primera pantalla | sí, en los 5 anchos | sí, en los 5 anchos |
| Altura de la página en 390 px | 6641 px | 6668 px |
| Transferencia a la carga / total | 2118 KB / 5110 KB | 2118 KB / 5109 KB |
| Menú: foco a "Cerrar", Esc devuelve el foco a "Menú", fondo `inert` | sí | sí |
| `prefers-reduced-motion`: elementos animados / contenido en espera | 0 / 0 | 0 / 0 |
| Animación de entrada | transición de 300 ms (no atada al scroll) | igual |

Dos aclaraciones:

1. **Movimiento.** La entrada de las obras es una transición de **300 ms** disparada con `IntersectionObserver`, no una
   animación atada al scroll. Eso resuelve el punto abierto de DL-013: queda dentro del rango de 150 a 300 ms de DL-009.
   Con `prefers-reduced-motion` o sin JavaScript todo se ve de entrada.
2. **Primera medición de C2.** El primer informe de C2 mostraba el h1 y el botón bajo el pliegue. Era una medición
   desactualizada (se corrió antes de mover la nota del prototipo al final de la página). Se volvió a medir y C2 da lo
   mismo que C1.

## Revisión independiente (`ux-a11y-reviewer`): Aprobar con seguimientos

Sin bloqueantes para un prototipo de revisión. Lo que se corrigió: el skip-link ahora queda `inert` con el menú abierto y
el menú abierto por `#menu` pide el foco para "Cerrar" en el siguiente cuadro. Esto último **no se pudo confirmar** en la
re-medición (el foco seguía en `body` justo al cargar); revisarlo al llevar el menú a producción, idealmente con
`<dialog>` y `showModal()`.

Seguimientos antes de producción:

1. Las 9 obras suman unos 5 MB y la del hero (Aurora, 1,5 MB) se dibuja a 324 px: sin `srcset` ni formatos modernos. Es la Fase 5.
2. Los tokens propios del prototipo (`--text-escena`, `--text-firma`, `--reserva-hero`, `--barra`) tienen que pasar a `tokens.css` o `DESIGN.md`.
3. El `alt` empieza con el título y la `figcaption` lo repite: en producción quitar el título del `alt` donde hay cartela.
4. El botón flotante de WhatsApp tapa texto de forma transitoria al hacer scroll (en 18 de 32 posiciones a 360 px) y pasa por encima de obras. Ningún objetivo táctil queda tapado y al final de la página no tapa nada.
5. La opacidad de entrada (30 %) debería aplicarse a la obra y no a la cartela, que mientras espera queda bajo el contraste mínimo durante 300 ms.

## Recomendación

**Recomiendo C1 (oscura) si al mirarla en el celular las obras "saltan" más que en C2. Si no se nota la diferencia,
C2 (clara).**

Eso no se puede decidir con números, y por eso dejo la regla en lugar de elegir por ustedes. Lo que sí dicen los datos:

- Las dos son técnicamente equivalentes: mismo contraste, mismo peso, misma estructura y mismo movimiento.
- **C2 es la opción más barata de sostener.** No agrega la tinta como rol de fondo, así que no hay que duplicar estados
  (foco, enlaces, botones) en cada componente de las fases 6 a 10. Este era el costo principal de elegir la C en DL-013.
- **C1 es la opción más expresiva** y la que la dirección C original proponía: el color saturado de la obra se suele ver
  más intenso sobre oscuro. Como acá el texto nunca va sobre el muro, el costo técnico es menor que el que se
  anticipaba en DL-013.
- **El punto a mirar es la etapa naif.** En "Mi recorrido" las obras de la primera etapa son más claras. Si sobre el muro
  oscuro se ven apagadas o duras, C2 es la elección segura.
- La **A (galería silenciosa)** sigue como plan B si ninguna de las dos funciona en el celular.

## Cómo se decide

1. Abrir `/prototipos/4c/c1-oscura.html` y `/prototipos/4c/c2-clara.html` en el celular, en este orden: portada,
   "Mi recorrido" y la tarjeta de obra.
2. Mirar en particular cómo quedan las obras de la primera etapa sobre cada muro.
3. Decir cuál. Se actualiza DL-013 con la variante elegida y se ajusta `DESIGN.md`.
