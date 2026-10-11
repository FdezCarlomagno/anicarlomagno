# Métricas de línea base — Fase 0 (2026-10-11)

Rama `develop`. Build y mediciones sobre el código de `11a9655` (react-router-dom 7.18.4, vite 8.3.4). Durante la sesión
llegaron `3b74af2` y `bf0bcd3`, que solo tocan docs y `engines` de `package.json` (sin cambios en `src/`), así que los números
valen para `bf0bcd3`. Esta fase no modificó código de la app.
Leyenda: **[medido]** = salida de una herramienta en esta sesión · **[inferido]** = deducción desde código o medición indirecta.
Unidades: en este documento **MB = MiB (1.048.576 bytes)** y **KB = KiB (1.024 bytes)**, salvo la salida literal de `vite build`
(kB decimales). Ejemplo: Home = 14.144.360 bytes = 13,49 MiB = 14,1 MB decimales.

> **Línea base visual incompleta.** Solo existen 3 capturas en `design/baseline/`: `home-390.png` (página completa),
> `menu-abierto-390.png` (viewport) y `elegir-390.png` (página completa). Faltan las otras 8 rutas a 390 px y las 10 rutas
> a 1280 px. Se frenó por decisión del usuario; queda pendiente decidir si se completa.

## Entorno de medición

| Ítem | Valor |
|---|---|
| Node / npm | v24.15.0 / 11.12.1 |
| Navegador | Chrome headless 154.0.8037.93 (instalación local), controlado por DevTools Protocol sin dependencias (`design/tools/*.mjs`) |
| Servidor | `npm run dev` (Vite dev, `localhost:5173`) para hechos del DOM; `vite preview` del build de producción (`localhost:4173`) para Lighthouse, peso, terceros y flujos |
| Producción | **No medida** (regla de la fase: solo `localhost`) |

## 1. Build y lint

### `npm run build` — **pasa** [medido]
`✓ 598 modules transformed.` … `✓ built in 1.23s`. No hizo falta `npm install`: `npm ls --depth=0` coincide con `package.json`.
Advertencias (no rompen el build, sí conviene registrarlas por la subida a Vite 8):

- Build: `` `esbuild` option was specified by "vite:react-swc" plugin. This option is deprecated, please use `oxc` instead. ``
- Dev server (terminal del usuario): `` `optimizeDeps.rollupOptions` … is deprecated. Use `optimizeDeps.rolldownOptions` ``,
  `[vite:react-swc] We recommend switching to @vitejs/plugin-react-oxc`, y `Warning: Invalid input options … For the "jsx". Invalid key`.
- `vite.config.js:9` declara `server.historyApiFallback: true`, que no es una opción de Vite (no tiene efecto) [inferido de la doc de Vite].

Con react-router-dom 7 las 10 rutas renderizaron su contenido esperado en dev y en preview (encabezados y flujos verificados abajo),
sin advertencias de React Router en consola [medido].

Salida completa: `raw/build.log`.

### `npm run lint` — **falla: 135 errores, 0 warnings, en 32 archivos** [medido]

| Regla | Errores |
|---|---|
| `no-unused-vars` | 69 |
| `react/prop-types` | 53 |
| `react/no-unescaped-entities` | 6 |
| `react/no-unknown-property` (`class`, `stroke-width`… en JSX) | 6 |
| `no-case-declarations` (`customPainting.jsx:59`) | 1 |

Son errores de código preexistentes, no causados por las dependencias nuevas. Salida completa: `raw/lint.log`.

## 2. Lighthouse móvil (10 rutas)

Lighthouse 13.5.0 vía `npx` (aprobado), `formFactor=mobile`, throttling **simulado** (RTT 150 ms, 1,6 Mbps, CPU ×4),
contra el build de producción en `localhost:4173`. Reportes completos (HTML + JSON): `raw/lighthouse/`.

