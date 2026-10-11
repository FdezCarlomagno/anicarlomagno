// Phase 0: cookies / storage / third-party requests per route. No form submission.
// Usage: node design/tools/third-parties.mjs [baseUrl]   (default http://localhost:4173)
import { writeFileSync, mkdirSync } from 'node:fs';
import { launch, newPage, setViewport, goto, autoScroll, evaluate, sleep } from './cdp.mjs';

const BASE = process.argv[2] || 'http://localhost:4173';
const RAW = 'design/audits/raw';
mkdirSync(RAW, { recursive: true });
const ROUTES = ['/', '/elegir', '/obras-en-stock', '/obra-personalizada', '/agendas', '/agenda-personalizada', '/mi-libro', '/laminas', '/sobre-mi', '/contacto'];
const FIRST_PARTY = new URL(BASE).host;

const STORAGE = `(async () => ({
  localStorage: Object.keys(localStorage),
  sessionStorage: Object.keys(sessionStorage),
  indexedDB: indexedDB.databases ? (await indexedDB.databases()).map(d => d.name) : 'n/a',
  cacheStorage: 'caches' in self ? await caches.keys() : 'n/a',
  serviceWorkers: navigator.serviceWorker ? (await navigator.serviceWorker.getRegistrations()).length : 'n/a',
  documentCookie: document.cookie,
}))()`;

const cookieView = (c) => ({
  domain: c.domain, name: c.name, session: c.session, expires: c.session ? null : new Date(c.expires * 1000).toISOString().slice(0, 10),
  httpOnly: c.httpOnly, secure: c.secure, sameSite: c.sameSite, partitionKey: c.partitionKey?.topLevelSite ?? c.partitionKey ?? null,
});

let browser = await launch({ port: 9334 });
const out = { chrome: browser.version.Browser, base: BASE, date: new Date().toISOString(), routes: {}, failed: [] };

async function scan(path) {
  const page = await newPage(browser);
  try {
    await setViewport(page, 390);
    let phase = 'carga';
    const reqs = new Map();
    const setCookieHeaders = [];
    page.on('Network.requestWillBeSent', (p) => {
      const u = new URL(p.request.url);
      if (u.protocol.startsWith('data') || u.protocol === 'blob:') return;
      reqs.set(p.requestId, { host: u.host, path: u.pathname.slice(0, 60), type: p.type, method: p.request.method, phase, frame: p.frameId });
    });
    page.on('Network.responseReceivedExtraInfo', (p) => {
      const h = Object.entries(p.headers || {}).find(([k]) => k.toLowerCase() === 'set-cookie');
      if (h || p.blockedCookies?.length)
        setCookieHeaders.push({ requestId: p.requestId, setCookie: h ? h[1].split('\n').map((s) => s.split(';')[0].split('=')[0]) : [], blocked: (p.blockedCookies || []).map((b) => `${b.cookie?.name ?? b.cookieLine?.split('=')[0]}:${b.blockedReasons.join('|')}`) });
    });
    await goto(page, BASE + path, { maxMs: 15000 });
    await sleep(1500);
    const cookiesAtLoad = (await browser.send('Storage.getCookies', { browserContextId: page.browserContextId })).cookies.map(cookieView);
    const storageAtLoad = await evaluate(page, STORAGE);
    phase = 'scroll';
    await autoScroll(page, { stepMs: 250 });
    await sleep(2500);
    const cookiesAfterScroll = (await browser.send('Storage.getCookies', { browserContextId: page.browserContextId })).cookies.map(cookieView);
    const storageAfterScroll = await evaluate(page, STORAGE);
    for (const s of setCookieHeaders) s.host = reqs.get(s.requestId)?.host;
    const all = [...reqs.values()];
    const third = all.filter((r) => r.host !== FIRST_PARTY);
    const byHost = {};
    for (const r of third) {
      const k = r.host;
      byHost[k] ??= { count: 0, phases: new Set(), types: new Set(), samplePaths: new Set() };
      byHost[k].count++;
      byHost[k].phases.add(r.phase);
      byHost[k].types.add(r.type);
      if (byHost[k].samplePaths.size < 3) byHost[k].samplePaths.add(r.path);
    }
    for (const k in byHost) for (const f of ['phases', 'types', 'samplePaths']) byHost[k][f] = [...byHost[k][f]];
    return {
      totalRequests: all.length,
      firstPartyRequests: all.length - third.length,
      thirdPartyByHost: byHost,
      cookiesAtLoad,
      cookiesAfterScroll,
      setCookieResponses: setCookieHeaders.map(({ requestId, ...r }) => r),
      storageAtLoad,
      storageAfterScroll,
    };
  } finally {
    await page.close();
  }
}

for (const path of ROUTES) {
  let err;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      out.routes[path] = await Promise.race([scan(path), sleep(120000).then(() => { throw new Error('timeout'); })]);
      console.log(`ok ${path}`);
      err = null;
      break;
    } catch (e) {
      err = e;
      console.log(`fail ${path} attempt ${attempt}: ${e.message}`);
      await browser.close().catch(() => {});
      browser = await launch({ port: 9334 });
    }
  }
  if (err) out.failed.push({ route: path, error: err.message });
  writeFileSync(`${RAW}/third-parties.json`, JSON.stringify(out, null, 2));
}
await browser.close();
console.log(`done; failed=${out.failed.length}`);
