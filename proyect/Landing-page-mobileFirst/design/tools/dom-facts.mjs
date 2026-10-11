// Phase 0: per-route DOM facts (a11y, headings, alt, targets, overflow) + console messages. No screenshots.
// Usage: node design/tools/dom-facts.mjs [baseUrl] [outFile]
//        (defaults: http://localhost:5173, design/audits/raw/dom-facts.json)
// Phase 4: computed styles of every element (and ::before/::after) to prove token refactors change nothing.
//        node design/tools/dom-facts.mjs --styles <out.json> [baseUrl]
//        node design/tools/dom-facts.mjs --styles-diff <before.json> <after.json>
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { launch, newPage, setViewport, goto, autoScroll, evaluate, click, sleep } from './cdp.mjs';

if (process.argv[2] === '--styles-diff') {
  stylesDiff(process.argv[3], process.argv[4]);
  process.exit(0);
}
if (process.argv[2] === '--styles') {
  await stylesSnapshot(process.argv[3] || 'design/audits/raw/phase-4/styles.json', process.argv[4] || 'http://localhost:5173');
  process.exit(0);
}

const BASE = process.argv[2] || 'http://localhost:5173';
const OUT = process.argv[3] || 'design/audits/raw/dom-facts.json';
mkdirSync(dirname(OUT), { recursive: true });

const ROUTES = [
  ['/', 'home'],
  ['/elegir', 'elegir'],
  ['/obras-en-stock', 'obras-en-stock'],
  ['/obra-personalizada', 'obra-personalizada'],
  ['/agendas', 'agendas'],
  ['/agenda-personalizada', 'agenda-personalizada'],
  ['/mi-libro', 'mi-libro'],
  ['/laminas', 'laminas'],
  ['/sobre-mi', 'sobre-mi'],
  ['/contacto', 'contacto'],
];

const FACTS = `(() => {
  const vis = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0'; };
  const label = (el) => (el.getAttribute('aria-label') || el.innerText || el.value || el.name ||
    [...el.querySelectorAll('img')].map(i => i.alt).join(' ') || '').trim().replace(/\\s+/g, ' ').slice(0, 40);
  const imgs = [...document.images];
  const interactive = [...document.querySelectorAll('a[href],button,input,select,textarea,summary,[role=button],[tabindex]')].filter(vis);
  const small = interactive.filter(el => el.type !== 'hidden').map(el => {
      const r = el.getBoundingClientRect(); return { tag: el.tagName.toLowerCase(), text: label(el), w: Math.round(r.width), h: Math.round(r.height) }; })
    .filter(o => o.w < 44 || o.h < 44);
  const pointerEls = [...document.querySelectorAll('div,li,span,h1,h2,h3,article,p,img')].filter(el => vis(el)
      && getComputedStyle(el).cursor === 'pointer' && !el.closest('a,button,label')
      && !(el.parentElement && getComputedStyle(el.parentElement).cursor === 'pointer'))
    .map(el => ({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 40), text: label(el), tabIndex: el.tabIndex }));
  const vw = document.documentElement.clientWidth;
  const overflowing = [...document.querySelectorAll('body *')].filter(el => { const r = el.getBoundingClientRect(); return vis(el) && r.right > vw + 1; })
    .slice(0, 8).map(el => ({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 40), right: Math.round(el.getBoundingClientRect().right) }));
  return {
    url: location.pathname,
    title: document.title,
    lang: document.documentElement.lang,
    viewportMeta: document.querySelector('meta[name=viewport]')?.content,
    headings: [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => h.tagName + ': ' + h.textContent.trim().replace(/\\s+/g, ' ').slice(0, 50)),
    h1Count: document.querySelectorAll('h1').length,
    mainLandmarks: document.querySelectorAll('main,[role=main]').length,
    images: imgs.length,
    imgsWithoutAlt: imgs.filter(i => !i.hasAttribute('alt')).map(i => decodeURIComponent((i.currentSrc || i.src).split('/').pop()).slice(0, 50)),
    imgsEmptyAlt: imgs.filter(i => i.getAttribute('alt') === '').length,
    imgsAltSamples: [...new Set(imgs.map(i => i.getAttribute('alt')).filter(Boolean))].slice(0, 30),
    imgsWithoutWidthHeightAttrs: imgs.filter(i => !i.getAttribute('width') || !i.getAttribute('height')).length,
    imgsLazy: imgs.filter(i => i.loading === 'lazy').length,
    imgsLoaded: imgs.filter(i => i.complete && i.naturalWidth > 0).length,
    videos: [...document.querySelectorAll('video')].map(v => ({ src: decodeURIComponent(v.currentSrc.split('/').pop()), preload: v.preload, autoplay: v.autoplay, muted: v.muted, poster: v.poster || null })),
    iframes: [...document.querySelectorAll('iframe')].map(f => ({ src: f.src.slice(0, 60), loading: f.loading, title: f.title })),
    nestedInteractive: [...document.querySelectorAll('a button, button a, a a, button button, h1 button, h2 button')].map(el => el.tagName.toLowerCase() + ':' + label(el)),
    buttonsWithoutName: [...document.querySelectorAll('button')].filter(b => !label(b)).length,
    linksTarget: [...document.querySelectorAll('a[target]')].map(a => ({ href: a.href.slice(0, 70), target: a.target, rel: a.rel })),
    smallTargets: small,
    clickableNonSemantic: pointerEls,
    inputsFontSizeUnder16: [...document.querySelectorAll('input,textarea,select')].filter(vis).map(i => ({ id: i.id || i.name, fs: getComputedStyle(i).fontSize })).filter(o => parseFloat(o.fs) < 16),
    docScrollWidth: document.documentElement.scrollWidth, clientWidth: vw,
    overflowingElements: overflowing,
    pageHeight: document.documentElement.scrollHeight,
  };
})()`;

