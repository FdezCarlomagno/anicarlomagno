// Phase 0: critical "do not break" flows. Captures the generated WhatsApp URLs WITHOUT opening them,
// and intercepts EmailJS locally (requests never leave the browser).
// Usage: node design/tools/flows.mjs [baseUrl] [outFile]
//        (defaults: http://localhost:4173, design/audits/raw/critical-flows[-$ONLY].json)
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { launch, newPage, setViewport, goto, evaluate, click, type, pressKey, sleep } from './cdp.mjs';

const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = process.argv[3] || `design/audits/raw/critical-flows${process.env.ONLY ? '-' + process.env.ONLY : ''}.json`;
mkdirSync(dirname(OUT), { recursive: true });

const GUARD = `
  window.__opens = [];
  window.open = function (url, target) { window.__opens.push({ url: String(url), target: String(target) }); return null; };
`;

let browser = await launch({ port: 9335 });
const out = { chrome: browser.version.Browser, base: BASE, date: new Date().toISOString(), flows: {}, failed: [] };
const save = () => writeFileSync(OUT, JSON.stringify(out, null, 2));

async function openPage(path, { width = 390, emailjs } = {}) {
  const page = await newPage(browser);
  await setViewport(page, width);
  await page.send('Page.addScriptToEvaluateOnNewDocument', { source: GUARD });
  await page.send('Network.setBlockedURLs', { urls: ['*whatsapp.com*', '*wa.me*'] });
  page.emailjsSeen = [];
  await page.send('Fetch.enable', { patterns: [{ urlPattern: '*emailjs*', requestStage: 'Request' }] });
  page.on('Fetch.requestPaused', async (p) => {
    page.emailjsSeen.push({ url: p.request.url, method: p.request.method, body: p.request.postData?.slice(0, 400) });
    const cors = [
      { name: 'Access-Control-Allow-Origin', value: '*' },
      { name: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
      { name: 'Access-Control-Allow-Headers', value: 'Content-Type' },
    ];
    if (emailjs === 'success' && p.request.method === 'OPTIONS')
      return page.send('Fetch.fulfillRequest', { requestId: p.requestId, responseCode: 204, responseHeaders: cors });
    await sleep(2000);
    if (emailjs === 'success')
      await page.send('Fetch.fulfillRequest', { requestId: p.requestId, responseCode: 200, body: Buffer.from('OK').toString('base64'), responseHeaders: cors });
    else await page.send('Fetch.failRequest', { requestId: p.requestId, errorReason: 'Failed' });
  });
  page.console = [];
  page.on('Runtime.consoleAPICalled', (p) => page.console.push(`${p.type}: ${p.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 200)}`));
  await goto(page, BASE + path, { maxMs: 15000 });
  await sleep(1200);
  return page;
}

const opens = (page) => evaluate(page, 'window.__opens');
const decode = (o) => {
  const u = new URL(o.url);
  return { host: u.host, phone: u.searchParams.get('phone'), target: o.target, text: u.searchParams.get('text') };
};
// Marks the element returned by a JS expression with a data attribute so it can be clicked by selector.
async function mark(page, js, id) {
  const ok = await evaluate(page, `(() => { const el = (${js}); if (!el) return false; el.setAttribute('data-p0', '${id}'); return true; })()`);
  if (!ok) throw new Error(`mark failed: ${id}`);
  return `[data-p0="${id}"]`;
}
const clickLabelOf = async (page, inputSel, id) => click(page, await mark(page, `document.querySelector('${inputSel}')?.closest('label')`, id));
async function setColor(page, sel, value) {
  await evaluate(page, `(() => { const el = document.querySelector('${sel}');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, '${value}');
    el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); })()`);
  await sleep(200);
}
const blur = (page) => evaluate(page, 'document.activeElement && document.activeElement.blur()');

async function run(name, fn) {
  if (process.env.ONLY && !name.includes(process.env.ONLY)) return;
  let err;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      out.flows[name] = await Promise.race([fn(), sleep(150000).then(() => { throw new Error('timeout'); })]);
      console.log(`ok ${name}`);
      err = null;
      break;
    } catch (e) {
      err = e;
      console.log(`fail ${name} attempt ${attempt}: ${e.message}`);
      await browser.close().catch(() => {});
      browser = await launch({ port: 9335 });
    }
  }
  if (err) out.failed.push({ flow: name, error: err.message });
  save();
}

// ---------- 1. Agenda personalizada ----------
const agendaState = (page) => evaluate(page, `({
  submitDisabled: document.querySelector('.btn-submit')?.disabled,
  submitText: document.querySelector('.btn-submit')?.innerText,
  total: document.querySelector('.price-value')?.innerText,
  toast: document.querySelector('.toast-notification')?.innerText ?? null,
  errors: [...document.querySelectorAll('.agendaCustomization .error-message')].map(e => e.innerText),
  previewAlt: document.querySelector('.myAgenda-img-container img')?.getAttribute('alt')?.slice(0, 80) ?? null,
})`);

