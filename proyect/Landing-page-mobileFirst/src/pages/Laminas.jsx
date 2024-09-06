import React, { useState } from 'react'
import Imgs from '../components/DropDownImgs.jsx'
import '../pages/pagesStyles/laminas.css'

const Laminas = () => {

    const [dropDown, setDropDown] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [name, setName] = useState('')
    const precio = 4900;

    const lamina = {
        src: selectedImage,
        name: name
    }
    const toggleDropDown = () => {
        setDropDown(!dropDown);
    }

    const handleImageClick = (image, nombre) => {
        setSelectedImage(image);
        setName(nombre);
    };

    const handleLaminaBtn = (e) => {
        e.preventDefault();
        const message = `Hola! Ani, me gustaría encargarte una lámina de ${lamina.name}. Muchas gracias!`

        const whatsappURL = `https://api.whatsapp.com/send?phone=542494245966&text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    }
    return (
        <main className="laminas">
            <div className="titleBg">
                <h1 className='myPaintingsTitle'>Láminas</h1>
            </div>
            <div className="laminasContainer">
                <div>
                    <label>
                        <h2>Seleccione una lámina</h2>
                        <div className="dropDownAgendas">
                       
                            <div className="dropDownArrow">
                                <p>Seleccione </p><button className='dropDownAgendas-btn' onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropDown();
                                }
                                }>▼</button>
                            </div>
                            {dropDown && <Imgs onImageClick={handleImageClick} />}
                        </div>
                    </label>
                </div>
                {lamina.src && <div className='chosen-lamina'>
                    <h2>Lamina elegida: {lamina.name}</h2>
                        <img src={lamina.src} alt="" />
                        <button className='buy-book-btn' onClick={(e) => handleLaminaBtn(e)}>Comprar lámina de {lamina.name}</button>
                    </div>}
                    <div className="lamina-price">${precio}</div>
            </div>
            <div className="secondSection">
            <div className="secondSectionInfo">
                <h2>Láminas</h2>
                <div className="flex-column">
                    <div>
                        <p>
                           Láminas impresas en <span>papel fotográfico</span> de alta calidad, tamaño A4 (21 cm x 29,7 cm), para enmarcar o coleccionar.
                        </p>
                    </div>
                    <div>
                        <p>
                            <strong>Consultá promos <span>comprando</span> más de un producto.</strong>
                        </p>
                    </div>
                </div>

            </div>
        </div>
        </main>
    )
}

export default Laminas;