/* eslint-disable react/prop-types -- el proyecto no usa prop-types */
import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import PaintingSlider from '../components/paintingsSlider';
import Lightbox from '../components/Lightbox.jsx';
import { PINTADAS, PALETAS, COLORES, TALLES, TAZA } from '../objects/objetosDeAutor.jsx';
import { objetosPrices } from '../components/config/ObjetosPrices.js';
import { librosPrice } from '../components/config/LibrosPrice.js';
import imgs_Libro_Miradas from '../objects/libro-miradas.jsx';
import imgs_Libro_Colorear from '../objects/libro-colorear.jsx';
import './ObjetosDeAutor.css';

const PHONE = '542494245966';
const formatPrice = (n) => `$${n.toLocaleString('es-AR')}`;

const openWhatsapp = (message) => {
    window.open(`https://api.whatsapp.com/send?phone=${PHONE}&text=${encodeURIComponent(message)}`, '_blank');
};

const talleText = (talle) => (talle === 'Otro talle' ? 'lo consulto con vos' : talle);

const JUMPS = [
    { href: '#pintadas', label: 'Pintadas a mano' },
    { href: '#estampadas', label: 'Estampadas' },
    { href: '#taza', label: 'Taza' },
    { href: '#libros', label: 'Libros' },
];

const LIBROS = [
    { id: 'miradas', title: 'Miradas que narran', kind: 'Libro de relatos', cover: imgs_Libro_Miradas[0].src, price: librosPrice.MIRADAS_QUE_NARRAN },
    { id: 'colorear', title: 'Colores que cuentan historias', kind: 'Libro para colorear', cover: imgs_Libro_Colorear[0].src, price: librosPrice.LIBRO_PARA_COLOREAR },
];

const Arrow = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

const NewTab = () => <span className="oda-sr"> (se abre WhatsApp en una pestaña nueva)</span>;

// Grupo de opciones como pastillas. Son radios reales: flechas para moverse, foco visible.
const Choice = ({ legend, hint, name, options, value, onChange, error, groupRef, renderMark, required }) => {
    const errorId = useId();
    return (
        <fieldset
            className={`oda-choice${error ? ' has-error' : ''}`}
            ref={groupRef}
            aria-describedby={error ? errorId : undefined}
        >
            <legend className="oda-choice-legend">
                {legend}
                {hint && <span className="oda-choice-hint"> · {hint}</span>}
            </legend>
            <div className="oda-choice-options">
                {options.map((opt) => (
                    <label key={opt.id} className="oda-pill">
                        <input
                            type="radio"
                            name={name}
                            value={opt.id}
                            checked={value === opt.id}
                            onChange={() => onChange(opt.id)}
                            required={required}
                        />
                        <span className="oda-pill-face">
                            {renderMark?.(opt)}
                            {opt.label}
                        </span>
                    </label>
                ))}
            </div>
            {error && <p id={errorId} className="oda-choice-error">{error}</p>}
        </fieldset>
    );
};

const TALLE_OPTIONS = TALLES.map((t) => ({ id: t, label: t }));

// Si falta el talle no se bloquea el botón: se avisa y se lleva el foco al grupo.
// El foco se mueve después de pintar el aviso, así el lector de pantalla lo lee con el grupo.
const useTalle = () => {
    const [talle, setTalle] = useState(null);
    const [error, setError] = useState(null);
    const [attempt, setAttempt] = useState(0);
    const groupRef = useRef(null);
    const select = (t) => { setTalle(t); setError(null); };
    const validate = () => {
        if (talle) return true;
        setError('Elegí un talle para seguir.');
        setAttempt((n) => n + 1);
        return false;
    };
    useEffect(() => {
        if (attempt) groupRef.current?.querySelector('input')?.focus();
    }, [attempt]);
    return { talle, select, error, groupRef, validate };
};

