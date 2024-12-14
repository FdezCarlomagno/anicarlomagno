import { Link } from 'react-router-dom';
import React from 'react';
import '../pages/pagesStyles/paintings.css';
import FooterPaintingText from './footerPaintingText';
import { motion } from 'framer-motion';

const ChooseForm = () => {
    return (
        <main className='choosePainting'>
            <div className='choose-container'>
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Elegí que te gustaría
                </motion.h1>
                <div className="choosePainting-button-container">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Link to='/obra-personalizada'>
                            <button className='custom-painting-btn'>Obra personalizada</button>
                        </Link>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Link to='/obras-en-stock'>
                            <button className='my-paintings-choose-btn'>Obras en stock</button>
                        </Link>
                    </motion.div>
                </div>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <FooterPaintingText />
            </motion.div>
        </main>
    );
}

export default ChooseForm;