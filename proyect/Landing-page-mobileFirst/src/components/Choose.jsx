/* eslint-disable react/prop-types -- el proyecto no usa prop-types */
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import almaImg from '../pages/pagesStyles/paintingsImgs/nuevosCuadros/ALMA.jpg';
import bellaImg from '../pages/pagesStyles/paintingsImgs/nuevosCuadros/BELLA.jpg';
import './Choose.css';

const EASE = [0.22, 1, 0.36, 1];

const OPTIONS = [
    {
        to: '/obra-personalizada',
        tag: 'Por encargo',
        title: 'Obra personalizada',
        text: 'Un retrato único, pintado a mano a partir de tus fotos.',
        cta: 'Pedir la mía',
        image: bellaImg,
        alt: 'Retrato de mujer pintado a mano, en estilo naif',
    },
    {
        to: '/obras-en-stock',
        tag: 'Listas para llevar',
        title: 'Obras en stock',
        text: 'Retratos ya pintados. Envíos a todo el país.',
        cta: 'Ver obras',
        image: almaImg,
        alt: 'Obra terminada de la colección en stock',
    },
];

const ChooseForm = () => {
    const reduceMotion = useReducedMotion();
    const reveal = (delay = 0) => ({
        initial: reduceMotion ? false : { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay, ease: EASE },
    });

    return (
        <main className="choose">
            <motion.header className="choose-head" {...reveal()}>
                <p className="choose-eyebrow">Obras</p>
                <h1 className="choose-title">¿Qué estás buscando?</h1>
                <p className="choose-sub">
                    Podés encargar un retrato a tu medida o llevarte una obra que ya está lista.
                </p>
            </motion.header>

            <ul className="choose-options">
                {OPTIONS.map(({ to, tag, title, text, cta, image, alt }, i) => (
                    <motion.li key={to} {...reveal(0.12 + i * 0.1)}>
                        <Link to={to} className="choose-card">
                            <span className="choose-media">
                                <img src={image} alt={alt} width="600" height="800" decoding="async" />
                            </span>
                            <span className="choose-body">
                                <span className="choose-tag">{tag}</span>
                                <span className="choose-card-title">{title}</span>
                                <span className="choose-card-text">{text}</span>
                                <span className="choose-cta">
                                    {cta}
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                                </span>
                            </span>
                        </Link>
                    </motion.li>
                ))}
            </ul>

            <motion.section className="choose-style" aria-labelledby="choose-style-title" {...reveal(0.35)}>
                <h2 id="choose-style-title" className="choose-style-title">Retratos en estilo naif</h2>
                <div className="choose-style-cols">
                    <p>
                        Este estilo suaviza los rostros y los vuelve más ingenuos. Se caracteriza por la <span>saturación</span> de los <span>colores</span> y por el detalle especial en la mirada.
                    </p>
                    <p>
                        Mis obras reflejan el interior de las personas más que el exterior. Por eso, aunque necesito fotos para trabajar, es importante saber qué elementos hacen <span>única</span> a la persona que voy a retratar.
                    </p>
                </div>
                <p className="choose-promo">
                    Consultá promos comprando más de un producto.
                    <Link to="/contacto">Escribime →</Link>
                </p>
            </motion.section>
        </main>
    );
};

export default ChooseForm;