const withTimeout = (p, ms, what) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`timeout ${ms}ms: ${what}`)), ms))]);

let browser = await launch();
const results = { chrome: browser.version.Browser, base: BASE, date: new Date().toISOString(), routes: {}, failed: [] };
const save = () => writeFileSync(OUT, JSON.stringify(results, null, 2));

async function measure(path, name, width) {
  const page = await newPage(browser);
  try {
    const consoleMsgs = [];
    page.on('Runtime.consoleAPICalled', (p) => {
      if (['error', 'warning', 'warn'].includes(p.type))
        consoleMsgs.push(`${p.type}: ${p.args.map((a) => a.value ?? a.description ?? '').join(' ').replace(/\s+/g, ' ').slice(0, 240)}`);
    });
    page.on('Runtime.exceptionThrown', (p) => consoleMsgs.push(`exception: ${p.exceptionDetails.exception?.description?.slice(0, 240)}`));
    await setViewport(page, width);
    await goto(page, BASE + path, { maxMs: 15000 });
    await sleep(800);
    const atLoad = await evaluate(page, FACTS);
    await autoScroll(page, { stepMs: 200 });
    const facts = await evaluate(page, FACTS);
    facts.imgsLoadedAtLoad = atLoad.imgsLoaded;
    facts.consoleMessages = [...new Set(consoleMsgs)];
    if (width === 390 && path === '/') {
      await click(page, '.btnDisplayMenu');
      await sleep(900);
      facts.menuOpen = await evaluate(page, `(() => {
        const btn = document.querySelector('.btnDisplayMenu');
        const links = [...document.querySelectorAll('.displayMenu a')].map(a => { const r = a.getBoundingClientRect(); return { text: a.innerText.trim(), h: Math.round(r.height), w: Math.round(r.width) }; });
        return { buttonText: btn.innerText, ariaLabel: btn.getAttribute('aria-label'), ariaExpanded: btn.getAttribute('aria-expanded'), ariaControls: btn.getAttribute('aria-controls'),
          btnSize: [Math.round(btn.getBoundingClientRect().width), Math.round(btn.getBoundingClientRect().height)], links };
      })()`);
    }
    return facts;
  } finally {
    await page.close();
  }
}

for (const width of [390, 1280]) {
  for (const [path, name] of ROUTES) {
    const key = `${name}-${width}`;
    let lastErr;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        results.routes[key] = await withTimeout(measure(path, name, width), 90000, key);
        console.log(`ok ${key} (attempt ${attempt})`);
        lastErr = null;
        break;
      } catch (e) {
        lastErr = e;
        console.log(`fail ${key} attempt ${attempt}: ${e.message}`);
        await browser.close().catch(() => {});
        browser = await launch();
      }
    }
    if (lastErr) results.failed.push({ route: key, error: lastErr.message });
    save();
  }
}

await browser.close();
console.log(`done; failed=${results.failed.length}`);

