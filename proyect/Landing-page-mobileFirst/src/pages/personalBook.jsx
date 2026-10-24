/* eslint-disable react/prop-types -- el proyecto no usa prop-types */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import PaintingSlider from '../components/paintingsSlider';
import imgs_Libro_Colorear from '../objects/libro-colorear.jsx';
import imgs_Libro_Miradas from '../objects/libro-miradas.jsx';
import { librosPrice } from '../components/config/LibrosPrice.js';
import './PersonalBook.css';

const formatPrice = (n) => `$${n.toLocaleString('es-AR')}`;

const BOOKS = [
    {
        id: 'miradas',
        nav: 'Miradas que narran',
        kind: 'Libro de relatos',
        title: 'Miradas que narran',
        images: imgs_Libro_Miradas,
        price: librosPrice.MIRADAS_QUE_NARRAN,
        item: 'Libro de relatos',
        paragraphs: [
            <>Aquí encontrarás relatos de una <span>mujer apasionada</span>, escritos a partir de cada vivencia transitada.</>,
            <>Cuando lo tengas en tus manos también serán tus relatos, porque seguramente, en alguna de mis frases, en las mujeres que pinto, en las mujeres que elegí para que colorees, o en las palabras que escribí, hay <span>algo de vos</span>.</>,
        ],
        promo: <><strong>Consultá promos</strong> comprando más de un producto.</>,
    },
    {
        id: 'colorear',
        nav: 'Colores que cuentan historias',
        kind: 'Libro para colorear',
        title: 'Colores que cuentan historias',
        images: imgs_Libro_Colorear,
        price: librosPrice.LIBRO_PARA_COLOREAR,
        item: 'Libro para colorear',
        paragraphs: [
            <>Este libro es una invitación a <span>expresarte</span>, donde cada imagen te permitirá crear una historia propia, llena de vida y color.</>,
            <>Coloreá y convertite en parte de cada obra, sintiendo que cada trazo refleja tu <span>creatividad</span> y esencia.</>,
        ],
        promo: <><strong>Preguntá por descuentos</strong> en compras múltiples.</>,
    },
];

const Book = ({ book, index, reveal }) => {
    // Mismo mensaje de WhatsApp que la versión anterior.
    const order = () => {
        const message = `Hola! Ani, me gustaría encargarte tu ${book.item}. Muchas gracias!`;
        window.open(`https://api.whatsapp.com/send?phone=542494245966&text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <motion.article
            id={book.id}
            className={`pb-book${index % 2 === 1 ? ' is-reverse' : ''}`}
            aria-labelledby={`${book.id}-title`}
            {...reveal}
        >
            <div className="pb-media">
                <PaintingSlider paintings={book.images} label={`Fotos del libro ${book.title}`} />
            </div>

            <div className="pb-info">
                <p className="pb-kind">{book.kind}</p>
                <h2 id={`${book.id}-title`} className="pb-book-title">“{book.title}”</h2>
                <p className="pb-price"><strong>{formatPrice(book.price)}</strong></p>
                <div className="pb-text">
                    {book.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                </div>
                <button type="button" className="pb-btn" onClick={order}>
                    Pedir por WhatsApp
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    <span className="pb-sr"> (se abre en una pestaña nueva)</span>
                </button>
                <p className="pb-promo">{book.promo}</p>
            </div>
        </motion.article>
    );
};

const PersonalBook = () => {
    const reduce = useReducedMotion();
    const { hash } = useLocation();

    // Al llegar desde otra página con #ancla (p. ej. /mi-libro#colorear), ir a ese libro.
    useEffect(() => {
        if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al montar la página
    }, []);
    const reveal = reduce
        ? {}
        : {
            initial: { opacity: 0, y: 18 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: '-60px' },
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        };


    return (
        <main id="main" className="pb">
            <section className="pb-hero" aria-labelledby="pb-title">
                <div className="pb-hero-text">
                <p className="pb-eyebrow">Escritos y dibujados por Ani</p>
                <h1 id="pb-title" className="pb-title">Libros</h1>
                <p className="pb-lead">
                    Dos libros para leer despacio y para colorear a tu manera. Elegí el que te llame y pedilo por WhatsApp.
                </p>
                <nav className="pb-jump" aria-label="Ir a un libro">
                    {BOOKS.map((b) => (
                        <a key={b.id} href={`#${b.id}`} className="pb-chip">{b.nav}</a>
                    ))}
                </nav>
                </div>

                <ul className="pb-covers">
                    {BOOKS.map((b) => (
                        <li key={b.id}>
                            <a href={`#${b.id}`} className="pb-cover" aria-label={`Ver ${b.title}`}>
                                <span className="pb-cover-mat">
                                    <img src={b.images[0].src} alt="" width="1200" height="1600" />
                                </span>
                                <span className="pb-cover-label">
                                    <strong>{b.title}</strong>
                                    <span>{b.kind} · {formatPrice(b.price)}</span>
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            </section>

            {BOOKS.map((book, i) => (
                <Book key={book.id} book={book} index={i} reveal={reveal} />
            ))}
        </main>
    );
};

export default PersonalBook;
