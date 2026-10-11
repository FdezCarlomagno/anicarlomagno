// Phase 0: per-route DOM facts (a11y, headings, alt, targets, overflow) + console messages. No screenshots.
// Usage: node design/tools/dom-facts.mjs [baseUrl] [outFile]
//        (defaults: http://localhost:5173, design/audits/raw/dom-facts.json)
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { launch, newPage, setViewport, goto, autoScroll, evaluate, click, sleep } from './cdp.mjs';

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
