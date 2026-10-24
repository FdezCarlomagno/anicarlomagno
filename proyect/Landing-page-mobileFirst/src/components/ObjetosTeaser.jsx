import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import remeraPintada from './imgs/objetos/pintada-celeste-estudio.jpg';
import './ObjetosTeaser.css';

const EASE = [0.22, 1, 0.36, 1];

// Acceso desde la home a Objetos de autor, presentado como lo nuevo.
const ObjetosTeaser = () => {
    const reduceMotion = useReducedMotion();
    const reveal = (delay = 0) => ({
        initial: reduceMotion ? false : { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.7, delay, ease: EASE },
    });

    return (
        <section className="odt" aria-labelledby="odt-title">
            <motion.div className="odt-media" {...reveal()}>
                <img
                    src={remeraPintada}
                    alt="Ani con una remera blanca pintada a mano, con franjas celestes y pan de oro"
                    width="1254"
                    height="1254"
                    loading="lazy"
                    decoding="async"
                />
            </motion.div>

            <motion.div className="odt-text" {...reveal(0.12)}>
                <p className="odt-eyebrow"><span>Nuevo</span></p>
                <h2 id="odt-title" className="odt-title">Objetos de autor</h2>
                <p className="odt-sub">
                    Mi obra, fuera del lienzo: remeras pintadas a mano, remeras estampadas, tazas y mis libros.
                </p>
                <Link to="/objetos-de-autor" className="odt-btn">
                    Ver objetos de autor
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
            </motion.div>
        </section>
    );
};

export default ObjetosTeaser;
