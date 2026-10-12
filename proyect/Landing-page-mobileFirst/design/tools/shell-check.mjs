// Phase 6: DOM evidence for the shell (nav, floating buttons, footer). No screenshots.
// Usage: node design/tools/shell-check.mjs [baseUrl]   (production build served, default http://localhost:4173)
import { launch, newPage, setViewport, goto, evaluate, sleep } from './cdp.mjs';

const BASE = process.argv[2] || 'http://localhost:4173';
const browser = await launch({ port: 9339 });
const out = {};
const rect = `(el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; }`;
for (const width of [360, 390, 768, 1280]) {
  const page = await newPage(browser);
  await setViewport(page, width);
  const r = {};
  for (const path of ['/', '/agendas', '/sobre-mi']) {
    await goto(page, BASE + path, { quietMs: 1000, maxMs: 20000 });
    r[path] = await evaluate(page, `(() => {
      const rect = ${rect};
      const nav = document.querySelector('.nav'), tog = document.querySelector('.nav-toggle');
      const links = [...document.querySelectorAll('.nav-links a')];
      const wsp = document.querySelector('.whatsappIcon'), foot = document.querySelector('.footer');
      const small = [...document.querySelectorAll('.nav a, .nav button, .footer a, .whatsappIcon')].filter(e => e.offsetParent !== null || getComputedStyle(e).position === 'fixed').filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && (b.height < 44 || b.width < 44); }).map(e => e.textContent.trim().slice(0, 25) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height));
      return {
        overflowX: document.documentElement.scrollWidth > innerWidth,
        nav: rect(nav), toggle: tog && getComputedStyle(tog).display !== 'none' ? rect(tog) : 'hidden',
        linkCount: links.length, current: links.filter(a => a.getAttribute('aria-current') === 'page').map(a => a.textContent),
        linksVisibleClosed: links.every(a => a.getBoundingClientRect().height > 0 && getComputedStyle(a.closest('ul')).visibility === 'visible'),
        wsp: rect(wsp), wspColor: getComputedStyle(wsp).color, wspBg: getComputedStyle(wsp).backgroundColor,
        footerBg: getComputedStyle(foot).backgroundColor, footerH: Math.round(foot.getBoundingClientRect().height),
        undersized: small, h1: document.querySelectorAll('h1').length,
      };
    })()`);
  }
  if (width < 768) {
    await goto(page, BASE + '/agendas', { quietMs: 1000, maxMs: 20000 });
    await evaluate(page, `document.querySelector('.nav-toggle').click()`);
    await sleep(500);
    r.menuOpen = await evaluate(page, `({
      expanded: document.querySelector('.nav-toggle').getAttribute('aria-expanded'), label: document.querySelector('.nav-toggle').textContent,
      focus: document.activeElement.textContent, mainInert: document.getElementById('contenido').inert, footerInert: document.querySelector('.footer').inert,
      panelVisible: getComputedStyle(document.querySelector('.nav-links')).visibility,
      linkHeights: [...document.querySelectorAll('.nav-links a')].map(a => Math.round(a.getBoundingClientRect().height)),
      panelBottom: Math.round(document.querySelector('.nav-links').getBoundingClientRect().bottom), vh: innerHeight })`);
    await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await sleep(500);
    r.afterEsc = await evaluate(page, `({ expanded: document.querySelector('.nav-toggle').getAttribute('aria-expanded'), focusIsToggle: document.activeElement === document.querySelector('.nav-toggle'), mainInert: document.getElementById('contenido').inert, panelVisible: getComputedStyle(document.querySelector('.nav-links')).visibility })`);
  }
  // scroll to the very end: floats must not cover footer text; scroll-to-top appears
  await goto(page, BASE + '/agendas', { quietMs: 1000, maxMs: 20000 });
  await evaluate(page, `window.scrollTo(0, document.documentElement.scrollHeight)`);
  await sleep(600);
  r.atEnd = await evaluate(page, `(() => {
    const rect = ${rect};
    const top = document.querySelector('.scrollToTopBtn'), wsp = document.querySelector('.whatsappIcon');
    const hit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
    const texts = [...document.querySelectorAll('.footer a, .footer p, .footer h2')].map(e => rect(e)).filter(t => t.w > 0);
    const wr = rect(wsp), tr = top ? rect(top) : null;
    return { topBtn: tr, wsp: wr, floatsOverlap: tr ? hit(wr, tr) : null, coverFooterText: texts.filter(t => hit(t, wr) || (tr && hit(t, tr))).length };
  })()`);
  out[width] = r;
}
console.log(JSON.stringify(out, null, 1));
process.exit(0);
