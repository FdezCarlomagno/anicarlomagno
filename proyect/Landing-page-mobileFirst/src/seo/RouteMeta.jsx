import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SITE = 'https://anicarlomagno.vercel.app';
const NAME = 'Ani Carlomagno';

// Título y descripción por ruta. Es una SPA: el HTML inicial es siempre el mismo,
// así que cada ruta actualiza <title>, la meta description, el canonical y Open Graph.
const META = {
  '/': {
    title: 'Ani Carlomagno | Artista plástica en Tandil',
    description: 'Obras pintadas a mano, agendas, cuadernos y láminas de Analía Carlomagno, artista plástica argentina. Pedidos por WhatsApp y envíos a todo el país.',
  },
  '/elegir': {
    title: 'Obras: en stock o a medida | Ani Carlomagno',
    description: 'Elegí entre obras originales listas para llevar o encargá una obra personalizada pintada a mano por Ani Carlomagno.',
  },
  '/obras-en-stock': {
    title: 'Obras en stock | Ani Carlomagno',
    description: 'Obras originales de Ani Carlomagno disponibles: buscá por nombre, técnica o forma y consultá por WhatsApp.',
  },
  '/obra-personalizada': {
    title: 'Encargá tu obra personalizada | Ani Carlomagno',
    description: 'Contanos tu idea, el tamaño y recibí un presupuesto por WhatsApp para una obra pintada a mano a tu medida.',
  },
  '/agendas': {
    title: 'Agendas y cuadernos | Ani Carlomagno',
    description: 'Agendas y cuadernos con tapa de obras de Ani, hojas con frases y relatos, anillo doble de metal y precios claros.',
  },
  '/agenda-personalizada': {
    title: 'Armá tu agenda o cuaderno | Ani Carlomagno',
    description: 'Elegí producto, papel y tapa, sumá tu nombre y una frase, y mandá el pedido por WhatsApp en pocos pasos.',
  },
  '/mi-libro': {
    title: 'Libros | Ani Carlomagno',
    description: '“Miradas que narran” y “Colores que cuentan historias”: dos libros de Ani Carlomagno para leer y para colorear.',
  },
  '/laminas': {
    title: 'Láminas A4 en papel fotográfico | Ani Carlomagno',
    description: 'Láminas A4 impresas en papel fotográfico con obras de Ani Carlomagno, listas para enmarcar. Elegí la tuya y pedila por WhatsApp.',
  },
  '/sobre-mi': {
    title: 'Sobre mí | Ani Carlomagno',
    description: 'Conocé a Analía Carlomagno, artista plástica y docente: su estilo, su trayectoria y la historia detrás de sus mujeres de ojos grandes.',
  },
  '/contacto': {
    title: 'Contacto | Ani Carlomagno',
    description: 'Escribile a Ani Carlomagno por formulario, WhatsApp o Instagram. Consultas, encargos y pedidos.',
  },
};

const setMeta = (selector, attr, value, create) => {
  let el = document.head.querySelector(selector);
  if (!el && create) {
    el = document.createElement(create.tag);
    Object.entries(create.attrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  if (el) el.setAttribute(attr, value);
};

const RouteMeta = () => {
  const { pathname } = useLocation();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const path = pathname.replace(/\/+$/, '') || '/';
    const known = META[path];
    const meta = known || META['/'];
    // Rutas desconocidas muestran la home: no deben competir con ella en buscadores.
    const canonical = `${SITE}${known ? (path === '/' ? '/' : path) : '/'}`;

    document.title = meta.title;
    setMeta('meta[name="description"]', 'content', meta.description, { tag: 'meta', attrs: { name: 'description' } });
    setMeta('link[rel="canonical"]', 'href', canonical, { tag: 'link', attrs: { rel: 'canonical' } });
    setMeta('meta[property="og:url"]', 'content', canonical, { tag: 'meta', attrs: { property: 'og:url' } });
    setMeta('meta[property="og:title"]', 'content', meta.title, { tag: 'meta', attrs: { property: 'og:title' } });
    setMeta('meta[property="og:description"]', 'content', meta.description, { tag: 'meta', attrs: { property: 'og:description' } });
    setMeta('meta[name="twitter:title"]', 'content', meta.title, { tag: 'meta', attrs: { name: 'twitter:title' } });
    setMeta('meta[name="twitter:description"]', 'content', meta.description, { tag: 'meta', attrs: { name: 'twitter:description' } });
    setMeta('meta[name="robots"]', 'content', known ? 'index, follow' : 'noindex, follow', { tag: 'meta', attrs: { name: 'robots' } });

    // Anuncia el cambio de página a lectores de pantalla (en una SPA no hay recarga).
    setAnnouncement(meta.title.replace(` | ${NAME}`, ''));
  }, [pathname]);

  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {announcement}
    </div>
  );
};

export default RouteMeta;
