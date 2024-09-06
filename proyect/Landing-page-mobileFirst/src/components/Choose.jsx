import { Link } from 'react-router-dom'
import React from 'react'
import '../pages/pagesStyles/paintings.css'
import FooterPaintingText from './footerPaintingText'

const ChooseForm = () => {
    return (
        <main className='choosePainting'>
            <div className='choose-container'>
                <h1>Elegí que te gustaria</h1>
                <div className="choosePainting-button-container">
                    <Link to='/obra-personalizada'><button className='custom-painting-btn'>Obra personalizada</button></Link>
                    <Link to='/obras-en-stock'><button className='my-paintings-choose-btn'>Obras en stock</button></Link>
                </div>
            </div>
            <FooterPaintingText />
        </main>
    )
}

export default ChooseForm