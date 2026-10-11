# Flujos críticos — checklist "no romper" — Fase 0 (2026-10-11)

Esta es la **red de seguridad** para todas las fases siguientes: antes de mergear cualquier PR que toque estos flujos, repetir la
checklist y comparar los mensajes con los de referencia (deben coincidir carácter por carácter salvo cambio aprobado).

Leyenda: **[medido]** / **[inferido]**. ✅ funciona como hoy se espera · ⚠️ funciona pero con un problema · ❌ defecto.

## Cómo se probó (sin enviar nada real)

- `design/tools/flows.mjs` sobre el build de producción (`localhost:4173`), Chrome 154 headless, 390 px. Datos crudos:
  `raw/critical-flows.json`, `raw/critical-flows-exito.json` y `raw/critical-flows-obra-personalizada.json` (corrida con el caso
  "foto destildada").
- `window.open` reemplazado antes de cargar la página: registra la URL y **devuelve `null`** (como un popup bloqueado). Además se
  bloqueó la red hacia `*whatsapp.com*` y `*wa.me*`. **No se abrió ningún chat real.**
- EmailJS interceptado dentro del navegador (DevTools `Fetch`): la petición nunca salió; se simuló una respuesta de error y otra de éxito.
  **No se envió ningún email real.**
- Teléfono en todos los mensajes: `542494245966`, host `api.whatsapp.com`, destino `_blank` [medido en los 11 mensajes].
- Nota: en `raw/critical-flows.json` el caso "contacto-emailjs-exito-simulado" es una primera corrida inválida (faltaban headers CORS
  en la simulación). El resultado válido está en `raw/critical-flows-exito.json`.

---

## 1. Encargo de agenda (`/agenda-personalizada`)

Precios de referencia (`src/components/config/AgendaPrices.js`): perpetua 25900 · docente 25900 · semanal 23900 · cuaderno 16900 ·
cuaderno A4 35900 · frase +3000 (**el código la cobra, pero la regla de negocio es que la frase es gratis**, decisión del 2026-10-11: los totales con frase de este informe reflejan el comportamiento actual, no el correcto).

| Paso | Resultado observado |
|---|---|
| Estado inicial | ✅ Botón "🛒 Encargar pedido" deshabilitado, total "$0" |
| Al elegir tipo y papel | ✅ El total se actualiza al instante; el botón sigue deshabilitado hasta elegir la obra de fondo |
| Al enviar | ✅ "⏳ Procesando..." + aviso "⏳ Preparando tu pedido..." y se llama a `window.open` |
| ~2 s después | ⚠️ Aviso "✅ ¡Pedido enviado!", sonido y **reset completo** del formulario, **aunque `window.open` devolvió `null`** (popup bloqueado). El código no revisa el resultado (`AgendaForm.jsx:250-278`) |
| Nombre de 2 letras ("Jo") | ✅ Error en línea "El nombre debe tener entre 3 y 12 caracteres"; el envío lo frena `minLength` nativo. ⚠️ Sin `aria-invalid` ni `aria-describedby` |
| Aviso (toast) propio | ⚠️ Sin `role="status"` / `aria-live` → no lo anuncia un lector de pantalla |
| Vista previa | ⚠️ El `alt` de la imagen es la ruta del archivo (p. ej. `/assets/Bahia-CY0C2V4F.jpeg`) (`AgendaPreview.jsx:26`) |
| Elegir obra con teclado | ❌ Las miniaturas son `<div onClick>` sin foco ni rol (`DropDownImgs.jsx:18`); con teclado no se puede elegir la obra, que es obligatoria |

### Combinación 1 — Agenda perpetua, papel blanco, "Femme d'eau", sin extras → **$25900** ✅

```text
¡Hola! Me gustaría encargar:

📋 *Tipo:* AGENDA PERPETUA
📄 *Papel:* Blanco 80g
🎨 *Obra:* Femme d'eau

💰 *Total: $25900*
```

### Combinación 2 — Agenda semanal, papel natural, "Creación", nombre "María" (#8a2be2, arriba derecha), frase "Creer es crear" → **$26900** (23900 + 3000) ✅

```text
¡Hola! Me gustaría encargar:

📋 *Tipo:* AGENDA SEMANAL
📄 *Papel:* Natural 80g
🎨 *Obra:* Creación
✏️ *Nombre:* María
🎨 *Color nombre:* #8a2be2
📍 *Ubicación:* arriba derecha
💭 *Frase:* Creer es crear

💰 *Total: $26900*
```

### Combinación 3 — Cuaderno A4, papel blanco, "Bahía", nombre "Sol" (abajo izquierda), comentario "Es para regalo" → **$35900** ✅

