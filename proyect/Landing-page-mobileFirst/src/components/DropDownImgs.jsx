import React, { useState, useMemo } from 'react';
import cuadros from '../objects/newPaintings.jsx';
import { Image } from "@unpic/react";

const DropDownImgs = ({ onImageClick }) => {
    const [seeMore, setSeeMore] = useState(6);

    const handleSeeMore = (e) => {
        e.preventDefault();
        setSeeMore(seeMore + 3);
    };

    const displayedCuadros = useMemo(() => cuadros.slice(0, seeMore), [seeMore]);

    return (
        <div className="dropDownImgs-container">
            {displayedCuadros.map((cuadro, index) => (
                <div key={index} className="dropDownImage-box" onClick={() => onImageClick(cuadro.src, cuadro.title)}>
                    <Image src={cuadro.src} alt={`Cuadro ${index + 1}`} />
                </div>
            ))}
            {seeMore < cuadros.length && <button className='linkTo-aboutMe-btn' onClick={(e) => handleSeeMore(e)}>Ver más</button>}
        </div>
    );
};

export default DropDownImgs;