// Transform/opacity/scale are left out on purpose: framer-motion and scroll-driven reveals set them per frame.
// Functions (not consts) because the --styles modes run before the Phase 0 code above.
function styleProps() { return ['display', 'position', 'color', 'backgroundColor', 'backgroundImage', 'backgroundSize', 'backgroundPosition',
  'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopStyle', 'borderBottomStyle',
  'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
  'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius',
  'boxShadow', 'textShadow', 'outlineStyle', 'outlineWidth', 'outlineColor', 'outlineOffset',
  'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'textAlign', 'textDecorationLine', 'textTransform',
  'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'rowGap', 'columnGap', 'columnCount', 'maxWidth', 'minWidth', 'maxHeight', 'minHeight', 'zIndex', 'top', 'right', 'bottom', 'left',
  'transitionProperty', 'transitionDuration', 'transitionTimingFunction', 'transitionDelay',
  'animationName', 'animationDuration', 'animationTimingFunction', 'animationDelay', 'animationIterationCount',
  'accentColor', 'caretColor', 'cursor', 'objectFit', 'content']; }

function stylesScript() { return `(() => {
  const props = ${JSON.stringify(styleProps())};
  const pick = (s) => props.map((p) => s[p]).join('|');
  const path = (el) => { const parts = []; for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const i = n.parentElement ? [...n.parentElement.children].indexOf(n) + 1 : 1;
      parts.unshift(n.tagName.toLowerCase() + ':' + i + (n.classList.length ? '.' + [...n.classList].join('.') : '')); }
    return parts.join('>'); };
  const out = {};
  for (const el of document.querySelectorAll('html, body, body *')) {
    if (el.closest('script,style,noscript,svg')) continue;
    const k = path(el);
    out[k] = pick(getComputedStyle(el));
    for (const pseudo of ['::before', '::after']) {
      const s = getComputedStyle(el, pseudo);
      if (s.content && s.content !== 'none' && s.content !== 'normal') out[k + pseudo] = pick(s);
    }
    if (el.matches('input,textarea')) out[k + '::placeholder'] = pick(getComputedStyle(el, '::placeholder'));
  }
  return out;
})()`; }

async function stylesSnapshot(outFile, base) {
  const routes = ['/', '/agendas', '/obras-en-stock', '/privacidad', '/elegir', '/obra-personalizada', '/agenda-personalizada',
    '/mi-libro', '/laminas', '/sobre-mi', '/contacto', '/terminos', '/no-existe'];
  mkdirSync(dirname(outFile), { recursive: true });
  let browser = await launch({ port: 9351 });
  const result = { base, date: new Date().toISOString(), chrome: browser.version.Browser, props: styleProps(), pages: {}, failed: [] };
  for (const width of [390, 1280]) {
    for (const path of routes) {
      const k = `${path}@${width}`;
      for (let attempt = 1; attempt <= 2; attempt++) {
        const page = await newPage(browser);
        try {
          await setViewport(page, width);
          await goto(page, base + path, { maxMs: 15000 });
          await sleep(1500);
          await autoScroll(page, { stepMs: 150 });
          result.pages[k] = await evaluate(page, stylesScript());
          console.log(`ok ${k}: ${Object.keys(result.pages[k]).length} nodes`);
          break;
        } catch (e) {
          console.log(`fail ${k} attempt ${attempt}: ${e.message}`);
          if (attempt === 2) result.failed.push({ page: k, error: e.message });
          await browser.close().catch(() => {});
          browser = await launch({ port: 9351 });
        } finally {
          await page.close().catch(() => {});
        }
      }
      writeFileSync(outFile, JSON.stringify(result));
    }
  }
  await browser.close();
  console.log(`saved ${outFile}; failed=${result.failed.length}`);
}

function stylesDiff(beforeFile, afterFile) {
  const A = JSON.parse(readFileSync(beforeFile, 'utf8'));
  const B = JSON.parse(readFileSync(afterFile, 'utf8'));
  let total = 0;
  for (const page of Object.keys({ ...A.pages, ...B.pages })) {
    const a = A.pages[page] || {}, b = B.pages[page] || {};
    const lines = [];
    for (const k of Object.keys({ ...a, ...b })) {
      if (!(k in a)) { lines.push(`+ ${k}`); continue; }
      if (!(k in b)) { lines.push(`- ${k}`); continue; }
      if (a[k] === b[k]) continue;
      const va = a[k].split('|'), vb = b[k].split('|');
      const changes = A.props.map((p, i) => (va[i] !== vb[i] ? `${p}: ${va[i]} -> ${vb[i]}` : null)).filter(Boolean);
      lines.push(`~ ${k}\n      ${changes.join('\n      ')}`);
    }
    total += lines.length;
    console.log(`\n## ${page}: ${Object.keys(a).length} vs ${Object.keys(b).length} nodes, ${lines.length ? lines.length + ' differences' : 'identical'}`);
    for (const l of lines) console.log('  ' + l);
  }
  console.log(`\nTOTAL differences: ${total}`);
}
