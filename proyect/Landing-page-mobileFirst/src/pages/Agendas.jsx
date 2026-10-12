/* eslint-disable react/prop-types -- el proyecto no usa prop-types */
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import PaintingSlider from '../components/paintingsSlider.jsx';
import intAgendas from '../objects/intAgendas.jsx';
import { agendaPrices } from '../components/config/AgendaPrices.js';
import a1 from '../components/imgs/agenda1.jpg';
import a2 from '../components/imgs/agenda2.jpg';
import a3 from '../components/imgs/agenda3.jpg';
import a4 from '../components/imgs/agenda4.jpg';
import a5 from '../components/imgs/agenda5.jpg';
import a6 from '../components/imgs/agenda6.jpg';
import a7 from '../components/imgs/agenda7.jpg';
import a8 from '../components/imgs/agenda8.jpg';
import './Agendas.css';

const COVERS = [
    { src: a1, width: 720, height: 1280 },
    { src: a2, width: 720, height: 1280 },
    { src: a3, width: 720, height: 1280 },
    { src: a4, width: 720, height: 1280 },
    { src: a5, width: 720, height: 1280 },
    { src: a6, width: 720, height: 1280 },
    { src: a7, width: 720, height: 1280 },
    { src: a8, width: 1238, height: 1280 },
];

const formatPrice = (n) => `$${n.toLocaleString('es-AR')}`;

const PRODUCTS = [
    { name: 'Cuaderno', note: 'Para escribir, dibujar y soñar', price: agendaPrices.CUADERNO },
    { name: 'Agenda semanal', note: 'Una semana por vez, con espacio para todo', price: agendaPrices.AGENDA_SEMANAL },
    { name: 'Agenda perpetua', note: 'Sin fecha: empezás cuando quieras', price: agendaPrices.AGENDA_PERPETUA },
    { name: 'Agenda docente', note: 'Pensada para el día a día en el aula', price: agendaPrices.AGENDA_DOCENTE },
    { name: 'Cuaderno A4', note: 'Más grande, más espacio para crear', price: agendaPrices.CUADERNO_A4, isNew: true },
];

const FEATURES = [
    {
        title: 'Tapa y contratapa duras',
        text: 'Con anillo doble de metal: abren planas y duran todo el año.',
        icon: <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4zM5 17a3 3 0 0 1 3-3h11" />,
    },
    {
        title: 'Frases y relatos de Ani',
        text: 'Escritos por ella, dedicados a quien los abre.',
        icon: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
    },
    {
        title: 'Y un montón de extras',
        text: 'Calendario, stickers, imágenes para colorear, sobre, cinta de raso y señalador.',
        icon: <path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3z" />,
    },
    {
        title: 'Interior renovado cada año',
        text: 'Cada año nuevo cambian los diseños: siempre hay algo distinto.',
        icon: <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" />,
    },
];

const Icon = ({ children }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{children}</svg>
);

const Agendas = () => {
    const reduce = useReducedMotion();


    const reveal = reduce
        ? {}
        : {
            initial: { opacity: 0, y: 18 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: '-60px' },
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        };

    return (
        <main id="main" className="ag">
            <section className="ag-hero" aria-labelledby="ag-title">
                <div className="ag-hero-text">
                    <p className="ag-eyebrow">Hechas a mano, una por una</p>
                    <h1 id="ag-title" className="ag-title">Agendas y cuadernos</h1>
                    <p className="ag-lead">
                        Páginas llenas de arte para acompañarte cada día. Elegí la tapa, el papel y
                        el nombre que querés ver en la tapa: yo me ocupo del resto.
                    </p>
                    <div className="ag-actions">
                        <Link to="/agenda-personalizada" className="ag-btn ag-btn--primary">
                            Armar la mía
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                        </Link>
                        <a href="#precios" className="ag-btn ag-btn--ghost">Ver precios</a>
                    </div>
                    <p className="ag-promo">
                        <strong>Consultá promos</strong> comprando más de un producto.
                    </p>
                </div>

                <div className="ag-hero-media">
                    <PaintingSlider paintings={intAgendas} label="Fotos de agendas y cuadernos" />
                </div>
            </section>

            <motion.section className="ag-section" aria-labelledby="ag-feat-title" {...reveal}>
                <h2 id="ag-feat-title" className="ag-h2">Páginas llenas de arte</h2>
                <ul className="ag-features">
                    {FEATURES.map((f) => (
                        <li key={f.title} className="ag-feature">
                            <span className="ag-feature-icon"><Icon>{f.icon}</Icon></span>
                            <div>
                                <h3>{f.title}</h3>
                                <p>{f.text}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <p className="ag-closing">
                    Cada una es una <strong>pequeña obra de arte</strong> que te acompaña todos los días del año.
                </p>
            </motion.section>

            <motion.section id="precios" className="ag-section ag-section--tint" aria-labelledby="ag-price-title" {...reveal}>
                <div className="ag-section-inner">
                    <h2 id="ag-price-title" className="ag-h2">Qué podés pedir</h2>
                    <ul className="ag-products">
                        {PRODUCTS.map((p) => (
                            <li key={p.name} className="ag-product">
                                <div className="ag-product-info">
                                    <h3>
                                        {p.name}
                                        {p.isNew && <span className="ag-new">Nuevo</span>}
                                    </h3>
                                    <p>{p.note}</p>
                                </div>
                                <p className="ag-price">{formatPrice(p.price)}</p>
                            </li>
                        ))}
                    </ul>
                    <p className="ag-fineprint">
                        ¿Llevás más de uno? Consultame por las promos.
                    </p>
                    <Link to="/agenda-personalizada" className="ag-btn ag-btn--primary">
                        Elegir y armar la mía
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </Link>
                </div>
            </motion.section>

            <motion.section className="ag-section" aria-labelledby="ag-covers-title" {...reveal}>
                <div className="ag-covers-head">
                    <div>
                        <h2 id="ag-covers-title" className="ag-h2">Algunas tapas</h2>
                        <p className="ag-sub">Cada una es única. Elegí la que te guste y armá la tuya.</p>
                    </div>
                    <Link to="/agenda-personalizada" className="ag-btn ag-btn--ghost">Armar la mía</Link>
                </div>
                <ul className="ag-covers">
                    {COVERS.map((c, i) => (
                        <li key={c.src}>
                            <Link to="/agenda-personalizada" className="ag-cover" aria-label={`Armar mi agenda con la tapa ${i + 1}`}>
                                <img
                                    src={c.src}
                                    width={c.width}
                                    height={c.height}
                                    alt={`Tapa de agenda ${i + 1} con ilustración de Ani`}
                                    loading="lazy"
                                    decoding="async"
                                />
                                <span className="ag-cover-tag" aria-hidden="true">Armar la mía →</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </motion.section>

            <section className="ag-final" aria-labelledby="ag-final-title">
                <h2 id="ag-final-title" className="ag-final-title">¿Ya sabés cuál querés?</h2>
                <p>Armala en un par de minutos y mandame el pedido por WhatsApp.</p>
                <Link to="/agenda-personalizada" className="ag-btn ag-btn--light">
                    Armar mi agenda o cuaderno
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
            </section>
        </main>
    );
};

export default Agendas;
