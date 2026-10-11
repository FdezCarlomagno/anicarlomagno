// Schema.org JSON-LD per route, built at build time by scripts/seo-plugin.js.
// Prices always come from src/components/config; never write numbers here.
import { agendaPrices } from '../components/config/AgendaPrices.js';
import { librosPrice } from '../components/config/LibrosPrice.js';
import { CONTACT_EMAIL, OWNER_NAME, WHATSAPP_DISPLAY } from '../content/legal/contact.js';
import { SITE_URL, SITE_NAME, OG_IMAGE, routes, absoluteUrl } from './routes.js';

const PERSON_ID = `${SITE_URL}/#ani`;

// Same profiles linked in src/components/SocialMedia.jsx.
const SOCIAL_PROFILES = [
  'https://www.instagram.com/anicarlomagno_painting/',
  'https://www.tiktok.com/@anicarlomagno_painting',
  'https://www.facebook.com/anicarlomagno',
];

// Names as shown in AgendaForm; key = price key in agendaPrices.
const AGENDA_PRODUCTS = [
  ['AGENDA_PERPETUA', 'Agenda perpetua personalizada'],
  ['AGENDA_SEMANAL', 'Agenda semanal personalizada'],
  ['AGENDA_DOCENTE', 'Agenda docente personalizada'],
  ['CUADERNO', 'Cuaderno personalizado'],
  ['CUADERNO_A4', 'Cuaderno A4 personalizado'],
];

const BOOK_PRODUCTS = [
  ['MIRADAS_QUE_NARRAN', 'Miradas que narran', 'Libro de relatos de Ani Carlomagno.'],
  ['LIBRO_PARA_COLOREAR', 'Colores que cuentan historias', 'Libro para colorear con mujeres de ojos grandes pintadas por Ani Carlomagno.'],
];

const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: OWNER_NAME,
  alternateName: ['Ani Carlomagno', 'anicarlomagno'],
  jobTitle: 'Artista plástica',
  description:
    'Artista plástica y docente de Tandil. Pinta mujeres de ojos grandes y lleva su obra a cuadros, agendas, cuadernos, láminas y libros.',
  url: `${SITE_URL}/`,
  image: absoluteUrl(OG_IMAGE.path),
  email: `mailto:${CONTACT_EMAIL}`,
  telephone: WHATSAPP_DISPLAY,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Tandil',
    addressRegion: 'Buenos Aires',
    addressCountry: 'AR',
  },
  sameAs: SOCIAL_PROFILES,
};

const website = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  inLanguage: 'es-AR',
  publisher: { '@id': PERSON_ID },
};

const breadcrumb = (route) => {
  const trail = [{ name: 'Inicio', path: '/' }];
  if (route.parent) {
    const parent = routes.find((r) => r.path === route.parent);
    trail.push({ name: parent.breadcrumb, path: parent.path });
  }
  trail.push({ name: route.breadcrumb, path: route.path });
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
};

const offer = (price, path) => ({
  '@type': 'Offer',
  price,
  priceCurrency: 'ARS',
  url: absoluteUrl(path),
  seller: { '@id': PERSON_ID },
});

const agendaProducts = (path) =>
  AGENDA_PRODUCTS.map(([key, name]) => ({
    '@type': 'Product',
    name,
    sku: key,
    description: 'Tapa dura ilustrada con obras de Ani Carlomagno y anillo doble de metal. Se personaliza con tu nombre y una frase.',
    offers: offer(agendaPrices[key], path),
  }));

const bookProducts = (path) =>
  BOOK_PRODUCTS.map(([key, name, description]) => ({
    '@type': ['Product', 'Book'],
    name,
    sku: key,
    description,
    author: { '@id': PERSON_ID },
    inLanguage: 'es-AR',
    offers: offer(librosPrice[key], path),
  }));

export const structuredData = (route) => {
  const graph = [person];
  if (route.path === '/') graph.push(website);
  else graph.push(breadcrumb(route));
  if (route.path === '/agenda-personalizada') graph.push(...agendaProducts(route.path));
  if (route.path === '/mi-libro') graph.push(...bookProducts(route.path));
  return { '@context': 'https://schema.org', '@graph': graph };
};
