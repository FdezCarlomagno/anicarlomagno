# Fase 4c: obras elegidas para los prototipos

Datos medidos con `design/tools/image-headers.mjs` (sin dependencias; lee los encabezados de las 115 imágenes del
repo, resultado completo en `verificacion/imagenes.json`). Las obras se usan idénticas a los originales: no se
recortaron, recolorearon ni optimizaron (eso es la Fase 5).

## Criterios (en este orden)

1. **Proporción para celular:** vertical o casi cuadrada (aprox. 3:4, 4:5 o 1:1), para verla entera sin recortarla.
2. **Calidad:** ancho original de 1080 px o más (ideal 1600 px), sin artefactos visibles.
3. **Impacto:** color saturado, buen contraste y composición que sostenga una pantalla.
4. **Las dos etapas:** al menos una obra de cada estilo para "Mi recorrido".

## Selección

| Obra | Archivo | Medidas | Proporción | Peso | Calidad JPEG | Rol |
|---|---|---|---|---|---|---|
| Aurora | `paintingsImgs/Aurora.jpg` | 2693 × 3659 | 0,736 (vertical) | 1485 KB | 61 | Hero |
| VEIL | `paintingsImgs/VEIL.jpeg` | 1180 × 1600 | 0,738 (vertical) | 509 KB | 80 | Obras destacadas |
| Butterfly Queen | `paintingsImgs/Butterfly-Queen.jpeg` | 1207 × 1600 | 0,754 (vertical) | 428 KB | 80 | Obras destacadas |
| Vanessa | `paintingsImgs/Vanessa.jpeg` | 1598 × 1600 | 0,999 (cuadrada) | 673 KB | 80 | Obras destacadas |
| La Dama Dorada | `paintingsImgs/la-dama-dorada.jpeg` | 1200 × 1600 | 0,750 (3:4) | 488 KB | 80 | Tarjeta de obra |
| Lucía | `paintingsImgs/Lucia.jpeg` | 1280 × 1263 | 1,013 (cuadrada) | 298 KB | 75 | Recorrido, primera etapa |
| Helena | `paintingsImgs/Helena.jpeg` | 1092 × 1280 | 0,853 (vertical) | 252 KB | 75 | Recorrido, primera etapa |
| Euphoria | `paintingsImgs/EUPHORIA.jpeg` | 1600 × 1576 | 1,015 (cuadrada) | 600 KB | 80 | Recorrido, etapa actual |
| Scarlet | `paintingsImgs/Scarlet.jpeg` | 1168 × 1280 | 0,913 (vertical) | 251 KB | 75 | Recorrido, etapa actual |

Por qué cada una:

- **Aurora** es la única con tamaño de sobra para pantalla completa (2693 × 3659) y es vertical, así que entra entera en
  un celular. Es la más pesada y la de calidad JPEG más baja (61): la Fase 5 la tiene que regenerar desde el original.
- **VEIL, Butterfly Queen y La Dama Dorada** son verticales casi 3:4, con 1180 a 1207 px de ancho: entran enteras y
  alcanzan para 390 px con densidad 3x.
- **Vanessa, Lucía y Euphoria** son casi cuadradas: sirven para mostrar la obra entera sin recortar y para variar el ritmo.
- El resto del inventario (`verificacion/imagenes.json`) tiene las medidas de las otras 106 imágenes. No se revisó una por
  una a ojo: la selección sale de los criterios y de las medidas, y Ani puede proponer otras.

## Lo que hay que confirmar con Ani

Las obras del recorrido se agruparon **por rasgos de estilo, no por fecha** (Lucía y Helena, de figuración más
ordenada y contornos claros; Euphoria y Scarlet, de espátula y pincelada gruesa). **No sabemos a qué etapa pertenece
cada una.** Ani tiene que confirmarlo, y de paso elegir 2 a 4 obras clave por etapa. Los nombres de las etapas, los
años y los textos del recorrido son provisorios en los prototipos.
