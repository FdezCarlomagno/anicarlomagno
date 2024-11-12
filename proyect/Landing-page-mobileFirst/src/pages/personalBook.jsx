import React, { useState, useEffect } from 'react'
import './pagesStyles/personalBook.css'
import PaintingSlider from '../components/paintingsSlider'
import imgs_Libro_Colorear from '../objects/libro-colorear.jsx';
import imgs_Libro_Miradas from '../objects/libro-miradas.jsx';

const personalBook = () => {

    const handleSubmit = (e, item) => {
        e.preventDefault()
        const message = `Hola! Ani, me gustaria encargarte tu ${item}. Muchas gracias!`

        const whatsappURL = `https://api.whatsapp.com/send?phone=542494245966&text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    }

    return (
        <div>
            <div className="titleBg">
                <h1 className='myPaintingsTitle'>Libros</h1>
            </div>
            <main className="personalBook">

                <div className='personalBook-container'>
                    <div className='personalBook-img-container'>
                        <div className='personalBook-price'><h4>${16900}</h4></div>
                        <PaintingSlider paintings={imgs_Libro_Miradas} />
                    </div>
                    <h2><button className="buy-book-btn" onClick={(e) => handleSubmit(e, "Libro de relatos")}>COMPRAR</button></h2>
                </div>
                <section className='section-agendaText'>
                    <div className='section-agendaText-container'>
                        <h3>"Miradas que narran"</h3>
                        <div className='section-agendaText-flex-column'>
                            <p>
                                Aquí encontrarás relatos de una <span>mujer apasionada</span>, escritos a partir de cada vivencia transitada.
                            </p>
                            <p>
                                Cuando lo tengas en tus manos tambien serán tus relatos, porque seguramente, en alguna de mis frases, en las mujeres que pinto, en las mujeres que elegí para que colorees, o en las palabras que escribí, hay <span>algo de vos</span>.
                            </p>
                            <div>
                                <p>
                                    <strong>Consultá promos <span>comprando</span> más de un producto.</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <main className="personalBook section2">
                <div className='personalBook-container'>
                    <div className='personalBook-img-container'>
                        <div className='personalBook-price'><h4>$17000</h4></div>
                        <PaintingSlider paintings={imgs_Libro_Colorear} />
                    </div>
                    <h2><button className="buy-book-btn" onClick={(e) => handleSubmit(e, "Libro para colorear")}>COMPRAR</button></h2>
                </div>
                <section className='section-agendaText'>
                    <div className='section-agendaText-container'>
                        <h3>"Miradas que narran (para colorear)"</h3>
                        <div className="section-agendaText-flex-column">
                            <p>
                                Como artista plástica, siempre he creído en el poder transformador de <span>colorear</span>. Es un acto que va más allá de aplicar pigmento sobre una superficie; es un viaje hacia el <span>alma</span> misma. Cada trazo, cada elección de color, es una forma de <span>expresión</span> única que me permite conectar con mi interior y con el mundo que me rodea.
                            </p>
                            <p>
                                Transitar este mágico mundo de la <span>creatividad</span> me ha enseñado que no hay límites para lo que podemos imaginar y crear. Cada obra es una oportunidad para explorar nuevas formas de ver y sentir, y al compartirla, invito a los demás a sumergirse en este universo lleno de <span>emoción</span> y <span>libertad</span>.
                            </p>
                        </div>

                    </div>
                </section>
            </main>
        </div>
    )
}

export default personalBook