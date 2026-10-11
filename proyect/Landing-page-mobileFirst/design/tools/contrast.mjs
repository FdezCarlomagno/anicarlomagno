// Phase 4: WCAG 2.2 contrast of every text/background pair found in the legacy CSS (translucent colors are
// composited over the surface they sit on). Pairs over photos/video can't be computed and are listed apart.
// Usage: node design/tools/contrast.mjs
const NAMED = { blueviolet: '#8a2be2', aliceblue: '#f0f8ff', white: '#ffffff', black: '#000000', gray: '#808080', yellow: '#ffff00' };

function parse(c) {
  c = NAMED[c] || c;
  let m = c.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) { const h = m[1].length === 3 ? [...m[1]].map((x) => x + x).join('') : m[1]; return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).concat(1); }
  m = c.match(/^rgba?\(([^)]+)\)$/);
  if (m) { const p = m[1].split(',').map(Number); return [p[0], p[1], p[2], p[3] ?? 1]; }
  throw new Error(`color? ${c}`);
}
const over = (top, base) => { const [r, g, b, a] = parse(top), [R, G, B] = Array.isArray(base) ? base : parse(base);
  return [r * a + R * (1 - a), g * a + G * (1 - a), b * a + B * (1 - a)]; };
const lum = ([r, g, b]) => [r, g, b].map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; })
  .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (fg, bg, base = 'white') => { const B = over(bg, base), F = over(fg, B); const [a, b] = [lum(F), lum(B)].sort((x, y) => y - x); return (a + 0.05) / (b + 0.05); };

