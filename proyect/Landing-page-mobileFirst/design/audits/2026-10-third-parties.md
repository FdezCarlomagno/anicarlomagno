# Cookies, almacenamiento y terceros — Fase 0 (2026-10-11)

Insumo para la **Fase 2 (legales y cookies)**. Leyenda: **[medido]** / **[inferido]**.

## Respuesta corta

**Hoy el sitio no guarda ninguna cookie, ni esenciales ni no esenciales** [medido]. Tampoco usa `localStorage`, `sessionStorage`,
IndexedDB, Cache Storage ni service workers, y no hay analítica ni píxeles de seguimiento.

Pero **sí comparte datos técnicos con terceros** (IP, user-agent, página de origen) [inferido del funcionamiento de HTTP]:

- **Google Fonts** en **todas** las rutas, al cargar.
- **Google Maps** (iframe embebido) en **`/contacto`**, al cargar y sin hacer scroll: 26 peticiones a dominios de Google.
- **EmailJS** solo cuando alguien envía el formulario de contacto (con nombre, apellido, email y mensaje).
- **WhatsApp** (`api.whatsapp.com`) solo cuando el usuario toca un botón de compra o contacto, y se abre en una pestaña nueva.

Para la Fase 2: hoy no hace falta un banner de consentimiento de cookies por cookies propias. Igual conviene explicar en la política
de privacidad el uso de Google Fonts, Google Maps, EmailJS y WhatsApp (o eliminar esas transferencias: fuentes autoalojadas, mapa con
"clic para cargar"). La decisión legal es del usuario y su asesor; esto es solo el insumo técnico.

## Método

- Scripts: `design/tools/third-parties.mjs` (10 rutas) y `design/tools/contact-iframe.mjs` (detalle del iframe de Maps). Datos crudos:
  `raw/third-parties.json` y `raw/contact-iframe.json`.
- Chrome 154 headless con **perfil limpio y contexto aislado por ruta** (sin sesiones previas), viewport 390 px, build de producción en
  `localhost:4173`.
- Por ruta: carga → espera de red inactiva → lectura de cookies (`Storage.getCookies`, incluye cookies de terceros e iframes),
  `document.cookie`, `localStorage`, `sessionStorage`, IndexedDB, Cache Storage y service workers → scroll completo → segunda lectura.
  Se registraron todos los headers `Set-Cookie` de las respuestas.
- `/contacto` se midió también con *auto-attach* a iframes de otro origen, porque el iframe de Maps corre en otro proceso y sus
  peticiones no aparecen en la página principal.
- EmailJS se midió en los flujos críticos (`raw/critical-flows*.json`), interceptando la petición dentro del navegador: **nunca salió
  un email real**.

## Por ruta [medido]

| Ruta | Terceros al cargar | Peticiones a terceros | Tras scroll | Cookies | Storage |
|---|---|---|---|---|---|
| `/` | fonts.googleapis.com (CSS), fonts.gstatic.com (2 woff2) | 3 de 30 | sin cambios | 0 | vacío |
| `/elegir` | ídem | 3 de 8 | sin cambios | 0 | vacío |
| `/obras-en-stock` | ídem | 3 de 30 | sin cambios | 0 | vacío |
| `/obra-personalizada` | ídem | 3 de 8 | sin cambios | 0 | vacío |
| `/agendas` | ídem | 3 de 17 | sin cambios | 0 | vacío |
| `/agenda-personalizada` | ídem | 3 de 21 | sin cambios | 0 | vacío |
| `/mi-libro` | ídem | 3 de 10 | sin cambios | 0 | vacío |
| `/laminas` | ídem | 3 de 8 | sin cambios | 0 | vacío |
| `/sobre-mi` | ídem (3 woff2) | 4 de 13 | sin cambios | 0 | vacío |
| `/contacto` | Fonts + **Google Maps** | ver detalle | sin cambios | 0 | vacío* |

\* Storage de la página principal. El `localStorage` interno del iframe de Google (otro origen) **no se midió**.
Ninguna ruta falló la medición (`failed: []`).

### Detalle de `/contacto` (Google Maps) [medido]

El iframe tiene `loading="lazy"` (`src/components/contact/GoogleMap.jsx`), pero igual se carga al entrar, sin scroll, porque está
cerca del viewport.

| Origen → dominio | Peticiones | Tipo | Primer request (ms desde la navegación) |
|---|---|---|---|
| página → `www.google.com` (`/maps/embed`) | 1 | Document | 402 |
| iframe → `maps.gstatic.com` | 1 | Script | 694 |
| iframe → `maps.googleapis.com` | 17 | Script, XHR, Image, Other | 695 |
| iframe → `www.google.com` | 3 | Image, XHR | 1.301 |
| iframe → `fonts.googleapis.com` | 2 | Stylesheet | 1.735 |
| iframe → `fonts.gstatic.com` | 2 | Font | 1.872 |

Total: **26 peticiones a Google** desde el iframe y su documento, más las 3 de Google Fonts de la página. Cookies: ninguna, ni
`Set-Cookie` en las respuestas, durante toda la sesión (perfil limpio).

### EmailJS (formulario de `/contacto`) [medido]

- Dominio: `api.emailjs.com` (`POST /api/v1.0/email/send`, con preflight `OPTIONS`).
- Cuándo: **solo al enviar** un formulario válido. Con campos vacíos o email inválido hubo 0 peticiones.
- Qué se envía: `lib_version`, `user_id` (clave pública), `service_id`, `template_id` y `template_params` = `nombre`, `apellido`,
  `email`, `mensaje`.
- No guarda cookies ni storage en el navegador.

### WhatsApp [medido]

- `window.open('https://api.whatsapp.com/send?phone=542494245966&text=…', '_blank')` desde 7 botones activos (agenda, "Consultar" obra,
  obra personalizada, lámina, 2 libros, botón flotante). Solo al tocar un botón.
- Hay 2 plantillas más en el código que hoy no se ejecutan: `src/components/customAgenda.jsx:18-35` (`handleEncargue` se pasa como
  `onSave`, pero `AgendaForm` no recibe props) y `src/components/PaintingInfo.jsx:15` (importado en `LandingPage.jsx:10` sin ruta).
- En la medición se bloqueó la apertura y la red hacia `*whatsapp.com*` / `*wa.me*`: no se abrió ningún chat real.
- Los enlaces de redes (Instagram, TikTok, Facebook) son links normales; no cargan nada hasta que se tocan.

## Lo que no se pudo medir

- **Usuarios con sesión de Google iniciada** [inferido]: si el navegador tiene cookies de `google.com` y permite cookies de terceros,
  el iframe de Maps puede enviarlas y Google podría asociar la visita a la cuenta. El perfil limpio no lo puede mostrar.
- **Otros navegadores** (Safari/iOS, Firefox, navegador in-app de Instagram), cada uno con sus propias políticas de cookies de terceros.
- **Producción** (`anicarlomagno.vercel.app`): no se midió por regla de la fase. Vercel podría agregar headers propios; el código no
  agrega scripts de terceros extra en producción (no hay Vercel Analytics ni Speed Insights en `package.json` ni en `src/`) [medido en el código].
- **`localStorage`/IndexedDB internos del iframe de Google.**
