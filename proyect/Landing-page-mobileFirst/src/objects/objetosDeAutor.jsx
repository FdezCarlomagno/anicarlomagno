import pintadaCelesteEstudio from '../components/imgs/objetos/pintada-celeste-estudio.jpg';
import pintadaCelesteRetrato from '../components/imgs/objetos/pintada-celeste-retrato.jpg';
import pintadaFucsiaRetrato from '../components/imgs/objetos/pintada-fucsia-retrato.jpg';
import pintadaCelesteRoma from '../components/imgs/objetos/pintada-celeste-roma.jpg';
import pintadaCelesteTaller from '../components/imgs/objetos/pintada-celeste-taller.jpg';
import pintadaFridaPuesta from '../components/imgs/objetos/pintada-frida-puesta.jpg';
import pintadaFridaSola from '../components/imgs/objetos/pintada-frida-sola.jpg';
import pintadaFridaVerde from '../components/imgs/objetos/pintada-frida-verde.jpg';
import pintadaFridaFucsia from '../components/imgs/objetos/pintada-frida-fucsia.jpg';
import pintadaFridaNaranja from '../components/imgs/objetos/pintada-frida-naranja.jpg';
import estampadaBlanca from '../components/imgs/objetos/estampada-blanca.jpg';
import estampadaBlancaPuesta from '../components/imgs/objetos/estampada-blanca-puesta.jpg';
import estampadaGris from '../components/imgs/objetos/estampada-gris.jpg';
import estampadaGrisPuesta from '../components/imgs/objetos/estampada-gris-puesta.jpg';
import estampadaNegra from '../components/imgs/objetos/estampada-negra.jpg';
import estampadaNegraFlorencia from '../components/imgs/objetos/estampada-negra-florencia.jpg';
import taza from '../components/imgs/objetos/taza-hecha-en-argentina.jpg';

// Diseños de la remera pintada a mano. Cada uno es una pestaña con su carrusel y sus paletas.
// Un diseño con `fotos` muestra esas fotos con cualquier paleta, y la primera paleta es la que se ve en ellas.
// Un diseño sin `fotos` usa las de cada paleta.
// El orden importa: la página arranca en el primero y, si nadie toca nada, pasa sola al siguiente.
const OTRA_PALETA = { id: 'otra', label: 'Otra, la charlamos', swatch: null };

