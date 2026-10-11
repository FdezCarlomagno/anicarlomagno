// Fase 4b: verificación de los prototipos de dirección de arte sin capturas.
// Mide overflow, tamaño de letra, objetivos táctiles, contraste WCAG de cada texto contra su fondo real,
// imágenes (alt, width/height, proporción sin recorte), texto encima de obra, flotantes que tapan contenido,
// prefers-reduced-motion y el menú abierto (foco, Esc, inert).
// Uso (con `npm run dev` corriendo): node design/art-direction/tools/check.mjs [baseUrl] [archivo.html,...]
//   baseUrl por defecto: http://localhost:5173/design/art-direction/ · archivos por defecto: los tres prototipos
import { writeFileSync, mkdirSync } from 'node:fs';
import { launch, newPage, setViewport, goto, autoScroll, evaluate, sleep, click, pressKey } from '../../tools/cdp.mjs';

const BASE = process.argv[2] || 'http://localhost:5173/design/art-direction/';
const PAGES = process.argv[3] ? process.argv[3].split(',') : ['a-galeria.html', 'b-editorial.html', 'c-inmersiva.html'];
const WIDTHS = [360, 390, 1280];
const OUT_DIR = 'design/art-direction/verificacion/raw';
mkdirSync(OUT_DIR, { recursive: true });

// Misma fórmula que design/tools/contrast.mjs (WCAG 2.2, colores translúcidos compuestos sobre su fondo).
const LIB = `
  const parse = (c) => { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] ?? 1]; };
  const over = (top, base) => [0, 1, 2].map((i) => top[i] * top[3] + base[i] * (1 - top[3]));
  const lum = (rgb) => rgb.map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; })
    .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const vis = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && !el.closest('[hidden]'); };
  const hasText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
  const txt = (el) => (el.getAttribute('aria-label') || el.innerText || '').trim().replace(/\\s+/g, ' ').slice(0, 50);
  const bgOf = (el) => { const layers = []; let onImage = false;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) { const s = getComputedStyle(n);
      if (s.backgroundImage !== 'none') onImage = true;
      const c = parse(s.backgroundColor); if (c && c[3] > 0) { layers.push(c); if (c[3] === 1) break; } }
    let base = [255, 255, 255]; for (const l of layers.reverse()) base = over(l, base); return { bg: base, onImage }; };
  const inter = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
`;

const FACTS = `(() => { ${LIB}
  const vw = document.documentElement.clientWidth;
  const all = [...document.querySelectorAll('body *')].filter(vis);
  const textEls = all.filter(hasText);
  const interactive = all.filter((el) => el.matches('a[href],button,input,select,textarea,summary,[tabindex]'));

  const contrast = []; const seen = new Set();
  for (const el of textEls) { const s = getComputedStyle(el); const fg = parse(s.color); const { bg, onImage } = bgOf(el);
    const f = over(fg, bg); const r = ratio(f, bg); const size = parseFloat(s.fontSize); const w = parseInt(s.fontWeight, 10);
    const large = size >= 24 || (size >= 18.66 && w >= 700); const min = large ? 3 : 4.5;
    const key = [s.color, bg.map(Math.round).join(','), large].join('|'); if (seen.has(key) && r >= min) continue; seen.add(key);
    contrast.push({ text: txt(el), color: s.color, bg: 'rgb(' + bg.map(Math.round).join(', ') + ')', size, weight: w,
      ratio: Math.round(r * 100) / 100, min, pass: r >= min, onImage }); }

  const imgs = [...document.images].filter(vis).map((i) => { const r = i.getBoundingClientRect();
    const nat = i.naturalWidth && i.naturalHeight ? i.naturalWidth / i.naturalHeight : null; const ren = r.width / r.height;
    const fit = getComputedStyle(i).objectFit;
    const coveredBy = textEls.filter((t) => inter(t.getBoundingClientRect(), r)).map(txt);
    return { src: decodeURIComponent(i.src.split('/').pop()), alt: i.getAttribute('alt'), wAttr: i.getAttribute('width'), hAttr: i.getAttribute('height'),
      loading: i.loading, rendered: [Math.round(r.width), Math.round(r.height)], aspectDiffPct: nat ? Math.round(Math.abs(ren - nat) / nat * 1000) / 10 : null,
      objectFit: fit, textOver: coveredBy }; });

  return {
    title: document.title, lang: document.documentElement.lang,
    h1: document.querySelectorAll('h1').length,
    headings: [...document.querySelectorAll('h1,h2,h3')].filter(vis).map((h) => h.tagName + ': ' + txt(h)),
    scrollWidth: document.documentElement.scrollWidth, clientWidth: vw,
    overflowing: all.filter((el) => el.getBoundingClientRect().right > vw + 1 || el.getBoundingClientRect().left < -1)
      .slice(0, 10).map((el) => ({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 40), left: Math.round(el.getBoundingClientRect().left), right: Math.round(el.getBoundingClientRect().right) })),
    textUnder16: textEls.filter((el) => parseFloat(getComputedStyle(el).fontSize) < 16).map((el) => ({ text: txt(el), fs: getComputedStyle(el).fontSize })),
    smallTargets: interactive.map((el) => { const r = el.getBoundingClientRect(); const inline = getComputedStyle(el).display === 'inline' && !!el.closest('p');
      return { tag: el.tagName.toLowerCase(), text: txt(el), w: Math.round(r.width), h: Math.round(r.height), inline }; }).filter((o) => o.w < 44 || o.h < 44),
    contrastFails: contrast.filter((c) => !c.pass), contrastOnImage: contrast.filter((c) => c.onImage), contrastAll: contrast,
    minContrast: Math.min(...contrast.map((c) => c.ratio)),
    images: imgs,
    imgProblems: imgs.filter((i) => !i.alt || !i.wAttr || !i.hAttr || (i.aspectDiffPct ?? 0) > 1 || i.objectFit === 'cover' || i.textOver.length),
    fixed: all.filter((el) => ['fixed', 'sticky'].includes(getComputedStyle(el).position)).map((el) => ({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 30) })),
    pageHeight: document.documentElement.scrollHeight,
  };
})()`;

