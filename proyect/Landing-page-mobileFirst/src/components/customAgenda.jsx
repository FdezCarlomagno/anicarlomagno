/* eslint-disable react/prop-types -- el proyecto no usa prop-types */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { agendaPrices } from './config/AgendaPrices';
import cuadros from '../objects/newPaintings.jsx';
import cuadernoA41 from './imgs/cuadernoA4/cuadernoA4-1.jpeg';
import cuadernoA42 from './imgs/cuadernoA4/cuadernoA4-2.jpeg';
import cuadernoA43 from './imgs/cuadernoA4/cuadernoA4-3.jpeg';
import cuadernoA44 from './imgs/cuadernoA4/cuadernoA4-4.jpeg';
import cuadernoA45 from './imgs/cuadernoA4/cuadernoA4-5.jpeg';
import cuadernoA46 from './imgs/cuadernoA4/cuadernoA4-6.jpeg';
import cuadernoA47 from './imgs/cuadernoA4/cuadernoA4-7.jpeg';
import './CustomAgenda.css';

const EASE = [0.22, 1, 0.36, 1];
const DRAFT_KEY = 'ani-agenda-draft';
const PAGE = 12;
const HINTED = ['username'];
const A4_PHOTOS = [cuadernoA41, cuadernoA42, cuadernoA43, cuadernoA44, cuadernoA45, cuadernoA46, cuadernoA47];

const STEPS = [
    { id: 'product', label: 'Producto', fields: ['type', 'paper'] },
    { id: 'cover', label: 'Tapa', fields: ['artTitle'] },
    { id: 'details', label: 'Detalles', fields: ['username', 'textDirection', 'quote'] },
    { id: 'review', label: 'Revisión', fields: [] },
];

const PRODUCTS = [
    { value: 'agenda-perpetua', label: 'Perpetua', note: 'Sin fecha: empezás cuando quieras', price: agendaPrices.AGENDA_PERPETUA, size: '15,5 × 21,5 cm' },
    { value: 'agenda-semanal', label: `Semanal ${new Date().getFullYear() + 1}`, note: 'Una semana por vez', price: agendaPrices.AGENDA_SEMANAL, size: '15,5 × 21,5 cm' },
    { value: 'agenda-docente', label: 'Agenda docente', note: 'Pensada para el aula', price: agendaPrices.AGENDA_DOCENTE, size: '15,5 × 21,5 cm' },
    { value: 'cuaderno', label: 'Cuaderno', note: 'Para escribir y dibujar', price: agendaPrices.CUADERNO, size: '15,5 × 21,5 cm' },
    { value: 'cuaderno-a4', label: 'Cuaderno A4', note: 'Más grande, más espacio', price: agendaPrices.CUADERNO_A4, size: '21 × 29,7 cm', isNew: true },
];

const PAPERS = [
    { value: 'blanco', label: 'Blanco 80g', note: 'Clásico y luminoso' },
    { value: 'natural', label: 'Natural 80g', note: 'Tono crema, más cálido' },
];

const POSITIONS = [
    { value: 'arriba-izquierda', label: 'Arriba a la izquierda' },
    { value: 'arriba-derecha', label: 'Arriba a la derecha' },
    { value: 'abajo-izquierda', label: 'Abajo a la izquierda' },
    { value: 'abajo-derecha', label: 'Abajo a la derecha' },
];

const COLORS = [
    { value: '#000000', label: 'Negro' },
    { value: '#ffffff', label: 'Blanco' },
    { value: '#8a2be2', label: 'Violeta' },
    { value: '#d6336c', label: 'Rosa' },
    { value: '#c9a227', label: 'Dorado' },
    { value: '#1c7ed6', label: 'Azul' },
];

const INITIAL = {
    type: '',
    paper: '',
    artTitle: '',
    username: '',
    fontColor: '#000000',
    textDirection: 'abajo-derecha',
    checkbox: false,
    quote: '',
    other: '',
};

const formatPrice = (n) => `$${n.toLocaleString('es-AR')}`;
const findProduct = (type) => PRODUCTS.find((p) => p.value === type);
const findArt = (title) => cuadros.find((c) => c.title === title);

