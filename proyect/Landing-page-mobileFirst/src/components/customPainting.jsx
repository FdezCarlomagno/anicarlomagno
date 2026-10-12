/* eslint-disable react/prop-types -- el proyecto no usa prop-types */
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import './CustomPainting.css';

const EASE = [0.22, 1, 0.36, 1];

const STEPS = [
    { id: 'about', label: 'Tus datos', fields: ['name', 'surname'] },
    { id: 'artwork', label: 'Tu obra', fields: ['size1', 'size2', 'description'] },
    { id: 'review', label: 'Revisión', fields: [] },
];

const INITIAL = { name: '', surname: '', size1: '', size2: '', description: '', customPhoto: false };

const FIELD_LABELS = {
    name: 'Nombre',
    surname: 'Apellido',
    size1: 'Ancho',
    size2: 'Alto',
    description: 'Descripción',
};

const validateField = (name, value) => {
    switch (name) {
        case 'name':
        case 'surname':
            if (!value.trim()) return 'Este campo es obligatorio.';
            if (value.trim().length < 2) return 'Escribí al menos 2 letras.';
            return '';
        case 'size1':
        case 'size2': {
            if (value === '' || value === null) return 'Ingresá una medida.';
            const n = Number(value);
            if (!Number.isInteger(n)) return 'Usá un número entero, sin comas.';
            if (n < 10) return 'La medida mínima es 10 cm.';
            if (n > 200) return 'La medida máxima es 200 cm.';
            return '';
        }
        case 'description':
            if (!value.trim()) return 'Contanos qué te gustaría pintar.';
            if (value.trim().length < 10) return 'Sumá un poco más de detalle (mínimo 10 caracteres).';
            if (value.trim().length > 500) return 'Máximo 500 caracteres.';
            return '';
        default:
            return '';
    }
};

const Check = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);

