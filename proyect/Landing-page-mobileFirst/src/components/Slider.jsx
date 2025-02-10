import React, { useRef, useState } from 'react';
import aniHeader1 from './imgs/aniHeader.jpg';
import aniHeader2 from './imgs/aniHeader2.jpg';
import aniSection1 from './imgs/aniSection1.jpg';
import aniSection2 from './imgs/aniSection2.jpg';
import cuadro1 from './imgs/cuadro1.jpg';
import cuadro2 from './imgs/cuadro2.jpg';
import cuadro3 from './imgs/cuadro3.jpg';
import paintBrush from './assets/WhitePaintBrush.svg';
import video from './assets/wspVideo-header.mp4';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Image } from '@unpic/react'


const Slider = () => {
    const sliderRef = useRef(null);
    const isInView = useInView(sliderRef, { once: true, amount: 0.5 });
    const [isVideoLoaded, setIsVideoLoaded] = useState(false); // State to track video load status

    return (
        <div className="container">
            <div className="slider" ref={sliderRef}>
                {/** Apply animation only if in view */}
                <motion.video
                    loop="loop"
                    src={video}
                    autoPlay
                    playsInline
                    muted
                    preload="none"
                    onLoadedData={() => setIsVideoLoaded(true)} // Update state when video loads
                    style={{
                        transition: 'filter 1.5s ease, opacity 1.5s ease',
                        opacity: isInView ? 1 : 0.5,
                        filter: isVideoLoaded ? 'blur(0px)' : 'blur(8px)', // Apply blur dynamically
                    }}
                ></motion.video>

                {/* Name and Logo Section */}
                <div className="nameLogo">
                    <motion.h1
                        initial={{ opacity: 0, x: -100 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
                        transition={{ duration: 0.8 }}
                    >
                        anicarlomagno
                    </motion.h1>
                    <motion.h2
                        initial={{ opacity: 0, x: 100 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        artista plástica
                    </motion.h2>
                    <Link to="/obras-en-stock">
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <motion.button
                                className="btnMyPaintings"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Mis obras <Image src={paintBrush} alt="Paintbrush logo" />
                            </motion.button>
                        </motion.div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Slider;
