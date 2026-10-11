// Phase 4: count raw design values (colors, fonts, sizes, radii, spacing, shadows, durations) in the legacy CSS.
// Values written through var(--…) are not counted, so the same script shows what is still raw after tokenizing.
// Usage: node design/tools/css-inventory.mjs [--json]
import { readFileSync } from 'node:fs';

const FILES = ['src/index.css', 'src/styles/fonts.css', 'src/LandingPage.css',
  ...['aboutMe', 'agendas', 'customPainting', 'laminas', 'legal', 'paintings', 'personalBook'].map((f) => `src/pages/pagesStyles/${f}.css`),
  ...['ContactForm', 'ContactSection', 'GoogleMap'].map((f) => `src/components/contact/styles/${f}.css`)];

const NAMED = ['aliceblue', 'blueviolet', 'white', 'black', 'gray', 'grey', 'yellow', 'red', 'green', 'blue', 'purple', 'violet', 'transparent'];
const COLOR_RE = new RegExp(`#[0-9a-fA-F]{3,8}\\b|rgba?\\([^)]*\\)|\\b(?:${NAMED.join('|')})\\b`, 'gi');
const LEN_RE = /-?\d*\.?\d+(?:px|rem|em|vh|vw|ch|%)?/g;

const groups = { color: {}, fontFamily: {}, fontSize: {}, fontWeight: {}, lineHeight: {}, letterSpacing: {}, radius: {}, spacing: {}, shadow: {}, duration: {}, easing: {} };
const add = (group, value, where) => {
  const g = groups[group];
  (g[value] ||= { count: 0, where: new Set() }).count++;
  g[value].where.add(where);
};

for (const file of FILES) {
  const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const short = file.replace(/^src\/(pages\/pagesStyles\/|components\/contact\/styles\/|styles\/)?/, '');
  for (const m of css.matchAll(/[{;]\s*(-{0,2}[a-zA-Z][\w-]*)\s*:\s*([^;{}]+)/g)) {
    const prop = m[1].toLowerCase();
    if (/^(src|unicode-range|font-display|content|grid-template-areas)$/.test(prop)) continue;
    const where = `${short}:${css.slice(0, m.index + m[0].indexOf(m[1])).split('\n').length}`;
    const raw = m[2].replace(/!important/, '').replace(/var\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
    if (!raw) continue;
    for (const c of raw.match(COLOR_RE) || []) if (c.toLowerCase() !== 'transparent') add('color', c.toLowerCase(), where);
    if (prop === 'font-family' && raw !== 'inherit') add('fontFamily', raw, where);
    if (prop === 'font-size') add('fontSize', raw, where);
    if (prop === 'font-weight') add('fontWeight', raw, where);
    if (prop === 'line-height') add('lineHeight', raw, where);
    if (prop === 'letter-spacing') add('letterSpacing', raw, where);
    if (/radius$/.test(prop)) add('radius', raw, where);
    if (/^(margin|padding|gap|row-gap|column-gap)(-(top|right|bottom|left))?$/.test(prop))
      for (const v of raw.match(LEN_RE) || []) if (!/^-?0(px|rem|%)?$/.test(v)) add('spacing', v, where);
    if (/^(box-shadow|text-shadow)$/.test(prop) && raw !== 'none') add('shadow', raw, where);
    if (/^(transition|animation)/.test(prop)) {
      for (const d of raw.match(/\b\d*\.?\d+m?s\b/g) || []) add('duration', d, where);
      for (const e of raw.match(/\b(ease-in-out|ease-in|ease-out|ease|linear|cubic-bezier\([^)]*\))/g) || []) add('easing', e, where);
    }
  }
}

if (process.argv.includes('--json')) {
  const out = Object.fromEntries(Object.entries(groups).map(([g, vals]) => [g, Object.fromEntries(Object.entries(vals).map(([v, o]) => [v, { count: o.count, where: [...o.where] }]))]));
  console.log(JSON.stringify(out, null, 2));
} else {
  for (const [g, vals] of Object.entries(groups)) {
    const rows = Object.entries(vals).sort((a, b) => b[1].count - a[1].count);
    console.log(`\n### ${g} (${rows.length} distinct, ${rows.reduce((n, [, o]) => n + o.count, 0)} uses)\n\n| Value | Uses | Where |\n|---|---|---|`);
    for (const [v, o] of rows) console.log(`| \`${v.replace(/\|/g, '\\|')}\` | ${o.count} | ${[...o.where].join(', ')} |`);
  }
}
