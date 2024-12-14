import React from 'react';
import './pagesStyles/aboutMe.css';
import aboutMeImg from '../components/imgs/aniHeader2.jpg';
import info1 from '../components/imgs/aniSection4.jpg';
import info2 from '../components/imgs/aniSection6.jpg';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const AboutMe = () => {
    const { ref: titleRef, inView: titleInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const { ref: headerImgRef, inView: headerImgInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const { ref: firstSectionRef, inView: firstSectionInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const { ref: secondSectionRef, inView: secondSectionInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <div>
            <div className="titleBg">
                <motion.h1
                    ref={titleRef}
                    initial={{ opacity: 0, y: -50 }}
                    animate={titleInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className='myPaintingsTitle'
                >
                    Sobre mi
                </motion.h1>
            </div>
            <main className="AboutMe">
                <motion.div
                    ref={headerImgRef}
                    className="header-aboutMe-img"
                    initial={{ opacity: 0, y: 20 }}
                    animate={headerImgInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <img src={aboutMeImg} alt="Analia Carlomagno" />
                    <h1>Analia Carlomagno</h1>
                    <div className="aboutMe-info">
                        <ul>
                            <h3>Experiencia</h3>
                            <li>+1000 obras vendidas</li>
                            <li>+15 años expresando vivencias a través de imágenes pictóricas</li>
                            <li>+20 años en el mundo de la pintura</li>
                        </ul>
                        <ul>
                            <h3>Estilo y Temática</h3>
                            <li>Pintura de mujeres con ojos grandes</li>
                            <li>Reflejo de un momento bisagra en su vida</li>
                            <li>Canalización de la invisibilidad sufrida</li>
                            <li>Ojos grandes como ventana abierta al alma</li>
                        </ul>
                        <ul>
                            <h3>Actividades y Participaciones</h3>
                            <li>Realización de producciones visuales y audiovisuales en CABA</li>
                            <li>Participación en La Noche de Los Museos (desde 2013 hasta hoy)</li>
                            <li>Convocada por instituciones de su ciudad, Buenos Aires, y el interior de Argentina</li>
                            <li>Obras viajando por todo el país y pintando a pedido para mujeres</li>
                        </ul>
                        <ul>
                            <h3>Estilo Artístico</h3>
                            <li>Uso de colores saturados, formas cerradas, altos contrastes, y texturas</li>
                            <li>Transformación de la imagen en poesía visual</li>
                        </ul>
                    </div>
                </motion.div>
                <motion.section
                    ref={firstSectionRef}
                    className='aboutMe-firstSection'
                    initial={{ opacity: 0, y: 20 }}
                    animate={firstSectionInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className='firstSection-title'>
                        <h2><span>Artista plástica </span>y Docente</h2>
                        <div className='cita'>
                            <cite>"Mi deseo es que mis obras y mis palabras lleguen lejos...
                                Bien bien lejos... Atraviesen fronteras y prejuicios...
                                Permitir que muchas almas se vean
                                a través de mis ojos grandes."</cite>
                            <p> - Analia Carlomagno</p>                        </div>
                    </div>
                </motion.section>
                <motion.section
                    ref={secondSectionRef}
                    className='aboutMe-secondSection'
                    initial={{ opacity: 0, y: 20 }}
                    animate={secondSectionInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <div className="firstSection-container" id='firstSection-container2'>
                        <img
                            className='imgAniSection2'
                            src={info2} />
                        <div className="firstSection-info">
                            <details>
                                <summary>Familia</summary>
                                <div className='flex-column'>
                                    <div>
                                        <p>Terminé mis estudios en el Centro Polivalente de Arte, una escuela donde se respiraba arte y donde conocí el amor con el que he compartido<span> mi vida</span> durante casi tres décadas, <span>Pablo</span>.</p>
                                    </div>
                                    <div>
                                        <p>Juntos creamos una familia maravillosa con Valentín y Santiago, nuestros hijos, quienes llenan nuestra vida de <span>alegría y color</span>.</p>
                                    </div>
                                    <div>
                                        <p>El <span>arte</span> ha sido mi eje central, y elegí la <span>docencia</span> para transmitir desde el alma los lenguajes <span>musical y visual</span>.</p>
                                    </div>
                                    <div>
                                        <p> A pesar de los altibajos, me apasiona profundamente todo lo que emprendo y deseo que mis mujeres y relatos <span>traspasen fronteras</span> antes de que mi piel se arrugue demasiado. Pongo mi corazón entero en estas palabras, con la esperanza de alcanzar y resonar en los <span>corazones ajenos</span>.</p>
                                    </div>
                                </div>
                            </details>
                        </div>
                    </div>
                    <div className="firstSection-container">
                        <img
                            className='imgAniSection1'
                            src={info1} />
                        <div className="firstSection-info">
                            <details>
                                <summary>Deseo...</summary>
                                <div className="flex-column">
                                    <div><span>Deseo, deseo...</span> que mis mujeres y que mis relatos
                                        traspasen la frontera, y que antes que mi
                                        piel se arrugue demasiado poder ver concretarse
                                        todo lo que anhelo. </div>
                                    <div>Mi presente está lleno de <span>sueños</span>.
                                        Que están repletos de viajes, <span>familia</span> y expansión personal...
                                    </div>
                                    <div>
                                        Vivo llena de <span>ilusiones</span>, y a veces me vuelvo
                                        obsesiva por poder cumplir mis metas.
                                    </div>
                                    <div>
                                        En ello estoy, con <span>subes y bajas</span>,
                                        fiel a una canceriana modelo, que <span>ama lo que hace</span> y que se apasiona con todo lo que emprende.
                                    </div>
                                </div>
                            </details>
                        </div>
                    </div>
                </motion.section>
            </main>
        </div>
    );
};

export default AboutMe;