```text
¡Hola! Me gustaría encargar:

📋 *Tipo:* CUADERNO A4
📄 *Papel:* Blanco 80g
🎨 *Obra:* Bahía
✏️ *Nombre:* Sol
🎨 *Color nombre:* #000000
📍 *Ubicación:* abajo izquierda
💬 *Comentarios:* Es para regalo

💰 *Total: $35900*
```

### Caso borde — frase tildada, escrita y luego destildada → ⚠️ defecto menor (P2)

> **Resuelto el 2026-10-11 (DL-003):** tras el arreglo, con la frase tildada el total queda igual al precio base (cuaderno $16900, agenda semanal con nombre y frase $23900) y al destildar la casilla la frase no se envía. Verificado con `design/tools/flows.mjs` sobre el build.
>
> Actualización 2026-10-11: la frase no debe tener costo, así que "se envía sin cobrarse" deja de ser un problema de precio. Queda solo que el texto se envíe aunque la casilla esté destildada. El problema de precio real es el contrario: hoy se cobra +$3000 al tildarla.

Cuaderno, papel blanco, "La Dama Dorada". Con la casilla de frase tildada el total pasa a $19900; al destildarla vuelve a $16900,
pero **el texto de la frase queda en el estado y se envía igual, sin cobrarse**:

```text
¡Hola! Me gustaría encargar:

📋 *Tipo:* CUADERNO
📄 *Papel:* Blanco 80g
🎨 *Obra:* La Dama Dorada
💭 *Frase:* Frase que no debería cobrarse

💰 *Total: $16900*
```

Causa (código): el precio usa la casilla (`AgendaForm.jsx:144-147`, `127-129`), pero el mensaje usa `formData.quote` (`AgendaForm.jsx:204-206`).
Arreglarlo **cambia el mensaje de WhatsApp** → requiere aprobación explícita.

## 2. "Consultar" una obra (`/obras-en-stock`)

| Paso | Resultado observado |
|---|---|
| Catálogo | ✅ 22 obras; 16 con "VENDIDO" y 2 con "40% OFF" |
| Filtros | ✅ "Disponibles" muestra 6 y "Vendidas" 16. ⚠️ Sin `aria-pressed` (no se anuncia cuál está activo) |
| Obras vendidas | ⚠️ Las 16 vendidas siguen mostrando "Consultar" (puede ser intencional: confirmar con Ani) |
| Botón "Consultar" | ✅ Abre WhatsApp con el mensaje de abajo. ⚠️ Mide 83×34 px (< 44 px) |

```text
Hola!, estoy interesado en Femme d'eau, me gustaria saber el precio de esta obra, Ani.
```

## 3. Obra personalizada (`/obra-personalizada`)

| Paso | Resultado observado |
|---|---|
| Inicial | ✅ Botón deshabilitado con el texto "Completá los campos requeridos" |
| Medida < 10 cm | ✅ Error "Mínimo 10cm" y botón deshabilitado. ⚠️ Sin `aria-invalid`/`aria-describedby`/rol de alerta |
| Formulario válido | ✅ Botón "Pedir presupuesto" habilitado; abre WhatsApp |
| Después de enviar | ✅ Conserva los datos (si el popup falla, no se pierde nada). ⚠️ No hay confirmación visible |
| Inputs | ⚠️ `font-size` 14 px → iOS hace zoom al enfocar [inferido del tamaño medido] |

Datos usados: nombre "Lucía", apellido "Pérez", 50 × 70, descripción `Retrato de mi abuela con flores y tonos cálidos`
(**sin punto final**: el punto lo agrega la plantilla).

Con la casilla de foto **tildada**:

```text
Hola! Ani Soy Lucía Pérez. Me gustaría encargarte una obra de estas dimensiones: 50cm X 70cm. Retrato de mi abuela con flores y tonos cálidos. Me gustaría agregar una foto. Muchas gracias!
```

Con la casilla de foto **destildada** (segundo envío del mismo formulario) → ⚠️ doble punto antes de "Muchas gracias!"
(`src/components/customPainting.jsx:134`; plantilla, no cambiar sin aprobación). Medido en `raw/critical-flows-obra-personalizada.json`:

```text
Hola! Ani Soy Lucía Pérez. Me gustaría encargarte una obra de estas dimensiones: 50cm X 70cm. Retrato de mi abuela con flores y tonos cálidos. . Muchas gracias!
```

## 4. Contacto (`/contacto`, EmailJS) — sin enviar emails reales

