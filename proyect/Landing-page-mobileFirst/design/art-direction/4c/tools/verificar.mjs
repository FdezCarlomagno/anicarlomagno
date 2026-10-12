// Fase 4c: verificación de los prototipos sin capturas (DOM, estilos calculados, red y contraste numérico).
// Parte de design/art-direction/tools/check.mjs (4b) y suma lo propio de la C: encuadre del hero por ancho,
// texto sobre el muro, peso transferido, botón flotante sobre objetivos táctiles y parpadeo de la entrada.
// Uso (con `npm run dev` corriendo): node design/art-direction/4c/tools/verificar.mjs [baseUrl] [pagina.html,...]
//   baseUrl por defecto: http://localhost:5173/prototipos/4c/ (la copia servible, lo que se ve en el preview)
import { writeFileSync, mkdirSync } from 'node:fs';
import { launch, newPage, goto, autoScroll, evaluate, sleep, click, pressKey } from '../../../tools/cdp.mjs';

const BASE = process.argv[2] || 'http://localhost:5173/prototipos/4c/';
const PAGES = process.argv[3] ? process.argv[3].split(',') : ['c1-oscura.html', 'c2-clara.html', 'index.html'];
const VIEWPORTS = [[360, 740], [390, 844], [430, 932], [768, 1024], [1280, 800]];
const OUT_DIR = 'design/art-direction/4c/verificacion';
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
  const bgOf = (el) => { const layers = []; let onImage = false; let onMuro = false;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) { const s = getComputedStyle(n);
      if (n.classList.contains('muro')) onMuro = true;
      if (s.backgroundImage !== 'none') onImage = true;
      const c = parse(s.backgroundColor); if (c && c[3] > 0) { layers.push(c); if (c[3] === 1) break; } }
    let base = [255, 255, 255]; for (const l of layers.reverse()) base = over(l, base); return { bg: base, onImage, onMuro }; };
  const inter = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
  const rgb = (a) => 'rgb(' + a.map(Math.round).join(', ') + ')';
