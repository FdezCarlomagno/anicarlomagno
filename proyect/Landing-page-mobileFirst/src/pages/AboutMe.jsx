/* eslint-disable react/prop-types -- el proyecto no usa prop-types */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import portrait from '../components/imgs/aniHeader2.jpg';
import familyImg from '../components/imgs/aniSection6.jpg';
import wishesImg from '../components/imgs/aniSection4.jpg';
import './AboutMe.css';

const FACTS = [
    { number: '+1000', label: 'obras vendidas', color: '#d6336c' },
    { number: '+20', label: 'años creando', color: '#5b1fa6' },
    { number: '+15', label: 'años enseñando', color: '#0b7285' },
];

const STYLE = [
    { title: 'Colores saturados', text: 'Llenos de vida y emoción.', color: '#d6336c' },
    { title: 'Alto contraste', text: 'Drama visual que cautiva.', color: '#5b1fa6' },
    { title: 'Texturas ricas', text: 'Profundidad en cada trazo.', color: '#e8590c' },
    { title: 'Poesía visual', text: 'Cada obra cuenta una historia.', color: '#0b7285' },
];

const JOURNEY = [
    { when: 'Comienzo', title: 'Centro Polivalente de Arte', text: 'Donde todo comenzó.', color: '#d6336c' },
    { when: 'Evolución', title: 'Nace mi estilo', text: 'Mujeres de ojos grandes, ventanas al alma.', color: '#5b1fa6' },
    { when: '2013', title: 'La Noche de los Museos', text: 'Participo hasta hoy.', color: '#e8590c' },
    { when: 'Presente', title: 'Arte sin fronteras', text: 'Obras por todo el país y más allá.', color: '#0b7285' },
];

const Story = ({ title, image, alt, reverse, lead, more, reveal }) => {
    const [open, setOpen] = useState(false);
    const id = `ab-more-${title.toLowerCase()}`;
    return (
        <motion.article className={`ab-story${reverse ? ' is-reverse' : ''}`} {...reveal}>
            <img className="ab-story-img" src={image.src} width={image.width} height={image.height} alt={alt} loading="lazy" />
            <div className="ab-story-text">
                <h3>{title}</h3>
                {lead}
                <div id={id} className="ab-more" hidden={!open}>{more}</div>
                <button type="button" className="ab-toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}>
                    {open ? 'Leer menos' : 'Leer más'}
                </button>
            </div>
        </motion.article>
    );
};

