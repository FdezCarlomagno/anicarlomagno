import React, { useEffect, useState } from 'react';
import './pagesStyles/paintings.css';
import Cuadro from '../components/Cuadro.jsx';
import paintings from '../objects/paintings.jsx';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';


const Paintings = () => {

    return (
        <main className="paintings">
            <div className="titleBg">
                <h1 className='myPaintingsTitle'>Obras en stock</h1>
            </div>
            <div className="paintingsColumn">
                {paintings.map((cuadro, index) => {
                    const { ref, inView } = useInView({
                        threshold: 0.05, 
                    });

                    return (
                        <motion.div
                            className="cuadro"
                            key={cuadro.name}
                            ref={ref}
                            initial={{ scale: 0.9, rotate: -5, y: 20 }} // Initial state
                            animate={inView ? { scale: 1, rotate: 0, y: 0 } : {}} // Animate to this state when in view
                            transition={{
                                duration: 0.7,
  
                            }} // Transition duration
                        >
                            <Cuadro painting={cuadro} />
                        </motion.div>
                    );
                })}
            </div>
            <div className='titleAndbtn'>
                <Link to='/obra-personalizada'>
                    <button className='btnAgenda' id='btnPainting'>Quiero mi obra</button>
                </Link>
            </div>
        </main>
    );
}

export default Paintings;