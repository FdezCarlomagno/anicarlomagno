// Phase 4: static proof that a token refactor is a no-op, including :hover/:focus/@media rules the DOM diff can't reach.
// Resolves every var(--…) defined in :root (src/styles/tokens.css + the file itself), normalizes colors, quotes and
// durations, and compares each declaration (with its selector/@media context) against the same file at <baseRef>.
// Usage: node design/tools/token-check.mjs <baseRef> <file.css> [more.css …]
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const NAMED = { blueviolet: [138, 43, 226], aliceblue: [240, 248, 255], white: [255, 255, 255], black: [0, 0, 0],
  gray: [128, 128, 128], grey: [128, 128, 128], yellow: [255, 255, 0] };

function parse(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const stack = [], out = [];
  let buf = '';
  const decl = () => {
    const b = buf.trim(); buf = '';
    const i = b.indexOf(':');
    if (!b || i < 0) return;
    out.push({ ctx: stack.join(' » '), prop: b.slice(0, i).trim(), value: b.slice(i + 1).trim() });
  };
  for (const ch of css) {
    if (ch === '{') { stack.push(buf.trim().replace(/\s+/g, ' ')); buf = ''; }
    else if (ch === ';') decl();
    else if (ch === '}') { decl(); stack.pop(); }
    else buf += ch;
  }
  return out;
}

const rootVars = (decls) => Object.fromEntries(decls.filter((d) => d.ctx === ':root' && d.prop.startsWith('--')).map((d) => [d.prop, d.value]));

function resolve(value, vars, depth = 0) {
  if (depth > 10) throw new Error(`var() cycle in ${value}`);
  const next = value.replace(/var\(\s*(--[\w-]+)\s*\)/g, (m, name) => (name in vars ? vars[name] : m));
  return next === value ? value : resolve(next, vars, depth + 1);
}

const rgba = (r, g, b, a = 1) => `rgba(${r},${g},${b},${+a})`;
function normalize(value) {
  return value
    .replace(/\s+/g, ' ').replace(/'/g, '"').trim()
    .replace(/#([0-9a-f]{3,8})\b/gi, (m, h) => {
      const x = h.length <= 4 ? [...h].map((c) => c + c).join('') : h;
      return rgba(parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16), x.length === 8 ? parseInt(x.slice(6), 16) / 255 : 1);
    })
    .replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/gi, (m, r, g, b, a) => rgba(r, g, b, a ?? 1))
    .replace(new RegExp(`(?<![\\w-])(${Object.keys(NAMED).join('|')})(?![\\w-])`, 'gi'), (m) => rgba(...NAMED[m.toLowerCase()]))
    .replace(/(?<![\w.-])(\d*\.?\d+)(ms|s)(?![\w-])/g, (m, n, u) => `${+(Number(n) * (u === 's' ? 1000 : 1)).toFixed(4)}ms`);
}

const tokens = rootVars(parse(readFileSync('src/styles/tokens.css', 'utf8')));
const [baseRef, ...files] = process.argv.slice(2);
let failures = 0;
for (const file of files) {
  const before = parse(execSync(`git show ${baseRef}:./${file}`, { encoding: 'utf8' }));
  const after = parse(readFileSync(file, 'utf8'));
  const key = (vars) => (d) => `${d.ctx} | ${d.prop}: ${normalize(resolve(d.value, vars))}`;
  const A = before.map(key(rootVars(before)));
  const B = after.map(key({ ...tokens, ...rootVars(after) }));
  const count = (list) => list.reduce((m, k) => m.set(k, (m.get(k) || 0) + 1), new Map());
  const ca = count(A), cb = count(B);
  const onlyBefore = [...ca].filter(([k, n]) => (cb.get(k) || 0) < n).map(([k]) => k);
  const onlyAfter = [...cb].filter(([k, n]) => (ca.get(k) || 0) < n).map(([k]) => k);
  const vars = after.filter((d) => /var\(--(color|font|space|radius|shadow|duration|ease)-/.test(d.value)).length;
  console.log(`\n## ${file}: ${before.length} → ${after.length} declarations, ${vars} use tokens, ${onlyBefore.length + onlyAfter.length ? 'DIFFERENT' : 'equivalent'}`);
  for (const k of onlyBefore) console.log(`  - ${k}`);
  for (const k of onlyAfter) console.log(`  + ${k}`);
  failures += onlyBefore.length + onlyAfter.length;
}
console.log(`\nTOTAL non-equivalent declarations: ${failures}`);
