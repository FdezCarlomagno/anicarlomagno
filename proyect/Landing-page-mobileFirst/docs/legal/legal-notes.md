# Notas legales (Fase 2, 2026-10-11)

Borradores técnicos, no asesoramiento legal. Textos en `src/content/legal/` (`privacidad.jsx`, `terminos.jsx`, datos de
contacto en `contact.js`). Páginas: `/privacidad` y `/terminos`.

## Datos que se recogen y por qué canal

| Dato | Canal | Cuándo |
|---|---|---|
| Nombre, apellido, email, mensaje | Formulario de `/contacto` → EmailJS | Solo al enviar |
| Número, nombre de perfil y lo que se escriba o adjunte | WhatsApp | Solo si se toca un botón de WhatsApp |
| IP, navegador, página visitada | Hosting (Vercel) | Cada visita |

El sitio no usa cookies, `localStorage` ni analítica (medido en `design/audits/2026-10-third-parties.md`).

## Terceros y qué reciben

- **EmailJS:** los 4 campos del formulario, al enviarlo.
- **WhatsApp (Meta):** el mensaje armado y la conversación, al tocar un botón.
- **Google Maps:** datos técnicos y posibles cookies propias, **solo si el usuario toca "Ver mapa"**.
- **Vercel:** datos técnicos de cada visita (hosting).
- **Google Fonts:** ya no; las fuentes se sirven desde `public/fonts/`.
- Instagram, TikTok, Facebook: enlaces normales, nada se carga hasta que se tocan.

## Pendientes

- ~~`[PENDIENTE: email de contacto para privacidad]`~~ **Resuelto el 2026-10-11:** `CONTACT_EMAIL = anicarlomagnopainting@gmail.com` en `src/content/legal/contact.js` (aparece en ambas páginas y en el footer).
- Confirmar con Ani la frase "No uso tus datos para mandarte publicidad ni se los vendo a nadie" (refleja el sitio hoy,
  pero es un compromiso).
- Actualizar `LEGAL_UPDATED` en `contact.js` con la fecha real de publicación.

## Decisiones de alcance (riesgos aceptados)

Por decisión del dueño del proyecto, en esta versión **no** se publica:

- CUIT, domicilio ni condición fiscal.
- Medios de pago, plazos de producción o envío, costos de envío, cambios y devoluciones.
- Derecho de arrepentimiento (Ley 24.240) ni botón de arrepentimiento.
- Leyenda de Defensa del Consumidor.

Los textos tampoco prometen nada sobre esos temas. Es una decisión revisable: conviene repasarla con un profesional
(abogado o contador) cuando el dueño lo considere, junto con la eventual inscripción de la base de datos en la AAIP.
