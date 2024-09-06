import React from 'react';
import paintings from '../objects/paintings';
import Cuadro from './Cuadro';
import { Link } from 'react-router-dom'


const PaintingInfo = (props) => {
    const cuadroId = props.match.params.id; // Obtiene el ID de la URL
    const cuadro = paintings.find(cuadro => cuadro.name === cuadroId); // Encuentra el cuadro por ID

    const handleConsultClick = (painting) => {
        const message = `Hola!, estoy interesado en ${painting.name}, me gustaria conocer mas informacion sobre este cuadro, Ani`
        const whatsappURL = `https://api.whatsapp.com/send?phone=542494245966&text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank')
    }

    if (!cuadro) {
        return <div>Cuadro no encontrado</div>; // Manejo de caso donde no se encuentra el cuadro
    }

    return (
        <section className='sectionPaintingInfo'>
            <button className='goBackButton'><Link to='/stock-paintings'>❮</Link></button>
        <div className="paintingCard">
            <div className={cuadro.offer ? 'showInOffer' : 'hideInOffer'}>
            <p>{cuadro.sold ? "VENDIDO" : "40% OFF"}</p>
            </div>
            <img src={cuadro.src} alt={cuadro.name} />
            <div className='paintingContainer'>
                <div className='paintingInfoContainer'>
                    <h1>{cuadro.name}</h1>
                    <p>{cuadro.description}</p>
                </div>
                <div className="btnPriceContainer">
                    <h3 className={cuadro.offer ? 'inOffer' : ''}>{cuadro.size}</h3>
                    <button className='addToCart' onClick={()=> handleConsultClick(cuadro)}>Consultar</button>
                </div>
            </div>
        </div>
        </section>
    )
}

export default PaintingInfo;
