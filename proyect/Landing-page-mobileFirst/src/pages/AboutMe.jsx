import React, { useState } from 'react';
import './pagesStyles/aboutMe.css';
import aboutMeImg from '../components/imgs/aniHeader2.jpg';
import info1 from '../components/imgs/aniSection4.jpg';
import info2 from '../components/imgs/aniSection6.jpg';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Image } from '@unpic/react';
import librosApilados from '../components/assets/LibrosApilados.svg'
import paleta from '../components/assets/Paleta.svg'
import RelojArena from '../components/assets/RelojArena.svg'


const AboutMe = () => {
    const [activeStory, setActiveStory] = useState(null);

    const { ref: titleRef, inView: titleInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const { ref: heroRef, inView: heroInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const { ref: statsRef, inView: statsInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const { ref: journeyRef, inView: journeyInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const { ref: storiesRef, inView: storiesInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const stats = [
        { number: '+1000', label: 'Obras vendidas', icon: paleta },
        { number: '+20', label: 'Años creando', icon: RelojArena },
        { number: '+15', label: 'Años enseñando', icon: librosApilados },
    ];

    const journey = [
        {
            year: 'Comienzo',
            title: 'Centro Polivalente de Arte',
            description: 'Donde todo comenzó. Estudios, arte y amor.',
        },
        {
            year: 'Evolución',
            title: 'Nace mi estilo único',
            description: 'Mujeres con ojos grandes: ventanas al alma.',
        },
        {
            year: '2013',
            title: 'La Noche de Los Museos',
            description: 'Participación continua hasta hoy.',
        },
        {
            year: 'Presente',
            title: 'Arte sin fronteras',
            description: 'Obras viajando por todo el país y más allá.',
        },
    ];

    const artisticStyle = [
        { title: 'Colores Saturados', description: 'Llenos de vida y emoción' },
        { title: 'Alto Contraste', description: 'Drama visual que cautiva' },
        { title: 'Texturas Ricas', description: 'Profundidad en cada trazo' },
        { title: 'Poesía Visual', description: 'Cada obra cuenta una historia' },
    ];

    return (
        <div className="about-me-wrapper">
            <div className="titleBg">
                <motion.h1
                    ref={titleRef}
                    initial={{ opacity: 0, y: -50 }}
                    animate={titleInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="page-title"
                >
                    Sobre mi
                </motion.h1>
            </div>

            <main className="about-me-content">
                {/* Hero Section */}
                <motion.section
                    ref={heroRef}
                    className="hero-section"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <div className="hero-image-container">
                        <Image src={aboutMeImg || "/placeholder.svg"} alt="Analia Carlomagno" className="hero-image" />
                        <div className="hero-badge">Artista Plástica</div>
                    </div>
                    <div className="hero-text">
                        <h1 className="hero-name">Analia Carlomagno</h1>
                        <p className="hero-subtitle">Artista Plástica y Docente</p>
                        <blockquote className="hero-quote">
                            "Mi deseo es que mis obras y mis palabras lleguen lejos... Bien bien lejos...
                            Atraviesen fronteras y prejuicios... Permitir que muchas almas se vean
                            a través de mis ojos grandes."
                        </blockquote>
                    </div>
                </motion.section>

                <motion.section
                    ref={statsRef}
                    className="stats-section"
                    initial={{ opacity: 0, y: 30 }}
                    animate={statsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="stat-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={statsInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        >
                            <span className="stat-icon">
                                <img src={stat.icon} alt={stat.label} />
                            </span>

                            <h3 className="stat-number">{stat.number}</h3>
                            <p className="stat-label">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.section>


                {/* Artistic Style Section */}
                <section className="style-section">
                    <h2 className="section-title">Mi Estilo Artístico</h2>
                    <div className="style-grid">
                        {artisticStyle.map((style, index) => (
                            <div key={index} className="style-card">
                                <h3 className="style-card-title">{style.title}</h3>
                                <p className="style-card-description">{style.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Journey Timeline */}
                <motion.section
                    ref={journeyRef}
                    className="journey-section"
                    initial={{ opacity: 0 }}
                    animate={journeyInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">Mi Trayectoria</h2>
                    <div className="timeline">
                        {journey.map((item, index) => (
                            <motion.div
                                key={index}
                                className="timeline-item"
                                initial={{ opacity: 0, x: -30 }}
                                animate={journeyInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                            >
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                    <span className="timeline-year">{item.year}</span>
                                    <h3 className="timeline-title">{item.title}</h3>
                                    <p className="timeline-description">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Personal Stories */}
                <motion.section
                    ref={storiesRef}
                    className="stories-section"
                    initial={{ opacity: 0 }}
                    animate={storiesInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">Mi Historia</h2>
                    <div className="stories-grid">
                        <div
                            className={`story-card ${activeStory === 'familia' ? 'active' : ''}`}
                            onClick={() => setActiveStory(activeStory === 'familia' ? null : 'familia')}
                        >
                            <div className="story-image-wrapper">
                                <Image src={info2 || "/placeholder.svg"} alt="Familia" className="story-image" />
                            </div>
                            <div className="story-content">
                                <h3 className="story-title">Familia</h3>
                                <div className={`story-text ${activeStory === 'familia' ? 'expanded' : ''}`}>
                                    <p>
                                        Terminé mis estudios en el Centro Polivalente de Arte, una escuela donde se
                                        respiraba arte y donde conocí el amor con el que he compartido <strong>mi vida</strong> durante
                                        casi tres décadas, <strong>Pablo</strong>.
                                    </p>
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
                                </div>
                                <button className="story-toggle">
                                    {activeStory === 'familia' ? 'Leer menos' : 'Leer más'}
                                </button>
                            </div>
                        </div>

                        <div
                            className={`story-card ${activeStory === 'deseo' ? 'active' : ''}`}
                            onClick={() => setActiveStory(activeStory === 'deseo' ? null : 'deseo')}
                        >
                            <div className="story-image-wrapper">
                                <Image src={info1 || "/placeholder.svg"} alt="Deseos" className="story-image" />
                            </div>
                            <div className="story-content">
                                <h3 className="story-title">Deseos...</h3>
                                <div className={`story-text ${activeStory === 'deseo' ? 'expanded' : ''}`}>
                                    <p>
                                        <strong>Deseo, deseo...</strong> que mis mujeres y que mis relatos traspasen la frontera,
                                        y que antes que mi piel se arrugue demasiado poder ver concretarse todo lo que anhelo.
                                    </p>
                                    <p>
                                        Mi presente está lleno de <strong>sueños</strong>. Que están repletos de viajes, <strong>familia</strong> y
                                        expansión personal...
                                    </p>
                                    <p>
                                        Vivo llena de <strong>ilusiones</strong>, y a veces me vuelvo obsesiva por poder cumplir mis metas.
                                    </p>
                                    <p>
                                        En ello estoy, con <strong>subes y bajas</strong>, fiel a una canceriana modelo,
                                        que <strong>ama lo que hace</strong> y que se apasiona con todo lo que emprende.
                                    </p>
                                </div>
                                <button className="story-toggle">
                                    {activeStory === 'deseo' ? 'Leer menos' : 'Leer más'}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.section>
            </main>
        </div>
    );
};

export default AboutMe;