| Ruta | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | Bytes (carga) |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 83 | 73 | 100 | 85 | 2,8 s | 3,3 s | 150 ms | 0 | 12.844 KiB |
| `/elegir` | 89 | 74 | 100 | 85 | 2,8 s | 3,0 s | 60 ms | 0 | 398 KiB |
| `/obras-en-stock` | 80 | 70 | 100 | 85 | 2,8 s | 4,3 s | 70 ms | 0 | 11.683 KiB |
| `/obra-personalizada` | 81 | 76 | 100 | 85 | 2,8 s | 3,8 s | 50 ms | 0 | 398 KiB |
| `/agendas` | 68 | 77 | 100 | 85 | 2,8 s | 7,9 s | 80 ms | 0 | 2.164 KiB |
| `/agenda-personalizada` | 79 | 77 | 100 | 85 | 2,8 s | 4,4 s | 120 ms | 0 | 4.242 KiB |
| `/mi-libro` | 81 | 75 | 100 | 85 | 2,8 s | 3,8 s | 60 ms | 0 | 838 KiB |
| `/laminas` | 82 | 76 | 100 | 85 | 2,8 s | 3,7 s | 80 ms | 0 | 398 KiB |
| `/sobre-mi` | 77 | 70 | 100 | 85 | 3,1 s | 4,2 s | 70 ms | 0 | 838 KiB |
| `/contacto` | 67 | 79 | 100 | 85 | 3,4 s | 6,7 s | 60 ms | 0 | 922 KiB |

Auditorías que fallan [medido]:

