// Single source for public routes and their metadata. Read by the build (vite.config.js → seo/build-pages.js)
// to write dist/<route>/index.html and sitemap.xml, and by the client (useRouteMeta) to keep <title> in sync.
// Plain ESM without JSX: Node imports it during the build.

export const SITE_URL = 'https://anicarlomagno.vercel.app';
export const SITE_NAME = 'Ani Carlomagno';

export const OG_IMAGE = {
  path: '/og-image.jpg',
  width: 1280,
  height: 850,
  type: 'image/jpeg',
  alt: 'Ani Carlomagno pintando con pincel el rostro de una de sus mujeres de ojos grandes',
};

// `breadcrumb`: label for BreadcrumbList; `parent`: path of the intermediate crumb, if any.
// `lastmod`: date the page content last changed (YYYY-MM-DD); update it when you edit that page.
export const routes = [
  {
    path: '/',
    title: 'Analía Carlomagno · Artista plástica en Tandil',
    description:
      'Soy Ani Carlomagno, artista plástica de Tandil. Pinto mujeres de ojos grandes y las llevo a cuadros, agendas, láminas y libros. Envíos a todo el país.',
    lastmod: '2026-10-11',
  },
  {
    path: '/elegir',
    title: 'Cuadros originales: en stock o a pedido | Ani Carlomagno',
    description:
      'Elegí cómo querés tu cuadro: una obra original disponible o una pintada a pedido, con la medida y la idea que vos me cuentes.',
    breadcrumb: 'Obras',
    lastmod: '2026-10-11',
  },
  {
    path: '/obras-en-stock',
    title: 'Cuadros originales en stock | Ani Carlomagno',
    description:
      'Mirá mis cuadros originales disponibles: mujeres de ojos grandes, color saturado y textura. Consultame el precio por WhatsApp. Envíos a todo el país.',
    breadcrumb: 'Obras en stock',
    parent: '/elegir',
    lastmod: '2026-10-11',
  },
  {
    path: '/obra-personalizada',
    title: 'Encargá tu cuadro personalizado | Ani Carlomagno',
    description:
      'Contame qué te gustaría, elegí la medida y sumá una foto de referencia si querés. Pinto tu obra a mano y coordinamos todo por WhatsApp.',
    breadcrumb: 'Obra personalizada',
    parent: '/elegir',
    lastmod: '2026-10-11',
  },
  {
    path: '/agendas',
    title: 'Agendas y cuadernos personalizados | Ani Carlomagno',
    description:
      'Agendas y cuadernos con tapa dura ilustrada con mis obras, anillo doble, frases, stickers y señalador. Personalizalos con tu nombre.',
    breadcrumb: 'Agendas y cuadernos',
    lastmod: '2026-10-11',
  },
  {
    path: '/agenda-personalizada',
    title: 'Armá tu agenda o cuaderno personalizado | Ani Carlomagno',
    description:
      'Elegí agenda perpetua, semanal, docente o cuaderno, el diseño de tapa, el papel y tu nombre o frase. Ves el total al instante y lo pedís por WhatsApp.',
    breadcrumb: 'Agenda personalizada',
    parent: '/agendas',
    lastmod: '2026-10-11',
  },
  {
    path: '/mi-libro',
    title: 'Libros: relatos y para colorear | Ani Carlomagno',
    description:
      '«Miradas que narran», relatos de una mujer apasionada, y «Colores que cuentan historias», para colorear a mis mujeres de ojos grandes.',
    breadcrumb: 'Libros',
    lastmod: '2026-10-11',
  },
  {
    path: '/laminas',
    title: 'Láminas de arte A4 para enmarcar | Ani Carlomagno',
    description:
      'Láminas de mis obras en papel fotográfico de alta calidad, tamaño A4 (21 × 29,7 cm), para enmarcar o coleccionar. Pedilas por WhatsApp.',
    breadcrumb: 'Láminas',
    lastmod: '2026-10-11',
  },
  {
    path: '/sobre-mi',
    title: 'Sobre mí: artista plástica y docente | Ani Carlomagno',
    description:
      'Soy Ani, artista plástica y docente de Tandil. Más de 20 años creando: mi historia, mi estilo de mujeres de ojos grandes y mi recorrido.',
    breadcrumb: 'Sobre mí',
    lastmod: '2026-10-11',
  },
  {
    path: '/contacto',
    title: 'Contacto: escribime por WhatsApp o email | Ani Carlomagno',
    description:
      'Escribime por WhatsApp, por email o desde el formulario para encargar una obra, una agenda o hacerme una consulta. Envíos a todo el país.',
    breadcrumb: 'Contacto',
    lastmod: '2026-10-11',
  },
  {
    path: '/privacidad',
    title: 'Política de privacidad | Ani Carlomagno',
    description:
      'Qué datos recibo cuando me escribís por el formulario o por WhatsApp, para qué los uso, con quién se comparten y cómo pedir que los borre.',
    breadcrumb: 'Privacidad',
    lastmod: '2026-10-11',
  },
  {
    path: '/terminos',
    title: 'Términos y condiciones de compra | Ani Carlomagno',
    description:
      'Cómo funciona la compra de cuadros, agendas, láminas y libros: consulta por WhatsApp, productos personalizados y envíos a todo el país.',
    breadcrumb: 'Términos',
    lastmod: '2026-10-11',
  },
];

export const notFound = {
  title: 'Página no encontrada | Ani Carlomagno',
  description: 'Esta página no existe o cambió de lugar. Seguí por mis obras, las agendas o escribime.',
};

export const absoluteUrl = (path) => SITE_URL + path;

export const findRoute = (pathname) => {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return routes.find((r) => r.path === clean);
};
