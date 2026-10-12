 
import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import cuadros from '../objects/newPaintings.jsx';
import './Laminas.css';

const PRICE = 6900;
const PAGE = 24;

const normalize = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const formatPrice = (n) => `$${n.toLocaleString('es-AR')}`;

const FEATURES = [
    { title: 'Papel fotográfico', text: 'Impresión de alta calidad, con colores fieles a la obra.' },
    { title: 'Tamaño A4', text: '21 × 29,7 cm, listas para enmarcar.' },
    { title: 'Para enmarcar o coleccionar', text: 'Elegí tus obras favoritas de Ani.' },
];

const Laminas = () => {
    const reduce = useReducedMotion();
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(null);
    const [visible, setVisible] = useState(PAGE);


    const results = useMemo(() => {
        const q = normalize(query.trim());
        return q ? cuadros.filter((c) => normalize(c.title).includes(q)) : cuadros;
    }, [query]);

    const shown = query.trim() ? results : results.slice(0, visible);

    // Mismo mensaje de WhatsApp que la versión anterior.
    const message = selected ? `Hola! Ani, me gustaría encargarte una lámina de ${selected.title}. Muchas gracias!` : '';
    const whatsappURL = `https://api.whatsapp.com/send?phone=542494245966&text=${encodeURIComponent(message)}`;

    const toggle = (c) => setSelected((prev) => (prev && prev.title === c.title ? null : c));

    const order = () => {
        if (selected) window.open(whatsappURL, '_blank');
    };

    return (
        <main id="main" className="lm">
            <section className="lm-hero" aria-labelledby="lm-title">
                <p className="lm-eyebrow">Impresas en papel fotográfico</p>
                <h1 id="lm-title" className="lm-title">Láminas</h1>
                <p className="lm-lead">
                    Las obras de Ani en tamaño A4, listas para enmarcar. Elegí la que te guste y pedila por WhatsApp.
                </p>
                <p className="lm-price"><strong>{formatPrice(PRICE)}</strong> cada una</p>
                <p className="lm-promo"><strong>Consultá promos</strong> comprando más de un producto.</p>
            </section>

            <section className="lm-picker" aria-labelledby="lm-pick-title">
                <div className="lm-picker-head">
                    <h2 id="lm-pick-title" className="lm-h2">Elegí tu lámina</h2>
                    <div className="lm-search">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar por nombre"
                            aria-label="Buscar láminas por nombre"
                            autoComplete="off"
                            enterKeyHint="search"
                        />
                        {query && (
                            <button type="button" className="lm-clear" aria-label="Borrar búsqueda" onClick={() => setQuery('')}>
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                            </button>
                        )}
                    </div>
                </div>

                <p className="lm-count" role="status" aria-live="polite">
                    {query.trim() ? `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'}` : `${cuadros.length} obras para elegir`}
                </p>

                {results.length === 0 ? (
                    <div className="lm-empty">
                        <p>No encontramos láminas con “{query.trim()}”.</p>
                        <button type="button" className="lm-btn lm-btn--ghost" onClick={() => setQuery('')}>Ver todas</button>
                    </div>
                ) : (
                    <ul className="lm-grid">
                        {shown.map((c) => {
                            const isSel = selected?.title === c.title;
                            return (
                                <li key={c.title}>
                                    <button
                                        type="button"
                                        className={`lm-card${isSel ? ' is-selected' : ''}`}
                                        aria-pressed={isSel}
                                        onClick={() => toggle(c)}
                                    >
                                        <span className="lm-mat">
                                            <img src={c.src} alt="" loading="lazy" decoding="async" />
                                        </span>
                                        <span className="lm-name">{c.title}</span>
                                        <span className="lm-check" aria-hidden="true">
                                            <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {!query.trim() && visible < results.length && (
                    <div className="lm-more">
                        <button type="button" className="lm-btn lm-btn--ghost" onClick={() => setVisible((v) => v + PAGE)}>
                            Ver más láminas ({results.length - visible} más)
                        </button>
                    </div>
                )}
            </section>

            <section className="lm-info" aria-labelledby="lm-info-title">
                <h2 id="lm-info-title" className="lm-h2">Cómo son las láminas</h2>
                <ul className="lm-features">
                    {FEATURES.map((f) => (
                        <li key={f.title}>
                            <h3>{f.title}</h3>
                            <p>{f.text}</p>
                        </li>
                    ))}
                </ul>
            </section>

            <div className="lm-bar-wrap">
                <AnimatePresence>
                    {selected && (
                        <motion.div
                            className="lm-bar"
                            role="region"
                            aria-label="Tu lámina elegida"
                            initial={reduce ? false : { y: 90, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={reduce ? { opacity: 0 } : { y: 90, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="lm-bar-inner">
                                <img src={selected.src} alt="" className="lm-bar-thumb" />
                                <div className="lm-bar-text">
                                    <strong>{selected.title}</strong>
                                    <span>Lámina A4 · {formatPrice(PRICE)}</span>
                                </div>
                                <button type="button" className="lm-bar-remove" aria-label={`Quitar ${selected.title}`} onClick={() => setSelected(null)}>
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                                </button>
                                <button type="button" className="lm-btn lm-btn--primary" onClick={order}>
                                    Pedir por WhatsApp
                                    <span className="lm-sr"> (se abre en una pestaña nueva)</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
};

export default Laminas;
