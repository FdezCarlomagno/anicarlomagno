import React from 'react'
import aniHeader1 from './imgs/aniHeader.jpg'
import aniHeader2 from './imgs/aniHeader2.jpg'
import aniSection1 from './imgs/aniSection1.jpg'
import aniSection2 from './imgs/aniSection2.jpg'
import cuadro1 from './imgs/cuadro1.jpg'
import cuadro2 from './imgs/cuadro2.jpg'
import cuadro3 from './imgs/cuadro3.jpg'
import paintBrush from './assets/WhitePaintBrush.svg'
import { useState } from 'react'
import  video  from './assets/wspVideo-header.mp4'
import { Link } from 'react-router-dom'
import Spinner from './spinner.jsx'


const Slider = () => {

    const [responsiveImgs, setResponsiveImgs] = useState(false);

    return (
        <div className="container">
            <div className='slider'>
                <video
                    loop='loop'
                    src={video}
                    autoPlay 
                    playsInline 
                    muted
                    preload='none'
                >
                </video>
                <div className='nameLogo'>
                    <h1>anicarlomagno</h1>
                    <h2>artista plástica</h2>
                    <Link to='/obras-en-stock'><button className='btnMyPaintings'>Mis obras <img src={paintBrush} alt="" /></button></Link>
                    <div className="mediaWrapper">

                    </div>
                </div>
                <div className='column'>
                    <img src={cuadro2} className='leftTopCorner' />
                    <img src={aniSection1} className='leftBottomCorner' />
                </div>
                <div className='column'>
                    <img src={aniHeader1} />
                    <img src={cuadro2} />
                </div>
                <div className='column'>
                    <img src={aniSection2} className='rightTopCorner' />
                    <img src={cuadro3} className='rightBottomCorner' />
                </div>
            </div>
        </div>
    )
}

export default Slider