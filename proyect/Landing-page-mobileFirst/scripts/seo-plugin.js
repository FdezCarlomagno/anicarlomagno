import fs from 'node:fs';
import path from 'node:path';
import { routes, notFound, absoluteUrl, OG_IMAGE, SITE_NAME } from '../src/seo/routes.js';

const START = '<!-- seo:start -->';
const END = '<!-- seo:end -->';
const BLOCK = new RegExp(`${START}[\\s\\S]*?${END}`);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const renderHead = (meta, { indexable }) => {
  const url = indexable ? absoluteUrl(meta.path) : null;
  const image = absoluteUrl(OG_IMAGE.path);
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}">`,
    `<meta name="robots" content="${indexable ? 'index, follow' : 'noindex'}">`,
    url && `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}">`,
    `<meta property="og:locale" content="es_AR">`,
    url && `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${esc(meta.title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta property="og:image:type" content="${OG_IMAGE.type}">`,
    `<meta property="og:image:width" content="${OG_IMAGE.width}">`,
    `<meta property="og:image:height" content="${OG_IMAGE.height}">`,
    `<meta property="og:image:alt" content="${esc(OG_IMAGE.alt)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(meta.title)}">`,
    `<meta name="twitter:description" content="${esc(meta.description)}">`,
    `<meta name="twitter:image" content="${image}">`,
    `<meta name="twitter:image:alt" content="${esc(OG_IMAGE.alt)}">`,
  ].filter(Boolean);
  return `${START}\n  ${tags.join('\n  ')}\n  ${END}`;
};

const sitemapXml = () => {
  const urls = routes
    .map((r) => `  <url>\n    <loc>${absoluteUrl(r.path)}</loc>\n    <lastmod>${r.lastmod}</lastmod>\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

const home = routes.find((r) => r.path === '/');

// index.html keeps only the markers; dev and build get the Home head. After the build, every other public
// route gets a copy of dist/index.html with its own head block (same body, same bundle).
export default function seoPlugin() {
  let outDir;
  let isBuild = false;
  return {
    name: 'anicarlomagno-seo',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
      isBuild = config.command === 'build';
    },
    transformIndexHtml(html) {
      if (!BLOCK.test(html)) throw new Error('index.html is missing the <!-- seo:start --> / <!-- seo:end --> markers');
      return html.replace(BLOCK, () => renderHead(home, { indexable: true }));
    },
    closeBundle() {
      if (!isBuild) return;
      const template = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
      for (const route of routes) {
        if (route.path === '/') continue;
        const dir = path.join(outDir, route.path);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), template.replace(BLOCK, () => renderHead(route, { indexable: true })));
      }
      // Vercel serves 404.html with status 404 for any path without a file (no catch-all rewrite).
      fs.writeFileSync(path.join(outDir, '404.html'), template.replace(BLOCK, () => renderHead(notFound, { indexable: false })));
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemapXml());
    },
  };
}