async function agendaCombo(cfg) {
  const page = await openPage('/agenda-personalizada');
  try {
    const steps = { initial: await agendaState(page) };
    await clickLabelOf(page, `input[name=type][value=${cfg.type}]`, 'type');
    steps.afterType = await agendaState(page);
    await clickLabelOf(page, `input[name=paper][value=${cfg.paper}]`, 'paper');
    await click(page, '.agendaCustomization .dropDownImage-box', cfg.obra);
    if (cfg.username) {
      await type(page, '#username', cfg.username);
      await blur(page);
      if (cfg.color) await setColor(page, '#fontColor', cfg.color);
      if (cfg.position) await clickLabelOf(page, `input[name=textDirection][value=${cfg.position}]`, 'pos');
    }
    if (cfg.quote) {
      await clickLabelOf(page, 'input[name=checkbox]', 'chk');
      await type(page, '#quote', cfg.quote);
      await blur(page);
      if (cfg.uncheckQuoteAfter) {
        steps.withQuoteChecked = await agendaState(page);
        await clickLabelOf(page, 'input[name=checkbox]', 'chk2');
      }
    }
    if (cfg.other) await type(page, '#other', cfg.other);
    steps.beforeSubmit = await agendaState(page);
    await click(page, '.btn-submit');
    await sleep(200);
    steps.justAfterSubmit = await agendaState(page);
    await sleep(2600);
    steps.after2600ms = await agendaState(page);
    const o = await opens(page);
    return { cfg, steps, whatsapp: o.map(decode), console: page.console.filter((c) => !c.startsWith('log')) };
  } finally {
    await page.close();
  }
}

await run('agenda-1-perpetua-blanco-sin-extras', () => agendaCombo({ type: 'agenda-perpetua', paper: 'blanco', obra: 0 }));
await run('agenda-2-semanal-natural-nombre-frase', () =>
  agendaCombo({ type: 'agenda-semanal', paper: 'natural', obra: 1, username: 'María', color: '#8a2be2', position: 'arriba-derecha', quote: 'Creer es crear' }));
await run('agenda-3-cuadernoA4-blanco-nombre-comentario', () =>
  agendaCombo({ type: 'cuaderno-a4', paper: 'blanco', obra: 2, username: 'Sol', position: 'abajo-izquierda', other: 'Es para regalo' }));
await run('agenda-borde-frase-tildada-y-destildada', () =>
  agendaCombo({ type: 'cuaderno', paper: 'blanco', obra: 3, quote: 'Frase que no debería cobrarse', uncheckQuoteAfter: true }));
await run('agenda-validacion-nombre-corto', async () => {
  const page = await openPage('/agenda-personalizada');
  try {
    const initial = await agendaState(page);
    await clickLabelOf(page, 'input[name=type][value=agenda-docente]', 't');
    await clickLabelOf(page, 'input[name=paper][value=blanco]', 'p');
    await click(page, '.agendaCustomization .dropDownImage-box', 0);
    await type(page, '#username', 'Jo');
    await blur(page);
    await clickLabelOf(page, 'input[name=textDirection][value=arriba-izquierda]', 'pos');
    const beforeSubmit = await agendaState(page);
    await click(page, '.btn-submit');
    await sleep(300);
    const afterSubmit = await agendaState(page);
    const a11y = await evaluate(page, `(() => { const i = document.querySelector('#username'); return { ariaInvalid: i.getAttribute('aria-invalid'), ariaDescribedby: i.getAttribute('aria-describedby'), toastRole: document.querySelector('.toast-notification')?.getAttribute('role') ?? null }; })()`);
    return { initial, beforeSubmit, afterSubmit, a11y, whatsapp: (await opens(page)).map(decode) };
  } finally {
    await page.close();
  }
});