const AboutMe = () => {
    const reduce = useReducedMotion();
    const reveal = reduce
        ? {}
        : {
            initial: { opacity: 0, y: 18 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: '-60px' },
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        };

    useEffect(() => {
        const previous = document.title;
        document.title = 'Sobre mí | Ani Carlomagno';
        return () => { document.title = previous; };
    }, []);

    return (
        <main className="ab">
            <section className="ab-hero" aria-labelledby="ab-name">
                <div className="ab-hero-text">
                    <p className="ab-eyebrow">Sobre mí</p>
                    <h1 id="ab-name" className="ab-name">Analía Carlomagno</h1>
                    <p className="ab-role">Artista plástica y docente</p>
                    <blockquote className="ab-quote">
                        <p>
                            Mi deseo es que mis obras y mis palabras lleguen lejos… bien, bien lejos.
                            Que atraviesen fronteras y prejuicios. Permitir que muchas almas se vean
                            a través de mis ojos grandes.
                        </p>
                    </blockquote>
                </div>
                <div className="ab-hero-media">
                    <img src={portrait} width="720" height="720" alt="Analía Carlomagno" />
                </div>
            </section>

            <motion.ul className="ab-facts" aria-label="Algunos números" {...reveal}>
                {FACTS.map((f) => (
                    <li key={f.label}>
                        <strong style={{ color: f.color }}>{f.number}</strong>
                        <span>{f.label}</span>
                    </li>
                ))}
            </motion.ul>

            <motion.section className="ab-split" aria-labelledby="ab-style-title" {...reveal}>
                <h2 id="ab-style-title" className="ab-h2">Mi estilo</h2>
                <dl className="ab-rows">
                    {STYLE.map((s) => (
                        <div key={s.title}>
                            <dt><i className="ab-dot" style={{ background: s.color }} aria-hidden="true" />{s.title}</dt>
                            <dd>{s.text}</dd>
                        </div>
                    ))}
                </dl>
            </motion.section>

            <motion.section className="ab-journey" aria-labelledby="ab-journey-title" {...reveal}>
                <div className="ab-journey-inner">
                    <h2 id="ab-journey-title" className="ab-h2">Mi trayectoria</h2>
                    <ol className="ab-timeline">
                        {JOURNEY.map((j, i) => (
                            <li key={j.title} style={{ '--c': j.color }}>
                                <span className="ab-node" aria-hidden="true">{i + 1}</span>
                                <span className="ab-when">{j.when}</span>
                                <h3>{j.title}</h3>
                                <p>{j.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </motion.section>

            <section className="ab-stories" aria-labelledby="ab-story-title">
                <h2 id="ab-story-title" className="ab-h2 ab-stories-title">Mi historia</h2>

                <Story
                    title="Familia"
                    image={{ src: familyImg, width: 720, height: 1280 }}
                    alt="Analía pintando un retrato sobre el caballete"
                    reveal={reveal}
                    lead={(
                        <p>
                            Terminé mis estudios en el Centro Polivalente de Arte, una escuela donde se
                            respiraba arte y donde conocí el amor con el que he compartido <strong>mi vida</strong> durante
                            casi tres décadas, <strong>Pablo</strong>.
                        </p>
                    )}
                    more={(
                        <>
                            <p>
                                Juntos creamos una familia maravillosa con Valentín y Santiago, nuestros hijos,
                                quienes llenan nuestra vida de <strong>alegría y color</strong>.
                            </p>
                            <p>
                                El <strong>arte</strong> ha sido mi eje central, y elegí la <strong>docencia</strong> para
                                transmitir desde el alma los lenguajes <strong>musical y visual</strong>.
                            </p>
                            <p>
                                A pesar de los altibajos, me apasiona profundamente todo lo que emprendo y deseo
                                que mis mujeres y relatos <strong>traspasen fronteras</strong> antes de que mi piel se
                                arrugue demasiado. Pongo mi corazón entero en estas palabras, con la esperanza de
                                alcanzar y resonar en los <strong>corazones ajenos</strong>.
                            </p>
                        </>
                    )}
                />

                <Story
                    title="Deseos"
                    reverse
                    image={{ src: wishesImg, width: 794, height: 1280 }}
                    alt="Analía pintando una obra de colores intensos"
                    reveal={reveal}
                    lead={(
                        <p>
                            <strong>Deseo, deseo…</strong> que mis mujeres y que mis relatos traspasen la frontera,
                            y que antes que mi piel se arrugue demasiado poder ver concretarse todo lo que anhelo.
                        </p>
                    )}
                    more={(
                        <>
                            <p>
                                Mi presente está lleno de <strong>sueños</strong>. Que están repletos de viajes, <strong>familia</strong> y
                                expansión personal…
                            </p>
                            <p>
                                Vivo llena de <strong>ilusiones</strong>, y a veces me vuelvo obsesiva por poder cumplir mis metas.
                            </p>
                            <p>
                                En ello estoy, con <strong>subes y bajas</strong>, fiel a una canceriana modelo,
                                que <strong>ama lo que hace</strong> y que se apasiona con todo lo que emprende.
                            </p>
                        </>
                    )}
                />
            </section>

            <motion.section className="ab-cta" aria-labelledby="ab-cta-title" {...reveal}>
                <h2 id="ab-cta-title" className="ab-cta-title">Llevate un pedacito de mi mundo</h2>
                <p>Mirá las obras que ya están pintadas o contame la que te gustaría tener.</p>
                <div className="ab-cta-actions">
                    <Link to="/obras-en-stock" className="ab-btn ab-btn--light">Ver obras en stock</Link>
                    <Link to="/obra-personalizada" className="ab-btn ab-btn--outline">Encargar una obra</Link>
                </div>
            </motion.section>
        </main>
    );
};

export default AboutMe;
