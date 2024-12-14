import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import aniSection from './imgs/aniSection3.jpg';
import aniSection2 from './imgs/aniSection7.jpg';
import arrowRight from '../components/assets/arrowRight.svg';

const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: 'easeOut' },
};

const FirstSection = () => {
    const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <section className='firstSection'>
            {/* First Container */}
            <div className="firstSection-container" ref={ref1}>
                <motion.img
                    className='imgAniSection1'
                    src={aniSection}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView1 ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 1 }}
                    alt="Artistic representation"
                />
                <motion.div
                    className="firstSection-info"
                    variants={fadeInUp}
                    initial="initial"
                    animate={inView1 ? "animate" : "initial"}
                >
                    <motion.h3
                        initial={{ x: -50, opacity: 0 }}
                        animate={inView1 ? { x: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        Quién soy
                    </motion.h3>
                    <motion.div
                        className="flex-column"
                        initial={{ opacity: 0 }}
                        animate={inView1 ? { opacity: 1 } : {}}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <div>
                            Soy <span>Ani Carlomagno</span>, artista plástica y docente de Tandil.
                        </div>
                        <div>
                            Pinto mujeres de <span>ojos grandes</span>, un símbolo de mi propio camino hacia la <span>visibilidad</span> y la <span>expresión</span> de las vivencias que me han marcado.
                        </div>
                        <Link to="/sobre-mi">
                            <motion.button
                                className='linkTo-aboutMe-btn'
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Saber más 
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Second Container */}
            <div className="firstSection-container" id='firstSection-container2' ref={ref2}>
                <motion.img
                    className='imgAniSection2'
                    src={aniSection2}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView2 ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 1 }}
                    alt="Artistic passion"
                />
                <motion.div
                    className="firstSection-info"
                    variants={fadeInUp}
                    initial="initial"
                    animate={inView2 ? "animate" : "initial"}
                >
                    <motion.h3
                        initial={{ x: 50, opacity: 0 }}
                        animate={inView2 ? { x: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        Mis pasiones
                    </motion.h3>
                    <motion.div
                        className="flex-column"
                        initial={{ opacity: 0 }}
                        animate={inView2 ? { opacity: 1 } : {}}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <div>
                            Me apasiona profundamente la <span>pintura</span> y la <span>docencia</span>, dos lenguajes mágicos a través de los cuales transmito mi amor por el <span>arte</span> y la <span>música</span>.
                        </div>
                        <Link to="/sobre-mi">
                            <motion.button
                                className='linkTo-aboutMe-btn'
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Saber más
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default FirstSection;
