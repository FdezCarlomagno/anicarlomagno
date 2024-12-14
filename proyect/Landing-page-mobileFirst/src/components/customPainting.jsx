import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import '../pages/pagesStyles/customPainting.css';
import FooterPaintingText from './footerPaintingText';
import { motion } from 'framer-motion';

const CustomPainting = () => {
    const [inputValue, setInputValue] = useState({
        name: '',
        surname: '',
        size1: '',
        size2: '',
        img: '',
        description: '',
        customPhoto: false
    });

    const { ref: titleRef, inView: titleInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const { ref: formRef, inView: formInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setInputValue((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = `Hola! Ani Soy ${inputValue.name} ${inputValue.surname}. Me gustaría encargarte una obra de estas dimensiones: ${inputValue.size1}cm X ${inputValue.size2}cm. ${inputValue.description}. ${inputValue.customPhoto ? 'Me gustaría agregar una foto' : ''}. Muchas gracias!`;

        const whatsappURL = `https://api.whatsapp.com/send?phone=542494245966&text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    };

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
                    Obra personalizada
                </motion.h1>
            </div>
            <main className='custom-paintings'>
                <motion.div 
                 animate={titleInView ? { y: 0 } : {}}
                 transition={{ duration: 0.5, delay: 0.2 }}
                className='custom-painting-form-container'>
                    <motion.h1
                        initial={{ opacity: 0, x: 50 }}
                        animate={titleInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Pedí tu obra personalizada
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={titleInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        Encargá tu obra personalizada completando los campos de abajo.
                    </motion.p>
                    <motion.div
                        ref={formRef}
                        className='custom-painting-form'
                        initial={{ opacity: 0, y: 20 }}
                        animate={formInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <form onSubmit={handleSubmit}>
                            <div className='name-surname-inputs'>
                                <label htmlFor='name'>
                                    Nombre
                                    <input
                                        type='text'
                                        name='name'
                                        id='name'
                                        placeholder='Ingrese su nombre'
                                        required
                                        value={inputValue.name}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label htmlFor='surname'>
                                    Apellido
                                    <input
                                        type='text'
                                        name='surname'
                                        id='surname'
                                        placeholder='Ingrese su apellido'
                                        required
                                        value={inputValue.surname}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>
                            <div className="flex-row">
                            <div className='size-description-container'>
                                <label htmlFor='size1'>
                                    Dimensiones (cm)
                                    <div className='size-input-container'>
                                        <input
                                            type='number'
                                            name='size1'
                                            id='size1'
                                            required
                                            value={inputValue.size1}
                                            onChange={handleInputChange}
                                        />
                                        <p>X</p>
                                        <input
                                            type='number'
                                            name='size2'
                                            id='size2'
                                            required
                                            value={inputValue.size2}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </label>
                            </div>
                            <div className='description-input'>
                                <label htmlFor='description'>
                                    Descripción
                                    <textarea
                                        name='description'
                                        id='description'
                                        placeholder='Ingresa una breve descripción de lo que deseas'
                                        required
                                        value={inputValue.description}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>
                            </div>
                            <div className='custom-photo-checkbox'>
                                <label htmlFor='customPhoto'>
                                    ¿Deseas agregar una foto?
                                    <input
                                        type='checkbox'
                                        name='customPhoto'
                                        id='customPhoto'
                                        checked={inputValue.customPhoto}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>
                           
                            <motion.button
                                className="submit-btn"
                                type="submit"
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Pedir presupuesto
                            </motion.button>
                           
                        </form>
                    </motion.div>
                </motion.div>
            </main>
            <FooterPaintingText />
        </div>
    );
};

export default CustomPainting;
