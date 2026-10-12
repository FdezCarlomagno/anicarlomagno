/* eslint-disable react/prop-types -- el proyecto no usa prop-types */
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import aniSection from './imgs/aniSection3.jpg';
import aniSection2 from './imgs/aniSection7.jpg';
import './FirstSection.css';

const EASE = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, amount: 0.25 };

const ArrowIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

// Bloque imagen + texto. La imagen se revela con una máscara y tiene un parallax suave.
const AboutBlock = ({ eyebrow, title, image, imageAlt, width, height, reverse, tinted, chips, children }) => {
    const reduceMotion = useReducedMotion();
    const mediaRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: mediaRef, offset: ['start end', 'end start'] });
    // Se observa el contenedor (no el marco): un elemento con clip-path cerrado no intersecta.
    const mediaInView = useInView(mediaRef, { once: true, amount: 0.25 });
    const imgY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['-6%', '6%']);

    const textContainer = {
        hidden: {},
        show: { transition: { staggerChildren: reduceMotion ? 0 : 0.12, delayChildren: 0.1 } },
    };
    const textItem = {
        hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 22 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
    };

    return (
        <article className={`about-block${reverse ? ' is-reverse' : ''}${tinted ? ' is-tinted' : ''}`}>
            <div className={`about-media${height > width ? ' is-portrait' : ''}`} ref={mediaRef}>
                <motion.span
                    className="about-shape"
                    aria-hidden="true"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                    animate={mediaInView ? { opacity: 1, scale: 1 } : undefined}
                    transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
                />
                <motion.div
                    className="about-frame"
                    style={{ aspectRatio: `${width} / ${height}` }}
                    initial={reduceMotion ? false : { clipPath: 'inset(0 0 100% 0 round 18px)' }}
                    animate={mediaInView ? { clipPath: 'inset(0 0 0% 0 round 18px)' } : undefined}
                    transition={{ duration: 1, ease: EASE }}
                >
                    <motion.img
                        src={image}
                        alt={imageAlt}
                        width={width}
                        height={height}
                        loading="lazy"
                        decoding="async"
                        style={{ y: imgY }}
                    />
                </motion.div>
            </div>

            <motion.div
                className="about-text"
                variants={textContainer}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
            >
                <motion.p className="about-eyebrow" variants={textItem}>{eyebrow}</motion.p>
                <motion.h2 className="about-title" variants={textItem}>{title}</motion.h2>
                <motion.div className="about-body" variants={textItem}>{children}</motion.div>
                {chips && (
                    <motion.ul className="about-chips" variants={textItem}>
                        {chips.map((chip) => <li key={chip}>{chip}</li>)}
                    </motion.ul>
                )}
                <motion.div variants={textItem}>
                    <Link to="/sobre-mi" className="about-link">
                        Saber más <ArrowIcon />
                    </Link>
                </motion.div>
            </motion.div>
        </article>
    );
};

const FirstSection = () => (
    <section className="about" aria-label="Sobre Ani Carlomagno">
        <AboutBlock
            eyebrow="01 · Mi historia"
            title="Quién soy"
            image={aniSection}
            imageAlt="Ani Carlomagno pintando un retrato de mujer en su taller"
            width={960}
            height={1280}
        >
            <p>
                Soy <span>Ani Carlomagno</span>, artista plástica y docente de Tandil.
            </p>
            <p>
                Pinto mujeres de <span>ojos grandes</span>, un símbolo de mi propio camino hacia la <span>visibilidad</span> y la <span>expresión</span> de las vivencias que me han marcado.
            </p>
        </AboutBlock>

        <AboutBlock
            reverse
            tinted
            eyebrow="02 · Lo que me mueve"
            title="Mis pasiones"
            image={aniSection2}
            imageAlt="Ani Carlomagno rodeada de sus cuadros"
            width={1280}
            height={850}
            chips={['Pintura', 'Docencia', 'Arte', 'Música']}
        >
            <p>
                Me apasiona profundamente la <span>pintura</span> y la <span>docencia</span>, dos lenguajes mágicos a través de los cuales transmito mi amor por el <span>arte</span> y la <span>música</span>.
            </p>
        </AboutBlock>
    </section>
);

export default FirstSection;
