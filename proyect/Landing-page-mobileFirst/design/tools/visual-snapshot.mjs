// Phase 1: layout/style snapshot to prove "same look" without baseline screenshots.
// Records every visible text run (Range rect), image and clickable box with key computed styles,
// keyed by content (text / image file / control text), so tag changes (h1 -> p, a > li -> li > a) still compare.
// Transforms, animations and transitions are neutralized before measuring, so entrance motion doesn't add noise.
// Usage: node design/tools/visual-snapshot.mjs <out.json> [baseUrl]   (default http://localhost:5173)
//        node design/tools/visual-snapshot.mjs --diff <before.json> <after.json>
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { launch, newPage, setViewport, goto, autoScroll, evaluate, click, sleep } from './cdp.mjs';

const ROUTES = ['/', '/elegir', '/obras-en-stock', '/obra-personalizada', '/agendas', '/agenda-personalizada',
  '/mi-libro', '/laminas', '/sobre-mi', '/contacto'];

const NEUTRALIZE = `(() => { const s = document.createElement('style'); s.id = '__snap';
  s.textContent = '*,*::before,*::after{transform:none!important;scale:none!important;translate:none!important;rotate:none!important;animation:none!important;transition:none!important;filter:none!important}';
  document.head.appendChild(s); })()`;

const COLLECT = (scope) => `(() => {
  const root = ${scope ? `document.querySelector(${JSON.stringify(scope)})` : 'document.body'};
  if (!root) return null;
  const r1 = (n) => Math.round(n * 10) / 10;
  const box = (r) => [r1(r.x), r1(r.y + scrollY), r1(r.width), r1(r.height)];
  const vis = (el) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect();
    return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0; };
  const pick = (el, props) => { const s = getComputedStyle(el); return Object.fromEntries(props.map(p => [p, s[p]])); };
  const seen = {}; const key = (k) => { seen[k] = (seen[k] || 0) + 1; return k + '#' + seen[k]; };
  const out = { texts: {}, imgs: {}, controls: {} };
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) {
    const t = n.textContent.replace(/\\s+/g, ' ').trim();
    const p = n.parentElement;
    if (!t || !p || p.closest('script,style,noscript') || !vis(p)) continue;
    const range = document.createRange(); range.selectNodeContents(n);
    const r = range.getBoundingClientRect(); if (!r.width) continue;
    out.texts[key('T:' + t.slice(0, 50))] = { box: box(r), ...pick(p, ['fontSize', 'fontWeight', 'fontFamily', 'fontStyle', 'color', 'lineHeight', 'letterSpacing', 'textTransform']) };
  }
  for (const img of root.querySelectorAll('img')) {
    if (!vis(img)) continue;
    const src = decodeURIComponent((img.currentSrc || img.src).split('/').pop().split('?')[0]).replace(/-[\\w]{8}(\\.\\w+)$/, '$1');
    out.imgs[key('I:' + src)] = { box: box(img.getBoundingClientRect()), ...pick(img, ['objectFit', 'borderRadius', 'borderTopWidth', 'borderTopColor', 'boxShadow', 'opacity']) };
  }
  const ctrlKey = (el) => (el.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 40)
    || (el.querySelector('img') ? 'img:' + decodeURIComponent(el.querySelector('img').src.split('/').pop()).replace(/-[\\w]{8}(\\.\\w+)$/, '$1') : '')
    || el.id || el.name || el.getAttribute('href') || el.className.toString().slice(0, 30);
  const ctrls = [...root.querySelectorAll('a,button,input,textarea,select,label,*')].filter(el => {
    if (!vis(el)) return false;
    if (el.matches('a,button,input,textarea,select')) return true;
    return getComputedStyle(el).cursor === 'pointer' && !(el.parentElement && getComputedStyle(el.parentElement).cursor === 'pointer');
  });
  for (const el of new Set(ctrls)) {
    out.controls[key('C:' + ctrlKey(el))] = { box: box(el.getBoundingClientRect()),
      ...pick(el, ['backgroundColor', 'backgroundImage', 'borderTopWidth', 'borderTopStyle', 'borderTopColor', 'borderRadius', 'boxShadow', 'paddingTop', 'paddingLeft', 'fontSize', 'color', 'cursor']) };
  }
  out.doc = { scrollHeight: document.documentElement.scrollHeight, scrollWidth: document.documentElement.scrollWidth };
  return out;
})()`;

const withTimeout = (p, ms, what) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`timeout ${ms}ms: ${what}`)), ms))]);

const PORT = Number(process.env.CDP_PORT || 9341);

