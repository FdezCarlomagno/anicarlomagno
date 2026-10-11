// Print a compact per-route summary of design/audits/raw/dom-facts.json.
// Usage: node design/tools/dom-summary.mjs [390|1280]
import { readFileSync } from 'node:fs';

const width = process.argv[2] || '390';
const d = JSON.parse(readFileSync('design/audits/raw/dom-facts.json', 'utf8'));
const short = (s, n = 60) => String(s ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
for (const [key, r] of Object.entries(d.routes)) {
  if (!key.endsWith('-' + width)) continue;
  console.log(`## ${key}  ${r.url}`);
  console.log(`  title="${short(r.title, 80)}" h1=${r.h1Count} main=${r.mainLandmarks} imgs=${r.images} noAlt=${r.imgsWithoutAlt} emptyAlt=${r.imgsEmptyAlt} noWH=${r.imgsWithoutWidthHeightAttrs} lazy=${r.imgsLazy} height=${r.pageHeight} overflow=${r.docScrollWidth > r.clientWidth}`);
  console.log('  headings:', (r.headings ?? []).map((h) => `${h.tag ?? h.level}:${short(h.text, 30)}`).join(' | '));
  console.log('  altSamples:', JSON.stringify(r.imgsAltSamples ?? []).slice(0, 300));
  console.log('  nested:', (r.nestedInteractive ?? []).map((n) => short(typeof n === 'string' ? n : JSON.stringify(n), 80)).join(' || '));
  console.log('  noName:', JSON.stringify(r.buttonsWithoutName ?? []).slice(0, 200));
  console.log('  small:', (r.smallTargets ?? []).slice(0, 12).map((t) => `${short(t.text || t.label || t.tag, 20)}(${t.w}x${t.h})`).join(', '), `total=${(r.smallTargets ?? []).length}`);
  console.log('  clickNonSem:', (r.clickableNonSemantic ?? []).slice(0, 6).map((t) => `${t.tag}.${short(t.cls, 25)}`).join(', '), `total=${(r.clickableNonSemantic ?? []).length}`);
  console.log('  inputs<16:', JSON.stringify(r.inputsFontSizeUnder16 ?? []).slice(0, 200));
  console.log('  iframes:', JSON.stringify(r.iframes ?? []).slice(0, 200), 'videos:', JSON.stringify(r.videos ?? []).slice(0, 250));
  console.log('  console:', (r.consoleMessages ?? []).map((m) => short(m.text ?? m, 90)).join(' || '));
  if (r.menuOpen) console.log('  menuOpen:', JSON.stringify(r.menuOpen).slice(0, 400));
}
console.log('failed:', JSON.stringify(d.failed));
