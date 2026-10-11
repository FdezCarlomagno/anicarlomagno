// Phase 1: quick box/style probe of a few selectors (transforms and animations neutralized), for spot checks between full snapshots.
// Usage: node design/tools/probe-boxes.mjs <path> <selector>[,<selector>...] [baseUrl]   (default http://localhost:5173)
import { launch, newPage, setViewport, goto, autoScroll, evaluate, sleep } from './cdp.mjs';

const [path = '/', selectors = 'a', base = 'http://localhost:5173'] = process.argv.slice(2);
const browser = await launch({ port: 9353 });
try {
  for (const width of [390, 1280]) {
    const page = await newPage(browser);
    await setViewport(page, width);
    await goto(page, base + path, { maxMs: 15000 });
    await sleep(1200);
    await autoScroll(page, { stepMs: 150 });
    await evaluate(page, `(() => { const s = document.createElement('style');
      s.textContent = '*,*::before,*::after{transform:none!important;scale:none!important;translate:none!important;animation:none!important;transition:none!important}';
      document.head.appendChild(s); })()`);
    await sleep(300);
    const out = await evaluate(page, `(() => {
      const r1 = (n) => Math.round(n * 10) / 10;
      return ${JSON.stringify(selectors.split(','))}.flatMap((sel) => [...document.querySelectorAll(sel)].map((el) => {
        const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
        const t = [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
        let text = null;
        if (t) { const g = document.createRange(); g.selectNodeContents(t); const q = g.getBoundingClientRect(); text = [r1(q.x), r1(q.y + scrollY), r1(q.width), r1(q.height)]; }
        return { sel, box: [r1(r.x), r1(r.y + scrollY), r1(r.width), r1(r.height)], text,
          fontSize: s.fontSize, lineHeight: s.lineHeight, color: s.color, bg: s.backgroundColor, padding: s.padding, radius: s.borderRadius, display: s.display };
      }));
    })()`);
    console.log(`@${width}`);
    for (const o of out) console.log('  ' + JSON.stringify(o));
    await page.close();
  }
} finally {
  await browser.close();
}
