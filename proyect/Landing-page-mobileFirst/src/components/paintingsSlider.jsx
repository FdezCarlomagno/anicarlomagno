import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import cuadro1 from './imgs/cuadro1.jpg'
import cuadro2 from './imgs/cuadro2.jpg'
import cuadro3 from './imgs/cuadro3.jpg'
import { Image } from '@unpic/react'

const slideAlt = (painting, index) => painting.alt || `Painting ${index + 1}`;

const PaintingSlider = ({ paintings }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [dotColor, setDotColor] = useState(false)

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => prevIndex === 0 ? paintings.length - 1 : prevIndex - 1)
    }
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => prevIndex === paintings.length - 1 ? 0 : prevIndex + 1)
    }

    const sliderStyles = {
        height: '100%',
        position: 'relative',
        marginBottom: '5%',
    }

    const leftArrowStyles = {
        position: 'absolute',
        top: '50%',
        transform: 'translate(0, -50%)',
        left: '16px',
        fontSize: '40px',
        color: '#fff',
        zIndex: '1',
        cursor: 'pointer',
    }
    const rightArrowStyles = {
        position: 'absolute',
        top: '50%',
        transform: 'translate(0, -50%)',
        right: '16px',
        fontSize: '40px',
        color: '#fff',
        zIndex: '1',
        cursor: 'pointer',
    }

    const dotsContainerStyles = {
        display: "flex",
        justifyContent: "center",
    };

    const dotStyle = {
        margin: "0 3px",
        cursor: "pointer",
        width: "20px"
    };

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
        setDotColor(!dotColor)
    };

    const paintingsStyles = {
        width: '300px', // Ajusta el ancho fijo que prefieras
        height: '500px', // Ajusta la altura fija que prefieras
        borderRadius: '10px',
        overflow: 'hidden',
    };
    
    const imageStyles = {
        width: '100%',
        height: '100%',
        objectFit: 'cover', // Esto asegura que la imagen se ajuste bien al contenedor
        borderRadius: '10px',
        transition: '0.3s ease-in-out',
    };

    const currentPainting = paintings[currentIndex];

    return (
        <section className="paintingSlider" style={sliderStyles}>
            <button type="button" className="btn-reset" style={leftArrowStyles} onClick={prevSlide} aria-label="Foto anterior"><span aria-hidden="true">❮</span></button>
            <button type="button" className="btn-reset" style={rightArrowStyles} onClick={nextSlide} aria-label="Foto siguiente"><span aria-hidden="true">❯</span></button>
            
            <div className='paintingContainerSlider' style={paintingsStyles}>
                <Image
                    src={currentPainting.src}
                    alt={slideAlt(currentPainting, currentIndex)}
                    style={imageStyles}
                />
            </div>
            
            <div style={dotsContainerStyles}>
                {paintings.map((cuadro, index) => (
                    <button
                        key={index}
                        type="button"
                        className="btn-reset"
                        style={{
                            ...dotStyle,
                            color: currentIndex === index ? 'blueviolet' : '#888',
                        }}
                        onClick={() => goToSlide(index)}
                        aria-label={`Ir a la foto ${index + 1}`}
                        aria-current={currentIndex === index ? 'true' : undefined}
                    >
                        <span className='dot' aria-hidden="true" style={{ display: 'block' }}>●</span>
                    </button>
                ))}
            </div>
        </section>
    );
}

export default PaintingSlider;
