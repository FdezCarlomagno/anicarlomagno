"""Genera versiones web livianas de las imágenes de src/ en src/optimized/ (mismas rutas relativas).

- Los originales NO se tocan.
- vite.config.js redirige cada import a la copia optimizada si existe (ver plugin "optimized-images").
- Se conserva el perfil de color (ICC) para que los colores de las obras no cambien.
- Solo se escribe la copia si realmente pesa menos que el original.

Uso (desde la raíz del proyecto):  python scripts/optimize-images.py
"""
import os
from PIL import Image, ImageOps

SRC = 'src'
OUT = os.path.join(SRC, 'optimized')
MAX_WIDTH = 1000
MIN_BYTES = 120_000          # lo más chico que esto ya está bien
QUALITY = 82
EXTS = ('.jpg', '.jpeg')

saved_total = 0
count = 0
for root, _dirs, files in os.walk(SRC):
    if os.path.normpath(root).startswith(os.path.normpath(OUT)):
        continue
    for name in files:
        if not name.lower().endswith(EXTS):
            continue
        path = os.path.join(root, name)
        size = os.path.getsize(path)
        if size < MIN_BYTES:
            continue
        with Image.open(path) as im:
            icc = im.info.get('icc_profile')
            im = ImageOps.exif_transpose(im)
            if im.mode not in ('RGB', 'L'):
                im = im.convert('RGB')
            if im.width > MAX_WIDTH:
                h = round(im.height * MAX_WIDTH / im.width)
                im = im.resize((MAX_WIDTH, h), Image.LANCZOS)
            dest = os.path.join(OUT, os.path.relpath(path, SRC))
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            kwargs = dict(format='JPEG', quality=QUALITY, optimize=True, progressive=True)
            if icc:
                kwargs['icc_profile'] = icc
            im.save(dest, **kwargs)
        new = os.path.getsize(dest)
        if new >= size:
            os.remove(dest)
            continue
        saved_total += size - new
        count += 1
        print(f'{size // 1024:>6} KB -> {new // 1024:>5} KB  {os.path.relpath(path, SRC)}')

print(f'\n{count} imágenes optimizadas, {saved_total / 1048576:.1f} MB menos.')
