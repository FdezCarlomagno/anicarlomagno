import React, { useState } from 'react'
import './pagesStyles/paintings.css'
import Cuadro from '../components/Cuadro.jsx'
import paintings from '../objects/paintings.jsx'
import { Link } from 'react-router-dom'



const Paintings = () => {


    return (
        <main className="paintings">
            <div className="titleBg">
                 <h1 className='myPaintingsTitle'>Obras en stock</h1>
            </div>
            <div className="paintingsColumn">
                {paintings.map((cuadro) => (
                    <div className="cuadro" key={cuadro.name}>
                        <Cuadro painting={cuadro} />
                    </div>
                ))}
            </div>
            <div className='titleAndbtn'>
                <Link to='/obra-personalizada'><h1><button className='btnAgenda' id='btnPainting'>Quiero mi obra</button></h1></Link>
            </div>
        </main>

    )
}

export default Paintings