export const DISENOS = [
    {
        id: 'mujer-argentina',
        label: 'Mujer argentina',
        fotos: [
            { src: pintadaCelesteEstudio, width: 1254, height: 1254, alt: 'Ani con una remera blanca pintada a mano: rostro de mujer entre franjas celestes y una banda de pan de oro sobre los ojos' },
            { src: pintadaFucsiaRetrato, width: 900, height: 1600, alt: 'La misma remera pintada a mano en paleta fucsia, con trazos azules y dorado' },
            { src: pintadaCelesteRetrato, width: 900, height: 1600, alt: 'Ani frente a uno de sus cuadros, con la remera pintada a mano en paleta celeste' },
            { src: pintadaCelesteRoma, width: 900, height: 1600, alt: 'Remera pintada a mano celeste, puesta, en la escalinata de Plaza de España en Roma' },
            { src: pintadaCelesteTaller, width: 894, height: 1600, alt: 'Remera pintada a mano celeste sobre una mesa de taller con paletas y pinceles' },
        ],
        paletas: [
            { id: 'celeste', label: 'Celeste y dorado', swatch: ['#3fb8e0', '#c9a227'] },
            { id: 'fucsia', label: 'Fucsia y azul', swatch: ['#e0338f', '#2446a8'] },
            OTRA_PALETA,
        ],
    },
    {
        id: 'frida',
        label: 'Frida en trazo',
        nuevo: true,
        // Año pintado arriba del retrato. Se puede pedir con el año de nacimiento de quien compra.
        anio: '1978',
        // Cada paleta trae sus fotos: el carrusel muestra las de la paleta elegida.
        paletas: [
            {
                id: 'turquesa',
                label: 'Turquesa y lavanda',
                swatch: ['#2fbfae', '#7f8fe3'],
                fotos: [
                    { src: pintadaFridaPuesta, width: 900, height: 1600, alt: 'Ani en el mar con la remera Frida en trazo: retrato de Frida con turbante en trazo azul, entre franjas turquesa y lavanda, y el año 1978 arriba' },
                    { src: pintadaFridaSola, width: 1600, height: 1600, alt: 'La remera Frida en trazo extendida sobre una mesa de madera: retrato en trazo azul entre franjas turquesa y lavanda' },
                ],
            },
            {
                id: 'verde',
                label: 'Verde, amarillo y celeste',
                swatch: ['#3a9b3f', '#f0c419', '#5ab4e5'],
                fotos: [
                    { src: pintadaFridaVerde, width: 1600, height: 1600, alt: 'La remera Frida en trazo sobre una mesa de madera: retrato en trazo azul entre franjas verdes, amarillas y celestes, con el año 1978 arriba' },
                ],
            },
            {
                id: 'fucsia',
                label: 'Fucsia, rosa y turquesa',
                swatch: ['#d6337f', '#ec8fbd', '#2bb7b3'],
                fotos: [
                    { src: pintadaFridaFucsia, width: 1600, height: 1600, alt: 'La remera Frida en trazo sobre una mesa de madera: retrato en trazo azul entre franjas fucsia, rosa y turquesa, con el año 1978 en blanco arriba' },
                ],
            },
            {
                id: 'naranja',
                label: 'Naranja, amarillo y rojo',
                swatch: ['#f07a2e', '#f5b335', '#e0413a'],
                fotos: [
                    { src: pintadaFridaNaranja, width: 1600, height: 1600, alt: 'La remera Frida en trazo sobre una mesa de madera: retrato en trazo azul entre franjas naranjas, amarillas y rojas, con el año 1978 arriba' },
                ],
            },
        ],
    },
];

// Remera estampada "Hecha en Argentina": una por color, sola y puesta.
// `pos` encuadra la foto puesta en el marco 3:4 del par (la foto completa se ve en el visor).
export const COLORES = [
    {
        id: 'blanca',
        label: 'Blanca',
        swatch: '#ffffff',
        sola: { src: estampadaBlanca, width: 1024, height: 1536, alt: 'Remera blanca estampada con el diseño Hecha en Argentina' },
        puesta: { src: estampadaBlancaPuesta, width: 900, height: 1600, pos: '50% 72%', alt: 'Ani con la remera blanca Hecha en Argentina junto al Ponte Vecchio, en Florencia' },
    },
    {
        id: 'gris',
        label: 'Gris',
        swatch: '#9a9a9a',
        sola: { src: estampadaGris, width: 1133, height: 1388, alt: 'Remera gris estampada con el diseño Hecha en Argentina' },
        puesta: { src: estampadaGrisPuesta, width: 900, height: 1600, pos: '50% 48%', alt: 'Ani con la remera gris Hecha en Argentina en la orilla del mar' },
    },
    {
        id: 'negra',
        label: 'Negra',
        swatch: '#1b1b1b',
        sola: { src: estampadaNegra, width: 1074, height: 1600, alt: 'Remera negra estampada con el diseño Hecha en Argentina' },
        puesta: { src: estampadaNegraFlorencia, width: 1448, height: 1086, pos: '43% 50%', alt: 'Ani con la remera negra Hecha en Argentina sobre el río Arno, en Florencia' },
    },
];

export const TALLES = ['S', 'M', 'L', 'XL', 'Otro talle'];

export const TAZA = {
    src: taza,
    width: 1194,
    height: 1600,
    alt: 'Taza blanca con el diseño Hecha en Argentina sobre una mesa de madera',
};
