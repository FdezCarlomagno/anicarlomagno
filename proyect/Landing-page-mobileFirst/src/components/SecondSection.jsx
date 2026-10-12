import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import './SecondSection.css';

const EASE = [0.22, 1, 0.36, 1];

const SecondSection = () => {
    const reduceMotion = useReducedMotion();
    const reveal = (delay = 0) => ({
        initial: reduceMotion ? false : { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.25 },
        transition: { duration: 0.7, delay, ease: EASE },
    });

    return (
        <section className="dream" aria-labelledby="dream-title">
            <div className="dream-grid">
                <motion.div className="dream-lead" {...reveal()}>
                    <p className="dream-eyebrow">Mi manera de ver</p>
                    <h2 id="dream-title" className="dream-title">Soñadora compulsiva</h2>
                    <p className="dream-quote">
                        Mi vida está llena de <span>sueños</span> y <span>aspiraciones</span>, entrelazados con una <span>pasión ardiente</span> por mi arte.
                    </p>
                </motion.div>

                <motion.div className="dream-body" {...reveal(0.15)}>
                    <p>
                        Cada <span>trazo</span> y <span>color</span> en mis obras busca dar voz a las <span>almas invisibles</span>, con la esperanza de que mis relatos atraviesen fronteras y lleguen a corazones necesitados de ser vistos.
                    </p>
                    <p>
                        Me esfuerzo por <span>cumplir mis metas</span>, impulsada por una <span>dedicación</span> que transforma mi mundo en un vibrante poema visual.
                    </p>
                </motion.div>
            </div>

            <motion.aside className="dream-promo" {...reveal(0.1)}>
                <p>
                    Consultá promos comprando más de un producto.
                </p>
                <Link to="/contacto" className="dream-promo-link">
                    Escribime
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
            </motion.aside>
        </section>
    );
};

export default SecondSection;
