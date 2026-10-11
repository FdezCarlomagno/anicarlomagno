// Phase 1: keyboard-only walk (Tab / Shift+Tab / Enter / Space / Escape / arrows) with focus facts from the DOM.
// window.open is stubbed (records the URL, returns null) and WhatsApp hosts are blocked: no real chat is opened.
// Usage: node design/tools/keyboard.mjs <out.json> [baseUrl]   (default http://localhost:5173)
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { launch, newPage, setViewport, goto, evaluate, sleep } from './cdp.mjs';

const OUT = process.argv[2] || 'design/audits/raw/phase-1/keyboard.json';
const BASE = process.argv[3] || 'http://localhost:5173';
const PORT = Number(process.env.CDP_PORT || 9347);
const GUARD = `window.__opens = [];
  window.open = function (url, target) { window.__opens.push({ url: String(url), target: String(target) }); return null; };`;
const KEYS = {
  Tab: { key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 },
  Enter: { key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' },
  Space: { key: ' ', code: 'Space', windowsVirtualKeyCode: 32, text: ' ' },
  Escape: { key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 },
  ArrowRight: { key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 },
  ArrowDown: { key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 },
};
const withTimeout = (p, ms, what) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`timeout ${ms}ms: ${what}`)), ms))]);

async function press(page, name, { shift = false } = {}) {
  const k = KEYS[name];
  const modifiers = shift ? 8 : 0;
  await page.send('Input.dispatchKeyEvent', { type: k.text ? 'keyDown' : 'rawKeyDown', modifiers, ...k });
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', modifiers, ...k, text: undefined });
  await sleep(250);
}

// Describes document.activeElement: identity, focus ring, visibility and whether something covers it.
const ACTIVE = `(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return { tag: 'body' };
  const r = el.getBoundingClientRect();
  const s = getComputedStyle(el);
  const cx = Math.min(Math.max(r.x + r.width / 2, 0), innerWidth - 1), cy = Math.min(Math.max(r.y + r.height / 2, 0), innerHeight - 1);
  const top = document.elementFromPoint(cx, cy);
  const name = (el.getAttribute('aria-label') || el.innerText || el.value || [...el.querySelectorAll('img')].map(i => i.alt).join(' ') || '').replace(/\\s+/g, ' ').trim().slice(0, 50);
  return {
    tag: el.tagName.toLowerCase(), id: el.id || undefined, cls: String(el.className).slice(0, 40) || undefined, name,
    href: el.getAttribute('href') || undefined, expanded: el.getAttribute('aria-expanded') || undefined,
    pressed: el.getAttribute('aria-pressed') || undefined, checked: el.checked,
    focusVisible: el.matches(':focus-visible'),
    outline: s.outlineStyle === 'none' ? 'none' : s.outlineWidth + ' ' + s.outlineStyle + ' ' + s.outlineColor + ' offset ' + s.outlineOffset,
    boxShadow: s.boxShadow !== 'none' ? s.boxShadow.slice(0, 60) : undefined,
    rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)],
    inViewport: r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth,
    coveredBy: top && top !== el && !el.contains(top) && !top.contains(el) ? (top.tagName.toLowerCase() + '.' + String(top.className).slice(0, 30)) : null,
    clippedBy: (() => {
      // Ancestor with non-visible overflow that cuts the outline (box grown by outline width + offset).
      if (s.outlineStyle === 'none') return null;
      const g = parseFloat(s.outlineWidth) + parseFloat(s.outlineOffset);
      for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
        const ps = getComputedStyle(p);
        if (ps.overflowX === 'visible' && ps.overflowY === 'visible') continue;
        const q = p.getBoundingClientRect();
        if (r.left - g < q.left - 0.5 || r.right + g > q.right + 0.5 || r.top - g < q.top - 0.5 || r.bottom + g > q.bottom + 0.5)
          return p.tagName.toLowerCase() + '.' + String(p.className).slice(0, 30);
      }
      return null;
    })(),
    behind: (() => {
      // First ancestor that paints a background: what the ring is drawn against.
      for (let p = el.parentElement; p; p = p.parentElement) {
        const ps = getComputedStyle(p);
        if (ps.backgroundImage !== 'none') return 'image:' + p.tagName.toLowerCase() + '.' + String(p.className).slice(0, 25);
        if (ps.backgroundColor !== 'rgba(0, 0, 0, 0)') return ps.backgroundColor;
      }
      return 'canvas';
    })(),
    scrollY: Math.round(scrollY),
  };
})()`;

