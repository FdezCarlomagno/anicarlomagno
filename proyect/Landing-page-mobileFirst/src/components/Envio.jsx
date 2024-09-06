import React from 'react'
import Truck from '../components/assets/Truck.svg'

const Envio = () => {
    return (
        <section className="envioSection">
            <img src={Truck} alt="" />
            <p>Realizamos envíos a<span> todo el país</span></p>
        </section>

    )
}

export default Envio;