// ---------- 2. Consultar una obra ----------
await run('consultar-obra', async () => {
  const page = await openPage('/obras-en-stock');
  try {
    const catalog = await evaluate(page, `(() => { const cards = [...document.querySelectorAll('.paintingCard')];
      return { cards: cards.length,
        soldBadges: cards.filter(c => c.querySelector('.showInOffer p')?.innerText === 'VENDIDO').length,
        offerBadges: cards.filter(c => c.querySelector('.showInOffer p')?.innerText === '40% OFF').length,
        soldWithConsultButton: cards.filter(c => c.querySelector('.showInOffer p')?.innerText === 'VENDIDO' && c.querySelector('.addToCart')).length,
        first: { name: cards[0]?.querySelector('h1')?.innerText, size: cards[0]?.querySelector('h3')?.innerText } }; })()`);
    await click(page, '.addToCart', 0);
    const first = (await opens(page)).map(decode);
    await click(page, '.filter-btn', 1);
    const available = await evaluate(page, `document.querySelectorAll('.paintingCard').length`);
    await click(page, '.filter-btn', 2);
    const sold = await evaluate(page, `document.querySelectorAll('.paintingCard').length`);
    const filterA11y = await evaluate(page, `[...document.querySelectorAll('.filter-btn')].map(b => ({ text: b.innerText, ariaPressed: b.getAttribute('aria-pressed') }))`);
    return { catalog, filterCounts: { available, sold }, filterA11y, whatsapp: first };
  } finally {
    await page.close();
  }
});

// ---------- 3. Obra personalizada ----------
await run('obra-personalizada', async () => {
  const page = await openPage('/obra-personalizada');
  try {
    const st = () => evaluate(page, `({ submitDisabled: document.querySelector('.submit-btn').disabled, submitText: document.querySelector('.submit-btn').innerText,
      errors: [...document.querySelectorAll('.error-message')].map(e => e.innerText) })`);
    const initial = await st();
    await type(page, '#name', 'Lucía');
    await type(page, '#surname', 'Pérez');
    await type(page, '#size1', '5');
    await blur(page);
    const sizeTooSmall = await st();
    const a11y = await evaluate(page, `(() => { const i = document.querySelector('#size1'); return { ariaInvalid: i.getAttribute('aria-invalid'), ariaDescribedby: i.getAttribute('aria-describedby'), errorRole: document.querySelector('.error-message')?.getAttribute('role') ?? null }; })()`);
    await evaluate(page, `(() => { const el = document.querySelector('#size1'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el, ''); el.dispatchEvent(new Event('input', { bubbles: true })); })()`);
    await type(page, '#size1', '50');
    await type(page, '#size2', '70');
    await type(page, '#description', 'Retrato de mi abuela con flores y tonos cálidos');
    await clickLabelOf(page, '#customPhoto', 'photo');
    const beforeSubmit = await st();
    await click(page, '.submit-btn');
    await sleep(500);
    const afterSubmit = await st();
    const formKeptValues = await evaluate(page, `document.querySelector('#name').value`);
    await clickLabelOf(page, '#customPhoto', 'photo');
    const photoChecked = await evaluate(page, `document.querySelector('#customPhoto').checked`);
    await click(page, '.submit-btn');
    await sleep(500);
    return { initial, sizeTooSmall, a11y, beforeSubmit, afterSubmit, formKeptValuesAfterSubmit: formKeptValues, secondSubmitPhotoChecked: photoChecked, whatsapp: (await opens(page)).map(decode) };
  } finally {
    await page.close();
  }
});

// ---------- 4. Contacto (EmailJS interceptado localmente, nada sale del navegador) ----------
async function contactRun(mode) {
  const page = await openPage('/contacto', { emailjs: mode });
  try {
    const st = () => evaluate(page, `(() => { const f = document.querySelector('.contact-form'); const b = f.querySelector('button[type=submit]');
      return { valid: f.checkValidity(), firstInvalid: f.querySelector(':invalid')?.id ?? null, validationMessage: f.querySelector(':invalid')?.validationMessage ?? null,
        button: b.innerText, disabled: b.disabled,
        values: Object.fromEntries([...f.querySelectorAll('input,textarea')].map(i => [i.id, i.value])),
        toasts: [...document.querySelectorAll('[role=status]')].map(t => t.innerText).filter(Boolean) }; })()`);
    const res = { initial: await st() };
    await click(page, '.contact-form button[type=submit]');
    await sleep(400);
    res.emptySubmit = { ...(await st()), emailjsRequests: page.emailjsSeen.length };
    await type(page, '#nombre', 'Prueba');
    await type(page, '#apellido', 'Fase Cero');
    await type(page, '#email', 'prueba@');
    await type(page, '#mensaje', 'Mensaje de prueba local, no enviar.');
    await click(page, '.contact-form button[type=submit]');
    await sleep(400);
    res.invalidEmailSubmit = { ...(await st()), emailjsRequests: page.emailjsSeen.length };
    await type(page, '#email', 'example.com');
    await click(page, '.contact-form button[type=submit]');
    await sleep(600);
    res.duringSubmit = await st();
    await sleep(3000);
    res.afterInterceptedResponse = await st();
    res.emailjsIntercepted = page.emailjsSeen.map((r) => ({ url: r.url, method: r.method, bodyKeys: r.body ? Object.keys(JSON.parse(r.body)) : [], templateParamsKeys: r.body ? Object.keys(JSON.parse(r.body).template_params || {}) : [] }));
    res.labels = await evaluate(page, `[...document.querySelectorAll('.contact-form label')].map(l => ({ for: l.htmlFor, text: l.innerText }))`);
    res.autocomplete = await evaluate(page, `[...document.querySelectorAll('.contact-form input')].map(i => ({ id: i.id, autocomplete: i.getAttribute('autocomplete') }))`);
    return res;
  } finally {
    await page.close();
  }
}
await run('contacto-emailjs-falla-simulada', () => contactRun('fail'));
await run('contacto-emailjs-exito-simulado', () => contactRun('success'));

