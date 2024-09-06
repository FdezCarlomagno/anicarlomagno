import React from 'react'
import wspIcon from './assets/wspIcon.svg'

const WhatsappIcon = () => {

    const handleClickWsp = () => {
        const message = `Hola Ani, Fui redireccionado/a de tu pagina web hacia tu contacto, como estas?`
        const whatsappURL = `https://api.whatsapp.com/send?phone=542494245966&text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, `_blank`)
    }
    return (
        <div className="whatsappIcon" onClick={handleClickWsp}>
            <img src={wspIcon} />
        </div>
    )
}

export default WhatsappIcon