// Recorre la página y anota qué contenido queda debajo de cada elemento fijo, en cada posición de scroll.
const FLOATING = `(async () => { ${LIB}
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const fixed = [...document.querySelectorAll('body *')].filter((el) => vis(el) && getComputedStyle(el).position === 'fixed');
  const covered = {}; let atEnd = [];
  const maxY = document.documentElement.scrollHeight - innerHeight;
  for (let y = 0; ; y = Math.min(maxY, y + Math.round(innerHeight / 3))) {
    scrollTo(0, y); await sleep(60);
    const content = [...document.querySelectorAll('body *')].filter((el) => vis(el) && !fixed.some((f) => f.contains(el) || el.contains(f))
      && (hasText(el) || el.matches('a[href],button,img')));
    const hits = [];
    for (const f of fixed) { const fr = f.getBoundingClientRect();
      for (const el of content) if (inter(fr, el.getBoundingClientRect())) hits.push(el.tagName.toLowerCase() + ': ' + (txt(el) || el.getAttribute('alt')?.slice(0, 30) || ''));
    }
    hits.forEach((h) => { covered[h] = (covered[h] || 0) + 1; });
    if (y >= maxY) { atEnd = hits; break; }
  }
  scrollTo(0, 0);
  return { fixed: fixed.map((f) => f.className || f.tagName), coveredWhileScrolling: covered, coveredAtPageEnd: atEnd };
})()`;

const MOTION = `(() => [...document.querySelectorAll('*')].map((el) => { const s = getComputedStyle(el);
  const scrollDriven = Boolean(s.animationTimeline) && s.animationTimeline !== 'auto';
  const anim = s.animationName !== 'none' && (parseFloat(s.animationDuration) > 0.01 || scrollDriven);
  const trans = s.transitionDuration.split(',').some((d) => parseFloat(d) > 0.01) && s.transitionProperty !== 'none';
  return anim || trans ? { el: el.tagName.toLowerCase() + '.' + String(el.className).slice(0, 30), animation: anim ? s.animationName + ' ' + (scrollDriven ? s.animationTimeline : s.animationDuration) : null,
    transition: trans ? s.transitionProperty + ' ' + s.transitionDuration : null } : null; }).filter(Boolean))()`;