const validateField = (name, value, data) => {
    switch (name) {
        case 'type':
            return value ? '' : 'Elegí qué querés pedir.';
        case 'paper':
            return value ? '' : 'Elegí el tipo de papel.';
        case 'artTitle':
            return value ? '' : 'Elegí la tapa que más te guste.';
        case 'username':
            if (value && (value.trim().length < 3 || value.trim().length > 12)) {
                return 'El nombre debe tener entre 3 y 12 caracteres.';
            }
            return '';
        case 'textDirection':
            return data.username.trim() && !value ? 'Elegí dónde ubicar el nombre.' : '';
        case 'quote':
            return data.checkbox && !value.trim() ? 'Escribí la frase que querés.' : '';
        default:
            return '';
    }
};

const Check = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);

const Arrow = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

const readDraft = () => {
    try {
        const raw = window.localStorage.getItem(DRAFT_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return { data: { ...INITIAL, ...parsed.data }, step: Math.min(Math.max(parsed.step || 0, 0), STEPS.length - 1) };
    } catch {
        return null;
    }
};

const writeDraft = (value) => {
    try {
        if (value) window.localStorage.setItem(DRAFT_KEY, JSON.stringify(value));
        else window.localStorage.removeItem(DRAFT_KEY);
    } catch {
        /* sin almacenamiento: el formulario funciona igual */
    }
};

// Mensaje de WhatsApp: mismo texto y formato que el formulario anterior.
const buildMessage = (data, price) => {
    let message = `¡Hola! Me gustaría encargar:\n\n`;
    message += `📋 *Tipo:* ${data.type.replace('-', ' ').toUpperCase()}\n`;
    message += `📄 *Papel:* ${data.paper.charAt(0).toUpperCase() + data.paper.slice(1)} 80g\n`;
    message += `🎨 *Obra:* ${data.artTitle}\n`;

    if (data.username) {
        message += `✏️ *Nombre:* ${data.username}\n`;
        message += `🎨 *Color nombre:* ${data.fontColor}\n`;
        message += `📍 *Ubicación:* ${data.textDirection.replace('-', ' ')}\n`;
    }

    if (data.checkbox && data.quote) {
        message += `💭 *Frase:* ${data.quote}\n`;
    }

    if (data.other) {
        message += `💬 *Comentarios:* ${data.other}\n`;
    }

    message += `\n💰 *Total: $${price}*`;

    return encodeURIComponent(message);
};

const Field = ({ id, label, hint, error, valid, optional, children }) => (
    <div className={`ca-field${error ? ' has-error' : ''}${valid ? ' is-valid' : ''}`}>
        <label htmlFor={id}>{label}{optional && <span className="ca-optional"> (opcional)</span>}</label>
        {hint && <p className="ca-hint" id={`${id}-hint`}>{hint}</p>}
        <div className="ca-control">
            {children}
            {valid && <span className="ca-valid-icon"><Check /></span>}
        </div>
        {error && <p className="ca-error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
);

// Vista previa: la obra se ve completa (sin recortes) y el nombre se superpone en la esquina elegida.
const Preview = ({ data, compact }) => {
    const art = findArt(data.artTitle);
    const product = findProduct(data.type);
    const name = data.username.trim();

    return (
        <figure className={`ca-preview${compact ? ' is-compact' : ''}`}>
            <div className="ca-preview-mat">
                {art ? (
                    <div className="ca-preview-art">
                        <img src={art.src} alt={`Tapa elegida: ${art.title}`} />
                        {name && (
                            <span
                                className={`ca-preview-name is-${data.textDirection}`}
                                style={{ color: data.fontColor }}
                                aria-hidden="true"
                            >
                                {name}
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="ca-preview-empty">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4zM5 17a3 3 0 0 1 3-3h11" /></svg>
                        <span>Acá vas a ver tu tapa</span>
                    </div>
                )}
            </div>
            <figcaption>
                <strong>{product ? product.label : 'Tu agenda o cuaderno'}</strong>
                {product && <span>{product.size} · 100 hojas{data.paper ? ` · Papel ${data.paper}` : ''}</span>}
            </figcaption>
        </figure>
    );
};

const CustomAgenda = () => {
    const reduceMotion = useReducedMotion();
    const draft = useMemo(readDraft, []);
    const [step, setStep] = useState(draft ? draft.step : 0);
    const [direction, setDirection] = useState(1);
    const [data, setData] = useState(draft ? draft.data : INITIAL);
    const [touched, setTouched] = useState({});
    const [visible, setVisible] = useState(PAGE);
    const [a4Photo, setA4Photo] = useState(0);
    const [done, setDone] = useState(false);
    const [notice, setNotice] = useState('');
    const headingRef = useRef(null);
    const cardRef = useRef(null);
    const shown = useRef(`${draft ? draft.step : 0}-false`);

    useEffect(() => {
        const previous = document.title;
        document.title = 'Armá tu agenda o cuaderno | Ani Carlomagno';
        return () => { document.title = previous; };
    }, []);

    useEffect(() => {
        if (!done) writeDraft({ data, step });
    }, [data, step, done]);

    const errors = Object.fromEntries(
        ['type', 'paper', 'artTitle', 'username', 'textDirection', 'quote'].map((k) => [k, validateField(k, data[k], data)]),
    );
    const stepIsValid = (i) => STEPS[i].fields.every((f) => !errors[f]);
    const showError = (f) => (touched[f] && errors[f]) || '';
    const isValid = (f) => touched[f] && !errors[f] && Boolean(data[f]);

    const product = findProduct(data.type);
    const quoteFee = data.checkbox ? agendaPrices.ADICION_DE_FRASE : 0;
    const price = product ? product.price + quoteFee : 0;
    const art = findArt(data.artTitle);
    const hasName = Boolean(data.username.trim());

    // Al cambiar de paso: foco en el título (teclado y lectores) y la tarjeta vuelve a quedar a la vista.
    useEffect(() => {
        const key = `${step}-${done}`;
        if (shown.current === key) return undefined;
        shown.current = key;
        const top = cardRef.current?.getBoundingClientRect().top ?? 0;
        if (top < 70) {
            window.scrollTo({ top: window.scrollY + top - 90, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
        const timer = setTimeout(() => headingRef.current?.focus({ preventScroll: true }), reduceMotion ? 0 : 340);
        return () => clearTimeout(timer);
    }, [step, done, reduceMotion]);

    const update = (e) => {
        const { name, value, type, checked } = e.target;
        setData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        setNotice('');
    };

    const choose = (name, value) => {
        setData((prev) => ({ ...prev, [name]: value }));
        setTouched((prev) => ({ ...prev, [name]: true }));
        setNotice('');
    };

    const blur = (e) => setTouched((prev) => ({ ...prev, [e.target.name]: true }));

    const goTo = (i, dir) => {
        setDirection(dir ?? (i > step ? 1 : -1));
        setStep(i);
        setNotice('');
    };

    const next = () => {
        const fields = STEPS[step].fields;
        if (!stepIsValid(step)) {
            setTouched((prev) => ({ ...prev, ...Object.fromEntries(fields.map((f) => [f, true])) }));
            const invalid = fields.filter((f) => errors[f]);
            setNotice(errors[invalid[0]]);
            const target = document.getElementById(`ca-${invalid[0]}`) || document.querySelector(`[name="${invalid[0]}"]`);
            target?.focus();
            return;
        }
        goTo(step + 1, 1);
    };

    const whatsappURL = `https://api.whatsapp.com/send?phone=542494245966&text=${buildMessage(data, price)}`;

    const submit = (e) => {
        e.preventDefault();
        if (step < STEPS.length - 1) {
            next();
            return;
        }
        const firstInvalid = STEPS.findIndex((_, i) => !stepIsValid(i));
        if (firstInvalid !== -1) {
            setTouched((prev) => ({ ...prev, ...Object.fromEntries(STEPS[firstInvalid].fields.map((f) => [f, true])) }));
            goTo(firstInvalid, -1);
            return;
        }
        window.open(whatsappURL, '_blank');
        writeDraft(null);
        setDone(true);
    };

    const restart = () => {
        setData(INITIAL);
        setTouched({});
        setVisible(PAGE);
        setStep(0);
        setDirection(1);
        setNotice('');
        setDone(false);
    };

    const slide = {
        initial: reduceMotion ? false : { opacity: 0, x: direction * 28 },
        animate: { opacity: 1, x: 0 },
        exit: reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -28 },
        transition: { duration: 0.3, ease: EASE },
    };

    const inputProps = (name) => ({
        id: `ca-${name}`,
        name,
        value: data[name],
        onChange: update,
        onBlur: blur,
        'aria-invalid': Boolean(showError(name)),
        'aria-describedby': [HINTED.includes(name) ? `ca-${name}-hint` : '', showError(name) ? `ca-${name}-error` : ''].filter(Boolean).join(' ') || undefined,
    });

    const lastStep = step === STEPS.length - 1;
    const showMobilePreview = !done && (step === 2 || step === 3);

    return (
        <main className="ca">
            <header className="ca-head">
                <p className="ca-eyebrow">Agenda personalizada</p>
                <h1 className="ca-title">Armá tu agenda o cuaderno</h1>
                <p className="ca-sub">
                    En cuatro pasos y con vista previa en vivo. Al final se abre WhatsApp con tu pedido listo y Ani lo confirma con vos.
                </p>
            </header>

            <div className="ca-layout">
                <section className="ca-card" aria-label="Formulario de pedido" ref={cardRef}>
                    {done ? (
                        <motion.div
                            className="ca-success"
                            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: EASE }}
                        >
                            <span className="ca-success-icon"><Check /></span>
                            <h2 className="ca-step-title" tabIndex={-1} ref={headingRef}>¡Tu pedido está listo!</h2>
                            <p className="ca-success-text">
                                Abrimos WhatsApp con todos los datos. Mandá el mensaje y Ani te confirma y coordina los detalles con vos.
                            </p>
                            <dl className="ca-summary">
                                <div><dt>Producto</dt><dd>{product?.label} · Papel {data.paper}</dd></div>
                                <div><dt>Tapa</dt><dd>{data.artTitle}</dd></div>
                                <div><dt>Total</dt><dd>{formatPrice(price)}</dd></div>
                            </dl>
                            <div className="ca-actions is-column">
                                <a className="ca-btn is-primary" href={whatsappURL} target="_blank" rel="noopener noreferrer">
                                    Abrir WhatsApp de nuevo
                                    <span className="ca-sr"> (se abre en una pestaña nueva)</span>
                                </a>
                                <button type="button" className="ca-btn is-ghost" onClick={restart}>Armar otra</button>
                                <Link to="/agendas" className="ca-link">Volver a agendas y cuadernos →</Link>
                            </div>
                        </motion.div>
                    ) : (
                        <>
                            <nav aria-label="Pasos del pedido">
                                <ol className="ca-steps">
                                    {STEPS.map((s, i) => (
                                        <li
                                            key={s.id}
                                            className={`ca-stepper${i === step ? ' is-current' : ''}${i < step ? ' is-done' : ''}`}
                                            aria-current={i === step ? 'step' : undefined}
                                        >
                                            <span className="ca-dot">{i < step ? <Check /> : i + 1}</span>
                                            <span className="ca-step-label">{s.label}</span>
                                        </li>
                                    ))}
                                </ol>
                            </nav>

                            {showMobilePreview && (
                                <div className="ca-mobile-preview">
                                    <Preview data={data} compact />
                                </div>
                            )}

                            <form onSubmit={submit} noValidate>
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div key={step} {...slide}>
                                        <p className="ca-count">Paso {step + 1} de {STEPS.length}</p>

                                        {step === 0 && (
                                            <>
                                                <h2 className="ca-step-title" tabIndex={-1} ref={headingRef}>¿Qué querés pedir?</h2>
                                                <p className="ca-step-text">Elegí el producto y el papel. Todos incluyen tapa y contratapa duras y anillo doble de metal.</p>

                                                <fieldset className="ca-fieldset" aria-describedby={showError('type') ? 'ca-type-error' : undefined}>
                                                    <legend>Producto</legend>
                                                    <div className="ca-options">
                                                        {PRODUCTS.map((p, i) => (
                                                            <label key={p.value} className={`ca-option${data.type === p.value ? ' is-selected' : ''}`}>
                                                                <input
                                                                    type="radio"
                                                                    name="type"
                                                                    id={i === 0 ? 'ca-type' : undefined}
                                                                    value={p.value}
                                                                    checked={data.type === p.value}
                                                                    onChange={() => choose('type', p.value)}
                                                                />
                                                                <span className="ca-option-body">
                                                                    <span className="ca-option-title">
                                                                        {p.label}
                                                                        {p.isNew && <span className="ca-new">Nuevo</span>}
                                                                    </span>
                                                                    <span className="ca-option-note">{p.note} · {p.size}</span>
                                                                </span>
                                                                <span className="ca-option-price">{formatPrice(p.price)}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                    {showError('type') && <p className="ca-error" id="ca-type-error" role="alert">{showError('type')}</p>}
                                                </fieldset>

                                                {data.type === 'cuaderno-a4' && (
                                                    <div className="ca-a4">
                                                        <p className="ca-a4-title">Así es el Cuaderno A4</p>
                                                        <img className="ca-a4-main" src={A4_PHOTOS[a4Photo]} alt={`Cuaderno A4, foto ${a4Photo + 1} de ${A4_PHOTOS.length}`} />
                                                        <div className="ca-a4-thumbs">
                                                            {A4_PHOTOS.map((src, i) => (
                                                                <button
                                                                    key={src}
                                                                    type="button"
                                                                    className={i === a4Photo ? 'is-active' : ''}
                                                                    aria-label={`Ver foto ${i + 1} del cuaderno A4`}
                                                                    aria-pressed={i === a4Photo}
                                                                    onClick={() => setA4Photo(i)}
                                                                >
                                                                    <img src={src} alt="" loading="lazy" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <fieldset className="ca-fieldset" aria-describedby={showError('paper') ? 'ca-paper-error' : undefined}>
                                                    <legend>Papel</legend>
                                                    <div className="ca-options is-two">
                                                        {PAPERS.map((p, i) => (
                                                            <label key={p.value} className={`ca-option${data.paper === p.value ? ' is-selected' : ''}`}>
                                                                <input
                                                                    type="radio"
                                                                    name="paper"
                                                                    id={i === 0 ? 'ca-paper' : undefined}
                                                                    value={p.value}
                                                                    checked={data.paper === p.value}
                                                                    onChange={() => choose('paper', p.value)}
                                                                />
                                                                <span className="ca-option-body">
                                                                    <span className="ca-option-title">{p.label}</span>
                                                                    <span className="ca-option-note">{p.note}</span>
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                    {showError('paper') && <p className="ca-error" id="ca-paper-error" role="alert">{showError('paper')}</p>}
                                                </fieldset>
                                            </>
                                        )}

                                        {step === 1 && (
                                            <>
                                                <h2 className="ca-step-title" tabIndex={-1} ref={headingRef}>Elegí tu tapa</h2>
                                                <p className="ca-step-text">Es una obra de Ani impresa en la tapa. Tocá la que más te guste.</p>

                                                <fieldset className="ca-fieldset" aria-describedby={showError('artTitle') ? 'ca-art-error' : undefined}>
                                                    <legend className="ca-sr">Tapa</legend>
                                                    <div className="ca-covers">
                                                        {cuadros.slice(0, visible).map((c, i) => (
                                                            <label key={c.title} className={`ca-cover${data.artTitle === c.title ? ' is-selected' : ''}`}>
                                                                <input
                                                                    type="radio"
                                                                    name="artTitle"
                                                                    id={i === 0 ? 'ca-artTitle' : undefined}
                                                                    value={c.title}
                                                                    checked={data.artTitle === c.title}
                                                                    onChange={() => choose('artTitle', c.title)}
                                                                />
                                                                <span className="ca-cover-mat">
                                                                    <img src={c.src} alt={c.title} loading="lazy" decoding="async" />
                                                                </span>
                                                                <span className="ca-cover-name">{c.title}</span>
                                                                <span className="ca-cover-check"><Check /></span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                    {showError('artTitle') && <p className="ca-error" id="ca-art-error" role="alert">{showError('artTitle')}</p>}
                                                </fieldset>

                                                {visible < cuadros.length && (
                                                    <button type="button" className="ca-btn is-ghost ca-more" onClick={() => setVisible((v) => v + PAGE)}>
                                                        Ver más tapas ({cuadros.length - visible} más)
                                                    </button>
                                                )}

                                                <p className="ca-picked" role="status" aria-live="polite">
                                                    {art ? `Elegiste: ${art.title}` : ''}
                                                </p>
                                            </>
                                        )}

                                        {step === 2 && (
                                            <>
                                                <h2 className="ca-step-title" tabIndex={-1} ref={headingRef}>Hacela tuya</h2>
                                                <p className="ca-step-text">Sumá tu nombre y una frase si querés. Todo esto es opcional.</p>

                                                <Field
                                                    id="ca-username"
                                                    label="Nombre en la tapa"
                                                    optional
                                                    hint="Entre 3 y 12 caracteres."
                                                    error={showError('username')}
                                                    valid={isValid('username')}
                                                >
                                                    <input type="text" maxLength={12} autoComplete="off" placeholder="Ej: María" {...inputProps('username')} />
                                                </Field>

                                                {hasName && (
                                                    <div className="ca-conditional">
                                                        <fieldset className="ca-fieldset">
                                                            <legend>Color del nombre</legend>
                                                            <div className="ca-swatches">
                                                                {COLORS.map((c) => (
                                                                    <label key={c.value} className={`ca-swatch${data.fontColor === c.value ? ' is-selected' : ''}`}>
                                                                        <input
                                                                            type="radio"
                                                                            name="fontColor"
                                                                            value={c.value}
                                                                            checked={data.fontColor === c.value}
                                                                            onChange={() => choose('fontColor', c.value)}
                                                                        />
                                                                        <span className="ca-swatch-dot" style={{ background: c.value }} />
                                                                        <span className="ca-sr">{c.label}</span>
                                                                    </label>
                                                                ))}
                                                                <label className="ca-swatch ca-swatch-custom">
                                                                    <span className="ca-sr">Otro color</span>
                                                                    <input
                                                                        type="color"
                                                                        name="fontColor"
                                                                        value={data.fontColor}
                                                                        onChange={update}
                                                                    />
                                                                    <span className="ca-swatch-plus" aria-hidden="true">+</span>
                                                                </label>
                                                            </div>
                                                        </fieldset>

                                                        <fieldset className="ca-fieldset" aria-describedby={showError('textDirection') ? 'ca-dir-error' : undefined}>
                                                            <legend>Ubicación del nombre</legend>
                                                            <div className="ca-positions">
                                                                {POSITIONS.map((p, i) => (
                                                                    <label key={p.value} className={`ca-position is-${p.value}${data.textDirection === p.value ? ' is-selected' : ''}`}>
                                                                        <input
                                                                            type="radio"
                                                                            name="textDirection"
                                                                            id={i === 0 ? 'ca-textDirection' : undefined}
                                                                            value={p.value}
                                                                            checked={data.textDirection === p.value}
                                                                            onChange={() => choose('textDirection', p.value)}
                                                                        />
                                                                        <span className="ca-position-box" aria-hidden="true"><i /></span>
                                                                        <span className="ca-position-label">{p.label}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                            {showError('textDirection') && <p className="ca-error" id="ca-dir-error" role="alert">{showError('textDirection')}</p>}
                                                        </fieldset>
                                                    </div>
                                                )}

                                                <label htmlFor="ca-checkbox" className="ca-check">
                                                    <input type="checkbox" id="ca-checkbox" name="checkbox" checked={data.checkbox} onChange={update} />
                                                    <span>
                                                        <strong>Agregar una frase personalizada</strong>
                                                        <span className="ca-hint">Suma {formatPrice(agendaPrices.ADICION_DE_FRASE)} al total.</span>
                                                    </span>
                                                </label>

                                                {data.checkbox && (
                                                    <Field id="ca-quote" label="Tu frase" error={showError('quote')} valid={isValid('quote')}>
                                                        <textarea rows="3" placeholder="Escribí una frase que te inspire…" {...inputProps('quote')} />
                                                    </Field>
                                                )}

                                                <Field id="ca-other" label="Comentarios" optional hint="Cualquier detalle que quieras contarle a Ani.">
                                                    <textarea rows="3" placeholder="Ej: Es un regalo, ¿podés prepararlo para el 20?" id="ca-other" name="other" value={data.other} onChange={update} aria-describedby="ca-other-hint" />
                                                </Field>
                                            </>
                                        )}

                                        {step === 3 && (
                                            <>
                                                <h2 className="ca-step-title" tabIndex={-1} ref={headingRef}>Revisá tu pedido</h2>
                                                <p className="ca-step-text">Si está todo bien, lo mandamos por WhatsApp. Ani lo confirma con vos antes de empezar.</p>
                                                <dl className="ca-summary">
                                                    <div>
                                                        <dt>Producto</dt>
                                                        <dd>{product?.label} · {product?.size}<br />Papel {data.paper} 80g</dd>
                                                        <button type="button" className="ca-edit" onClick={() => goTo(0, -1)}>Editar<span className="ca-sr"> producto y papel</span></button>
                                                    </div>
                                                    <div>
                                                        <dt>Tapa</dt>
                                                        <dd>{data.artTitle}</dd>
                                                        <button type="button" className="ca-edit" onClick={() => goTo(1, -1)}>Editar<span className="ca-sr"> tapa</span></button>
                                                    </div>
                                                    <div>
                                                        <dt>Personalización</dt>
                                                        <dd>
                                                            {hasName ? `Nombre: ${data.username.trim()}` : 'Sin nombre'}
                                                            {data.checkbox && data.quote.trim() && <><br />Frase: “{data.quote.trim()}”</>}
                                                            {data.other.trim() && <><br />Comentarios: {data.other.trim()}</>}
                                                        </dd>
                                                        <button type="button" className="ca-edit" onClick={() => goTo(2, -1)}>Editar<span className="ca-sr"> personalización</span></button>
                                                    </div>
                                                    {data.checkbox && (
                                                        <div>
                                                            <dt>Frase personalizada</dt>
                                                            <dd>+ {formatPrice(agendaPrices.ADICION_DE_FRASE)}</dd>
                                                        </div>
                                                    )}
                                                    <div className="ca-total">
                                                        <dt>Total</dt>
                                                        <dd>{formatPrice(price)}</dd>
                                                    </div>
                                                </dl>
                                            </>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                <p className="ca-notice" role="status" aria-live="polite">{notice}</p>

                                <div className="ca-bar">
                                    <div className="ca-bar-total" aria-live="polite">
                                        <span>Total</span>
                                        <strong>{product ? formatPrice(price) : '—'}</strong>
                                    </div>
                                    <div className="ca-actions">
                                        {step > 0 && (
                                            <button type="button" className="ca-btn is-ghost" onClick={() => goTo(step - 1, -1)}>
                                                Atrás
                                            </button>
                                        )}
                                        {lastStep ? (
                                            <button type="submit" className="ca-btn is-primary">Enviar pedido por WhatsApp</button>
                                        ) : (
                                            <button type="button" className="ca-btn is-primary" onClick={next}>
                                                {step === 2 ? 'Revisar' : 'Continuar'}
                                                <Arrow />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </>
                    )}
                </section>

                <aside className="ca-aside" aria-label="Vista previa y resumen">
                    <h2 className="ca-aside-title">Tu vista previa</h2>
                    <Preview data={data} />
                    <ul className="ca-trust">
                        <li>Enviar el pedido es solo el primer paso: Ani lo confirma con vos por WhatsApp.</li>
                        <li>Tu progreso se guarda si salís de la página.</li>
                    </ul>
                </aside>
            </div>
        </main>
    );
};

export default CustomAgenda;
