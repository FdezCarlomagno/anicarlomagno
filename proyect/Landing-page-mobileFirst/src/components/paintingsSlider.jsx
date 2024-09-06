import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import cuadro1 from './imgs/cuadro1.jpg'
import cuadro2 from './imgs/cuadro2.jpg'
import cuadro3 from './imgs/cuadro3.jpg'



const sliderStyles = {
    height: '100%',
    position: 'relative',
    marginBottom: '5%'
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


const PaintingSlider = ({ paintings }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [dotColor, setDotColor] = useState(false)


    const prevSlide = () => {
        setCurrentIndex((prevIndex) => prevIndex === 0 ? paintings.length - 1 : prevIndex - 1)
    }
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => prevIndex === paintings.length - 1 ? 0 : prevIndex + 1)
    }

    const paintingsStyles = {
        backgroundImage: `url(${paintings[currentIndex].src})`,
        width: '100%',
        height: '100%',
        borderRadius: '10px',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        transition: 'background-image 0.3s ease-in-out',
        
    };
    /*backgroundImage: `url(/@fs/C:/Users/Usuario/Desktop/FACULTAD/LANDING%20ANI/Landing%20page%20(mobile%20first)/Landing-page-mobileFirst/src/components/imgs/agenda1.jpg)`,*/ 
    
    console.log(paintings[currentIndex].src)
    console.log(currentIndex)

    const dotStyle = {
        margin: "0 3px",
        cursor: "pointer",
      };

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
        setDotColor(!dotColor)
      };

    return (
        <div className="paintingSlider" style={sliderStyles}>

            <div style={leftArrowStyles} onClick={prevSlide}>
                ❮
            </div>
            <div style={rightArrowStyles} onClick={nextSlide}>
                ❯
            </div>

            <div className='paintingContainerSlider' style={paintingsStyles}></div>
            <div style={dotsContainerStyles}>
                {paintings.map((cuadro, index) => (
                    <div key={index} style={{
                        ...dotStyle,
                        color: currentIndex === index ? 'blueviolet' : '#888',
                        // Example of active and inactive dot color
                    }}  onClick={()=> goToSlide(index)}>
                       <div className='dot'>●</div> 
                    </div>
                ))}
            </div>
            
        </div>
    )
}

export default PaintingSlider