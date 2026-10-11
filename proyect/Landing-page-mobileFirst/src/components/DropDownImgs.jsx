import React, { useState, useMemo, useRef, useEffect } from 'react';
import cuadros from '../objects/newPaintings.jsx';
import { Image } from "@unpic/react";

const DropDownImgs = ({ onImageClick }) => {
    const [seeMore, setSeeMore] = useState(6);
    const containerRef = useRef(null);
    const optionRefs = useRef([]);
    const pendingFocusRef = useRef(null);

    const handleSeeMore = (e) => {
        e.preventDefault();
        if (e.detail === 0) {
            pendingFocusRef.current = seeMore;
        }
        setSeeMore(seeMore + 3);
    };

    useEffect(() => {
        if (pendingFocusRef.current === null) return;
        const option = optionRefs.current[pendingFocusRef.current];
        pendingFocusRef.current = null;
        if (option) option.focus();
    }, [seeMore]);

    const displayedCuadros = useMemo(() => cuadros.slice(0, seeMore), [seeMore]);

    const handleKeyDown = (e) => {
        const options = optionRefs.current.slice(0, displayedCuadros.length);
        const current = options.indexOf(e.target);
        if (current === -1) return;

        const columns = containerRef.current
            ? getComputedStyle(containerRef.current).gridTemplateColumns.split(' ').length || 1
            : 1;
        const last = options.length - 1;
        let next;

        switch (e.key) {
            case 'ArrowRight':
                next = Math.min(current + 1, last);
                break;
            case 'ArrowLeft':
                next = Math.max(current - 1, 0);
                break;
            case 'ArrowDown':
                next = Math.min(current + columns, last);
                break;
            case 'ArrowUp':
                next = Math.max(current - columns, 0);
                break;
            case 'Home':
                next = 0;
                break;
            case 'End':
                next = last;
                break;
            default:
                return;
        }

        e.preventDefault();
        if (options[next]) options[next].focus();
    };

    return (
        <div
            ref={containerRef}
            id="opciones-obras"
            className="dropDownImgs-container"
            role="group"
            aria-label="Obras para elegir"
            onKeyDown={handleKeyDown}
        >
            {displayedCuadros.map((cuadro, index) => (
                <button
                    key={index}
                    ref={(el) => { optionRefs.current[index] = el; }}
                    type="button"
                    className="dropDownImage-box btn-reset"
                    onClick={() => onImageClick(cuadro.src, cuadro.title)}
                >
                    <Image src={cuadro.src} alt={cuadro.title?.trim() || `Obra ${index + 1}`} />
                </button>
            ))}
            {seeMore < cuadros.length && <button className='linkTo-aboutMe-btn' onClick={(e) => handleSeeMore(e)}>Ver más</button>}
        </div>
    );
};

export default DropDownImgs;
