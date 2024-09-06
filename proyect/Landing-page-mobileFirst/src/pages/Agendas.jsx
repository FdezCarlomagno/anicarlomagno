import React from 'react'
import { Link } from 'react-router-dom'
import '../pages/pagesStyles/agendas.css'
import PaintingSlider from '../components/paintingsSlider.jsx'
import intAgendas from '../objects/intAgendas.jsx'
import a1 from '../components/imgs/agenda1.jpg'
import a2 from '../components/imgs/agenda2.jpg'
import a3 from '../components/imgs/agenda3.jpg'
import a4 from '../components/imgs/agenda4.jpg'
import a5 from '../components/imgs/agenda5.jpg'
import a6 from '../components/imgs/agenda6.jpg'
import a7 from '../components/imgs/agenda7.jpg'
import a8 from '../components/imgs/agenda8.jpg'



const Agendas = () => {


    const containerStyles = {
        width: '300px',
        height: '450px',
        margin: '0 auto',
        marginBottom: '10%',
    }

    return (
        <div>
            <div className="titleBg">
                <h1 className='myPaintingsTitle'>Agendas y cuadernos</h1>
            </div>
            <main className="agendas">
                <div className='agendaPageContainer'>
                    <div className='paintingSliderContainer' style={containerStyles}>
                        <PaintingSlider paintings={intAgendas} />
                    </div>
                </div>
                <div className='btn-section-agenda-container'>
                    <div className='titleAndbtn'>
                        <Link to='/agenda-personalizada'><h1><button className='btnAgenda'>Quiero mi agenda/cuaderno</button></h1></Link>
                    </div>
                    <section className='section-agendaText'>
                        <div className='section-agendaText-container'>
                            <h2>Páginas llenas de arte</h2>
                            <div className='section-agendaText-flex-column'>
                                <p>
                                    Tanto <span>agendas</span> como <span>cuadernos</span>, poseen tapa y contrapa dura con anillo doble de metal.
                                </p>
                                <p>
                                    En el interior encontrarás <span>frases</span> y <span>relatos</span> escritos por mi, especialmente dedicados a vos. Además, incluyen calendario, stickers, imágenes para colorear, sobre, cinta de razo, y señalador.
                                </p>
                                <p>
                                    Cada año nuevo que comienza, los interiores de agendas y cuadernos se renuevan con diseños que le dan ese toque único a estas <span>pequeñas obras de arte</span> que, te acompañaran cada día de tu vida.
                                </p>
                                <div>
                                    <p>
                                        <strong>Consultá promos <span>comprando</span> más de un producto.</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <div className='paintingImgs-section'>
                <Link to="/agenda-personalizada">
                    <div className='paintingImgs-box'><img src={a1} /></div>
                    <div className='paintingImgs-box'><img src={a2} /></div>
                    <div className='paintingImgs-box'><img src={a3} /></div>
                    <div className='paintingImgs-box'><img src={a4} /></div>
                    <div className='paintingImgs-box'><img src={a5} /></div>
                    <div className='paintingImgs-box'><img src={a6} /></div>
                    <div className='paintingImgs-box'><img src={a7} /></div>
                    <div className='paintingImgs-box'><img src={a8} /></div>
                </Link>
            </div>
        </div>
    )
}

export default Agendas