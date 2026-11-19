/* eslint-disable react/prop-types -- el proyecto no usa prop-types */
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PaintingSlider from '../components/paintingsSlider';
import Lightbox from '../components/Lightbox.jsx';
import { DISENOS, COLORES, TALLES, TAZA } from '../objects/objetosDeAutor.jsx';
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

// Pasa sola al siguiente diseño una sola vez, con la sección a la vista y sin que nadie la toque.
// Cualquier clic, tecla, foco o swipe dentro de la sección la frena para siempre.
const AUTO_MS = 15000;

const useAutoAdvance = (enabled, onAdvance) => {
    const reduce = useReducedMotion();
    const [armed, setArmed] = useState(true);
    const { ref, inView } = useInView({ threshold: 0.5 });
    const running = armed && enabled && !reduce && inView;

    useEffect(() => {
        if (!running) return undefined;
        const t = setTimeout(() => { setArmed(false); onAdvance(); }, AUTO_MS);
        return () => clearTimeout(t);
    }, [running, onAdvance]);

    const stop = useCallback(() => setArmed(false), []);
    return { ref, running, stop };
};

// Pestañas con el patrón ARIA: flechas, Inicio y Fin mueven y activan.
const DesignTabs = ({ value, onChange, idBase, pending }) => {
    const tabs = useRef([]);
    const onKeyDown = (e, i) => {
        const keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: DISENOS.length - 1 };
        if (!(e.key in keys)) return;
        e.preventDefault();
        const next = (keys[e.key] + DISENOS.length) % DISENOS.length;
        onChange(DISENOS[next].id);
        tabs.current[next]?.focus();
    };
    return (
        <>
        <p id={`${idBase}-tabs-label`} className="oda-tabs-label">Elegí el diseño</p>
        <div className="oda-tabs" role="tablist" aria-labelledby={`${idBase}-tabs-label`}>
            {DISENOS.map((d, i) => {
                const selected = d.id === value;
                return (
                    <button
                        key={d.id}
                        ref={(el) => { tabs.current[i] = el; }}
                        type="button"
                        role="tab"
                        id={`${idBase}-tab-${d.id}`}
                        aria-selected={selected}
                        aria-controls={`${idBase}-panel`}
                        tabIndex={selected ? 0 : -1}
                        className={`oda-tab${pending === d.id ? ' is-pending' : ''}`}
                        style={{ '--oda-auto-ms': `${AUTO_MS}ms` }}
                        onClick={() => onChange(d.id)}
                        onKeyDown={(e) => onKeyDown(e, i)}
                    >
                        <span className="oda-tab-thumb">
                            <img src={d.thumb.src} alt="" width="96" height="96" loading="lazy" decoding="async" style={{ objectPosition: d.thumb.pos }} />
                            {d.nuevo && <span className="oda-tab-new" aria-hidden="true">Nuevo</span>}
                        </span>
                        <span className="oda-tab-label">{d.label}{d.nuevo && <span className="oda-sr"> (nuevo)</span>}</span>
                    </button>
                );
            })}
        </div>
        </>
    );
};

const ANIO_MIN = 1900;

// Año opcional de Frida. Vacío vale. Si hay algo, tiene que ser un año de 4 cifras entre 1900 y hoy.
const anioError = (anio) => {
    if (!anio) return null;
    const n = Number(anio);
    if (anio.length !== 4 || n < ANIO_MIN || n > new Date().getFullYear()) {
        return `Escribí un año de 4 cifras, entre ${ANIO_MIN} y ${new Date().getFullYear()}.`;
    }
    return null;
};

