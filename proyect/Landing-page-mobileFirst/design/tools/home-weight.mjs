// Phase 0: bytes transferred by Home on a mobile viewport (390x844), production build served locally.
// Reports initial load (no scroll) and after scrolling the whole page. Also lab interaction latency.
// Usage: node design/tools/home-weight.mjs [baseUrl] [path]   (default http://localhost:4173 /)
import { writeFileSync } from 'node:fs';
import { launch, newPage, setViewport, goto, autoScroll, evaluate, click, sleep } from './cdp.mjs';

const BASE = process.argv[2] || 'http://localhost:4173';
const PATH = process.argv[3] || '/';
const browser = await launch({ port: 9337 });
const page = await newPage(browser);
await page.send('Network.setCacheDisabled', { cacheDisabled: true });
const res = new Map();
let phase = 'inicial';
page.on('Network.requestWillBeSent', (p) => res.set(p.requestId, { url: p.request.url, type: p.type, phase, bytes: 0 }));
page.on('Network.responseReceived', (p) => { const r = res.get(p.requestId); if (r) r.encoding = p.response.headers['content-encoding'] || p.response.headers['Content-Encoding'] || null; });
page.on('Network.dataReceived', (p) => { const r = res.get(p.requestId); if (r) r.bytes += p.encodedDataLength; });
page.on('Network.loadingFinished', (p) => { const r = res.get(p.requestId); if (r) r.finished = p.encodedDataLength; });
await setViewport(page, 390);
await page.send('Page.addScriptToEvaluateOnNewDocument', { source: `
  window.__lcp = null; window.__cls = 0; window.__events = [];
  new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp = { t: Math.round(e.startTime), el: e.element ? e.element.tagName + '.' + e.element.className : null, url: (e.url || '').split('/').pop(), size: e.size }; }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.interactionId) window.__events.push({ name: e.name, d: Math.round(e.duration) }); }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
` });
await goto(page, BASE + PATH, { quietMs: 2000, maxMs: 30000 });
await sleep(3000);
const vitalsUnthrottled = await evaluate(page, '({ lcp: window.__lcp, cls: +window.__cls.toFixed(4) })');
const sum = (f) => [...res.values()].filter(f).reduce((a, r) => a + (r.finished ?? r.bytes), 0);
const initial = sum((r) => r.phase === 'inicial');
phase = 'scroll';
await autoScroll(page, { stepMs: 400 });
await sleep(3000);
// lab interaction latency with 4x CPU slowdown: open/close the mobile menu
await page.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await click(page, '.btnDisplayMenu');
await sleep(800);
await click(page, '.btnDisplayMenu');
await sleep(800);
const events = await evaluate(page, 'window.__events');
const all = [...res.values()].map((r) => ({ ...r, b: r.finished ?? r.bytes }));
const byType = {};
for (const r of all) { byType[r.type] ??= { count: 0, bytes: 0 }; byType[r.type].count++; byType[r.type].bytes += r.b; }
const top = all.sort((a, b) => b.b - a.b).slice(0, 12).map((r) => ({ file: decodeURIComponent(r.url.split('/').pop()).slice(0, 50), type: r.type, phase: r.phase, kb: Math.round(r.b / 1024), encoding: r.encoding }));
const out = {
  chrome: browser.version.Browser, url: BASE + PATH, viewport: '390x844 (mobile emulation, sin throttling de red)', date: new Date().toISOString(),
  bytesInitialNoScroll: initial, bytesAfterFullScroll: sum(() => true),
  mbInitial: +(initial / 1048576).toFixed(2), mbTotal: +(sum(() => true) / 1048576).toFixed(2),
  requests: all.length, byType, top, vitalsUnthrottled, labInteractionEvents4xCPU: events,
};
writeFileSync(`design/audits/raw/weight${PATH === '/' ? '-home' : PATH.replace(/\//g, '-')}.json`, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
await page.close();
await browser.close();
