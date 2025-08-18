import React, { useState } from 'react';
import Imgs from '../components/DropDownImgs.jsx';
import '../pages/pagesStyles/laminas.css';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Image } from '@unpic/react'
const Laminas = () => {
    const [dropDown, setDropDown] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [name, setName] = useState('');
    const precio = 6900;

    const lamina = {
        src: selectedImage,
        name: name
    };

    const toggleDropDown = () => {
        setDropDown(!dropDown);
    };

    const handleImageClick = (image, nombre) => {
        setSelectedImage(image);
        setName(nombre);
    };

    const handleLaminaBtn = (e) => {
        e.preventDefault();
        const message = `Hola! Ani, me gustaría encargarte una lámina de ${lamina.name}. Muchas gracias!`;

        const whatsappURL = `https://api.whatsapp.com/send?phone=542494245966&text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    };

    const { ref: titleRef, inView: titleInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const { ref: dropDownRef, inView: dropDownInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const { ref: imageRef, inView: imageInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const { ref: infoRef, inView: infoInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <main className="laminas">
            <div className="titleBg">
                <motion.h1
                    ref={titleRef}
                    initial={{ opacity: 0, y: -50 }}
                    animate={titleInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className='myPaintingsTitle'
                >
                    Láminas
                </motion.h1>
            </div>
            <div className="laminasContainer">
                <div>
                    <label>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 } }
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >Seleccione una lámina</motion.h2>
                        <motion.div
                            ref={dropDownRef}
                            initial={{ opacity: 0, y: 20 }}
                            animate={dropDownInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="dropDownAgendas"
                        >
                            <div className="dropDownArrow">
                                <p>Seleccione </p>
                                <button className='dropDownAgendas-btn' onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropDown();
                                }}>
                                    ▼
                                </button>
                            </div>
                            {dropDown && <Imgs onImageClick={handleImageClick} />}
                        </motion.div>
                    </label>
                </div>
                {lamina.src && (
                    <motion.div
                        ref={imageRef}
                        className='chosen-lamina'
                        initial={{ opacity: 0, y: 20 }}
                        animate={imageInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <h2>Lámina elegida: {lamina.name}</h2>
                        <Image src={lamina.src} alt={lamina.name} />
                        <button className='buy-book-btn' onClick={(e) => handleLaminaBtn(e)}>
                            Comprar lámina de {lamina.name}
                        </button>
                    </motion.div>
                )}
                <motion.div 
                     ref={dropDownRef}
                     initial={{ opacity: 0, y: 20 }}
                     animate={dropDownInView ? { opacity: 1, y: 0 } : {}}
                     transition={{ duration: 0.5, delay: 0.5 }}
                className="lamina-price">${precio}</motion.div>
            </div>
            <motion.div
                ref={infoRef}
                className="secondSection"
                initial={{ opacity: 0, y: 20 }}
                animate={infoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <div className="secondSectionInfo">
                    <h2>Láminas</h2>
                    <div className="flex-column">
                        <div>
                            <p>
                                Láminas impresas en <span>papel fotográfico</span> de alta calidad, tamaño A4 (21 cm x 29,7 cm), para enmarcar o coleccionar.
                            </p>
                        </div>
                        <div>
                            <p>
                                <strong>Consultá promos <span>comprando</span> más de un producto.</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </main>
    );
};

export default Laminas;
