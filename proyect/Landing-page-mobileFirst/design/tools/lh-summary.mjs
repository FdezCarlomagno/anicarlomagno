// Summarize Lighthouse JSON reports in design/audits/raw/lighthouse/.
// Usage: node design/tools/lh-summary.mjs
import { readdirSync, readFileSync } from 'node:fs';

const dir = 'design/audits/raw/lighthouse/';
for (const f of readdirSync(dir).filter((f) => f.endsWith('.report.json'))) {
  const j = JSON.parse(readFileSync(dir + f, 'utf8'));
  const a = j.audits;
  const r = f.replace('.report.json', '');
  console.log(`## ${r}  (LH ${j.lighthouseVersion}, ${j.configSettings.formFactor}, ${j.configSettings.throttlingMethod})`);
  const snippet = (obj) => (JSON.stringify(obj ?? {}).match(/"snippet":"((?:[^"\\]|\\.){0,140})/) || [])[1];
  console.log('  LCP element:', snippet(a['lcp-breakdown-insight']?.details) ?? snippet(a['largest-contentful-paint-element']?.details) ?? 'n/d');
  for (const id of ['image-delivery-insight', 'cache-insight', 'font-display-insight', 'render-blocking-insight', 'network-dependency-tree-insight'])
    if (a[id]) console.log(`  ${id}: ${a[id].displayValue ?? ''} score=${a[id].score}`);
  const items = (id, n = 6) => (a[id]?.details?.items ?? []).slice(0, n).map((i) => (i.node?.snippet ?? '').slice(0, 90));
  if (a['color-contrast']?.score < 1)
    console.log('  color-contrast:', (a['color-contrast'].details.items ?? []).slice(0, 5).map((i) => `${i.node.snippet.slice(0, 70)} :: ${(i.node.explanation ?? '').split('\n')[1]?.trim().slice(0, 110)}`));
  console.log('  link-name:', items('link-name'));
  console.log('  image-alt:', items('image-alt'));
  if (a['target-size']?.score < 1) console.log('  target-size:', items('target-size'));
  if (a['heading-order']?.score < 1) console.log('  heading-order:', items('heading-order', 3));
  console.log('  list/listitem:', items('list', 2), items('listitem', 2));
}
