// Phase 0: /contacto deep scan including the cross-origin Google Maps iframe (out-of-process frame).
// Usage: node design/tools/contact-iframe.mjs [baseUrl]   (default http://localhost:4173)
import { writeFileSync } from 'node:fs';
import { launch, newPage, setViewport, sleep, evaluate } from './cdp.mjs';

const BASE = process.argv[2] || 'http://localhost:4173';
const browser = await launch({ port: 9336 });
const page = await newPage(browser);
const requests = [];
const cookieEvents = [];
const t0 = Date.now();
let phase = 'carga';

function track(sessionId, label) {
  browser.on((msg) => {
    if (msg.sessionId !== sessionId) return;
    if (msg.method === 'Network.requestWillBeSent') {
      const u = new URL(msg.params.request.url);
      if (u.protocol === 'data:' || u.protocol === 'blob:') return;
      requests.push({ frame: label, phase, ms: Date.now() - t0, host: u.host, path: u.pathname.slice(0, 50), type: msg.params.type });
    }
    if (msg.method === 'Network.responseReceivedExtraInfo') {
      const h = Object.entries(msg.params.headers || {}).find(([k]) => k.toLowerCase() === 'set-cookie');
      if (h || msg.params.blockedCookies?.length)
        cookieEvents.push({ frame: label, phase, setCookieNames: h ? h[1].split('\n').map((s) => s.split('=')[0]) : [],
          blocked: (msg.params.blockedCookies || []).map((b) => `${b.cookie?.name ?? b.cookieLine?.split('=')[0]}: ${b.blockedReasons.join('|')}`) });
    }
    if (msg.method === 'Network.requestWillBeSentExtraInfo' && msg.params.associatedCookies?.length)
      cookieEvents.push({ frame: label, phase, sentCookies: msg.params.associatedCookies.map((c) => `${c.cookie.name}${c.blockedReasons.length ? ' (blocked: ' + c.blockedReasons.join('|') + ')' : ''}`) });
  });
}

track(page.sessionId, 'top');
browser.on(async (msg) => {
  if (msg.method === 'Target.attachedToTarget') {
    const child = msg.params.sessionId;
    track(child, `iframe:${new URL(msg.params.targetInfo.url || 'about:blank').host || msg.params.targetInfo.type}`);
    await browser.send('Network.enable', {}, child).catch(() => {});
    await browser.send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: true, flatten: true }, child).catch(() => {});
    await browser.send('Runtime.runIfWaitingForDebugger', {}, child).catch(() => {});
  }
});
await page.send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: true, flatten: true });
await setViewport(page, 390);
await page.send('Page.navigate', { url: BASE + '/contacto' });
await sleep(8000);
const cookiesAtLoad = (await browser.send('Storage.getCookies', { browserContextId: page.browserContextId })).cookies;
phase = 'scroll';
await evaluate(page, 'window.scrollTo(0, document.body.scrollHeight)');
await sleep(6000);
const cookiesEnd = (await browser.send('Storage.getCookies', { browserContextId: page.browserContextId })).cookies;
const view = (c) => ({ domain: c.domain, name: c.name, session: c.session, expires: c.session ? null : new Date(c.expires * 1000).toISOString().slice(0, 10), sameSite: c.sameSite, partitioned: !!c.partitionKey });
const hosts = {};
for (const r of requests) {
  const k = `${r.frame} -> ${r.host}`;
  hosts[k] ??= { count: 0, phases: new Set(), types: new Set(), firstMs: r.ms };
  hosts[k].count++;
  hosts[k].phases.add(r.phase);
  hosts[k].types.add(r.type);
}
for (const k in hosts) { hosts[k].phases = [...hosts[k].phases]; hosts[k].types = [...hosts[k].types]; }
const out = { chrome: browser.version.Browser, base: BASE, date: new Date().toISOString(), hosts, cookieEvents, cookiesAtLoad: cookiesAtLoad.map(view), cookiesEnd: cookiesEnd.map(view) };
writeFileSync('design/audits/raw/contact-iframe.json', JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2).slice(0, 6000));
await page.close();
await browser.close();
