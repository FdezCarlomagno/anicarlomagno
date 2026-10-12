// Fase 4c: dimensiones, peso y señales de calidad de las imágenes de obra, leyendo solo los encabezados.
// JPEG: tamaño del SOF, orientación EXIF (si rota 90°, se informan las medidas ya giradas), progresivo o no,
// submuestreo de color y calidad estimada a partir de la tabla de cuantización de luminancia (escala de libjpeg).
// PNG: IHDR. Sin dependencias.
// Uso: node design/tools/image-headers.mjs [--json salida.json] carpeta-o-archivo...
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const args = process.argv.slice(2);
const jsonAt = args.indexOf('--json');
const jsonOut = jsonAt >= 0 ? args.splice(jsonAt, 2)[1] : null;
const roots = args.length ? args : ['src/components/imgs', 'src/pages/pagesStyles/paintingsImgs'];

// Tabla de luminancia estándar (Anexo K de JPEG), en orden zigzag como se guarda en DQT.
const STD_LUMA = [16, 11, 12, 14, 12, 10, 16, 14, 13, 14, 18, 17, 16, 19, 24, 40, 26, 24, 22, 22, 24, 49, 35, 37, 29, 40, 58, 51, 61, 60, 57, 51,
  56, 55, 64, 72, 92, 78, 64, 68, 87, 69, 55, 56, 80, 109, 81, 87, 95, 98, 103, 104, 103, 62, 77, 113, 121, 112, 100, 120, 92, 101, 103, 99];

function estimateQuality(table) {
  const scale = (table.reduce((s, v) => s + v, 0) / STD_LUMA.reduce((s, v) => s + v, 0)) * 100;
  const q = scale <= 100 ? (200 - scale) / 2 : 5000 / scale;
  return Math.max(1, Math.min(100, Math.round(q)));
}

function exifOrientation(buf, start, end) {
  if (buf.toString('ascii', start, start + 4) !== 'Exif') return 1;
  const t = start + 6;
  const le = buf.toString('ascii', t, t + 2) === 'II';
  const u16 = (o) => (le ? buf.readUInt16LE(o) : buf.readUInt16BE(o));
  const u32 = (o) => (le ? buf.readUInt32LE(o) : buf.readUInt32BE(o));
  const ifd = t + u32(t + 4);
  if (ifd + 2 > end) return 1;
  for (let i = 0, n = u16(ifd); i < n; i++) {
    const e = ifd + 2 + i * 12;
    if (e + 12 > end) break;
    if (u16(e) === 0x0112) return u16(e + 8);
  }
  return 1;
}

function jpeg(buf) {
  const out = { format: 'jpeg', orientation: 1, progressive: false, quality: null, subsampling: null };
  let o = 2;
  while (o < buf.length) {
    if (buf[o] !== 0xff) { o++; continue; }
    const m = buf[o + 1];
    if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { o += 2; continue; }
    if (m === 0xd9 || m === 0xda) break;
    const len = buf.readUInt16BE(o + 2);
    const seg = o + 4;
    if (m === 0xe1) out.orientation = exifOrientation(buf, seg, o + 2 + len);
    if (m === 0xdb) {
      for (let p = seg; p < o + 2 + len;) {
        const pq = buf[p] >> 4, tq = buf[p] & 15;
        const vals = [];
        for (let i = 0; i < 64; i++) vals.push(pq ? buf.readUInt16BE(p + 1 + i * 2) : buf[p + 1 + i]);
        if (tq === 0 && out.quality === null) out.quality = estimateQuality(vals);
        p += 1 + 64 * (pq ? 2 : 1);
      }
    }
    if ((m >= 0xc0 && m <= 0xcf) && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
      out.progressive = m === 0xc2;
      out.height = buf.readUInt16BE(seg + 1);
      out.width = buf.readUInt16BE(seg + 3);
      const comps = buf[seg + 5];
      if (comps >= 3) {
        const y = buf[seg + 7];
        const h = y >> 4, v = y & 15;
        out.subsampling = h === 2 && v === 2 ? '4:2:0' : h === 2 && v === 1 ? '4:2:2' : h === 1 && v === 1 ? '4:4:4' : `${h}x${v}`;
      }
    }
    o += 2 + len;
  }
  return out;
}

function png(buf) {
  return { format: 'png', width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), orientation: 1 };
}

const files = [];
const walk = (p) => {
  const s = statSync(p);
  if (s.isDirectory()) readdirSync(p).forEach((f) => walk(join(p, f)));
  else if (/\.(jpe?g|png)$/i.test(extname(p))) files.push(p);
};
roots.forEach(walk);

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const rows = files.map((f) => {
  const buf = readFileSync(f);
  const info = buf[0] === 0xff && buf[1] === 0xd8 ? jpeg(buf) : png(buf);
  const rotated = info.orientation >= 5 && info.orientation <= 8;
  const w = rotated ? info.height : info.width;
  const h = rotated ? info.width : info.height;
  const kb = Math.round(buf.length / 1024);
  const ratio = w / h;
  const g = gcd(w, h);
  return {
    file: relative('.', f).replaceAll('\\', '/'), width: w, height: h, kb,
    ratio: Math.round(ratio * 1000) / 1000, simple: `${w / g}:${h / g}`.length <= 9 ? `${w / g}:${h / g}` : null,
    orientation: ratio < 0.95 ? 'vertical' : ratio <= 1.05 ? 'cuadrada' : 'apaisada',
    bitsPerPixel: Math.round(((buf.length * 8) / (w * h)) * 100) / 100,
    format: info.format, quality: info.quality ?? null, progressive: info.progressive ?? null,
    subsampling: info.subsampling ?? null, exifOrientation: info.orientation,
  };
});

if (jsonOut) writeFileSync(jsonOut, JSON.stringify(rows, null, 2));
console.log('| Archivo | Ancho × alto | Proporción (an/al) | Orientación | KB | bits/px | Calidad JPEG est. | Submuestreo | EXIF |');
console.log('|---|---|---|---|---|---|---|---|---|');
for (const r of rows) {
  console.log(`| \`${r.file}\` | ${r.width} × ${r.height} | ${r.ratio}${r.simple ? ` (${r.simple})` : ''} | ${r.orientation} | ${r.kb} | ${r.bitsPerPixel} | ${r.quality ?? '—'} | ${r.subsampling ?? '—'} | ${r.exifOrientation} |`);
}