const Pintadas = ({ reveal }) => {
    const [disenoId, setDisenoId] = useState(DISENOS[0].id);
    const index = DISENOS.findIndex((d) => d.id === disenoId);
    const diseno = DISENOS[index];
    const nextId = DISENOS[index + 1]?.id ?? null;
    const [paleta, setPaleta] = useState(diseno.paletas[0].id);
    const [anio, setAnio] = useState('');
    const [anioErr, setAnioErr] = useState(null);
    const anioRef = useRef(null);
    const talle = useTalle();
    const idBase = useId();
    const mediaRef = useRef(null);
    const paletaElegida = diseno.paletas.find((x) => x.id === paleta);
    // Si el diseño tiene fotos propias, son de su primera paleta. Si no, cada paleta trae las suyas.
    const fotos = diseno.fotos ?? paletaElegida.fotos;
    const enFotos = diseno.fotos ? diseno.paletas[0] : paletaElegida;

    const selectDiseno = useCallback((id) => {
        setDisenoId(id);
        setPaleta(DISENOS.find((d) => d.id === id).paletas[0].id);
    }, []);

    const advance = useCallback(() => { if (nextId) selectDiseno(nextId); }, [nextId, selectDiseno]);
    const auto = useAutoAdvance(Boolean(nextId), advance);
    const { ref: inViewRef, stop } = auto;

    // El swipe del carrusel no burbujea como evento de React: se escucha en captura.
    useEffect(() => {
        const el = mediaRef.current;
        if (!el) return undefined;
        el.addEventListener('scroll', stop, { capture: true, passive: true });
        return () => el.removeEventListener('scroll', stop, { capture: true });
    }, [stop]);

    const setMediaRef = useCallback((el) => { mediaRef.current = el; inViewRef(el); }, [inViewRef]);

    const order = () => {
        const conAnio = diseno.anio ? anio : '';
        const err = anioError(conAnio);
        if (err) {
            setAnioErr(err);
            anioRef.current?.focus();
            return;
        }
        if (!talle.validate()) return;
        const anioText = conAnio ? ` Año: ${conAnio}.` : '';
        openWhatsapp(`Hola Ani! Quiero una remera pintada a mano (${formatPrice(objetosPrices.REMERA_PINTADA)}). Diseño: ${diseno.label}. Paleta: ${paletaElegida.label.toLowerCase()}.${anioText} Talle: ${talleText(talle.talle)}. ¡Gracias!`);
    };

    return (
        <motion.section
            id="pintadas"
            className="oda-panel oda-pintadas"
            aria-labelledby="pintadas-title"
            onClick={stop}
            onKeyDown={stop}
            onFocus={stop}
            {...reveal}
        >
            <header className="oda-head">
                <p className="oda-kind">Pieza única</p>
                <h2 id="pintadas-title" className="oda-title">Remera pintada a mano</h2>
                <p className="oda-price"><strong>{formatPrice(objetosPrices.REMERA_PINTADA)}</strong></p>
            </header>

            <div className="oda-media" ref={setMediaRef}>
                <DesignTabs
                    value={disenoId}
                    onChange={selectDiseno}
                    idBase={idBase}
                    pending={auto.running ? nextId : null}
                />
                <div
                    id={`${idBase}-panel`}
                    role="tabpanel"
                    aria-labelledby={`${idBase}-tab-${disenoId}`}
                >
                    <PaintingSlider
                        key={`${disenoId}-${diseno.fotos ? '' : paleta}`}
                        paintings={fotos}
                        label={`Fotos de la remera ${diseno.label}${diseno.fotos ? '' : `, ${paletaElegida.label.toLowerCase()}`}`}
                    />
                </div>
            </div>

            <div className="oda-info">
                <p className="oda-text">La pinto a mano, <span>trazo por trazo</span>, como un cuadro. No hay dos iguales.</p>
                <ul className="oda-facts">
                    <li>Algodón blanco, manga corta y cuello redondo</li>
                    <li>Pintura para tela, resistente al lavado</li>
                </ul>

                <div className="oda-order">
                    <Choice
                        legend="Paleta"
                        name="paleta"
                        options={diseno.paletas}
                        value={paleta}
                        onChange={setPaleta}
                        renderMark={(opt) => opt.swatch && (
                            <span
                                className={`oda-swatch ${opt.swatch.length === 3 ? 'is-trio' : 'is-duo'}`}
                                aria-hidden="true"
                                style={{ '--a': opt.swatch[0], '--b': opt.swatch[1], '--c': opt.swatch[2] }}
                            />
                        )}
                    />
                    {paleta !== enFotos.id && (
                        <p className="oda-field-hint" aria-live="polite">
                            {paleta === 'otra'
                                ? 'Contame la combinación que querés por WhatsApp.'
                                : `Las fotos muestran ${enFotos.label.toLowerCase()}. La tuya la pinto en ${paletaElegida.label.toLowerCase()}.`}
                        </p>
                    )}
                    {diseno.anio && (
                        <div className={`oda-field${anioErr ? ' has-error' : ''}`}>
                            <label htmlFor={`${idBase}-anio`} className="oda-choice-legend">
                                Tu año de nacimiento<span className="oda-choice-hint"> · opcional</span>
                            </label>
                            <p id={`${idBase}-anio-hint`} className="oda-field-hint">
                                Lo pinto arriba del retrato, en lugar del {diseno.anio}.
                            </p>
                            <input
                                ref={anioRef}
                                id={`${idBase}-anio`}
                                className="oda-input"
                                type="text"
                                inputMode="numeric"
                                autoComplete="bday-year"
                                maxLength={4}
                                placeholder={diseno.anio}
                                value={anio}
                                onChange={(e) => { setAnio(e.target.value.replace(/\D/g, '').slice(0, 4)); setAnioErr(null); }}
                                aria-invalid={anioErr ? 'true' : undefined}
                                aria-describedby={`${idBase}-anio-hint${anioErr ? ` ${idBase}-anio-error` : ''}`}
                            />
                            {anioErr && <p id={`${idBase}-anio-error`} className="oda-choice-error">{anioErr}</p>}
                        </div>
                    )}
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
                        Pedí tu remera {diseno.label} <Arrow /><NewTab />
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
                <p className="oda-lead">Una de mis mujeres, con los colores de casa, en remera o en taza.</p>
            </motion.header>

            <motion.article className="oda-panel oda-estampada" aria-labelledby="estampada-title" {...reveal}>
                <header className="oda-head">
                    <h3 id="estampada-title" className="oda-title">Remera estampada</h3>
                    <p className="oda-price"><strong>{formatPrice(objetosPrices.REMERA_ESTAMPADA)}</strong></p>
                </header>

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
                    <ul className="oda-facts">
                        <li>Estampado DTF, de colores firmes</li>
                    </ul>

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
                </div>
            </motion.article>

            <motion.article id="taza" className="oda-taza" aria-labelledby="taza-title" {...reveal}>
                <div className="oda-taza-media">
                    <Shot img={TAZA} onOpen={setZoom} />
                </div>
                <div className="oda-taza-info">
                    <h3 id="taza-title" className="oda-title">Taza</h3>
                    <p className="oda-taza-text">El mismo diseño. Es la primera de una serie.</p>
                    <p className="oda-price"><strong>{formatPrice(objetosPrices.TAZA)}</strong></p>
                </div>
                <div className="oda-taza-actions">
                    <button type="button" className="oda-btn" onClick={orderTaza}>
                        Pedí tu taza <Arrow /><NewTab />
                    </button>
                    <button type="button" className="oda-link" onClick={notify}>
                        Avisame cuando haya diseños nuevos<NewTab />
                    </button>
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
                <p className="oda-lead">Mi obra, fuera del lienzo, en cosas para usar o regalar.</p>
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
