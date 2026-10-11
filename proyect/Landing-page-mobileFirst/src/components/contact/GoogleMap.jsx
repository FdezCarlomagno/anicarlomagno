import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import './styles/GoogleMap.css';

const MAP_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.3325395304414!2d-59.154284385271004!3d-37.33060557983791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDE5JzUwLjIiUyA1OcKwMDknMDcuNSJX!5e0!3m2!1sen!2s!4v1621436289012!5m2!1sen!2s';

// Pin of MAP_SRC: 37°19'50.2"S 59°09'07.5"W
const MAPS_LINK = 'https://www.google.com/maps/search/?api=1&query=-37.330611,-59.152083';

const GoogleMap = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (loaded) iframeRef.current?.focus();
  }, [loaded]);

  return (
    <motion.div
      ref={ref}
      className="google-map"
      initial={{ opacity: 0, scale: 0.8, x: 100 }}
      animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {loaded ? (
        <iframe
          ref={iframeRef}
          title="Mapa de la ubicación de Analía Carlomagno, artista plástica"
          src={MAP_SRC}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
        ></iframe>
      ) : (
        <div className="google-map-placeholder">
          <button
            type="button"
            className="google-map-load"
            aria-label="Ver mapa (carga Google Maps)"
            onClick={() => setLoaded(true)}
          >
            Ver mapa
          </button>
          <p className="google-map-notice">
            Al cargar el mapa se conectará con Google.{' '}
            <Link to="/privacidad">Más info en Privacidad</Link>.
          </p>
          <a
            className="google-map-external"
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir en Google Maps
          </a>
        </div>
      )}
    </motion.div>
  );
};

export default GoogleMap;
