import pintadaCelesteEstudio from '../components/imgs/objetos/pintada-celeste-estudio.jpg';
import pintadaCelesteRetrato from '../components/imgs/objetos/pintada-celeste-retrato.jpg';
import pintadaFucsiaRetrato from '../components/imgs/objetos/pintada-fucsia-retrato.jpg';
import pintadaCelesteRoma from '../components/imgs/objetos/pintada-celeste-roma.jpg';
import pintadaCelesteTaller from '../components/imgs/objetos/pintada-celeste-taller.jpg';
import estampadaBlanca from '../components/imgs/objetos/estampada-blanca.jpg';
import estampadaBlancaPuesta from '../components/imgs/objetos/estampada-blanca-puesta.jpg';
import estampadaGris from '../components/imgs/objetos/estampada-gris.jpg';
import estampadaGrisPuesta from '../components/imgs/objetos/estampada-gris-puesta.jpg';
import estampadaNegra from '../components/imgs/objetos/estampada-negra.jpg';
import estampadaNegraFlorencia from '../components/imgs/objetos/estampada-negra-florencia.jpg';
import taza from '../components/imgs/objetos/taza-hecha-en-argentina.jpg';

// Fotos de las remeras pintadas a mano, en el orden del carrusel.
export const PINTADAS = [
    { src: pintadaCelesteEstudio, width: 1254, height: 1254, alt: 'Ani con una remera blanca pintada a mano: rostro de mujer entre franjas celestes y una banda de pan de oro sobre los ojos' },
    { src: pintadaFucsiaRetrato, width: 900, height: 1600, alt: 'La misma remera pintada a mano en paleta fucsia, con trazos azules y dorado' },
    { src: pintadaCelesteRetrato, width: 900, height: 1600, alt: 'Ani frente a uno de sus cuadros, con la remera pintada a mano en paleta celeste' },
    { src: pintadaCelesteRoma, width: 900, height: 1600, alt: 'Remera pintada a mano celeste, puesta, en la escalinata de Plaza de España en Roma' },
    { src: pintadaCelesteTaller, width: 894, height: 1600, alt: 'Remera pintada a mano celeste sobre una mesa de taller con paletas y pinceles' },
];

// Paletas que se pueden elegir para la remera pintada a mano.
export const PALETAS = [
    { id: 'celeste', label: 'Celeste y dorado', swatch: ['#3fb8e0', '#c9a227'] },
    { id: 'fucsia', label: 'Fucsia y azul', swatch: ['#e0338f', '#2446a8'] },
    { id: 'otra', label: 'Otra, la charlamos', swatch: null },
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
