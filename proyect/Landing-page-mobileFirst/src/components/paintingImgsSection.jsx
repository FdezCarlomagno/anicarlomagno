import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import cuadros from '../objects/newPaintings.jsx';
import './PaintingImgsSection.css';

const EASE = [0.22, 1, 0.36, 1];
// La home muestra una muestra y manda al catálogo: con scroll infinito el final de la página
// y el footer se alejaban cada vez más. Filas completas en 2, 3 y 4 columnas.
const ROWS = { 2: 4, 3: 3, 4: 3 };

// Cantidad de columnas según el ancho (mismos cortes que el CSS).
const getColumnCount = () => {
    if (typeof window === 'undefined') return 2;
    if (window.matchMedia('(min-width: 1200px)').matches) return 4;
    if (window.matchMedia('(min-width: 768px)').matches) return 3;
    return 2;
};

const useColumnCount = () => {
    const [count, setCount] = useState(getColumnCount);
    useEffect(() => {
        const queries = ['(min-width: 1200px)', '(min-width: 768px)'].map((q) => window.matchMedia(q));
        const update = () => setCount(getColumnCount());
        queries.forEach((mq) => mq.addEventListener('change', update));
        return () => queries.forEach((mq) => mq.removeEventListener('change', update));
    }, []);
    return count;
};

const PaintingImgsSection = () => {
    const reduceMotion = useReducedMotion();
    const columnCount = useColumnCount();
    const visible = columnCount * ROWS[columnCount];
    // Reparto en columnas "en orden": cada obra va a la columna siguiente.
    const columns = useMemo(() => {
        const cols = Array.from({ length: columnCount }, () => []);
        cuadros.slice(0, visible).forEach((cuadro, index) => cols[index % columnCount].push({ cuadro, index }));
        return cols;
    }, [visible, columnCount]);

    return (
        <section className="gal" aria-labelledby="gal-title">
            <motion.header
                className="gal-head"
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: EASE }}
            >
                <div>
                    <p className="gal-eyebrow">Galería</p>
                    <h2 id="gal-title" className="gal-title">Mis obras</h2>
                </div>
                <p className="gal-sub">Retratos de mujeres de ojos grandes, pintados a mano.</p>
            </motion.header>

            <ul className="gal-grid">
                {columns.map((col, colIndex) => (
                    <li className="gal-col" key={colIndex}>
                        <ul className="gal-col-list">
                            {col.map(({ cuadro, index }) => (
                                <motion.li
                                    className="gal-item"
                                    key={cuadro.src}
                                    initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.15 }}
                                    transition={{ duration: 0.6, delay: (index % 8) * 0.04, ease: EASE }}
                                >
                                    <Link to="/obras-en-stock" aria-label={`Ver obras: ${cuadro.title}`}>
                                        <img
                                            src={cuadro.src}
                                            alt={`Pintura "${cuadro.title}" de Ani Carlomagno`}
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <span className="gal-caption" aria-hidden="true">{cuadro.title}</span>
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            <div className="gal-more">
                <Link to="/obras-en-stock" className="gal-btn">
                    Ver todas las obras
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
            </div>
        </section>
    );
};

export default PaintingImgsSection;
