// Accessibility tree facts per route from Chrome's own AX tree (CDP Accessibility.getFullAXTree). No screenshots.
// Usage: node design/tools/ax-tree.mjs <out.json> [baseUrl] [width]   (defaults http://localhost:5173, 390)
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { launch, newPage, setViewport, goto, autoScroll, sleep } from './cdp.mjs';

const OUT = process.argv[2] || 'design/audits/raw/phase-1/ax-tree.json';
const BASE = process.argv[3] || 'http://localhost:5173';
const WIDTH = Number(process.argv[4] || 390);
const ROUTES = ['/', '/elegir', '/obras-en-stock', '/obra-personalizada', '/agendas', '/agenda-personalizada',
  '/mi-libro', '/laminas', '/sobre-mi', '/contacto'];
const LANDMARKS = new Set(['main', 'navigation', 'banner', 'contentinfo', 'complementary', 'region', 'form', 'search']);
const withTimeout = (p, ms, what) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`timeout ${ms}ms: ${what}`)), ms))]);

async function facts(page) {
  await page.send('Accessibility.enable');
  const { nodes } = await page.send('Accessibility.getFullAXTree');
  const byId = new Map(nodes.map((n) => [n.nodeId, n]));
  const root = nodes.find((n) => !n.parentId);
  const out = { headings: [], landmarks: [], links: [], buttons: [], unnamed: [], listitemsOutsideList: 0, lists: 0 };
  const prop = (n, name) => n.properties?.find((p) => p.name === name)?.value?.value;
  const walk = (n, listDepth) => {
    if (!n) return;
    const role = n.role?.value;
    const name = (n.name?.value ?? '').replace(/\s+/g, ' ').trim().slice(0, 60);
    if (!n.ignored) {
      if (role === 'heading') out.headings.push(`h${prop(n, 'level')} ${name}`);
      if (LANDMARKS.has(role)) out.landmarks.push(`${role}${name ? ' "' + name + '"' : ''}`);
      if (role === 'link') out.links.push(name);
      if (role === 'button') out.buttons.push(name);
      if (['link', 'button', 'checkbox', 'radio', 'textbox', 'combobox'].includes(role) && !name) out.unnamed.push(role);
      if (role === 'list') out.lists++;
      if (role === 'listitem' && listDepth === 0) out.listitemsOutsideList++;
    }
    const nextDepth = role === 'list' && !n.ignored ? listDepth + 1 : listDepth;
    for (const c of n.childIds ?? []) walk(byId.get(c), nextDepth);
  };
  walk(root, 0);
  return out;
}

const result = { base: BASE, width: WIDTH, date: new Date().toISOString(), routes: {}, failed: [] };
let browser = await launch({ port: 9345 });
result.chrome = browser.version.Browser;
for (const path of ROUTES) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    let page;
    try {
      page = await withTimeout(newPage(browser), 15000, 'newPage');
      result.routes[path] = await withTimeout((async () => {
        await setViewport(page, WIDTH);
        await goto(page, BASE + path, { maxMs: 15000 });
        await autoScroll(page, { stepMs: 150 });
        await sleep(500);
        return facts(page);
      })(), 90000, path);
      console.log(`ok ${path}`);
      break;
    } catch (e) {
      console.log(`fail ${path} attempt ${attempt}: ${e.message}`);
      if (attempt === 2) result.failed.push({ path, error: e.message });
      await browser.close().catch(() => {});
      browser = await launch({ port: 9345 });
      page = null;
    } finally {
      if (page) await page.close().catch(() => {});
    }
  }
}
await browser.close();
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(result, null, 2));
console.log(`saved ${OUT}; failed=${result.failed.length}`);