const MENU = `(() => { ${LIB}
  const btn = document.querySelector('[data-menu-button]'); const panel = document.getElementById(btn.getAttribute('aria-controls'));
  const pr = panel.getBoundingClientRect();
  return { ariaExpanded: btn.getAttribute('aria-expanded'), panelVisible: vis(panel), role: panel.getAttribute('role'), ariaModal: panel.getAttribute('aria-modal'),
    coversViewport: pr.top <= 0 && pr.left <= 0 && pr.right >= innerWidth && pr.bottom >= innerHeight,
    focused: document.activeElement ? document.activeElement.tagName.toLowerCase() + ': ' + txt(document.activeElement) : null,
    mainInert: document.querySelector('main').inert,
    links: [...panel.querySelectorAll('a,button')].map((a) => { const r = a.getBoundingClientRect(); return { text: txt(a), w: Math.round(r.width), h: Math.round(r.height) }; }),
    scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth };
})()`;

const results = { base: BASE, date: new Date().toISOString(), pages: {} };
let browser = await launch({ port: 9361 });
results.chrome = browser.version.Browser;

for (const file of PAGES) {
  const name = file.replace('.html', '');
  const r = (results.pages[name] = {});
  for (const width of WIDTHS) {
    const page = await newPage(browser);
    try {
      await setViewport(page, width);
      await goto(page, BASE + file, { maxMs: 20000 });
      await sleep(600);
      await autoScroll(page, { stepMs: 150 });
      const facts = await evaluate(page, FACTS);
      facts.floating = await evaluate(page, FLOATING);
      facts.motion = await evaluate(page, MOTION);
      const hasMenu = await evaluate(page, `Boolean(document.querySelector('[data-menu-button]'))`);
      if (width === 390 && hasMenu) {
        await click(page, '[data-menu-button]');
        await sleep(300);
        facts.menuOpen = await evaluate(page, MENU);
        await pressKey(page, 'Escape', 'Escape', 27);
        await sleep(200);
        facts.menuAfterEsc = await evaluate(page, MENU);
      }
      r[width] = facts;
    } catch (e) {
      r[width] = { error: e.message };
    } finally {
      await page.close();
    }
  }
  // prefers-reduced-motion: nada animado ni con transición.
  const page = await newPage(browser);
  try {
    await setViewport(page, 390);
    await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await goto(page, BASE + file, { maxMs: 20000 });
    await sleep(400);
    r.reducedMotion = await evaluate(page, MOTION);
    if (await evaluate(page, `Boolean(document.querySelector('[data-menu-button]'))`)) {
      await goto(page, 'about:blank', { maxMs: 2000 });
      await goto(page, BASE + file + '#menu', { maxMs: 20000 });
      await sleep(300);
      r.menuFromHash = await evaluate(page, MENU);
    }
  } catch (e) {
    r.reducedMotion = { error: e.message };
  } finally {
    await page.close();
  }
  writeFileSync(`${OUT_DIR}/check-${name}.json`, JSON.stringify(r, null, 2));
  console.log(`ok ${name}`);
}
await browser.close();

// Resumen legible
for (const [name, r] of Object.entries(results.pages)) {
  console.log(`\n## ${name}`);
  for (const w of WIDTHS) {
    const f = r[w];
    if (f.error) { console.log(`  ${w}px ERROR ${f.error}`); continue; }
    console.log(`  ${w}px: overflow ${f.scrollWidth > f.clientWidth ? 'SÍ ' + f.scrollWidth + '>' + f.clientWidth : 'no'}`
      + ` | h1 ${f.h1} | texto<16px ${f.textUnder16.length} | objetivos<44 ${f.smallTargets.filter((t) => !t.inline).length} (+${f.smallTargets.filter((t) => t.inline).length} inline)`
      + ` | contraste mín ${f.minContrast} fallas ${f.contrastFails.length} sobre-imagen ${f.contrastOnImage.length}`
      + ` | imgs ${f.images.length} problemas ${f.imgProblems.length}`
      + ` | fijo tapa al final: ${f.floating.coveredAtPageEnd.length}`);
    if (f.menuOpen) console.log(`    menú: expanded=${f.menuOpen.ariaExpanded} visible=${f.menuOpen.panelVisible} cubre=${f.menuOpen.coversViewport} foco="${f.menuOpen.focused}" inert=${f.menuOpen.mainInert}`
      + ` enlaces<44=${f.menuOpen.links.filter((l) => l.h < 44 || l.w < 44).length} | tras Esc: expanded=${f.menuAfterEsc.ariaExpanded} foco="${f.menuAfterEsc.focused}"`);
  }
  console.log(`  reduced-motion: ${Array.isArray(r.reducedMotion) ? r.reducedMotion.length + ' elementos animados' : JSON.stringify(r.reducedMotion)} | #menu abre: ${r.menuFromHash?.panelVisible}`);
}
