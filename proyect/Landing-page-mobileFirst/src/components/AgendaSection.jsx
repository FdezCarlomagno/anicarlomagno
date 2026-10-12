/* eslint-disable react/prop-types -- el proyecto no usa prop-types */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import agenda1 from './imgs/agenda1.jpg';
import agenda2 from './imgs/agenda2.jpg';
import agenda3 from './imgs/agenda3.jpg';
import agenda4 from './imgs/agenda4.jpg';
import agenda5 from './imgs/agenda5.jpg';
import agenda6 from './imgs/agenda6.jpg';
import agenda7 from './imgs/agenda7.jpg';
import igSvg from './assets/blackInstagram.svg';
import './AgendaSection.css';

const EASE = [0.22, 1, 0.36, 1];
const INSTAGRAM_URL = 'https://www.instagram.com/stories/highlights/17931595102459109/';

const AGENDAS = [agenda1, agenda3, agenda5, agenda2, agenda4, agenda6, agenda7];

const Chevron = ({ dir }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={dir === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
);

const AgendaSection = () => {
    const reduceMotion = useReducedMotion();
    const trackRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [edges, setEdges] = useState({ start: true, end: false });

    // Progreso de scroll + estado de las flechas, sincronizado con el scroll nativo.
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return undefined;
        let frame = 0;
        const update = () => {
            const max = track.scrollWidth - track.clientWidth;
            const left = track.scrollLeft;
            setProgress(max > 0 ? left / max : 0);
            setEdges({ start: left <= 4, end: left >= max - 4 });
        };
        const onScroll = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(update);
        };
        update();
        track.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            cancelAnimationFrame(frame);
            track.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    const scrollByCards = useCallback((dir) => {
        const track = trackRef.current;
        if (!track) return;
        const card = track.querySelector('.agsec-card');
        const step = (card ? card.getBoundingClientRect().width : 240) + 20;
        track.scrollBy({
            left: dir * step * 2,
            behavior: reduceMotion ? 'auto' : 'smooth',
        });
    }, [reduceMotion]);

    return (
        <section className="agsec" aria-labelledby="agsec-title">
            <motion.header
                className="agsec-head"
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: EASE }}
            >
                <p className="agsec-eyebrow">Hechas a mano</p>
                <h2 id="agsec-title" className="agsec-title">Agendas</h2>
                <p className="agsec-sub">
                    Tapa dura, anillo doble de metal y un diseño ilustrado que es solo tuyo.
                </p>
            </motion.header>

            <div className="agsec-stage">
                <button
                    type="button"
                    className="agsec-arrow agsec-arrow--prev"
                    onClick={() => scrollByCards(-1)}
                    disabled={edges.start}
                    aria-label="Ver agendas anteriores"
                >
                    <Chevron dir="prev" />
                </button>

                <ul
                    className="agsec-track"
                    ref={trackRef}
                    tabIndex={0}
                    aria-label="Galería de agendas"
                >
                    {AGENDAS.map((src, i) => (
                        <motion.li
                            className="agsec-card"
                            key={src}
                            initial={reduceMotion ? false : { opacity: 0, y: 36 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: Math.min(i, 3) * 0.08, ease: EASE }}
                        >
                            <Link to="/agendas" aria-label={`Ver agendas: diseño ${i + 1} de ${AGENDAS.length}`}>
                                <img
                                    src={src}
                                    alt={`Agenda ilustrada, diseño ${i + 1}`}
                                    width="720"
                                    height="1280"
                                    loading="lazy"
                                    decoding="async"
                                    draggable="false"
                                />
                                <span className="agsec-card-cta" aria-hidden="true">Ver más</span>
                            </Link>
                        </motion.li>
                    ))}
                </ul>

                <button
                    type="button"
                    className="agsec-arrow agsec-arrow--next"
                    onClick={() => scrollByCards(1)}
                    disabled={edges.end}
                    aria-label="Ver más agendas"
                >
                    <Chevron dir="next" />
                </button>
            </div>

            <div className="agsec-progress" aria-hidden="true">
                <span style={{ transform: `scaleX(${0.18 + progress * 0.82})` }} />
            </div>
            <p className="agsec-hint" aria-hidden="true">Deslizá para ver más</p>

            <div className="agsec-actions">
                <Link to="/agendas" className="agsec-btn agsec-btn--primary">
                    Ver todas las agendas
                </Link>
                <a
                    className="agsec-btn agsec-btn--ghost"
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={igSvg} alt="" width="20" height="20" />
                    Ver en Instagram
                </a>
            </div>
        </section>
    );
};

export default AgendaSection;
