import fs from 'node:fs';
import path from 'node:path';
import { routes, absoluteUrl } from '../src/seo/routes.js';

const sitemapXml = () => {
  const urls = routes
    .map((r) => `  <url>\n    <loc>${absoluteUrl(r.path)}</loc>\n    <lastmod>${r.lastmod}</lastmod>\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

// Runs only on `vite build`, after the bundle is written.
export default function seoPlugin() {
  let outDir;
  return {
    name: 'anicarlomagno-seo',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemapXml());
    },
  };
}