async function open(browser, path, width) {
  const page = await newPage(browser);
  await setViewport(page, width);
  await page.send('Page.addScriptToEvaluateOnNewDocument', { source: GUARD });
  await page.send('Network.setBlockedURLs', { urls: ['*whatsapp.com*', '*wa.me*'] });
  await goto(page, BASE + path, { maxMs: 15000 });
  await sleep(1500);
  return page;
}
const active = (page) => evaluate(page, ACTIVE);
const opens = async (page) => (await evaluate(page, 'window.__opens')).map((o) => {
  const u = new URL(o.url);
  return { host: u.host, phone: u.searchParams.get('phone'), target: o.target, text: u.searchParams.get('text') };
});
// Tab until the predicate (JS over document.activeElement as `el`) is true; returns the stops visited.
async function tabUntil(page, predicate, max = 80) {
  const stops = [];
  for (let i = 0; i < max; i++) {
    await press(page, 'Tab');
    const a = await active(page);
    stops.push(a);
    if (await evaluate(page, `(() => { const el = document.activeElement; return !!(${predicate}); })()`)) return { found: true, stops };
  }
  return { found: false, stops };
}
const short = (a) => `${a.tag}${a.id ? '#' + a.id : ''} "${a.name}" fv=${a.focusVisible} outline=${a.outline}${a.coveredBy ? ' COVERED by ' + a.coveredBy : ''}${a.clippedBy ? ' CLIPPED by ' + a.clippedBy : ''}${a.inViewport === false ? ' OFFSCREEN' : ''}`;
const ROUTES = ['/', '/elegir', '/obras-en-stock', '/obra-personalizada', '/agendas', '/agenda-personalizada', '/mi-libro', '/laminas', '/sobre-mi', '/contacto'];

