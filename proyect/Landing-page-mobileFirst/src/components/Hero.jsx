import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Image } from '@unpic/react';
// El poster vive en /public para poder pedirlo desde el HTML (preload) y mejorar el LCP.
const poster = '/hero.jpg';
import video from './assets/wspVideo-header.mp4';
import videoMobile from './assets/wspVideo-header-mobile.mp4';
import paintBrush from './assets/WhitePaintBrush.svg';
import { FEATURES } from './config/features.js';
import './Hero.css';

// Sin video para quien pide menos movimiento o ahorra datos: queda el poster.
// Para el resto se carga recién después de la carga de la página.
const shouldSkipVideo = () => {
    if (typeof window === 'undefined') return false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection?.saveData === true;
    return reduced || saveData;
};

const Hero = () => {
    const reduceMotion = useReducedMotion();
    const [allowVideo] = useState(() => !shouldSkipVideo());
    const [videoSrc, setVideoSrc] = useState(null);
    const [videoReady, setVideoReady] = useState(false);

    useEffect(() => {
        if (!allowVideo) return undefined;
        // En teléfonos se sirve una versión liviana (~1,6 MB en vez de ~8 MB). Se elige al
        // arrancar (ya con el layout final) y no en el primer render.
        const start = () => setVideoSrc(window.matchMedia('(max-width: 767px)').matches ? videoMobile : video);
        if (document.readyState === 'complete') {
            const t = setTimeout(start, 300);
            return () => clearTimeout(t);
        }
        window.addEventListener('load', start, { once: true });
        return () => window.removeEventListener('load', start);
    }, [allowVideo]);

    const reveal = (delay) => ({
        initial: reduceMotion ? false : { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, delay, ease: [0.32, 0.72, 0, 1] },
    });

    return (
        <section className="hero" aria-labelledby="hero-title">
            <div className="hero-media" aria-hidden="true">
                <img
                    className="hero-poster"
                    src={poster}
                    alt=""
                    width="900"
                    height="1600"
                    fetchPriority="high"
                />
                {videoSrc && (
                    <video
                        className={`hero-video${videoReady ? ' is-ready' : ''}`}
                        src={videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        onCanPlay={() => setVideoReady(true)}
                    />
                )}
            </div>

            <div className="hero-content">
                {/* Lo nuevo ocupa el lugar del eyebrow: se lee primero sin sumar altura al bloque de texto */}
                {FEATURES.objetos ? (
                    <motion.div {...reveal(0.1)}>
                        <Link to="/objetos-de-autor" className="hero-news">
                            <span className="hero-news-tag">Nuevo</span>{' '}
                            <span>Objetos de autor<span className="hero-news-detail">: remeras, tazas y libros</span></span>
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                        </Link>
                    </motion.div>
                ) : (
                    <motion.p className="hero-eyebrow" {...reveal(0.1)}>
                        Artista plástica · Tandil
                    </motion.p>
                )}
                <motion.h1 id="hero-title" className="hero-title" {...reveal(0.2)}>
                    Obras <em>con alma</em>, para los momentos que querés guardar
                </motion.h1>
                <motion.p className="hero-subtitle" {...reveal(0.28)}>
                    Pintar es dejar que <em>una parte de mí</em> permanezca en el mundo.
                </motion.p>
                <motion.div className="hero-actions" {...reveal(0.35)}>
                    <Link to="/obras-en-stock" className="hero-btn hero-btn--primary">
                        Ver mis obras
                        <Image src={paintBrush} alt="" width={20} height={20} />
                    </Link>
                    <Link to="/agendas" className="hero-btn hero-btn--ghost">
                        Agendas y cuadernos
                    </Link>
                </motion.div>
            </div>

            <a className="hero-scroll" href="#contenido" aria-label="Seguir bajando">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9l7 7 7-7" /></svg>
            </a>
        </section>
    );
};

export default Hero;