| Auditoría | Rutas |
|---|---|
| `meta-viewport` (`user-scalable=no`) | todas |
| `image-alt` (a11y y SEO) | todas (icono WhatsApp; en `/agendas` además 8 fotos) |
| `link-name` (Instagram/TikTok/Facebook sin nombre) | todas (`/agendas` además el link de la galería) |
| `list` / `listitem` (`<ul>` con `<a>` hijos; `<li>` sin lista) | todas |
| `robots-txt` (devuelve HTML) | todas |
| `heading-order` | `/elegir`, `/obra-personalizada`, `/obras-en-stock`, `/mi-libro`, `/sobre-mi` |
| `color-contrast` | `/obras-en-stock` (#888 sobre aliceblue, 3,3:1), `/sobre-mi` (#667eea sobre blanco, 3,66:1) |
| `target-size` | `/` (botón "Ver en instagram") |
| Render-blocking (Google Fonts CSS) | todas, ahorro estimado 0,7–1,7 s |
| Image delivery (ahorro estimado) | `/obras-en-stock` 9.841 KiB · `/` 5.417 KiB · `/agenda-personalizada` 3.731 KiB · `/agendas` 1.672 KiB |

Elemento LCP según Lighthouse [medido]: `/` → `img.imgAniSection1` (aniSection3.jpg); `/obras-en-stock` → primera obra;
`/agendas` → imagen del slider; `/sobre-mi` → `aniHeader2.jpg`; `/contacto` → `<h2>`; `/elegir` → `<p>`.

Advertencias sobre la validez:
- En `/` Lighthouse avisó: *"The tested device appears to have a slower CPU than Lighthouse expects"* → el Perf de Home puede estar subestimado.
- `vite preview` no es Vercel (sin CDN, sin HTTP/2/3, otros headers de caché). Los números son de laboratorio y relativos; sirven para comparar fases, no como valores de producción.
- El Perf 83 de Home es engañosamente alto: la simulación no penaliza del todo el video de 7,7 MB que se descarga en paralelo (ver §4).

### Core Web Vitals
- **LCP / CLS**: tabla anterior [medido, laboratorio]. CLS = 0 en todas.
- **INP**: no se puede medir con Lighthouse en modo navegación ni hay datos de campo (sin analítica/CrUX). Aproximación de laboratorio
  [medido, `raw/weight-home.json`]: abrir el menú móvil con CPU ×4 → **160 ms** de duración del evento; cerrarlo → 24 ms.
  No equivale a INP de usuarios reales.
- Discrepancia a registrar: sin throttling, el `PerformanceObserver` reporta como LCP de Home el **`<video>`** a 688 ms; Lighthouse elige la imagen `aniSection3`. [medido ambos]

## 3. Imágenes y assets

### Totales por carpeta (archivos en `src/`, incluye los no importados) [medido]

| Carpeta | Archivos | Peso |
|---|---|---|
| `src/components/imgs/` (raíz) | 29 | 8,50 MB |
| `src/components/imgs/cuadernoA4/` | 8 (7 JPEG + 1 ZIP) | 3,96 MB |
| **`src/components/imgs/` total** | **37** | **12,46 MB** |
| `src/pages/pagesStyles/paintingsImgs/` (raíz) | 33 | 14,07 MB |
| `src/pages/pagesStyles/paintingsImgs/nuevosCuadros/` | 27 | 15,46 MB |
| **`src/pages/pagesStyles/paintingsImgs/` total** | **60** | **29,53 MB** |
| `src/components/assets/` | 21 (20 SVG + 1 MP4) | 7,71 MB |

Formatos: solo JPEG/PNG (ningún WebP/AVIF). Ninguna `<img>` tiene atributos `width`/`height` ni `loading="lazy"` en ninguna ruta [medido, `raw/dom-facts.json`].

### Los 20 archivos más pesados de `src/` [medido]

| # | KB | Archivo |
|---|---|---|
| 1 | 7.876 | `src/components/assets/wspVideo-header.mp4` |
| 2 | 2.978 | `src/components/imgs/bg1.png` *(no importado)* |
| 3 | 2.351 | `src/pages/pagesStyles/paintingsImgs/Nerea.jpeg` |
| 4 | 2.027 | `src/components/imgs/cuadernoA4/WhatsApp Unknown 2025-11-15 at 6.46.19 PM.zip` *(no importado)* |
| 5 | 1.485 | `paintingsImgs/Aurora.jpg` |
| 6 | 1.075 | `paintingsImgs/nuevosCuadros/AMORES GATUNOS.jpg` |
| 7 | 1.033 | `paintingsImgs/nuevosCuadros/HILO ROJO.jpg` |
| 8 | 912 | `paintingsImgs/nuevosCuadros/CORAZON COSIDO.jpg` |
| 9 | 826 | `paintingsImgs/nuevosCuadros/FERNANDA1.jpg` |
| 10 | 769 | `paintingsImgs/nuevosCuadros/ALEJANDRA.jpg` |
| 11 | 677 | `paintingsImgs/nuevosCuadros/BLUE FLOWER.jpg` |
| 12 | 673 | `paintingsImgs/Vanessa.jpeg` |
| 13 | 639 | `paintingsImgs/nuevosCuadros/SYLVINE.jpg` |
| 14 | 629 | `paintingsImgs/nuevosCuadros/LA VIDA ES BELLA3.jpg` |
| 15 | 620 | `paintingsImgs/nuevosCuadros/VIOLET.jpg` |
| 16 | 615 | `paintingsImgs/nuevosCuadros/SELVA.jpg` |
| 17 | 604 | `paintingsImgs/nuevosCuadros/LUCY2.jpg` |
| 18 | 600 | `paintingsImgs/EUPHORIA.jpeg` |
| 19 | 587 | `paintingsImgs/nuevosCuadros/HANNA.jpg` |
| 20 | 555 | `paintingsImgs/nuevosCuadros/FERNANDA2.jpg` |

### Bundle de producción (`dist/`) [medido]
- **46,29 MB en 106 archivos**: 99 JPEG (38,1 MB), 1 MP4 (7,69 MB), JS 416,7 KB (133 KB gzip), CSS 43 KB (8,7 KB gzip).
- **Sospechosos**:
  - `wspVideo-header.mp4` (7.876 KB) **sí entra al bundle** (importado en `src/components/Slider.jsx:10`) y se descarga en Home.
  - El `.zip` de `cuadernoA4/` (2.027 KB) **no entra al bundle** (no se importa); solo engorda el repo.
- Archivos en `src/` que **no** llegan a `dist/` (no importados): `bg1.png` (2.978 KB), `aniSection5.jpg`, `BG.jpg`, `butterflyBG.jpg`,
  `butterflyBG2.jpg`, `paintingsImgs/cuadro4.jpeg`, 7 imágenes de `src/objects/intAgendas/` y el `.zip`.

## 4. Peso transferido de Home en móvil [medido]

`design/tools/home-weight.mjs`: viewport 390×844 con emulación móvil, caché deshabilitada, build de producción en `localhost:4173`,
**sin** throttling de red (los bytes no dependen de la velocidad).

| Momento | Peso | Requests |
|---|---|---|
| Carga inicial, **sin scroll** | **13,49 MiB** (14.144.360 bytes ≈ 14,1 MB) | 44 |
| Tras recorrer toda la página | 13,49 MiB (solo +346 bytes) | 44 |

Desglose: video 7,69 MB (1) · imágenes 5,57 MB (36) · fuentes 89 KB (2) · JS 129 KB gzip · CSS 10 KB.
Todo se descarga en la carga inicial: no hay lazy loading. Presupuesto del plan: < 1,5 MB → hoy es **≈ 9×** el objetivo.
Lighthouse mide 12.844 KiB para la misma ruta (corta antes de terminar el video).

## 5. Contraste de colores (cálculo WCAG sobre valores del CSS) [medido]

| Par | Ratio | AA texto normal |
|---|---|---|
| `blueviolet` #8A2BE2 sobre blanco | 5,96:1 | pasa |
| `blueviolet` sobre `aliceblue` #F0F8FF | 5,55:1 | pasa |
| Blanco sobre `blueviolet` (botones) | 5,96:1 | pasa |
| Error #e74c3c sobre blanco (`agendas.css:12`, `customPainting.css:104`) | 3,82:1 | **falla** |
| Éxito #27ae60 sobre blanco (`agendas.css:13`) | 2,87:1 | **falla** |
| #888 sobre aliceblue (`/obras-en-stock`, Lighthouse) | 3,3:1 | **falla** |
| #667eea sobre blanco (`/sobre-mi`, Lighthouse) | 3,66:1 | **falla** |
| rgb(202,152,248) "artista plástica" del hero | sobre video, no medible | — |

## 6. Qué no se pudo medir

- **Capturas**: 17 de 20 capturas de ruta (ver aviso arriba).
- **Producción** (`anicarlomagno.vercel.app`): ni Lighthouse, ni headers, ni compresión, ni el HTML servido.
- **INP real**: sin datos de campo; solo la aproximación de laboratorio de §2.
- **Dispositivos reales** (iOS Safari, Android Chrome, navegador in-app de Instagram).
- **Viewport 768 px** (la DoD lo pide; esta fase no lo incluía).
- **Percepción "premium"** (métrica agregada al plan en `bf0bcd3`: test con 5 personas ajenas en un celular). Requiere personas; no la puede hacer un agente.

## Cómo repetir

```bash
npm run build && npx vite preview --port 4173     # en otra terminal
node design/tools/dom-facts.mjs http://localhost:5173   # requiere npm run dev
node design/tools/dom-summary.mjs 390                     # resumen legible de dom-facts.json
node design/tools/home-weight.mjs
node design/tools/third-parties.mjs && node design/tools/contact-iframe.mjs
node design/tools/flows.mjs
npx lighthouse http://localhost:4173/ --only-categories=performance,accessibility,best-practices,seo --output=json --output=html --output-path=design/audits/raw/lighthouse/home
node design/tools/lh-summary.mjs
```
