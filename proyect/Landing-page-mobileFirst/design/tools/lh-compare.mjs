// Compare two folders of Lighthouse JSON reports (same file names) and list failing a11y audits.
// Usage: node design/tools/lh-compare.mjs <beforeDir> <afterDir>
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const [beforeDir, afterDir] = process.argv.slice(2);
const cats = ['performance', 'accessibility', 'best-practices', 'seo'];
const load = (dir, f) => (existsSync(join(dir, f)) ? JSON.parse(readFileSync(join(dir, f), 'utf8')) : null);
const score = (j, c) => (j?.categories[c]?.score == null ? 'n/d' : Math.round(j.categories[c].score * 100));
const failing = (j) => {
  if (!j) return [];
  const ids = j.categories.accessibility.auditRefs.filter((r) => r.weight > 0).map((r) => r.id);
  return ids.filter((id) => {
    const a = j.audits[id];
    return a && a.scoreDisplayMode !== 'notApplicable' && a.scoreDisplayMode !== 'manual' && a.score !== null && a.score < 1;
  });
};
const lcp = (j) => j?.audits['largest-contentful-paint']?.displayValue ?? 'n/d';

console.log('| Ruta | Perf | A11y | BP | SEO | LCP | A11y que fallan (después) |');
console.log('|---|---|---|---|---|---|---|');
for (const f of readdirSync(afterDir).filter((f) => f.endsWith('.report.json')).sort()) {
  const a = load(beforeDir, f);
  const b = load(afterDir, f);
  const cells = cats.map((c) => `${score(a, c)} → ${score(b, c)}`);
  console.log(`| ${f.replace('.report.json', '')} | ${cells.join(' | ')} | ${lcp(a)} → ${lcp(b)} | ${failing(b).join(', ') || '—'} |`);
}
console.log('\nFallas a11y antes / después por ruta:');
for (const f of readdirSync(afterDir).filter((f) => f.endsWith('.report.json')).sort()) {
  const a = load(beforeDir, f);
  const b = load(afterDir, f);
  console.log(`- ${f.replace('.report.json', '')}: antes [${failing(a).join(', ')}] · después [${failing(b).join(', ')}]`);
  for (const id of failing(b)) {
    const items = (b.audits[id].details?.items ?? []).slice(0, 4).map((i) => (i.node?.snippet ?? JSON.stringify(i).slice(0, 80)).slice(0, 110));
    console.log(`    ${id}: ${items.join(' | ')}`);
  }
}
