import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { absoluteUrl, findRoute, notFound } from './routes.js';

// The served HTML already carries the head of the entry URL; this keeps title, description, robots
// and canonical in step during in-app navigation. Open Graph tags are not touched: link previews never run JS.
const RouteMeta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const route = findRoute(pathname);
    const meta = route ?? notFound;
    document.title = meta.title;
    document.head.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    document.head.querySelector('meta[name="robots"]')?.setAttribute('content', route ? 'index, follow' : 'noindex');

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!route) {
      canonical?.remove();
      return;
    }
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = absoluteUrl(route.path);
  }, [pathname]);

  return null;
};

export default RouteMeta;