// [text, background, base under a translucent background, where, size class: normal | large | ui]
const PAIRS = [
  ['blueviolet', 'white', 'white', 'Acento sobre blanco (links legales, precios, spans destacados)', 'normal'],
  ['blueviolet', 'aliceblue', 'white', 'Acento sobre aliceblue (subtítulo del logo en menú abierto, precios en formularios)', 'normal'],
  ['blueviolet', 'rgba(240, 248, 255, 0.836)', 'white', 'Acento sobre la barra de navegación (hover de links, subtítulo del logo)', 'normal'],
  ['white', 'blueviolet', 'white', 'Blanco sobre acento (botones principales)', 'normal'],
  ['aliceblue', 'blueviolet', 'white', 'Aliceblue sobre acento (skip link, botón "Mis obras")', 'normal'],
  ['#242424', 'rgba(255, 255, 255, 0.87)', 'white', 'Texto base (#242424) sobre el lienzo', 'normal'],
  ['#242424', 'aliceblue', 'white', 'Texto base sobre aliceblue (tarjetas, formularios)', 'normal'],
  ['#333', 'white', 'white', 'Gris 800 sobre blanco (títulos, labels, legales)', 'normal'],
  ['#333', 'aliceblue', 'white', 'Gris 800 sobre aliceblue (labels del formulario de agendas)', 'normal'],
  ['#444', 'white', 'white', 'Gris 700 sobre blanco (cita y relatos de Sobre mí)', 'normal'],
  ['#666', 'white', 'white', 'Gris 600 sobre blanco (subtítulos, ayudas)', 'normal'],
  ['#666', 'aliceblue', 'white', 'Gris 600 sobre aliceblue (textos de ayuda en formularios)', 'normal'],
  ['#666', '#f8f9fa', 'white', 'Gris 600 sobre gris 50 (línea de tiempo)', 'normal'],
  ['gray', 'white', 'white', 'Gris 550 (gray) como placeholder sobre blanco', 'normal'],
  ['rgb(136, 136, 136)', 'aliceblue', 'white', 'Gris 500 (#888) en la ficha de obra (.paintingInfoContainer p)', 'normal'],
  ['black', 'rgba(137, 43, 226, 0.274)', 'white', 'Negro sobre tinte de acento 27 % (tarjetas de agenda, botón Instagram)', 'normal'],
  ['black', 'rgb(186, 112, 255)', 'white', 'Negro sobre lila de hover (tarjetas de agenda, desktop)', 'normal'],
  ['white', '#a518cf', 'white', 'Blanco sobre orquídea (inicio de los degradés de Sobre mí)', 'normal'],
  ['white', '#764ba2', 'white', 'Blanco sobre ciruela (fin de los degradés de Sobre mí y del toast)', 'normal'],
  ['white', '#667eea', 'white', 'Blanco sobre periwinkle (inicio del degradé del toast)', 'normal'],
  ['#667eea', 'white', 'white', 'Periwinkle sobre blanco (títulos de estilo, 20.8 px semibold)', 'normal'],
  ['#667eea', 'white', 'white', 'Periwinkle sobre blanco (títulos de relatos, 24 px bold)', 'large'],
  ['#e74c3c', 'white', 'white', 'Error sobre blanco (asterisco requerido, mensajes de error)', 'normal'],
  ['#e74c3c', 'aliceblue', 'white', 'Error sobre aliceblue (mensajes de error del formulario de agendas)', 'normal'],
  ['white', '#e74c3c', 'white', 'Blanco sobre error (botón "Eliminar" agenda)', 'normal'],
  ['white', '#c0392b', 'white', 'Blanco sobre error hover', 'normal'],
  ['#27ae60', 'rgba(39, 174, 96, 0.1)', 'white', 'Éxito sobre su tinte (obra seleccionada)', 'normal'],
  ['#155724', '#d4edda', 'white', 'Alerta de éxito del formulario de contacto', 'normal'],
  ['#721c24', '#f8d7da', 'white', 'Alerta de error del formulario de contacto', 'normal'],
  ['white', '#35f59b', 'white', 'Blanco sobre menta (badge "NUEVO", 11.2 px bold)', 'normal'],
  ['white', '#5aeebd', 'white', 'Blanco sobre menta clara (fin del degradé del badge)', 'normal'],
  ['yellow', 'rgb(138, 0, 0)', 'white', 'Amarillo sobre bordó (cartel "40% OFF")', 'normal'],
  ['rgb(255, 255, 83)', 'rgba(184, 29, 29, 0.842)', 'white', 'Amarillo sobre rojo translúcido (precio del libro; base blanca = peor caso)', 'normal'],
  ['rgba(240, 248, 255, 0.685)', 'rgb(132, 63, 251)', 'white', 'Texto del footer sobre el violeta central del degradé', 'normal'],
  ['rgba(240, 248, 255, 0.685)', 'rgb(250, 70, 252)', 'white', 'Texto del footer sobre el fucsia del borde del degradé', 'normal'],
  ['aliceblue', 'rgb(132, 63, 251)', 'white', 'Links legales del footer sobre el violeta central', 'normal'],
  ['aliceblue', 'rgb(250, 70, 252)', 'white', 'Links legales del footer sobre el fucsia del borde', 'normal'],
  ['white', 'rgba(137, 43, 226, 0.795)', 'white', 'Blanco sobre acento 80 % (hover de botones de obra, desktop)', 'normal'],
  ['white', 'rgba(137, 43, 226, 0.85)', 'white', 'Blanco sobre acento 85 % (hover de botones de agendas)', 'normal'],
  ['white', 'rgba(156, 82, 224, 0.699)', 'white', 'Blanco sobre acento apagado (hover de enviar contacto y cargar mapa)', 'normal'],
  ['white', 'rgb(163, 74, 247)', 'white', 'Blanco sobre violeta claro (hover de "Elegir", desktop 24 px bold)', 'large'],
  ['white', '#9b4dca', 'white', 'Blanco sobre fin del degradé de "Enviar" (obra personalizada)', 'normal'],
  ['blueviolet', 'rgba(137, 43, 226, 0.05)', 'aliceblue', 'Acento sobre opción elegida (radio/checkbox marcados)', 'normal'],
  ['#ddd', 'white', 'white', 'Borde de inputs (#ddd) sobre blanco — no texto, 3:1', 'ui'],
  ['#ccc', 'white', 'white', 'Borde de inputs de contacto (#ccc) sobre blanco — no texto, 3:1', 'ui'],
  ['blueviolet', 'white', 'white', 'Anillo de foco violeta sobre blanco — no texto, 3:1', 'ui'],
  ['blueviolet', 'aliceblue', 'white', 'Anillo de foco violeta sobre aliceblue — no texto, 3:1', 'ui'],
];

console.log('| Texto | Fondo | Dónde | Ratio | Mínimo | Resultado |\n|---|---|---|---|---|---|');
for (const [fg, bg, base, where, size] of PAIRS) {
  const r = ratio(fg, bg, base), min = size === 'normal' ? 4.5 : 3;
  console.log(`| \`${fg}\` | \`${bg}\`${base !== 'white' ? ` sobre \`${base}\`` : ''} | ${where} | ${r.toFixed(2)}:1 | ${min}:1 | ${r >= min ? 'pasa' : '**no pasa**'} |`);
}