const scenarios = {
  // Skip link, then the Tab order of Home.
  async homeOrder(browser, width) {
    const page = await open(browser, '/', width);
    try {
      await press(page, 'Tab');
      const first = await active(page);
      let afterSkip = null;
      if (/saltar/i.test(first.name)) {
        await press(page, 'Enter');
        afterSkip = await active(page);
      }
      const stops = [];
      for (let i = 0; i < 25; i++) { await press(page, 'Tab'); stops.push(short(await active(page))); }
      return { first, afterSkip, url: await evaluate(page, 'location.pathname + location.hash'), stops };
    } finally { await page.close(); }
  },
  // Mobile menu: open with Enter, walk links, try Escape, follow a link.
  async menu(browser, width) {
    const page = await open(browser, '/', width);
    try {
      const reach = await tabUntil(page, `el.classList.contains('btnDisplayMenu')`, 10);
      if (!reach.found) return { reached: false, stops: reach.stops.map(short) };
      await press(page, 'Enter');
      const opened = await evaluate(page, `({ expanded: document.querySelector('.btnDisplayMenu').getAttribute('aria-expanded'), links: [...document.querySelectorAll('#menu-principal a')].filter(a => a.getBoundingClientRect().height > 0).length })`);
      const linkStops = [];
      for (let i = 0; i < 7; i++) { await press(page, 'Tab'); linkStops.push(short(await active(page))); }
      await press(page, 'Escape');
      const afterEscape = await evaluate(page, `document.querySelector('.btnDisplayMenu').getAttribute('aria-expanded')`);
      // Back to the second link ("Obras") with Shift+Tab and follow it.
      for (let i = 0; i < 6; i++) await press(page, 'Tab', { shift: true });
      const beforeEnter = short(await active(page));
      await press(page, 'Enter');
      await sleep(800);
      return { reached: true, opened, linkStops, afterEscape, beforeEnter, path: await evaluate(page, 'location.pathname'),
        expandedAfterNav: await evaluate(page, `document.querySelector('.btnDisplayMenu').getAttribute('aria-expanded')`) };
    } finally { await page.close(); }
  },
  // Floating WhatsApp button: reach it with Tab and activate with Enter and Space.
  async whatsapp(browser, width) {
    const page = await open(browser, '/', width);
    try {
      const reach = await tabUntil(page, `el.classList.contains('whatsappIcon')`, 15);
      if (!reach.found) return { reached: false, stops: reach.stops.map(short) };
      const at = await active(page);
      await press(page, 'Enter');
      await press(page, 'Space');
      return { reached: true, tabsNeeded: reach.stops.length, at, opens: await opens(page) };
    } finally { await page.close(); }
  },
  // Photo slider on /agendas: next/prev and dots with Enter/Space.
  async slider(browser, width) {
    const page = await open(browser, '/agendas', width);
    const current = () => evaluate(page, `(() => { const d = [...document.querySelectorAll('.paintingSlider [aria-current]')].map(b => b.getAttribute('aria-label')); return d[0] ?? null; })()`);
    try {
      const reach = await tabUntil(page, `el.getAttribute('aria-label') === 'Foto siguiente'`, 40);
      if (!reach.found) return { reached: false };
      const at = await active(page);
      const r = { reached: true, at, start: await current() };
      await press(page, 'Enter'); r.afterEnter = await current();
      await press(page, 'Space'); r.afterSpace = await current();
      await press(page, 'Tab', { shift: true }); r.prevButton = short(await active(page));
      await press(page, 'Enter'); r.afterPrev = await current();
      return r;
    } finally { await page.close(); }
  },
  // Agenda form, keyboard only: type, paper, artwork, submit with Enter.
  async agendaForm(browser, width) {
    const page = await open(browser, '/agenda-personalizada', width);
    try {
      const r = {};
      r.type = await tabUntil(page, `el.name === 'type'`, 30).then((x) => x.found);
      await press(page, 'Space');
      r.typeChecked = await evaluate(page, `document.querySelector('input[name=type]:checked')?.value ?? null`);
      r.paper = await tabUntil(page, `el.name === 'paper'`, 10).then((x) => x.found);
      await press(page, 'Space');
      r.paperChecked = await evaluate(page, `document.querySelector('input[name=paper]:checked')?.value ?? null`);
      const pick = await tabUntil(page, `el.classList.contains('dropDownImage-box')`, 10);
      r.picker = pick.found;
      r.pickerFocus = short(await active(page));
      await press(page, 'ArrowRight');
      r.afterArrow = short(await active(page));
      await press(page, 'Space');
      r.total = await evaluate(page, `document.querySelector('.price-value')?.innerText ?? null`);
      const sub = await tabUntil(page, `el.classList.contains('btn-submit')`, 40);
      r.submitReached = sub.found;
      r.submitDisabled = await evaluate(page, `document.querySelector('.btn-submit')?.disabled`);
      r.tabsToSubmit = sub.stops.length;
      await press(page, 'Enter');
      await sleep(2500);
      r.opens = await opens(page);
      return r;
    } finally { await page.close(); }
  },
  // Tab through a whole route (until focus wraps or 150 stops) and flag stops without a visible ring, clipped or covered.
  async walk(browser, width, path) {
    const page = await open(browser, path, width);
    try {
      const stops = [];
      let first = null;
      for (let i = 0; i < 150; i++) {
        await press(page, 'Tab');
        const a = await active(page);
        const id = `${a.tag}|${a.name}|${a.href ?? ''}|${a.rect}|${a.scrollY}`;
        if (a.tag === 'body' || id === first) break;
        first ??= id;
        stops.push(a);
      }
      const noRing = stops.filter((a) => a.outline === 'none' && !a.boxShadow);
      return {
        stops: stops.length,
        noRing: noRing.map(short),
        clipped: stops.filter((a) => a.clippedBy).map(short),
        covered: stops.filter((a) => a.coveredBy).map(short),
        offscreen: stops.filter((a) => a.inViewport === false).map(short),
        rings: [...new Set(stops.map((a) => a.outline))],
        behind: [...new Set(stops.filter((a) => a.outline !== 'none').map((a) => `${a.behind} <- ${a.outline.split(' offset')[0]}`))],
      };
    } finally { await page.close(); }
  },
  // Print picker on /laminas: open with Enter, choose with Enter, Escape closes and returns focus, buy with Enter.
  async laminas(browser, width) {
    const page = await open(browser, '/laminas', width);
    try {
      const r = {};
      r.toggle = (await tabUntil(page, `el.classList.contains('dropDownAgendas-btn')`, 20)).found;
      await press(page, 'Enter');
      r.expanded = await evaluate(page, `document.querySelector('.dropDownAgendas-btn').getAttribute('aria-expanded')`);
      await press(page, 'Tab');
      r.firstOption = short(await active(page));
      await press(page, 'Escape');
      r.afterEscape = { expanded: await evaluate(page, `document.querySelector('.dropDownAgendas-btn').getAttribute('aria-expanded')`), focus: short(await active(page)) };
      await press(page, 'Enter');
      await press(page, 'Tab');
      await press(page, 'Enter');
      r.chosen = await evaluate(page, `document.querySelector('.chosen-lamina h2')?.innerText ?? null`);
      r.focusAfterChoose = short(await active(page));
      r.buy = (await tabUntil(page, `el.classList.contains('buy-book-btn')`, 10)).found;
      await press(page, 'Enter');
      r.opens = await opens(page);
      return r;
    } finally { await page.close(); }
  },
};

const result = { base: BASE, date: new Date().toISOString(), runs: {}, failed: [] };
let browser = await launch({ port: PORT });
result.chrome = browser.version.Browser;
const plan = [['homeOrder', 390], ['homeOrder', 1280], ['menu', 390], ['whatsapp', 390], ['whatsapp', 1280],
  ['slider', 390], ['agendaForm', 390], ['laminas', 390],
  ...ROUTES.flatMap((p) => [['walk', 390, p], ['walk', 1280, p]])];
for (const [name, width, path] of plan) {
  const key = `${name}${path ?? ''}@${width}`;
  if (process.env.ONLY && !key.startsWith(process.env.ONLY)) continue;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      result.runs[key] = await withTimeout(scenarios[name](browser, width, path), 240000, key);
      console.log(`ok ${key}`);
      break;
    } catch (e) {
      console.log(`fail ${key} attempt ${attempt}: ${e.message}`);
      if (attempt === 2) result.failed.push({ run: key, error: e.message });
      await browser.close().catch(() => {});
      browser = await launch({ port: PORT });
    }
  }
}
await browser.close();
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(result, null, 2));
console.log(`saved ${OUT}; failed=${result.failed.length}`);