// ---------- 5. Botón flotante de WhatsApp ----------
await run('boton-flotante', async () => {
  const page = await openPage('/');
  try {
    const info = await evaluate(page, `(() => { const el = document.querySelector('.whatsappIcon'); const r = el.getBoundingClientRect();
      return { tag: el.tagName.toLowerCase(), role: el.getAttribute('role'), tabIndex: el.tabIndex, ariaLabel: el.getAttribute('aria-label'), imgAlt: el.querySelector('img')?.getAttribute('alt') ?? '(sin atributo alt)',
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } }; })()`);
    await click(page, '.whatsappIcon');
    const whatsapp = (await opens(page)).map(decode);
    // keyboard: can Tab ever reach it?
    let reached = false;
    const tabStops = [];
    for (let i = 0; i < 60; i++) {
      await pressKey(page, 'Tab', 'Tab', 9);
      const a = await evaluate(page, `(() => { const e = document.activeElement; const s = getComputedStyle(e);
        return { tag: e.tagName.toLowerCase(), text: (e.innerText || e.getAttribute('aria-label') || e.querySelector?.('img')?.alt || '').trim().slice(0, 30), isWsp: !!e.closest('.whatsappIcon'),
          outline: s.outlineStyle + ' ' + s.outlineWidth + ' ' + s.outlineColor }; })()`);
      if (a.isWsp) reached = true;
      if (i < 14) tabStops.push(a);
    }
    return { info, whatsapp, keyboardReachableIn60Tabs: reached, firstTabStops: tabStops };
  } finally {
    await page.close();
  }
});

// ---------- 6. Lámina ----------
await run('lamina', async () => {
  const page = await openPage('/laminas');
  try {
    const before = await evaluate(page, `({ price: document.querySelector('.lamina-price')?.innerText, toggle: document.querySelector('.dropDownAgendas-btn')?.innerText, toggleAria: document.querySelector('.dropDownAgendas-btn')?.getAttribute('aria-label') })`);
    await click(page, '.dropDownAgendas-btn');
    await sleep(400);
    const options = await evaluate(page, `[...document.querySelectorAll('.dropDownImage-box img')].map(i => i.alt)`);
    await click(page, '.dropDownImage-box', 0);
    await sleep(500);
    const chosen = await evaluate(page, `({ heading: document.querySelector('.chosen-lamina h2')?.innerText, button: document.querySelector('.chosen-lamina .buy-book-btn')?.innerText })`);
    await click(page, '.chosen-lamina .buy-book-btn');
    return { before, optionsAlts: options, chosen, whatsapp: (await opens(page)).map(decode) };
  } finally {
    await page.close();
  }
});

// ---------- 7. Libros ----------
await run('libros', async () => {
  const page = await openPage('/mi-libro');
  try {
    const prices = await evaluate(page, `[...document.querySelectorAll('.personalBook-price')].map(p => p.innerText)`);
    await click(page, '.buy-book-btn', 0);
    await click(page, '.buy-book-btn', 1);
    return { prices, whatsapp: (await opens(page)).map(decode) };
  } finally {
    await page.close();
  }
});

// ---------- 8. prefers-reduced-motion ----------
await run('reduced-motion', async () => {
  const page = await newPage(browser);
  try {
    await setViewport(page, 390);
    await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await page.send('Page.navigate', { url: BASE + '/elegir' });
    const samples = [];
    for (let i = 0; i < 6; i++) {
      await sleep(120);
      samples.push(await evaluate(page, `(() => { const h = document.querySelector('.choose-container h1'); if (!h) return null; const s = getComputedStyle(h); return { t: Math.round(performance.now()), opacity: s.opacity, transform: s.transform }; })()`).catch(() => null));
    }
    const matches = await evaluate(page, `matchMedia('(prefers-reduced-motion: reduce)').matches`);
    return { mediaMatches: matches, h1Samples: samples };
  } finally {
    await page.close();
  }
});

await browser.close();
console.log(`done; failed=${out.failed.length}`);
