// Phase 5: rendered box of every <img> on Home (after scrolling the whole page), to prove the layout did not change.
// Usage: node design/tools/home-image-rects.mjs <out.json> [baseUrl]
import { writeFileSync } from 'node:fs';
import { launch, newPage, setViewport, goto, autoScroll, evaluate, sleep } from './cdp.mjs';

const out = process.argv[2];
const BASE = process.argv[3] || 'http://localhost:4173';
const browser = await launch({ port: 9338 });
const result = {};
for (const width of [390, 1280]) {
  const page = await newPage(browser);
  await setViewport(page, width);
  await goto(page, BASE + '/', { quietMs: 1500, maxMs: 30000 });
  await autoScroll(page, { stepMs: 250 });
  await sleep(1500);
  // "Ver más" shows 3 more at a time: click it until it disappears so every catalog image is measured
  await evaluate(page, `(async () => { for (let i = 0; i < 30; i++) { const b = document.querySelector('.seeMorePaintings button'); if (!b) break; b.click(); await new Promise(r => setTimeout(r, 50)); } })()`);
  await autoScroll(page, { stepMs: 250 });
  await sleep(1500);
  result[width] = await evaluate(page, `[...document.querySelectorAll('main img, section img, header img')].filter(i => !i.closest('nav,footer')).map(i => { const r = i.getBoundingClientRect(); return { alt: i.alt.slice(0, 40), w: Math.round(r.width), h: Math.round(r.height), nat: i.naturalWidth + 'x' + i.naturalHeight, loading: i.loading, wAttr: i.getAttribute('width'), hAttr: i.getAttribute('height') }; })`);
}
writeFileSync(out, JSON.stringify(result, null, 1));
console.log(Object.entries(result).map(([w, a]) => `${w}px: ${a.length} imgs`).join(' | '));
process.exit(0);