`;

const FACTS = `(() => { ${LIB}
  const vw = document.documentElement.clientWidth;
  const all = [...document.querySelectorAll('body *')].filter(vis);
  const textEls = all.filter(hasText);
  const interactive = all.filter((el) => el.matches('a[href],button,input,select,textarea,summary,[tabindex]'));

  const contrast = []; const seen = new Set();
  for (const el of textEls) { const s = getComputedStyle(el); const fg = parse(s.color); const { bg, onImage, onMuro } = bgOf(el);
    const f = over(fg, bg); const r = ratio(f, bg); const size = parseFloat(s.fontSize); const w = parseInt(s.fontWeight, 10);
    const large = size >= 24 || (size >= 18.66 && w >= 700); const min = large ? 3 : 4.5;
    const key = [s.color, rgb(bg), large].join('|'); if (seen.has(key) && r >= min) continue; seen.add(key);
    contrast.push({ text: txt(el), color: s.color, bg: rgb(bg), size, weight: w, ratio: Math.round(r * 100) / 100, min, pass: r >= min, onImage, onMuro }); }

  const muros = [...document.querySelectorAll('.muro')].filter(vis);
  const muroBg = muros.length ? getComputedStyle(muros[0]).backgroundColor : null;
  const pageBg = getComputedStyle(document.body).backgroundColor;

  const imgs = [...document.images].filter(vis).map((i) => { const r = i.getBoundingClientRect();
    const nat = i.naturalWidth && i.naturalHeight ? i.naturalWidth / i.naturalHeight : null; const ren = r.width / r.height;
    const coveredBy = textEls.filter((t) => inter(t.getBoundingClientRect(), r)).map(txt);
    return { src: decodeURIComponent(i.src.split('/').pop()), alt: i.getAttribute('alt'), wAttr: i.getAttribute('width'), hAttr: i.getAttribute('height'),
      loading: i.loading, natural: [i.naturalWidth, i.naturalHeight], rendered: [Math.round(r.width), Math.round(r.height)],
      aspectDiffPct: nat ? Math.round(Math.abs(ren - nat) / nat * 1000) / 10 : null, objectFit: getComputedStyle(i).objectFit,
      filter: getComputedStyle(i).filter, radius: getComputedStyle(i).borderTopLeftRadius, textOver: coveredBy }; });

  return {
    title: document.title, lang: document.documentElement.lang, robots: document.querySelector('meta[name=robots]')?.content,
    h1: document.querySelectorAll('h1').length,
    headings: [...document.querySelectorAll('h1,h2,h3')].filter(vis).map((h) => h.tagName + ': ' + txt(h)),
    scrollWidth: document.documentElement.scrollWidth, clientWidth: vw,
    overflowing: all.filter((el) => el.getBoundingClientRect().right > vw + 1 || el.getBoundingClientRect().left < -1)
      .slice(0, 10).map((el) => ({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 40) })),
    textUnder16: textEls.filter((el) => parseFloat(getComputedStyle(el).fontSize) < 16).map((el) => ({ text: txt(el), fs: getComputedStyle(el).fontSize })),
    smallTargets: interactive.map((el) => { const r = el.getBoundingClientRect(); const inline = getComputedStyle(el).display === 'inline' && !!el.closest('p');
      return { tag: el.tagName.toLowerCase(), text: txt(el), w: Math.round(r.width), h: Math.round(r.height), inline }; }).filter((o) => o.w < 44 || o.h < 44),
    contrastFails: contrast.filter((c) => !c.pass), textOnMuro: contrast.filter((c) => c.onMuro), contrastAll: contrast,
    minContrast: contrast.length ? Math.min(...contrast.map((c) => c.ratio)) : null,
    muro: muroBg ? { bg: muroBg, pageBg, ratioVsPage: Math.round(ratio(parse(muroBg), parse(pageBg)) * 100) / 100 } : null,
    images: imgs,
    imgProblems: imgs.filter((i) => !i.alt || !i.wAttr || !i.hAttr || (i.aspectDiffPct ?? 0) > 1 || i.objectFit === 'cover' || i.filter !== 'none' || i.textOver.length),
    stillWaiting: document.querySelectorAll('.revela-espera').length,
    pageHeight: document.documentElement.scrollHeight,
  };
})()`;

// Primera pantalla: cuánto ocupa la obra, si se ve entera y qué perdería si se la pusiera a sangre con object-fit: cover.
const HERO = `(() => {
  const img = document.querySelector('.hero img'); if (!img) return null;
  const r = img.getBoundingClientRect(); const vw = innerWidth, vh = innerHeight;
  const visH = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)); const visW = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0));
  const ratio = img.naturalWidth / img.naturalHeight;
  const muro = img.closest('.muro').getBoundingClientRect();
  const boxW = muro.width, boxH = muro.height;
  const coverScale = Math.max(boxW / img.naturalWidth, boxH / img.naturalHeight);
  const coverVisible = (boxW * boxH) / (img.naturalWidth * coverScale * img.naturalHeight * coverScale);
  const inView = (sel) => { const el = document.querySelector(sel); if (!el) return null; const b = el.getBoundingClientRect(); return b.top >= 0 && b.bottom <= vh; };
  return { viewport: [vw, vh], natural: [img.naturalWidth, img.naturalHeight], ratio: Math.round(ratio * 1000) / 1000,
    rendered: [Math.round(r.width), Math.round(r.height)], top: Math.round(r.top), bottom: Math.round(r.bottom),
    artworkVisiblePct: Math.round((visW * visH) / (r.width * r.height) * 1000) / 10,
    viewportCoveredByArtworkPct: Math.round((visW * visH) / (vw * vh) * 1000) / 10,
    muroBox: [Math.round(boxW), Math.round(boxH)],
    ifCoverInMuroVisiblePct: Math.round(coverVisible * 1000) / 10,
    ifCoverFullViewportVisiblePct: Math.round(Math.min(vw / (vh * ratio), (vh * ratio) / vw, 1) * 1000) / 10,
    h1InFirstScreen: inView('h1'), ctaInFirstScreen: inView('.hero .btn'),
    downscale: Math.round(img.naturalWidth / r.width * 10) / 10 };
})()`;

// Recorre la página y anota qué queda debajo del botón flotante visible, en cada posición de scroll.
const FLOATING = `(async () => { ${LIB}
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const fixed = [...document.querySelectorAll('body *')].filter((el) => getComputedStyle(el).position === 'fixed' && !el.closest('[hidden]'));
  const coveredText = {}; const coveredTargets = {}; let atEnd = []; let visibleSteps = 0; let steps = 0;
  const maxY = document.documentElement.scrollHeight - innerHeight;
  for (let y = 0; ; y = Math.min(maxY, y + Math.round(innerHeight / 4))) {
    scrollTo(0, y); await sleep(350); steps++;
    const shown = fixed.filter((f) => vis(f) && parseFloat(getComputedStyle(f).opacity) > 0.05);
    if (shown.length) visibleSteps++;
    const content = [...document.querySelectorAll('body *')].filter((el) => vis(el) && !fixed.some((f) => f.contains(el) || el.contains(f)));
    const hits = [];
    for (const f of shown) { const fr = f.getBoundingClientRect();
      for (const el of content) { if (!inter(fr, el.getBoundingClientRect())) continue;
        const label = el.tagName.toLowerCase() + ': ' + (txt(el) || el.getAttribute('alt')?.slice(0, 30) || '');
        if (el.matches('a[href],button')) { coveredTargets[label] = (coveredTargets[label] || 0) + 1; hits.push(label); }
        else if (hasText(el)) { coveredText[label] = (coveredText[label] || 0) + 1; hits.push(label); } } }
    if (y >= maxY) { atEnd = hits; break; }
  }
  scrollTo(0, 0); await sleep(350);
  const atTop = fixed.filter((f) => vis(f) && parseFloat(getComputedStyle(f).opacity) > 0.05).length;
  return { fixed: fixed.map((f) => f.className || f.tagName), steps, visibleSteps, shownAtTop: atTop > 0, coveredTargets, coveredText, coveredAtPageEnd: atEnd };
})()`;

const MOTION = `(() => [...document.querySelectorAll('*')].map((el) => { const s = getComputedStyle(el);
  const anim = s.animationName !== 'none' && parseFloat(s.animationDuration) > 0.01;
  const trans = s.transitionDuration.split(',').some((d) => parseFloat(d) > 0.01) && s.transitionProperty !== 'none';
  return anim || trans ? { el: el.tagName.toLowerCase() + '.' + String(el.className).slice(0, 30), animation: anim ? s.animationName + ' ' + s.animationDuration : null,
    transition: trans ? s.transitionProperty + ' ' + s.transitionDuration : null } : null; }).filter(Boolean))()`;

// Al cargar: lo que ya está en pantalla no puede quedar en espera (parpadearía); lo de abajo sí.
const LOAD_STATE = `(() => { const vh = innerHeight; const w = [...document.querySelectorAll('[data-revela]')];
  return { revealables: w.length, waiting: w.filter((e) => e.classList.contains('revela-espera')).length,
    waitingInFirstScreen: w.filter((e) => e.classList.contains('revela-espera') && e.getBoundingClientRect().top < vh).length,
    minOpacityWaiting: Math.min(1, ...w.filter((e) => e.classList.contains('revela-espera')).map((e) => parseFloat(getComputedStyle(e).opacity))) }; })()`;

const MENU = `(() => { ${LIB}
  const btn = document.querySelector('[data-menu-button]'); const panel = document.getElementById(btn.getAttribute('aria-controls'));
  const pr = panel.getBoundingClientRect();
  return { ariaExpanded: btn.getAttribute('aria-expanded'), panelVisible: vis(panel), role: panel.getAttribute('role'), ariaModal: panel.getAttribute('aria-modal'),
    coversViewport: pr.top <= 0 && pr.left <= 0 && pr.right >= innerWidth && pr.bottom >= innerHeight,
    focused: document.activeElement ? document.activeElement.tagName.toLowerCase() + ': ' + txt(document.activeElement) : null,
    mainInert: document.querySelector('main').inert, wspInert: document.querySelector('.wsp')?.inert,
    links: [...panel.querySelectorAll('a,button')].map((a) => { const r = a.getBoundingClientRect(); const s = getComputedStyle(a);
      const fg = over(parse(s.color), bgOf(a).bg); return { text: txt(a), w: Math.round(r.width), h: Math.round(r.height), contrast: Math.round(ratio(fg, bgOf(a).bg) * 100) / 100 }; }),
    scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth };
})()`;

async function setViewport(page, width, height) {
  const mobile = width < 768;
  await page.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
  await page.send('Emulation.setTouchEmulationEnabled', { enabled: mobile });
}

// Bytes transferidos por recurso (encodedDataLength), con caché desactivada para medir una primera visita.
function trackNetwork(page) {
  const urls = new Map(); const bytes = new Map();
  page.on('Network.requestWillBeSent', (p) => urls.set(p.requestId, p.request.url));
  page.on('Network.loadingFinished', (p) => bytes.set(p.requestId, p.encodedDataLength));
  return () => {
    const list = [...bytes].map(([id, b]) => ({ url: decodeURIComponent((urls.get(id) || '').split('/').slice(-2).join('/')), kb: Math.round(b / 102.4) / 10 }));
    return { totalKB: Math.round(list.reduce((s, r) => s + r.kb, 0)), requests: list.length, list: list.sort((a, b) => b.kb - a.kb) };
  };
}

const results = { base: BASE, date: new Date().toISOString(), pages: {} };
const browser = await launch({ port: 9371 });
results.chrome = browser.version.Browser;

for (const file of PAGES) {
  const name = file.replace('.html', '');
  const r = (results.pages[name] = {});
  for (const [width, height] of VIEWPORTS) {
    const page = await newPage(browser);
    try {
      await page.send('Network.setCacheDisabled', { cacheDisabled: true });
      const net = trackNetwork(page);
      await setViewport(page, width, height);
      await goto(page, BASE + file, { maxMs: 20000 });
      await sleep(500);
      const atLoad = net();
      const loadState = await evaluate(page, LOAD_STATE);
      const hero = await evaluate(page, HERO);
      await autoScroll(page, { stepMs: 150 });
      const facts = await evaluate(page, FACTS);
      Object.assign(facts, { viewport: [width, height], loadState, hero, transferAtLoad: { totalKB: atLoad.totalKB, requests: atLoad.requests }, transferFull: net() });
      if (file !== 'index.html') facts.floating = await evaluate(page, FLOATING);
      facts.motion = await evaluate(page, MOTION);
      if (width === 390 && file !== 'index.html') {
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
  if (file !== 'index.html') {
    const page = await newPage(browser);
    try {
      await setViewport(page, 390, 844);
      await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      await goto(page, BASE + file, { maxMs: 20000 });
      await sleep(400);
      r.reducedMotion = { animated: await evaluate(page, MOTION), load: await evaluate(page, LOAD_STATE) };
      await goto(page, 'about:blank', { maxMs: 2000 });
      await goto(page, BASE + file + '#menu', { maxMs: 20000 });
      await sleep(300);
      r.menuFromHash = await evaluate(page, MENU);
    } catch (e) {
      r.reducedMotion = { error: e.message };
    } finally {
      await page.close();
    }
  }
  writeFileSync(`${OUT_DIR}/verificar-${name}.json`, JSON.stringify(r, null, 2));
  console.log(`ok ${name}`);
}
await browser.close();

for (const [name, r] of Object.entries(results.pages)) {
  console.log(`\n## ${name}`);
  for (const [w] of VIEWPORTS) {
    const f = r[w];
    if (f.error) { console.log(`  ${w}px ERROR ${f.error}`); continue; }
    console.log(`  ${w}×${f.viewport[1]}: overflow ${f.scrollWidth > f.clientWidth ? 'SÍ' : 'no'} | h1 ${f.h1} | <16px ${f.textUnder16.length}`
      + ` | <44 ${f.smallTargets.filter((t) => !t.inline).length} (+${f.smallTargets.filter((t) => t.inline).length} inline)`
      + ` | contraste mín ${f.minContrast} fallas ${f.contrastFails.length} texto-en-muro ${f.textOnMuro.length}`
      + ` | imgs ${f.images.length} problemas ${f.imgProblems.length} | en espera tras scroll ${f.stillWaiting}`
      + ` | KB carga ${f.transferAtLoad.totalKB} / total ${f.transferFull.totalKB} | alto ${f.pageHeight}`);
    if (f.hero) console.log(`    hero: obra ${f.hero.rendered.join('×')} (${f.hero.artworkVisiblePct}% de la obra a la vista, ocupa ${f.hero.viewportCoveredByArtworkPct}% de la pantalla)`
      + ` | h1 en 1.ª pantalla ${f.hero.h1InFirstScreen} | botón ${f.hero.ctaInFirstScreen} | si fuera cover a pantalla completa se vería ${f.hero.ifCoverFullViewportVisiblePct}%`);
    if (f.floating) console.log(`    flotante: visible en ${f.floating.visibleSteps}/${f.floating.steps} posiciones, en el tope ${f.floating.shownAtTop}, tapa objetivos ${Object.keys(f.floating.coveredTargets).length}, al final ${f.floating.coveredAtPageEnd.length}`);
    if (f.menuOpen) console.log(`    menú: visible=${f.menuOpen.panelVisible} cubre=${f.menuOpen.coversViewport} foco="${f.menuOpen.focused}" inert=${f.menuOpen.mainInert}`
      + ` | <44 ${f.menuOpen.links.filter((l) => l.h < 44 || l.w < 44).length} | tras Esc foco="${f.menuAfterEsc.focused}" expanded=${f.menuAfterEsc.ariaExpanded}`);
  }
  if (r.reducedMotion) console.log(`  reduced-motion: ${r.reducedMotion.animated?.length} animados, en espera ${r.reducedMotion.load?.waiting} | #menu abre: ${r.menuFromHash?.panelVisible}`);
}
