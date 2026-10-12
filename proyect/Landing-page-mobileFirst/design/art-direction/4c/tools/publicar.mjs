// Fase 4c: genera la copia servible de los prototipos en public/prototipos/4c/ (Vite la copia tal cual a dist/).
// La fuente es design/art-direction/4c/. Las obras y los estilos se copian idénticos (sin optimizar: eso es la Fase 5)
// y el HTML solo cambia las rutas a src/ por las copias locales. Uso: node design/art-direction/4c/tools/publicar.mjs
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'design/art-direction/4c';
const OUT = 'public/prototipos/4c';
const PAGES = ['index.html', 'c1-oscura.html', 'c2-clara.html'];
const ASSETS = ['prototipo.css', 'prototipo.js'];
const IMG_FROM = '../../../src/pages/pagesStyles/paintingsImgs/';
const CSS_FROM = '../../../src/styles/';

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'obras'), { recursive: true });
mkdirSync(join(OUT, 'estilos'), { recursive: true });

const images = new Set();
for (const page of PAGES) {
  let html = readFileSync(join(SRC, page), 'utf8');
  for (const m of html.matchAll(new RegExp(`${IMG_FROM.replaceAll('.', '\\.')}([^"]+)`, 'g'))) images.add(decodeURIComponent(m[1]));
  html = html
    .replace(/<!-- El plugin SEO[^\n]*\n<template>[^\n]*\n/, '')
    .replaceAll(IMG_FROM, 'obras/')
    .replaceAll(CSS_FROM, 'estilos/');
  if (html.includes('../')) throw new Error(`${page}: quedó una ruta relativa hacia afuera`);
  if (!html.includes('<meta name="robots" content="noindex, nofollow">')) throw new Error(`${page}: falta noindex`);
  writeFileSync(join(OUT, page), html);
}
for (const a of ASSETS) copyFileSync(join(SRC, a), join(OUT, a));
for (const f of ['tokens.css', 'fonts.css']) copyFileSync(join('src/styles', f), join(OUT, 'estilos', f));
for (const img of images) copyFileSync(join('src/pages/pagesStyles/paintingsImgs', img), join(OUT, 'obras', img));
console.log(`ok: ${PAGES.length} páginas, ${ASSETS.length + 2} estilos/scripts, ${images.size} obras → ${OUT}`);