const Pintadas = ({ reveal }) => {
    const [paleta, setPaleta] = useState(PALETAS[0].id);
    const talle = useTalle();

    const order = () => {
        if (!talle.validate()) return;
        const p = PALETAS.find((x) => x.id === paleta);
        openWhatsapp(`Hola Ani! Quiero una remera pintada a mano (${formatPrice(objetosPrices.REMERA_PINTADA)}). Paleta: ${p.label.toLowerCase()}. Talle: ${talleText(talle.talle)}. ¡Gracias!`);
    };

    return (
        <motion.section id="pintadas" className="oda-panel oda-pintadas" aria-labelledby="pintadas-title" {...reveal}>
            <div className="oda-media">
                <PaintingSlider paintings={PINTADAS} label="Fotos de las remeras pintadas a mano" />
            </div>

            <div className="oda-info">
                <p className="oda-kind">Remera pintada a mano · Pieza única</p>
                <h2 id="pintadas-title" className="oda-title">El alma de la pintura, en tu ropa</h2>
                <div className="oda-text">
                    <p>No es un dibujo sobre tu remera: es <span>pintura viva</span>. La pinto a mano, trazo por trazo, con el mismo gesto con el que pinto un cuadro.</p>
                    <p>Por eso no hay dos iguales. La tuya va a ser <span>solo tuya</span>.</p>
                </div>
                <ul className="oda-facts">
                    <li>Algodón blanco, manga corta y cuello redondo</li>
                    <li>Pintura para tela, resistente al lavado</li>
                    <li>Vos elegís la paleta</li>
                </ul>
                <p className="oda-price"><strong>{formatPrice(objetosPrices.REMERA_PINTADA)}</strong></p>

                <div className="oda-order">
                    <Choice
                        legend="Paleta"
                        name="paleta"
                        options={PALETAS}
                        value={paleta}
                        onChange={setPaleta}
                        renderMark={(opt) => opt.swatch && (
                            <span className="oda-swatch is-duo" aria-hidden="true" style={{ '--a': opt.swatch[0], '--b': opt.swatch[1] }} />
                        )}
                    />
                    <Choice
                        legend="Talle"
                        hint="elegí uno"
                        required
                        name="talle-pintada"
                        options={TALLE_OPTIONS}
                        value={talle.talle}
                        onChange={talle.select}
                        error={talle.error}
                        groupRef={talle.groupRef}
                    />
                    <button type="button" className="oda-btn" onClick={order}>
                        Pedí tu remera pintada a mano <Arrow /><NewTab />
                    </button>
                    <p className="oda-note">Coordinamos los detalles por WhatsApp.</p>
                </div>
            </div>
        </motion.section>
    );
};

const Shot = ({ img, caption, onOpen }) => (
    <figure className="oda-shot">
        <button type="button" className="oda-shot-btn" onClick={() => onOpen(img)} aria-label={`Ampliar: ${img.alt}`}>
            <img
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                loading="lazy"
                decoding="async"
                style={img.pos ? { objectPosition: img.pos } : undefined}
            />
        </button>
        {caption && <figcaption>{caption}</figcaption>}
    </figure>
);

