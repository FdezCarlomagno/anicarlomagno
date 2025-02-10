import React, { useState, useEffect } from 'react';
import { Image } from "@unpic/react";

const Cuadro = ({ painting }) => {

    const handleConsultClick = (painting) => {
        const message = `Hola!, estoy interesado en ${painting.name}, me gustaria saber el precio de esta obra, Ani.`;
        const whatsappURL = `https://api.whatsapp.com/send?phone=542494245966&text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    };


    return (
        <>
            <div className="paintingCard">
                <div className={painting.offer ? 'showInOffer' : 'hideInOffer'}>
                    <p>{painting.sold ? "VENDIDO" : "40% OFF"}</p>
                </div>
                <Image
                    src={painting.src} 
                    alt={painting.name} 
                    layout="constrained"
                />
                <div className='paintingContainer'>
                    <div className='paintingInfoContainer'>
                        <h1>{painting.name}</h1>
                        <p>{painting.description}</p>
                    </div>
                    <div className="btnPriceContainer">
                        <h3 className={painting.offer ? 'inOffer' : ''}>{painting.size}</h3>
                        <button 
                            className='addToCart' 
                            onClick={() => handleConsultClick(painting)}
                        >
                            Consultar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cuadro;