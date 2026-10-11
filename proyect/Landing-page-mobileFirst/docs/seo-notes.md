# Notas de SEO (Fase 3, 2026-10-11)

**Dominio:** `https://anicarlomagno.vercel.app` (constante `SITE_URL` en `src/seo/routes.js`; si hay dominio propio,
cambiar ahí y en `public/robots.txt`).

## Cómo funciona

- `src/seo/routes.js` es la **única lista** de rutas públicas con su `title` (≤ 60), `description` (≤ 155), migas y `lastmod`.
- `scripts/seo-plugin.js` (plugin de Vite, sin dependencias) corre en `vite build` y:
  - pone el `<head>` de la Home entre `<!-- seo:start -->` y `<!-- seo:end -->` de `index.html`;
  - escribe `dist/<ruta>/index.html` por cada ruta con su title, description, canonical, Open Graph, Twitter y JSON-LD
    (mismo `<body>` y mismo bundle);
  - escribe `dist/404.html` (`noindex`) y `dist/sitemap.xml`.
- `src/seo/structuredData.js` arma el JSON-LD; los precios salen de `src/components/config/` (nunca números a mano).
- `src/seo/RouteMeta.jsx` actualiza título, descripción, robots y canonical al navegar dentro de la app.
- `vercel.json` ya no tiene el rewrite a `/`: Vercel sirve cada carpeta de `dist/` y responde 404 al resto.
- Imagen para compartir: `public/og-image.jpg`, copia sin alterar de `src/components/imgs/aniSection7.jpg` (1280×850).

## Agregar una ruta nueva

1. `<Route>` en `src/LandingPage.jsx`.
2. Una entrada en `routes` de `src/seo/routes.js` (path, title, description, breadcrumb, `parent` si cuelga de otra, lastmod).
   **Sin este paso, la URL da 404 al entrar directo o al recargar.**
3. `npm run build` y revisar `dist/<ruta>/index.html`.

Al editar el contenido de una página, actualizar su `lastmod`.

## Pasos manuales (Valentín / Ani)

1. Revisar el preview de la rama: `/agendas`, `/agendas/`, una URL inexistente (debe mostrar la 404) y `/sitemap.xml`.
2. Probar la vista previa con el [Sharing Debugger de Facebook](https://developers.facebook.com/tools/debug/) y mandando el enlace por WhatsApp.
3. **Google Search Console:** agregar la propiedad del dominio, verificarla y enviar `https://anicarlomagno.vercel.app/sitemap.xml`.
4. **Google Business Profile:** crear el perfil de Ani en Tandil (artista / tienda de arte) con el sitio, WhatsApp y las redes.
5. Mantener iguales nombre y usuario en Instagram, TikTok y Facebook (`anicarlomagno_painting` / `anicarlomagno`).