const Coleccion = ({ reveal }) => {
    const [colorId, setColorId] = useState(COLORES[0].id);
    const [zoom, setZoom] = useState(null);
    const talle = useTalle();
    const color = COLORES.find((c) => c.id === colorId);

    const order = () => {
        if (!talle.validate()) return;
        openWhatsapp(`Hola Ani! Quiero la remera estampada Hecha en Argentina (${formatPrice(objetosPrices.REMERA_ESTAMPADA)}). Color: ${color.label.toLowerCase()}. Talle: ${talleText(talle.talle)}. ¡Gracias!`);
    };

    const orderTaza = () => openWhatsapp(`Hola Ani! Quiero la taza Hecha en Argentina (${formatPrice(objetosPrices.TAZA)}). ¡Gracias!`);
    const notify = () => openWhatsapp('Hola Ani! Avisame cuando salgan nuevos diseños de tazas.');

    return (
        <section id="estampadas" className="oda-coleccion" aria-labelledby="coleccion-title">
            <motion.header className="oda-coleccion-head" {...reveal}>
                <p className="oda-eyebrow">Colección</p>
                <h2 id="coleccion-title" className="oda-coleccion-title">Hecha en Argentina</h2>
                <p className="oda-lead">Una de mis mujeres, con los colores de casa. Para llevarla todos los días, en remera o en taza.</p>
            </motion.header>

            <motion.article className="oda-panel oda-estampada" aria-labelledby="estampada-title" {...reveal}>
                <div className="oda-media">
                    <div className="oda-pair" key={color.id}>
                        <Shot img={color.sola} caption="Así es" onOpen={setZoom} />
                        <Shot img={color.puesta} caption="Así queda puesta" onOpen={setZoom} />
                    </div>
                    {/* El color va pegado al par: al tocarlo se ve el cambio */}
                    <Choice
                        legend="Color"
                        name="color"
                        options={COLORES}
                        value={colorId}
                        onChange={setColorId}
                        renderMark={(opt) => (
                            <span className="oda-swatch" aria-hidden="true" style={{ '--a': opt.swatch }} />
                        )}
                    />
                </div>

                <div className="oda-info">
                    <p className="oda-kind">Remera estampada</p>
                    <h3 id="estampada-title" className="oda-title">Remera Hecha en Argentina</h3>
                    <ul className="oda-facts">
                        <li>Blanca, gris o negra</li>
                        <li>Estampado DTF, de colores firmes</li>
                    </ul>
                    <p className="oda-price"><strong>{formatPrice(objetosPrices.REMERA_ESTAMPADA)}</strong></p>

                    <div className="oda-order">
                        <Choice
                            legend="Talle"
                            hint="elegí uno"
                            required
                            name="talle-estampada"
                            options={TALLE_OPTIONS}
                            value={talle.talle}
                            onChange={talle.select}
                            error={talle.error}
                            groupRef={talle.groupRef}
                        />
                        <button type="button" className="oda-btn" onClick={order}>
                            Pedí tu remera estampada <Arrow /><NewTab />
                        </button>
                    </div>

                    <p className="oda-bridge">
                        ¿Querés una que sea solo tuya? <a href="#pintadas">Mirá las pintadas a mano</a>
                    </p>
                </div>
            </motion.article>

            <motion.article id="taza" className="oda-taza" aria-labelledby="taza-title" {...reveal}>
                <div className="oda-taza-media">
                    <Shot img={TAZA} onOpen={setZoom} />
                </div>
                <div className="oda-taza-info">
                    <p className="oda-tag">Diseño 01</p>
                    <h3 id="taza-title" className="oda-title">También en taza</h3>
                    <p className="oda-taza-text">El mismo diseño, para acompañarte en cada café. Es el primero de una serie: se vienen más.</p>
                    <p className="oda-price"><strong>{formatPrice(objetosPrices.TAZA)}</strong></p>
                    <div className="oda-taza-actions">
                        <button type="button" className="oda-btn" onClick={orderTaza}>
                            Pedí tu taza <Arrow /><NewTab />
                        </button>
                        <button type="button" className="oda-link" onClick={notify}>
                            Avisame cuando haya diseños nuevos<NewTab />
                        </button>
                    </div>
                </div>
            </motion.article>

            {zoom && (
                <Lightbox src={zoom.src} alt={zoom.alt} title="Hecha en Argentina" onClose={() => setZoom(null)} />
            )}
        </section>
    );
};

const Libros = ({ reveal }) => (
    <motion.section id="libros" className="oda-libros" aria-labelledby="libros-title" {...reveal}>
        <p className="oda-eyebrow">Para leer y colorear</p>
        <h2 id="libros-title" className="oda-coleccion-title">Libros</h2>
        <ul className="oda-libros-list">
            {LIBROS.map((b) => (
                <li key={b.id}>
                    <Link to={`/mi-libro#${b.id}`} className="oda-libro">
                        <span className="oda-libro-cover">
                            <img src={b.cover} alt="" width="1200" height="1600" loading="lazy" decoding="async" />
                        </span>
                        <span className="oda-libro-body">
                            <span className="oda-libro-kind">{b.kind}</span>
                            <strong className="oda-libro-title">{b.title}</strong>
                            <span className="oda-libro-price">{formatPrice(b.price)}</span>
                            <span className="oda-libro-cta">Ver el libro <Arrow /></span>
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    </motion.section>
);

const ObjetosDeAutor = () => {
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
        <main id="main" className="oda">
            <section className="oda-hero" aria-labelledby="oda-title">
                <p className="oda-eyebrow"><span className="oda-new">Nuevo</span></p>
                <h1 id="oda-title" className="oda-h1">Objetos de autor</h1>
                <p className="oda-lead">Mi obra, fuera del lienzo: para usar, regalar y llevar puesta.</p>
                <nav className="oda-jump" aria-label="Ir a una sección">
                    {JUMPS.map((j) => (
                        <a key={j.href} href={j.href} className="oda-chip">{j.label}</a>
                    ))}
                </nav>
            </section>

            <Pintadas reveal={reveal} />
            <Coleccion reveal={reveal} />
            <Libros reveal={reveal} />
        </main>
    );
};

export default ObjetosDeAutor;
