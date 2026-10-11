import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import './pagesStyles/personalBook.css';
import PaintingSlider from '../components/paintingsSlider';
import imgs_Libro_Colorear from '../objects/libro-colorear.jsx';
import imgs_Libro_Miradas from '../objects/libro-miradas.jsx';
import { librosPrice } from '../components/config/LibrosPrice.js'

const fotosLibroMiradas = imgs_Libro_Miradas.map((foto, i, arr) => ({
    ...foto,
    alt: `Libro «Miradas que narran», foto ${i + 1} de ${arr.length}`,
}));

const fotosLibroColorear = imgs_Libro_Colorear.map((foto, i, arr) => ({
    ...foto,
    alt: `Libro «Colores que cuentan historias», foto ${i + 1} de ${arr.length}`,
}));

const PersonalBook = () => {
    const { ref: titleRef, inView: titleInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const { ref: sliderRef1, inView: sliderInView1 } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const { ref: sliderRef2, inView: sliderInView2 } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const { ref: button1, inView: button1InView1 } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const { ref: button2, inView: button1InView2 } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const handleSubmit = (e, item) => {
        e.preventDefault();
        const message = `Hola! Ani, me gustaría encargarte tu ${item}. Muchas gracias!`;

        const whatsappURL = `https://api.whatsapp.com/send?phone=542494245966&text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    };

    return (
        <div>
            <div className="titleBg">
                <motion.h1
                    ref={titleRef}
                    initial={{ opacity: 0, y: -20 }}
                    animate={titleInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className='myPaintingsTitle'
                >
                    Libros
                </motion.h1>
            </div>
            <div className="personalBook">
                <div className='personalBook-container'>
                    <div className='personalBook-img-container' ref={sliderRef1}>
                        <div className='personalBook-price'><p className='personalBook-price-value'>${librosPrice.MIRADAS_QUE_NARRAN}</p></div>
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            animate={sliderInView1 ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            <PaintingSlider paintings={fotosLibroMiradas} />
                        </motion.div>
                    </div>
                    <motion.div
                        className='buy-book-cta'
                        ref={button1}
                        onClick={(e) => handleSubmit(e, "Libro de relatos")}
                        initial={{ opacity: 0, x: -20 }}
                        animate={button1InView1 ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <motion.button
                            className="buy-book-btn"

                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            COMPRAR
                        </motion.button>
                    </motion.div>
                </div>
                <section className='section-agendaText'>
                    <div className='section-agendaText-container'>
                        <h2 className='book-title'>"Miradas que narran"</h2>
                        <div className='section-agendaText-flex-column'>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={titleInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5 }}
                            >
                                Aquí encontrarás relatos de una <span>mujer apasionada</span>, escritos a partir de cada vivencia transitada.
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={titleInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                Cuando lo tengas en tus manos también serán tus relatos, porque seguramente, en alguna de mis frases, en las mujeres que pinto, en las mujeres que elegí para que colorees, o en las palabras que escribí, hay <span>algo de vos</span>.
                            </motion.p>
                            <div>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={titleInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <strong>Consultá promos <span>comprando</span> más de un producto.</strong>
                                </motion.p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <div className="personalBook section2">
                <div className='personalBook-container'>
                    <div className='personalBook-img-container' ref={sliderRef2}>
                        <div className='personalBook-price'><p className='personalBook-price-value'>${librosPrice.LIBRO_PARA_COLOREAR}</p></div>
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            animate={sliderInView2 ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            <PaintingSlider paintings={fotosLibroColorear} />
                        </motion.div>
                    </div>
                    <motion.div
                        className='buy-book-cta'
                        ref={button2}
                        onClick={(e) => handleSubmit(e, "Libro para colorear")}
                        initial={{ opacity: 0, x: 20 }}
                        animate={button1InView2 ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <motion.button
                            className="buy-book-btn"

                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            COMPRAR
                        </motion.button>
                    </motion.div>
                </div>
                <section className='section-agendaText'>
                    <div className='section-agendaText-container'>
                        <h2 className='book-title'>"Colores que cuentan historias"</h2>
                        <div className='section-agendaText-flex-column'>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={titleInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5 }}
                            >
                                Este libro es una invitación a expresarte, donde cada imagen te permitirá crear una historia propia, llena de vida y color.
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={titleInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                Colorea y conviértete en parte de cada obra, sintiendo que cada trazo refleja tu creatividad y esencia.
                            </motion.p>
                            <div>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={titleInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <strong>Preguntá por descuentos en compras múltiples.</strong>
                                </motion.p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PersonalBook;
