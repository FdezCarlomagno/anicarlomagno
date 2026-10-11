// Phase 1: probe /laminas selector behavior (does choosing a print close the list? what does clicking the label text do?).
// Usage: node design/tools/probe-laminas.mjs [baseUrl]
import { launch, newPage, setViewport, goto, evaluate, click, sleep } from './cdp.mjs';

const BASE = process.argv[2] || 'http://localhost:5173';
const browser = await launch({ port: 9343 });
const page = await newPage(browser);
const state = () => evaluate(page, `({ open: document.querySelectorAll('.dropDownImage-box').length,
  chosen: document.querySelector('.chosen-lamina h2')?.innerText ?? null })`);
try {
  await setViewport(page, 390);
  await goto(page, BASE + '/laminas', { maxMs: 15000 });
  await sleep(1200);
  const r = { initial: await state() };
  await click(page, '.dropDownAgendas-btn');
  await sleep(400);
  r.afterToggle = await state();
  await click(page, '.dropDownImage-box', 1);
  await sleep(400);
  r.afterPickingSecond = await state();
  await click(page, '.dropDownArrow p');
  await sleep(400);
  r.afterClickingSeleccioneText = await state();
  await click(page, '.laminasContainer label h2');
  await sleep(400);
  r.afterClickingHeading = await state();
  console.log(JSON.stringify(r, null, 2));
} finally {
  await page.close();
  await browser.close();
}