async function snapshot(outFile, base) {
  let browser = await launch({ port: PORT });
  const result = { base, date: new Date().toISOString(), chrome: browser.version.Browser, pages: {}, failed: [] };
  mkdirSync(dirname(outFile), { recursive: true });
  const save = () => writeFileSync(outFile, JSON.stringify(result, null, 2));
  for (const width of [390, 1280]) {
    for (const path of ROUTES) {
      const k = `${path}@${width}`;
      for (let attempt = 1; attempt <= 2; attempt++) {
        let page;
        try {
          page = await withTimeout(newPage(browser), 15000, `${k} newPage`);
          await withTimeout(capture(page, path, width, k), 120000, k);
          console.log(`ok ${k}`);
          break;
        } catch (e) {
          console.log(`fail ${k} attempt ${attempt}: ${e.message}`);
          if (attempt === 2) result.failed.push({ page: k, error: e.message });
          await browser.close().catch(() => {});
          browser = await launch({ port: PORT });
          page = null;
        } finally {
          if (page) await page.close().catch(() => {});
        }
      }
      save();
    }
  }
  await browser.close();
  save();
  console.log(`saved ${outFile}; failed=${result.failed.length}`);

  async function capture(page, path, width, k) {
    await setViewport(page, width);
    await goto(page, base + path, { maxMs: 15000 });
    await sleep(1500);
    await autoScroll(page, { stepMs: 150 });
    await evaluate(page, NEUTRALIZE);
    await sleep(300);
    result.pages[k] = await evaluate(page, COLLECT());
    if (path === '/' && width === 390) {
      await evaluate(page, `document.getElementById('__snap').remove()`);
      await click(page, '.btnDisplayMenu');
      await sleep(1000);
      await evaluate(page, NEUTRALIZE);
      await sleep(200);
      result.pages['/#menu-abierto@390'] = await evaluate(page, COLLECT('.displayMenu'));
    }
    if (path === '/laminas') {
      await evaluate(page, `document.getElementById('__snap').remove()`);
      await click(page, '.dropDownAgendas-btn');
      await sleep(800);
      await evaluate(page, NEUTRALIZE);
      await sleep(200);
      result.pages[`/laminas#desplegable@${width}`] = await evaluate(page, COLLECT('.laminasContainer'));
    }
  }
}

function diff(beforeFile, afterFile, tol = 0.6) {
  const A = JSON.parse(readFileSync(beforeFile, 'utf8')).pages;
  const B = JSON.parse(readFileSync(afterFile, 'utf8')).pages;
  const report = {};
  for (const page of Object.keys({ ...A, ...B })) {
    const a = A[page], b = B[page];
    const lines = [];
    if (!a || !b) { report[page] = [`page missing in ${a ? 'after' : 'before'}`]; continue; }
    if (a.doc.scrollHeight !== b.doc.scrollHeight) lines.push(`doc.scrollHeight ${a.doc.scrollHeight} -> ${b.doc.scrollHeight}`);
    if (a.doc.scrollWidth !== b.doc.scrollWidth) lines.push(`doc.scrollWidth ${a.doc.scrollWidth} -> ${b.doc.scrollWidth}`);
    for (const group of ['texts', 'imgs', 'controls']) {
      const ga = a[group], gb = b[group];
      for (const k of Object.keys({ ...ga, ...gb })) {
        if (!ga[k]) { lines.push(`+ ${k} ${JSON.stringify(gb[k].box)}`); continue; }
        if (!gb[k]) { lines.push(`- ${k} ${JSON.stringify(ga[k].box)}`); continue; }
        const changes = [];
        ga[k].box.forEach((v, i) => { if (Math.abs(v - gb[k].box[i]) > tol) changes.push(`${['x', 'y', 'w', 'h'][i]} ${v}->${gb[k].box[i]}`); });
        for (const p of Object.keys(ga[k])) if (p !== 'box' && ga[k][p] !== gb[k][p]) changes.push(`${p} ${ga[k][p]} -> ${gb[k][p]}`);
        if (changes.length) lines.push(`~ ${k}: ${changes.join('; ')}`);
      }
    }
    report[page] = lines;
  }
  for (const [page, lines] of Object.entries(report)) {
    console.log(`\n## ${page}: ${lines.length ? lines.length + ' differences' : 'identical'}`);
    for (const l of lines) console.log('  ' + l);
  }
}

if (process.argv[2] === '--diff') diff(process.argv[3], process.argv[4]);
else await snapshot(process.argv[2] || 'design/audits/raw/phase-1/visual-snapshot.json', process.argv[3] || 'http://localhost:5173');