| Paso | Resultado observado |
|---|---|
| Envío vacío | ✅ Validación nativa en "nombre" ("Please fill out this field." en un Chrome en inglés); **0** peticiones a EmailJS |
| Email inválido (`prueba@`) | ✅ Validación nativa en "email"; 0 peticiones |
| Durante el envío | ✅ Botón "Enviando..." deshabilitado |
| Éxito simulado | ✅ Toast "¡Mensaje enviado con éxito!" (react-hot-toast, con `role="status"`) y formulario vacío |
| Error simulado | ❌ Toast "Error al enviar el mensaje. Inténtalo de nuevo." **y el formulario se vacía igual**: la persona pierde su mensaje (`ContactForm.jsx:52-59`, el reset está en `finally`) |
| Etiquetas | ✅ `<label for>` en los 4 campos ("Nombre:", "Apellido:", "Email:", "Mensaje:") |
| Autocompletado | ⚠️ Sin `autocomplete` en nombre, apellido ni email |
| Datos enviados | `template_params` = `nombre`, `apellido`, `email`, `mensaje` (sin cambios a EmailJS) |

## 5. Botón flotante de WhatsApp (todas las rutas)

| Aspecto | Resultado observado |
|---|---|
| Elemento | ❌ `<div onClick>` sin rol, sin nombre accesible y con la imagen sin `alt` (`WhatsappIcon.jsx:13-15`) |
| Teclado | ❌ No es alcanzable: no apareció en 60 pulsaciones de Tab en Home |
| Tamaño y posición | ✅ 50×50 px, fijo abajo a la izquierda (x 15, y 779 a 390×844) |
| Solapamiento | ⚠️ Tapa texto a 390 px: en `design/baseline/menu-abierto-390.png` (captura de viewport) cubre parte del párrafo "Quién soy" de Home |
| Mensaje | ✅ (texto de abajo) |

```text
Hola Ani, Fui redireccionado/a de tu pagina web hacia tu contacto, como estas?
```

## 6. Lámina (`/laminas`)

| Paso | Resultado observado |
|---|---|
| Precio | ⚠️ "$6900", escrito a mano en `Laminas.jsx:11` (no viene de `src/components/config/`) |
| Desplegable | ⚠️ Botón "▼" sin nombre accesible; 30×33 px |
| Elegir lámina | ❌ Mismo componente `DropDownImgs` (`<div onClick>`): con teclado no se puede elegir y el botón de compra solo aparece después de elegir. `alt` = "Cuadro 1…6" (no dice qué obra es) |
| Elegida | ✅ "Lámina elegida: Femme d'eau" y botón "Comprar lámina de Femme d'eau" |

```text
Hola! Ani, me gustaría encargarte una lámina de Femme d'eau. Muchas gracias!
```

## 7. Libros (`/mi-libro`)

✅ Ambos libros muestran "$25900" (de `LibrosPrice.js`). ⚠️ Cada "COMPRAR" está dentro de un `<h2 onClick>` (`personalBook.jsx:69-84`), lo que da dos objetivos anidados.

```text
Hola! Ani, me gustaría encargarte tu Libro de relatos. Muchas gracias!
```

```text
Hola! Ani, me gustaría encargarte tu Libro para colorear. Muchas gracias!
```

## 8. Movimiento reducido

❌ Con `prefers-reduced-motion: reduce` emulado (`matchMedia` devuelve `true`), el título de `/elegir` igual anima opacidad 0→1 y
desplazamiento −50 px→0 durante ~500 ms (muestras entre 312 y 823 ms). En `src/` no aparece `MotionConfig`, `useReducedMotion` ni
`prefers-reduced-motion` [medido].

---

## Checklist rápida para cada PR

- [ ] Las 3 combinaciones de agenda generan exactamente los mensajes y totales de arriba.
- [ ] El caso de la frase destildada se comporta igual que hoy, o como se haya aprobado corregirlo.
- [ ] "Consultar" genera el mensaje de referencia con el nombre de la obra.
- [ ] Obra personalizada: validación de mínimo 10 cm y los 2 mensajes de referencia (con y sin foto).
- [ ] Contacto: validación nativa, "Enviando...", toasts de éxito y error; payload de EmailJS con las mismas 4 claves.
- [ ] Botón flotante, lámina y libros: mensajes de referencia.
- [ ] Teléfono `542494245966` en todos los mensajes.
- [ ] Nunca enviar formularios reales ni abrir chats reales en las pruebas.

## No medido

- Comportamiento en dispositivos reales: si iOS Safari o el navegador in-app de Instagram bloquean `window.open`, o si abren la app de
  WhatsApp directamente.
- Recepción real del email (intencionalmente no se envió).
- Lectores de pantalla reales (VoiceOver/TalkBack); los hallazgos de accesibilidad salen del DOM y del recorrido con teclado.
