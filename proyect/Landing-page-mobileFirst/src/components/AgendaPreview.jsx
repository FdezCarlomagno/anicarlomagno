import React, { useState } from 'react';
import '../pages/pagesStyles/agendas.css';
import DropDownImgs from './DropDownImgs';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';


const AgendaPreview = ({ formData, imgRef, imgInView, nameStyles, selectedImage }) => {
    return (
        <>
             <motion.div
                ref={imgRef}
                initial={{ opacity: 0, y: 20 }}
                animate={imgInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
            >   
                <p className='preview-text'>Vista previa</p>
                <div className='customAgenda'>
                    {formData.type && <h2>Tu {formData.type}</h2>}
                    <div className='myAgenda-img-container'>
                        {selectedImage && (
                            <img
                                src={selectedImage}
                                alt={formData.bgImg ? formData.bgImg : 'Seleccioná una obra con el selector del formulario'}
                            />
                        )}
                        <div className='myAgenda-name-container'>
                            {<h2 className={formData.textDirection} style={nameStyles}>{formData.username}</h2>}
                        </div>
                        <div>
                        </div>
                        {formData.type && <span>OFERTA DE LANZAMIENTO</span>}
                    </div>
                </div>
            </motion.div>
        </>
    )
}

export default AgendaPreview;