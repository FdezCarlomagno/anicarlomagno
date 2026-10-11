// Phase 0: full-page screenshots at 390/1280 + per-route DOM facts + console messages.
// Usage: node design/tools/screenshots.mjs [baseUrl]   (default http://localhost:5173)
import { writeFileSync, mkdirSync } from 'node:fs';
import { launch, newPage, setViewport, goto, autoScroll, screenshot, evaluate, click, sleep } from './cdp.mjs';

const BASE = process.argv[2] || 'http://localhost:5173';
const OUT = 'design/baseline';
const RAW = 'design/audits/raw';
mkdirSync(OUT, { recursive: true });
mkdirSync(RAW, { recursive: true });

export const ROUTES = [
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
  const semantic = 'a[href],button,input,select,textarea,summary,label,[role=button],[tabindex]';
  const interactive = [...document.querySelectorAll(semantic)].filter(vis);
  const small = interactive.filter(el => el.tagName !== 'LABEL' && el.type !== 'hidden').map(el => {
      const r = el.getBoundingClientRect(); return { tag: el.tagName.toLowerCase(), text: label(el), w: Math.round(r.width), h: Math.round(r.height) }; })
    .filter(o => o.w < 44 || o.h < 44);
  const pointerDivs = [...document.querySelectorAll('div,li,span,h1,h2,h3,article,p,img')].filter(el => vis(el)
      && getComputedStyle(el).cursor === 'pointer' && !el.closest('a,button,label')
      && !(el.parentElement && getComputedStyle(el.parentElement).cursor === 'pointer'))
    .map(el => ({ tag: el.tagName.toLowerCase(), cls: (el.className && el.className.baseVal === undefined ? el.className : '').toString().slice(0, 40), text: label(el) }));
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
    imgsAltSamples: [...new Set(imgs.map(i => i.getAttribute('alt')).filter(Boolean))].slice(0, 25),
    imgsWithoutWidthHeightAttrs: imgs.filter(i => !i.getAttribute('width') || !i.getAttribute('height')).length,
    imgsLazy: imgs.filter(i => i.loading === 'lazy').length,
    videos: [...document.querySelectorAll('video')].map(v => ({ src: decodeURIComponent(v.currentSrc.split('/').pop()), preload: v.preload, autoplay: v.autoplay, muted: v.muted, poster: v.poster || null })),
    iframes: [...document.querySelectorAll('iframe')].map(f => ({ src: f.src.slice(0, 60), loading: f.loading, title: f.title })),
    nestedInteractive: document.querySelectorAll('a button, button a, a a, button button, a input, h1 button, h2 button').length,
    buttonsWithoutName: [...document.querySelectorAll('button')].filter(b => !label(b)).length,
    linksBlankTarget: [...document.querySelectorAll('a[target=blank]')].map(a => a.href),
    linksNoopener: [...document.querySelectorAll('a[target]')].map(a => ({ href: a.href.slice(0, 60), target: a.target, rel: a.rel })),
    smallTargets: small,
    clickableNonSemantic: pointerDivs,
    inputsFontSizeUnder16: [...document.querySelectorAll('input,textarea,select')].filter(vis).map(i => ({ id: i.id || i.name, fs: getComputedStyle(i).fontSize })).filter(o => parseFloat(o.fs) < 16),
    docScrollWidth: document.documentElement.scrollWidth, clientWidth: vw,
    overflowingElements: overflowing,
    pageHeight: document.documentElement.scrollHeight,
  };
})()`;

const browser = await launch();
const results = { chrome: browser.version.Browser, base: BASE, date: new Date().toISOString(), routes: {} };

for (const width of [390, 1280]) {
  for (const [path, name] of ROUTES) {
    const page = await newPage(browser);
    const consoleMsgs = [];
    page.on('Runtime.consoleAPICalled', (p) => {
      if (['error', 'warning', 'warn'].includes(p.type))
        consoleMsgs.push(`${p.type}: ${p.args.map((a) => a.value ?? a.description ?? '').join(' ').replace(/\s+/g, ' ').slice(0, 220)}`);
    });
    page.on('Runtime.exceptionThrown', (p) => consoleMsgs.push(`exception: ${p.exceptionDetails.exception?.description?.slice(0, 220)}`));
    await setViewport(page, width);
    await goto(page, BASE + path);
    await sleep(1000);
    const factsAtLoad = await evaluate(page, FACTS);
    await autoScroll(page);
    const facts = await evaluate(page, FACTS);
    facts.imgsLazyAtLoad = factsAtLoad.imgsLazy;
    facts.consoleMessages = [...new Set(consoleMsgs)];
    await screenshot(page, `${OUT}/${name}-${width}.png`);
    results.routes[`${name}-${width}`] = facts;
    console.log(`ok ${name}-${width} h=${facts.pageHeight} console=${facts.consoleMessages.length}`);

    if (width === 390 && path === '/') {
      await click(page, '.btnDisplayMenu');
      await sleep(900);
      await screenshot(page, `${OUT}/menu-abierto-390.png`, { fullPage: false });
      results.menuOpen = await evaluate(page, `(() => {
        const btn = document.querySelector('.btnDisplayMenu');
        const links = [...document.querySelectorAll('.displayMenu a')].map(a => { const r = a.getBoundingClientRect(); return { text: a.innerText.trim(), h: Math.round(r.height), w: Math.round(r.width) }; });
        return { buttonText: btn.innerText, ariaLabel: btn.getAttribute('aria-label'), ariaExpanded: btn.getAttribute('aria-expanded'), ariaControls: btn.getAttribute('aria-controls'), btnSize: [Math.round(btn.getBoundingClientRect().width), Math.round(btn.getBoundingClientRect().height)], links };
      })()`);
      console.log('ok menu-abierto-390');
    }
    await page.close();
  }
}

writeFileSync(`${RAW}/dom-facts.json`, JSON.stringify(results, null, 2));
await browser.close();
console.log('done');
