import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './styles/GoogleMap.css';

const GoogleMap = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      className="google-map"
      initial={{ opacity: 0, scale: 0.8, x: 100 }}
      animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <iframe
        title="Mapa de la ubicación de Analía Carlomagno, artista plástica"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.3325395304414!2d-59.154284385271004!3d-37.33060557983791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDE5JzUwLjIiUyA1OcKwMDknMDcuNSJX!5e0!3m2!1sen!2s!4v1621436289012!5m2!1sen!2s"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
      ></iframe>
    </motion.div>
  );
};

export default GoogleMap;
