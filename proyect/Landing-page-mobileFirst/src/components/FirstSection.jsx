import React, { useState } from 'react'
import aniSection from './imgs/aniSection3.jpg'
import aniSection2 from './imgs/aniSection7.jpg'
import { Link } from 'react-router-dom'
import arrowRight from '../components/assets/arrowRight.svg'

const FirstSection = () => {
    return (
        <section className='firstSection'>
            <div className="firstSection-container">
                <img
                    className='imgAniSection1'
                    src={aniSection} />
                <div className="firstSection-info">
                    <h3>Quién soy</h3>
                    <div className="flex-column">
                        <div>
                            Soy <span>Ani Carlomagno</span>, artista plástica y docente de Tandil.
                        </div>
                        <div>
                            Pinto mujeres de <span>ojos grandes</span>, un símbolo de mi propio camino hacia la <span>visibilidad</span> y la <span>expresión</span> de las vivencias que me han marcado.
                        </div>
                        <Link to="/sobre-mi"><button className='linkTo-aboutMe-btn'>Saber más</button></Link>
                    </div>
                </div>
            </div>
            <div className="firstSection-container" id='firstSection-container2'>
                <img
                    className='imgAniSection2'
                    src={aniSection2} />
                <div className="firstSection-info">
                    <h3>Mis pasiones</h3>
                    <div className='flex-column'>
                        <div>
                            Me apasiona profundamente la <span>pintura</span> y la <span>docencia</span>, dos lenguajes mágicos a través de los cuales transmito mi amor por el <span>arte</span> y la <span>música</span>.
                        </div>
                        <Link to="/sobre-mi"><button className='linkTo-aboutMe-btn'>Saber más</button></Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FirstSection

/*``*/ 