const Field = ({ id, label, hint, error, valid, children }) => (
    <div className={`cp-field${error ? ' has-error' : ''}${valid ? ' is-valid' : ''}`}>
        <label htmlFor={id}>{label}</label>
        {hint && <p className="cp-hint" id={`${id}-hint`}>{hint}</p>}
        <div className="cp-control">
            {children}
            {valid && <span className="cp-valid-icon"><Check /></span>}
        </div>
        {error && <p className="cp-error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
);

const CustomPainting = () => {
    const reduceMotion = useReducedMotion();
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [data, setData] = useState(INITIAL);
    const [touched, setTouched] = useState({});
    const [done, setDone] = useState(false);
    const [notice, setNotice] = useState('');
    const headingRef = useRef(null);
    const firstRender = useRef(true);

    const errors = Object.fromEntries(
        Object.keys(FIELD_LABELS).map((k) => [k, validateField(k, data[k])]),
    );
    const stepIsValid = (i) => STEPS[i].fields.every((f) => !errors[f]);
    const showError = (f) => (touched[f] && errors[f]) || '';
    const isValid = (f) => touched[f] && !errors[f];

    // Al cambiar de paso (o al terminar) el foco va al título, para lectores de pantalla y teclado.
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        // Espera a que termine la transición para enfocar el título del paso nuevo.
        const timer = setTimeout(() => headingRef.current?.focus(), reduceMotion ? 0 : 340);
        return () => clearTimeout(timer);
    }, [step, done, reduceMotion]);

    const update = (e) => {
        const { name, value, type, checked } = e.target;
        setData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
            setNotice(`Revisá ${invalid.length === 1 ? 'este campo' : `estos ${invalid.length} campos`} para seguir.`);
            document.getElementById(invalid[0])?.focus();
            return;
        }
        goTo(step + 1, 1);
    };

    const message = `Hola! Ani Soy ${data.name} ${data.surname}. Me gustaría encargarte una obra de estas dimensiones: ${data.size1}cm X ${data.size2}cm. ${data.description}. ${data.customPhoto ? 'Me gustaría agregar una foto' : ''}. Muchas gracias!`;
    const whatsappURL = `https://api.whatsapp.com/send?phone=542494245966&text=${encodeURIComponent(message)}`;

    const submit = (e) => {
        e.preventDefault();
        if (step < STEPS.length - 1) {
            next();
            return;
        }
        const firstInvalid = STEPS.findIndex((_, i) => !stepIsValid(i));
        if (firstInvalid !== -1) {
            goTo(firstInvalid, -1);
            return;
        }
        window.open(whatsappURL, '_blank');
        setDone(true);
    };

    const restart = () => {
        setData(INITIAL);
        setTouched({});
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
        id: name,
        name,
        value: data[name],
        onChange: update,
        onBlur: blur,
        'aria-invalid': Boolean(showError(name)),
        'aria-describedby': [`${name}-hint`, showError(name) ? `${name}-error` : ''].filter(Boolean).join(' ') || undefined,
    });

    return (
        <main id="main" className="cp">
            <header className="cp-head">
                <p className="cp-eyebrow">Obra personalizada</p>
                <h1 className="cp-title">Pedí tu obra</h1>
                <p className="cp-sub">
                    Contame tu idea en tres pasos. Al final se abre WhatsApp con tu pedido listo para enviar.
                </p>
            </header>

            <div className="cp-layout">
                <section className="cp-card" aria-label="Formulario de pedido">
                    {done ? (
                        <motion.div
                            className="cp-success"
                            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: EASE }}
                        >
                            <span className="cp-success-icon"><Check /></span>
                            <h2 className="cp-step-title" tabIndex={-1} ref={headingRef}>
                                ¡Listo, {data.name.trim()}!
                            </h2>
                            <p className="cp-success-text">
                                Abrimos WhatsApp con tu pedido. Mandá el mensaje y Ani te responde con el presupuesto.
                            </p>
                            <dl className="cp-summary">
                                <div><dt>Medidas</dt><dd>{data.size1} × {data.size2} cm</dd></div>
                                <div><dt>Idea</dt><dd>{data.description.trim()}</dd></div>
                            </dl>
                            <div className="cp-actions is-column">
                                <a className="cp-btn is-primary" href={whatsappURL} target="_blank" rel="noopener noreferrer">
                                    Abrir WhatsApp de nuevo
                                    <span className="cp-sr"> (se abre en una pestaña nueva)</span>
                                </a>
                                <button type="button" className="cp-btn is-ghost" onClick={restart}>Pedir otra obra</button>
                                <Link to="/obras-en-stock" className="cp-link">Ver obras en stock →</Link>
                            </div>
                        </motion.div>
                    ) : (
                        <>
                            <nav aria-label="Pasos del pedido">
                                <ol className="cp-steps">
                                    {STEPS.map((s, i) => (
                                        <li
                                            key={s.id}
                                            className={`cp-stepper${i === step ? ' is-current' : ''}${i < step ? ' is-done' : ''}`}
                                            aria-current={i === step ? 'step' : undefined}
                                        >
                                            <span className="cp-dot">{i < step ? <Check /> : i + 1}</span>
                                            <span className="cp-step-label">{s.label}</span>
                                        </li>
                                    ))}
                                </ol>
                            </nav>

                            <form onSubmit={submit} noValidate>
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div key={step} {...slide}>
                                        <p className="cp-count">Paso {step + 1} de {STEPS.length}</p>

                                        {step === 0 && (
                                            <>
                                                <h2 className="cp-step-title" tabIndex={-1} ref={headingRef}>¿Cómo te llamás?</h2>
                                                <p className="cp-step-text">Así Ani sabe a quién responderle.</p>
                                                <div className="cp-row">
                                                    <Field id="name" label="Nombre" error={showError('name')} valid={isValid('name')}>
                                                        <input type="text" autoComplete="given-name" placeholder="Ingresá tu nombre" {...inputProps('name')} />
                                                    </Field>
                                                    <Field id="surname" label="Apellido" error={showError('surname')} valid={isValid('surname')}>
                                                        <input type="text" autoComplete="family-name" placeholder="Ingresá tu apellido" {...inputProps('surname')} />
                                                    </Field>
                                                </div>
                                            </>
                                        )}

                                        {step === 1 && (
                                            <>
                                                <h2 className="cp-step-title" tabIndex={-1} ref={headingRef}>¿Cómo la imaginás?</h2>
                                                <p className="cp-step-text">Indicanos el tamaño y contanos qué te gustaría ver en tu obra.</p>

                                                <fieldset className="cp-fieldset">
                                                    <legend>Tamaño (ancho × alto, en cm)</legend>
                                                    <div className="cp-size">
                                                        <Field id="size1" label="Ancho" hint="Entre 10 y 200 cm" error={showError('size1')} valid={isValid('size1')}>
                                                            <input type="number" inputMode="numeric" min="10" max="200" placeholder="50" {...inputProps('size1')} />
                                                        </Field>
                                                        <span className="cp-times" aria-hidden="true">×</span>
                                                        <Field id="size2" label="Alto" hint="Entre 10 y 200 cm" error={showError('size2')} valid={isValid('size2')}>
                                                            <input type="number" inputMode="numeric" min="10" max="200" placeholder="70" {...inputProps('size2')} />
                                                        </Field>
                                                    </div>
                                                </fieldset>

                                                <Field
                                                    id="description"
                                                    label="Tu idea"
                                                    hint="Colores, estilo, a quién retratar… lo que quieras contar."
                                                    error={showError('description')}
                                                    valid={isValid('description')}
                                                >
                                                    <textarea rows="4" placeholder="Ej: Un retrato de mi hija con tonos azules y verdes, y mariposas de fondo." {...inputProps('description')} />
                                                </Field>
                                                <p className={`cp-counter${data.description.length > 500 ? ' is-over' : ''}`} aria-live="polite">
                                                    {data.description.length}/500
                                                </p>
                                            </>
                                        )}

                                        {step === 2 && (
                                            <>
                                                <h2 className="cp-step-title" tabIndex={-1} ref={headingRef}>Revisá tu pedido</h2>
                                                <p className="cp-step-text">Si está todo bien, lo mandamos por WhatsApp.</p>
                                                <dl className="cp-summary">
                                                    <div>
                                                        <dt>Nombre</dt>
                                                        <dd>{data.name.trim()} {data.surname.trim()}</dd>
                                                        <button type="button" className="cp-edit" onClick={() => goTo(0, -1)}>
                                                            Editar<span className="cp-sr"> nombre</span>
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <dt>Medidas</dt>
                                                        <dd>{data.size1} × {data.size2} cm</dd>
                                                        <button type="button" className="cp-edit" onClick={() => goTo(1, -1)}>
                                                            Editar<span className="cp-sr"> medidas</span>
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <dt>Idea</dt>
                                                        <dd>{data.description.trim()}</dd>
                                                        <button type="button" className="cp-edit" onClick={() => goTo(1, -1)}>
                                                            Editar<span className="cp-sr"> idea</span>
                                                        </button>
                                                    </div>
                                                </dl>

                                                <label htmlFor="customPhoto" className="cp-check">
                                                    <input
                                                        type="checkbox"
                                                        id="customPhoto"
                                                        name="customPhoto"
                                                        checked={data.customPhoto}
                                                        onChange={update}
                                                    />
                                                    <span>
                                                        <strong>Quiero sumar una foto de referencia</strong>
                                                        <span className="cp-hint">Te contacto para coordinar el envío.</span>
                                                    </span>
                                                </label>
                                            </>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                <p className="cp-notice" role="status" aria-live="polite">{notice}</p>

                                <div className="cp-actions">
                                    {step > 0 && (
                                        <button type="button" className="cp-btn is-ghost" onClick={() => goTo(step - 1, -1)}>
                                            Atrás
                                        </button>
                                    )}
                                    {step < STEPS.length - 1 ? (
                                        <button type="button" className="cp-btn is-primary" onClick={next}>Continuar</button>
                                    ) : (
                                        <button type="submit" className="cp-btn is-primary">Pedir presupuesto por WhatsApp</button>
                                    )}
                                </div>
                            </form>
                        </>
                    )}
                </section>

                <aside className="cp-aside" aria-label="Cómo funciona">
                    <h2 className="cp-aside-title">Cómo funciona</h2>
                    <ol>
                        <li><span>1</span>Me contás tu idea y el tamaño que buscás.</li>
                        <li><span>2</span>Te respondo por WhatsApp con el presupuesto.</li>
                        <li><span>3</span>Si te gusta, la pinto a mano y coordinamos el envío.</li>
                    </ol>
                    <p className="cp-aside-note">
                        ¿Preferís ver algo ya pintado? <Link to="/obras-en-stock">Mirá las obras en stock</Link>.
                    </p>
                </aside>
            </div>
        </main>
    );
};

export default CustomPainting;
