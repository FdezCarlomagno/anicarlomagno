import React, { useState } from 'react';
import '../pages/pagesStyles/agendas.css';
import DropDownImgs from './DropDownImgs';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Image } from "@unpic/react";


const AgendaPreview = ({ formData, imgRef, imgInView, nameStyles, selectedImage }) => {
    return (
        <>
            <motion.div
                ref={imgRef}
        
                transition={{ duration: 0.5 }}
                className='agenda-preview'
            >
                <p className='preview-text'>Vista previa</p>

                <div className='customAgenda'>
                    {formData.type && <h2>Tu {formData.type}</h2>}
                    <div className='myAgenda-img-container'>
                        {selectedImage && (
                            <Image
                                src={selectedImage}
                                alt={formData.bgImg ? formData.bgImg : 'Seleccioná una obra con el selector del formulario'}
                            />
                        )}
                        <div className='myAgenda-name-container'>
                            {<h2 className={formData.textDirection} style={nameStyles}>{formData.username}</h2>}
                        </div>
                        <div>
                        </div>
                        {selectedImage && <>
                           <p className='text-left'>
                             Medida de {formData.type}: <span>{formData.type === 'cuaderno-a4' ? '21cm x 29,7cm' : '15.5cm x 21.5cm'}</span><br />
                             N° de Hojas: <span>100</span>
                            </p>
                        </>
                        }
                    </div>
                </div>
            </motion.div>
        </>
    )
}

export default AgendaPreview;