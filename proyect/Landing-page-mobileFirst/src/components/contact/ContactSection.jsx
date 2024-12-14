import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ContactForm from './ContactForm';
import GoogleMap from './GoogleMap';
import './styles/ContactSection.css';

const ContactSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="contact-section">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <h2>Contacto</h2>
        <div className="contact-content">
          <ContactForm />
          <GoogleMap />
        </div>
      </motion.div>
    </section>
  );
};

export default ContactSection;
