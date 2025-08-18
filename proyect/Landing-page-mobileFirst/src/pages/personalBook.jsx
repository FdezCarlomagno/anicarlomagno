import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import './pagesStyles/personalBook.css';
import PaintingSlider from '../components/paintingsSlider';
import imgs_Libro_Colorear from '../objects/libro-colorear.jsx';
import imgs_Libro_Miradas from '../objects/libro-miradas.jsx';

const PersonalBook = () => {
    const precioLibros = 17900;
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
            <main className="personalBook">
                <div className='personalBook-container'>
                    <div className='personalBook-img-container' ref={sliderRef1}>
                        <div className='personalBook-price'><h4>${precioLibros}</h4></div>
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            animate={sliderInView1 ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            <PaintingSlider paintings={imgs_Libro_Miradas} />
                        </motion.div>
                    </div>
                    <motion.h2
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
                    </motion.h2>
                </div>
                <section className='section-agendaText'>
                    <div className='section-agendaText-container'>
                        <h3>"Miradas que narran"</h3>
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
            </main>
            <main className="personalBook section2">
                <div className='personalBook-container'>
                    <div className='personalBook-img-container' ref={sliderRef2}>
                        <div className='personalBook-price'><h4>${precioLibros}</h4></div>
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            animate={sliderInView2 ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            <PaintingSlider paintings={imgs_Libro_Colorear} />
                        </motion.div>
                    </div>
                    <motion.h2
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
                    </motion.h2>
                </div>
                <section className='section-agendaText'>
                    <div className='section-agendaText-container'>
                        <h3>"Colores que cuentan historias"</h3>
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
            </main>
        </div>
    );
};

export default PersonalBook;
